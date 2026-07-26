import { z } from "zod";

export const paymentLinkSettingsSchema = z.object({
  expiryDate: z.date().nullable(),

  collectCustomerName: z.boolean(),

  collectCustomerEmail: z.boolean(),

  allowMultiplePayments: z.boolean(),

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