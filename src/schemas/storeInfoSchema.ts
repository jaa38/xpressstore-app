import { z } from "zod";

/**
 * ============================================================================
 * Store Information Schema
 * ============================================================================
 */

export const storeInfoSchema = z.object({
  /**
   * Store display name.
   */
  storeName: z
    .string()
    .trim()
    .min(3, "Store name must be at least 3 characters"),

  /**
   * Store URL slug.
   *
   * The API documentation specifies that this must not contain spaces.
   */
  storeReference: z
    .string()
    .trim()
    .min(3, "Store reference must be at least 3 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and hyphens only"
    ),

  /**
   * Supported Store API currencies.
   */
  currency: z.enum(["NGN", "USD", "GBP", "EUR"]),

  /**
   * Optional store description.
   */
  description: z.string().max(250, "Maximum 250 characters"),

  /**
   * Optional welcome message.
   */
  welcomeMessage: z.string().max(250, "Maximum 250 characters"),
});

export type StoreInfoForm = z.infer<typeof storeInfoSchema>;
