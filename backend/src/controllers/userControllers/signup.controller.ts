import bcrypt from "bcryptjs";
import { Context } from "hono";
import { signupSchema, signupType } from "../../zod/userSchema";
import httpStatusCode from "../../utils/httpCode";
import { Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import userInputError from "../../utils/errorHandlers/userInputError";
import internalServerError from "../../utils/errorHandlers/error";

export default async function signupController(c: Context) {
  const { user } = prisma(c.env.DATABASE_URL);
  try {
    const body: signupType = await c.req.json();
    const parsedBody = signupSchema.safeParse(body);
    if (!parsedBody.success) {
      return userInputError(parsedBody.error.format(), c.json);
    }
    const hashedPassword = bcrypt.hashSync(body.password, 10);
    const dbResponse = await user.create({
      data: {
        username: body.username,
        email: body.email,
        password: hashedPassword,
      },
    });

    return c.json(
      {
        success: true,
        data: {
          id: dbResponse.id,
          username: dbResponse.username,
          email: dbResponse.email,
          profilePicture: dbResponse.profilePicture,
          createdAt: dbResponse.createdAt,
          updatedAt: dbResponse.updatedAt,
        },
        statusCode: httpStatusCode.OK,
      },
      httpStatusCode.OK
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return c.json(
        {
          success: false,
          error: "User already exists",
          statusCode: httpStatusCode.BadRequest,
        },
        httpStatusCode.BadRequest
      );
    }
    return internalServerError(c.json);
  }
}
