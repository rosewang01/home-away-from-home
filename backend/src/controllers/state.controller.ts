import { type NextFunction, type Request, type Response } from "express";
import {
  getAllCities,
  getAllCitiesWithState,
  getCitiesWithEmployerFilter,
  getCitiesWithJobFilter
} from "../services/city.service.js";

/**
 * This function retrieves all city data and sends it as a JSON response.
 * @param {Request} req - Request object which contains information about the incoming HTTP request.
 * @param {Response} res - `res` stands for response and it is an object that represents the HTTP
 * response that an Express app sends when it receives an HTTP request. It is used to send the response
 * back to the client with the appropriate status code, headers, and body. In this case, `res` is used
 * to
 * @param {NextFunction} next - `next` is a function that is used to pass control to the next
 * middleware function in the request-response cycle. It is typically used to handle errors or to pass
 * control to the next middleware function when the current middleware function has completed its task.
 */
const getAllCityData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const cityData = await getAllCities();
  res.status(200).json(cityData);
}

/**
 * This function retrieves all city data for a given state and sends it as a JSON response.
 * @param {Request} req - Request object which contains the HTTP request information such as headers,
 * body, and parameters.
 * @param {Response} res - `res` stands for response and it is an object that represents the HTTP
 * response that an Express app sends when it receives an HTTP request. It is used to send the response
 * back to the client with the appropriate status code, headers, and body. In this case, `res` is used
 * to
 * @param {NextFunction} next - `next` is a function that is used to pass control to the next
 * middleware function in the stack. It is typically used to handle errors or to move on to the next
 * function in the chain.
 */
const getAllCityDataByState = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { state } = req.params;
  const cityData = await getAllCitiesWithState(state);
  res.status(200).json(cityData);
};

/**
 * This is an asynchronous function that retrieves and returns a list of cities based on a given state
 * and job.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information about the request, such as the request method, headers, URL, and
 * parameters. In this case, the `params` property of the `req` object is being used to extract the `
 * @param {Response} res - `res` stands for response and it is an object that represents the HTTP
 * response that an Express app sends when it receives an HTTP request. It is used to send the response
 * back to the client with the appropriate status code, headers, and body. In this case, `res` is used
 * to
 * @param {NextFunction} next - `next` is a function that is used to pass control to the next
 * middleware function in the request-response cycle. It is typically used to handle errors or to move
 * on to the next middleware function in the chain.
 */
const getBestCitiesByJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { state, job } = req.params;
  const cityData = await getCitiesWithJobFilter(state, job);
  res.status(200).json(cityData);
};

/**
 * This function retrieves the best cities based on a given state and employer.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request method, headers, URL, and parameters.
 * @param {Response} res - `res` stands for response and is an object that represents the HTTP response
 * that an Express app sends when it receives an HTTP request. It contains methods for setting the HTTP
 * status code, headers, and sending the response body. In this case, `res.status(200).json(cityData)`
 * sets
 * @param {NextFunction} next - `next` is a function that is used to pass control to the next
 * middleware function in the stack. It is typically used to handle errors or to move on to the next
 * function in the chain.
 */
const getBestCitiesByEmployer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { state, employer } = req.params;
  const cityData = await getCitiesWithEmployerFilter(state, employer);
  res.status(200).json(cityData);
};

/**
 * This function retrieves and sorts all cities in a given state by their average housing price growth.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request method, headers, URL, and any data sent in the
 * request body.
 * @param {Response} res - `res` stands for "response" and is an object that represents the HTTP
 * response that an Express app sends when it receives an HTTP request. It contains methods for setting
 * the HTTP status code, headers, and body of the response. In this specific function, `res` is used to
 * send a
 * @param {NextFunction} next - `next` is a function that is used to pass control to the next
 * middleware function in the stack. It is typically used to handle errors or to move on to the next
 * function in the chain of middleware functions.
 */
const getBestCitiesByGrowth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { state } = req.params;
  const cityData = await getAllCitiesWithState(state);
  cityData.sort((a, b) => b.average_housing_price_growth - a.average_housing_price_growth);
  res.status(200).json(cityData);
};

/**
 * This function retrieves and sorts city data based on the ratio of average housing price to average
 * salary for a given state.
 * @param {Request} req - Request object, which contains information about the incoming HTTP request.
 * @param {Response} res - `res` stands for response and it is an object that represents the HTTP
 * response that an Express app sends when it receives an HTTP request. It is used to send the response
 * back to the client with the appropriate status code, headers, and body. In this case, `res` is used
 * to
 * @param {NextFunction} next - `next` is a function that is used to pass control to the next
 * middleware function in the stack. It is typically used to handle errors or to move on to the next
 * function in the chain of middleware functions.
 */
const getBestCitiesByDebt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { state } = req.params;
  const cityData = await getAllCitiesWithState(state);
  cityData.sort((a, b) => (b.average_housing_price / b.average_salary) - (a.average_housing_price / a.average_salary));
  res.status(200).json(cityData);
};

/**
 * This function retrieves and sorts all cities with a given state parameter by their H1B visa volume.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request method, headers, URL, and any data sent in the
 * request body.
 * @param {Response} res - `res` stands for "response" and is an object that represents the HTTP
 * response that an Express app sends when it receives an HTTP request. It contains methods for setting
 * the HTTP status code, headers, and body of the response. In this case, `res` is used to send a JSON
 * @param {NextFunction} next - `next` is a function that is called to pass control to the next
 * middleware function in the stack. It is typically used to handle errors or to move on to the next
 * middleware function in the chain.
 */
const getBestCitiesByH1bVolume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { state } = req.params;
  const cityData = await getAllCitiesWithState(state);
  cityData.sort((a, b) => b.h1b_volume - a.h1b_volume);
  res.status(200).json(cityData);
}

/**
 * This TypeScript function retrieves and sorts data on cities with the highest H1B success rates for a
 * given state.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information about the request, such as the request method, headers, URL, and any
 * data sent in the request body.
 * @param {Response} res - `res` stands for response and is an object that represents the HTTP response
 * that an Express app sends when it receives an HTTP request. It is used to send the response back to
 * the client with the appropriate status code, headers, and body. In this case, `res` is used to send
 * @param {NextFunction} next - `next` is a function that is called to pass control to the next
 * middleware function in the stack. It is typically used to handle errors or to move on to the next
 * middleware function after the current one has completed its task.
 */
const getBestCitiesByH1bSuccessRate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { state } = req.params;
  const cityData = await getAllCitiesWithState(state);
  cityData.sort((a, b) => b.h1b_success_rate - a.h1b_success_rate);
  res.status(200).json(cityData);
}

export {
  getAllCityData,
  getAllCityDataByState,
  getBestCitiesByJob,
  getBestCitiesByEmployer,
  getBestCitiesByGrowth,
  getBestCitiesByDebt,
  getBestCitiesByH1bVolume,
  getBestCitiesByH1bSuccessRate
};

