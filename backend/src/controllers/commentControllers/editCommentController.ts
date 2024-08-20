import { Context } from "hono";
import prisma from "../../utils/prisma";
import internalServerError from "../../utils/errorHandlers/error";
import httpStatusCode from "../../utils/httpCode";
import { updateCommentSchema, updateCommentType } from "../../zod/commentSchema";
import userInputError from "../../utils/errorHandlers/userInputError";

export default async function editCommentController(c: Context) {
    try {
        const { comment } = prisma(c.env.DATABASE_URL);
        const commentId = c.req.param("commentId");
        const jwtPayload = c.get("jwtPayload");
        const initalResponse=await comment.findUnique({
            where:{
                id:commentId
            },
            include:{
                likes:true
            }
        })
        if(!initalResponse){
            return c.json({
                success:false,
                error:"Comment not found",
                statusCode: httpStatusCode.NotFound
            },httpStatusCode.NotFound)
    }
    if(initalResponse.authorId!==jwtPayload.userId && !jwtPayload.isAdmin){
        return c.json({
            success:false,
            error:"Unauthorized",
            statusCode: httpStatusCode.Unauthorized
        },httpStatusCode.Unauthorized)
    }
    const body:updateCommentType=await c.req.json();
    const parsedBody=updateCommentSchema.safeParse(body);
    if(!parsedBody.success){
        userInputError(parsedBody.error.format(),c.json)
    }
    const dbResponse=await comment.update({
        where:{
            id:commentId
        },
        data:{
            content:parsedBody?.data?.content
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
    })
    return c.json(
        {
          success: false,
          data: dbResponse,
          statusCode: httpStatusCode.OK,
        },
        httpStatusCode.OK
      );
    } catch (error) {
        return internalServerError(c.json);
    }
}