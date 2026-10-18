/**
 * marathi-transliterate - Phonetic Search & Matching Module
 * High-performance, zero-dependency phonetic search engine for Marathi items
 * across Romanized English, Devanagari, and phonetic variations.
 */

import { transliterate, getSuggestions, MARATHI_DICTIONARY } from "./index.js";

// LRU Cache for search variants
const CACHE_MAX_SIZE = 200;
const VARIANTS_CACHE = new Map();

function getCachedVariants(key) {
  if (!VARIANTS_CACHE.has(key)) return null;
  const value = VARIANTS_CACHE.get(key);
  VARIANTS_CACHE.delete(key);
  VARIANTS_CACHE.set(key, value);
  return value;
}

function setCachedVariants(key, value) {
  if (VARIANTS_CACHE.size >= CACHE_MAX_SIZE) {
    const oldestKey = VARIANTS_CACHE.keys().next().value;
    VARIANTS_CACHE.delete(oldestKey);
  }
  VARIANTS_CACHE.set(key, value);
}

/**
 * Normalizes Marathi characters with deep phonetic normalization:
 * - ळ ➔ ल
 * - ण ➔ न (e.g., दाणे ↔ दाने, साबुदाणा ↔ साबुदाना, धणे ↔ धने)
 * - श, ष ➔ स (e.g., शेव ↔ सेव, शाकर ↔ साखर)
 * - व ➔ ब (e.g., वरई ↔ बरई, रवा ↔ रबा)
 * - Vowel length normalization: ी ➔ ि, ू ➔ ु, ई ➔ इ, ऊ ➔ उ (e.g., काजू ↔ काजु, तूप ↔ तुप)
 * - Anuswar tolerance: strips/neutralizes anuswars so कांदा matches कंदा, शेंगदाणे matches शेगदाणे.
 *
 * @param {string} text
 * @returns {string}
 */
export function normalizePhonetics(text) {
  if (text == null) return "";
  return String(text)
    .toLowerCase()
    .replace(/ळ/g, "ल")
    .replace(/ण/g, "न")
    .replace(/[शष]/g, "स")
    .replace(/व/g, "ब")
    .replace(/ी/g, "ि")
    .replace(/ू/g, "ु")
    .replace(/ई/g, "इ")
    .replace(/ऊ/g, "उ")
    .replace(/ा(?=[ंँ])/g, "") // eliminate kana before anuswar so कांदा -> कंदा
    .replace(/[ँं]/g, "")     // strip anuswars so कंदा -> कदा, शेंगदाणे -> शेगदाणे
    .replace(/(?:न्|म्|ङ्|ञ्|ण्)(?=[क-ह])/g, "") // strip conjunct nasals before consonants
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Expands any user query into all phonetic and transliterated search candidates.
 * Uses an internal LRU cache to ensure O(1) performance during .filter() loops.
 *
 * @param {string} query - Search query
 * @param {Object} [options]
 * @param {number} [options.maxSuggestions=6]
 * @returns {string[]}
 */
export function expandSearchVariants(query, options = {}) {
  if (!query || typeof query !== "string") return [];
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  const maxSuggestions = options.maxSuggestions || 6;
  const cacheKey = `${cleanQuery}__${maxSuggestions}`;
  const cached = getCachedVariants(cacheKey);
  if (cached) return cached;

  const results = new Set();
  const add = (candidate) => {
    if (candidate && typeof candidate === "string") {
      const c = candidate.trim().toLowerCase();
      if (c) {
        results.add(c);
        const norm = normalizePhonetics(c);
        if (norm) results.add(norm);
      }
    }
  };

  const tokens = cleanQuery.split(/\s+/).filter(Boolean);

  // If query has multiple tokens, also add full query and full transliteration
  if (tokens.length > 1) {
    add(cleanQuery);
    const fullTranslit = transliterate(cleanQuery);
    add(fullTranslit);
  }

  for (const token of tokens) {
    // 1. Preserve raw token (lowercase)
    add(token);

    // 2. Transliterate token to Devanagari
    const translit = transliterate(token);
    add(translit);

    // 3. Smart suggestion candidates
    const suggestions = getSuggestions(token, { maxSuggestions });
    for (const s of suggestions) {
      add(s);
    }
  }

  const output = Array.from(results);
  setCachedVariants(cacheKey, output);
  return output;
}

/**
 * Evaluates whether a target string (Marathi or English) matches the query.
 *
 * @param {string} target - Target string to evaluate
 * @param {string} query - Search query (English, Devanagari, or phonetic)
 * @param {Object} [options]
 * @param {boolean} [options.prefix=true] - Whether to match prefixes
 * @param {'all' | 'any'} [options.multiWord='all'] - Match all query words or any
 * @returns {boolean}
 */
export function matchMarathi(target, query, options = {}) {
  if (target == null || query == null) return false;
  const rawTarget = String(target).trim().toLowerCase();
  const rawQuery = String(query).trim().toLowerCase();
  if (!rawTarget || !rawQuery) return false;

  const prefix = options.prefix !== false;
  const multiWord = options.multiWord || "all";

  const targetWords = rawTarget.split(/\s+/).filter(Boolean);
  const normTarget = normalizePhonetics(rawTarget);
  const normTargetWords = targetWords.map((w) => normalizePhonetics(w));

  const queryTokens = rawQuery.split(/\s+/).filter(Boolean);
  if (queryTokens.length === 0) return false;

  // Helper: check if a single query token matches the target
  const matchSingleToken = (token) => {
    const rawToken = token.toLowerCase();
    const normToken = normalizePhonetics(rawToken);

    // 1. Exact or substring match in raw string
    if (rawTarget.includes(rawToken) || rawToken.includes(rawTarget)) return true;
    if (prefix) {
      if (rawTarget.startsWith(rawToken)) return true;
      if (targetWords.some((tw) => tw.startsWith(rawToken))) return true;
    }

    // 2. Primary transliteration match
    const primaryTranslit = transliterate(rawToken).toLowerCase();
    const normPrimary = normalizePhonetics(primaryTranslit);

    if (rawTarget.includes(primaryTranslit) || primaryTranslit.includes(rawTarget)) return true;
    if (prefix) {
      if (rawTarget.startsWith(primaryTranslit)) return true;
      if (targetWords.some((tw) => tw.startsWith(primaryTranslit))) return true;
    }

    // 3. Candidate suggestions match
    let suggestions = getSuggestions(rawToken, { maxSuggestions: 10 });
    if (!prefix) {
      suggestions = suggestions.filter((cand) => {
        for (const [key, val] of Object.entries(MARATHI_DICTIONARY)) {
          if (val === cand && key.startsWith(rawToken) && key !== rawToken) {
            return false;
          }
        }
        return true;
      });
    }

    for (const cand of suggestions) {
      const cleanCand = cand.toLowerCase();
      if (rawTarget === cleanCand || rawTarget.includes(cleanCand) || cleanCand.includes(rawTarget)) {
        return true;
      }
      if (prefix) {
        if (rawTarget.startsWith(cleanCand) || cleanCand.startsWith(rawTarget)) return true;
        if (targetWords.some((tw) => tw.startsWith(cleanCand) || cleanCand.startsWith(tw))) {
          return true;
        }
      }
    }

    // 4. Normalized phonetic match
    if (normTarget === normToken || normTarget === normPrimary) return true;
    if (normTarget.includes(normToken) || normTarget.includes(normPrimary)) return true;
    if (prefix) {
      if (normTarget.startsWith(normToken) || normTarget.startsWith(normPrimary)) return true;
      if (normTargetWords.some((ntw) => ntw.startsWith(normToken) || ntw.startsWith(normPrimary))) {
        return true;
      }
    }

    for (const cand of suggestions) {
      const normCand = normalizePhonetics(cand);
      if (normTarget === normCand || normTarget.includes(normCand) || normCand.includes(normTarget)) {
        return true;
      }
      if (prefix) {
        if (normTarget.startsWith(normCand) || normCand.startsWith(normTarget)) return true;
        if (normTargetWords.some((ntw) => ntw.startsWith(normCand) || normCand.startsWith(ntw))) {
          return true;
        }
      }
    }

    return false;
  };

  // If the query as a whole matches target directly
  if (matchSingleToken(rawQuery)) {
    return true;
  }

  // Multi-word matching
  if (multiWord === "any") {
    return queryTokens.some((tok) => matchSingleToken(tok));
  } else {
    return queryTokens.every((tok) => matchSingleToken(tok));
  }
}

/**
 * Returns a numeric score (0 to 1000) for sorting search results:
 * - 1000: Exact match.
 * - 800: Prefix match (e.g., target starts with query or top transliteration).
 * - 600: Top transliteration candidate match (transliterate(q)).
 * - 400: Secondary suggestion candidate match (getSuggestions(q)).
 * - 200: Substring match.
 * - 100: Phonetic normalized match (normalizePhonetics).
 * - 0: No match.
 *
 * @param {string} target - Target string
 * @param {string} query - Search query
 * @returns {number} Score from 0 to 1000
 */
export function scoreMarathiMatch(target, query) {
  if (target == null || query == null) return 0;
  const rawTarget = String(target).trim().toLowerCase();
  const rawQuery = String(query).trim().toLowerCase();
  if (!rawTarget || !rawQuery) return 0;

  const scoreSingle = (t, q) => {
    const topTranslit = transliterate(q).trim().toLowerCase();
    const suggestions = getSuggestions(q, { maxSuggestions: 10 });
    const normT = normalizePhonetics(t);
    const normQ = normalizePhonetics(q);
    const normTop = normalizePhonetics(topTranslit);

    // 1000: Exact match
    if (t === q || t === topTranslit) {
      return 1000;
    }

    // 800: Prefix match (target starts with query or top transliteration)
    if (t.startsWith(q) || t.startsWith(topTranslit)) {
      return 800;
    }

    // 600: Top transliteration candidate match
    if (t.includes(topTranslit) || topTranslit.includes(t)) {
      return 600;
    }

    // 400: Secondary suggestion candidate match
    for (const s of suggestions) {
      const cleanS = s.trim().toLowerCase();
      if (cleanS === topTranslit) continue;
      if (t === cleanS || t.includes(cleanS) || cleanS.includes(t)) {
        return 400;
      }
    }

    // 200: Substring match
    if (t.includes(q) || q.includes(t)) {
      return 200;
    }

    // 100: Phonetic normalized match
    if (normT === normQ || normT === normTop) {
      return 100;
    }
    if (normT.startsWith(normQ) || normT.startsWith(normTop)) {
      return 100;
    }
    if (normT.includes(normQ) || normT.includes(normTop)) {
      return 100;
    }
    for (const s of suggestions) {
      const normS = normalizePhonetics(s);
      if (normT.includes(normS) || normS.includes(normT)) {
        return 100;
      }
    }

    return 0;
  };

  // Direct score on full query
  const directScore = scoreSingle(rawTarget, rawQuery);
  const queryTokens = rawQuery.split(/\s+/).filter(Boolean);

  if (queryTokens.length <= 1) {
    return directScore;
  }

  // Multi-word evaluation
  const tokenScores = queryTokens.map((tok) => scoreSingle(rawTarget, tok));
  if (tokenScores.some((s) => s === 0)) {
    // If not all words match, return directScore (could be 0)
    return directScore;
  }

  const avgTokenScore = Math.round(
    tokenScores.reduce((sum, s) => sum + s, 0) / tokenScores.length
  );

  return Math.max(directScore, avgTokenScore);
}

/**
 * High-level search helper that filters and sorts arrays of strings or objects.
 *
 * @template T
 * @param {T[]} items - Array of items to search
 * @param {string} query - Search query
 * @param {Object} [options]
 * @param {string[]} [options.keys] - Object keys to search against
 * @param {number} [options.limit] - Max number of results to return
 * @param {boolean} [options.prefix=true] - Prefix matching
 * @param {'all' | 'any'} [options.multiWord='all'] - Multi-word mode
 * @returns {T[]}
 */
export function searchMarathi(items, query, options = {}) {
  if (!Array.isArray(items) || !query || typeof query !== "string") {
    return [];
  }
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  const keys = options.keys;
  const limit = typeof options.limit === "number" && options.limit > 0 ? options.limit : Infinity;

  const scored = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item == null) continue;

    let targets = [];
    if (typeof item === "string") {
      targets = [item];
    } else if (typeof item === "object") {
      if (Array.isArray(keys) && keys.length > 0) {
        for (const k of keys) {
          if (typeof k === "string" && item[k] != null) {
            targets.push(String(item[k]));
          }
        }
      } else {
        for (const val of Object.values(item)) {
          if (typeof val === "string") {
            targets.push(val);
          }
        }
      }
    }

    let maxScore = 0;
    for (const target of targets) {
      if (matchMarathi(target, cleanQuery, options)) {
        const score = scoreMarathiMatch(target, cleanQuery);
        const effectiveScore = score > 0 ? score : 100;
        if (effectiveScore > maxScore) {
          maxScore = effectiveScore;
        }
      }
    }

    if (maxScore > 0) {
      scored.push({ item, score: maxScore, index: i });
    }
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.index - b.index;
  });

  const results = scored.map((s) => s.item);
  return limit < results.length ? results.slice(0, limit) : results;
}

export default {
  normalizePhonetics,
  expandSearchVariants,
  matchMarathi,
  scoreMarathiMatch,
  searchMarathi
};
