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

test('Accurately handles Marathi Anusvara (टिंब) and brand names like Rambandhu', () => {
  assert.equal(transliterateWord('rambandhu'), 'रामबंधू');
  assert.equal(transliterateWord('bandhu'), 'बंधू');
  assert.equal(transliterateWord('sampat'), 'संपत');
  assert.equal(transliterateWord('anand'), 'आनंद');
  assert.equal(transliterateWord('shankar'), 'शंकर');

  const ramSuggs = getSuggestions('rambandhu');
  assert.ok(ramSuggs.includes('रामबंधू'));
  assert.ok(ramSuggs.includes('रामबंधु'));

  const bandhuSuggs = getSuggestions('bandhu');
  assert.ok(bandhuSuggs.includes('बंधू'));
  assert.ok(bandhuSuggs.includes('बंधु'));
});

test('Transliterates comprehensive Maharashtrian Kirana staples, FMCG brands & fasting items', () => {
  // Regional Brands
  assert.equal(transliterateWord('everest'), 'एव्हरेस्ट');
  assert.equal(transliterateWord('badshah'), 'बादशाह');
  assert.equal(transliterateWord('suhana'), 'सुहाना');
  assert.equal(transliterateWord('bedekar'), 'बेडेकर');
  assert.equal(transliterateWord('pravin'), 'प्रवीण');
  assert.equal(transliterateWord('katdare'), 'काटदरे');
  assert.equal(transliterateWord('chitale'), 'चितळे');
  assert.equal(transliterateWord('chitalebandhu'), 'चितळे बंधू');
  assert.equal(transliterateWord('lijjatpapad'), 'लिज्जत पापड');
  assert.equal(transliterateWord('societytea'), 'सोसायटी चहा');
  assert.equal(transliterateWord('waghbakri'), 'वाघ बकरी');

  // Masale & Spices
  assert.equal(transliterateWord('godamasala'), 'गोडा मसाला');
  assert.equal(transliterateWord('kandalasunmasala'), 'कांदा लसूण मसाला');
  assert.equal(transliterateWord('misalmasala'), 'मिसळ मसाला');
  assert.equal(transliterateWord('pavbhajimasala'), 'पाव भाजी मसाला');
  assert.equal(transliterateWord('sambharmasala'), 'सांभार मसाला');
  assert.equal(transliterateWord('hing'), 'हिंग');

  // Fasting (Upvas) Items
  assert.equal(transliterateWord('sabudana'), 'साबुदाणा');
  assert.equal(transliterateWord('bhagar'), 'भगर');
  assert.equal(transliterateWord('rajgira'), 'राजगिरा');
  assert.equal(transliterateWord('batatakees'), 'बटाटा कीस');
  assert.equal(transliterateWord('thalipeeth'), 'थालिपीठ');

  // Staples & Produce
  assert.equal(transliterateWord('toordal'), 'तूर डाळ');
  assert.equal(transliterateWord('moongdal'), 'मूग डाळ');
  assert.equal(transliterateWord('bhendi'), 'भेंडी');
  assert.equal(transliterateWord('kurdai'), 'कुरडई');
  assert.equal(transliterateWord('sandge'), 'सांडगे');
  assert.equal(transliterateWord('kolhapurigul'), 'कोल्हापुरी गूळ');
  assert.equal(transliterateWord('surfexcel'), 'सर्फ एक्सेल');
  assert.equal(transliterateWord('vimbar'), 'विम बार');
});

test("Accurately transliterates English loanwords with Chandra ॉ / ॅ and FMCG staples (polish, coil, rajhans, sunth)", () => {
  // Target bug reports: polish, coil, rajhans, sunth
  assert.equal(transliterateWord("polish"), "पॉलिश");
  assert.ok(getSuggestions("polish").includes("पॉलिश"));
  assert.equal(getSuggestions("polish")[0], "पॉलिश");

  const poSuggestions = getSuggestions("po");
  assert.ok(poSuggestions.includes("पॉ"));
  assert.ok(poSuggestions.includes("पो"));

  assert.equal(transliterateWord("coil"), "कॉईल");
  assert.ok(getSuggestions("coil").includes("कॉईल"));
  assert.equal(getSuggestions("coil")[0], "कॉईल");

  const coSuggestions = getSuggestions("co");
  assert.ok(coSuggestions.includes("कॉ"));
  assert.ok(coSuggestions.includes("को"));

  assert.equal(transliterateWord("rajhans"), "राजहंस");
  assert.equal(getSuggestions("rajhans")[0], "राजहंस");

  assert.equal(transliterateWord("sunth"), "सुंठ");
  assert.equal(getSuggestions("sunth")[0], "सुंठ");

  const sunSuggestions = getSuggestions("sun");
  assert.ok(sunSuggestions.includes("सुं"));
  assert.ok(sunSuggestions.includes("सुंठ"));

  // Chandra ॉ and ॅ loanwords
  assert.equal(transliterateWord("coffee"), "कॉफी");
  assert.equal(transliterateWord("sauce"), "सॉस");
  assert.equal(transliterateWord("stock"), "स्टॉक");
  assert.equal(transliterateWord("doctor"), "डॉक्टर");
  assert.equal(transliterateWord("chocolate"), "चॉकलेट");
  assert.equal(transliterateWord("battery"), "बॅटरी");
  assert.equal(transliterateWord("packet"), "पॅकेट");

  // Diphthongs without leaking English alphabet characters
  assert.equal(transliterateWord("oil"), "ऑईल");
  const oilSug = getSuggestions("oil");
  assert.ok(oilSug.includes("ऑईल"));
  assert.ok(!oilSug[0].includes("i"));
});

test("Accurately transliterates Kranti and Watt across all platforms offline", () => {
  // Kranti (oil brand and Marathi word)
  assert.equal(transliterateWord("kranti"), "क्रांती");
  assert.equal(transliterateWord("Kranti"), "क्रांती");
  assert.equal(transliterateWord("krantioil"), "क्रांती तेल");
  assert.equal(transliterateWord("krantitel"), "क्रांती तेल");
  const krantiSug = getSuggestions("kranti");
  assert.ok(krantiSug.includes("क्रांती"));
  assert.ok(krantiSug.includes("क्रांति"));
  assert.equal(krantiSug[0], "क्रांती");

  // Watt and electrical terms
  assert.equal(transliterateWord("watt"), "वॉट");
  assert.equal(transliterateWord("Watt"), "वॉट");
  assert.equal(transliterateWord("watts"), "वॉट");
  const wattSug = getSuggestions("watt");
  assert.ok(wattSug.includes("वॉट"));
  assert.ok(wattSug.includes("वॅट"));
  assert.ok(wattSug.includes("वाट"));
  assert.equal(wattSug[0], "वॉट");

  // Electrical accessories
  assert.equal(transliterateWord("bulb"), "बल्ब");
  assert.equal(transliterateWord("led"), "एलईडी");
  assert.equal(transliterateWord("switch"), "स्विच");
  assert.equal(transliterateWord("socket"), "सॉकेट");
  assert.equal(transliterateWord("wire"), "वायर");
  assert.equal(transliterateWord("plug"), "प्लग");
  assert.equal(transliterateWord("holder"), "होल्डर");

  // Compound phrase transliteration
  assert.equal(transliterate("9 watt bulb ani kranti oil"), "9 वॉट बल्ब आणि क्रांती ऑईल");
});

test("Accurately transliterates customer honorifics, names, titles and bhai/bhau/bhaiyys", () => {
  // bhaiyys / bhaiyya / bhaiya / bhayya / bhai / bhau
  assert.equal(transliterateWord("bhaiyys"), "भैय्या");
  assert.equal(transliterateWord("bhaiyya"), "भैय्या");
  assert.equal(transliterateWord("bhaiya"), "भैया");
  assert.equal(transliterateWord("bhayya"), "भय्या");
  assert.equal(transliterateWord("bhai"), "भाई");
  assert.equal(transliterateWord("bhau"), "भाऊ");

  const bhaiyysSug = getSuggestions("bhaiyys");
  assert.ok(bhaiyysSug.includes("भैय्या"));
  assert.ok(bhaiyysSug.includes("भैया"));

  const bhaiyyaSug = getSuggestions("bhaiyya");
  assert.ok(bhaiyyaSug.includes("भैय्या"));
  assert.ok(bhaiyyaSug.includes("भैया"));
  assert.ok(bhaiyyaSug.includes("भय्या"));

  // Common customer titles
  assert.equal(transliterateWord("mama"), "मामा");
  assert.equal(transliterateWord("kaka"), "काका");
  assert.equal(transliterateWord("dada"), "दादा");
  assert.equal(transliterateWord("tai"), "ताई");
  assert.equal(transliterateWord("didi"), "दीदी");
  assert.equal(transliterateWord("sheth"), "शेठ");
  assert.equal(transliterateWord("saheb"), "साहेब");
  assert.equal(transliterateWord("anna"), "अण्णा");
  assert.equal(transliterateWord("appa"), "आप्पा");

  // Diphthongs ai and au
  assert.equal(transliterateWord("paisa"), "पैसा");
  assert.equal(transliterateWord("aurat"), "औरत");

  // Multi-word customer naming in transliterate
  assert.equal(transliterate("sachin bhaiyya"), "सचिन भैय्या");
  assert.equal(transliterate("ramesh bhai"), "रमेश भाई");
  assert.equal(transliterate("anil bhau"), "अनिल भाऊ");
});
