import { type Router } from "express";
import { stateRouter } from "./state.route.js";
import { countryRouter } from "./country.route.js";
import {cityRouter} from "./city.route.js";

const routers: Array<{ prefix: string; router: Router }> = [
  {
    prefix: "/api/country",
    router: countryRouter,
  },
  {
    prefix: "/api/state/:state",
    router: stateRouter,
  },
  {
    prefix: "/api/city/:city_name",
    router: cityRouter,
  }
];

export { routers };
