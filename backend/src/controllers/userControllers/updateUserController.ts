import bcrypt from "bcryptjs";
import { Context } from "hono";
import { updateUserSchema, updateUserType } from "../../zod/userSchema";
import userInputError from "../../utils/errorHandlers/userInputError";
import prisma from "../../utils/prisma";
import internalServerError from "../../utils/errorHandlers/error";
import httpStatusCode from "../../utils/httpCode";

export default async function updateUserController(c: Context) {
  const { user } = prisma(c.env.DATABASE_URL);
  try {
    const body: updateUserType = await c.req.json();
    const userId = c.req.param("userId");
    const jwtPayload = c.get("jwtPayload");
    if (userId !== jwtPayload.userId) {
      return c.json(
        {
          success: false,
          error: "Unauthorized",
          statusCode: httpStatusCode.Unauthorized,
        },
        httpStatusCode.Unauthorized
      );
    }

    const parsedBody = updateUserSchema.safeParse(body);
    if (!parsedBody.success) {
      return userInputError(parsedBody.error.format(), c.json);
    }
    const updatePayload: updateUserType = {};
    if (body.email) {
      updatePayload.email = body.email;
    }
    if (body.username) {
      updatePayload.username = body.username;
    }
    if (body.profilePicture) {
      updatePayload.profilePicture = body.profilePicture;
    }
    if (body.password) {
      const hashedPassword = bcrypt.hashSync(body.password, 10);
      updatePayload.password = hashedPassword;
    }
    const dbResponse = await user.update({
      where: {
        id: userId,
      },
      data: updatePayload,
    });
    return c.json({
      success: true,
      data: {
        id: dbResponse.id,
        username: dbResponse.username,
        email: dbResponse.email,
        profilePicture: dbResponse.profilePicture,
        isAdmin: dbResponse.isAdmin,
        createdAt: dbResponse.createdAt,
        updatedAt: dbResponse.updatedAt,
      },
    });
  } catch (error) {
    return internalServerError(c.json);
  }
}
