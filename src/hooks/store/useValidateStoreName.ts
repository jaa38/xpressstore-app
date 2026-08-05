import { useMutation } from "@tanstack/react-query";

import { storeService } from "@/services/store/storeService";

export function useValidateStoreName() {
  return useMutation({
    mutationFn: storeService.validateStoreName,
  });
}