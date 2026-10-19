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

import {
  GENDERS,
  GENDER_KEYS,
  PRONOUNS,
  OPPOSITE_GENDER_PAIRS,
  MARATHI_GENDER_DICTIONARY,
  getGender,
  getPronoun,
  formatWithPronoun,
  getOppositeGender,
  changeGender,
  isMasculine,
  isPullinga,
  isFeminine,
  isStreelinga,
  isNeuter,
  isNapunsaklinga,
  isDualGender,
  isUbhaya,
  extendGenderDictionary
} from "./gender.js";

export {
  GENDERS,
  GENDER_KEYS,
  PRONOUNS,
  OPPOSITE_GENDER_PAIRS,
  MARATHI_GENDER_DICTIONARY,
  getGender,
  getPronoun,
  formatWithPronoun,
  getOppositeGender,
  changeGender,
  isMasculine,
  isPullinga,
  isFeminine,
  isStreelinga,
  isNeuter,
  isNapunsaklinga,
  isDualGender,
  isUbhaya,
  extendGenderDictionary
};


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

  // 1b. Check trailing "s" fast-typing slip (e.g. bhais -> भाई, bhaus -> भाऊ, kakas -> काका)
  if (clean.endsWith("s") && clean.length > 2) {
    const base = clean.replace(/s+$/, "");
    if (MARATHI_DICTIONARY[base]) {
      return MARATHI_DICTIONARY[base];
    }
  }

  // 1c. Check compound honorific suffixes (-saheb, -sahab, -rao, -sheth, -seth, -ji, -bai)
  if (clean.endsWith("saheb") && clean.length > 5) {
    return transliterateWord(clean.slice(0, -5)) + "साहेब";
  }
  if (clean.endsWith("sahab") && clean.length > 5) {
    return transliterateWord(clean.slice(0, -5)) + "साहेब";
  }
  if (clean.endsWith("rao") && clean.length > 3) {
    return transliterateWord(clean.slice(0, -3)) + "राव";
  }
  if (clean.endsWith("sheth") && clean.length > 5) {
    return transliterateWord(clean.slice(0, -5)) + "शेठ";
  }
  if (clean.endsWith("seth") && clean.length > 4) {
    return transliterateWord(clean.slice(0, -4)) + "शेठ";
  }
  if (clean.endsWith("ji") && clean.length > 3) {
    return transliterateWord(clean.slice(0, -2)) + "जी";
  }
  if (clean.endsWith("bai") && clean.length > 4) {
    return transliterateWord(clean.slice(0, -3)) + "बाई";
  }

  // 1d. Compound Indian / Marathi customer name suffixes (-nath, -lal, -das, -prasad, -kant, -chand, -kumar, -dhar)
  if (clean.endsWith("nath") && clean.length > 5) {
    return transliterateWord(clean.slice(0, -4)) + "नाथ";
  }
  if (clean.endsWith("lal") && clean.length > 4) {
    return transliterateWord(clean.slice(0, -3)) + "लाल";
  }
  if (clean.endsWith("das") && clean.length > 4) {
    return transliterateWord(clean.slice(0, -3)) + "दास";
  }
  if (clean.endsWith("prasad") && clean.length > 7) {
    return transliterateWord(clean.slice(0, -6)) + "प्रसाद";
  }
  if (clean.endsWith("kant") && clean.length > 5) {
    return transliterateWord(clean.slice(0, -4)) + "कांत";
  }
  if (clean.endsWith("chand") && clean.length > 6) {
    return transliterateWord(clean.slice(0, -5)) + "चंद";
  }
  if (clean.endsWith("kumar") && clean.length > 6) {
    return transliterateWord(clean.slice(0, -5)) + "कुमार";
  }
  if (clean.endsWith("dhar") && clean.length > 5) {
    return transliterateWord(clean.slice(0, -4)) + "धर";
  }
  if (clean.endsWith("singh") && clean.length > 6) {
    return transliterateWord(clean.slice(0, -5)) + "सिंह";
  }
  if (clean.endsWith("sing") && clean.length > 5) {
    return transliterateWord(clean.slice(0, -4)) + "सिंग";
  }
  if ((clean.endsWith("krishna") || clean.endsWith("krushna")) && clean.length > 7) {
    const prefix = clean.replace(/kr[iu]shna$/, "");
    if (prefix === "bal" || prefix === "baal" || prefix === "bala") {
      return "बाळकृष्ण";
    }
    if (prefix === "ram" || prefix === "raam" || prefix === "rama") {
      return "रामकृष्ण";
    }
    return transliterateWord(prefix) + "कृष्ण";
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
function transiterateCompound(prefix, suffix) {
  if (!prefix) return suffix;
  const p = MARATHI_DICTIONARY[prefix] || phoneticTransliterateWord(prefix);
  return p + suffix;
}

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

  // 1b. Priority spelling alternates for regional & cultural words
  if (clean === "nivrutt" || clean === "nivrutta") {
    add("निवृत्त");
    add("निवृत्ती");
    add("निवृत्ति");
  } else if (clean === "nivrutti" || clean === "nivritti") {
    add("निवृत्ती");
    add("निवृत्ति");
    add("निवृत्त");
  } else if (clean === "nivruttinath") {
    add("निवृत्तीनाथ");
    add("निवृत्तिनाथ");
  } else if (clean === "krupa") {
    add("कृपा");
  } else if (clean === "krushna") {
    add("कृष्ण");
  } else if (clean === "balkrishna" || clean === "balkrushna" || clean === "baalkrishna" || clean === "baalkrushna" || clean === "balakrishna" || clean === "balakrushna") {
    add("बाळकृष्ण");
    add("बालकृष्ण");
  } else if (clean === "ramkrishna" || clean === "ramkrushna" || clean === "raamkrishna" || clean === "raamkrushna" || clean === "ramakrishna" || clean === "ramakrushna") {
    add("रामकृष्ण");
  } else if (clean === "amrut") {
    add("अमृत");
  } else if (clean === "guru") {
    add("गुरू");
    add("गुरु");
  } else if (clean === "jagannath" || clean === "jaganath" || clean === "jagganath" || clean === "jagannatha") {
    add("जगन्नाथ");
    add("जगंनाथ");
  } else if (clean === "bansi" || clean === "bansee") {
    add("बन्सी");
    add("बंसी");
  } else if (clean === "bansilal") {
    add("बन्सीलाल");
    add("बंसीलाल");
  } else if (clean === "bansidhar") {
    add("बन्सीधर");
    add("बंसीधर");
  } else if (clean === "gorakshanath") {
    add("गोरक्षनाथ");
    add("गोरखनाथ");
  } else if (clean === "gorakhnath") {
    add("गोरखनाथ");
    add("गोरक्षनाथ");
  } else if (clean === "goraksha" || clean === "goraksh") {
    add("गोरक्ष");
  } else if (clean === "khandeshi" || clean === "khaandeshi") {
    add("खानदेशी");
    add("खांदेशी");
  } else if (clean === "khandesh" || clean === "khaandesh") {
    add("खानदेश");
    add("खांदेश");
  } else if (clean === "khandeshimasala" || clean === "khaandeshimasala") {
    add("खानदेशी मसाला");
    add("खांदेशी मसाला");
  } else if (clean === "comfort" || clean === "kamfart" || clean === "kamfort") {
    add("कंफर्ट");
    add("कॉम्फर्ट");
  } else if (clean === "liquid" || clean === "likwid" || clean === "likvid") {
    add("लिक्विड");
    add("लिक्वीड");
  } else if (clean === "comfortliquid" || clean === "kamfartliquid" || clean === "kamfortliquid") {
    add("कम्फर्ट लिक्विड");
    add("कंफर्ट लिक्विड");
  } else if (clean === "phenyl" || clean === "phenyle" || clean === "finail" || clean === "finyle") {
    add("फिनाईल");
    add("फिनाइल");
  } else if (clean === "genteel" || clean === "jenteel") {
    add("जेंटील");
    add("जेंटिल");
  } else if (clean === "ezee") {
    add("इझी");
    add("इजी");
  } else if (clean === "ujala") {
    add("उजाला");
  } else if (clean === "vanish") {
    add("व्हॅनिश");
    add("वॅनिश");
  } else if (clean === "bibade" || clean === "bibde" || clean === "bibda") {
    add("बिबडे");
    add("बिबडा");
  } else if (clean === "dangar") {
    add("डांगर");
  } else if (clean === "rodage" || clean === "rodaga") {
    add("रोडगे");
    add("रोडगा");
  } else if (clean === "zunka" || clean === "zhunka" || clean === "jhunka") {
    add("झुणका");
    add("झुंकार");
  } else if (clean === "patwadi") {
    add("पाटवडी");
  } else if (clean === "saoji") {
    add("सावजी");
  } else if (clean === "rushikesh" || clean === "rishikesh") {
    add("ऋषिकेश");
  } else if (clean === "shruti") {
    add("श्रुती");
    add("श्रुति");
  } else if (clean === "kruti") {
    add("कृती");
    add("कृति");
  } else if (clean === "sanskruti") {
    add("संस्कृती");
    add("संस्कृति");
  } else if (clean === "prakruti") {
    add("प्रकृती");
    add("प्रकृति");
  } else if (clean === "rutu" || clean === "ritu") {
    add("ऋतू");
    add("ऋतु");
  } else if (clean === "rutuja" || clean === "rituja") {
    add("ऋतुजा");
  } else if (clean === "mandeshi" || clean === "maandeshi") {
    add("मानदेशी");
    add("मांदेशी");
  } else if (clean === "mandesh" || clean === "maandesh") {
    add("मानदेश");
    add("मांदेश");
  } else if (clean === "sindhi") {
    add("सिन्धी");
  } else if (clean === "kannada") {
    add("कानडी");
  } else if (clean === "kanadi") {
    add("कन्नड");
  } else if (clean === "vidarbha") {
    add("विदर्भी");
  } else if (clean === "vidarbhi") {
    add("विदर्भीय");
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

    // 4k. Smart Anusvara (टिंब) variants expansion (मराठी शुद्धलेखन)
    // Automatically generates standard Marathi Anusvara spellings for conjunct nasals
    // e.g. "बन्धु" -> "बंधू" / "बंधु", "सम्पत" -> "संपत", "आनन्द" -> "आनंद"
    const anusvarRegex = /(?:न्|म्|ङ्|ञ्|ण्)(?=[क-ह])/g;
    if (anusvarRegex.test(s)) {
      const withAnusvar = s.replace(anusvarRegex, "ं");
      add(withAnusvar);
      if (withAnusvar.endsWith("ु")) add(withAnusvar.slice(0, -1) + "ू");
      if (withAnusvar.endsWith("ू")) add(withAnusvar.slice(0, -1) + "ु");
      if (withAnusvar.endsWith("ि")) add(withAnusvar.slice(0, -1) + "ी");
      if (withAnusvar.endsWith("ी")) add(withAnusvar.slice(0, -1) + "ि");
    }

    // 4l. Chandra "ॉ" (Candra O, \u0949) and "ो" (O, \u094B)
    // Essential for English loanwords in grocery & everyday shop items
    // e.g. watt -> वॉट / वॅट / वाट, polish -> पॉलिश, coil -> कॉईल, coffee -> कॉफी, doctor -> डॉक्टर, sauce -> सॉस, box -> बॉक्स, ball -> बॉल, stock -> स्टॉक
    if (s.includes("ो")) {
      add(s.replace(/ो/g, "ॉ"));
    } else if (s.includes("ॉ")) {
      add(s.replace(/ॉ/g, "ो"));
      add(s.replace(/ॉ/g, "ॅ"));
      add(s.replace(/ॉ/g, "ा"));
    }
    if (s.startsWith("ओ")) {
      add("ऑ" + s.slice(1));
    } else if (s.startsWith("ऑ")) {
      add("ओ" + s.slice(1));
    }

    // 4m. Chandra "ॅ" (Candra E, \u0945) and "े" (E) / "ै" (AI)
    // For English loanwords: battery -> बॅटरी, packet -> पॅकेट, snack -> स्नॅक्स, bat -> बॅट, match -> मॅच
    if (s.includes("े")) {
      add(s.replace(/े/g, "ॅ"));
    } else if (s.includes("ॅ")) {
      add(s.replace(/ॅ/g, "े"));
      add(s.replace(/ॅ/g, "ॉ"));
    }

    // 4n. Smart Anusvara on "su" prefixes and "sunth"
    // e.g. typing "sun" offers "सुं" (with anusvara) and "सुंठ"
    if (clean.startsWith("sun")) {
      add("सुं");
      add("सुंठ");
    }

    // 4o. Smart "rajhans" and compound words
    if (clean.startsWith("rajh")) {
      add("राजहंस");
    }

    // 4p. Smart Kana + Anusvara (ां) expansion (मराठी शुद्धलेखन)
    // e.g. "kranti" -> "क्रांती" / "क्रांति", "shanti" -> "शांती", "kanti" -> "कांती", "kanda" -> "कांदा", "gandhi" -> "गांधी"
    if (s.includes("ं")) {
      const withKanaAnusvar = s.replace(/([^ािीुूेैोौॉॅ्\s])ं/g, "$1ां");
      if (withKanaAnusvar !== s) {
        add(withKanaAnusvar);
        if (withKanaAnusvar.endsWith("ि")) add(withKanaAnusvar.slice(0, -1) + "ी");
        if (withKanaAnusvar.endsWith("ी")) add(withKanaAnusvar.slice(0, -1) + "ि");
      }
    }

    // 4q. Customer honorifics & bhai/bhau expansions
    if (clean.startsWith("bhai") || clean.startsWith("bhay")) {
      add("भैय्या");
      add("भैया");
      add("भय्या");
      add("भाई");
    }
    if (clean.startsWith("bhau")) {
      add("भाऊ");
    }
    if (clean.endsWith("s") && clean.length > 2) {
      const base = clean.replace(/s+$/, "");
      if (MARATHI_DICTIONARY[base]) {
        add(MARATHI_DICTIONARY[base]);
      }
    }
    if (clean.endsWith("saheb") && clean.length > 5) {
      add(transiterateCompound(clean.slice(0, -5), "साहेब"));
    }
    if (clean.endsWith("rao") && clean.length > 3) {
      add(transiterateCompound(clean.slice(0, -3), "राव"));
    }
    if (clean.endsWith("sheth") && clean.length > 5) {
      add(transiterateCompound(clean.slice(0, -5), "शेठ"));
    }

    // 4r. Khandesh, Mandesh & Regional alternate spellings (e.g. खान्देशी, खानदेशी, खांदेशी)
    if (clean.startsWith("khandesh") || clean.startsWith("khaandesh")) {
      add("खान्देशी");
      add("खानदेशी");
      add("खांदेशी");
      add("खान्देश");
      add("खानदेश");
      add("खांदेश");
    }
    if (clean.startsWith("mandesh") || clean.startsWith("maandesh")) {
      add("मान्देशी");
      add("मानदेशी");
      add("मान्देश");
      add("मानदेश");
    }
    if (clean.startsWith("sindh")) {
      add("सिंधी");
      add("सिन्धी");
    }
    if (clean.startsWith("ahirani") || clean.startsWith("aahirani")) {
      add("अहिराणी");
      add("अहिराणि");
    }
    if (clean.startsWith("vidarbh")) {
      add("विदर्भ");
      add("विदर्भी");
      add("विदर्भीय");
    }
    if (clean.startsWith("varhad") || clean.startsWith("warhad")) {
      add("वऱ्हाड");
      add("वऱ्हाडी");
    }
  }

  // Background fetch to enrich cache if online (non-blocking)
  if (typeof fetch !== "undefined" && !getCachedWord(clean)) {
    fetchOnlineMarathi(clean).catch(() => {});
  }

  // 5. Prefix matches from dictionary (if clean.length >= 2)
  if (clean.length >= 2 && suggestions.length < max) {
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

import {
  matchMarathi,
  scoreMarathiMatch,
  searchMarathi,
  expandSearchVariants,
  normalizePhonetics
} from "./search.js";

export {
  matchMarathi,
  scoreMarathiMatch,
  searchMarathi,
  expandSearchVariants,
  normalizePhonetics
};

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
  fetchOnlineMarathi,
  GENDERS,
  GENDER_KEYS,
  PRONOUNS,
  OPPOSITE_GENDER_PAIRS,
  MARATHI_GENDER_DICTIONARY,
  getGender,
  getPronoun,
  formatWithPronoun,
  getOppositeGender,
  changeGender,
  isMasculine,
  isPullinga,
  isFeminine,
  isStreelinga,
  isNeuter,
  isNapunsaklinga,
  isDualGender,
  isUbhaya,
  extendGenderDictionary,
  matchMarathi,
  scoreMarathiMatch,
  searchMarathi,
  expandSearchVariants,
  normalizePhonetics
};

