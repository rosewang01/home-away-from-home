import { type Router } from "express";
import { stateRouter } from "./state.route.js";
import { countryRouter } from "./country.route.js";
import {cityRouter} from "./city.route.js";
import {jobRouter} from "./job.route.js";
import {employerRouter} from "./employer.route.js";

const routers: Array<{ prefix: string; router: Router }> = [
  {
    prefix: "/api/country",
    router: countryRouter,
  },
  {
    prefix: "/api/state/",
    router: stateRouter,
  },
  {
    prefix: "/api/city/:city_name",
    router: cityRouter,
  },
  {
    prefix: "/api/jobs",
    router: jobRouter,
  },
  {
    prefix: "/api/employers",
    router: employerRouter
  }
];

export { routers };
