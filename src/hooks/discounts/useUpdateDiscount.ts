import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateDiscount } from "@/services/discount/discount-service";

import { queryKeys } from "@/lib/queryKeys";

import { USE_MOCK_DISCOUNTS } from "@/mocks/config";
import { updateMockDiscount } from "@/mocks/discounts";

import type { Discount, UpdateDiscountRequest } from "@/types/discount";

/**
 * ============================================================================
 * USE UPDATE DISCOUNT
 * ============================================================================
 */

export function useUpdateDiscount() {
  const queryClient = useQueryClient();

  return useMutation<Discount | void, Error, UpdateDiscountRequest>({
    mutationFn: async (payload) => {
      if (USE_MOCK_DISCOUNTS) {
        const discount = updateMockDiscount(payload);

        if (!discount) {
          throw new Error("Discount not found.");
        }

        return discount;
      }

      await updateDiscount(payload);

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
