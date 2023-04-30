import { type NextFunction, type Request, type Response } from "express";
import { getAllZipCodes, getBestCostZipCodes, getBestGrowthZipCodes } from "../services/city.service.js";

const getAllZipCodeDataByCity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { city_name } = req.params;
  res.send(getAllZipCodes(city_name))
  return;
};

const getBestZipCodesByGrowth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { city_name } = req.params;
  res.send(getBestGrowthZipCodes(city_name))
  return;
};

const getBestZipCodesByCost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { city_name } = req.params;
  res.send(getBestCostZipCodes(city_name))
  return;
};

export {
  getAllZipCodeDataByCity,
  getBestZipCodesByGrowth,
  getBestZipCodesByCost,
};

