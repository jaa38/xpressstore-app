import { useMutation, useQueryClient } from "@tanstack/react-query";

import { storeService } from "@/services/store/store-service";

import { queryKeys } from "@/lib/queryKeys";

import { USE_MOCK_STORES } from "@/mocks/config";

import { createMockStore } from "@/mocks/stores";

import type { CreateStoreRequest } from "@/types/store";

export function useCreateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateStoreRequest) => {
      if (USE_MOCK_STORES) {
        const store = createMockStore(payload);

        return {
          responseCode: "00",
          responseMessage: "Store created successfully.",
          data: store,
        };
      }

      return storeService.createStore(payload);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.stores,
      });
    },
  });
}
