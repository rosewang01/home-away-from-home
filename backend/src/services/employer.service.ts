import { sqlQuery } from "../utils/sql.js";
import type IEmployer from "../models/employer.model.js";
import type IJobCount from "../models/jobCount.model.js";
import type ICityCount from "../models/cityCount.model.js";
import {redisGet, redisSet} from "../utils/redis.js";

/**
 * gets data on all employers
 * @returns employers in sorted order of success rate and average salary 
 * Summary Statistics: 
 * { h1b_success_rate, 
 *   average_salary }
 */

const getAllEmployersData = async (): Promise<IEmployer[]> => {
    const cached = await redisGet(`employers/all`);
    if (cached != null) {
        return JSON.parse(cached) as IEmployer[];
    }

    const employersRaw = await sqlQuery(`
        SELECT
            emp_name AS employer_name,
            COUNT(CASE WHEN case_status = 'C' THEN 1 END) / COUNT(*) AS h1b_success_rate,
            AVG(prevailing_yearly_wage) AS average_salary
        FROM h1b_case
        GROUP BY emp_name
        HAVING COUNT(*) >= 100
        ORDER BY h1b_success_rate DESC, average_salary DESC;
    `);

    await redisSet(`employers/all`, JSON.stringify(employersRaw));
    return employersRaw as IEmployer[];
};

/**
 * gets the best jobs for a given employer
 * @param employer_name
 * @returns jobs in sorted order of frequency
 */

const getBestJobsByEmployerData = async (employer_name: string): Promise<IJobCount[]> => {
    const cached = await redisGet(`employers/${employer_name.toUpperCase()}/jobs`);
    if (cached != null) {
        return JSON.parse(cached) as IJobCount[];
    }

    const employersRaw = await sqlQuery(`
        SELECT job_title AS job_name, COUNT(*) AS count
        FROM h1b_case
        WHERE emp_name LIKE '%${employer_name.toUpperCase()}%'
        GROUP BY job_title
        ORDER BY count DESC
        LIMIT 5;
    `);

    await redisSet(`employers/${employer_name.toUpperCase()}/jobs`, JSON.stringify(employersRaw));
    return employersRaw as IJobCount[];
};

/**
 * gets the best cities for a given employer
 * @param employer_name
 * @returns cities in sorted order of frequency
 */

const getBestCitiesByEmployerData = async (employer_name: string): Promise<ICityCount[]> => {
    const cached = await redisGet(`employers/${employer_name.toUpperCase()}/cities`);
    if (cached != null) {
        return JSON.parse(cached) as ICityCount[];
    }
    const employersRaw = await sqlQuery(`
        SELECT work_city AS city_name, work_state AS city_state_code, COUNT(*) AS count
        FROM h1b_case
        WHERE emp_name LIKE '%${employer_name.toUpperCase()}%'
        GROUP BY work_city, work_state
        ORDER BY count DESC
        LIMIT 5;
    `);

    await redisSet(`employers/${employer_name.toUpperCase()}/cities`, JSON.stringify(employersRaw));
    return employersRaw as ICityCount[];
};

export { getAllEmployersData, getBestJobsByEmployerData, getBestCitiesByEmployerData }