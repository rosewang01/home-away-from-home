import { type NextFunction, type Request, type Response } from "express";

const getAllZipCodeDataByCity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { city_name } = req.params;
  return;
};

const getBestZipCodesByJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { city_name, job } = req.params;
  return;
};

const getBestZipCodesByEmployer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { city_name, employer } = req.params;
  return;
};

const getBestZipCodesByGrowth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { city_name } = req.params;
  return;
};

const getBestZipCodesByDebt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { city_name } = req.params;
  return;
};

export {
  getAllZipCodeDataByCity,
  getBestZipCodesByJob,
  getBestZipCodesByEmployer,
  getBestZipCodesByGrowth,
  getBestZipCodesByDebt,
};

