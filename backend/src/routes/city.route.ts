import express from "express";
import { getAllZipCodeDataByCity, getBestZipCodesByCost, getBestZipCodesByGrowth } from "../controllers/city.controller.js";

/**
 * defines the router for each city route that returns zip codes
 */

const cityRouter = express.Router();

cityRouter.get("/all", getAllZipCodeDataByCity);
cityRouter.get("/growth", getBestZipCodesByGrowth);
cityRouter.get("/cost", getBestZipCodesByCost);

export { cityRouter };
