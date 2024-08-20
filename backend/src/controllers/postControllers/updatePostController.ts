import { Context } from "hono";
import httpStatusCode from "../../utils/httpCode";
import { createPostSchema, createPostType } from "../../zod/postSchema";
import userInputError from "../../utils/errorHandlers/userInputError";
import internalServerError from "../../utils/errorHandlers/error";
import { Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";

export default async function updatePostController(c: Context) {
  try {
    const { post } = prisma(c.env.DATABASE_URL);
    const postId = c.req.param("postId");
    const userId = c.req.param("userId");
    const jwtPayload = c.get("jwtPayload");
    if (userId !== jwtPayload.userId || !jwtPayload.isAdmin) {
      return c.json(
        {
          success: false,
          error: "Unauthorized",
          statusCode: httpStatusCode.Unauthorized,
        },
        httpStatusCode.Unauthorized
      );
    }
    const body: createPostType = await c.req.json();
    const parsedBody = createPostSchema.safeParse(body);
    if (!parsedBody.success) {
      userInputError(parsedBody.error.format(), c.json);
    }
    const slug = body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");
    const dbResponse = await post.update({
      where: {
        id: postId,
        authorId: userId,
      },
      data: {
        title: body.title,
        content: body.content,
        category: body.category,
        image: body.image
          ? body.image
          : "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png",
        slug: slug,
      },
    });
    return c.json(
      {
        success: true,
        data: dbResponse,
        statusCode: httpStatusCode.Created,
      },
      httpStatusCode.Created
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return c.json(
        {
          success: false,
          error: "Post with this title already exists",
          statusCode: httpStatusCode.BadRequest,
        },
        httpStatusCode.BadRequest
      );
    }
    internalServerError(c.json);
  }
}
