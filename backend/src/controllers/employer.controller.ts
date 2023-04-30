import { type NextFunction, type Request, type Response } from "express";
import { getAllEmployersData, getBestJobsByEmployerData, getBestCitiesByEmployerData } from "../services/employer.service.js";

const getAllEmployers= async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  res.send(getAllEmployersData())
  return;
};

const getBestJobsByEmployer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { employer_name } = req.params;
  res.send(getBestJobsByEmployerData(employer_name))
  return;
};

const getBestCitiesByEmployer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { employer_name } = req.params;
  res.send(getBestCitiesByEmployerData(employer_name))
  return;
};

export {
  getAllEmployers,
  getBestCitiesByEmployer,
  getBestJobsByEmployer,
};