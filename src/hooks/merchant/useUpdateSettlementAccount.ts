import { useMutation, useQueryClient } from "@tanstack/react-query";

import { merchantService } from "@/services/merchant/merchantService";

import { ApiResponse } from "@/types/api";

import {
  SettlementAccount,
  UpdateSettlementAccountRequest,
} from "@/types/merchant";

import { queryKeys } from "@/lib/queryKeys";

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
     * OPTIMISTIC UPDATE
     * ------------------------------------------------------------------------
     */

    onMutate: async (payload: UpdateSettlementAccountRequest) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.settlementAccounts,
      });

      const previousAccounts = queryClient.getQueryData<
        ApiResponse<SettlementAccount[]>
      >(queryKeys.settlementAccounts);

      /**
       * Existing account
       */
      if (payload.settlementAccountId) {
        queryClient.setQueryData<ApiResponse<SettlementAccount[]>>(
          queryKeys.settlementAccounts,
          (oldData) => {
            if (!oldData?.data) {
              return oldData;
            }

            return {
              ...oldData,

              data: oldData.data.map((account) => {
                if (
                  String(account.settlementAccountId) !==
                  String(payload.settlementAccountId)
                ) {
                  return account;
                }

                return {
                  ...account,

                  accountNumber: payload.accountNumber,

                  accountName: payload.accountName,

                  bankName: payload.bankName,

                  bankCode: payload.bankCode,

                  isDefault: payload.isPrimary ?? account.isDefault,
                };
              }),
            };
          }
        );
      }

      return {
        previousAccounts,
      };
    },

    /**
     * ------------------------------------------------------------------------
     * ROLLBACK
     * ------------------------------------------------------------------------
     */

    onError: (_error, _payload, context) => {
      if (context?.previousAccounts) {
        queryClient.setQueryData(
          queryKeys.settlementAccounts,
          context.previousAccounts
        );
      }
    },

    /**
     * ------------------------------------------------------------------------
     * REFRESH FROM SOURCE OF TRUTH
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
