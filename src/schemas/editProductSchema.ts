import { z } from "zod";

export const editProductSchema = z.object({
  productName: z
    .string()
    .trim()
    .min(1, "Product name is required"),

  category: z
    .string()
    .min(1, "Category is required"),

  description: z.string(),

  price: z
    .string()
    .min(1, "Selling price is required")
    .refine(
      (value) => !isNaN(Number(value)) && Number(value) >= 0,
      "Enter a valid price"
    ),

  stock: z
    .string()
    .min(1, "Stock is required")
    .refine(
      (value) => Number.isInteger(Number(value)) && Number(value) >= 0,
      "Enter a valid stock quantity"
    ),
});

export type EditProductForm = z.infer<
  typeof editProductSchema
>;