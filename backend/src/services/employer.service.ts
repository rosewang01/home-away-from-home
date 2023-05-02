import { sqlQuery } from "../utils/sql.js";
import type IEmployer from "../models/employer.model.js";
import IJobCount from "../models/jobCount.model.js";
import ICityCount from "../models/cityCount.model.js";

const getAllEmployersData = async (): Promise<IEmployer[]> => {
    const employersRaw = await sqlQuery(`
        SELECT
            emp_name AS employer_name,
            COUNT(CASE WHEN case_status = 'C' THEN 1 END) / COUNT(*) AS h1b_success_rate,
            AVG(prevailing_yearly_wage) AS average_salary
        FROM h1b_case
        GROUP BY emp_name
        HAVING COUNT(*) >= 100
        ORDER BY success_rate DESC, avg_salary DESC;
    `);
    return employersRaw as IEmployer[];
};

const getBestJobsByEmployerData = async (employer_name: string): Promise<IJobCount[]> => {
    const employersRaw = await sqlQuery(`
        SELECT job_title AS job_name, COUNT(*) AS count
        FROM h1b_case
        WHERE emp_name LIKE '%${employer_name.toUpperCase}%'
        GROUP BY job_title
        ORDER BY count DESC
        LIMIT 5;
    `);
    return employersRaw as IJobCount[];
};

const getBestCitiesByEmployerData = async (employer_name: string): Promise<ICityCount[]> => {
    const employersRaw = await sqlQuery(`
        SELECT work_city AS city_name, work_state AS city_state_code, COUNT(*) AS count
        FROM h1b_case
        WHERE emp_name LIKE '%${employer_name.toUpperCase}%'
        GROUP BY work_city, work_state
        ORDER BY count DESC
        LIMIT 5;
    `);
    return employersRaw as ICityCount[];
};

export { getAllEmployersData, getBestJobsByEmployerData, getBestCitiesByEmployerData }