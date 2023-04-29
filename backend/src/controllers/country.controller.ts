import { type NextFunction, type Request, type Response } from "express";
import {getAllStates, getStatesWithEmployerFilter, getStatesWithJobFilter} from "../services/state.service.js";

const getAllStateData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const stateData = await getAllStates();
  res.status(200).json(stateData);
};

const getBestStatesByJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { job } = req.params;
  const stateData = await getStatesWithJobFilter(job);
  res.status(200).json(stateData);
};

const getBestStatesByEmployer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { employer } = req.params;
  const stateData = await getStatesWithEmployerFilter(employer);
  res.status(200).json(stateData);
};

const getBestStatesByGrowth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const stateData = await getAllStates();
  stateData.sort((a, b) => b.average_housing_price_growth - a.average_housing_price_growth);
  res.status(200).json(stateData);
};

const getBestStatesByDebt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const stateData = await getAllStates();
  stateData.sort((a, b) => (b.average_housing_price / b.average_salary) - (a.average_housing_price / a.average_salary));
  res.status(200).json(stateData);
};

const getBestStatesByH1bVolume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const stateData = await getAllStates();
  stateData.sort((a, b) => b.h1b_volume - a.h1b_volume);
  res.status(200).json(stateData);
}

const getBestStatesByH1bSuccessRate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const stateData = await getAllStates();
  stateData.sort((a, b) => b.h1b_success_rate - a.h1b_success_rate);
  res.status(200).json(stateData);
}

export {
  getAllStateData,
  getBestStatesByJob,
  getBestStatesByEmployer,
  getBestStatesByGrowth,
  getBestStatesByDebt,
  getBestStatesByH1bVolume,
  getBestStatesByH1bSuccessRate,
};

