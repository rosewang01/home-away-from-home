import {redisGet, redisSet} from "../utils/redis.js";
import type ICity from "../models/city.model.js";
import {sqlQuery} from "../utils/sql.js";

const addSimilarCities = (cities: ICity[]): ICity[] => {
  const sortedCities = cities.sort((a, b) => b.h1b_volume - a.h1b_volume);
  return cities.map((city: ICity) => {
    let index = Math.max(sortedCities.findIndex((c) => c.city_name === city.city_name) - 2, 0);
    if (city.similar_cities === undefined) {
      city.similar_cities = [];
    }
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
  ), metro_region_job_data (metro_region, salary, job_title, emp_name, case_status) AS (
      SELECT metro_region, prevailing_yearly_wage AS average_salary, job_title, emp_name, case_status FROM h1b_case
      JOIN city c on c.state_code = h1b_case.work_state and c.city_name = h1b_case.work_city
      WHERE metro_region_state_code = '${stateCode}'
  ), job_data (metro_region, job_title, average_salary, num_jobs, h1b_success_rate) AS (
      SELECT metro_region,job_title, AVG(salary),COUNT(IF(case_status = 'C', 1, NULL)),COUNT(IF(case_status = 'C', 1, NULL)) / COUNT(*)FROM metro_region_job_data
      GROUP BY metro_region, job_title
  ), total_job_data(metro_region, h1b_volume, h1b_success_rate, average_salary) AS (
      SELECT metro_region, COUNT(*), COUNT(IF(case_status = 'C', 1, NULL))/COUNT(*), AVG(salary)
      FROM metro_region_job_data
      GROUP BY metro_region
  ), top_jobs (metro_region, top_jobs) AS (
      SELECT metro_region, GROUP_CONCAT(CONCAT(job_title, ' (', ROUND(average_salary), ', ', ROUND(h1b_success_rate * 100), '%)') ORDER BY num_jobs DESC SEPARATOR '; ') AS top_jobs FROM (
          SELECT jd.metro_region, jd.job_title, jd.num_jobs, jd.average_salary, jd.h1b_success_rate, ROW_NUMBER() over (PARTITION BY jd.metro_region ORDER BY jd.num_jobs DESC) AS number_rank FROM job_data jd
      ) AS job_counts
      WHERE job_counts.number_rank <= 3
      GROUP BY metro_region
  ), emp_data (metro_region, emp_name, average_salary, num_jobs, h1b_success_rate) AS (
      SELECT metro_region,emp_name, AVG(salary),COUNT(IF(case_status = 'C', 1, NULL)),COUNT(IF(case_status = 'C', 1, NULL)) / COUNT(*)FROM metro_region_job_data
      GROUP BY metro_region, emp_name
  ), top_employers (metro_region, top_emps) AS (
      SELECT metro_region, GROUP_CONCAT(CONCAT(emp_name, ' (', ROUND(average_salary), ', ', ROUND(h1b_success_rate * 100), '%)') ORDER BY num_jobs DESC SEPARATOR '; ') AS top_emps FROM (
          SELECT ed.metro_region, ed.emp_name, ed.num_jobs, ed.average_salary, ed.h1b_success_rate, ROW_NUMBER() over (PARTITION BY ed.metro_region ORDER BY ed.num_jobs DESC) AS number_rank FROM emp_data ed
      ) AS emp_counts
      WHERE emp_counts.number_rank <= 3
      GROUP BY metro_region
  ), metro_region_final_data (metro_region, h1b_volume, h1b_success_rate, average_salary, top_jobs, top_employers) AS (
      SELECT tjd.metro_region, tjd.h1b_volume, tjd.h1b_success_rate, tjd.average_salary, tj.top_jobs, te.top_emps
      FROM total_job_data tjd
        JOIN top_jobs tj ON tjd.metro_region = tj.metro_region
        JOIN top_employers te ON tjd.metro_region = te.metro_region
  )

  SELECT mhd.metro_region AS city_name, average_housing_price, average_housing_price_growth, sjd.h1b_volume, sjd.h1b_success_rate, sjd.average_salary, sjd.top_jobs, sjd.top_employers FROM metro_region_housing_data mhd
    JOIN metro_region_final_data sjd ON mhd.metro_region = sjd.metro_region;
`);

  const processedCities = addSimilarCities(rawCities as ICity[]).map((city: ICity) => ({
    ...city,
    city_state_code: stateCode,
  }));

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
  ), metro_region_job_data (metro_region, salary, job_title, emp_name, case_status) AS (
      SELECT metro_region, prevailing_yearly_wage AS average_salary, job_title, emp_name, case_status FROM h1b_case
      JOIN city c on c.state_code = h1b_case.work_state and c.city_name = h1b_case.work_city
      WHERE metro_region_state_code = '${stateCode}' AND job_title LIKE '%${jobFilter}%'
  ), total_job_data(metro_region, num_jobs, average_salary) AS (
      SELECT metro_region, COUNT(IF(case_status = 'C', 1, NULL)), AVG(salary)
      FROM metro_region_job_data
      GROUP BY metro_region
  ), emp_data (metro_region, emp_name, average_salary, num_jobs, h1b_success_rate) AS (
      SELECT metro_region,emp_name, AVG(salary),COUNT(IF(case_status = 'C', 1, NULL)),COUNT(IF(case_status = 'C', 1, NULL)) / COUNT(*)FROM metro_region_job_data
      GROUP BY metro_region, emp_name
  ), top_employers (metro_region, top_emps) AS (
      SELECT metro_region, GROUP_CONCAT(CONCAT(emp_name, ' (', ROUND(average_salary), ', ', ROUND(h1b_success_rate * 100), '%)') ORDER BY num_jobs DESC SEPARATOR '; ') AS top_emps FROM (
          SELECT ed.metro_region, ed.emp_name, ed.num_jobs, ed.average_salary, ed.h1b_success_rate, ROW_NUMBER() over (PARTITION BY ed.metro_region ORDER BY ed.num_jobs DESC) AS number_rank FROM emp_data ed
      ) AS emp_counts
      WHERE emp_counts.number_rank <= 3
      GROUP BY metro_region
  ), metro_region_final_data (metro_region, num_jobs, average_salary, top_employers) AS (
      SELECT tjd.metro_region, tjd.num_jobs, tjd.average_salary, te.top_emps
      FROM total_job_data tjd
        JOIN top_employers te ON tjd.metro_region = te.metro_region
  )

  SELECT mhd.metro_region AS city_name, average_housing_price, average_housing_price_growth, sjd.num_jobs, sjd.average_salary, sjd.top_employers FROM metro_region_housing_data mhd
    JOIN metro_region_final_data sjd ON mhd.metro_region = sjd.metro_region;
  `);

  const processedCities = addSimilarCities(rawCities as ICity[]).map((city: ICity) => ({
    ...city,
    city_state_code: stateCode,
  }));

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
  ), metro_region_job_data (metro_region, salary, job_title, emp_name, case_status) AS (
      SELECT metro_region, prevailing_yearly_wage AS average_salary, job_title, emp_name, case_status FROM h1b_case
      JOIN city c on c.state_code = h1b_case.work_state and c.city_name = h1b_case.work_city
      WHERE metro_region_state_code = '${stateCode}' AND emp_name LIKE '%${employerFilter.toUpperCase()}%'
  ), job_data (metro_region, job_title, average_salary, num_jobs, h1b_success_rate) AS (
      SELECT metro_region,job_title, AVG(salary),COUNT(IF(case_status = 'C', 1, NULL)),COUNT(IF(case_status = 'C', 1, NULL)) / COUNT(*)FROM metro_region_job_data
      GROUP BY metro_region, job_title
  ), total_job_data(metro_region, num_jobs, average_salary) AS (
      SELECT metro_region, COUNT(IF(case_status = 'C', 1, NULL)), AVG(salary)
      FROM metro_region_job_data
      GROUP BY metro_region
  ), top_jobs (metro_region, top_jobs) AS (
      SELECT metro_region, GROUP_CONCAT(CONCAT(job_title, ' (', ROUND(average_salary), ', ', ROUND(h1b_success_rate * 100), '%)') ORDER BY num_jobs DESC SEPARATOR '; ') AS top_jobs FROM (
          SELECT jd.metro_region, jd.job_title, jd.num_jobs, jd.average_salary, jd.h1b_success_rate, ROW_NUMBER() over (PARTITION BY jd.metro_region ORDER BY jd.num_jobs DESC) AS number_rank FROM job_data jd
      ) AS job_counts
      WHERE job_counts.number_rank <= 3
      GROUP BY metro_region
  ), metro_region_final_data (metro_region, num_jobs, average_salary, top_jobs) AS (
      SELECT tjd.metro_region, tjd.num_jobs, tjd.average_salary, tj.top_jobs
      FROM total_job_data tjd
        JOIN top_jobs tj ON tjd.metro_region = tj.metro_region
  )

  SELECT mhd.metro_region AS city_name, average_housing_price, average_housing_price_growth, sjd.num_jobs, sjd.average_salary, sjd.top_jobs FROM metro_region_housing_data mhd
    JOIN metro_region_final_data sjd ON mhd.metro_region = sjd.metro_region;
  `);

  const processedCities = addSimilarCities(rawCities as ICity[]).map((city: ICity) => ({
      ...city,
      city_state_code: stateCode,
  }));

  await redisSet(`cities/${stateCode}/employers/${employerFilter}`, JSON.stringify(processedCities));
  return processedCities;
}

export {
  getAllCities,
  getCitiesWithJobFilter,
  getCitiesWithEmployerFilter,
}