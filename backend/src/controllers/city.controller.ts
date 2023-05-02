import { type NextFunction, type Request, type Response } from "express";
import { getAllZipCodes, getBestCostZipCodes, getBestGrowthZipCodes } from "../services/zipcode.service.js";

const getAllZipCodeDataByCity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { city_name } = req.params;
  const zipCodeDataRaw = await getAllZipCodes(city_name);
  res.status(200).json(zipCodeDataRaw);
};

const getBestZipCodesByGrowth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { city_name } = req.params;
  const zipCodeDataRaw = await getBestGrowthZipCodes(city_name);
  res.status(200).json(zipCodeDataRaw);
};

const getBestZipCodesByCost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { city_name } = req.params;
  const zipCodeDataRaw = await getBestCostZipCodes(city_name);
  res.status(200).json(zipCodeDataRaw);
};

export {
  getAllZipCodeDataByCity,
  getBestZipCodesByGrowth,
  getBestZipCodesByCost,
};

