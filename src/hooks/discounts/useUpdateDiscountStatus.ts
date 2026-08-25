import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateDiscountStatus } from "@/services/discount/discount-service";

import { queryKeys } from "@/lib/queryKeys";

import { USE_MOCK_DISCOUNTS } from "@/mocks/config";
import { updateMockDiscountStatus } from "@/mocks/discounts";

import type { Discount } from "@/types/discount";

/**
 * ============================================================================
 * USE UPDATE DISCOUNT STATUS
 * ============================================================================
 */

interface UpdateDiscountStatusVariables {
  discountId: string;

  status: boolean;
}

export function useUpdateDiscountStatus() {
  const queryClient = useQueryClient();

  return useMutation<Discount | void, Error, UpdateDiscountStatusVariables>({
    mutationFn: async ({ discountId, status }) => {
      if (USE_MOCK_DISCOUNTS) {
        const discount = updateMockDiscountStatus(discountId, status);

        if (!discount) {
          throw new Error("Discount not found.");
        }

        return discount;
      }

      await updateDiscountStatus(discountId, status);

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
