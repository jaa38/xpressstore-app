import { useMutation, useQueryClient } from "@tanstack/react-query";

import { storeService } from "@/services/store/store-service";

import { queryKeys } from "@/lib/queryKeys";

import { USE_MOCK_STORES } from "@/mocks/config";

import { createMockShippingRegion } from "@/mocks/stores";

import type { CreateShippingRegionRequest } from "@/types/store";

export function useCreateShippingRegion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateShippingRegionRequest) => {
      if (USE_MOCK_STORES) {
        const region = createMockShippingRegion(payload);

        return {
          responseCode: "00",
          responseMessage: "Shipping region created successfully.",
          data: region,
        };
      }

      return storeService.createShippingRegion(payload);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.shippingRegions,
      });
    },
  });
}
