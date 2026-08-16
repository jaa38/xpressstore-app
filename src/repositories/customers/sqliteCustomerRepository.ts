import type {
  Customer,
  CustomerDraft,
} from "@/types/customer";

import { getDatabase } from "@/database";

import type { CustomerRepository } from "./customerRepository";

/**
 * ============================================================================
 * SQLite Row Types
 * ============================================================================
 */

interface CustomerRow {
  id: string;

  name: string;

  phone: string;

  email: string;

  is_blacklisted: number;

  customer_type: string;

  country: string;

  state: string;

  city: string;

  street: string;

  orders: number;

  spent: number;

  created_at: string;

  updated_at: string;

  synced_at: number;
}

/**
 * ============================================================================
 * Mapping Helpers
 * ============================================================================
 */

/**
 * Map a SQLite customer type into the application's
 * Customer customerType union.
 */
function mapCustomerType(
  value: string
): Customer["customerType"] {
  return value?.trim().toLowerCase() === "business"
    ? "business"
    : "individual";
}

/**
 * Map a SQLite row into the application's Customer model.
 */
function mapCustomerRow(
  row: CustomerRow
): Customer {
  return {
    id: row.id,

    name: row.name,

    phone: row.phone,

    email: row.email,

    isBlackListed:
      row.is_blacklisted === 1,

    customerType:
      mapCustomerType(
        row.customer_type
      ),

    country: row.country,

    state: row.state,

    city: row.city,

    street: row.street,

    orders: row.orders,

    spent: row.spent,

    created_at: row.created_at,

    updated_at: row.updated_at,
  };
}

/**
 * ============================================================================
 * SQLite Customer Repository
 * ============================================================================
 */

class SQLiteCustomerRepository
  implements CustomerRepository
{
  /**
   * --------------------------------------------------------------------------
   * Get Customers
   * --------------------------------------------------------------------------
   */

  async getCustomers(): Promise<Customer[]> {
    const database = await getDatabase();

    const rows =
      await database.getAllAsync<CustomerRow>(`
        SELECT
          id,
          name,
          phone,
          email,
          is_blacklisted,
          customer_type,
          country,
          state,
          city,
          street,
          orders,
          spent,
          created_at,
          updated_at,
          synced_at
        FROM customers
        ORDER BY name ASC
      `);

    return rows.map(mapCustomerRow);
  }

  /**
   * --------------------------------------------------------------------------
   * Get Customer By ID
   * --------------------------------------------------------------------------
   */

  async getCustomerById(
    id: string
  ): Promise<Customer | null> {
    const database = await getDatabase();

    const row =
      await database.getFirstAsync<CustomerRow>(
        `
          SELECT
            id,
            name,
            phone,
            email,
            is_blacklisted,
            customer_type,
            country,
            state,
            city,
            street,
            orders,
            spent,
            created_at,
            updated_at,
            synced_at
          FROM customers
          WHERE id = ?
          LIMIT 1
        `,
        id
      );

    if (!row) {
      return null;
    }

    return mapCustomerRow(row);
  }

  /**
   * --------------------------------------------------------------------------
   * Save Customers
   * --------------------------------------------------------------------------
   *
   * Persists the latest successful API response.
   */
  async saveCustomers(
    customers: Customer[]
  ): Promise<void> {
    const database = await getDatabase();

    await database.withTransactionAsync(
      async () => {
        for (const customer of customers) {
          await this.upsertCustomer(
            database,
            customer
          );
        }
      }
    );
  }

  /**
   * --------------------------------------------------------------------------
   * Save Customer
   * --------------------------------------------------------------------------
   */

  async saveCustomer(
    customer: Customer
  ): Promise<void> {
    const database = await getDatabase();

    await database.withTransactionAsync(
      async () => {
        await this.upsertCustomer(
          database,
          customer
        );
      }
    );
  }

  /**
   * --------------------------------------------------------------------------
   * Upsert Customer
   * --------------------------------------------------------------------------
   */

  private async upsertCustomer(
    database: Awaited<
      ReturnType<typeof getDatabase>
    >,
    customer: Customer
  ): Promise<void> {
    await database.runAsync(
      `
        INSERT INTO customers (
          id,
          name,
          phone,
          email,
          is_blacklisted,
          customer_type,
          country,
          state,
          city,
          street,
          orders,
          spent,
          created_at,
          updated_at,
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
          ?,
          ?,
          ?,
          ?,
          ?
        )
        ON CONFLICT(id)
        DO UPDATE SET
          name = excluded.name,
          phone = excluded.phone,
          email = excluded.email,
          is_blacklisted = excluded.is_blacklisted,
          customer_type = excluded.customer_type,
          country = excluded.country,
          state = excluded.state,
          city = excluded.city,
          street = excluded.street,
          orders = excluded.orders,
          spent = excluded.spent,
          created_at = excluded.created_at,
          updated_at = excluded.updated_at,
          synced_at = excluded.synced_at
      `,
      customer.id,

      customer.name,

      customer.phone,

      customer.email,

      customer.isBlackListed ? 1 : 0,

      customer.customerType,

      customer.country,

      customer.state,

      customer.city,

      customer.street,

      customer.orders,

      customer.spent,

      customer.created_at,

      customer.updated_at,

      Date.now()
    );
  }

  /**
   * --------------------------------------------------------------------------
   * Save Draft
   * --------------------------------------------------------------------------
   *
   * CustomerDraft is currently managed by the Zustand customer store.
   *
   * It does not have a persistent customer ID and there are currently
   * no callers of this repository method. We therefore deliberately do
   * not create a fake Customer record from a draft.
   *
   * If draft persistence is required later, it should have its own
   * customer_drafts table and migration.
   */
  async saveDraft(
    _draft: CustomerDraft
  ): Promise<void> {
    throw new Error(
      "Customer draft persistence is not currently implemented."
    );
  }

  /**
   * --------------------------------------------------------------------------
   * Delete Customer
   * --------------------------------------------------------------------------
   *
   * This removes the customer from the local SQLite cache.
   *
   * The remote service currently maps deleteCustomer() to the
   * BlackListCustomer API operation rather than an actual DELETE endpoint.
   */
  async deleteCustomer(
    id: string
  ): Promise<void> {
    const database = await getDatabase();

    await database.runAsync(
      `
        DELETE FROM customers
        WHERE id = ?
      `,
      id
    );
  }

  /**
   * --------------------------------------------------------------------------
   * Clear Customers
   * --------------------------------------------------------------------------
   */

  async clearCustomers(): Promise<void> {
    const database = await getDatabase();

    await database.runAsync(`
      DELETE FROM customers
    `);
  }
}

/**
 * ============================================================================
 * Repository Instance
 * ============================================================================
 */

export const customerRepository =
  new SQLiteCustomerRepository();