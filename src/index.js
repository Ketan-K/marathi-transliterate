/**
 * marathi-transliterate
 * Zero-dependency, offline-first Plain JavaScript phonetic transliteration library
 * for Marathi (Devanagari) script with live smart suggestions.
 */

import { MARATHI_DICTIONARY } from "./dictionary.js";
import { phoneticTransliterateWord } from "./phonetics.js";
import { getCachedWord, setCachedWord, fetchOnlineMarathi } from "./cache.js";
import { attachDevanagari } from "./dom.js";

export { MARATHI_DICTIONARY, fetchOnlineMarathi, attachDevanagari };

/**
 * Extends or overrides the global transliteration dictionary at runtime.
 * @param {Record<string, string>} customWords - Map of English -> Marathi words
 */
export function extendDictionary(customWords) {
  if (customWords && typeof customWords === "object") {
    Object.assign(MARATHI_DICTIONARY, customWords);
  }
}

/**
 * Normalizes Marathi characters (interchangeable ळ/ल, श/ष, ि/ी, ु/ू, and anusvar)
 * for tolerant comparisons and search filtering.
 * @param {string} str
 * @returns {string}
 */
export function normalizeMarathi(str) {
  if (!str) return "";
  return String(str)
    .toLowerCase()
    .replace(/ळ/g, "ल")
    .replace(/ष/g, "श")
    .replace(/ी/g, "ि")
    .replace(/ू/g, "ु")
    .replace(/[ँं]/g, "")
    .trim();
}

/**
 * Transliterates a single English word into Marathi (Devanagari).
 * @param {string} word - Romanized word e.g. sakhar, kanda, batata
 * @returns {string} - Marathi Devanagari script e.g. साखर, कांदा, बटाटा
 */
export function transliterateWord(word) {
  if (!word) return "";
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
  if (typeof fetch !== "undefined") {
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
  if (!text) return "";

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
 * Guarantees that any word containing "l" automatically provides both "ळ" (LLA)
 * and "ल" (LA) variants in candidate suggestions (e.g. bhusal -> भुसाळ, भुसळ, भुसल).
 *
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

  // 4. Smart Marathi phonetic variants expansion (ळ/ल, ड/द, ढ/ध, ट/त, ठ/थ, ण/न, ष/श, झ/ज, ई/इ, ऊ/उ)
  const initialCandidates = [...suggestions];
  for (const s of initialCandidates) {
    // 4a. ळ (LLA) and ल (LA) - e.g. "keli" -> "केळी", "bhusal" -> "भुसाळ"
    if (s.includes("ल")) {
      if (clean.endsWith("al") && s.endsWith("ल") && !s.endsWith("ाल")) {
        add(s.slice(0, -1) + "ाळ");
      }
      add(s.replace(/ल/g, "ळ"));
    } else if (s.includes("ळ")) {
      add(s.replace(/ळ/g, "ल"));
    }

    // 4b. ड (DDA) and द (DA) - e.g. "Jaad" -> "जाड", "Daba" -> "डबा", "kadak" -> "कडक"
    if (s.includes("द")) {
      if (clean.endsWith("ad") && s.endsWith("द") && !s.endsWith("ाद")) {
        add(s.slice(0, -1) + "ाड");
      }
      add(s.replace(/द/g, "ड"));
    } else if (s.includes("ड")) {
      add(s.replace(/ड/g, "द"));
    }

    // 4c. ढ (DDHA) and ध (DHA) - e.g. "dhag" -> "ढग", "dhol" -> "ढोल"
    if (s.includes("ध")) {
      add(s.replace(/ध/g, "ढ"));
    } else if (s.includes("ढ")) {
      add(s.replace(/ढ/g, "ध"));
    }

    // 4d. ट (TTA) and त (TA) - e.g. "batata" -> "बटाटा", "tomato" -> "टोमॅटो"
    if (s.includes("त")) {
      add(s.replace(/त/g, "ट"));
    } else if (s.includes("ट")) {
      add(s.replace(/त/g, "त"));
    }

    // 4e. ठ (TTHA) and थ (THA) - e.g. "thik" -> "ठीक", "path" -> "पाठ"
    if (s.includes("थ")) {
      add(s.replace(/थ/g, "ठ"));
    } else if (s.includes("ठ")) {
      add(s.replace(/ठ/g, "थ"));
    }

    // 4f. ण (NNA) and न (NA) - e.g. "pani" -> "पाणी", "bana" -> "बाण", "dane" -> "दाणे"
    if (s.includes("न")) {
      add(s.replace(/न/g, "ण"));
    } else if (s.includes("ण")) {
      add(s.replace(/ण/g, "न"));
    }

    // 4g. ष (SSA) and श (SHA) - e.g. "vishesh" -> "विशेष"
    if (s.includes("श")) {
      add(s.replace(/श/g, "ष"));
    } else if (s.includes("ष")) {
      add(s.replace(/ष/g, "श"));
    }

    // 4h. झ (JHA) and ज (JA) - e.g. "jhadu" -> "झाडू"
    if (s.includes("ज") && (clean.includes("jh") || clean.includes("zh") || clean.includes("z"))) {
      add(s.replace(/ज/g, "झ"));
    }

    // 4i. Authentic Marathi final dirgha vowel rules (मराठी शुद्धलेखन: अंत्य इकार/उकार दीर्घ)
    if (s.endsWith("ि")) {
      add(s.slice(0, -1) + "ी");
    } else if (s.endsWith("ी")) {
      add(s.slice(0, -1) + "ि");
    }
    if (s.endsWith("ु")) {
      add(s.slice(0, -1) + "ू");
    } else if (s.endsWith("ू")) {
      add(s.slice(0, -1) + "ु");
    }

    // 4j. Word-ending "a" kana variants (e.g. rama -> रामा & राम)
    if (clean.endsWith("a") && s.endsWith("ा")) {
      add(s.slice(0, -1));
    }
  }

  // 5. Prefix matches from dictionary (if clean.length >= 3)
  if (clean.length >= 3 && suggestions.length < max) {
    for (const [key, val] of Object.entries(MARATHI_DICTIONARY)) {
      if (key.startsWith(clean) && key !== clean) {
        add(val);
        if (suggestions.length >= max) break;
      }
    }
  }

  // 6. Add raw English word at the end so user can easily keep original
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
  extendDictionary,
  normalizeMarathi,
  MARATHI_DICTIONARY,
  fetchOnlineMarathi
};
