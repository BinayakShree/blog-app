import { Context } from "hono";
import internalServerError from "../../utils/errorHandlers/error";
import prisma from "../../utils/prisma";
import httpStatusCode from "../../utils/httpCode";

export default async function getPostCommentsController(c: Context) {
  try {
    const postId = c.req.param("postId");
    const { comment } = prisma(c.env.DATABASE_URL);
    const dbResonse = await comment.findMany({
      where: {
        postId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        likes:{
          select:{
            id:true
          }
        },
        author: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
      },
    });
    return c.json(
      {
        success: true,
        data: dbResonse,
        statusCode: httpStatusCode.OK,
      },
      httpStatusCode.OK
    );
  } catch (error) {
    return internalServerError(c.json);
  }
}
