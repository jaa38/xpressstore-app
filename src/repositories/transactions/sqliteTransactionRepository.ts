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

/**
 * Map a SQLite currency value into the application's Currency type.
 */
function mapCurrency(
  value: string | null
): Transaction["currency"] {
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

/**
 * Map a SQLite value into the application's transaction type.
 */
function mapTransactionType(
  value: string
): Transaction["type"] {
  return value?.trim().toLowerCase() === "debit"
    ? "debit"
    : "credit";
}

/**
 * Map a SQLite value into the application's transaction status.
 */
function mapTransactionStatus(
  value: string
): Transaction["status"] {
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

/**
 * Map a SQLite value into the application's payment channel.
 */
function mapPaymentChannel(
  value: string
): Transaction["channel"] {
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

/**
 * Map a SQLite transaction row into the application domain model.
 */
function mapTransactionRow(
  row: TransactionRow
): Transaction {
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
 * SQLite Repository
 * ============================================================================
 */

class SQLiteTransactionRepository
  implements TransactionRepository
{
  /**
   * --------------------------------------------------------------------------
   * Get Transactions
   * --------------------------------------------------------------------------
   */

  async getTransactions(): Promise<Transaction[]> {
    const database = await getDatabase();

    const rows =
      await database.getAllAsync<TransactionRow>(`
        SELECT
          id,
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
        ORDER BY created_at DESC
      `);

    return rows.map(mapTransactionRow);
  }

  /**
   * --------------------------------------------------------------------------
   * Get Transaction By ID
   * --------------------------------------------------------------------------
   */

  async getTransactionById(
    id: string
  ): Promise<Transaction | null> {
    const database = await getDatabase();

    const row =
      await database.getFirstAsync<TransactionRow>(
        `
          SELECT
            id,
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
          WHERE id = ?
          LIMIT 1
        `,
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
    transactions: Transaction[]
  ): Promise<void> {
    const database = await getDatabase();

    await database.withTransactionAsync(
      async () => {
        for (const transaction of transactions) {
          await this.upsertTransaction(
            database,
            transaction
          );
        }
      }
    );
  }

  /**
   * --------------------------------------------------------------------------
   * Save Transaction
   * --------------------------------------------------------------------------
   */

  async saveTransaction(
    transaction: Transaction
  ): Promise<void> {
    const database = await getDatabase();

    await database.withTransactionAsync(
      async () => {
        await this.upsertTransaction(
          database,
          transaction
        );
      }
    );
  }

  /**
   * --------------------------------------------------------------------------
   * Upsert Transaction
   * --------------------------------------------------------------------------
   */

  private async upsertTransaction(
    database: Awaited<
      ReturnType<typeof getDatabase>
    >,
    transaction: Transaction
  ): Promise<void> {
    await database.runAsync(
      `
        INSERT INTO transactions (
          id,
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
          ?
        )
        ON CONFLICT(id)
        DO UPDATE SET
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

  async deleteTransaction(
    id: string
  ): Promise<void> {
    const database = await getDatabase();

    await database.runAsync(
      `
        DELETE FROM transactions
        WHERE id = ?
      `,
      id
    );
  }

  /**
   * --------------------------------------------------------------------------
   * Clear Transactions
   * --------------------------------------------------------------------------
   */

  async clearTransactions(): Promise<void> {
    const database = await getDatabase();

    await database.runAsync(`
      DELETE FROM transactions
    `);
  }
}

/**
 * ============================================================================
 * Repository Instance
 * ============================================================================
 */

export const transactionRepository =
  new SQLiteTransactionRepository();
