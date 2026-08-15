import { useQuery } from "@tanstack/react-query";

import { getTransactionById } from "@/services/transactions/transactions-service";

import { queryWithCache } from "@/database/query";

const TRANSACTION_CACHE_MAX_AGE =
  1000 * 60 * 30;

export function useTransaction(
  transactionId: string | undefined
) {
  const queryKey = [
    "transaction",
    transactionId,
  ] as const;

  return useQuery({
    queryKey,

    queryFn: () => {
      if (!transactionId) {
        throw new Error(
          "Transaction ID is required."
        );
      }

      return queryWithCache(
        queryKey,
        () =>
          getTransactionById(
            transactionId
          ),
        {
          maxAge:
            TRANSACTION_CACHE_MAX_AGE,
        }
      );
    },

    enabled: Boolean(transactionId),
  });
}