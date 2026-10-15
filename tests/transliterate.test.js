import test from 'node:test';
import assert from 'node:assert/strict';
import {
  transliterateWord,
  transliterate,
  toDevanagari,
  getSuggestions,
  MARATHI_DICTIONARY
} from '../src/index.js';

test('Transliterates everyday Marathi grocery items accurately', () => {
  assert.equal(transliterateWord('sakhar'), 'साखर');
  assert.equal(transliterateWord('Sakhar'), 'साखर');
  assert.equal(transliterateWord('kanda'), 'कांदा');
  assert.equal(transliterateWord('batata'), 'बटाटा');
  assert.equal(transliterateWord('mith'), 'मीठ');
  assert.equal(transliterateWord('tel'), 'तेल');
  assert.equal(transliterateWord('gahu'), 'गहू');
  assert.equal(transliterateWord('tandul'), 'तांदूळ');
  assert.equal(transliterateWord('pohe'), 'पोहे');
  assert.equal(transliterateWord('rava'), 'रवा');
  assert.equal(transliterateWord('besan'), 'बेसन');
  assert.equal(transliterateWord('chaha'), 'चहा');
  assert.equal(transliterateWord('toor'), 'तूर');
  assert.equal(transliterateWord('moong'), 'मूग');
  assert.equal(transliterateWord('udid'), 'उडीद');
  assert.equal(transliterateWord('chana'), 'चना');
  assert.equal(transliterateWord('gul'), 'गूळ');
  assert.equal(transliterateWord('toop'), 'तूप');
  assert.equal(transliterateWord('saban'), 'साबण');
  assert.equal(transliterateWord('agarbatti'), 'अगरबत्ती');
  assert.equal(transliterateWord('kapoor'), 'कापूर');
  assert.equal(transliterateWord('dhoop'), 'धूप');
  assert.equal(transliterateWord('masala'), 'मसाला');
  assert.equal(transliterateWord('halad'), 'हळद');
  assert.equal(transliterateWord('lasun'), 'लसूण');
  assert.equal(transliterateWord('aale'), 'आले');
  assert.equal(transliterateWord('kothimbir'), 'कोथिंबीर');
  assert.equal(transliterateWord('jira'), 'जिरे');
  assert.equal(transliterateWord('mohari'), 'मोहरी');
  assert.equal(transliterateWord('biscuit'), 'बिस्कीट');
  assert.equal(transliterateWord('dudh'), 'दूध');
  assert.equal(transliterateWord('dahi'), 'दही');
  assert.equal(transliterateWord('taak'), 'ताक');
  assert.equal(transliterateWord('paneer'), 'पनीर');
});

test('Transliterates common names and surnames accurately', () => {
  assert.equal(transliterateWord('ketan'), 'केतन');
  assert.equal(transliterateWord('rahul'), 'राहुल');
  assert.equal(transliterateWord('patil'), 'पाटील');
  assert.equal(transliterateWord('deshmukh'), 'देशमुख');
  assert.equal(transliterateWord('pawar'), 'पवार');
  assert.equal(transliterateWord('jadhav'), 'जाधव');
  assert.equal(transliterateWord('shinde'), 'शिंदे');
  assert.equal(transliterateWord('kadam'), 'कदम');
  assert.equal(transliterateWord('namaskar'), 'नमस्कार');
  assert.equal(transliterateWord('dhanyavad'), 'धन्यवाद');
  assert.equal(transliterateWord('swagat'), 'स्वागत');
  assert.equal(transliterateWord('kirana'), 'किराणा');
  assert.equal(transliterateWord('dukan'), 'दुकान');
  assert.equal(transliterateWord('dnyaneshwar'), 'ज्ञानेश्वर');
});

test('Transliterates full multi-word sentences and preserves numbers/symbols', () => {
  const sentence = 'sakhar 1 kilo ani kanda 2 kg';
  const expected = 'साखर 1 किलो आणि कांदा 2 कि.ग्रॅ.';
  assert.equal(transliterate(sentence), expected);

  const greeting = transliterate('namaskar grahak');
  assert.equal(greeting, 'नमस्कार ग्राहक');
});

test('getSuggestions returns candidate list', () => {
  const list = getSuggestions('sakhar');
  assert.ok(Array.isArray(list));
  assert.ok(list.includes('साखर'));
});
