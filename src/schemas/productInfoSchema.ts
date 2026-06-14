import { z } from "zod";

export const productInfoSchema = z.object({
  productName: z
    .string()
    .min(1, "Product name is required"),

  description: z.string(),

  category: z
    .string()
    .min(1, "Please select a category"),

  brand: z.string(),

  sku: z.string(),

  image: z
    .string()
    .min(1, "Product image is required"),
});

export type ProductInfoForm =
  z.infer<typeof productInfoSchema>;