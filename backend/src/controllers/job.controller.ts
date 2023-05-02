import { type NextFunction, type Request, type Response } from "express";
import { getAllJobsData, getBestEmployersByJobData, getBestCitiesByJobData } from "../services/job.service.js";

const getAllJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const jobsDataRaw = await getAllJobsData();
  res.status(200).json(jobsDataRaw);
};

const getBestEmployersByJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { job_name } = req.params;
  const employersDataRaw = await getBestEmployersByJobData(job_name);
  res.status(200).json(employersDataRaw);
};

const getBestCitiesByJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { job_name } = req.params;
  const citiesDataRaw = await getBestCitiesByJobData(job_name);
  res.status(200).json(citiesDataRaw);
};

export {
  getAllJobs,
  getBestCitiesByJob,
  getBestEmployersByJob,
};