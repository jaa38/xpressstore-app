import { getCachedQuery, setCachedQuery } from "@/database";

interface QueryCacheOptions {
  /**
   * Maximum age of cached data in milliseconds.
   *
   * Example:
   * 5 minutes = 5 * 60 * 1000
   */
  maxAge?: number;
}

const DEFAULT_MAX_AGE = 1000 * 60 * 30;

/**
 * Executes a network query and persists successful responses
 * into SQLite.
 *
 * If the network request fails, the most recent cached response
 * is returned when it is still within the configured max age.
 */
export async function queryWithCache<T>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<T>,
  options: QueryCacheOptions = {}
): Promise<T> {
  const maxAge = options.maxAge ?? DEFAULT_MAX_AGE;

  try {
    const data = await queryFn();

    await setCachedQuery(queryKey, data);

    return data;
  } catch (error) {
    const cachedQuery = await getCachedQuery<T>(queryKey);

    if (!cachedQuery) {
      throw error;
    }

    const cacheAge = Date.now() - cachedQuery.updatedAt;

    if (cacheAge > maxAge) {
      console.warn("Cached query data is stale.", {
        queryKey,
        cacheAge,
        maxAge,
      });

      throw error;
    }

    console.warn("Using cached query data because the network request failed.");

    return cachedQuery.data;
  }
}
