import type { SQLiteDatabase } from "expo-sqlite";

export const DATABASE_VERSION = 8;

/**
 * Runs all database migrations.
 *
 * SQLite's user_version pragma is used to track the current
 * database schema version.
 */
export async function runMigrations(database: SQLiteDatabase): Promise<void> {
  const result = await database.getFirstAsync<{
    user_version: number;
  }>("PRAGMA user_version");

  const currentVersion = result?.user_version ?? 0;

  /**
   * --------------------------------------------------------------------------
   * Migration 1
   * --------------------------------------------------------------------------
   *
   * Generic persisted query cache.
   */
  if (currentVersion < 1) {
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS query_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        query_key TEXT NOT NULL UNIQUE,
        data TEXT NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_query_cache_updated_at
      ON query_cache(updated_at);

      PRAGMA user_version = 1;
    `);
  }

  /**
   * --------------------------------------------------------------------------
   * Migration 5
   * --------------------------------------------------------------------------
   *
   * Orders and related child records.
   */
  if (currentVersion < 5) {
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY NOT NULL,
        reference TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        customer_email TEXT,
        delivery_street TEXT,
        delivery_city TEXT,
        delivery_state TEXT,
        delivery_country TEXT,
        delivery_postal_code TEXT,
        total REAL NOT NULL,
        currency TEXT NOT NULL,
        payment_channel TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT,
        synced_at INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_orders_reference
      ON orders(reference);

      CREATE INDEX IF NOT EXISTS idx_orders_created_at
      ON orders(created_at);

      CREATE INDEX IF NOT EXISTS idx_orders_status
      ON orders(status);

      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        product_name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price REAL NOT NULL,
        subtotal REAL NOT NULL,
        currency TEXT NOT NULL,

        FOREIGN KEY (order_id)
          REFERENCES orders(id)
          ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_order_items_order_id
      ON order_items(order_id);

      CREATE TABLE IF NOT EXISTS order_status_history (
        id TEXT PRIMARY KEY NOT NULL,
        order_id TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_by TEXT NOT NULL,
        note TEXT,

        FOREIGN KEY (order_id)
          REFERENCES orders(id)
          ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id
      ON order_status_history(order_id);

      PRAGMA user_version = 5;
    `);
  }

  /**
   * --------------------------------------------------------------------------
   * Migration 6
   * --------------------------------------------------------------------------
   *
   * Payment transactions.
   */
  if (currentVersion < 6) {
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY NOT NULL,
        customer TEXT NOT NULL,
        type TEXT NOT NULL,
        status TEXT NOT NULL,
        channel TEXT NOT NULL,
        amount REAL NOT NULL,
        currency TEXT,
        reference TEXT NOT NULL,
        created_at TEXT NOT NULL,
        synced_at INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_transactions_created_at
      ON transactions(created_at);

      CREATE INDEX IF NOT EXISTS idx_transactions_reference
      ON transactions(reference);

      CREATE INDEX IF NOT EXISTS idx_transactions_status
      ON transactions(status);

      PRAGMA user_version = 6;
    `);
  }

  /**
   * --------------------------------------------------------------------------
   * Migration 7
   * --------------------------------------------------------------------------
   *
   * Stores and shipping regions.
   */
  if (currentVersion < 7) {
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS stores (
        store_id INTEGER PRIMARY KEY NOT NULL,
        store_name TEXT NOT NULL,
        store_reference TEXT NOT NULL,
        store_link TEXT NOT NULL,
        currency TEXT NOT NULL,
        welcome_message TEXT,
        description TEXT,
        is_active INTEGER NOT NULL,
        theme_color TEXT,
        callback_url TEXT,
        success_message TEXT,
        whatsapp_number TEXT,
        phone_number TEXT,
        email TEXT,
        instagram TEXT,
        facebook TEXT,
        twitter TEXT,
        products TEXT,
        discounts TEXT,
        updated_at INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_stores_reference
      ON stores(store_reference);

      CREATE INDEX IF NOT EXISTS idx_stores_name
      ON stores(store_name);

      CREATE INDEX IF NOT EXISTS idx_stores_active
      ON stores(is_active);

      CREATE TABLE IF NOT EXISTS shipping_regions (
        id INTEGER PRIMARY KEY NOT NULL,
        region TEXT NOT NULL,
        state TEXT NOT NULL,
        shipping_fee REAL NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_shipping_regions_region
      ON shipping_regions(region);

      CREATE INDEX IF NOT EXISTS idx_shipping_regions_state
      ON shipping_regions(state);

      PRAGMA user_version = 7;
    `);
  }

  /**
   * --------------------------------------------------------------------------
   * Migration 8
   * --------------------------------------------------------------------------
   *
   * Customers.
   *
   * The Xpress Customer API currently provides:
   *
   * - id
   * - firstName
   * - lastName
   * - email
   * - phoneNumber
   * - isBlackListed
   *
   * The remaining fields belong to the application's Customer model
   * and are persisted locally so the repository can reconstruct the
   * complete domain model.
   */
  if (currentVersion < 8) {
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        is_blacklisted INTEGER NOT NULL,
        customer_type TEXT NOT NULL,
        country TEXT NOT NULL,
        state TEXT NOT NULL,
        city TEXT NOT NULL,
        street TEXT NOT NULL,
        orders INTEGER NOT NULL,
        spent REAL NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        synced_at INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_customers_name
      ON customers(name);

      CREATE INDEX IF NOT EXISTS idx_customers_phone
      ON customers(phone);

      CREATE INDEX IF NOT EXISTS idx_customers_email
      ON customers(email);

      CREATE INDEX IF NOT EXISTS idx_customers_blacklisted
      ON customers(is_blacklisted);

      CREATE INDEX IF NOT EXISTS idx_customers_updated_at
      ON customers(updated_at);

      PRAGMA user_version = 8;
    `);
  }
}
