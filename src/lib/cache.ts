/**
 * Simple in-memory cache for high-traffic pages.
 * Avoids hitting the database on every single request.
 *
 * For multi-instance deployments, replace with Redis.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

/**
 * Get a value from cache, or compute it if missing/expired.
 * @param key    Cache key
 * @param ttlMs  Time-to-live in milliseconds (default: 60s)
 * @param fn     Async function to compute the value
 */
export async function cached<T>(
  key: string,
  ttlMs: number,
  fn: () => Promise<T>
): Promise<T> {
  const now = Date.now();
  const existing = store.get(key) as CacheEntry<T> | undefined;

  if (existing && existing.expiresAt > now) {
    return existing.data;
  }

  const data = await fn();
  store.set(key, { data, expiresAt: now + ttlMs });
  return data;
}

/**
 * Invalidate a specific cache key (call after admin mutations).
 */
export function invalidateCache(key: string) {
  store.delete(key);
}

/**
 * Invalidate all keys that start with a prefix.
 */
export function invalidateCachePrefix(prefix: string) {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) {
      store.delete(key);
    }
  }
}

/**
 * Clear the entire cache.
 */
export function clearCache() {
  store.clear();
}

// ─── Cache Keys ───
export const CACHE_KEYS = {
  FEATURED_PROPERTIES: "featured-properties",
  ALL_PROPERTY_TYPES: "all-property-types",
  propertiesListing: (params: string) => `properties:${params}`,
  propertyDetail: (slug: string) => `property:${slug}`,
} as const;

// ─── TTL Constants ───
export const TTL = {
  /** 60 seconds — for listing pages (balance freshness vs perf) */
  SHORT: 60 * 1000,
  /** 5 minutes — for homepage featured section */
  MEDIUM: 5 * 60 * 1000,
  /** 30 minutes — for rarely changing data like property types */
  LONG: 30 * 60 * 1000,
} as const;





