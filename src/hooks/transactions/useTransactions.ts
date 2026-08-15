import { useQuery } from "@tanstack/react-query";

import {
  getTransactionsPage,
  type TransactionFilter,
} from "@/services/transactions/transactions-service";

import type { Transaction } from "@/types/transaction";

import { queryWithCache } from "@/database/query";

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
  const queryKey = ["transactions", page, limit, filter] as const;

  return useQuery<TransactionsQueryResult, Error>({
    queryKey,

    queryFn: () =>
      queryWithCache(
        queryKey,
        async () => {
          const response = await getTransactionsPage(page, limit, filter);

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
      ),

    placeholderData: (previousData) => previousData,
  });
}
