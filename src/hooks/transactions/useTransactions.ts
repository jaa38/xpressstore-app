import { useQuery } from "@tanstack/react-query";

import {
  getTransactionsPage,
  type TransactionFilter,
} from "@/services/transactions/transactions-service";

import type { Transaction } from "@/types/transaction";

export interface TransactionsQueryResult {
  transactions: Transaction[];

  totalCount: number;

  pageNumber: number;

  pageSize: number;
}

export function useTransactions(
  page = 1,
  limit = 20,
  filter: Partial<TransactionFilter> = {}
) {
  return useQuery<TransactionsQueryResult, Error>({
    queryKey: [
      "transactions",
      page,
      limit,
      filter,
    ],

    queryFn: async () => {
      const response = await getTransactionsPage(
        page,
        limit,
        filter
      );

      return {
        transactions: response.transactions,

        totalCount: response.totalCount,

        pageNumber: response.pageNumber,

        pageSize: response.pageSize,
      };
    },

    placeholderData: (previousData) => previousData,
  });
}