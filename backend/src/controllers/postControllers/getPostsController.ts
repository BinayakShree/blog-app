import { Context } from "hono";
import internalServerError from "../../utils/errorHandlers/error";
import prisma from "../../utils/prisma";
import { Prisma } from "@prisma/client";

export default async function getPostsController(c: Context) {
  try {
    const { post } = prisma(c.env.DATABASE_URL);
    const startIndex = parseInt(c.req.query("startIndex") ?? "0");
    const limit = parseInt(c.req.query("limit") ?? "9");
    const sortDirection = c.req.query("sort") === "asc" ? "asc" : "desc";
    const searchTerm = c.req.query("searchTerm");
    const whereConditions: Prisma.PostWhereInput = {
      ...(c.req.query("userId") && { authorId: c.req.query("userId") }),
      ...(c.req.query("category") && { category: c.req.query("category") }),
      ...(c.req.query("slug") && { slug: c.req.query("slug") }),
      ...(c.req.query("postId") && { id: c.req.query("postId") }),
      ...(searchTerm && {
        OR: [
          {
            title: { contains: searchTerm, mode: Prisma.QueryMode.insensitive },
          },
          {
            content: {
              contains: searchTerm,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      }),
    };
    const filteredWhereConditions = Object.keys(whereConditions).length
      ? whereConditions
      : {};

    const posts = await post.findMany({
      where: filteredWhereConditions,
      orderBy: { updatedAt: sortDirection },
      skip: startIndex,
      take: limit,
    });

    const totalPosts = await post.count();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthPosts = await post.count({
      where: {
        createdAt: {
          gte: oneMonthAgo,
        },
      },
    });

    return c.json({
      success: true,
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    console.error("Error:", error);
    return internalServerError(c.json);
  }
}
