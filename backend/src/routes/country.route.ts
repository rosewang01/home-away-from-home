import express from "express";
import {
  getAllStateData,
  getBestStatesByDebt,
  getBestStatesByEmployer,
  getBestStatesByGrowth,
  getBestStatesByH1bSuccessRate,
  getBestStatesByH1bVolume,
  getBestStatesByJob
} from "../controllers/country.controller.js";

/**
 * defines the router for each country route that returns state
 */

const countryRouter = express.Router();

countryRouter.get("/all", getAllStateData);
countryRouter.get("/job/:job", getBestStatesByJob);
countryRouter.get("/employer/:employer", getBestStatesByEmployer);
countryRouter.get("/growth", getBestStatesByGrowth);
countryRouter.get("/debt", getBestStatesByDebt);
countryRouter.get("/h1b_volume", getBestStatesByH1bVolume);
countryRouter.get("/h1b_success_rate", getBestStatesByH1bSuccessRate);

export { countryRouter };
