import test from "node:test";
import assert from "node:assert/strict";
import {
  transliterateWord,
  transliterate,
  toDevanagari,
  getSuggestions,
  extendDictionary,
  normalizeMarathi,
  MARATHI_DICTIONARY
} from "../src/index.js";

test("Transliterates everyday Marathi grocery items accurately", () => {
  assert.equal(transliterateWord("sakhar"), "साखर");
  assert.equal(transliterateWord("Sakhar"), "साखर");
  assert.equal(transliterateWord("kanda"), "कांदा");
  assert.equal(transliterateWord("batata"), "बटाटा");
  assert.equal(transliterateWord("mith"), "मीठ");
  assert.equal(transliterateWord("tel"), "तेल");
  assert.equal(transliterateWord("gahu"), "गहू");
  assert.equal(transliterateWord("tandul"), "तांदूळ");
  assert.equal(transliterateWord("pohe"), "पोहे");
  assert.equal(transliterateWord("rava"), "रवा");
  assert.equal(transliterateWord("besan"), "बेसन");
  assert.equal(transliterateWord("chaha"), "चहा");
  assert.equal(transliterateWord("toor"), "तूर");
  assert.equal(transliterateWord("moong"), "मूग");
  assert.equal(transliterateWord("udid"), "उडीद");
  assert.equal(transliterateWord("chana"), "चना");
  assert.equal(transliterateWord("gul"), "गूळ");
  assert.equal(transliterateWord("toop"), "तूप");
  assert.equal(transliterateWord("saban"), "साबण");
  assert.equal(transliterateWord("agarbatti"), "अगरबत्ती");
  assert.equal(transliterateWord("kapoor"), "कापूर");
  assert.equal(transliterateWord("dhoop"), "धूप");
  assert.equal(transliterateWord("masala"), "मसाला");
  assert.equal(transliterateWord("halad"), "हळद");
  assert.equal(transliterateWord("lasun"), "लसूण");
  assert.equal(transliterateWord("aale"), "आले");
  assert.equal(transliterateWord("kothimbir"), "कोथिंबीर");
  assert.equal(transliterateWord("jira"), "जिरे");
  assert.equal(transliterateWord("mohari"), "मोहरी");
  assert.equal(transliterateWord("biscuit"), "बिस्कीट");
  assert.equal(transliterateWord("dudh"), "दूध");
  assert.equal(transliterateWord("dahi"), "दही");
  assert.equal(transliterateWord("taak"), "ताक");
  assert.equal(transliterateWord("paneer"), "पनीर");
});

test("Transliterates dry fruits accurately", () => {
  assert.equal(transliterateWord("badam"), "बदाम");
  assert.equal(transliterateWord("kaju"), "काजू");
  assert.equal(transliterateWord("pista"), "पिस्ता");
  assert.equal(transliterateWord("manuka"), "मनुका");
  assert.equal(transliterateWord("anjeer"), "अंजीर");
});

test("Transliterates common names and surnames accurately with ळ / ल", () => {
  assert.equal(transliterateWord("ketan"), "केतन");
  assert.equal(transliterateWord("rahul"), "राहुल");
  assert.equal(transliterateWord("patil"), "पाटील");
  assert.equal(transliterateWord("deshmukh"), "देशमुख");
  assert.equal(transliterateWord("pawar"), "पवार");
  assert.equal(transliterateWord("jadhav"), "जाधव");
  assert.equal(transliterateWord("shinde"), "शिंदे");
  assert.equal(transliterateWord("kadam"), "कदम");
  assert.equal(transliterateWord("katore"), "कटोरे");
  assert.equal(transliterateWord("khule"), "खुळे");
  assert.equal(transliterateWord("mule"), "मुळे");
  assert.equal(transliterateWord("kamble"), "कांबळे");
  assert.equal(transliterateWord("shelke"), "शेळके");
  assert.equal(transliterateWord("ingale"), "इंगळे");
  assert.equal(transliterateWord("jawale"), "जावळे");
  assert.equal(transliterateWord("salve"), "साळवे");
  assert.equal(transliterateWord("bhusal"), "भुसाळ");
  assert.equal(transliterateWord("namaskar"), "नमस्कार");
  assert.equal(transliterateWord("dhanyavad"), "धन्यवाद");
  assert.equal(transliterateWord("swagat"), "स्वागत");
  assert.equal(transliterateWord("kirana"), "किराणा");
  assert.equal(transliterateWord("dukan"), "दुकान");
  assert.equal(transliterateWord("dnyaneshwar"), "ज्ञानेश्वर");
});

test("Transliterates full multi-word sentences and preserves numbers/symbols", () => {
  const sentence = "sakhar 1 kilo ani kanda 2 kg";
  const expected = "साखर 1 किलो आणि कांदा 2 कि.ग्रॅ.";
  assert.equal(transliterate(sentence), expected);

  const greeting = transliterate("namaskar grahak");
  assert.equal(greeting, "नमस्कार ग्राहक");
});

test("getSuggestions returns candidate list with smart ळ and ल variants", () => {
  const list = getSuggestions("sakhar");
  assert.ok(Array.isArray(list));
  assert.ok(list.includes("साखर"));

  const bhusalList = getSuggestions("bhusal");
  assert.ok(bhusalList.includes("भुसाळ"));
});

test("extendDictionary allows adding runtime words", () => {
  extendDictionary({ "sangamner": "संगमनेर" });
  assert.equal(transliterateWord("sangamner"), "संगमनेर");
});

test("normalizeMarathi normalizes ळ/ल and matras for comparison", () => {
  assert.equal(normalizeMarathi("भुसाळ"), "भुसाल");
  assert.equal(normalizeMarathi("पाटील"), "पाटिल");
});

test("Transliterates retroflex consonants (ड, ढ, ट, ठ, ण, ळ) and Jaad accurately", () => {
  // jaad / Jaad / jaaD -> जाड
  assert.equal(transliterateWord("jaad"), "जाड");
  assert.equal(transliterateWord("Jaad"), "जाड");
  assert.equal(transliterateWord("jaaD"), "जाड");
  assert.equal(transliterateWord("JaaD"), "जाड");
  assert.equal(transliterateWord("jad"), "जाड");
  assert.equal(transliterateWord("jada"), "जाडा");

  // Single consonants
  assert.equal(transliterateWord("D"), "ड");
  assert.equal(transliterateWord("d"), "द");
  assert.equal(transliterateWord("T"), "ट");
  assert.equal(transliterateWord("t"), "त");
  assert.equal(transliterateWord("Th"), "ठ");
  assert.equal(transliterateWord("th"), "थ");
  assert.equal(transliterateWord("Dh"), "ढ");
  assert.equal(transliterateWord("dh"), "ध");
  assert.equal(transliterateWord("N"), "ण");
  assert.equal(transliterateWord("n"), "न");
  assert.equal(transliterateWord("L"), "ळ");
  assert.equal(transliterateWord("l"), "ल");
  assert.equal(transliterateWord("Sh"), "ष");
  assert.equal(transliterateWord("sh"), "श");

  // Everyday grocery & shop words with retroflex letters
  assert.equal(transliterateWord("daba"), "डबा");
  assert.equal(transliterateWord("Daba"), "डबा");
  assert.equal(transliterateWord("dabba"), "डबा");
  assert.equal(transliterateWord("papad"), "पापड");
  assert.equal(transliterateWord("kadak"), "कडक");
  assert.equal(transliterateWord("laddu"), "लाडू");
  assert.equal(transliterateWord("bhendi"), "भेंडी");
  assert.equal(transliterateWord("thik"), "ठीक");
  assert.equal(transliterateWord("dhag"), "ढग");
});

test("getSuggestions returns candidate list with smart ड/द, ढ/ध, ट/त variants", () => {
  const jaadSuggestions = getSuggestions("jaad");
  assert.ok(jaadSuggestions.includes("जाड"));
  assert.equal(jaadSuggestions[0], "जाड");

  const JaadSuggestions = getSuggestions("Jaad");
  assert.ok(JaadSuggestions.includes("जाड"));
  assert.equal(JaadSuggestions[0], "जाड");

  const dSuggestions = getSuggestions("D");
  assert.equal(dSuggestions[0], "ड");
  assert.ok(dSuggestions.includes("द"));

  const lowDSuggestions = getSuggestions("d");
  assert.equal(lowDSuggestions[0], "द");
  assert.ok(lowDSuggestions.includes("ड"));

  const dabaSuggestions = getSuggestions("daba");
  assert.equal(dabaSuggestions[0], "डबा");

  const thikSuggestions = getSuggestions("thik");
  assert.ok(thikSuggestions.includes("ठीक"));
});

test("Transliterates Marathi corner cases (ratri, vikri, chutney, truck, limbu, etc.) accurately", () => {
  assert.equal(transliterateWord("ratri"), "रात्री");
  assert.equal(transliterateWord("vikri"), "विक्री");
  assert.equal(transliterateWord("kharedi"), "खरेदी");
  assert.equal(transliterateWord("supari"), "सुपारी");
  assert.equal(transliterateWord("chutney"), "चटणी");
  assert.equal(transliterateWord("limbu"), "लिंबू");
  assert.equal(transliterateWord("bhakri"), "भाकरी");
  assert.equal(transliterateWord("poli"), "पोळी");
  assert.equal(transliterateWord("sabudana"), "साबुदाणा");
  assert.equal(transliterateWord("truck"), "ट्रक");
  assert.equal(transliterateWord("tractor"), "ट्रॅक्टर");
  assert.equal(transliterateWord("driver"), "ड्रायव्हर");
  assert.equal(transliterateWord("dada"), "दादा");
  assert.equal(transliterateWord("rassa"), "रस्सा");
  assert.equal(transliterateWord("patta"), "पत्ता");
  assert.equal(transliterateWord("khadda"), "खड्डा");
  assert.equal(transliterateWord("dabi"), "डबी");
});

test("Smart suggestions provide correct dirgha end vowels (मराठी शुद्धलेखन) and conjuncts", () => {
  const mirchiSug = getSuggestions("mirchi");
  assert.ok(mirchiSug.includes("मिरची"));

  const bakiSug = getSuggestions("baki");
  assert.ok(bakiSug.includes("बाकी"));

  const udhariSug = getSuggestions("udhari");
  assert.ok(udhariSug.includes("उधारी"));

  const paniSug = getSuggestions("pani");
  assert.ok(paniSug.includes("पाणी"));

  const ratriSug = getSuggestions("ratri");
  assert.ok(ratriSug.includes("रात्री"));

  const vikriSug = getSuggestions("vikri");
  assert.ok(vikriSug.includes("विक्री"));
});
