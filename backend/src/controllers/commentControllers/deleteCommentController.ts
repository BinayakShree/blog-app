import { Context } from "hono";
import prisma from "../../utils/prisma";
import internalServerError from "../../utils/errorHandlers/error";
import httpStatusCode from "../../utils/httpCode";

export default async function editCommentController(c: Context) {
    try {
        const { comment } = prisma(c.env.DATABASE_URL);
        const commentId = c.req.param("commentId");
        const jwtPayload = c.get("jwtPayload");
        const initalResponse=await comment.findUnique({
            where:{
                id:commentId
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

        const dbResponse=await comment.delete({
            where:{
                id:commentId
            }
        })
        return c.json(
        {
            success:true,
            message:"Comment deleted successfully",
            statusCode: httpStatusCode.OK
        },httpStatusCode.OK
        )
    } catch (error) {
        return internalServerError(c.json);
    }
}