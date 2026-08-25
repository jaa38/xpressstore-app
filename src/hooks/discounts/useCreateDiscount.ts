import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createDiscount } from "@/services/discount/discount-service";

import { queryKeys } from "@/lib/queryKeys";

import { USE_MOCK_DISCOUNTS } from "@/mocks/config";
import { createMockDiscount } from "@/mocks/discounts";

import type { CreateDiscountRequest, Discount } from "@/types/discount";

/**
 * ============================================================================
 * USE CREATE DISCOUNT
 * ============================================================================
 */

export function useCreateDiscount() {
  const queryClient = useQueryClient();

  return useMutation<Discount | void, Error, CreateDiscountRequest>({
    mutationFn: async (payload) => {
      if (USE_MOCK_DISCOUNTS) {
        return createMockDiscount(payload);
      }

      await createDiscount(payload);

      return undefined;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.discounts,
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.stores,
      });
    },
  });
}
