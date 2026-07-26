import { z } from "zod";

export const paymentLinkSettingsSchema = z.object({
  expiryDate: z.date().nullable(),

  paymentType: z.enum([
    "one-time",
    "subscription",
  ]),

  allowMultiplePayments: z.boolean(),

  collectCustomerName: z.boolean(),

  collectCustomerEmail: z.boolean(),

  redirectUrl: z
    .string()
    .trim()
    .url("Enter a valid URL")
    .optional()
    .or(z.literal("")),
});

export type PaymentLinkSettingsForm = z.infer<
  typeof paymentLinkSettingsSchema
>;