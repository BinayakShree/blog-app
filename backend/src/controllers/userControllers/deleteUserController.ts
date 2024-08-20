import { Context } from "hono";
import internalServerError from "../../utils/errorHandlers/error";
import prisma from "../../utils/prisma";
import httpStatusCode from "../../utils/httpCode";

export default async function (c: Context) {
  const { user } = prisma(c.env.DATABASE_URL);
  try {
    const userId = c.req.param("userId");
    const jwtPayload = c.get("jwtPayload");
    if (!jwtPayload.isAdmin && userId !== jwtPayload.userId) {
      return c.json(
        {
          success: false,
          error: "Unauthorized",
          statusCode: httpStatusCode.Unauthorized,
        },
        httpStatusCode.Unauthorized
      );
    }
    const dbResponse = await user.delete({
      where: {
        id: userId,
      },
    });

    return c.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    internalServerError(c.json);
  }
}
