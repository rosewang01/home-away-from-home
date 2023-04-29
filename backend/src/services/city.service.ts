import {redisGet, redisSet} from "../utils/redis.js";
import type ICity from "../models/city.model.js";
import {sqlQuery} from "../utils/sql.js";

const addSimilarCities = (cities: ICity[]): ICity[] => {
  const sortedCities = cities.sort((a, b) => b.num_jobs - a.num_jobs);
  return cities.map((city: ICity) => {
    let index = Math.max(sortedCities.findIndex((c) => c.city_name === city.city_name) - 2, 0);
    while (city.similar_cities.length < 3 && index < sortedCities.length - 1) {
      const similarCity = sortedCities[index];
      if (similarCity.city_name !== city.city_name) {
        city.similar_cities.push(similarCity.city_name);
      }

      index++;
    }
    return city;
  })
}

const getAllCities = async (stateCode: string): Promise<ICity[]> => {
  const cached = await redisGet(`cities/${stateCode}/all`);
  if (cached != null) {
    return JSON.parse(cached) as ICity[];
  }
  
  const rawCities = await sqlQuery(`
    WITH zip_code_housing_data (zip_code, average_housing_price, average_housing_price_growth) AS (
      SELECT zip_code, AVG(median_sale_price), AVG(median_sale_price_yoy) FROM housing_data
      GROUP BY zip_code
  ), metro_region_housing_data (metro_region, average_housing_price, average_housing_price_growth) AS (
      SELECT zc.metro_region, AVG(zchd.average_housing_price), AVG(zchd.average_housing_price_growth) FROM zip_code zc
      JOIN zip_code_housing_data zchd ON zc.zip_code = zchd.zip_code
      WHERE zc.metro_region_state_code = '${stateCode}'
      GROUP BY zc.metro_region
  ), successful_job_data (metro_region, salary, job_title, emp_name) AS (
      SELECT metro_region, prevailing_yearly_wage AS average_salary, job_title, emp_name FROM h1b_case
      JOIN city c on c.state_code = h1b_case.work_state and c.city_name = h1b_case.work_city
      WHERE case_status = 'C' AND metro_region_state_code = '${stateCode}'
  ), group_job_data (metro_region, num_jobs, average_salary) AS (
      SELECT metro_region, COUNT(*), AVG(salary) FROM successful_job_data
      GROUP BY metro_region
  ), total_job_data(metro_region, num_jobs) AS (
      SELECT metro_region, COUNT(*)
      FROM h1b_case
      JOIN city c on c.state_code = h1b_case.work_state and c.city_name = h1b_case.work_city
      WHERE metro_region_state_code = '${stateCode}'
      GROUP BY metro_region
  ), top_jobs (metro_region, top_jobs) AS (
      SELECT metro_region, GROUP_CONCAT(job_title ORDER BY job_counts.number_rank SEPARATOR ';') AS top_jobs FROM (
          SELECT metro_region, job_title, ROW_NUMBER() over (PARTITION BY metro_region ORDER BY COUNT(job_title) DESC) AS number_rank FROM successful_job_data
          GROUP BY metro_region, job_title
      ) AS job_counts
      WHERE job_counts.number_rank <= 3
      GROUP BY metro_region
  ), top_employers (state_code, top_emps) AS (
          SELECT metro_region, GROUP_CONCAT(emp_name ORDER BY emp_counts.number_rank SEPARATOR ';') AS top_emps FROM (
          SELECT metro_region, emp_name, ROW_NUMBER() over (PARTITION BY metro_region ORDER BY COUNT(emp_name) DESC) AS number_rank FROM successful_job_data
          GROUP BY metro_region, emp_name
      ) AS emp_counts
      WHERE emp_counts.number_rank <= 3
      GROUP BY metro_region
  ), metro_region_job_data (metro_region, num_jobs, average_salary, top_jobs, top_employers, h1b_volume, h1b_success_rate) AS (
      SELECT tjd.metro_region, sjd.num_jobs, sjd.average_salary, tj.top_jobs, te.top_emps, tjd.num_jobs, sjd.num_jobs / tjd.num_jobs FROM total_job_data tjd
      JOIN group_job_data sjd ON tjd.metro_region = sjd.metro_region
      JOIN top_jobs tj ON tjd.metro_region= tj.metro_region
      JOIN top_employers te ON tjd.metro_region = te.state_code
  )
  SELECT mhd.metro_region, average_housing_price, average_housing_price_growth, num_jobs, average_salary, top_jobs, top_employers, h1b_volume, h1b_success_rate FROM metro_region_housing_data mhd
  JOIN metro_region_job_data sjd ON mhd.metro_region = sjd.metro_region;
`);

  const processedCities = addSimilarCities(rawCities as ICity[]).map((city: ICity) => ({
      ...city,
      state_code: stateCode,
    }
  ));

  await redisSet(`cities/${stateCode}/all`, JSON.stringify(processedCities));
  return processedCities;
}

const getCitiesWithJobFilter = async (stateCode: string, jobFilter: string): Promise<ICity[]> => {
  const cached = await redisGet(`cities/${stateCode}/jobs/${jobFilter}`);
  if (cached != null) {
    return JSON.parse(cached) as ICity[];
  }

  const rawCities = await sqlQuery(`
      WITH zip_code_housing_data (zip_code, average_housing_price, average_housing_price_growth) AS (
      SELECT zip_code, AVG(median_sale_price), AVG(median_sale_price_yoy) FROM housing_data
      GROUP BY zip_code
  ), metro_region_housing_data (metro_region, average_housing_price, average_housing_price_growth) AS (
      SELECT zc.metro_region, AVG(zchd.average_housing_price), AVG(zchd.average_housing_price_growth) FROM zip_code zc
      JOIN zip_code_housing_data zchd ON zc.zip_code = zchd.zip_code
      WHERE zc.metro_region_state_code = '${stateCode}'
      GROUP BY zc.metro_region
  ), successful_job_data (metro_region, salary, job_title, emp_name) AS (
      SELECT metro_region, prevailing_yearly_wage AS average_salary, job_title, emp_name FROM h1b_case
      JOIN city c on c.state_code = h1b_case.work_state and c.city_name = h1b_case.work_city
      WHERE case_status = 'C' AND metro_region_state_code = '${stateCode}' AND job_title LIKE '%${jobFilter}%'
  ), group_job_data (metro_region, num_jobs, average_salary) AS (
      SELECT metro_region, COUNT(*), AVG(salary) FROM successful_job_data
      GROUP BY metro_region
  ), total_job_data(metro_region, num_jobs) AS (
      SELECT metro_region, COUNT(*)
      FROM h1b_case
      JOIN city c on c.state_code = h1b_case.work_state and c.city_name = h1b_case.work_city
      WHERE metro_region_state_code = '${stateCode}' AND job_title LIKE '%${jobFilter}%'
      GROUP BY metro_region
  ), top_employers (state_code, top_emps) AS (
          SELECT metro_region, GROUP_CONCAT(emp_name ORDER BY emp_counts.number_rank SEPARATOR ';') AS top_emps FROM (
          SELECT metro_region, emp_name, ROW_NUMBER() over (PARTITION BY metro_region ORDER BY COUNT(emp_name) DESC) AS number_rank FROM successful_job_data
          GROUP BY metro_region, emp_name
      ) AS emp_counts
      WHERE emp_counts.number_rank <= 3
      GROUP BY metro_region
  ), metro_region_job_data (metro_region, num_jobs, average_salary, top_employers, h1b_volume, h1b_success_rate) AS (
      SELECT tjd.metro_region, sjd.num_jobs, sjd.average_salary, te.top_emps, tjd.num_jobs, sjd.num_jobs / tjd.num_jobs FROM total_job_data tjd
      JOIN group_job_data sjd ON tjd.metro_region = sjd.metro_region
      JOIN top_employers te ON tjd.metro_region = te.state_code
  )
  SELECT mhd.metro_region, average_housing_price, average_housing_price_growth, num_jobs, average_salary, top_employers, h1b_volume, h1b_success_rate FROM metro_region_housing_data mhd
  JOIN metro_region_job_data sjd ON mhd.metro_region = sjd.metro_region;
  `);

  const processedCities = addSimilarCities(rawCities as ICity[]).map((city: ICity) => ({
      ...city,
      state_code: stateCode,
    }
  ));

  await redisSet(`cities/${stateCode}/all`, JSON.stringify(processedCities));
  return processedCities;
}

const getCitiesWithEmployerFilter = async (stateCode: string, employerFilter: string): Promise<ICity[]> => {
  const cached = await redisGet(`cities/${stateCode}/employers/${employerFilter}`);
  if (cached != null) {
    return JSON.parse(cached) as ICity[];
  }

  const rawCities = await sqlQuery(`
    WITH zip_code_housing_data (zip_code, average_housing_price, average_housing_price_growth) AS (
      SELECT zip_code, AVG(median_sale_price), AVG(median_sale_price_yoy) FROM housing_data
      GROUP BY zip_code
  ), metro_region_housing_data (metro_region, average_housing_price, average_housing_price_growth) AS (
      SELECT zc.metro_region, AVG(zchd.average_housing_price), AVG(zchd.average_housing_price_growth) FROM zip_code zc
      JOIN zip_code_housing_data zchd ON zc.zip_code = zchd.zip_code
      WHERE zc.metro_region_state_code = '${stateCode}'
      GROUP BY zc.metro_region
  ), successful_job_data (metro_region, salary, job_title, emp_name) AS (
      SELECT metro_region, prevailing_yearly_wage AS average_salary, job_title, emp_name FROM h1b_case
      JOIN city c on c.state_code = h1b_case.work_state and c.city_name = h1b_case.work_city
      WHERE case_status = 'C' AND metro_region_state_code = '${stateCode}'
  ), group_job_data (metro_region, num_jobs, average_salary) AS (
      SELECT metro_region, COUNT(*), AVG(salary) FROM successful_job_data
      GROUP BY metro_region
  ), total_job_data(metro_region, num_jobs) AS (
      SELECT metro_region, COUNT(*)
      FROM h1b_case
      JOIN city c on c.state_code = h1b_case.work_state and c.city_name = h1b_case.work_city
      WHERE metro_region_state_code = '${stateCode}'
      GROUP BY metro_region
  ), top_jobs (metro_region, top_jobs) AS (
      SELECT metro_region, GROUP_CONCAT(job_title ORDER BY job_counts.number_rank SEPARATOR ';') AS top_jobs FROM (
          SELECT metro_region, job_title, ROW_NUMBER() over (PARTITION BY metro_region ORDER BY COUNT(job_title) DESC) AS number_rank FROM successful_job_data
          GROUP BY metro_region, job_title
      ) AS job_counts
      WHERE job_counts.number_rank <= 3
      GROUP BY metro_region
  ), metro_region_job_data (metro_region, num_jobs, average_salary, top_jobs, h1b_volume, h1b_success_rate) AS (
      SELECT tjd.metro_region, sjd.num_jobs, sjd.average_salary, tj.top_jobs, tjd.num_jobs, sjd.num_jobs / tjd.num_jobs FROM total_job_data tjd
      JOIN group_job_data sjd ON tjd.metro_region = sjd.metro_region
      JOIN top_jobs tj ON tjd.metro_region= tj.metro_region
  )
  SELECT mhd.metro_region, average_housing_price, average_housing_price_growth, num_jobs, average_salary, top_jobs, h1b_volume, h1b_success_rate FROM metro_region_housing_data mhd
  JOIN metro_region_job_data sjd ON mhd.metro_region = sjd.metro_region;
  `);

  const processedCities = addSimilarCities(rawCities as ICity[]).map((city: ICity) => ({
      ...city,
      state_code: stateCode,
  }));

  await redisSet(`cities/${stateCode}/employers/${employerFilter}`, JSON.stringify(processedCities));
  return processedCities;
}

export {
  getAllCities,
  getCitiesWithJobFilter,
  getCitiesWithEmployerFilter,
}