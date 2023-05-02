import { sqlQuery } from "../utils/sql.js";
import type IEmployer from "../models/employer.model.js";
import type IJobCount from "../models/jobCount.model.js";
import type ICityCount from "../models/cityCount.model.js";
import {redisGet, redisSet} from "../utils/redis.js";

const getAllEmployersData = async (): Promise<IEmployer[]> => {
    const cached = await redisGet(`employers/all`);
    if (cached != null) {
        return JSON.parse(cached) as IEmployer[];
    }

    const employersRaw = await sqlQuery(`
        SELECT
            emp_name AS employer_name,
            COUNT(CASE WHEN case_status = 'C' THEN 1 END) / COUNT(*) AS success_rate,
            AVG(prevailing_yearly_wage) AS average_salary
        FROM h1b_case
        GROUP BY emp_name
        HAVING COUNT(*) >= 100
        ORDER BY success_rate DESC, avg_salary DESC;
    `);

    await redisSet(`employers/all`, JSON.stringify(employersRaw));
    return employersRaw as IEmployer[];
};

const getBestJobsByEmployerData = async (employer_name: string): Promise<IJobCount[]> => {
    const cached = await redisGet(`employers/${employer_name}/jobs`);
    if (cached != null) {
        return JSON.parse(cached) as IJobCount[];
    }

    const employersRaw = await sqlQuery(`
        SELECT job_title AS job_name, COUNT(*) AS count
        FROM h1b_case
        WHERE emp_name LIKE '%${employer_name.toUpperCase}%'
        GROUP BY job_title
        ORDER BY count DESC
        LIMIT 5;
    `);

    await redisSet(`employers/${employer_name}/jobs`, JSON.stringify(employersRaw));
    return employersRaw as IJobCount[];
};

const getBestCitiesByEmployerData = async (employer_name: string): Promise<ICityCount[]> => {
    const cached = await redisGet(`employers/${employer_name}/cities`);
    if (cached != null) {
        return JSON.parse(cached) as ICityCount[];
    }
    const employersRaw = await sqlQuery(`
        SELECT work_city AS city_name, work_state AS city_state_code, COUNT(*) AS count
        FROM h1b_case
        WHERE emp_name LIKE '%${employer_name.toUpperCase}%'
        GROUP BY work_city, work_state
        ORDER BY count DESC
        LIMIT 5;
    `);

    await redisSet(`employers/${employer_name}/cities`, JSON.stringify(employersRaw));
    return employersRaw as ICityCount[];
};

export { getAllEmployersData, getBestJobsByEmployerData, getBestCitiesByEmployerData }