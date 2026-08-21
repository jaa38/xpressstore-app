import { useMutation } from "@tanstack/react-query";

import { storeService } from "@/services/store/store-service";

export function useValidateStoreName() {
  return useMutation({
    mutationFn: storeService.validateStoreName,
  });
}
