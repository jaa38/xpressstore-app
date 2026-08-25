import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteDiscount } from "@/services/discount/discount-service";

import { queryKeys } from "@/lib/queryKeys";

import { USE_MOCK_DISCOUNTS } from "@/mocks/config";
import { deleteMockDiscount } from "@/mocks/discounts";

/**
 * ============================================================================
 * USE DELETE DISCOUNT
 * ============================================================================
 */

export function useDeleteDiscount() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (discountId) => {
      if (USE_MOCK_DISCOUNTS) {
        const deleted = deleteMockDiscount(discountId);

        if (!deleted) {
          throw new Error("Discount not found.");
        }

        return;
      }

      await deleteDiscount(discountId);
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