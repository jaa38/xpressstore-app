import { useMutation, useQueryClient } from "@tanstack/react-query";

import { storeService } from "@/services/store/store-service";

import { queryKeys } from "@/lib/queryKeys";

import { USE_MOCK_STORES } from "@/mocks/config";

import { updateMockShippingRegion } from "@/mocks/stores";

import type { UpdateShippingRegionRequest } from "@/types/store";

export function useUpdateShippingRegion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateShippingRegionRequest) => {
      if (USE_MOCK_STORES) {
        const region = updateMockShippingRegion(payload);

        if (!region) {
          throw new Error("Shipping region not found.");
        }

        return {
          responseCode: "00",
          responseMessage: "Shipping region updated successfully.",
          data: region,
        };
      }

      return storeService.updateShippingRegion(payload);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.shippingRegions,
      });
    },
  });
}
