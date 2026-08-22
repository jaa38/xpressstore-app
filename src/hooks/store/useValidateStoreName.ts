import { useMutation } from "@tanstack/react-query";

import { storeService } from "@/services/store/store-service";

import { USE_MOCK_STORES } from "@/mocks/config";

import { validateMockStoreName } from "@/mocks/stores";

export function useValidateStoreName() {
  return useMutation({
    mutationFn: async (storeName: string) => {
      if (USE_MOCK_STORES) {
        return {
          responseCode: "00",
          responseMessage: "Store name validation completed.",
          data: validateMockStoreName(storeName),
        };
      }

      return storeService.validateStoreName(storeName);
    },
  });
}
