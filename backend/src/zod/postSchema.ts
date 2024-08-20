import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(3, { message: "Title should be longer" }),
  content: z
    .string()
    .min(10, { message: "Content Shall be atleast 10 letters" }),
  category: z.string().min(1, { message: "Please choose Category" }),
  image: z.string().optional(),
});
export type createPostType = z.infer<typeof createPostSchema>;
