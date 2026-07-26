import { z } from "zod";

export const paymentLinkInfoSchema = z.object({
  linkName: z
    .string()
    .trim()
    .min(3, "Link name must be at least 3 characters"),

  amount: z
    .string()
    .min(1, "Amount is required"),

  currency: z.enum([
    "NGN",
    "USD",
    "GBP",
    "EUR",
  ]),

  description: z
    .string()
    .optional(),
});

export type PaymentLinkInfoForm = z.infer<
  typeof paymentLinkInfoSchema
>;