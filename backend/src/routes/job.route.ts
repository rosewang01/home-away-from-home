import express from "express";
import { getAllJobs, getBestCitiesByJob, getBestEmployersByJob } from "../controllers/job.controller.js";

const jobRouter = express.Router();

jobRouter.get("/all", getAllJobs);
jobRouter.get("/cities/:job", getBestCitiesByJob);
jobRouter.get("/employers/:job", getBestEmployersByJob);

export { jobRouter };