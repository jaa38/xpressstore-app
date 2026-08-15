import { useQuery } from "@tanstack/react-query";

import { getTransactionById } from "@/services/transactions/transactions-service";

export function useTransaction(transactionId: string | undefined) {
  return useQuery({
    queryKey: ["transaction", transactionId],

    queryFn: () => {
      if (!transactionId) {
        throw new Error("Transaction ID is required.");
      }

      return getTransactionById(transactionId);
    },

    enabled: Boolean(transactionId),
  });
}
