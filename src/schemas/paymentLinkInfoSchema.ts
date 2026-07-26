import { z } from "zod";

export const paymentLinkInfoSchema = z.object({
  linkName: z
    .string()
    .trim()
    .min(1, "Link name is required")
    .max(100, "Link name cannot exceed 100 characters"),

  amount: z
    .string()
    .trim()
    .min(1, "Amount is required")
    .refine(
      (value) => {
        const amount = Number(value);
        return !isNaN(amount) && amount > 0;
      },
      {
        message: "Enter a valid amount greater than 0",
      }
    ),

  currency: z.string().trim().min(1, "Currency is required"),

  description: z
    .string()
    .trim()
    .max(250, "Description cannot exceed 250 characters")
    .optional()
    .or(z.literal("")),
});

export type PaymentLinkInfoForm = z.infer<typeof paymentLinkInfoSchema>;
