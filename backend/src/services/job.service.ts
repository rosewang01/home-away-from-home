import { sqlQuery } from "../utils/sql.js";
import type IJob from "../models/job.model.js";
import type IEmployerCount from "../models/employerCount.model.js";
import type ICityCount from "../models/cityCount.model.js";
import {redisGet, redisSet} from "../utils/redis.js";

const getAllJobsData = async (): Promise<IJob[]> => {
    const cached = await redisGet(`jobs/all`);
    if (cached != null) {
        return JSON.parse(cached) as IJob[];
    }

    const jobsRaw = await sqlQuery(`
        SELECT
            job_title AS job_name,
            COUNT(CASE WHEN case_status = 'C' THEN 1 END) / COUNT(*) AS success_rate,
            AVG(prevailing_yearly_wage) AS average_salary
        FROM h1b_case
        GROUP BY job_title
        HAVING COUNT(*) >= 100
        ORDER BY success_rate DESC, avg_salary DESC
        LIMIT 10;
    `);

    await redisSet(`jobs/all`, JSON.stringify(jobsRaw));
    return jobsRaw as IJob[];
};

const getBestEmployersByJobData = async (job_name: string): Promise<IEmployerCount[]> => {
    const cached = await redisGet(`jobs/${job_name}/employers`);
    if (cached != null) {
        return JSON.parse(cached) as IEmployerCount[];
    }

    const jobsRaw = await sqlQuery(`
        SELECT emp_name AS employer_name, COUNT(*) AS count
        FROM h1b_case
        WHERE job_title LIKE '%${job_name}%'
        GROUP BY employer
        ORDER BY count DESC
        LIMIT 5;
    `);

    await redisSet(`jobs/${job_name}/employers`, JSON.stringify(jobsRaw));
    return jobsRaw as IEmployerCount[];
};

const getBestCitiesByJobData = async (job_name: string): Promise<ICityCount[]> => {
    const cached = await redisGet(`jobs/${job_name}/cities`);
    if (cached != null) {
        return JSON.parse(cached) as ICityCount[];
    }

    const jobsRaw = await sqlQuery(`
        SELECT work_city AS city_name, work_state AS city_state_code, COUNT(*) AS count
        FROM h1b_case
        WHERE job_title LIKE '%${job_name}%'
        GROUP BY work_city, work_state
        ORDER BY count DESC
        LIMIT 5;
    `);

    await redisSet(`jobs/${job_name}/cities`, JSON.stringify(jobsRaw));
    return jobsRaw as ICityCount[];
};

export { getAllJobsData, getBestEmployersByJobData, getBestCitiesByJobData }