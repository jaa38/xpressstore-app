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

    queryFn: async () => {
      // console.log("====================================");
      // console.log("TRANSACTIONS QUERY RUNNING");
      // console.log("PAGE:", page);
      // console.log("LIMIT:", limit);
      // console.log("FILTER:", filter);

      const result = await queryWithCache(
        queryKey,
        async () => {
          console.log("CALLING getTransactionsPage()");

          const response = await getTransactionsPage(page, limit, filter);

          console.log("SERVICE RESPONSE:");
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

      // console.log("QUERY RESULT:");
      // console.log("TOTAL:", result.totalCount);
      // console.log("PAGE:", result.pageNumber);
      // console.log("TRANSACTIONS:", result.transactions.length);
      // console.log("====================================");

      return result;
    },
  });
}
