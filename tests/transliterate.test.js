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

test("Accurately transliterates compound honorifics (-saheb, -rao, -sheth), fast-typing slips and family kinship", () => {
  // Fast typing & plural slips
  assert.equal(transliterateWord("bhais"), "भाई");
  assert.equal(transliterateWord("bhaus"), "भाऊ");
  assert.equal(transliterateWord("bhaiyyas"), "भैय्या");
  assert.equal(transliterateWord("kakas"), "काका");
  assert.equal(transliterateWord("mamas"), "मामा");
  assert.equal(transliterateWord("dadas"), "दादा");
  assert.equal(transliterateWord("patils"), "पाटील");

  // Compound -saheb names
  assert.equal(transliterateWord("bhausaheb"), "भाऊसाहेब");
  assert.equal(transliterateWord("dadasaheb"), "दादासाहेब");
  assert.equal(transliterateWord("kakasaheb"), "काकासाहेब");
  assert.equal(transliterateWord("mamasaheb"), "मामासाहेब");
  assert.equal(transliterateWord("nanasaheb"), "नानासाहेब");
  assert.equal(transliterateWord("appasaheb"), "आप्पासाहेब");
  assert.equal(transliterateWord("annasaheb"), "अण्णासाहेब");
  assert.equal(transliterateWord("babasaheb"), "बाबासाहेब");

  // Compound -rao names
  assert.equal(transliterateWord("baburao"), "बाबूराव");
  assert.equal(transliterateWord("anandrao"), "आनंदराव");
  assert.equal(transliterateWord("shankarrao"), "शंकरराव");
  assert.equal(transliterateWord("patilrao"), "पाटीलराव");

  // Suffixes and Kinship
  assert.equal(transliterateWord("shethji"), "शेठजी");
  assert.equal(transliterateWord("mavshi"), "मावशी");
  assert.equal(transliterateWord("maushi"), "मावशी");
  assert.equal(transliterateWord("vahini"), "वहिनी");
  assert.equal(transliterateWord("bhavji"), "भावजी");
  assert.equal(transliterateWord("aaji"), "आजी");
  assert.equal(transliterateWord("ajoba"), "आजोबा");

  // Dairy & Grocery staples
  assert.equal(transliterateWord("doodh"), "दूध");
  assert.equal(transliterateWord("toop"), "तूप");
  assert.equal(transliterateWord("taak"), "ताक");
});

test("Accurately transliterates shanti and all similar/related cases (kana+anusvara & dirgha -ti words)", () => {
  // Shanti & Shant Family
  assert.equal(transliterateWord("shanti"), "शांती");
  assert.equal(transliterateWord("shaanti"), "शांती");
  assert.equal(transliterateWord("shantee"), "शांती");
  assert.equal(transliterateWord("shanta"), "शांता");
  assert.equal(transliterateWord("shantata"), "शांतता");
  assert.equal(transliterateWord("shantanu"), "शांतनु");
  assert.equal(transliterateWord("shantiniketan"), "शांतीनिकेतन");
  assert.equal(transliterateWord("sushant"), "सुशांत");
  assert.equal(transliterateWord("nishant"), "निशांत");

  // Similar Kana + Anusvara (ां) words
  assert.equal(transliterateWord("kanti"), "कांती");
  assert.equal(transliterateWord("bhranti"), "भ्रांती");
  assert.equal(transliterateWord("chandi"), "चांदी");
  assert.equal(transliterateWord("gandhi"), "गांधी");
  assert.equal(transliterateWord("bhande"), "भांडे");
  assert.equal(transliterateWord("bhandi"), "भांडी");
  assert.equal(transliterateWord("tanda"), "तांडा");
  assert.equal(transliterateWord("sandhi"), "संधी");
  assert.equal(transliterateWord("sandhya"), "संध्या");
  assert.equal(transliterateWord("jayanti"), "जयंती");
  assert.equal(transliterateWord("damayanti"), "दमयंती");
  assert.equal(transliterateWord("vasanti"), "वसंती");
  assert.equal(transliterateWord("dhanwantari"), "धन्वंतरी");

  // Similar Marathi Shuddhalekhan Dirgha End-Vowels (-ti)
  assert.equal(transliterateWord("shakti"), "शक्ती");
  assert.equal(transliterateWord("bhakti"), "भक्ती");
  assert.equal(transliterateWord("mukti"), "मुक्ती");
  assert.equal(transliterateWord("yukti"), "युक्ती");
  assert.equal(transliterateWord("vyakti"), "व्यक्ती");
  assert.equal(transliterateWord("priti"), "प्रीती");
  assert.equal(transliterateWord("kirti"), "कीर्ती");
  assert.equal(transliterateWord("niti"), "नीती");
  assert.equal(transliterateWord("smruti"), "स्मृती");
  assert.equal(transliterateWord("jyoti"), "ज्योती");
  assert.equal(transliterateWord("aarti"), "आरती");
  assert.equal(transliterateWord("murti"), "मूर्ती");
  assert.equal(transliterateWord("sampatti"), "संपत्ती");
  assert.equal(transliterateWord("srushti"), "सृष्टी");
  assert.equal(transliterateWord("drishti"), "दृष्टी");

  // Smart suggestions check
  const shantiSuggs = getSuggestions("shanti");
  assert.ok(shantiSuggs.includes("शांती"));

  const chandiSuggs = getSuggestions("chandi");
  assert.ok(chandiSuggs.includes("चांदी"));

  const shaktiSuggs = getSuggestions("shakti");
  assert.ok(shaktiSuggs.includes("शक्ती"));
});

test("Accurately transliterates Khandeshi, Ahirani, regional dialects, traditional foods and business terms", () => {
  // 1. Khandesh & Ahirani
  assert.equal(transliterateWord("khandeshi"), "खान्देशी");
  assert.equal(transliterateWord("khandeshimasala"), "खान्देशी मसाला");
  assert.equal(transliterateWord("khandeshikalamasala"), "खान्देशी काळा मसाला");
  assert.equal(transliterateWord("khandeshishevbhaji"), "खान्देशी शेवभाजी");
  assert.equal(transliterateWord("khaandeshi"), "खान्देशी");
  assert.equal(transliterateWord("khandesh"), "खान्देश");
  assert.equal(transliterateWord("khaandesh"), "खान्देश");
  assert.equal(transliterateWord("khandeshkar"), "खान्देशकर");
  assert.equal(transliterateWord("khandoba"), "खंडोबा");
  assert.equal(transliterateWord("khandvi"), "खांडवी");
  assert.equal(transliterateWord("ahirani"), "अहिराणी");
  assert.equal(transliterateWord("aahirani"), "अहिराणी");
  assert.equal(transliterateWord("ahir"), "अहिर");

  // Khandesh Suggestions test
  const khandeshiSuggs = getSuggestions("khandeshi");
  assert.equal(khandeshiSuggs[0], "खान्देशी");
  assert.ok(khandeshiSuggs.includes("खानदेशी"));
  assert.ok(khandeshiSuggs.includes("खांदेशी"));

  const khandeshSuggs = getSuggestions("khandesh");
  assert.equal(khandeshSuggs[0], "खान्देश");
  assert.ok(khandeshSuggs.includes("खानदेश"));
  assert.ok(khandeshSuggs.includes("खांदेश"));

  // 2. Other Regions & Dialects (Varhad, Kokan, Malvan, Marathwada, Vidarbha, Mandesh)
  assert.equal(transliterateWord("varhad"), "वऱ्हाड");
  assert.equal(transliterateWord("warhad"), "वऱ्हाड");
  assert.equal(transliterateWord("varhadi"), "वऱ्हाडी");
  assert.equal(transliterateWord("warhadi"), "वऱ्हाडी");
  assert.equal(transliterateWord("kokan"), "कोकण");
  assert.equal(transliterateWord("konkan"), "कोकण");
  assert.equal(transliterateWord("kokani"), "कोकणी");
  assert.equal(transliterateWord("konkani"), "कोकणी");
  assert.equal(transliterateWord("koknastha"), "कोकणस्थ");
  assert.equal(transliterateWord("malvan"), "मालवण");
  assert.equal(transliterateWord("malvani"), "मालवणी");
  assert.equal(transliterateWord("marathwada"), "मराठवाडा");
  assert.equal(transliterateWord("marathwadi"), "मराठवाडी");
  assert.equal(transliterateWord("vidarbha"), "विदर्भ");
  assert.equal(transliterateWord("vidarbhi"), "विदर्भी");
  assert.equal(transliterateWord("vidarbhiya"), "विदर्भीय");
  assert.equal(transliterateWord("mandesh"), "मान्देश");
  assert.equal(transliterateWord("mandeshi"), "मान्देशी");
  assert.equal(transliterateWord("marhati"), "मऱ्हाटी");
  assert.equal(transliterateWord("marhatta"), "मऱ्हाटा");

  // 3. Languages & Communities
  assert.equal(transliterateWord("kannada"), "कन्नड");
  assert.equal(transliterateWord("kanadi"), "कानडी");
  assert.equal(transliterateWord("marwadi"), "मारवाडी");
  assert.equal(transliterateWord("sindhi"), "सिंधी");
  assert.equal(transliterateWord("gujarati"), "गुजराती");
  assert.equal(transliterateWord("rajasthani"), "राजस्थानी");
  assert.equal(transliterateWord("bengali"), "बंगाली");
  assert.equal(transliterateWord("punjabi"), "पंजाबी");
  assert.equal(transliterateWord("deshastha"), "देशस्थ");

  const sindhiSuggs = getSuggestions("sindhi");
  assert.ok(sindhiSuggs.includes("सिंधी"));
  assert.ok(sindhiSuggs.includes("सिन्धी"));

  // 4. Kirana & Business Terms
  assert.equal(transliterateWord("bhandar"), "भांडार");
  assert.equal(transliterateWord("vastubhandar"), "वस्तुभांडार");
  assert.equal(transliterateWord("kiranabhandar"), "किराणा भांडार");
  assert.equal(transliterateWord("vyapari"), "व्यापारी");
  assert.equal(transliterateWord("kharedidar"), "खरेदीदार");
  assert.equal(transliterateWord("karagir"), "कारागीर");
  assert.equal(transliterateWord("kamgar"), "कामगार");

  // 5. Khandeshi & Traditional Maharashtrian Foods
  assert.equal(transliterateWord("kalna"), "कळणा");
  assert.equal(transliterateWord("kalnache"), "कळण्याचे");
  assert.equal(transliterateWord("thecha"), "ठेचा");
  assert.equal(transliterateWord("shevbhaji"), "शेवभाजी");
  assert.equal(transliterateWord("bharit"), "भरीत");
  assert.equal(transliterateWord("vangyachebharit"), "वांग्याचे भरीत");
  assert.equal(transliterateWord("puranpoli"), "पुरणपोळी");
  assert.equal(transliterateWord("pithla"), "पिठलं");
  assert.equal(transliterateWord("pithle"), "पिठले");
  assert.equal(transliterateWord("solkadhi"), "सोलकढी");
  assert.equal(transliterateWord("ukadpendi"), "उकडपेंडी");
  assert.equal(transliterateWord("chakli"), "चकली");
  assert.equal(transliterateWord("shankarpali"), "शंकरपाळी");
  assert.equal(transliterateWord("anarse"), "अनारसे");
  assert.equal(transliterateWord("vadapav"), "वडापाव");
  assert.equal(transliterateWord("misalpav"), "मिसळपाव");
  assert.equal(transliterateWord("basundi"), "बासुंदी");
  assert.equal(transliterateWord("pedhe"), "पेढे");
  assert.equal(transliterateWord("modak"), "मोदक");

  // 6. Full sentence test
  const sentence = "khandeshi shevbhaji ani kalnache pith khup bhari ahe";
  assert.equal(transliterate(sentence), "खान्देशी शेवभाजी आणि कळण्याचे पीठ खूप भारी आहे");
});



test("Accurately transliterates Comfort Liquid, fabric conditioners and detergent loanwords", () => {
  assert.equal(transliterateWord("comfort"), "कम्फर्ट");
  assert.equal(transliterateWord("comfortliquid"), "कम्फर्ट लिक्विड");
  assert.equal(transliterate("comfort liquid"), "कम्फर्ट लिक्विड");
  assert.equal(transliterateWord("kamfart"), "कम्फर्ट");
  assert.equal(transliterateWord("kamfartliquid"), "कम्फर्ट लिक्विड");
  assert.equal(transliterateWord("liquid"), "लिक्विड");
  assert.equal(transliterateWord("liquids"), "लिक्विड");
  assert.equal(transliterateWord("fabricconditioner"), "फॅब्रिक कंडिशनर");
  assert.equal(transliterateWord("conditioner"), "कंडिशनर");

  // Phonetic combinations with qu / q
  assert.equal(transliterateWord("quick"), "क्विक");
  assert.equal(transliterateWord("queen"), "क्वीन");

  // Smart suggestions
  const comfortSuggs = getSuggestions("comfort");
  assert.equal(comfortSuggs[0], "कम्फर्ट");
  assert.ok(comfortSuggs.includes("कंफर्ट"));
  assert.ok(comfortSuggs.includes("कॉम्फर्ट"));

  const liquidSuggs = getSuggestions("liquid");
  assert.equal(liquidSuggs[0], "लिक्विड");
  assert.ok(liquidSuggs.includes("लिक्वीड"));

  const comfortLiquidSuggs = getSuggestions("comfortliquid");
  assert.equal(comfortLiquidSuggs[0], "कम्फर्ट लिक्विड");
  assert.ok(comfortLiquidSuggs.includes("कंफर्ट लिक्विड"));
});

test("Accurately transliterates compound Marathi customer names (Gorakshanath, Bansi, Bansilal, Somnath, Ramdas, etc.) without breaking them up", () => {
  // 0. Nivrutt, Jagannath & geminates
  assert.equal(transliterateWord("nivrutt"), "निवृत्त");
  assert.equal(transliterateWord("nivrutta"), "निवृत्त");
  assert.equal(transliterateWord("nivrutti"), "निवृत्ती");
  assert.equal(transliterateWord("nivritti"), "निवृत्ती");
  assert.equal(transliterateWord("nivruttinath"), "निवृत्तीनाथ");
  assert.equal(transliterateWord("nivruttirao"), "निवृत्तीराव");
  assert.equal(transliterateWord("amrut"), "अमृत");
  assert.equal(transliterateWord("krupa"), "कृपा");
  assert.equal(transliterateWord("krushna"), "कृष्ण");
  assert.equal(transliterateWord("guru"), "गुरू");

  const nivruttSuggs = getSuggestions("nivrutt");
  assert.equal(nivruttSuggs[0], "निवृत्त");
  assert.ok(nivruttSuggs.includes("निवृत्ती"));

  const nivruttiSuggs = getSuggestions("nivrutti");
  assert.equal(nivruttiSuggs[0], "निवृत्ती");
  assert.ok(nivruttiSuggs.includes("निवृत्ति"));

  // 0b. Jagannath & geminates
  assert.equal(transliterateWord("jagannath"), "जगन्नाथ");
  assert.equal(transliterateWord("jaganath"), "जगन्नाथ");
  assert.equal(transliterateWord("jagganath"), "जगन्नाथ");
  assert.equal(transliterateWord("jagannatha"), "जगन्नाथ");
  assert.equal(transliterateWord("jagannathrao"), "जगन्नाथराव");
  assert.equal(transliterateWord("jagannathji"), "जगन्नाथजी");
  assert.equal(transliterateWord("panna"), "पन्ना");
  assert.equal(transliterateWord("mannat"), "मन्नत");
  // 1. Gorakshanath & variants
  assert.equal(transliterateWord("gorakshanath"), "गोरक्षनाथ");
  assert.equal(transliterateWord("gorakhnath"), "गोरखनाथ");
  assert.equal(transliterateWord("goraksha"), "गोरक्ष");
  assert.equal(transliterateWord("goraksh"), "गोरक्ष");

  // 2. Bansi & variants
  assert.equal(transliterateWord("bansi"), "बन्सी");
  assert.equal(transliterateWord("bansee"), "बन्सी");
  assert.equal(transliterateWord("bansilal"), "बन्सीलाल");
  assert.equal(transliterateWord("bansidhar"), "बन्सीधर");
  assert.equal(transliterateWord("bansiram"), "बन्सीराम");

  // 3. Compound Name Suffixes (-nath, -lal, -das, -prasad, -kant, -kumar)
  assert.equal(transliterateWord("somnath"), "सोमनाथ");
  assert.equal(transliterateWord("kashinath"), "काशीनाथ");
  assert.equal(transliterateWord("vishwanath"), "विश्वनाथ");
  assert.equal(transliterateWord("ramnath"), "रामनाथ");
  assert.equal(transliterateWord("navnath"), "नवनाथ");
  assert.equal(transliterateWord("shantilal"), "शांतीलाल");
  assert.equal(transliterateWord("mohanlal"), "मोहनलाल");
  assert.equal(transliterateWord("ramdas"), "रामदास");
  assert.equal(transliterateWord("haridas"), "हरीदास");
  assert.equal(transliterateWord("devidas"), "देवीदास");
  assert.equal(transliterateWord("ramprasad"), "रामप्रसाद");
  assert.equal(transliterateWord("chandrakant"), "चंद्रकांत");
  assert.equal(transliterateWord("rajkumar"), "राजकुमार");

  // 4. Suggestions
  const bansiSuggs = getSuggestions("bansi");
  assert.equal(bansiSuggs[0], "बन्सी");
  assert.ok(bansiSuggs.includes("बंसी"));

  const gorakshaSuggs = getSuggestions("gorakshanath");
  assert.equal(gorakshaSuggs[0], "गोरक्षनाथ");
  assert.ok(gorakshaSuggs.includes("गोरखनाथ"));

  const jagannathSuggs = getSuggestions("jagannath");
  assert.equal(jagannathSuggs[0], "जगन्नाथ");
  assert.ok(jagannathSuggs.includes("जगंनाथ"));

  // 5. Balkrishna & Ramkrishna and variants
  assert.equal(transliterateWord("balkrishna"), "बाळकृष्ण");
  assert.equal(transliterateWord("baalkrishna"), "बाळकृष्ण");
  assert.equal(transliterateWord("balakrishna"), "बाळकृष्ण");
  assert.equal(transliterateWord("balkrushna"), "बाळकृष्ण");
  assert.equal(transliterateWord("baalkrushna"), "बाळकृष्ण");
  assert.equal(transliterateWord("balakrushna"), "बाळकृष्ण");
  assert.equal(transliterateWord("balkrishnarao"), "बाळकृष्णराव");
  assert.equal(transliterateWord("balkrishnaji"), "बाळकृष्णजी");

  assert.equal(transliterateWord("ramkrishna"), "रामकृष्ण");
  assert.equal(transliterateWord("raamkrishna"), "रामकृष्ण");
  assert.equal(transliterateWord("ramakrishna"), "रामकृष्ण");
  assert.equal(transliterateWord("ramkrushna"), "रामकृष्ण");
  assert.equal(transliterateWord("raamkrushna"), "रामकृष्ण");
  assert.equal(transliterateWord("ramakrushna"), "रामकृष्ण");
  assert.equal(transliterateWord("ramkrishnarao"), "रामकृष्णराव");
  assert.equal(transliterateWord("ramkrishnaji"), "रामकृष्णजी");

  assert.equal(transliterateWord("gopalkrishna"), "गोपाळकृष्ण");
  assert.equal(transliterateWord("radhakrishna"), "राधाकृष्ण");
  assert.equal(transliterateWord("harikrishna"), "हरीकृष्ण");
  assert.equal(transliterateWord("shrikrishna"), "श्रीकृष्ण");

  const balkrishnaSuggs = getSuggestions("balkrishna");
  assert.equal(balkrishnaSuggs[0], "बाळकृष्ण");
  assert.ok(balkrishnaSuggs.includes("बालकृष्ण"));

  const balkrushnaSuggs = getSuggestions("balkrushna");
  assert.equal(balkrushnaSuggs[0], "बाळकृष्ण");
  assert.ok(balkrushnaSuggs.includes("बालकृष्ण"));

  const ramkrishnaSuggs = getSuggestions("ramkrishna");
  assert.equal(ramkrishnaSuggs[0], "रामकृष्ण");

  const ramkrushnaSuggs = getSuggestions("ramkrushna");
  assert.equal(ramkrushnaSuggs[0], "रामकृष्ण");
});

test("Accurately transliterates FMCG laundry care, cleaning liquids, detergents and air fresheners", () => {
  // Genteel, Ezee, Ujala & Vanish
  assert.equal(transliterateWord("genteel"), "जेंटील");
  assert.equal(transliterateWord("genteelliquid"), "जेंटील लिक्विड");
  assert.equal(transliterateWord("ezee"), "इझी");
  assert.equal(transliterateWord("ezeeliquid"), "इझी लिक्विड");
  assert.equal(transliterateWord("godrejezee"), "गोदरेज इझी");
  assert.equal(transliterateWord("ujala"), "उजाला");
  assert.equal(transliterateWord("ujalaliquid"), "उजाला लिक्विड");
  assert.equal(transliterateWord("ujalasupreme"), "उजाला सुप्रीम");
  assert.equal(transliterateWord("vanish"), "व्हॅनिश");
  assert.equal(transliterateWord("vanishliquid"), "व्हॅनिश लिक्विड");

  // Laundry liquids & Detergents
  assert.equal(transliterateWord("rinliquid"), "रिन लिक्विड");
  assert.equal(transliterateWord("ghadiliquid"), "घडी लिक्विड");
  assert.equal(transliterateWord("wheelliquid"), "व्हील लिक्विड");
  assert.equal(transliterateWord("prilliquid"), "प्रिल लिक्विड");
  assert.equal(transliterateWord("exoliquid"), "एक्सो लिक्विड");
  assert.equal(transliterateWord("exodishwash"), "एक्सो डिशवॉश");
  assert.equal(transliterateWord("vimgel"), "विम जेल");
  assert.equal(transliterateWord("detergent"), "डिटर्जंट");
  assert.equal(transliterateWord("detergentliquid"), "डिटर्जंट लिक्विड");
  assert.equal(transliterateWord("maticliquid"), "मॅटिक लिक्विड");
  assert.equal(transliterateWord("frontload"), "फ्रंट लोड");
  assert.equal(transliterateWord("topload"), "टॉप लोड");

  // Household & Antiseptic Cleaning
  assert.equal(transliterateWord("phenyl"), "फिनाईल");
  assert.equal(transliterateWord("phenyle"), "फिनाईल");
  assert.equal(transliterateWord("finail"), "फिनाईल");
  assert.equal(transliterateWord("finyle"), "फिनाईल");
  assert.equal(transliterateWord("phenylliquid"), "फिनाईल लिक्विड");
  assert.equal(transliterateWord("whitephenyl"), "व्हाईट फिनाईल");
  assert.equal(transliterateWord("blackphenyl"), "ब्लॅक फिनाईल");
  assert.equal(transliterateWord("pitambari"), "पितांबरी");
  assert.equal(transliterateWord("pitambariliquid"), "पितांबरी लिक्विड");
  assert.equal(transliterateWord("bleach"), "ब्लीच");
  assert.equal(transliterateWord("bleachingliquid"), "ब्लीचिंग लिक्विड");
  assert.equal(transliterateWord("fabricsoftener"), "फॅब्रिक सॉफ्टनर");
  assert.equal(transliterateWord("floorcleaner"), "फ्लोअर क्लिनर");
  assert.equal(transliterateWord("toiletcleaner"), "टॉयलेट क्लिनर");
  assert.equal(transliterateWord("savlonliquid"), "सॅव्हलॉन लिक्विड");
  assert.equal(transliterateWord("savlonantiseptic"), "सॅव्हलॉन अँटीसेप्टिक");
  assert.equal(transliterateWord("roomfreshener"), "रूम फ्रेशनर");
  assert.equal(transliterateWord("odonil"), "ओडोनिल");
  assert.equal(transliterateWord("dambargolya"), "डांबरगोळ्या");

  // Suggestions
  const phenylSuggs = getSuggestions("phenyl");
  assert.equal(phenylSuggs[0], "फिनाईल");
  assert.ok(phenylSuggs.includes("फिनाइल"));

  const genteelSuggs = getSuggestions("genteel");
  assert.equal(genteelSuggs[0], "जेंटील");

  const ezeeSuggs = getSuggestions("ezee");
  assert.equal(ezeeSuggs[0], "इझी");
});

test("Accurately transliterates extended Maharashtrian regional foods, masalas, condiments and snacks", () => {
  // Khandeshi, Varhadi & Ahirani foods
  assert.equal(transliterateWord("bibade"), "बिबडे");
  assert.equal(transliterateWord("bibda"), "बिबडा");
  assert.equal(transliterateWord("dangar"), "डांगर");
  assert.equal(transliterateWord("rodaga"), "रोडगा");
  assert.equal(transliterateWord("rodage"), "रोडगे");
  assert.equal(transliterateWord("mande"), "मांदे");
  assert.equal(transliterateWord("khaparchipuranpoli"), "खापरची पुरणपोळी");
  assert.equal(transliterateWord("patwadi"), "पाटवडी");
  assert.equal(transliterateWord("patwadirassa"), "पाटवडी रस्सा");
  assert.equal(transliterateWord("patwadibhaji"), "पाटवडी भाजी");
  assert.equal(transliterateWord("valachebirde"), "वालाचे बिरडे");
  assert.equal(transliterateWord("zunka"), "झुणका");
  assert.equal(transliterateWord("zhunka"), "झुणका");
  assert.equal(transliterateWord("jhunka"), "झुणका");
  assert.equal(transliterateWord("zunkabhakar"), "झुणका भाकर");
  assert.equal(transliterateWord("khandeshibhakari"), "खान्देशी भाकरी");
  assert.equal(transliterateWord("khandeshikalnapith"), "खान्देशी कळणा पीठ");
  assert.equal(transliterateWord("varhadikalamasala"), "वऱ्हाडी काळा मसाला");

  // Kolhapuri specialties
  assert.equal(transliterateWord("kolhapuri"), "कोल्हापुरी");
  assert.equal(transliterateWord("kolhapurimasala"), "कोल्हापुरी मसाला");
  assert.equal(transliterateWord("kolhapurikandamasala"), "कोल्हापुरी कांदा मसाला");
  assert.equal(transliterateWord("kolhapurithecha"), "कोल्हापुरी ठेचा");
  assert.equal(transliterateWord("kolhapurirassa"), "कोल्हापुरी रस्सा");
  assert.equal(transliterateWord("tambadarassa"), "तांबडा रस्सा");
  assert.equal(transliterateWord("pandhararassa"), "पांढरा रस्सा");
  assert.equal(transliterateWord("misalfarsan"), "मिसळ फरसाण");

  // Malvani & Puneri & Saoji
  assert.equal(transliterateWord("malvani"), "मालवणी");
  assert.equal(transliterateWord("malvanimasala"), "मालवणी मसाला");
  assert.equal(transliterateWord("malvanivade"), "मालवणी वडे");
  assert.equal(transliterateWord("malvanicurry"), "मालवणी करी");
  assert.equal(transliterateWord("kokamsarbat"), "कोकम सरबत");
  assert.equal(transliterateWord("ghavane"), "घावणे");
  assert.equal(transliterateWord("amboli"), "आंबोळी");
  assert.equal(transliterateWord("punerimisal"), "पुणेरी मिसळ");
  assert.equal(transliterateWord("saoji"), "सावजी");
  assert.equal(transliterateWord("saojimasala"), "सावजी मसाला");
  assert.equal(transliterateWord("nagpurisaoji"), "नागपुरी सावजी");
  assert.equal(transliterateWord("tarripoha"), "तर्री पोहे");

  // Maharashtrian kitchen staples & snacks
  assert.equal(transliterateWord("kothimbirvadi"), "कोथिंबीर वडी");
  assert.equal(transliterateWord("aluvadi"), "अळूवडी");
  assert.equal(transliterateWord("kurdaya"), "कुरडया");
  assert.equal(transliterateWord("hirvathecha"), "हिरवा ठेचा");
  assert.equal(transliterateWord("shengdanachutney"), "शेंगदाणा चटणी");
  assert.equal(transliterateWord("lasunchutney"), "लसूण चटणी");

  // Suggestions
  const bibadeSuggs = getSuggestions("bibade");
  assert.equal(bibadeSuggs[0], "बिबडे");
  assert.ok(bibadeSuggs.includes("बिबडा"));

  const rodageSuggs = getSuggestions("rodage");
  assert.equal(rodageSuggs[0], "रोडगे");

  const zunkaSuggs = getSuggestions("zunka");
  assert.equal(zunkaSuggs[0], "झुणका");
});

test("Accurately transliterates extended Indian/Marathi customer names, suffixes (-nath, -lal, -das, -prasad, -chand, -kant, -kumar, -singh, -rao, -sheth) and sacred names", () => {
  // -nath
  assert.equal(transliterateWord("adinath"), "आदिनाथ");
  assert.equal(transliterateWord("kanifnath"), "कनिफनाथ");
  assert.equal(transliterateWord("eknath"), "एकनाथ");
  assert.equal(transliterateWord("raghunath"), "रघुनाथ");
  assert.equal(transliterateWord("sainath"), "साईनाथ");

  // -lal
  assert.equal(transliterateWord("jethalal"), "जेठालाल");
  assert.equal(transliterateWord("maganlal"), "मगनलाल");
  assert.equal(transliterateWord("chhaganlal"), "छगनलाल");
  assert.equal(transliterateWord("girdharlal"), "गिरधरलाल");
  assert.equal(transliterateWord("champalal"), "चंपालाल");
  assert.equal(transliterateWord("kanhaiyalal"), "कन्हैयालाल");

  // -das
  assert.equal(transliterateWord("tulsidas"), "तुलसीदास");
  assert.equal(transliterateWord("surdas"), "सूरदास");
  assert.equal(transliterateWord("krishnadas"), "कृष्णदास");
  assert.equal(transliterateWord("ishwardas"), "ईश्वरदास");
  assert.equal(transliterateWord("damodardas"), "दामोदरदास");
  assert.equal(transliterateWord("shivdas"), "शिवदास");

  // -prasad
  assert.equal(transliterateWord("jagannathprasad"), "जगन्नाथप्रसाद");
  assert.equal(transliterateWord("krishnaprasad"), "कृष्णप्रसाद");
  assert.equal(transliterateWord("bhagwatiprasad"), "भगवतीप्रसाद");
  assert.equal(transliterateWord("mahavirprasad"), "महावीरप्रसाद");

  // -chand
  assert.equal(transliterateWord("hukamchand"), "हुकमचंद");
  assert.equal(transliterateWord("prakashchand"), "प्रकाशचंद");
  assert.equal(transliterateWord("uttamchand"), "उत्तमचंद");
  assert.equal(transliterateWord("premchand"), "प्रेमचंद");
  assert.equal(transliterateWord("karamchand"), "करमचंद");
  assert.equal(transliterateWord("lalchand"), "लालचंद");

  // -kant
  assert.equal(transliterateWord("shrikant"), "श्रीकांत");
  assert.equal(transliterateWord("ramakant"), "रमाकांत");
  assert.equal(transliterateWord("rajanikant"), "रजनीकांत");
  assert.equal(transliterateWord("nishikant"), "निशिकांत");
  assert.equal(transliterateWord("prashant"), "प्रशांत");

  // -kumar
  assert.equal(transliterateWord("dilipkumar"), "दिलीपकुमार");
  assert.equal(transliterateWord("ashokkumar"), "अशोककुमार");
  assert.equal(transliterateWord("pravinkumar"), "प्रवीणकुमार");
  assert.equal(transliterateWord("manojkumar"), "मनोजकुमार");
  assert.equal(transliterateWord("sanjaykumar"), "संजयकुमार");

  // -singh & -sing
  assert.equal(transliterateWord("mansingh"), "मानसिंह");
  assert.equal(transliterateWord("jaswantsingh"), "जसवंतसिंह");
  assert.equal(transliterateWord("pratapsingh"), "प्रतापसिंह");
  assert.equal(transliterateWord("balwantsingh"), "बलवंतसिंह");

  // -rao
  assert.equal(transliterateWord("baburao"), "बाबूराव");
  assert.equal(transliterateWord("yashwantrao"), "यशवंतराव");
  assert.equal(transliterateWord("madhavrao"), "माधवराव");
  assert.equal(transliterateWord("govindrao"), "गोविंदराव");
  assert.equal(transliterateWord("keshavrao"), "केशवराव");
  assert.equal(transliterateWord("tukaramrao"), "तुकारामराव");

  // -sheth
  assert.equal(transliterateWord("bansisheth"), "बन्सीशेठ");
  assert.equal(transliterateWord("somnathsheth"), "सोमनाथशेठ");
  assert.equal(transliterateWord("ramdassheth"), "रामदासशेठ");
  assert.equal(transliterateWord("mohanlalsheth"), "मोहनलालशेठ");
  assert.equal(transliterateWord("baburaosheth"), "बाबूरावशेठ");

  // Sacred & Ri-vowel words
  assert.equal(transliterateWord("rushikesh"), "ऋषिकेश");
  assert.equal(transliterateWord("rishikesh"), "ऋषिकेश");
  assert.equal(transliterateWord("rushi"), "ऋषी");
  assert.equal(transliterateWord("rushabh"), "ऋषभ");
  assert.equal(transliterateWord("rutu"), "ऋतू");
  assert.equal(transliterateWord("rutuja"), "ऋतुजा");
  assert.equal(transliterateWord("shruti"), "श्रुती");
  assert.equal(transliterateWord("kruti"), "कृती");
  assert.equal(transliterateWord("sanskruti"), "संस्कृती");
  assert.equal(transliterateWord("prakruti"), "प्रकृती");
  assert.equal(transliterateWord("vaikunth"), "वैकुंठ");
  assert.equal(transliterateWord("tryambakeshwar"), "त्र्यंबकेश्वर");
  assert.equal(transliterateWord("dnyaneshwar"), "ज्ञानेश्वर");
  assert.equal(transliterateWord("swamisamarth"), "स्वामी समर्थ");

  // Suggestions
  const rushikeshSuggs = getSuggestions("rushikesh");
  assert.equal(rushikeshSuggs[0], "ऋषिकेश");

  const shrutiSuggs = getSuggestions("shruti");
  assert.equal(shrutiSuggs[0], "श्रुती");
  assert.ok(shrutiSuggs.includes("श्रुति"));

  const sanskrutiSuggs = getSuggestions("sanskruti");
  assert.equal(sanskrutiSuggs[0], "संस्कृती");
});

