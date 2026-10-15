/**
 * marathi-transliterate
 * Zero-dependency, offline-first Plain JavaScript phonetic transliteration library
 * for Marathi (Devanagari) script with live smart suggestions.
 */

import { MARATHI_DICTIONARY } from './dictionary.js';
import { phoneticTransliterateWord } from './phonetics.js';
import { getCachedWord, setCachedWord, fetchOnlineMarathi } from './cache.js';
import { attachDevanagari } from './dom.js';

export { MARATHI_DICTIONARY, fetchOnlineMarathi, attachDevanagari };

/**
 * Transliterates a single English word into Marathi (Devanagari).
 * @param {string} word - Romanized word e.g. sakhar, kanda, atata * @returns {string} - Marathi Devanagari script e.g. साखर, कांदा, बटाटा */
export function transliterateWord(word) {
  if (!word) return '';
  const clean = word.toLowerCase().trim();

  // 1. Check curated high-accuracy dictionary first
  if (MARATHI_DICTIONARY[clean]) {
    return MARATHI_DICTIONARY[clean];
  }

  // 2. Check local/memory cache
  const cached = getCachedWord(clean);
  if (cached && cached.length > 0) {
    return cached[0];
  }

  // 3. Algorithmic rule-based phonetic engine
  const phonetic = phoneticTransliterateWord(word);

  // Background fetch to enrich cache if online (non-blocking)
  if (typeof fetch !== 'undefined') {
    fetchOnlineMarathi(clean).catch(() => {});
  }

  return phonetic;
}

/**
 * Transliterates a full sentence, paragraph or mixed text into Marathi.
 * Preserves numbers, punctuation, spaces, and formatting.
 * @param {string} text - Input text
 * @returns {string} - Transliterated text
 */
export function transliterate(text) {
  if (!text) return '';

  return text.replace(/[a-zA-Z]+/g, match => {
    return transliterateWord(match);
  });
}

/**
 * Alias for transliterate (drop-in compatibility)
 */
export const toDevanagari = transliterate;

/**
 * Returns ranked candidate spelling suggestions for a word.
 * @param {string} word
 * @param {Object} [options]
 * @param {number} [options.maxSuggestions=5]
 * @param {boolean} [options.includeOriginal=true]
 * @returns {string[]}
 */
export function getSuggestions(word, options = {}) {
  if (!word || !word.trim()) return [];
  const clean = word.toLowerCase().trim();
  const max = options.maxSuggestions || 5;
  const includeOriginal = options.includeOriginal !== false;
  const suggestions = [];

  const add = (candidate) => {
    if (candidate && !suggestions.includes(candidate)) {
      suggestions.push(candidate);
    }
  };

  // 1. Exact match from curated dictionary
  if (MARATHI_DICTIONARY[clean]) {
    add(MARATHI_DICTIONARY[clean]);
  }

  // 2. Check local/memory cache
  const cached = getCachedWord(clean);
  if (cached) {
    for (const c of cached) add(c);
  }

  // 3. Phonetic algorithm conversion
  const phonetic = phoneticTransliterateWord(word);
  if (phonetic) add(phonetic);

  // 4. Prefix matches from dictionary (if clean.length >= 3)
  if (clean.length >= 3 && suggestions.length < max) {
    for (const [key, val] of Object.entries(MARATHI_DICTIONARY)) {
      if (key.startsWith(clean) && key !== clean) {
        add(val);
        if (suggestions.length >= max) break;
      }
    }
  }

  // 5. Add raw English word at the end so user can easily keep original
  if (includeOriginal && !suggestions.includes(word)) {
    suggestions.push(word);
  }

  return suggestions.slice(0, max);
}

// Default export
export default {
  transliterate,
  transliterateWord,
  toDevanagari,
  getSuggestions,
  attachDevanagari,
  MARATHI_DICTIONARY,
  fetchOnlineMarathi
};
