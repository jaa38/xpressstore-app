import { z } from "zod";

export const paymentLinkInfoSchema = z.object({
  /**
   * ---------------------------------------------------------------------------
   * Payment Link Name
   * ---------------------------------------------------------------------------
   */
  linkName: z
    .string()
    .trim()
    .min(
      3,
      "Link name must be at least 3 characters"
    ),

  /**
   * ---------------------------------------------------------------------------
   * Payment Amount
   * ---------------------------------------------------------------------------
   */
  amount: z
    .string()
    .trim()
    .min(
      1,
      "Amount is required"
    ),

  /**
   * ---------------------------------------------------------------------------
   * Currency
   * ---------------------------------------------------------------------------
   */
  currency: z.enum([
    "NGN",
    "USD",
    "GBP",
    "EUR",
  ]),

  /**
   * ---------------------------------------------------------------------------
   * Description
   * ---------------------------------------------------------------------------
   *
   * The current Payment Pages API expects `description` as a string.
   *
   * The UI still treats this field as optional, but an empty string is used
   * when the merchant does not provide a description.
   */
  description: z.string(),
});

export type PaymentLinkInfoForm = z.infer<
  typeof paymentLinkInfoSchema
>;