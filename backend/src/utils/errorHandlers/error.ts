import httpStatusCode from "../httpCode";

export default function internalServerError(c: Function) {
  return c(
    {
      success: false,
      error: "Internal Server Error",
      statusCode: httpStatusCode.InternalServerError,
    },
    httpStatusCode.InternalServerError
  );
}
