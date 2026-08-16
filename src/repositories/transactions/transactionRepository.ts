import type { Transaction } from "@/types/transaction";

export interface TransactionRepository {
  getTransactions(): Promise<Transaction[]>;

  getTransactionById(
    id: string
  ): Promise<Transaction | null>;

  saveTransactions(
    transactions: Transaction[]
  ): Promise<void>;

  saveTransaction(
    transaction: Transaction
  ): Promise<void>;

  deleteTransaction(
    id: string
  ): Promise<void>;

  clearTransactions(): Promise<void>;
}