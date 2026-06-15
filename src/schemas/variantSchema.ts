import { z } from "zod";

export const variantSchema = z
  .object({
    variantsEnabled: z.boolean(),

    variantTypes: z.array(
      z.object({
        name: z
          .string()
          .trim()
          .min(1, "Variant name is required"),

        options: z
          .array(
            z.string().trim().min(1)
          )
          .min(1, "Add at least one option"),
      })
    ),
  })
  .superRefine((data, ctx) => {
    if (
      data.variantsEnabled &&
      data.variantTypes.length === 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["variantTypes"],
        message: "Add at least one variant type",
      });
    }
  });

export type VariantFormData =
  z.infer<typeof variantSchema>;