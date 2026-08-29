import type { Transaction } from "@/types/transaction";

export interface TransactionRepository {
  getTransactions(merchantId: string): Promise<Transaction[]>;

  getTransactionById(
    merchantId: string,
    id: string
  ): Promise<Transaction | null>;

  saveTransactions(
    merchantId: string,
    transactions: Transaction[]
  ): Promise<void>;

  saveTransaction(merchantId: string, transaction: Transaction): Promise<void>;

  deleteTransaction(merchantId: string, id: string): Promise<void>;

  clearTransactions(merchantId: string): Promise<void>;
}
