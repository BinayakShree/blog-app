import { Context } from "hono";
import internalServerError from "../../utils/errorHandlers/error";
import prisma from "../../utils/prisma";
import { Prisma } from "@prisma/client";
import httpStatusCode from "../../utils/httpCode";

export default async function getCommentsController(c: Context) {
  try {
    const { comment } = prisma(c.env.DATABASE_URL);
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

    const comments = await comment.findMany({
      orderBy: { updatedAt: sortDirection },
      skip: startIndex,
      take: limit,
      include: {
        author: {
          select: {
            username: true,
          },
        },
        post: {
          select: {
            slug: true,
          },
        },
      },
    });

    const totalComments = await comment.count();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthComments = await comment.count({
      where: {
        createdAt: {
          gte: oneMonthAgo,
        },
      },
    });

    return c.json({
      success: true,
      comments: comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        authorUsername: comment.author.username,
        postSlug: comment.post.slug,
        likesCount: comment.likesCount,
      })),
      totalComments,
      lastMonthComments,
    });
  } catch (error) {
    console.error("Error:", error);
    return internalServerError(c.json);
  }
}
