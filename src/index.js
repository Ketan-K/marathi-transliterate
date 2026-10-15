/**
 * marathi-transliterate
 * Zero-dependency, offline-first Plain JavaScript phonetic transliteration library
 * for Marathi (Devanagari) script.
 */

import { MARATHI_DICTIONARY } from './dictionary.js';
import { phoneticTransliterateWord } from './phonetics.js';
import { getCachedWord, setCachedWord, fetchOnlineMarathi } from './cache.js';
import { attachDevanagari } from './dom.js';

export { MARATHI_DICTIONARY, fetchOnlineMarathi, attachDevanagari };

/**
 * Transliterates a single English word into Marathi (Devanagari).
 * @param {string} word - Romanized word e.g. "sakhar", "kanda", "batata"
 * @returns {string} - Marathi Devanagari script e.g. "साखर", "कांदा", "बटाटा"
 */
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
 * Returns candidate spelling suggestions for a word.
 * @param {string} word
 * @returns {string[]}
 */
export function getSuggestions(word) {
  if (!word || !word.trim()) return [];
  const clean = word.toLowerCase().trim();
  const suggestions = [];

  // 1. From dictionary
  if (MARATHI_DICTIONARY[clean]) {
    suggestions.push(MARATHI_DICTIONARY[clean]);
  }

  // 2. From cache
  const cached = getCachedWord(clean);
  if (cached) {
    for (const c of cached) {
      if (!suggestions.includes(c)) suggestions.push(c);
    }
  }

  // 3. From phonetic algorithm
  const phonetic = phoneticTransliterateWord(word);
  if (phonetic && !suggestions.includes(phonetic)) {
    suggestions.push(phonetic);
  }

  return suggestions;
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
