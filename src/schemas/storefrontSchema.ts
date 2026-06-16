import { z } from "zod";

export const SHIPPING_CLASSES = [
  "Standard",
  "Express",
  "Bulky",
  "Fragile",
  "Digital",
] as const;

export const storefrontSchema = z.object({
  visible: z.boolean(),

  images: z.array(z.string()).max(5, "Maximum of 5 images allowed"),

  dimensions: z.object({
    weight: z.string().min(1, "Weight is required"),

    length: z.string().min(1, "Length is required"),

    width: z.string().min(1, "Width is required"),

    height: z.string().min(1, "Height is required"),
  }),

  shippingClass: z.enum(SHIPPING_CLASSES),

  deliveryNotes: z.string().max(300, "Maximum 300 characters").optional(),
});

export type StorefrontFormData = z.infer<typeof storefrontSchema>;
