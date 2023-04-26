import { type NextFunction, type Request, type Response } from "express";

const getAllStateDataByCountry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  return;
};

const getBestCitiesByJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { job } = req.params;
  return;
};

const getBestCitiesByEmployer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { employer } = req.params;
  return;
};

const getBestCitiesByGrowth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  return;
};

const getBestCitiesByDebt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  return;
};

export {
  getAllStateDataByCountry,
  getBestCitiesByJob,
  getBestCitiesByEmployer,
  getBestCitiesByGrowth,
  getBestCitiesByDebt,
};

