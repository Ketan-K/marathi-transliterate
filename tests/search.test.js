import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizePhonetics,
  expandSearchVariants,
  matchMarathi,
  scoreMarathiMatch,
  searchMarathi
} from "../src/index.js";

import searchDirect from "../src/search.js";

test("src/search.js exports all required functions directly and via index.js", () => {
  assert.equal(typeof normalizePhonetics, "function");
  assert.equal(typeof expandSearchVariants, "function");
  assert.equal(typeof matchMarathi, "function");
  assert.equal(typeof scoreMarathiMatch, "function");
  assert.equal(typeof searchMarathi, "function");

  assert.equal(typeof searchDirect.normalizePhonetics, "function");
  assert.equal(typeof searchDirect.expandSearchVariants, "function");
  assert.equal(typeof searchDirect.matchMarathi, "function");
  assert.equal(typeof searchDirect.scoreMarathiMatch, "function");
  assert.equal(typeof searchDirect.searchMarathi, "function");
});

test("normalizePhonetics normalizes ळ ➔ ल, ण ➔ न, श/ष ➔ स, व ➔ ब, vowels, and anuswar", () => {
  // ळ ➔ ल
  assert.equal(normalizePhonetics("चितळे"), normalizePhonetics("चितले"));
  assert.equal(normalizePhonetics("तिळ"), normalizePhonetics("तिल"));

  // ण ➔ न (e.g., दाणे ↔ दाने, साबुदाणा ↔ साबुदाना, धणे ↔ धने)
  assert.equal(normalizePhonetics("दाणे"), normalizePhonetics("दाने"));
  assert.equal(normalizePhonetics("साबुदाणा"), normalizePhonetics("साबुदाना"));
  assert.equal(normalizePhonetics("धणे"), normalizePhonetics("धने"));
  assert.equal(normalizePhonetics("वाटाणा"), normalizePhonetics("वाटाना"));

  // श, ष ➔ स (e.g., शेव ↔ सेव, शाकर ↔ साखर)
  assert.equal(normalizePhonetics("शेव"), normalizePhonetics("सेव"));
  assert.equal(normalizePhonetics("विशेष"), "बिसेस");
  assert.equal(normalizePhonetics("शाकर"), normalizePhonetics("साकर"));

  // व ➔ ब (e.g., वरई ↔ बरई, रवा ↔ रबा)
  assert.equal(normalizePhonetics("वरई"), normalizePhonetics("बरई"));
  assert.equal(normalizePhonetics("रवा"), normalizePhonetics("रबा"));

  // Vowel length normalization: ी ➔ ि, ू ➔ ु (e.g., काजू ↔ काजु, तूप ↔ तुप)
  assert.equal(normalizePhonetics("काजू"), normalizePhonetics("काजु"));
  assert.equal(normalizePhonetics("तूप"), normalizePhonetics("तुप"));

  // Anuswar tolerance: strips/neutralizes anuswars so कांदा matches कंदा, शेंगदाणे matches शेगदाणे
  assert.equal(normalizePhonetics("कांदा"), normalizePhonetics("कंदा"));
  assert.equal(normalizePhonetics("शेंगदाणे"), normalizePhonetics("शेगदाणे"));
});

test("expandSearchVariants expands tokens into candidates and uses memoization cache", () => {
  const kajuVariants = expandSearchVariants("kaju");
  assert.ok(Array.isArray(kajuVariants));
  assert.ok(kajuVariants.includes("kaju"));
  assert.ok(kajuVariants.includes("काजू"));
  assert.ok(kajuVariants.includes("काजु"));

  // Multi-word expansion
  const multiVariants = expandSearchVariants("kaju tukda");
  assert.ok(multiVariants.includes("kaju"));
  assert.ok(multiVariants.includes("tukda"));
  assert.ok(multiVariants.includes("काजू"));
  assert.ok(multiVariants.includes("तुकडा"));

  // Cache hit verification
  const cachedVariants = expandSearchVariants("kaju");
  assert.equal(cachedVariants, kajuVariants);
});

test("Common Grocery transliterations match accurately", () => {
  // 'kaju' matches 'काजू' and 'काजु'
  assert.equal(matchMarathi("काजू", "kaju"), true);
  assert.equal(matchMarathi("काजु", "kaju"), true);

  // 'sabudana' matches 'साबुदाणा' and 'साबुदाना'
  assert.equal(matchMarathi("साबुदाणा", "sabudana"), true);
  assert.equal(matchMarathi("साबुदाना", "sabudana"), true);

  // 'chitale' matches 'चितळे' and 'चितले'
  assert.equal(matchMarathi("चितळे", "chitale"), true);
  assert.equal(matchMarathi("चितले", "chitale"), true);

  // 'dane' and 'daane' both match 'दाणे' and 'दाने'
  assert.equal(matchMarathi("दाणे", "dane"), true);
  assert.equal(matchMarathi("दाने", "dane"), true);
  assert.equal(matchMarathi("दाणे", "daane"), true);
  assert.equal(matchMarathi("दाने", "daane"), true);

  // 'poha' matches 'पोहे' and 'पोहा'
  assert.equal(matchMarathi("पोहे", "poha"), true);
  assert.equal(matchMarathi("पोहा", "poha"), true);

  // 'papad' matches 'पापड'
  assert.equal(matchMarathi("पापड", "papad"), true);
});

test("Deep phonetic variations match accurately", () => {
  // ण vs न: 'वाटाणा' matches query 'vatana' and 'वाटाना'
  assert.equal(matchMarathi("वाटाणा", "vatana"), true);
  assert.equal(matchMarathi("वाटाणा", "वाटाना"), true);
  assert.equal(matchMarathi("वाटाना", "वाटाणा"), true);

  // श vs स: 'शेव' matches query 'sev' and 'सेव'
  assert.equal(matchMarathi("शेव", "sev"), true);
  assert.equal(matchMarathi("शेव", "सेव"), true);
  assert.equal(matchMarathi("सेव", "शेव"), true);

  // Anuswar: 'कांदा' matches 'कंदा'
  assert.equal(matchMarathi("कांदा", "कंदा"), true);
  assert.equal(matchMarathi("कंदा", "कांदा"), true);
});

test("Multi-word queries match accurately with all and any options", () => {
  // 'kaju tukda' matches 'काजू तुकडा'
  assert.equal(matchMarathi("काजू तुकडा", "kaju tukda"), true);

  // 'soya tel' matches 'सोयाबीन तेल' and 'सोयाबीन तेल 15 लिटर'
  assert.equal(matchMarathi("सोयाबीन तेल", "soya tel"), true);
  assert.equal(matchMarathi("सोयाबीन तेल 15 लिटर", "soya tel"), true);

  // multiWord = 'any' matches if any word matches
  assert.equal(
    matchMarathi("सोयाबीन तेल", "bhadang tel", { multiWord: "any" }),
    true
  );
  assert.equal(
    matchMarathi("सोयाबीन तेल", "bhadang tel", { multiWord: "all" }),
    false
  );
});

test("Prefix support works seamlessly for typing live prefixes", () => {
  // Typing "kaj" matches "काजू"
  assert.equal(matchMarathi("काजू", "kaj"), true);

  // Typing "sab" matches "साबुदाणा"
  assert.equal(matchMarathi("साबुदाणा", "sab"), true);

  // Disabling prefix match should not match partial incomplete prefix
  assert.equal(matchMarathi("काजू", "kaj", { prefix: false }), false);
});

test("Ranking & Scoring: Exact prefix yields higher score than loose substring", () => {
  // Exact match (1000)
  assert.equal(scoreMarathiMatch("काजू", "काजू"), 1000);
  assert.equal(scoreMarathiMatch("काजू", "kaju"), 1000);

  // Prefix match (800) vs Substring / non-prefix match
  const prefixScore = scoreMarathiMatch("काजू तुकडा", "kaju");
  const looseSubstringScore = scoreMarathiMatch("मसाला काजू तुकडा", "kaju");

  assert.equal(prefixScore, 800);
  assert.ok(
    prefixScore > looseSubstringScore,
    `Prefix score (${prefixScore}) must be greater than loose substring score (${looseSubstringScore})`
  );

  // Substring match in English
  const englishPrefix = scoreMarathiMatch("Cashew Bits", "cashew");
  const englishSubstring = scoreMarathiMatch("Roasted Cashew Bits", "cashew");
  assert.ok(
    englishPrefix > englishSubstring,
    `English prefix score (${englishPrefix}) must be greater than substring score (${englishSubstring})`
  );

  // Phonetic normalized match (100)
  assert.equal(scoreMarathiMatch("शेव", "सेव"), 100);
  assert.equal(scoreMarathiMatch("रवा", "रबा"), 100);
  assert.equal(scoreMarathiMatch("वरई", "बरई"), 100);
  assert.ok(scoreMarathiMatch("कांदा", "कंदा") >= 100);

  // Non-match (0)
  assert.equal(scoreMarathiMatch("हळद", "sakhar"), 0);
});

test("searchMarathi filters and sorts products by relevance", () => {
  const products = [
    { name: "काजू तुकडा", nameEn: "Cashew Bits" },
    { name: "चितळे दूध", nameEn: "Chitale Milk" },
    { name: "साबुदाणा", nameEn: "Sago" }
  ];

  const results = searchMarathi(products, "chitale", { keys: ["name", "nameEn"] });
  assert.equal(results.length, 1);
  assert.equal(results[0].name, "चितळे दूध");

  // Multi-item ranking test
  const inventory = [
    { name: "शाही काजू करी" },
    { name: "काजू" },
    { name: "काजू तुकडा" },
    { name: "बदाम" }
  ];

  const kajuResults = searchMarathi(inventory, "kaju", { keys: ["name"] });
  assert.equal(kajuResults.length, 3);
  assert.equal(kajuResults[0].name, "काजू"); // Exact top transliteration (1000)
  assert.equal(kajuResults[1].name, "काजू तुकडा"); // Prefix match (800)
  assert.equal(kajuResults[2].name, "शाही काजू करी"); // Substring match (600)

  // Array of strings test
  const stringList = ["साबुदाणा", "काजू", "चितळे"];
  const stringResults = searchMarathi(stringList, "sab");
  assert.equal(stringResults.length, 1);
  assert.equal(stringResults[0], "साबुदाणा");

  // Limit option
  const limitedResults = searchMarathi(inventory, "kaju", { keys: ["name"], limit: 2 });
  assert.equal(limitedResults.length, 2);
});
