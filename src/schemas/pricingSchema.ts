import { z } from "zod";

export const pricingSchema = z.object({
  sellingPrice: z
    .string()
    .min(1, "Selling price is required"),

  costPrice: z.string(),

  currentStock: z.string(),

  lowStockAlert: z.string(),

  reorderLevel: z.string(),
});

export type PricingFormData =
  z.infer<typeof pricingSchema>;