import { useQuery } from "@tanstack/react-query";

import {
  getTransactionsPage,
  type TransactionFilter,
} from "@/services/transactions/transactions-service";

import type { Transaction } from "@/types/transaction";

import { queryWithCache } from "@/database/query";

import { useAuth } from "@/providers/AuthProvider";

export interface TransactionsQueryResult {
  transactions: Transaction[];

  totalCount: number;

  pageNumber: number;

  pageSize: number;
}

const TRANSACTIONS_CACHE_MAX_AGE = 1000 * 60 * 30;

export function useTransactions(
  page = 1,
  limit = 20,
  filter: Partial<TransactionFilter> = {}
) {
  /**
   * --------------------------------------------------------------------------
   * AUTHENTICATED MERCHANT
   * --------------------------------------------------------------------------
   */

  const { user } = useAuth();

  const merchantId = user?.merchantDetails?.merchantId ?? null;

  /**
   * --------------------------------------------------------------------------
   * MERCHANT-SCOPED QUERY KEY
   * --------------------------------------------------------------------------
   *
   * IMPORTANT:
   *
   * Merchant ID is part of the query key.
   *
   * This prevents React Query from sharing transaction data between
   * different merchants.
   *
   * Example:
   *
   * ["transactions", "mock-merchant-001", 1, 20, {}]
   *
   * is different from:
   *
   * ["transactions", "mock-merchant-002", 1, 20, {}]
   */

  const queryKey = ["transactions", merchantId, page, limit, filter] as const;

  /**
   * --------------------------------------------------------------------------
   * QUERY
   * --------------------------------------------------------------------------
   */

  return useQuery<TransactionsQueryResult, Error>({
    queryKey,

    /**
     * Do not execute the transaction query until an authenticated merchant
     * exists.
     */
    enabled: !!merchantId,

    queryFn: async () => {
      /**
       * The query should never execute without a merchant ID because
       * `enabled` prevents that. This guard also protects the service layer
       * from accidentally receiving an undefined merchant.
       */

      if (!merchantId) {
        throw new Error(
          "Unable to load transactions without an authenticated merchant."
        );
      }

      const result = await queryWithCache(
        queryKey,

        async () => {
          console.log("CALLING getTransactionsPage()", {
            merchantId,
            page,
            limit,
            filter,
          });

          const response = await getTransactionsPage(page, limit, filter);

          console.log("SERVICE RESPONSE:");
          console.log("MERCHANT:", merchantId);
          console.log("TOTAL:", response.totalCount);
          console.log("PAGE:", response.pageNumber);
          console.log("SIZE:", response.pageSize);
          console.log("TRANSACTIONS:", response.transactions.length);

          return {
            transactions: response.transactions,

            totalCount: response.totalCount,

            pageNumber: response.pageNumber,

            pageSize: response.pageSize,
          };
        },

        {
          maxAge: TRANSACTIONS_CACHE_MAX_AGE,
        }
      );

      return result;
    },
  });
}
