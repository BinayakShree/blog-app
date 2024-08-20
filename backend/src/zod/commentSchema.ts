import { z } from "zod";

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Comment cannot be empty" })
    .max(200, { message: "Comment cannot be longer than 200 characters" }),
  postId: z.string(),
  userId: z.string(),
});
export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Comment cannot be empty" })
    .max(200, { message: "Comment cannot be longer than 200 characters" }),
});
export type createCommentType = z.infer<typeof createCommentSchema>;
export type updateCommentType = z.infer<typeof updateCommentSchema>;
