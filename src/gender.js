/**
 * marathi-transliterate / gender (मराठी व्याकरण लिंग व्यवस्था)
 * Offline-first Marathi grammatical gender analyzer, pronoun resolver,
 * and morphological inflection engine.
 *
 * Supports three primary Marathi genders (पुल्लिंग, स्त्रीलिंग, नपुंसकलिंग)
 * as well as common/dual-gender words (उभयलिंग).
 */

import { transliterateWord } from "./index.js";

export const GENDERS = Object.freeze({
  PULLINGA: "पुल्लिंग",       // Masculine
  STREELINGA: "स्त्रीलिंग",     // Feminine
  NAPUNSAKLINGA: "नपुंसकलिंग", // Neuter
  UBHAYLINGA: "उभयलिंग"       // Dual / Common
});

export const GENDER_KEYS = Object.freeze({
  MASCULINE: "masculine",
  FEMININE: "feminine",
  NEUTER: "neuter",
  COMMON: "common"
});

export const PRONOUNS = Object.freeze({
  PULLINGA: "तो",
  STREELINGA: "ती",
  NAPUNSAKLINGA: "ते",
  UBHAYLINGA: "तो/ती",
  [GENDERS.PULLINGA]: "तो",
  [GENDERS.STREELINGA]: "ती",
  [GENDERS.NAPUNSAKLINGA]: "ते",
  [GENDERS.UBHAYLINGA]: "तो/ती"
});

/**
 * Opposite Gender Pairs (पुल्लिंग <-> स्त्रीलिंग)
 */
export const OPPOSITE_GENDER_PAIRS = {
  // माणसे व नातेसंबंध (Family & Kinship)
  "मुलगा": "मुलगी",
  "मुलगी": "मुलगा",
  "भाऊ": "बहीण",
  "बहीण": "भाऊ",
  "वडील": "आई",
  "आई": "वडील",
  "काका": "काकू",
  "काकू": "काका",
  "मामा": "मामी",
  "मामी": "मामा",
  "आत्या": "मामा",
  "मावशी": "मावसा",
  "मावसा": "मावशी",
  "आजोबा": "आजी",
  "आजी": "आजोबा",
  "पंजोबा": "पंजी",
  "पंजी": "पंजोबा",
  "नवरा": "बायको",
  "बायको": "नवरा",
  "पती": "पत्नी",
  "पत्नी": "पती",
  "सासरा": "सासू",
  "सासू": "सासरा",
  "जावई": "सून",
  "सून": "जावई",
  "दीर": "जाऊ",
  "जाऊ": "दीर",
  "भावोजी": "नणंद",
  "नणंद": "भावोजी",
  "मेहुणा": "मेहुणी",
  "मेहुणी": "मेहुणा",
  "मित्र": "मैत्रीण",
  "मैत्रीण": "मित्र",

  // हुद्दे, व्यवसाय व सामाजिक पदव्या (Professions, Titles & Royalty)
  "राजा": "राणी",
  "राणी": "राजा",
  "सम्राट": "सम्राज्ञी",
  "सम्राज्ञी": "सम्राट",
  "मालक": "मालकीण",
  "मालकीण": "मालक",
  "शेठ": "शेठाणी",
  "शेठाणी": "शेठ",
  "व्यापारी": "व्यापारीण",
  "शिक्षक": "शिक्षिका",
  "शिक्षिका": "शिक्षक",
  "अध्यापक": "अध्यापिका",
  "अध्यापिका": "अध्यापक",
  "लेखक": "लेखिका",
  "लेखिका": "लेखक",
  "कवी": "कवयित्री",
  "कवयित्री": "कवी",
  "गायक": "गायिका",
  "गायिका": "गायक",
  "नायक": "नायिका",
  "नायिका": "नायक",
  "अभिनेता": "अभिनेत्री",
  "अभिनेत्री": "अभिनेता",
  "विद्वान": "विदुषी",
  "विदुषी": "विद्वान",
  "श्रीमान": "श्रीमती",
  "श्रीमती": "श्रीमान",
  "तरुण": "तरुणी",
  "तरुणी": "तरुण",
  "वृद्ध": "वृद्धा",
  "वृद्धा": "वृद्ध",
  "नोकर": "नोकराणी",
  "नोकराणी": "नोकर",
  "धोबी": "धोबीण",
  "धोबीण": "धोबी",
  "कोळी": "कोळीण",
  "कोळीण": "कोळी",
  "गवळी": "गवळण",
  "गवळण": "गवळी",
  "सोनार": "सोनारीण",
  "सोनारीण": "सोनार",
  "लोहार": "लोहारीण",
  "लोहारीण": "लोहार",
  "सुतार": "सुतारीण",
  "सुतारीण": "सुतार",
  "कुंभार": "कुंभारीण",
  "कुंभारीण": "कुंभार",
  "तेली": "तेलीण",
  "तेलीण": "तेली",
  "माळी": "माळीण",
  "माळीण": "माळी",
  "शिंपी": "शिंपीण",
  "शिंपीण": "शिंपी",
  "शेतकरी": "शेतकरीण",
  "शेतकरीण": "शेतकरी",
  "वकील": "वकीलीण",

  // प्राणी व पक्षी (Animals & Birds)
  "बैल": "गाय",
  "गाय": "बैल",
  "घोडा": "घोडी",
  "घोडी": "घोडा",
  "कुत्रा": "कुत्री",
  "कुत्री": "कुत्रा",
  "बोका": "मांजर",
  "मांजर": "बोका",
  "वाघ": "वाघीण",
  "वाघीण": "वाघ",
  "सिंह": "सिंहीण",
  "सिंहीण": "सिंह",
  "हत्ती": "हत्तीण",
  "हत्तीण": "हत्ती",
  "बोकड": "शेळी",
  "शेळी": "बोकड",
  "मेंढा": "मेंढी",
  "मेंढी": "मेंढा",
  "रेडा": "म्हैस",
  "म्हैस": "रेडा",
  "कोंबडा": "कोंबडी",
  "कोंबडी": "कोंबडा",
  "मोर": "लांडोर",
  "लांडोर": "मोर",
  "कावळा": "कावळी",
  "कावळी": "कावळा",
  "चिमणा": "चिमणी",
  "चिमणी": "चिमणा",
  "हंस": "हंसी",
  "हंसी": "हंस",
  "वानर": "वानरी",
  "वानरी": "वानर",
  "उंट": "सांडणी",
  "सांडणी": "उंट",
  "हरिण": "हरिणी",
  "हरिणी": "हरिण",
  "कोल्हा": "कोल्ही",
  "कोल्ही": "कोल्हा"
};

/**
 * Comprehensive Dictionary of Marathi Nouns & Their Grammatical Gender
 */
export const MARATHI_GENDER_DICTIONARY = {
  // === किराणा व अन्नधान्य (Grocery, Staples, Spices, Dairy) ===
  // पुल्लिंग (तो)
  "तांदूळ": GENDERS.PULLINGA,
  "गहू": GENDERS.PULLINGA,
  "रवा": GENDERS.PULLINGA,
  "मैदा": GENDERS.PULLINGA,
  "गूळ": GENDERS.PULLINGA,
  "चहा": GENDERS.PULLINGA,
  "साबण": GENDERS.PULLINGA,
  "कांदा": GENDERS.PULLINGA,
  "बटाटा": GENDERS.PULLINGA,
  "लसूण": GENDERS.PULLINGA,
  "मसाला": GENDERS.PULLINGA,
  "खान्देशी मसाला": GENDERS.PULLINGA,
  "खान्देशी ठेचा": GENDERS.PULLINGA,
  "कम्फर्ट": GENDERS.PULLINGA,
  "कंफर्ट": GENDERS.PULLINGA,
  "कंडिशनर": GENDERS.PULLINGA,
  "फॅब्रिक कंडिशनर": GENDERS.PULLINGA,
  "फिनाईल": GENDERS.PULLINGA,
  "सॉफ्टनर": GENDERS.PULLINGA,
  "फॅब्रिक सॉफ्टनर": GENDERS.PULLINGA,
  "क्लिनर": GENDERS.PULLINGA,
  "फ्लोअर क्लिनर": GENDERS.PULLINGA,
  "टॉयलेट क्लिनर": GENDERS.PULLINGA,
  "फ्रेशनर": GENDERS.PULLINGA,
  "रूम फ्रेशनर": GENDERS.PULLINGA,
  "डांगर": GENDERS.PULLINGA,
  "रोडगा": GENDERS.PULLINGA,
  "झुणका": GENDERS.PULLINGA,
  "रस्सा": GENDERS.PULLINGA,
  "तांबडा रस्सा": GENDERS.PULLINGA,
  "पांढरा रस्सा": GENDERS.PULLINGA,
  "ठेचा": GENDERS.PULLINGA,
  "कोल्हापुरी ठेचा": GENDERS.PULLINGA,
  "काळा मसाला": GENDERS.PULLINGA,
  "गोडा मसाला": GENDERS.PULLINGA,
  "सावजी मसाला": GENDERS.PULLINGA,
  "कोल्हापुरी मसाला": GENDERS.PULLINGA,
  "मालवणी मसाला": GENDERS.PULLINGA,
  "बिबडा": GENDERS.PULLINGA,
  "मोदक": GENDERS.PULLINGA,
  "वडापाव": GENDERS.PULLINGA,
  "मिसळपाव": GENDERS.PULLINGA,
  "पोहे": GENDERS.PULLINGA,
  "साबुदाणा": GENDERS.PULLINGA,
  "मका": GENDERS.PULLINGA,
  "चना": GENDERS.PULLINGA,
  "उडीद": GENDERS.PULLINGA,
  "मूग": GENDERS.PULLINGA,
  "वाटाणा": GENDERS.PULLINGA,
  "पापड": GENDERS.PULLINGA,
  "कापूर": GENDERS.PULLINGA,
  "धूप": GENDERS.PULLINGA,
  "हिंग": GENDERS.PULLINGA,
  "कढीपत्ता": GENDERS.PULLINGA,
  "टोमॅटो": GENDERS.PULLINGA,
  "भोपळा": GENDERS.PULLINGA,
  "कोबी": GENDERS.PULLINGA,
  "आंबा": GENDERS.PULLINGA,
  "पेरू": GENDERS.PULLINGA,
  "चिकू": GENDERS.PULLINGA,
  "नारळ": GENDERS.PULLINGA,
  "काजू": GENDERS.PULLINGA,
  "बदाम": GENDERS.PULLINGA,
  "पिस्ता": GENDERS.PULLINGA,
  "अक्रोड": GENDERS.PULLINGA,
  "खजूर": GENDERS.PULLINGA,
  "आवळा": GENDERS.PULLINGA,
  "लाडू": GENDERS.PULLINGA,
  "पेढा": GENDERS.PULLINGA,
  "शिरा": GENDERS.PULLINGA,
  "भात": GENDERS.PULLINGA,
  "जाम": GENDERS.PULLINGA,
  "शाम्पू": GENDERS.PULLINGA,

  // स्त्रीलिंग (ती)
  "साखर": GENDERS.STREELINGA,
  "हळद": GENDERS.STREELINGA,
  "डाळ": GENDERS.STREELINGA,
  "तूरडाळ": GENDERS.STREELINGA,
  "मूगडाळ": GENDERS.STREELINGA,
  "चणाडाळ": GENDERS.STREELINGA,
  "उडीदडाळ": GENDERS.STREELINGA,
  "मसूरडाळ": GENDERS.STREELINGA,
  "मोहरी": GENDERS.STREELINGA,
  "मेथी": GENDERS.STREELINGA,
  "मिरची": GENDERS.STREELINGA,
  "कोथिंबीर": GENDERS.STREELINGA,
  "लवंग": GENDERS.STREELINGA,
  "वेलची": GENDERS.STREELINGA,
  "खसखस": GENDERS.STREELINGA,
  "सुंठ": GENDERS.STREELINGA,
  "दालचिनी": GENDERS.STREELINGA,
  "ज्वारी": GENDERS.STREELINGA,
  "बाजरी": GENDERS.STREELINGA,
  "कॉफी": GENDERS.STREELINGA,
  "हळदी": GENDERS.STREELINGA,
  "शेव": GENDERS.STREELINGA,
  "चकली": GENDERS.STREELINGA,
  "भाजी": GENDERS.STREELINGA,
  "चपाती": GENDERS.STREELINGA,
  "पोळी": GENDERS.STREELINGA,
  "भाकरी": GENDERS.STREELINGA,
  "पुरी": GENDERS.STREELINGA,
  "खीर": GENDERS.STREELINGA,
  "अंगूर": GENDERS.STREELINGA,
  "द्राक्षे": GENDERS.NAPUNSAKLINGA,
  "सुपारी": GENDERS.STREELINGA,
  "अगरबत्ती": GENDERS.STREELINGA,
  "मेणबत्ती": GENDERS.STREELINGA,
  "कात्री": GENDERS.STREELINGA,
  "सुरी": GENDERS.STREELINGA,
  "पिशवी": GENDERS.STREELINGA,
  "बाटली": GENDERS.STREELINGA,
  "खान्देशी शेवभाजी": GENDERS.STREELINGA,
  "पाटवडी": GENDERS.STREELINGA,
  "अळूवडी": GENDERS.STREELINGA,
  "कोथिंबीर वडी": GENDERS.STREELINGA,
  "भाजणी": GENDERS.STREELINGA,
  "कुरडई": GENDERS.STREELINGA,
  "उकडपेंडी": GENDERS.STREELINGA,
  "शेंगदाणा चटणी": GENDERS.STREELINGA,
  "लसूण चटणी": GENDERS.STREELINGA,
  "पुरणपोळी": GENDERS.STREELINGA,
  "बासुंदी": GENDERS.STREELINGA,
  "कचोरी": GENDERS.STREELINGA,
  "डांबरगोळी": GENDERS.STREELINGA,
  "वाटी": GENDERS.STREELINGA,
  "थाळी": GENDERS.STREELINGA,

  // नपुंसकलिंग (ते)
  "लिक्विड": GENDERS.NAPUNSAKLINGA,
  "कम्फर्ट लिक्विड": GENDERS.NAPUNSAKLINGA,
  "फिनाईल लिक्विड": GENDERS.NAPUNSAKLINGA,
  "डिटर्जंट लिक्विड": GENDERS.NAPUNSAKLINGA,
  "हँडवॉश लिक्विड": GENDERS.NAPUNSAKLINGA,
  "डिशवॉश लिक्विड": GENDERS.NAPUNSAKLINGA,
  "सर्फ एक्सेल लिक्विड": GENDERS.NAPUNSAKLINGA,
  "एरियल लिक्विड": GENDERS.NAPUNSAKLINGA,
  "इझी लिक्विड": GENDERS.NAPUNSAKLINGA,
  "जेंटील लिक्विड": GENDERS.NAPUNSAKLINGA,
  "व्हॅनिश लिक्विड": GENDERS.NAPUNSAKLINGA,
  "उजाला लिक्विड": GENDERS.NAPUNSAKLINGA,
  "थालीपीठ": GENDERS.NAPUNSAKLINGA,
  "कळणा पीठ": GENDERS.NAPUNSAKLINGA,
  "पिठलं": GENDERS.NAPUNSAKLINGA,
  "बिबडे": GENDERS.NAPUNSAKLINGA,
  "रोडगे": GENDERS.NAPUNSAKLINGA,
  "सांडगे": GENDERS.NAPUNSAKLINGA,
  "तेल": GENDERS.NAPUNSAKLINGA,
  "तूप": GENDERS.NAPUNSAKLINGA,
  "मीठ": GENDERS.NAPUNSAKLINGA,
  "बेसन": GENDERS.NAPUNSAKLINGA,
  "पीठ": GENDERS.NAPUNSAKLINGA,
  "दूध": GENDERS.NAPUNSAKLINGA,
  "पाणी": GENDERS.NAPUNSAKLINGA,
  "दही": GENDERS.NAPUNSAKLINGA,
  "ताक": GENDERS.NAPUNSAKLINGA,
  "पनीर": GENDERS.NAPUNSAKLINGA,
  "लोणी": GENDERS.NAPUNSAKLINGA,
  "धान्य": GENDERS.NAPUNSAKLINGA,
  "कडधान्य": GENDERS.NAPUNSAKLINGA,
  "केळे": GENDERS.NAPUNSAKLINGA,
  "सफरचंद": GENDERS.NAPUNSAKLINGA,
  "डाळिंब": GENDERS.NAPUNSAKLINGA,
  "अननस": GENDERS.NAPUNSAKLINGA,
  "लिंबू": GENDERS.NAPUNSAKLINGA,
  "लोणचे": GENDERS.NAPUNSAKLINGA,
  "आले": GENDERS.NAPUNSAKLINGA,
  "अद्रक": GENDERS.NAPUNSAKLINGA,
  "वांगे": GENDERS.NAPUNSAKLINGA,
  "खोबरे": GENDERS.NAPUNSAKLINGA,
  "बिस्कीट": GENDERS.NAPUNSAKLINGA,
  "भांडे": GENDERS.NAPUNSAKLINGA,
  "ताट": GENDERS.NAPUNSAKLINGA,
  "पातेले": GENDERS.NAPUNSAKLINGA,
  "पोर": GENDERS.NAPUNSAKLINGA,
  "मूल": GENDERS.NAPUNSAKLINGA,
  "बाळ": GENDERS.NAPUNSAKLINGA,

  // === निसर्ग, घरे, वस्तू व दैनंदिन जीवन ===
  // पुल्लिंग (तो)
  "दगड": GENDERS.PULLINGA,
  "डोंगर": GENDERS.PULLINGA,
  "पर्वत": GENDERS.PULLINGA,
  "रस्ता": GENDERS.PULLINGA,
  "चौक": GENDERS.PULLINGA,
  "पूल": GENDERS.PULLINGA,
  "दिवा": GENDERS.PULLINGA,
  "टेबल": GENDERS.PULLINGA,
  "पंखा": GENDERS.PULLINGA,
  "डबा": GENDERS.PULLINGA,
  "चमचा": GENDERS.PULLINGA,
  "पेन": GENDERS.PULLINGA,
  "कागद": GENDERS.PULLINGA,
  "फळा": GENDERS.PULLINGA,
  "रुमाल": GENDERS.PULLINGA,
  "दरवाजा": GENDERS.PULLINGA,
  "सूर्य": GENDERS.PULLINGA,
  "चंद्र": GENDERS.PULLINGA,
  "वारा": GENDERS.PULLINGA,
  "पाऊस": GENDERS.PULLINGA,
  "समुद्र": GENDERS.PULLINGA,
  "आवाज": GENDERS.PULLINGA,
  "रंग": GENDERS.PULLINGA,
  "खडू": GENDERS.PULLINGA,
  "फोन": GENDERS.PULLINGA,
  "संगणक": GENDERS.PULLINGA,

  // स्त्रीलिंग (ती)
  "नदी": GENDERS.STREELINGA,
  "हवा": GENDERS.STREELINGA,
  "वीज": GENDERS.STREELINGA,
  "जमीन": GENDERS.STREELINGA,
  "माती": GENDERS.STREELINGA,
  "वाळू": GENDERS.STREELINGA,
  "रात्र": GENDERS.STREELINGA,
  "सकाळ": GENDERS.STREELINGA,
  "संध्याकाळ": GENDERS.STREELINGA,
  "वही": GENDERS.STREELINGA,
  "पेन्सिल": GENDERS.STREELINGA,
  "भिंत": GENDERS.STREELINGA,
  "खिडकी": GENDERS.STREELINGA,
  "खोली": GENDERS.STREELINGA,
  "इमारत": GENDERS.STREELINGA,
  "शाळा": GENDERS.STREELINGA,
  "बँक": GENDERS.STREELINGA,
  "गाडी": GENDERS.STREELINGA,
  "सायकल": GENDERS.STREELINGA,
  "बस": GENDERS.STREELINGA,
  "आगगाडी": GENDERS.STREELINGA,
  "चादर": GENDERS.STREELINGA,
  "गोधडी": GENDERS.STREELINGA,
  "साडी": GENDERS.STREELINGA,
  "टोपी": GENDERS.STREELINGA,
  "खुर्ची": GENDERS.STREELINGA,

  // नपुंसकलिंग (ते)
  "पुस्तक": GENDERS.NAPUNSAKLINGA,
  "झाड": GENDERS.NAPUNSAKLINGA,
  "फूल": GENDERS.NAPUNSAKLINGA,
  "पान": GENDERS.NAPUNSAKLINGA,
  "मूळ": GENDERS.NAPUNSAKLINGA,
  "बी": GENDERS.NAPUNSAKLINGA,
  "फळ": GENDERS.NAPUNSAKLINGA,
  "घर": GENDERS.NAPUNSAKLINGA,
  "शहर": GENDERS.NAPUNSAKLINGA,
  "गाव": GENDERS.NAPUNSAKLINGA,
  "राज्य": GENDERS.NAPUNSAKLINGA,
  "राष्ट्र": GENDERS.NAPUNSAKLINGA,
  "जग": GENDERS.NAPUNSAKLINGA,
  "दार": GENDERS.NAPUNSAKLINGA,
  "छप्पर": GENDERS.NAPUNSAKLINGA,
  "मैदान": GENDERS.NAPUNSAKLINGA,
  "पाखरू": GENDERS.NAPUNSAKLINGA,
  "चित्र": GENDERS.NAPUNSAKLINGA,
  "अक्षर": GENDERS.NAPUNSAKLINGA,
  "वाक्य": GENDERS.NAPUNSAKLINGA,
  "पत्र": GENDERS.NAPUNSAKLINGA,
  "कपाट": GENDERS.NAPUNSAKLINGA,
  "दुकान": GENDERS.NAPUNSAKLINGA,

  // === उभयलिंगी शब्द (Both Masculine & Feminine) ===
  "बाग": GENDERS.UBHAYLINGA,
  "वेळ": GENDERS.UBHAYLINGA,
  "तंबाखू": GENDERS.UBHAYLINGA,
  "पोर": GENDERS.UBHAYLINGA
};

/**
 * Extends the gender dictionary at runtime with custom words.
 * @param {Record<string, string>} map - Map of Marathi word -> Gender
 */
export function extendGenderDictionary(map) {
  if (map && typeof map === "object") {
    Object.assign(MARATHI_GENDER_DICTIONARY, map);
  }
}

/**
 * Heuristic morphological rule analyzer for words not present in the dictionary.
 * Analyzes Devanagari vowel and consonant suffixes.
 * @param {string} marathiWord
 * @returns {{ gender: string, confidence: string, reason: string }}
 */
function analyzeGenderByMorphology(marathiWord) {
  const word = marathiWord.trim();
  if (!word) {
    return { gender: GENDERS.PULLINGA, confidence: "default", reason: "empty input" };
  }

  // 1. Feminine agentive/diminutive suffixes
  // उदा. -ीण (वाघीण, सिंहीण, मालकीण, धोबीण), -िका (शिक्षिका, लेखिका, गायिका)
  if (word.endsWith("ीण") || word.endsWith("िका") || word.endsWith("त्री") || word.endsWith("वती") || word.endsWith("मती")) {
    return {
      gender: GENDERS.STREELINGA,
      confidence: "rule",
      reason: "feminine suffix (-ीण / -िका / -त्री / -वती)"
    };
  }

  // 2. Neuter abstract / collective suffixes
  // उदा. -पण, -त्व, -मंडळ, -स्थान, -गृह
  if (word.endsWith("पण") || word.endsWith("त्व") || word.endsWith("मंडळ") || word.endsWith("स्थान") || word.endsWith("गृह") || word.endsWith("केंद्र")) {
    return {
      gender: GENDERS.NAPUNSAKLINGA,
      confidence: "rule",
      reason: "neuter abstract/collective suffix"
    };
  }

  // 3. Vowel Ending Heuristics (अंत्य स्वर खूण)
  // -ा (उदा. आकारांत: घोडा, दिवा, डबा, चमचा, मुलगा) -> बहुतांशी पुल्लिंग
  if (word.endsWith("ा")) {
    // Apavad: हवा, शाळा, दिशा, सभा (Sanskrit stree-linga)
    if (["हवा", "शाळा", "दिशा", "सभा", "आशा", "पूजा", "विद्या", "सेवा", "माता"].includes(word)) {
      return { gender: GENDERS.STREELINGA, confidence: "dictionary", reason: "stree-linga a-ending" };
    }
    return {
      gender: GENDERS.PULLINGA,
      confidence: "rule",
      reason: "a-ending (आकारांत बहुतांशी पुल्लिंग)"
    };
  }

  // -ी or -ई (उदा. ईकारांत: वही, नदी, गाडी, साडी, बाटली, काठी) -> बहुतांशी स्त्रीलिंग
  if (word.endsWith("ी") || word.endsWith("ई") || word.endsWith("ि") || word.endsWith("इ")) {
    // Apavad: पाणी, लोणी, दही (नपुंसकलिंग), हत्ती, माळी, धोबी, काझी (पुल्लिंग)
    if (["पाणी", "लोणी", "दही", "मोती"].includes(word)) {
      return { gender: GENDERS.NAPUNSAKLINGA, confidence: "dictionary", reason: "neuter ee-ending" };
    }
    if (["हत्ती", "माळी", "धोबी", "तेली", "शेतकरी", "व्यापारी", "पक्षी"].includes(word)) {
      return { gender: GENDERS.PULLINGA, confidence: "dictionary", reason: "masculine profession ee-ending" };
    }
    return {
      gender: GENDERS.STREELINGA,
      confidence: "rule",
      reason: "ee-ending (ईकारांत बहुतांशी स्त्रीलिंग)"
    };
  }

  // -े or -ए (उदा. एकारांत: केळे, तळे, गाणे, भांडे, पातेले, लाडके) -> बहुतांशी नपुंसकलिंग
  if (word.endsWith("े") || word.endsWith("ए")) {
    return {
      gender: GENDERS.NAPUNSAKLINGA,
      confidence: "rule",
      reason: "e-ending (एकारांत बहुतांशी नपुंसकलिंग)"
    };
  }

  // -ू or -ऊ (उदा. ऊकारांत):
  if (word.endsWith("ू") || word.endsWith("ऊ")) {
    if (["सासू", "जळू", "वाळू", "दारू", "वस्तू"].includes(word)) {
      return { gender: GENDERS.STREELINGA, confidence: "dictionary", reason: "feminine oo-ending" };
    }
    if (["लिंबू", "पाखरू", "पिळू"].includes(word)) {
      return { gender: GENDERS.NAPUNSAKLINGA, confidence: "dictionary", reason: "neuter oo-ending" };
    }
    return {
      gender: GENDERS.PULLINGA,
      confidence: "rule",
      reason: "oo-ending (उदा. लाडू, पेढा, खडू)"
    };
  }

  // Default for unclassified consonant endings (अकारांत)
  return {
    gender: GENDERS.PULLINGA,
    confidence: "default",
    reason: "consonant ending heuristic (अकारांत)"
  };
}

/**
 * Analyzes the grammatical gender (लिंग) of any Marathi word.
 * Automatically accepts both Devanagari (e.g. "साखर") and Latin transliteration (e.g. "sakhar").
 *
 * @param {string} word - The word to analyze
 * @returns {{
 *   word: string,
 *   devanagari: string,
 *   gender: string,
 *   genderKey: string,
 *   pronoun: string,
 *   label: string,
 *   confidence: "dictionary" | "pair" | "rule" | "default",
 *   isDual: boolean,
 *   oppositeGender: string | null,
 *   formatted: string
 * }}
 */
export function getGender(word) {
  if (!word || typeof word !== "string") {
    return {
      word: "",
      devanagari: "",
      gender: GENDERS.PULLINGA,
      genderKey: GENDER_KEYS.MASCULINE,
      pronoun: PRONOUNS.PULLINGA,
      label: `${GENDERS.PULLINGA} (${PRONOUNS.PULLINGA})`,
      confidence: "default",
      isDual: false,
      oppositeGender: null,
      formatted: ""
    };
  }

  const clean = word.trim();
  // Check if Latin script is passed, auto-transliterate
  const isAscii = /^[a-zA-Z0-9_\-\s]+$/.test(clean);
  const devanagari = isAscii ? transliterateWord(clean) : clean;

  // 1. Direct match in dictionary
  if (MARATHI_GENDER_DICTIONARY[devanagari]) {
    const gender = MARATHI_GENDER_DICTIONARY[devanagari];
    const isDual = gender === GENDERS.UBHAYLINGA;
    const pronoun = isDual ? "तो/ती" : PRONOUNS[gender];
    const oppositeGender = OPPOSITE_GENDER_PAIRS[devanagari] || null;
    const genderKey = isDual
      ? GENDER_KEYS.COMMON
      : gender === GENDERS.PULLINGA
      ? GENDER_KEYS.MASCULINE
      : gender === GENDERS.STREELINGA
      ? GENDER_KEYS.FEMININE
      : GENDER_KEYS.NEUTER;

    return {
      word: clean,
      devanagari,
      gender,
      genderKey,
      pronoun,
      label: `${gender} (${pronoun})`,
      confidence: "dictionary",
      isDual,
      oppositeGender,
      formatted: `${pronoun} ${devanagari}`
    };
  }

  // 2. Check opposite gender pairs table
  if (OPPOSITE_GENDER_PAIRS[devanagari]) {
    const opp = OPPOSITE_GENDER_PAIRS[devanagari];
    // If opposite exists in dictionary, invert it!
    const oppGender = MARATHI_GENDER_DICTIONARY[opp];
    let gender = GENDERS.PULLINGA;
    if (oppGender === GENDERS.PULLINGA) gender = GENDERS.STREELINGA;
    else if (oppGender === GENDERS.STREELINGA) gender = GENDERS.PULLINGA;
    else {
      // Analyze suffix
      gender = devanagari.endsWith("ी") || devanagari.endsWith("ीण") || devanagari.endsWith("िका")
        ? GENDERS.STREELINGA
        : GENDERS.PULLINGA;
    }

    const pronoun = PRONOUNS[gender];
    return {
      word: clean,
      devanagari,
      gender,
      genderKey: gender === GENDERS.PULLINGA ? GENDER_KEYS.MASCULINE : GENDER_KEYS.FEMININE,
      pronoun,
      label: `${gender} (${pronoun})`,
      confidence: "pair",
      isDual: false,
      oppositeGender: opp,
      formatted: `${pronoun} ${devanagari}`
    };
  }

  // 3. Morphological Rule Analysis
  const ruleResult = analyzeGenderByMorphology(devanagari);
  const pronoun = PRONOUNS[ruleResult.gender];
  const genderKey = ruleResult.gender === GENDERS.PULLINGA
    ? GENDER_KEYS.MASCULINE
    : ruleResult.gender === GENDERS.STREELINGA
    ? GENDER_KEYS.FEMININE
    : GENDER_KEYS.NEUTER;

  return {
    word: clean,
    devanagari,
    gender: ruleResult.gender,
    genderKey,
    pronoun,
    label: `${ruleResult.gender} (${pronoun})`,
    confidence: ruleResult.confidence,
    isDual: false,
    oppositeGender: null,
    formatted: `${pronoun} ${devanagari}`
  };
}

/**
 * Returns the correct demonstrative pronoun ("तो", "ती", "ते") for a word.
 * @param {string} word
 * @returns {string}
 */
export function getPronoun(word) {
  return getGender(word).pronoun;
}

/**
 * Formats a word with its natural Marathi pronoun (e.g. "तो कांदा", "ती साखर", "ते तेल")
 * @param {string} word
 * @returns {string}
 */
export function formatWithPronoun(word) {
  return getGender(word).formatted;
}

/**
 * Returns the opposite gender counterpart if known (e.g. मुलगा -> मुलगी, घोडा -> घोडी).
 * @param {string} word
 * @returns {string | null}
 */
export function getOppositeGender(word) {
  const result = getGender(word);
  return result.oppositeGender;
}

/**
 * Changes/inflects gender of a word if known.
 * @param {string} word
 * @returns {string} The inflected word or original if no known counterpart
 */
export function changeGender(word) {
  const opposite = getOppositeGender(word);
  return opposite || word;
}

/**
 * Checks if a word is masculine (पुल्लिंग / तो)
 * @param {string} word
 * @returns {boolean}
 */
export function isMasculine(word) {
  const res = getGender(word);
  return res.gender === GENDERS.PULLINGA || res.isDual;
}
export const isPullinga = isMasculine;

/**
 * Checks if a word is feminine (स्त्रीलिंग / ती)
 * @param {string} word
 * @returns {boolean}
 */
export function isFeminine(word) {
  const res = getGender(word);
  return res.gender === GENDERS.STREELINGA || res.isDual;
}
export const isStreelinga = isFeminine;

/**
 * Checks if a word is neuter (नपुंसकलिंग / ते)
 * @param {string} word
 * @returns {boolean}
 */
export function isNeuter(word) {
  const res = getGender(word);
  return res.gender === GENDERS.NAPUNSAKLINGA;
}
export const isNapunsaklinga = isNeuter;

/**
 * Checks if a word has dual/common gender (उदा. बाग, वेळ)
 * @param {string} word
 * @returns {boolean}
 */
export function isDualGender(word) {
  return getGender(word).isDual;
}
export const isUbhaya = isDualGender;

export default {
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
