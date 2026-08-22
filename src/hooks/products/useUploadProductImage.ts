import { useMutation } from "@tanstack/react-query";

import { productService } from "@/services/products/product-service";

export function useUploadProductImage() {
  return useMutation({
    mutationFn: productService.uploadProductImage,
  });
}
