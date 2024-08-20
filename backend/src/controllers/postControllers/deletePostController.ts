import { Context } from "hono";
import internalServerError from "../../utils/errorHandlers/error";
import httpStatusCode from "../../utils/httpCode";
import prisma from "../../utils/prisma";

export default async function deletePostController(c: Context) {
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
    await post.delete({
      where: {
        id: postId,
        authorId: userId,
      },
    });
    return c.json(
      {
        success: true,
        message: "Post deleted successfully",
        statusCode: httpStatusCode.OK,
      },
      httpStatusCode.OK
    );
  } catch {
    internalServerError(c.json);
  }
}
