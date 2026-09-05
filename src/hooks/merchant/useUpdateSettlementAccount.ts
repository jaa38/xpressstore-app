import { useMutation, useQueryClient } from "@tanstack/react-query";

import { merchantService } from "@/services/merchant/merchantService";

/**
 * ============================================================================
 * UPDATE SETTLEMENT ACCOUNT
 * ============================================================================
 */

export function useUpdateSettlementAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: merchantService.updateSettlementAccount,

    /**
     * ------------------------------------------------------------------------
     * REFRESH DEPENDENT DATA
     * ------------------------------------------------------------------------
     *
     * Once the settlement account has been successfully saved,
     * mark dependent cached data as stale.
     *
     * Because the HomeScreen actively uses the
     * ["settlement-accounts"] query, React Query will refetch it
     * and update the UI with the latest settlement account state.
     */

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["settlement-accounts"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["merchant-profile"],
      });
    },
  });
}