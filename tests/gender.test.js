import test from "node:test";
import assert from "node:assert/strict";
import {
  GENDERS,
  GENDER_KEYS,
  PRONOUNS,
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
  extendGenderDictionary
} from "../src/index.js";

test("Accurately identifies gender for Marathi grocery and kirana items", () => {
  // पुल्लिंग (तो)
  assert.equal(getGender("तांदूळ").gender, GENDERS.PULLINGA);
  assert.equal(getGender("कांदा").gender, GENDERS.PULLINGA);
  assert.equal(getGender("बटाटा").gender, GENDERS.PULLINGA);
  assert.equal(getGender("गूळ").gender, GENDERS.PULLINGA);
  assert.equal(getGender("चहा").gender, GENDERS.PULLINGA);
  assert.equal(getGender("मसाला").gender, GENDERS.PULLINGA);
  assert.equal(getGender("लसूण").gender, GENDERS.PULLINGA);

  // स्त्रीलिंग (ती)
  assert.equal(getGender("साखर").gender, GENDERS.STREELINGA);
  assert.equal(getGender("हळद").gender, GENDERS.STREELINGA);
  assert.equal(getGender("डाळ").gender, GENDERS.STREELINGA);
  assert.equal(getGender("तूरडाळ").gender, GENDERS.STREELINGA);
  assert.equal(getGender("मिरची").gender, GENDERS.STREELINGA);
  assert.equal(getGender("कोथिंबीर").gender, GENDERS.STREELINGA);
  assert.equal(getGender("भाजी").gender, GENDERS.STREELINGA);
  assert.equal(getGender("बाटली").gender, GENDERS.STREELINGA);

  // नपुंसकलिंग (ते)
  assert.equal(getGender("तेल").gender, GENDERS.NAPUNSAKLINGA);
  assert.equal(getGender("तूप").gender, GENDERS.NAPUNSAKLINGA);
  assert.equal(getGender("मीठ").gender, GENDERS.NAPUNSAKLINGA);
  assert.equal(getGender("दूध").gender, GENDERS.NAPUNSAKLINGA);
  assert.equal(getGender("पाणी").gender, GENDERS.NAPUNSAKLINGA);
  assert.equal(getGender("ताक").gender, GENDERS.NAPUNSAKLINGA);
  assert.equal(getGender("केळे").gender, GENDERS.NAPUNSAKLINGA);
  assert.equal(getGender("सफरचंद").gender, GENDERS.NAPUNSAKLINGA);
});

test("Auto-transliterates Latin English phonetic input seamlessly", () => {
  assert.equal(getGender("sakhar").gender, GENDERS.STREELINGA);
  assert.equal(getGender("sakhar").pronoun, "ती");

  assert.equal(getGender("kanda").gender, GENDERS.PULLINGA);
  assert.equal(getGender("kanda").pronoun, "तो");

  assert.equal(getGender("tel").gender, GENDERS.NAPUNSAKLINGA);
  assert.equal(getGender("tel").pronoun, "ते");

  assert.equal(getGender("mulga").gender, GENDERS.PULLINGA);
  assert.equal(getGender("mulgi").gender, GENDERS.STREELINGA);
  assert.equal(getGender("pustak").gender, GENDERS.NAPUNSAKLINGA);
});

test("Resolves correct Marathi demonstrative pronouns (तो, ती, ते) and format strings", () => {
  assert.equal(getPronoun("कांदा"), "तो");
  assert.equal(getPronoun("साखर"), "ती");
  assert.equal(getPronoun("तेल"), "ते");

  assert.equal(formatWithPronoun("कांदा"), "तो कांदा");
  assert.equal(formatWithPronoun("साखर"), "ती साखर");
  assert.equal(formatWithPronoun("तेल"), "ते तेल");
  assert.equal(formatWithPronoun("पुस्तक"), "ते पुस्तक");
});

test("Provides accurate opposite gender pairs and inflection", () => {
  assert.equal(getOppositeGender("मुलगा"), "मुलगी");
  assert.equal(getOppositeGender("मुलगी"), "मुलगा");

  assert.equal(getOppositeGender("घोडा"), "घोडी");
  assert.equal(getOppositeGender("घोडी"), "घोडा");

  assert.equal(getOppositeGender("बैल"), "गाय");
  assert.equal(getOppositeGender("गाय"), "बैल");

  assert.equal(getOppositeGender("शिक्षक"), "शिक्षिका");
  assert.equal(getOppositeGender("शिक्षिका"), "शिक्षक");

  assert.equal(getOppositeGender("मालक"), "मालकीण");
  assert.equal(getOppositeGender("मालकीण"), "मालक");

  assert.equal(getOppositeGender("वाघ"), "वाघीण");
  assert.equal(getOppositeGender("सिंह"), "सिंहीण");

  assert.equal(getOppositeGender("राजा"), "राणी");
  assert.equal(getOppositeGender("राणी"), "राजा");

  assert.equal(changeGender("मुलगा"), "मुलगी");
  assert.equal(changeGender("घोडी"), "घोडा");
});

test("Recognizes dual/common gender words (उभयलिंग)", () => {
  assert.equal(isDualGender("बाग"), true);
  assert.equal(isDualGender("वेळ"), true);
  assert.equal(isMasculine("बाग"), true);
  assert.equal(isFeminine("बाग"), true);
});

test("Helper boolean predicates work reliably", () => {
  assert.equal(isMasculine("सूर्य"), true);
  assert.equal(isPullinga("डोंगर"), true);
  assert.equal(isFeminine("नदी"), true);
  assert.equal(isStreelinga("शाळा"), true);
  assert.equal(isNeuter("शहर"), true);
  assert.equal(isNapunsaklinga("गाव"), true);
});

test("Morphological rules correctly infer unlisted nouns", () => {
  // Feminine agentive suffix -ीण
  assert.equal(getGender("लोहारीण").gender, GENDERS.STREELINGA);
  // Feminine agentive suffix -िका
  assert.equal(getGender("संपादिका").gender, GENDERS.STREELINGA);
  // Neuter collective suffix -मंडळ, -त्व
  assert.equal(getGender("कार्यकारिणी मंडळ").gender, GENDERS.NAPUNSAKLINGA);
  assert.equal(getGender("मित्रत्व").gender, GENDERS.NAPUNSAKLINGA);
  // -ा vowel ending -> पुल्लिंग
  assert.equal(getGender("भोवरा").gender, GENDERS.PULLINGA);
});

test("Allows extending the gender dictionary at runtime", () => {
  extendGenderDictionary({
    "अनोखीवस्तू": GENDERS.STREELINGA
  });
  assert.equal(getGender("अनोखीवस्तू").gender, GENDERS.STREELINGA);
  assert.equal(getPronoun("अनोखीवस्तू"), "ती");
});
