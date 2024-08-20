import { Context } from "hono";
import httpStatusCode from "../httpCode";

export default function userInputError(error: object, c: Function) {
  return c(
    {
      success: false,
      error,
      statusCode: httpStatusCode.BadRequest,
    },
    httpStatusCode.BadRequest
  );
}
