import express from "express";
import { getAllCityDataByState, getBestCitiesByDebt, getBestCitiesByEmployer, getBestCitiesByGrowth, getBestCitiesByJob } from "../controllers/state.controller.js";

const stateRouter = express.Router();

stateRouter.get("/:state/all", getAllCityDataByState);
stateRouter.get("/:state/job/:job", getBestCitiesByJob);
stateRouter.get("/:state/employer/:employer", getBestCitiesByEmployer);
stateRouter.get("/:state/growth", getBestCitiesByGrowth);
stateRouter.get("/:state/debt", getBestCitiesByDebt);

export { stateRouter };
