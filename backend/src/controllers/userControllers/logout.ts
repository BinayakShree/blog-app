import { Context } from "hono";
import { deleteCookie } from "hono/cookie";
import internalServerError from "../../utils/errorHandlers/error";

export default async function logoutController(c: Context) {
  try {
    deleteCookie(c, "access-token");
    return c.json({
      success: true,
      message: "User signed out successfully",
    });
  } catch (error) {
    return internalServerError(c.json);
  }
}
