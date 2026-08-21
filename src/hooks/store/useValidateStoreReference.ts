import { useMutation } from "@tanstack/react-query";

import { storeService } from "@/services/store/store-service";

export function useValidateStoreReference() {
  return useMutation({
    mutationFn: storeService.validateStoreReference,
  });
}
