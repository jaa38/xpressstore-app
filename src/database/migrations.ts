import type { SQLiteDatabase } from "expo-sqlite";

export const DATABASE_VERSION = 1;

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
}
