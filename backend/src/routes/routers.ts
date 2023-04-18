import { type Router } from "express";
import { stateRouter } from "./state.route.js";

const routers: Array<{ prefix: string; router: Router }> = [
  {
    prefix: "/api/state",
    router: stateRouter,
  },
];

export { routers };
