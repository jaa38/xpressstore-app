import type {
  ProductVariant,
  ProductVariationDto,
  ProductOptionDto,
} from "@/types/product";

/**
 * Accepts variants from either:
 *
 * • Product Draft (Create Product)
 * • Merchant Product (Edit Product)
 */
type VariantInput = ProductVariant | ProductVariationDto;

interface VariantPayload {
  hasVariants: boolean;

  variations: ProductVariationDto[];

  options: ProductOptionDto[];
}

export function buildVariantPayload(
  variants: VariantInput[],
  enabled = variants.length > 0
): VariantPayload {
  const hasVariants = enabled && variants.length > 0;
  return {
    hasVariants,

    variations: variants.map((variant) => ({
      name: variant.name,
      options: [...variant.options],
    })),

    options: variants.map((variant) => ({
      name: variant.name,
      values: [...variant.options],
    })),
  };
}
