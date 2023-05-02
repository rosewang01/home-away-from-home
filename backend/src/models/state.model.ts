import type IEmployer from "./employer.model.js";
import type IJob from "./job.model.js";

interface IState {
  state_code: string;
  state_name: string;

  average_housing_price: number;
  average_housing_price_growth: number;

  average_salary: number;
  top_jobs: IJob[];
  top_employers: IEmployer[];

  h1b_volume: number;
  h1b_success_rate: number;

  similar_states: string[];
}

export default IState;
