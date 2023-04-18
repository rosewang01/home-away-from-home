import { StatusCode } from "./statusCode.js";

/**
 * A custom class extending {@link Error} for defining and handling errors
 * in a consistent manner throughout the server.
 */
class ApiError extends Error {
  code: number;

  /**
   * The constructor for any type of {@link ApiError}
   * @param code The HTTP status code corrsponding to the error
   * @param message A message describing the error
   */
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.message = message;
  }

  //           Static functions for creating commonly used errors             //

  /**
   * Creates a 400 Bad Request Error
   * @param message A message describing the error
   * @returns An {@link ApiError} with the appropriate status code
   */
  static badRequest(message: string): ApiError {
    return new ApiError(StatusCode.BAD_REQUEST, message);
  }

  /**
   * Creates a 400 Bad Request Error with a messsage specifying the
   * required fields in the request body.
   * @param requiredFields The list of required fields
   * @returns An {@link ApiError} with the appropriate status code and message
   */
  static missingFields(requiredFields: string[]): ApiError {
    return new ApiError(
      StatusCode.BAD_REQUEST,
      `Request body needs the following fields: ${requiredFields.join(", ")}.`
    );
  }

  /**
   * Creates a 401 Unauthorized Error
   * @param message A message describing the error
   * @returns An {@link ApiError} with the appropriate status code
   */
  static unauthorized(message: string): ApiError {
    return new ApiError(StatusCode.UNAUTHORIZED, message);
  }

  /**
   * Creates a 403 Forbidden Error
   * @param message A message describing the error
   * @returns An {@link ApiError} with the appropriate status code
   */
  static forbidden(message: string): ApiError {
    return new ApiError(StatusCode.FORBIDDEN, message);
  }

  /**
   * Creates a 404 Not Found Error
   * @param message A message describing the error
   * @returns An {@link ApiError} with the appropriate status code
   */
  static notFound(message: string): ApiError {
    return new ApiError(StatusCode.NOT_FOUND, message);
  }

  /**
   * Creates a 500 Internal Server Error
   * @param message A message describing the error
   * @returns An {@link ApiError} with the appropriate status code
   */
  static internal(message: string): ApiError {
    return new ApiError(StatusCode.INTERNAL_SERVER_ERROR, message);
  }
}

export { ApiError };
