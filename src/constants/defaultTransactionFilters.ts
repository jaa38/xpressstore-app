import { TransactionFilters } from "@/types/transactionFilters";

export const defaultTransactionFilters: TransactionFilters = {
  status: "all",

  channel: "all",

  type: "all",

  amount: {
    min: undefined,
    max: undefined,
  },

  date: {
    start: undefined,
    end: undefined,
  },
};