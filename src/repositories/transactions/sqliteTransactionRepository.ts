import type { Transaction } from "@/types/transaction";

import { getDatabase } from "@/database";

import type { TransactionRepository } from "./transactionRepository";

/**
 * ============================================================================
 * SQLite Row Types
 * ============================================================================
 */

interface TransactionRow {
  id: string;

  merchant_id: string;

  customer: string;

  type: string;

  status: string;

  channel: string;

  amount: number;

  currency: string | null;

  reference: string;

  created_at: string;

  synced_at: number;
}

/**
 * ============================================================================
 * Mapping Helpers
 * ============================================================================
 */

function mapCurrency(value: string | null): Transaction["currency"] {
  switch (value?.trim().toUpperCase()) {
    case "NGN":
      return "NGN";

    case "USD":
      return "USD";

    case "GBP":
      return "GBP";

    case "EUR":
      return "EUR";

    default:
      return undefined;
  }
}

function mapTransactionType(value: string): Transaction["type"] {
  return value?.trim().toLowerCase() === "debit" ? "debit" : "credit";
}

function mapTransactionStatus(value: string): Transaction["status"] {
  switch (value?.trim().toLowerCase()) {
    case "paid":
      return "paid";

    case "pending":
      return "pending";

    case "failed":
    default:
      return "failed";
  }
}

function mapPaymentChannel(value: string): Transaction["channel"] {
  switch (value?.trim().toLowerCase()) {
    case "bank":
      return "bank";

    case "qr":
    case "nqr":
      return "qr";

    case "transfer":
    case "banktransfer":
    case "bank_transfer":
      return "transfer";

    case "ussd":
      return "ussd";

    case "card":
    default:
      return "card";
  }
}

function mapTransactionRow(row: TransactionRow): Transaction {
  return {
    id: row.id,

    customer: row.customer,

    type: mapTransactionType(row.type),

    status: mapTransactionStatus(row.status),

    channel: mapPaymentChannel(row.channel),

    amount: row.amount,

    currency: mapCurrency(row.currency),

    reference: row.reference,

    createdAt: row.created_at,
  };
}

/**
 * ============================================================================
 * SQLite Transaction Repository
 * ============================================================================
 */

class SQLiteTransactionRepository implements TransactionRepository {
  /**
   * --------------------------------------------------------------------------
   * Get Transactions
   * --------------------------------------------------------------------------
   */

  async getTransactions(merchantId: string): Promise<Transaction[]> {
    const database = await getDatabase();

    const rows = await database.getAllAsync<TransactionRow>(
      `
          SELECT
            id,
            merchant_id,
            customer,
            type,
            status,
            channel,
            amount,
            currency,
            reference,
            created_at,
            synced_at
          FROM transactions
          WHERE merchant_id = ?
          ORDER BY created_at DESC
        `,
      merchantId
    );

    return rows.map(mapTransactionRow);
  }

  /**
   * --------------------------------------------------------------------------
   * Get Transaction By ID
   * --------------------------------------------------------------------------
   */

  async getTransactionById(
    merchantId: string,
    id: string
  ): Promise<Transaction | null> {
    const database = await getDatabase();

    const row = await database.getFirstAsync<TransactionRow>(
      `
          SELECT
            id,
            merchant_id,
            customer,
            type,
            status,
            channel,
            amount,
            currency,
            reference,
            created_at,
            synced_at
          FROM transactions
          WHERE merchant_id = ?
            AND id = ?
          LIMIT 1
        `,
      merchantId,
      id
    );

    if (!row) {
      return null;
    }

    return mapTransactionRow(row);
  }

  /**
   * --------------------------------------------------------------------------
   * Save Transactions
   * --------------------------------------------------------------------------
   */

  async saveTransactions(
    merchantId: string,
    transactions: Transaction[]
  ): Promise<void> {
    const database = await getDatabase();

    await database.withTransactionAsync(async () => {
      for (const transaction of transactions) {
        await this.upsertTransaction(database, merchantId, transaction);
      }
    });
  }

  /**
   * --------------------------------------------------------------------------
   * Save Transaction
   * --------------------------------------------------------------------------
   */

  async saveTransaction(
    merchantId: string,
    transaction: Transaction
  ): Promise<void> {
    const database = await getDatabase();

    await database.withTransactionAsync(async () => {
      await this.upsertTransaction(database, merchantId, transaction);
    });
  }

  /**
   * --------------------------------------------------------------------------
   * Upsert Transaction
   * --------------------------------------------------------------------------
   */

  private async upsertTransaction(
    database: Awaited<ReturnType<typeof getDatabase>>,
    merchantId: string,
    transaction: Transaction
  ): Promise<void> {
    await database.runAsync(
      `
        INSERT INTO transactions (
          id,
          merchant_id,
          customer,
          type,
          status,
          channel,
          amount,
          currency,
          reference,
          created_at,
          synced_at
        )
        VALUES (
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?
        )
        ON CONFLICT(id)
        DO UPDATE SET
          merchant_id = excluded.merchant_id,
          customer = excluded.customer,
          type = excluded.type,
          status = excluded.status,
          channel = excluded.channel,
          amount = excluded.amount,
          currency = excluded.currency,
          reference = excluded.reference,
          created_at = excluded.created_at,
          synced_at = excluded.synced_at
      `,
      transaction.id,
      merchantId,
      transaction.customer,
      transaction.type,
      transaction.status,
      transaction.channel,
      transaction.amount,
      transaction.currency ?? null,
      transaction.reference,
      transaction.createdAt,
      Date.now()
    );
  }

  /**
   * --------------------------------------------------------------------------
   * Delete Transaction
   * --------------------------------------------------------------------------
   */

  async deleteTransaction(merchantId: string, id: string): Promise<void> {
    const database = await getDatabase();

    await database.runAsync(
      `
        DELETE FROM transactions
        WHERE merchant_id = ?
          AND id = ?
      `,
      merchantId,
      id
    );
  }

  /**
   * --------------------------------------------------------------------------
   * Clear Merchant Transactions
   * --------------------------------------------------------------------------
   */

  async clearTransactions(merchantId: string): Promise<void> {
    const database = await getDatabase();

    await database.runAsync(
      `
        DELETE FROM transactions
        WHERE merchant_id = ?
      `,
      merchantId
    );
  }
}

/**
 * ============================================================================
 * Repository Instance
 * ============================================================================
 */

export const transactionRepository = new SQLiteTransactionRepository();
