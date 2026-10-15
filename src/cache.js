/**
 * Cache and asynchronous online enrichment for Marathi transliteration.
 */

const MEMORY_CACHE = new Map();
const LOCAL_STORAGE_KEY = 'marathi_transliterate_cache_v1';

// Load initial persistent cache if available
function initStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        for (const [k, v] of Object.entries(parsed)) {
          MEMORY_CACHE.set(k.toLowerCase(), v);
        }
      }
    } catch {
      // Ignore storage errors
    }
  }
}

initStorage();

export function getCachedWord(word) {
  if (!word) return null;
  return MEMORY_CACHE.get(word.toLowerCase().trim()) || null;
}

export function setCachedWord(word, transliteratedList) {
  if (!word || !transliteratedList) return;
  const key = word.toLowerCase().trim();
  const list = Array.isArray(transliteratedList) ? transliteratedList : [transliteratedList];
  MEMORY_CACHE.set(key, list);

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const obj = {};
      MEMORY_CACHE.forEach((v, k) => {
        obj[k] = v;
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(obj));
    } catch {
      // Ignore quota/storage errors
    }
  }
}

/**
 * Optionally fetch online candidates from Google Input Tools API (mr-t-i0-und)
 * and cache the results for offline use.
 * @param {string} word
 * @param {number} numOptions
 * @returns {Promise<string[]>}
 */
export async function fetchOnlineMarathi(word, numOptions = 5) {
  if (!word || !word.trim()) return [];
  const clean = word.toLowerCase().trim();

  // If already in cache
  const cached = getCachedWord(clean);
  if (cached && cached.length > 0) {
    return cached;
  }

  // If in browser/electron/node with fetch
  if (typeof fetch !== 'undefined') {
    try {
      const url = `https://inputtools.google.com/request?text=${encodeURIComponent(clean)}&itc=mr-t-i0-und&num=${numOptions}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data && data[0] === 'SUCCESS' && data[1] && data[1][0] && data[1][0][1]) {
          const suggestions = data[1][0][1];
          setCachedWord(clean, suggestions);
          return suggestions;
        }
      }
    } catch {
      // Network failure / offline: fail gracefully
    }
  }

  return [];
}
