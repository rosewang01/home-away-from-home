import type express from "express";
import { ApiError } from "./apiError.js";
import { StatusCode } from "./statusCode.js";

/**
 * The final error handler for all errors encountered in the server. Responsible
 * for what is ultimately sent to the client, allowing the prevention of
 * sensitive server information leaking.
 * @param err The error propogated by a previous route handler. Could be an
 * {@link Error} or a custom {@link ApiError}
 * @param req Request object provided by Express
 * @param res Response object provided by Express
 * @param _
 */
const apiErrorResponder = (
  err: Error,
  req: express.Request,
  res: express.Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: express.NextFunction // Need this param so express actually calls handler
): void => {
  // .send() populates res.error.response.data
  if (err instanceof ApiError) {
    res.status(err.code).send({ message: err.message });
    return;
  }
  // Generic error to return
  res.status(StatusCode.INTERNAL_SERVER_ERROR).send({ message: err.message });
};

export { apiErrorResponder };
