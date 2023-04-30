<<<<<<< HEAD
import type IEmployer from "./employer.model.js";
import type IJob from "./job.model.js";

interface ICity {
  city_name: string;
  city_state_code: string;
  count: number | null;
  score: number | null;

  average_housing_price: number | null;
  average_housing_price_growth: number | null;

  num_jobs: number | null;
  average_salary: number | null;
  top_jobs: IJob[] | null;
  top_employers: IEmployer[] | null;

  h1b_volume: number | null;
  h1b_success_rate: number | null;

  similar_cities: string[] | null;
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
