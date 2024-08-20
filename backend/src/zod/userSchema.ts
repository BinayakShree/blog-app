import { z } from "zod";

export const signupSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" })
    .regex(/^\S+$/, { message: "Username must not contain spaces" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(20, { message: "Password must be at most 20 characters long" }),
});

export const signinSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(20, { message: "Password must be at most 20 characters long" }),
});

export const googleSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  profilePicture: z.string().min(6, {
    message: "Profile picture URL must be at least 6 characters long",
  }),
});

export const updateUserSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" })
    .regex(/^\S+$/, { message: "Username must not contain spaces" })
    .optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  profilePicture: z
    .string()
    .min(6, {
      message: "Profile picture URL must be at least 6 characters long",
    })
    .optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(20, { message: "Password must be at most 20 characters long" })
    .optional(),
});

export type signupType = z.infer<typeof signupSchema>;
export type signinType = z.infer<typeof signinSchema>;
export type googleType = z.infer<typeof googleSchema>;
export type updateUserType = z.infer<typeof updateUserSchema>;
