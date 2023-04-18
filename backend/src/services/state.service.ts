import { sqlQuery } from "../utils/sql.js";
import type IState from "../models/state.model.js";

const getAllStates = async (): Promise<IState[]> => {
  const statesRaw = await sqlQuery(`
SELECT * FROM state
    `);
  return statesRaw as IState[];
};

export { getAllStates };
