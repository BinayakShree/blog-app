import { Context } from "hono";
import internalServerError from "../../utils/errorHandlers/error";
import {
  createCommentSchema,
  createCommentType,
} from "../../zod/commentSchema";
import userInputError from "../../utils/errorHandlers/userInputError";
import httpStatusCode from "../../utils/httpCode";
import prisma from "../../utils/prisma";

export default async function createCommentController(c: Context) {
  try {
    const { comment } = prisma(c.env.DATABASE_URL);
    const body: createCommentType = await c.req.json();
    const parsedBody = createCommentSchema.safeParse(body);
    const jwtPayload = c.get("jwtPayload");
    if (!parsedBody.success) {
      return userInputError(parsedBody.error.format(), c.json);
    }
    if (body.userId !== jwtPayload.userId) {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
          statusCode: httpStatusCode.Unauthorized,
        },
        httpStatusCode.Unauthorized
      );
    }
    const dbResponse = await comment.create({
      data: {
        content: body.content,
        postId: body.postId,
        authorId: body.userId,
      },
      include: {
        author: {
          select: {
            username: true,
            profilePicture: true,
            id: true,
          },
        },
      },
    });
    return c.json(
      {
        success: false,
        data: dbResponse,
        statusCode: httpStatusCode.OK,
      },
      httpStatusCode.OK
    );
  } catch (error) {
    internalServerError(c.json);
  }
}
