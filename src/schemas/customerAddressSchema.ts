import { z } from "zod";

export const customerAddressSchema = z.object({
  country: z
    .string()
    .trim()
    .min(1, "Country is required"),

  state: z
    .string()
    .trim()
    .min(1, "State is required"),

  city: z
    .string()
    .trim()
    .min(1, "City is required"),

  street: z.string().trim(),
});

export type CustomerAddressForm = z.infer<
  typeof customerAddressSchema
>;