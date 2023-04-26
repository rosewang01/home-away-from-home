import IEmployer from "./employer.model.js";
import IJob from "./job.model.js";

interface IState {
  state_code: string;
  state_name: string;
  score: number;

  average_housing_price: number;
  average_housing_price_growth: number;

  num_jobs: number;
  average_salary: number;
  top_jobs: Array<IJob>;
  top_employers: Array<IEmployer>;

  h1b_volume: number;
  h1b_success_rate: number;
}

export default IState;
