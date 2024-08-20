import { Context } from "hono";
import internalServerError from "../../utils/errorHandlers/error";
import prisma from "../../utils/prisma";

export default async function getPostCategoryController(c: Context) {
  try {
    const { post } = prisma(c.env.DATABASE_URL);
    const dbResponse = await post.findMany({
      select: {
        category: true,
      },
    });


    const categories = dbResponse.map(post => post.category);


    const uniqueCategories = Array.from(new Set(categories));

    return c.json({ success: true, categories: uniqueCategories });
  } catch (error) {
    console.error("Error:", error);
    return internalServerError(c.json);
  }
}
