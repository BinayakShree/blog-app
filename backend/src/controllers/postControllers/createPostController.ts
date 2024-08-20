import { Context } from "hono";
import httpStatusCode from "../../utils/httpCode";
import { createPostSchema, createPostType } from "../../zod/postSchema";
import userInputError from "../../utils/errorHandlers/userInputError";
import internalServerError from "../../utils/errorHandlers/error";
import prisma from "../../utils/prisma";
import { Prisma } from "@prisma/client";

export default async function createPostController(c: Context) {
  try {
    const { post } = prisma(c.env.DATABASE_URL);
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

    const body: createPostType = await c.req.json();

    const parsedBody = createPostSchema.safeParse(body);
    if (!parsedBody.success) {
      return userInputError(parsedBody.error.format(), c.json);
    }
    const slug = body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");
    const dbResponse = await post.create({
      data: {
        title: body.title,
        content: body.content,
        image: body.image
          ? body.image
          : "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png",
        category: body.category,
        slug: slug,
        authorId: jwtPayload.userId,
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
    return internalServerError(c.json);
  }
}
