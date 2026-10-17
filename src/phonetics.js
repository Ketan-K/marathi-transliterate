/**
 * Algorithmic phonetic transliteration from Roman (English) script
 * to Marathi (Devanagari) script.
 */

const CONSONANTS = [
  // Multi-character special combinations
  { en: "dny", mr: "ज्ञ" },
  { en: "jn", mr: "ज्ञ" },
  { en: "gy", mr: "ज्ञ" },
  { en: "ksh", mr: "क्ष" },
  { en: "shr", mr: "श्र" },
  { en: "chh", mr: "छ" },
  { en: "ch", mr: "च" },
  { en: "kh", mr: "ख" },
  { en: "gh", mr: "घ" },
  { en: "jh", mr: "झ" },
  { en: "zh", mr: "झ" },
  { en: "Dh", mr: "ढ", caseSensitive: true },
  { en: "DH", mr: "ढ", caseSensitive: true },
  { en: "dh", mr: "ध" },
  { en: "Th", mr: "ठ", caseSensitive: true },
  { en: "TH", mr: "ठ", caseSensitive: true },
  { en: "th", mr: "थ" },
  { en: "ph", mr: "फ" },
  { en: "bh", mr: "भ" },
  { en: "shh", mr: "ष" },
  { en: "Sh", mr: "ष", caseSensitive: true },
  { en: "SH", mr: "ष", caseSensitive: true },
  { en: "sh", mr: "श" },
  { en: "ck", mr: "क" },
  { en: "ng", mr: "ङ" },
  { en: "c", mr: "क" },

  // Single consonants - case-sensitive retroflex & special Marathi sounds FIRST
  { en: "T", mr: "ट", caseSensitive: true },
  { en: "D", mr: "ड", caseSensitive: true },
  { en: "N", mr: "ण", caseSensitive: true },
  { en: "L", mr: "ळ", caseSensitive: true },

  // Single consonants - standard
  { en: "k", mr: "क" },
  { en: "g", mr: "ग" },
  { en: "j", mr: "ज" },
  { en: "t", mr: "त" },
  { en: "d", mr: "द" },
  { en: "n", mr: "न" },
  { en: "p", mr: "प" },
  { en: "f", mr: "फ" },
  { en: "b", mr: "ब" },
  { en: "m", mr: "म" },
  { en: "y", mr: "य" },
  { en: "r", mr: "र" },
  { en: "l", mr: "ल" },
  { en: "v", mr: "व" },
  { en: "w", mr: "व" },
  { en: "s", mr: "स" },
  { en: "h", mr: "ह" },
  { en: "x", mr: "क्ष" },
  { en: "z", mr: "झ" }
];

const INDEPENDENT_VOWELS = [
  { en: "aa", mr: "आ" },
  { en: "A", mr: "आ" },
  { en: "a", mr: "अ" },
  { en: "ee", mr: "ई" },
  { en: "ii", mr: "ई" },
  { en: "i", mr: "इ" },
  { en: "oo", mr: "ऊ" },
  { en: "uu", mr: "ऊ" },
  { en: "u", mr: "उ" },
  { en: "ai", mr: "ऐ" },
  { en: "ay", mr: "ऐ" },
  { en: "au", mr: "औ" },
  { en: "ou", mr: "औ" },
  { en: "ow", mr: "औ" },
  { en: "e", mr: "ए" },
  { en: "o", mr: "ओ" },
  { en: "am", mr: "अं" },
  { en: "an", mr: "अं" },
  { en: "ri", mr: "ऋ" },
  { en: "ru", mr: "ऋ" },
  { en: "R", mr: "ऋ", caseSensitive: true }
];

const MATRAS = [
  { en: "aa", mr: "ा" },
  { en: "A", mr: "ा" },
  { en: "a", mr: "" }, // Inherent vowel: cancels halant; at word end becomes kana
  { en: "ee", mr: "ी" },
  { en: "ii", mr: "ी" },
  { en: "i", mr: "ि" },
  { en: "oo", mr: "ू" },
  { en: "uu", mr: "ू" },
  { en: "u", mr: "ु" },
  { en: "ai", mr: "ै" },
  { en: "ay", mr: "ै" },
  { en: "au", mr: "ौ" },
  { en: "ou", mr: "ौ" },
  { en: "ow", mr: "ौ" },
  { en: "e", mr: "े" },
  { en: "o", mr: "ो" },
  { en: "am", mr: "ं" },
  { en: "an", mr: "ं" },
  { en: "R", mr: "ृ", caseSensitive: true }
];

/**
 * Phonetically transliterates a single Roman word to Devanagari.
 * @param {string} text - Single English word (e.g. "shantanu", "ramesh", "Jaad", "Daba")
 * @returns {string} - Devanagari representation
 */
export function phoneticTransliterateWord(text) {
  if (!text) return "";
  const clean = text.trim();
  if (!clean) return "";

  let res = "";
  let i = 0;
  const n = clean.length;

  while (i < n) {
    // Non-alphabetical character: preserve as is
    if (!/[a-zA-Z]/.test(clean[i])) {
      res += clean[i];
      i++;
      continue;
    }

    // Check independent vowel at the beginning of a word or after non-alpha
    let matchedVowel = false;
    if (i === 0 || !/[a-zA-Z]/.test(clean[i - 1])) {
      const initialNasal = clean.substring(i, i + 2).toLowerCase();
      if (initialNasal === 'am' || initialNasal === 'an') {
        const charAfter = clean[i + 2];
        const isFollowedByVowel = charAfter && /[aeiouA]/i.test(charAfter);
        if (!isFollowedByVowel) {
          res += 'अं';
          i += 2;
          matchedVowel = true;
        }
      }
      for (const v of INDEPENDENT_VOWELS) {
        const sub = clean.substring(i, i + v.en.length);
        const isMatch = v.caseSensitive ? sub === v.en : sub.toLowerCase() === v.en.toLowerCase();
        if (isMatch) {
          res += v.mr;
          i += v.en.length;
          matchedVowel = true;
          break;
        }
      }
      if (matchedVowel) continue;
    }

    // Match consonant
    let matchedConsonant = false;
    for (const c of CONSONANTS) {
      const sub = clean.substring(i, i + c.en.length);
      const isMatch = c.caseSensitive ? sub === c.en : sub.toLowerCase() === c.en.toLowerCase();

      if (isMatch) {
        res += c.mr;
        i += c.en.length;
        matchedConsonant = true;

        // Check for attached vowel matra
        let matchedMatra = false;

        // Check 2-letter nasal matras (am, an) representing Marathi Anusvara (ं)
        // when followed by a consonant or at end of word.
        // e.g. 'bandhu' -> 'ब' + 'ं' + 'धु' = 'बंधु', 'sampat' -> 'संपत', 'pankaj' -> 'पंकज'
        const nextTwo = clean.substring(i, i + 2).toLowerCase();
        if (nextTwo === 'am' || nextTwo === 'an') {
          const charAfter = clean[i + 2];
          const isFollowedByVowel = charAfter && /[aeiouA]/i.test(charAfter);
          if (!isFollowedByVowel) {
            res += 'ं';
            i += 2;
            matchedMatra = true;
          }
        }

        if (!matchedMatra) {
          for (const m of MATRAS) {
          const nextSub = clean.substring(i, i + m.en.length);
          const mCaseSensitive = m.caseSensitive || m.en === "A";
          const mMatch = mCaseSensitive ? nextSub === m.en : nextSub.toLowerCase() === m.en.toLowerCase();

          if (mMatch) {
            // When user types trailing "a" at the end of word (e.g. daba -> डबा, patrika -> पत्रिका),
            // in casual Marathi it represents the kana "ा"
            if (m.en === "a" && i + 1 === n && i > 0) {
              res += "ा";
            } else {
              res += m.mr;
            }
            i += m.en.length;
            matchedMatra = true;
            break;
          }
        }
        }

        // If no vowel followed and next character is also a consonant, apply halant (virama ्)
        // In Marathi/Hindi phonetics, word-final consonants do NOT get halant
        if (!matchedMatra) {
          if (i < n && /[a-zA-Z]/.test(clean[i])) {
            res += "्";
          }
        }

        break;
      }
    }

    if (!matchedConsonant) {
      // Fallback
      res += clean[i];
      i++;
    }
  }

  return res;
}
