import { sqlQuery } from "../utils/sql.js";
import type IJob from "../models/job.model.js";
import IEmployerCount from "../models/employerCount.model.js";
import ICityCount from "../models/cityCount.model.js";

const getAllJobsData = async (): Promise<IJob[]> => {
    const jobsRaw = await sqlQuery(`
        SELECT
            job_title AS job_name,
            COUNT(CASE WHEN case_status = 'C' THEN 1 END) / COUNT(*) AS h1b_success_rate,
            AVG(prevailing_yearly_wage) AS average_salary
        FROM h1b_case
        GROUP BY job_title
        HAVING COUNT(*) >= 100
        ORDER BY success_rate DESC, avg_salary DESC
        LIMIT 10;
    `);
    return jobsRaw as IJob[];
};

const getBestEmployersByJobData = async (job_name: string): Promise<IEmployerCount[]> => {
    const jobsRaw = await sqlQuery(`
        SELECT emp_name AS employer_name, COUNT(*) AS count
        FROM h1b_case
        WHERE job_title LIKE ${job_name}
        GROUP BY employer
        ORDER BY count DESC
        LIMIT 5;
    `);
    return jobsRaw as IEmployerCount[];
};

const getBestCitiesByJobData = async (job_name: string): Promise<ICityCount[]> => {
    const jobsRaw = await sqlQuery(`
        SELECT work_city AS city_name, work_state AS city_state_code, COUNT(*) AS count
        FROM h1b_case
        WHERE job_title LIKE ${job_name}
        GROUP BY work_city, work_state
        ORDER BY count DESC
        LIMIT 5;
    `);
    return jobsRaw as ICityCount[];
};

export { getAllJobsData, getBestEmployersByJobData, getBestCitiesByJobData }