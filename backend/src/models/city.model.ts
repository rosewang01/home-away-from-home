<<<<<<< HEAD
import type IEmployer from "./employer.model.js";
import type IJob from "./job.model.js";

interface ICity {
  city_name: string;
  city_state_code: string;
  score: number;

  average_housing_price: number;
  average_housing_price_growth: number;

  num_jobs: number;
  average_salary: number;
  top_jobs: IJob[];
  top_employers: IEmployer[];

  h1b_volume: number;
  h1b_success_rate: number;

  similar_cities: string[];
}

export default ICity;
=======
interface ICity {
    city_name: string;
    state_code: string;
    metro_region: string;
    metro_region_state_code: string;
}

export default ICity
>>>>>>> 1117913 (models)
