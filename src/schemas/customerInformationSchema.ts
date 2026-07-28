import { z } from "zod";

export const customerInformationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Customer name is required"),

  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required"),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .or(z.literal("")),

  customerType: z.enum(["individual", "business"]),
});

export type CustomerInformationForm = z.infer<
  typeof customerInformationSchema
>;