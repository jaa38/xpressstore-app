import type { SQLiteDatabase } from "expo-sqlite";

import { getDatabase } from "./database";
import { runMigrations } from "./migrations";

interface QueryCacheRow {
  query_key: string;
  data: string;
  updated_at: number;
}

let initializedDatabase: Promise<SQLiteDatabase> | null = null;

/**
 * Returns an initialized database.
 *
 * Migrations are guaranteed to run before the database
 * is used by the cache layer.
 */
async function getInitializedDatabase(): Promise<SQLiteDatabase> {
  if (!initializedDatabase) {
    initializedDatabase = (async () => {
      const database = await getDatabase();

      await runMigrations(database);

      return database;
    })();
  }

  return initializedDatabase;
}

/**
 * Converts a TanStack Query key into a stable string.
 */
function serializeQueryKey(queryKey: readonly unknown[]): string {
  return JSON.stringify(queryKey);
}

/**
 * Reads a cached query.
 *
 * Returns null when no cached value exists.
 */
export interface CachedQuery<T> {
  data: T;
  updatedAt: number;
}

export async function getCachedQuery<T>(
  queryKey: readonly unknown[]
): Promise<CachedQuery<T> | null> {
  const database = await getInitializedDatabase();

  const serializedKey = serializeQueryKey(queryKey);

  const row = await database.getFirstAsync<QueryCacheRow>(
    `
      SELECT
        query_key,
        data,
        updated_at
      FROM query_cache
      WHERE query_key = ?
      LIMIT 1
    `,
    serializedKey
  );

  if (!row) {
    return null;
  }

  try {
    return {
      data: JSON.parse(row.data) as T,
      updatedAt: row.updated_at,
    };
  } catch (error) {
    console.error("Failed to parse cached query data.", error);

    return null;
  }
}

/**
 * Saves a query response into SQLite.
 *
 * Existing entries with the same query key are replaced.
 */
export async function setCachedQuery<T>(
  queryKey: readonly unknown[],
  data: T
): Promise<void> {
  const database = await getInitializedDatabase();

  const serializedKey = serializeQueryKey(queryKey);

  const serializedData = JSON.stringify(data);

  const updatedAt = Date.now();

  await database.runAsync(
    `
      INSERT INTO query_cache (
        query_key,
        data,
        updated_at
      )
      VALUES (?, ?, ?)

      ON CONFLICT(query_key)
      DO UPDATE SET
        data = excluded.data,
        updated_at = excluded.updated_at
    `,
    serializedKey,
    serializedData,
    updatedAt
  );
}

/**
 * Removes a single cached query.
 */
export async function removeCachedQuery(
  queryKey: readonly unknown[]
): Promise<void> {
  const database = await getInitializedDatabase();

  const serializedKey = serializeQueryKey(queryKey);

  await database.runAsync(
    `
      DELETE FROM query_cache
      WHERE query_key = ?
    `,
    serializedKey
  );
}

/**
 * Removes every cached query.
 */
export async function clearQueryCache(): Promise<void> {
  const database = await getInitializedDatabase();

  await database.runAsync(`
    DELETE FROM query_cache
  `);
}
