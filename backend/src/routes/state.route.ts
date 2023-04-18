import express from "express";
import { getAllStatesController } from "../controllers/state.controller.js";

const stateRouter = express.Router();

stateRouter.get("/all", getAllStatesController);

export { stateRouter };
