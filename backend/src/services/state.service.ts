import {sqlQuery} from "../utils/sql.js";
import type IState from "../models/state.model.js";
import {redisGet, redisSet} from "../utils/redis.js";
import { toTitleCase } from "../utils/titleCase.js";

/**
 * Fills in the "Related States" field by finding states that follow the outputted states in sorted order
 * @param states 
 * @returns appends similar/related states to the IStates[]
 */
const addSimilarStates = (states: IState[]): IState[] => {
  const sortedStates = states.sort((a, b) => b.h1b_volume - a.h1b_volume);
  return states.map((state: IState) => {
    let index = Math.max(sortedStates.findIndex((s) => s.state_code === state.state_code) - 2, 0);
    if (state.similar_states === undefined) {
      state.similar_states = [];
    }
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

/**
 * Gets all states in the country
 * @returns all summary statistics for each state
 * Summary Statistics: 
 * { state_name, 
 *   average_housing_price, 
 *   average_housing_price_growth, 
 *   h1b_volume,
 *   h1b_success_rate, 
 *   average_salary, 
 *   top_jobs,
 *   top_employers }
 */

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
  ), job_data (state_code, job_title, average_salary, num_jobs, h1b_success_rate) AS (
      SELECT work_state,job_title, AVG(prevailing_yearly_wage),COUNT(IF(case_status = 'C', 1, NULL)),COUNT(IF(case_status = 'C', 1, NULL)) / COUNT(*)FROM h1b_case
      GROUP BY work_state, job_title
  ), total_job_data(state_code, h1b_volume, h1b_success_rate, average_salary) AS (
      SELECT work_state, COUNT(*), COUNT(IF(case_status = 'C', 1, NULL))/COUNT(*), AVG(prevailing_yearly_wage)
      FROM h1b_case
      GROUP BY work_state
  ), top_jobs (state_code, top_jobs) AS (
      SELECT state_code, GROUP_CONCAT(CONCAT(job_title, ' (', ROUND(average_salary), ', ', ROUND(h1b_success_rate * 100), '%)') ORDER BY num_jobs DESC SEPARATOR '; ') AS top_jobs FROM (
          SELECT jd.state_code, jd.job_title, jd.num_jobs, jd.average_salary, jd.h1b_success_rate, ROW_NUMBER() over (PARTITION BY jd.state_code ORDER BY jd.num_jobs DESC) AS number_rank FROM job_data jd
      ) AS job_counts
      WHERE job_counts.number_rank <= 3
      GROUP BY state_code
  ), emp_data (state_code, emp_name, average_salary, num_jobs, h1b_success_rate) AS (
      SELECT work_state, emp_name, AVG(prevailing_yearly_wage),COUNT(IF(case_status = 'C', 1, NULL)),COUNT(IF(case_status = 'C', 1, NULL)) / COUNT(*)FROM h1b_case
      GROUP BY work_state, emp_name
  ), top_employers (state_code, top_emps) AS (
      SELECT state_code, GROUP_CONCAT(CONCAT(emp_name, ' (', ROUND(average_salary), ', ', ROUND(h1b_success_rate * 100), '%)') ORDER BY num_jobs DESC SEPARATOR '; ') AS top_emps FROM (
          SELECT ed.state_code, ed.emp_name, ed.num_jobs, ed.average_salary, ed.h1b_success_rate, ROW_NUMBER() over (PARTITION BY ed.state_code ORDER BY ed.num_jobs DESC) AS number_rank FROM emp_data ed
      ) AS emp_counts
      WHERE emp_counts.number_rank <= 3
      GROUP BY state_code
  ), state_final_data (state_code, h1b_volume, h1b_success_rate, average_salary, top_jobs, top_employers) AS (
      SELECT tjd.state_code, tjd.h1b_volume, tjd.h1b_success_rate, tjd.average_salary, tj.top_jobs, te.top_emps
      FROM total_job_data tjd
        JOIN top_jobs tj ON tjd.state_code = tj.state_code
        JOIN top_employers te ON tjd.state_code = te.state_code
  )

  SELECT shd.state_code, s.state_name, average_housing_price, average_housing_price_growth, sfd.h1b_volume, sfd.h1b_success_rate, sfd.average_salary, sfd.top_jobs, sfd.top_employers FROM state_housing_data shd
    JOIN state_final_data sfd ON shd.state_code = sfd.state_code
    JOIN state s ON shd.state_code = s.state_code;
  `);

  const processedStates = addSimilarStates(statesRaw as IState[]);

  await redisSet("states/all", JSON.stringify(processedStates));

  return processedStates;
};

/**
 * Gets all states in the country, filtered by a given job
 * @param jobFilter
 * @returns all summary statistics for each state
 * Summary Statistics: 
 * { state_name, 
 *   average_housing_price, 
 *   average_housing_price_growth, 
 *   h1b_volume,
 *   h1b_success_rate, 
 *   average_salary, 
 *   top_employers }
 */

const getStatesWithJobFilter = async (jobFilter: string): Promise<IState[]> => {
  const cached = await redisGet(`states/job/${toTitleCase(jobFilter)}`);
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
  ), total_job_data(state_code, h1b_volume, h1b_success_rate, average_salary) AS (
      SELECT work_state, COUNT(*), COUNT(IF(case_status = 'C', 1, NULL))/COUNT(*), AVG(prevailing_yearly_wage)
      FROM h1b_case
      WHERE job_title LIKE '%${toTitleCase(jobFilter)}%'
      GROUP BY work_state
  ), emp_data (state_code, emp_name, average_salary, num_jobs, h1b_success_rate) AS (
      SELECT work_state, emp_name, AVG(prevailing_yearly_wage),COUNT(IF(case_status = 'C', 1, NULL)),COUNT(IF(case_status = 'C', 1, NULL)) / COUNT(*)
      FROM h1b_case
      WHERE job_title LIKE '%${toTitleCase(jobFilter)}%'
      GROUP BY work_state, emp_name
  ), top_employers (state_code, top_emps) AS (
      SELECT state_code, GROUP_CONCAT(CONCAT(emp_name, ' (', ROUND(average_salary), ', ', ROUND(h1b_success_rate * 100), '%)') ORDER BY num_jobs DESC SEPARATOR '; ') AS top_emps FROM (
          SELECT ed.state_code, ed.emp_name, ed.num_jobs, ed.average_salary, ed.h1b_success_rate, ROW_NUMBER() over (PARTITION BY ed.state_code ORDER BY ed.num_jobs DESC) AS number_rank FROM emp_data ed
      ) AS emp_counts
      WHERE emp_counts.number_rank <= 3
      GROUP BY state_code
  ), state_final_data (state_code, h1b_volume, h1b_success_rate, average_salary, top_employers) AS (
      SELECT tjd.state_code, tjd.h1b_volume, tjd.h1b_success_rate, tjd.average_salary, te.top_emps
      FROM total_job_data tjd
        JOIN top_employers te ON tjd.state_code = te.state_code
  )

  SELECT shd.state_code, s.state_name, average_housing_price, average_housing_price_growth, sfd.h1b_volume, sfd.h1b_success_rate, sfd.average_salary, sfd.top_employers FROM state_housing_data shd
    JOIN state_final_data sfd ON shd.state_code = sfd.state_code
    JOIN state s ON shd.state_code = s.state_code
  `);

  const processedStates = addSimilarStates(statesRaw as IState[]);

  await redisSet(`states/job/${toTitleCase(jobFilter)}`, JSON.stringify(processedStates));

  return processedStates;
}

/**
 * Gets all states in the country, filtered by a given employer
 * @param employerFilter
 * @returns all summary statistics for each state
 * Summary Statistics: 
 * { state_name, 
 *   average_housing_price, 
 *   average_housing_price_growth, 
 *   h1b_volume,
 *   h1b_success_rate, 
 *   average_salary, 
 *   top_jobs }
 */

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
  ), job_data (state_code, job_title, average_salary, num_jobs, h1b_success_rate) AS (
      SELECT work_state,job_title, AVG(prevailing_yearly_wage),COUNT(IF(case_status = 'C', 1, NULL)),COUNT(IF(case_status = 'C', 1, NULL)) / COUNT(*)
      FROM h1b_case
      WHERE emp_name LIKE '%${employerFilter.toUpperCase()}%'
      GROUP BY work_state, job_title
  ), total_job_data(state_code, h1b_volume, h1b_success_rate, average_salary) AS (
      SELECT work_state, COUNT(*), COUNT(IF(case_status = 'C', 1, NULL))/COUNT(*), AVG(prevailing_yearly_wage)
      FROM h1b_case
      WHERE emp_name LIKE '%${employerFilter.toUpperCase()}%'
      GROUP BY work_state
  ), top_jobs (state_code, top_jobs) AS (
      SELECT state_code, GROUP_CONCAT(CONCAT(job_title, ' (', ROUND(average_salary), ', ', ROUND(h1b_success_rate * 100), '%)') ORDER BY num_jobs DESC SEPARATOR '; ') AS top_jobs FROM (
          SELECT jd.state_code, jd.job_title, jd.num_jobs, jd.average_salary, jd.h1b_success_rate, ROW_NUMBER() over (PARTITION BY jd.state_code ORDER BY jd.num_jobs DESC) AS number_rank FROM job_data jd
      ) AS job_counts
      WHERE job_counts.number_rank <= 3
      GROUP BY state_code
  ), state_final_data (state_code, h1b_volume, h1b_success_rate, average_salary, top_jobs) AS (
      SELECT tjd.state_code, tjd.h1b_volume, tjd.h1b_success_rate, tjd.average_salary, tj.top_jobs
      FROM total_job_data tjd
        JOIN top_jobs tj ON tjd.state_code = tj.state_code
  )

  SELECT shd.state_code, s.state_name, average_housing_price, average_housing_price_growth, sfd.h1b_volume, sfd.h1b_success_rate, sfd.average_salary, sfd.top_jobs FROM state_housing_data shd
    JOIN state_final_data sfd ON shd.state_code = sfd.state_code
    JOIN state s ON shd.state_code = s.state_code
  `);

  const processedStates = addSimilarStates(statesRaw as IState[]);

  await redisSet(`states/employer/${employerFilter}`, JSON.stringify(processedStates));

  return processedStates;
}

export { getAllStates, getStatesWithEmployerFilter, getStatesWithJobFilter };
