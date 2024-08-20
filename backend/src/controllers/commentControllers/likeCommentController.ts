import { Context } from "hono";
import internalServerError from "../../utils/errorHandlers/error";
import prisma from "../../utils/prisma";
import httpStatusCode from "../../utils/httpCode";

export default async function likeCommentController(c:Context){
    try{
        const commentId = c.req.param("commentId");
        const {comment}=prisma(c.env.DATABASE_URL);
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
    const userIndex=initalResponse.likes.findIndex((like)=>like.id===jwtPayload.userId);
    if(userIndex===-1){
        const dbResponse=await comment.update({
            where:{
                id: commentId
                
            },
            data:{
                likesCount: {
                    increment: 1
                },
                likes: {
                    connect: {
                        id: jwtPayload.userId
                    }
                }
            },
            include:{
                likes:{
                    select:{
                        id:true
                    }
                }
            }
        })
        return c.json({
            success: true,
            data:dbResponse,
            statusCode:httpStatusCode.OK
        },httpStatusCode.OK)
    }
    else{
        const dbResponse=await comment.update({
            where:{
                id: commentId
            },
            data:{
                likesCount: {
                    decrement: 1
                },
                likes: {
                    disconnect: {
                        id: jwtPayload.userId
                    }
                }
            },
            include:{
                likes:{
                    select:{
                        id:true
                    }
                }
            }
        })
        return c.json({
            success: true,
            data:dbResponse,
            statusCode:httpStatusCode.OK
        },httpStatusCode.OK)
    }

}

    catch(error){
        return internalServerError(c.json);
    }
}