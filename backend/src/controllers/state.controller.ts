import { type NextFunction, type Request, type Response } from "express";

const getAllCityDataByState = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { state_id } = req.params;
  return;
};

const getBestCitiesByJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { state_id, job } = req.params;
  return;
};

const getBestCitiesByEmployer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { state_id, employer } = req.params;
  return;
};

const getBestCitiesByGrowth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { state_id } = req.params;
  return;
};

const getBestCitiesByDebt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { state_id } = req.params;
  return;
};

export {
  getAllCityDataByState,
  getBestCitiesByJob,
  getBestCitiesByEmployer,
  getBestCitiesByGrowth,
  getBestCitiesByDebt,
};

