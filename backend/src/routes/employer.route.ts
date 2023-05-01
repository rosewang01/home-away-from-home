import express from "express";
import { getAllEmployers, getBestCitiesByEmployer, getBestJobsByEmployer } from "../controllers/employer.controller.js";

const employerRouter = express.Router();

employerRouter.get("/all", getAllEmployers);
employerRouter.get("/cities/:employer", getBestCitiesByEmployer);
employerRouter.get("/jobs/:employer", getBestJobsByEmployer);

export { employerRouter };