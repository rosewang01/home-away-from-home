import { type NextFunction, type Request, type Response } from "express";
import { getAllEmployersData, getBestJobsByEmployerData, getBestCitiesByEmployerData } from "../services/employer.service.js";

const getAllEmployers= async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const employersDataRaw = await getAllEmployersData();
  res.status(200).json(employersDataRaw);
};

const getBestJobsByEmployer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { employer_name } = req.params;
  const jobsDataRaw = await getBestJobsByEmployerData(employer_name);
  res.status(200).json(jobsDataRaw);
};

const getBestCitiesByEmployer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { employer_name } = req.params;
  const citiesDataRaw = await getBestCitiesByEmployerData(employer_name);
  res.status(200).json(citiesDataRaw);
};

export {
  getAllEmployers,
  getBestCitiesByEmployer,
  getBestJobsByEmployer,
};