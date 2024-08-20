import { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import httpStatusCode from "../utils/httpCode";
import { Jwt } from "hono/utils/jwt";
import internalServerError from "../utils/errorHandlers/error";

export default async function userAuth(c: Context, next: Next) {
  try {
    const token = getCookie(c, "access-token");
    if (!token) {
      console.log("token not found");
      return c.json(
        {
          success: false,
          error: "Unauthorized",
          statusCode: httpStatusCode.Unauthorized,
        },
        httpStatusCode.Unauthorized
      );
    }
    try {
      const payload = await Jwt.verify(token, c.env.JWT_SECRET);
      c.set("jwtPayload", payload);
      await next();
    } catch (error) {
      return c.json(
        {
          success: false,
          error: "Unauthorized",
          statusCode: httpStatusCode.Unauthorized,
        },
        httpStatusCode.Unauthorized
      );
    }
  } catch (error) {
    return internalServerError(c.json);
  }
}
