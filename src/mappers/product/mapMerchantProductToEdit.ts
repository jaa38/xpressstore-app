import type {
  EditProduct,
  MerchantProduct,
} from "@/types/product";

export function mapMerchantProductToEdit(
  product: MerchantProduct
): EditProduct {
  return {
    ...product,

    /**
     * UI aliases
     */
    category:
      product.productCategories?.[0]?.id?.toString() ?? "",

    image:
      product.productImages?.[0]?.url ?? "",

    price:
      product.unitPrice,

    stock:
      product.totalInStock,

    visible:
      product.isActive,
  };
}