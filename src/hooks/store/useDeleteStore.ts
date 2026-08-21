import { useMutation, useQueryClient } from "@tanstack/react-query";

import { storeService } from "@/services/store/store-service";

import { queryKeys } from "@/lib/queryKeys";

import { USE_MOCK_STORES } from "@/mocks/config";

import { deleteMockStore } from "@/mocks/stores";

export function useDeleteStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (storeId: number) => {
      if (USE_MOCK_STORES) {
        const deleted = deleteMockStore(storeId);

        if (!deleted) {
          throw new Error("Store not found.");
        }

        return {
          responseCode: "00",
          responseMessage: "Store deleted successfully.",
          data: undefined,
        };
      }

      return storeService.deleteStore(storeId);
    },

    onSuccess: (_data, storeId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.stores,
      });

      queryClient.removeQueries({
        queryKey: queryKeys.store(storeId),
      });
    },
  });
}
