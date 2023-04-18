import { type NextFunction, type Request, type Response } from "express";
import { getAllStates } from "../services/state.service.js";

const getAllStatesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const states = await getAllStates();
    res.status(200).json(states);
  } catch (error) {
    next(error);
  }
};

export { getAllStatesController };
