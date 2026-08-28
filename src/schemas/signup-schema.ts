import { z } from "zod";

export const signupSchema = z.object({
  firstName: z.string().trim().min(2, "Please enter your first name"),

  lastName: z.string().trim().min(2, "Please enter your last name"),

  email: z.email("Please enter a valid email address"),

  phoneNumber: z.string().trim().min(10, "Please enter a valid phone number"),
});

export type SignupSchema = z.infer<typeof signupSchema>;
