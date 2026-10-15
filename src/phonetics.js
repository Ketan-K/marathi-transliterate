/**
 * Algorithmic phonetic transliteration from Roman (English) script
 * to Marathi (Devanagari) script.
 */

const CONSONANTS = [
  // Multi-character special combinations
  { en: 'dny', mr: 'ज्ञ' },
  { en: 'jn', mr: 'ज्ञ' },
  { en: 'gy', mr: 'ज्ञ' },
  { en: 'ksh', mr: 'क्ष' },
  { en: 'shr', mr: 'श्र' },
  { en: 'chh', mr: 'छ' },
  { en: 'ch', mr: 'च' },
  { en: 'kh', mr: 'ख' },
  { en: 'gh', mr: 'घ' },
  { en: 'jh', mr: 'झ' },
  { en: 'zh', mr: 'झ' },
  { en: 'th', mr: 'थ' },
  { en: 'dh', mr: 'ध' },
  { en: 'ph', mr: 'फ' },
  { en: 'bh', mr: 'भ' },
  { en: 'shh', mr: 'ष' },
  { en: 'sh', mr: 'श' },
  { en: 'ng', mr: 'ङ' },

  // Single consonants
  { en: 'k', mr: 'क' },
  { en: 'g', mr: 'ग' },
  { en: 'j', mr: 'ज' },
  { en: 't', mr: 'त' },
  { en: 'd', mr: 'द' },
  { en: 'n', mr: 'न' },
  { en: 'p', mr: 'प' },
  { en: 'f', mr: 'फ' },
  { en: 'b', mr: 'ब' },
  { en: 'm', mr: 'म' },
  { en: 'y', mr: 'य' },
  { en: 'r', mr: 'र' },
  { en: 'l', mr: 'ल' },
  { en: 'L', mr: 'ळ' },
  { en: 'v', mr: 'व' },
  { en: 'w', mr: 'व' },
  { en: 's', mr: 'स' },
  { en: 'h', mr: 'ह' },
  { en: 'x', mr: 'क्ष' },
  { en: 'z', mr: 'झ' },
  { en: 'T', mr: 'ट' },
  { en: 'D', mr: 'ड' },
  { en: 'N', mr: 'ण' }
];

const INDEPENDENT_VOWELS = [
  { en: 'aa', mr: 'आ' },
  { en: 'A', mr: 'आ' },
  { en: 'a', mr: 'अ' },
  { en: 'ee', mr: 'ई' },
  { en: 'ii', mr: 'ई' },
  { en: 'i', mr: 'इ' },
  { en: 'oo', mr: 'ऊ' },
  { en: 'uu', mr: 'ऊ' },
  { en: 'u', mr: 'उ' },
  { en: 'ai', mr: 'ऐ' },
  { en: 'ay', mr: 'ऐ' },
  { en: 'au', mr: 'औ' },
  { en: 'ou', mr: 'औ' },
  { en: 'ow', mr: 'औ' },
  { en: 'e', mr: 'ए' },
  { en: 'o', mr: 'ओ' },
  { en: 'am', mr: 'अं' },
  { en: 'an', mr: 'अं' },
  { en: 'ri', mr: 'ऋ' },
  { en: 'ru', mr: 'ऋ' }
];

const MATRAS = [
  { en: 'aa', mr: 'ा' },
  { en: 'A', mr: 'ा' },
  { en: 'a', mr: '' }, // Inherent vowel: cancels halant, no visible matra
  { en: 'ee', mr: 'ी' },
  { en: 'ii', mr: 'ी' },
  { en: 'i', mr: 'ि' },
  { en: 'oo', mr: 'ू' },
  { en: 'uu', mr: 'ू' },
  { en: 'u', mr: 'ु' },
  { en: 'ai', mr: 'ै' },
  { en: 'ay', mr: 'ै' },
  { en: 'au', mr: 'ौ' },
  { en: 'ou', mr: 'ौ' },
  { en: 'ow', mr: 'ौ' },
  { en: 'e', mr: 'े' },
  { en: 'o', mr: 'ो' },
  { en: 'am', mr: 'ं' },
  { en: 'an', mr: 'ं' },
  { en: 'ri', mr: 'ृ' },
  { en: 'ru', mr: 'ृ' }
];

/**
 * Phonetically transliterates a single Roman word to Devanagari.
 * @param {string} text - Single English word (e.g. "shantanu", "ramesh")
 * @returns {string} - Devanagari representation
 */
export function phoneticTransliterateWord(text) {
  if (!text) return '';
  const clean = text.trim();
  if (!clean) return '';

  let res = '';
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
      for (const v of INDEPENDENT_VOWELS) {
        if (clean.substring(i, i + v.en.length).toLowerCase() === v.en.toLowerCase()) {
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
      const isCaseSensitive = c.en === 'L' || c.en === 'T' || c.en === 'D' || c.en === 'N';
      const isMatch = isCaseSensitive ? sub === c.en : sub.toLowerCase() === c.en.toLowerCase();

      if (isMatch) {
        res += c.mr;
        i += c.en.length;
        matchedConsonant = true;

        // Check for attached vowel matra
        let matchedMatra = false;
        for (const m of MATRAS) {
          const nextSub = clean.substring(i, i + m.en.length);
          const mCaseSensitive = m.en === 'A';
          const mMatch = mCaseSensitive ? nextSub === m.en : nextSub.toLowerCase() === m.en.toLowerCase();

          if (mMatch) {
            res += m.mr;
            i += m.en.length;
            matchedMatra = true;
            break;
          }
        }

        // If no vowel followed and next character is also a consonant, apply halant (virama ्)
        // In Marathi/Hindi phonetics, word-final consonants do NOT get halant
        if (!matchedMatra) {
          if (i < n && /[a-zA-Z]/.test(clean[i])) {
            res += '्';
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
