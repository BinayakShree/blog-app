import bcrypt from "bcryptjs";
import { Context } from "hono";
import prisma from "../../utils/prisma";
import { signinSchema, signinType } from "../../zod/userSchema";
import userInputError from "../../utils/errorHandlers/userInputError";
import internalServerError from "../../utils/errorHandlers/error";
import httpStatusCode from "../../utils/httpCode";
import { Jwt } from "hono/utils/jwt";
import { setCookie } from "hono/cookie";

export default async function signinController(c: Context) {
  try {
    const { user } = prisma(c.env.DATABASE_URL);
    const body: signinType = await c.req.json();
    const parsedBody = signinSchema.safeParse(body);
    if (!parsedBody.success) {
      return userInputError(parsedBody.error.format(), c.json);
    }
    const dbResponse = await user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!dbResponse) {
      return c.json(
        {
          success: false,
          error: "User does not exist",
          statusCode: httpStatusCode.BadRequest,
        },
        httpStatusCode.BadRequest
      );
    }
    const validPassword = bcrypt.compareSync(
      body.password,
      dbResponse.password
    );

    if (!validPassword) {
      return c.json(
        {
          success: false,
          error: "Invalid password",
          statusCode: httpStatusCode.BadRequest,
        },
        httpStatusCode.BadRequest
      );
    }
    const token = await Jwt.sign(
      {
        userId: dbResponse.id,
        username: dbResponse.username,
        isAdmin: dbResponse.isAdmin,
      },
      c.env.JWT_SECRET
    );
    setCookie(c, "access-token", token, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    return c.json({
      success: true,
      data: {
        id: dbResponse.id,
        username: dbResponse.username,
        email: dbResponse.email,
        isAdmin: dbResponse.isAdmin,
        profilePicture: dbResponse.profilePicture,
        createdAt: dbResponse.createdAt,
        updatedAt: dbResponse.updatedAt,
      },
    });
  } catch (error) {
    return internalServerError(c.json);
  }
}
