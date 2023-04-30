import { type NextFunction, type Request, type Response } from "express";
import {getAllCities, getCitiesWithEmployerFilter, getCitiesWithJobFilter} from "../services/city.service.js";

const getAllCityDataByState = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { state } = req.params;
  const cityData = await getAllCities(state);
  res.status(200).json(cityData);
};

const getBestCitiesByJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { state, job } = req.params;
  const cityData = await getCitiesWithJobFilter(state, job);
  res.status(200).json(cityData);
};

const getBestCitiesByEmployer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { state, employer } = req.params;
  const cityData = await getCitiesWithEmployerFilter(state, employer);
  res.status(200).json(cityData);
};

// const getBestCitiesByGrowth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   const { state } = req.params;
//   const cityData = await getAllCities(state);
//   cityData.sort((a, b) => b.average_housing_price_growth - a.average_housing_price_growth);
//   res.status(200).json(cityData);
// };

// const getBestCitiesByDebt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   const { state } = req.params;
//   const cityData = await getAllCities(state);
//   cityData.sort((a, b) => (b.average_housing_price / b.average_salary) - (a.average_housing_price / a.average_salary));
//   res.status(200).json(cityData);
// };

// const getBestCitiesByH1bVolume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   const { state } = req.params;
//   const cityData = await getAllCities(state);
//   cityData.sort((a, b) => b.h1b_volume - a.h1b_volume);
//   res.status(200).json(cityData);
// }

// const getBestCitiesByH1bSuccessRate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   const { state } = req.params;
//   const cityData = await getAllCities(state);
//   cityData.sort((a, b) => b.h1b_success_rate - a.h1b_success_rate);
//   res.status(200).json(cityData);
// }

export {
  getAllCityDataByState,
  getBestCitiesByJob,
  getBestCitiesByEmployer,
  // getBestCitiesByGrowth,
  // getBestCitiesByDebt,
  // getBestCitiesByH1bVolume,
  // getBestCitiesByH1bSuccessRate
};

