import { useQuery } from "@tanstack/react-query";

import { getTransactions } from "@/services/transactions/transactions-service";

import { Transaction } from "@/types/transaction";

export function useTransactions() {
  return useQuery<Transaction[], Error>({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });
}