import { useMutation } from "@tanstack/react-query";

import { storeService } from "@/services/store/store-service";

import { USE_MOCK_STORES } from "@/mocks/config";

import { validateMockStoreReference } from "@/mocks/stores";

export function useValidateStoreReference() {
  return useMutation({
    mutationFn: async (reference: string) => {
      if (USE_MOCK_STORES) {
        return {
          responseCode: "00",
          responseMessage: "Store reference validation completed.",
          data: validateMockStoreReference(reference),
        };
      }

      return storeService.validateStoreReference(reference);
    },
  });
}
