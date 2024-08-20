import bcrypt from "bcryptjs";
import { Context } from "hono";
import { googleType, googleSchema } from "../../zod/userSchema";
import userInputError from "../../utils/errorHandlers/userInputError";
import prisma from "../../utils/prisma";
import internalServerError from "../../utils/errorHandlers/error";
import { Jwt } from "hono/utils/jwt";
import { setCookie } from "hono/cookie";

export default async function googleLoginController(c: Context) {
  try {
    const { user } = prisma(c.env.DATABASE_URL);
    const body: googleType = await c.req.json();
    const parsedBody = googleSchema.safeParse(body);
    if (!parsedBody.success) {
      return userInputError(parsedBody.error.format(), c.json);
    }
    const doesUserExist = await user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (doesUserExist) {
      const token = await Jwt.sign(
        {
          userId: doesUserExist.id,
          username: doesUserExist.username,
          isAdmin: doesUserExist.isAdmin,
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
          id: doesUserExist.id,
          username: doesUserExist.username,
          email: doesUserExist.email,
          isAdmin: doesUserExist.isAdmin,
          profilePicture: doesUserExist.profilePicture,
          createdAt: doesUserExist.createdAt,
          updatedAt: doesUserExist.updatedAt,
        },
      });
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const dbResponse = await user.create({
        data: {
          username:
            body.name.toLowerCase().split(" ").join("") +
            Math.random().toString(9).slice(-4),
          email: body.email,
          password: hashedPassword,
          profilePicture: body.profilePicture,
        },
      });

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
          profilePicture: dbResponse.profilePicture,
          isAdmin: dbResponse.isAdmin,
          createdAt: dbResponse.createdAt,
          updatedAt: dbResponse.updatedAt,
        },
      });
    }
  } catch (error) {
    return internalServerError(c.json);
  }
}
