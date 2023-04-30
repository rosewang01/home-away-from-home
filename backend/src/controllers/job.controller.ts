import { type NextFunction, type Request, type Response } from "express";
import { getAllJobsData, getBestEmployersByJobData, getBestCitiesByJobData } from "../services/job.service.js";

const getAllJobs= async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  res.send(getAllJobsData())
  return;
};

const getBestEmployersByJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { job_name } = req.params;
  res.send(getBestEmployersByJobData(job_name))
  return;
};

const getBestCitiesByJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { job_name } = req.params;
  res.send(getBestCitiesByJobData(job_name))
  return;
};

export {
  getAllJobs,
  getBestCitiesByJob,
  getBestEmployersByJob,
};