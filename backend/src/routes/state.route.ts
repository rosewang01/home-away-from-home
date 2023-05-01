import express from "express";
import { 
    getAllCityDataByState, 
    getBestCitiesByDebt, 
    getBestCitiesByEmployer, 
    getBestCitiesByGrowth, 
    getBestCitiesByJob
} from "../controllers/state.controller.js";

const stateRouter = express.Router();

stateRouter.get("/all", getAllCityDataByState);
stateRouter.get("/job/:job", getBestCitiesByJob);
stateRouter.get("/employer/:employer", getBestCitiesByEmployer);
stateRouter.get("/growth", getBestCitiesByGrowth);
stateRouter.get("/debt", getBestCitiesByDebt);

export { stateRouter };
