import { type Router } from "express";
import { stateRouter } from "./state.route.js";
import { countryRouter } from "./country.route.js";

const routers: Array<{ prefix: string; router: Router }> = [
  {
    prefix: "/api/country",
    router: countryRouter,
  },
  {
    prefix: "/api/state/:state_id",
    router: stateRouter,
  },
  {
    prefix: "/api/city/:city_name",
    router: cityRouter,
  }
];

export { routers };
