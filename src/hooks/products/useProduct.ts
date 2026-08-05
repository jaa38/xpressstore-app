import { useQuery } from "@tanstack/react-query";

import { productService } from "@/services/products/productService";

import type { EditProduct } from "@/types/product";

export function useProduct(productId?: number) {
  const query = useQuery({
    queryKey: ["products", productId],

    queryFn: () => productService.getProduct(productId as number),

    enabled: !!productId,

    select: (response) => {
      const product = response.data;

      const editProduct: EditProduct = {
        ...product,

        category: product.productCategories?.[0]?.toString() ?? "",

        image: product.productImages?.[0]?.url ?? "",

        price: product.unitPrice,

        stock: product.totalInStock,

        visible: product.isActive,
      };

      return {
        ...response,
        data: editProduct,
      };
    },
  });

  return {
    product: query.data?.data,

    ...query,
  };
}
