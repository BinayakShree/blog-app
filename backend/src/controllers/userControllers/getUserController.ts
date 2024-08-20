import { Context } from "hono";
import prisma from "../../utils/prisma";
import internalServerError from "../../utils/errorHandlers/error";
import httpStatusCode from "../../utils/httpCode";

export default async function getUserController(c: Context) {
  try {
    const jwtPayload = await c.get("jwtPayload");
    if (!jwtPayload.isAdmin) {
      return c.json(
        {
          success: false,
          error: "Unauthorized",
          statusCode: httpStatusCode.Unauthorized,
        },
        httpStatusCode.Unauthorized
      );
    }
    const startIndex = parseInt(c.req.query("startIndex") ?? "0");
    const limit = parseInt(c.req.query("limit") ?? "9");
    const sortDirection = c.req.query("order") === "asc" ? "asc" : "desc";
    const { user } = prisma(c.env.DATABASE_URL);

    const dbResponse = await user.findMany({
      skip: startIndex,
      take: limit,
      orderBy: { createdAt: sortDirection },
    });
    const usersWithoutPassword = dbResponse.map((user) => {
      const { password, ...rest } = user;
      return rest;
    });
    const totalUsers = await user.count();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await user.count({
      where: {
        createdAt: {
          gte: oneMonthAgo,
        },
      },
    });
    return c.json(
      {
        success: true,
        users: usersWithoutPassword,
        totalUsers,
        lastMonthUsers,
        statusCode: httpStatusCode.OK,
      },
      httpStatusCode.OK
    );
  } catch (error) {
    internalServerError(c.json);
  }
}
