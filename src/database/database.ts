import * as SQLite from "expo-sqlite";

import { runMigrations } from "./migrations";

const DATABASE_NAME = "xpressstore.db";

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

/**
 * Returns the application's initialized SQLite database.
 *
 * The connection is created once and reused for the lifetime
 * of the application process.
 */
export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = initializeDatabase();
  }

  return databasePromise;
}

async function initializeDatabase(): Promise<SQLite.SQLiteDatabase> {
  const database =
    await SQLite.openDatabaseAsync(DATABASE_NAME);

  await database.execAsync(`
    PRAGMA foreign_keys = ON;
  `);

  await runMigrations(database);

  return database;
}