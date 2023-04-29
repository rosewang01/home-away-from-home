import {sqlQuery} from "../utils/sql.js";
import type IState from "../models/state.model.js";
import {redisGet, redisSet} from "../utils/redis.js";

const addSimilarStates = (states: IState[]): IState[] => {
  const sortedStates = states.sort((a, b) => b.num_jobs - a.num_jobs);
  return states.map((state: IState) => {
    let index = Math.max(sortedStates.findIndex((s) => s.state_code === state.state_code) - 2, 0);
    while (state.similar_states.length < 3 && index < sortedStates.length - 1) {
      const similarState = sortedStates[index];
      if (similarState.state_code !== state.state_code) {
        state.similar_states.push(similarState.state_code);
      }

      index++;
    }
    return state;
  })
}

const getAllStates = async (): Promise<IState[]> => {
  const cached = await redisGet("states/all");
  if (cached != null) {
    return JSON.parse(cached) as IState[];
  }

  const statesRaw = await sqlQuery(`
  WITH zip_code_housing_data (zip_code, average_housing_price, average_housing_price_growth) AS (
    SELECT zip_code, AVG(median_sale_price), AVG(median_sale_price_yoy) FROM housing_data
    GROUP BY zip_code
  ), state_housing_data (state_code, average_housing_price, average_housing_price_growth) AS (
    SELECT zc.metro_region_state_code, AVG(zchd.average_housing_price), AVG(zchd.average_housing_price_growth) FROM zip_code zc
    JOIN zip_code_housing_data zchd ON zc.zip_code = zchd.zip_code
    GROUP BY zc.metro_region_state_code
  ), successful_job_data (state_code, salary, job_title, emp_name) AS (
    SELECT work_state, prevailing_yearly_wage AS average_salary, job_title, emp_name FROM h1b_case
    WHERE case_status = 'C'
  ), group_job_data (state_code, num_jobs, average_salary) AS (
    SELECT state_code, COUNT(*), AVG(salary) FROM successful_job_data
    GROUP BY state_code
  ), total_job_data(state_code, num_jobs) AS (
    SELECT work_state, COUNT(*)
    FROM h1b_case
    GROUP BY work_state
  ), top_jobs (state_code, top_jobs) AS (
    SELECT state_code, GROUP_CONCAT(job_title ORDER BY job_counts.number_rank SEPARATOR ';') AS top_jobs FROM (
      SELECT state_code, job_title, ROW_NUMBER() over (PARTITION BY state_code ORDER BY COUNT(job_title) DESC) AS number_rank FROM successful_job_data
      GROUP BY state_code, job_title
    ) AS job_counts
    WHERE job_counts.number_rank <= 3
    GROUP BY state_code
  ), top_employers (state_code, top_emps) AS (
    SELECT state_code, GROUP_CONCAT(emp_name ORDER BY emp_counts.number_rank SEPARATOR ';') AS top_emps FROM (
      SELECT state_code, emp_name, ROW_NUMBER() over (PARTITION BY state_code ORDER BY COUNT(emp_name) DESC) AS number_rank FROM successful_job_data
      GROUP BY state_code, emp_name
    ) AS emp_counts
    WHERE emp_counts.number_rank <= 3
    GROUP BY state_code
  ), state_job_data (state_code, num_jobs, average_salary, top_jobs, top_employers, h1b_volume, h1b_success_rate) AS (
    SELECT s.state_code, sjd.num_jobs, sjd.average_salary, tj.top_jobs, te.top_emps, tjd.num_jobs, sjd.num_jobs / tjd.num_jobs FROM state s
    JOIN group_job_data sjd ON s.state_code = sjd.state_code
    JOIN total_job_data tjd ON s.state_code = tjd.state_code
    JOIN top_jobs tj ON s.state_code = tj.state_code
    JOIN top_employers te ON s.state_code = te.state_code
  )
  SELECT s.state_code, state_name, average_housing_price, average_housing_price_growth, num_jobs, average_salary, top_jobs, top_employers, h1b_volume, h1b_success_rate FROM state s
  LEFT OUTER JOIN state_housing_data shd ON s.state_code = shd.state_code
  LEFT OUTER JOIN state_job_data sjd ON s.state_code = sjd.state_code
  `);

  const processedStates = addSimilarStates(statesRaw as IState[]);

  await redisSet("states/all", JSON.stringify(processedStates));

  return processedStates;
};

const getStatesWithJobFilter = async (jobFilter: string): Promise<IState[]> => {
  const cached = await redisGet(`states/job/${jobFilter}`);
  if (cached != null) {
    return JSON.parse(cached) as IState[];
  }

  const statesRaw = await sqlQuery(`
  WITH zip_code_housing_data (zip_code, average_housing_price, average_housing_price_growth) AS (
    SELECT zip_code, AVG(median_sale_price), AVG(median_sale_price_yoy) FROM housing_data
    GROUP BY zip_code
  ), state_housing_data (state_code, average_housing_price, average_housing_price_growth) AS (
    SELECT zc.metro_region_state_code, AVG(zchd.average_housing_price), AVG(zchd.average_housing_price_growth) FROM zip_code zc
    JOIN zip_code_housing_data zchd ON zc.zip_code = zchd.zip_code
    GROUP BY zc.metro_region_state_code
  ), successful_job_data (state_code, salary, job_title, emp_name) AS (
    SELECT work_state, prevailing_yearly_wage AS average_salary, job_title, emp_name FROM h1b_case
    WHERE case_status = 'C' AND job_title LIKE '%${jobFilter}%'
  ), group_job_data (state_code, num_jobs, average_salary) AS (
    SELECT state_code, COUNT(*), AVG(salary) FROM successful_job_data
    GROUP BY state_code
  ), total_job_data(state_code, num_jobs) AS (
    SELECT work_state, COUNT(*)
    FROM h1b_case
    WHERE job_title LIKE '%${jobFilter}%'
    GROUP BY work_state
  ), top_employers (state_code, top_emps) AS (
    SELECT state_code, GROUP_CONCAT(emp_name ORDER BY emp_counts.number_rank SEPARATOR ';') AS top_emps FROM (
    SELECT state_code, emp_name, ROW_NUMBER() over (PARTITION BY state_code ORDER BY COUNT(emp_name) DESC) AS number_rank FROM successful_job_data
    GROUP BY state_code, emp_name
  ) AS emp_counts
    WHERE emp_counts.number_rank <= 3
    GROUP BY state_code
  ), state_job_data (state_code, num_jobs, average_salary, top_employers, h1b_volume, h1b_success_rate) AS (
    SELECT s.state_code, sjd.num_jobs, sjd.average_salary, te.top_emps, tjd.num_jobs, sjd.num_jobs / tjd.num_jobs FROM state s
    JOIN group_job_data sjd ON s.state_code = sjd.state_code
    JOIN total_job_data tjd ON s.state_code = tjd.state_code
    JOIN top_employers te ON s.state_code = te.state_code
  )
  SELECT s.state_code, state_name, average_housing_price, average_housing_price_growth, num_jobs, average_salary, top_employers, h1b_volume, h1b_success_rate FROM state s
  LEFT OUTER JOIN state_housing_data shd ON s.state_code = shd.state_code
  LEFT OUTER JOIN state_job_data sjd ON s.state_code = sjd.state_code;
  `);

  const processedStates = addSimilarStates(statesRaw as IState[]);


  await redisSet(`states/job/${jobFilter}`, JSON.stringify(processedStates));

  return processedStates;
}

const getStatesWithEmployerFilter = async (employerFilter: string): Promise<IState[]> => {
  const cached = await redisGet(`states/employer/${employerFilter}`);
  if (cached != null) {
    return JSON.parse(cached) as IState[];
  }

  const statesRaw = await sqlQuery(`
    WITH zip_code_housing_data (zip_code, average_housing_price, average_housing_price_growth) AS (
      SELECT zip_code, AVG(median_sale_price), AVG(median_sale_price_yoy) FROM housing_data
      GROUP BY zip_code
  ), state_housing_data (state_code, average_housing_price, average_housing_price_growth) AS (
      SELECT zc.metro_region_state_code, AVG(zchd.average_housing_price), AVG(zchd.average_housing_price_growth) FROM zip_code zc
      JOIN zip_code_housing_data zchd ON zc.zip_code = zchd.zip_code
      GROUP BY zc.metro_region_state_code
  ), successful_job_data (state_code, salary, job_title, emp_name) AS (
      SELECT work_state, prevailing_yearly_wage AS average_salary, job_title, emp_name FROM h1b_case
      WHERE case_status = 'C' AND emp_name LIKE '%${employerFilter.toUpperCase()}%'
  ), group_job_data (state_code, num_jobs, average_salary) AS (
      SELECT state_code, COUNT(*), AVG(salary) FROM successful_job_data
      GROUP BY state_code
  ), total_job_data(state_code, num_jobs) AS (
      SELECT work_state, COUNT(*)
      FROM h1b_case
      WHERE emp_name LIKE '%${employerFilter.toUpperCase()}%'
      GROUP BY work_state
  ), top_jobs (state_code, top_jobs) AS (
      SELECT state_code, GROUP_CONCAT(job_title ORDER BY job_counts.number_rank SEPARATOR ';') AS top_jobs FROM (
      SELECT state_code, job_title, ROW_NUMBER() over (PARTITION BY state_code ORDER BY COUNT(job_title) DESC) AS number_rank FROM successful_job_data
      GROUP BY state_code, job_title
  ) AS job_counts
      WHERE job_counts.number_rank <= 3
      GROUP BY state_code
  ), state_job_data (state_code, num_jobs, average_salary, top_jobs, h1b_volume, h1b_success_rate) AS (
      SELECT s.state_code, sjd.num_jobs, sjd.average_salary, tj.top_jobs, tjd.num_jobs, sjd.num_jobs / tjd.num_jobs FROM state s
      JOIN group_job_data sjd ON s.state_code = sjd.state_code
      JOIN total_job_data tjd ON s.state_code = tjd.state_code
      JOIN top_jobs tj ON s.state_code = tj.state_code
  )
  SELECT s.state_code, state_name, average_housing_price, average_housing_price_growth, num_jobs, average_salary, top_jobs, h1b_volume, h1b_success_rate FROM state s
  LEFT OUTER JOIN state_housing_data shd ON s.state_code = shd.state_code
  LEFT OUTER JOIN state_job_data sjd ON s.state_code = sjd.state_code;
  `);

  const processedStates = addSimilarStates(statesRaw as IState[]);


  await redisSet(`states/employer/${employerFilter}`, JSON.stringify(processedStates));

  return processedStates;
}

export { getAllStates, getStatesWithEmployerFilter, getStatesWithJobFilter };
