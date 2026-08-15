import * as SQLite from "expo-sqlite";

const DATABASE_NAME = "xpressstore.db";

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

/**
 * Returns the application's SQLite database.
 *
 * The connection is created once and reused for the lifetime
 * of the application process.
 */
export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync(DATABASE_NAME);
  }

  return databasePromise;
}