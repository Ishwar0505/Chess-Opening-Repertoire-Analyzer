const CACHE_PREFIX = 'chess_rep_';

export function cacheGet(key) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;

    const { value, expiry } = JSON.parse(raw);
    if (Date.now() > expiry) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }

    return value;
  } catch {
    return null;
  }
}

export function cacheSet(key, value, ttlMinutes = 60) {
  try {
    const expiry = Date.now() + ttlMinutes * 60 * 1000;
    localStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({ value, expiry })
    );
  } catch {
    // localStorage full or unavailable
  }
}

export function cacheClear(prefix = '') {
  const fullPrefix = CACHE_PREFIX + prefix;
  const keysToRemove = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(fullPrefix)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => localStorage.removeItem(key));
}
