import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(),

  password: z
    .string()
    .min(6),
});

export type LoginSchema =
  z.infer<typeof loginSchema>;

export const signupSchema =
  z.object({
    email: z.email(),

    password: z
      .string()
      .min(6),
  });

export type SignupSchema =
  z.infer<typeof signupSchema>;