import { useMutation } from "@tanstack/react-query";

import { storeService } from "@/services/store/storeService";

export function useValidateStoreReference() {
  return useMutation({
    mutationFn: storeService.validateStoreReference,
  });
}