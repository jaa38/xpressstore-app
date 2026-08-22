import { useMutation, useQueryClient } from "@tanstack/react-query";

import { storeService } from "@/services/store/store-service";

import { queryKeys } from "@/lib/queryKeys";

import { USE_MOCK_STORES } from "@/mocks/config";

import { deleteMockShippingRegion } from "@/mocks/stores";

export function useDeleteShippingRegion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (regionId: number) => {
      if (USE_MOCK_STORES) {
        const deleted = deleteMockShippingRegion(regionId);

        if (!deleted) {
          throw new Error("Shipping region not found.");
        }

        return {
          responseCode: "00",
          responseMessage: "Shipping region deleted successfully.",
          data: undefined,
        };
      }

      return storeService.deleteShippingRegion(regionId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.shippingRegions,
      });
    },
  });
}
