import { useMutation, useQueryClient } from "@tanstack/react-query";

import { merchantService } from "@/services/merchant/merchantService";

import { ApiResponse } from "@/types/api";

import { SettlementAccount } from "@/types/merchant";

import { queryKeys } from "@/lib/queryKeys";

/**
 * ============================================================================
 * SET PRIMARY SETTLEMENT ACCOUNT
 * ============================================================================
 */

export function useSetPrimarySettlementAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (account: SettlementAccount) => {
      return merchantService.updateSettlementAccount({
        settlementAccountId: account.settlementAccountId,

        accountNumber: account.accountNumber,

        accountName: account.accountName,

        bankName: account.bankName,

        bankCode: account.bankCode,

        isPrimary: true,
      });
    },

    /**
     * ------------------------------------------------------------------------
     * OPTIMISTIC UPDATE
     * ------------------------------------------------------------------------
     */

    onMutate: async (selectedAccount) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.settlementAccounts,
      });

      const previousAccounts = queryClient.getQueryData<
        ApiResponse<SettlementAccount[]>
      >(queryKeys.settlementAccounts);

      queryClient.setQueryData<ApiResponse<SettlementAccount[]>>(
        queryKeys.settlementAccounts,
        (oldData) => {
          if (!oldData?.data) {
            return oldData;
          }

          return {
            ...oldData,

            data: oldData.data.map((account) => ({
              ...account,

              isDefault:
                String(account.settlementAccountId) ===
                String(selectedAccount.settlementAccountId),
            })),
          };
        }
      );

      return {
        previousAccounts,
      };
    },

    /**
     * ------------------------------------------------------------------------
     * ROLLBACK
     * ------------------------------------------------------------------------
     */

    onError: (_error, _account, context) => {
      if (context?.previousAccounts) {
        queryClient.setQueryData(
          queryKeys.settlementAccounts,
          context.previousAccounts
        );
      }
    },

    /**
     * ------------------------------------------------------------------------
     * REFRESH
     * ------------------------------------------------------------------------
     */

    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.settlementAccounts,
        }),

        queryClient.invalidateQueries({
          queryKey: queryKeys.merchantProfile,
        }),
      ]);
    },
  });
}
