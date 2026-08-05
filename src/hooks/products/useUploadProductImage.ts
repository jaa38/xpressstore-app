import { useMutation } from "@tanstack/react-query";

import { productService } from "@/services/products/productService";

export function useUploadProductImage() {
  return useMutation({
    mutationFn:
      productService.uploadProductImage,
  });
}