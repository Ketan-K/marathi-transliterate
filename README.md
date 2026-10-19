# marathi-transliterate

> **Zero-dependency, offline-first Plain JavaScript phonetic transliteration library for Marathi (Devanagari script).**
> Converts colloquial English typing to authentic Marathi (e.g., `sakhar` &rarr; `साखर`, `kanda` &rarr; `कांदा`, `batata` &rarr; `बटाटा`) with single-step backspace undo and interactive input attachment.

[![npm version](https://img.shields.io/npm/v/marathi-transliterate.svg)](https://www.npmjs.com/package/marathi-transliterate)
[![license](https://img.shields.io/npm/l/marathi-transliterate.svg)](https://github.com/Ketan-K/marathi-transliterate/blob/main/LICENSE)

---

## Why marathi-transliterate?

Most existing Sanskrit/IAST transliteration libraries convert `sakhar` to **सखर** or `batata` to **बतत** because they require scholarly transliteration (`saakhar`, `bataataa`).

In everyday reality, people in Maharashtra type phonetically:
- `sakhar` &rarr; **साखर**
- `jaad` &rarr; **जाड**
- `daba` &rarr; **डबा**
- `kanda` &rarr; **कांदा**
- `batata` &rarr; **बटाटा**
- `mith` &rarr; **मीठ**
- `tel` &rarr; **तेल**
- `gahu` &rarr; **गहू**
- `tandul` &rarr; **तांदूळ**
- `pohe` &rarr; **पोहे**
- `rava` &rarr; **रवा**
- `besan` &rarr; **बेसन**
- `toor dal` &rarr; **तूर डाळ**
- `chaha` &rarr; **चहा**
- `dnyaneshwar` &rarr; **ज्ञानेश्वर**
- `patil` &rarr; **पाटील**
- `khandeshi` &rarr; **खान्देशी**
- `khandesh` &rarr; **खान्देश**
- `ahirani` &rarr; **अहिराणी**
- `varhadi` &rarr; **वऱ्हाडी** / `varhad` &rarr; **वऱ्हाड**
- `kokani` &rarr; **कोकणी** / `malvani` &rarr; **मालवणी**
- `thecha` &rarr; **ठेचा**
- `kalna` &rarr; **कळणा**
- `shevbhaji` &rarr; **शेवभाजी**
- `bharit` &rarr; **भरीत**
- `bhandar` &rarr; **भांडार**
- `vyapari` &rarr; **व्यापारी**

`marathi-transliterate` is built specifically for modern Marathi phonetic typing:
- **Zero dependencies**: Pure JavaScript, ~15 KB.
- **Offline first**: Works 100% offline without requiring internet or API calls.
- **Framework agnostic**: Works in Plain HTML/JS, Node.js, React, Vue, Svelte, Angular, Electron.
- **Interactive DOM integration**: Attach directly to any `<input>` or `<textarea>` with Space-to-convert, Backspace-to-undo, and `Ctrl+M` toggle.

---

## Installation

```bash
npm install marathi-transliterate
```

---

## Quick Start

### 1. Plain JavaScript / Node.js

```javascript
import { transliterate, transliterateWord } from 'marathi-transliterate';

// Single word transliteration
transliterateWord('sakhar');  // → 'साखर'
transliterateWord('jaad');    // → 'जाड'
transliterateWord('Daba');    // → 'डबा'
transliterateWord('D');       // → 'ड' (vs 'd' → 'द')
transliterateWord('kanda');   // → 'कांदा'
transliterateWord('batata');  // → 'बटाटा'
transliterateWord('namaskar'); // → 'नमस्कार'

// Full sentence transliteration (numbers and symbols preserved)
transliterate('sakhar 1 kilo ani kanda 2 kg');
// → 'साखर 1 किलो आणि कांदा 2 कि.ग्रॅ.'
```

---

### 2. Attach to any HTML `<input>` or `<textarea>`

Easily enable Marathi phonetic typing on any input element:

```html
<input type="text" id="product-name" placeholder="उदा. sakhar टाइप करा..." />

<script type="module">
  import { attachDevanagari } from 'marathi-transliterate';

  const inputEl = document.getElementById('product-name');

  // Attach Devanagari typing
  const handler = attachDevanagari(inputEl, {
    defaultEnabled: true,
    enableShortcut: true, // Ctrl+M or Cmd+M toggles Marathi/English
    onToggle: (enabled) => console.log('Marathi typing:', enabled)
  });

  // To clean up listeners when unmounting:
  // handler.detach();
</script>
```

#### Interactive Smart Suggesting:
As you type (e.g. `sakhar`), a floating suggestion popup appears with ranked candidates:
- **`Space` or `Enter`**: Automatically selects the top recommended candidate (`साखर`).
- **`1`, `2`, `3`, `4`, `5`**: Press any digit key to select that candidate immediately.
- **`Arrow Down / Up`**: Navigate through candidate suggestions.
- **`Esc`**: Dismisses the suggestion popup without converting.
- **`Backspace`**: Undoes the transliteration back to English.
- **`Ctrl+M` (or `Cmd+M`)**: Toggles Marathi and English typing mode on the fly.

---

### 3. Usage in React

Use a standard React `ref` or `useEffect`:

```jsx
import React, { useRef, useEffect, useState } from 'react';
import { attachDevanagari } from 'marathi-transliterate';

export function MarathiInput() {
  const inputRef = useRef(null);
  const [isMarathi, setIsMarathi] = useState(true);

  useEffect(() => {
    if (!inputRef.current) return;

    const handler = attachDevanagari(inputRef.current, {
      defaultEnabled: true,
      onToggle: (enabled) => setIsMarathi(enabled)
    });

    return () => handler.detach();
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <input ref={inputRef} placeholder="वस्तूचे नाव टाइप करा..." />
      <span style={{ fontSize: '12px', color: isMarathi ? 'green' : 'gray' }}>
        {isMarathi ? 'मराठी (Ctrl+M)' : 'English (Ctrl+M)'}
      </span>
    </div>
  );
}
```

---

## Regional Dialects & Cultural Words (खानदेशी, अहिराणी, वऱ्हाडी, कोकणी)

`marathi-transliterate` natively handles difficult Marathi conjuncts, regional dialect spellings, traditional foods, and business terminology without getting garbled:

| Category | Input | Output | Suggestions |
| :--- | :--- | :--- | :--- |
| **Khandesh & Ahirani** | `khandeshi` | **खान्देशी** | `['खान्देशी', 'खानदेशी', 'खांदेशी']` |
| | `khandesh` | **खान्देश** | `['खान्देश', 'खानदेश', 'खांदेश']` |
| | `ahirani` | **अहिराणी** | `['अहिराणी', 'अहिराणि']` |
| | `khandoba` | **खंडोबा** | `['खंडोबा', 'खंडेराव']` |
| **Varhad & Vidarbha** | `varhad` / `warhad` | **वऱ्हाड** | ऱ्ह conjunct (`वऱ्हाड`) |
| | `varhadi` / `warhadi`| **वऱ्हाडी** | `['वऱ्हाडी']` |
| | `vidarbha` / `vidarbhi` | **विदर्भ** / **विदर्भी** | `['विदर्भ', 'विदर्भी', 'विदर्भीय']` |
| **Kokan & Western MH** | `kokan` / `konkan` | **कोकण** | `['कोकण', 'कोकणी']` |
| | `malvan` / `malvani` | **मालवण** / **मालवणी** | `['मालवण', 'मालवणी']` |
| | `marathwada` / `marathwadi` | **मराठवाडा** / **मराठवाडी** | `['मराठवाडा', 'मराठवाडी']` |
| | `mandesh` / `mandeshi` | **मान्देश** / **मान्देशी** | `['मान्देशी', 'मानदेशी']` |
| **Traditional Foods** | `kalna` / `kalnache` | **कळणा** / **कळण्याचे** | (कळण्याची भाकर / पीठ) |
| | `shevbhaji` | **शेवभाजी** | (खानदेशी शेवभाजी) |
| | `thecha` | **ठेचा** | (मिरचीचा ठेचा) |
| | `bharit` | **भरीत** | (वांग्याचे भरीत) |
| | `puranpoli` | **पुरणपोळी** | (पुरणपोळी) |
| | `pithla` / `pithle` | **पिठलं** / **पिठले** | (पिठलं-भाकरी) |
| **Business & Trade** | `bhandar` / `kiranabhandar` | **भांडार** / **किराणा भांडार** | |
| | `vyapari` / `kharedidar` | **व्यापारी** / **खरेदीदार** | |
| | `kamgar` / `karagir` | **कामगार** / **कारागीर** | |

---

## API Reference

### `transliterateWord(word: string): string`
Converts a single English word into Marathi Devanagari script.

### `transliterate(text: string): string`
Converts full text, sentences, or paragraphs into Marathi while preserving numbers, whitespace, and punctuation.

### `getSuggestions(word: string): string[]`
Returns candidate phonetic variations for a given word.

### `extendDictionary(customWords: Record<string, string>): void`
Extends or overrides the global transliteration dictionary with your own custom vocabulary at runtime.

```javascript
import { extendDictionary, transliterateWord } from "marathi-transliterate";

extendDictionary({
  "sangamner": "संगमनेर",
  "myitem": "माझामाल"
});

transliterateWord("sangamner"); // → "संगमनेर"
```

### `normalizeMarathi(text: string): string`
Normalizes Marathi characters (interchangeable ळ/ल, श/ष, ि/ी, ु/ू, and anusvara) for tolerant comparisons and search filtering.

```javascript
import { normalizeMarathi } from "marathi-transliterate";

normalizeMarathi("भुसाळ") === normalizeMarathi("भुसाल"); // → true
```

### `attachDevanagari(element, options): Handler`
Attaches keyboard listeners to an `<input>` or `<textarea>` element.

| Option | Type | Default | Description |
|---|---|---|---|
| `defaultEnabled` | `boolean` | `true` | Whether Marathi typing starts enabled |
| `enableShortcut` | `boolean` | `true` | Enables `Ctrl+M` / `Cmd+M` toggle |
| `triggerKeys` | `string[]` | `[' ', 'Enter', ',', '.']` | Keys that trigger transliteration |
| `onToggle` | `Function` | `undefined` | Callback `(isEnabled) => void` |
| `onTransliterate` | `Function` | `undefined` | Callback `({ original, transliterated }) => void` |

**Returns:**
```typescript
{
  detach: () => void;
  setEnabled: (val: boolean) => void;
  isEnabled: () => boolean;
  toggle: () => boolean;
}
```

---

---

## 🧬 Marathi Grammatical Gender & Linguistics (लिंग व्यवस्था)

`marathi-transliterate` includes a zero-dependency, offline grammatical gender analyzer and inflection engine for Marathi nouns, supporting **पुल्लिंग (Masculine / तो)**, **स्त्रीलिंग (Feminine / ती)**, **नपुंसकलिंग (Neuter / ते)**, and **उभयलिंग (Dual / Common)**.

You can import directly from the root package or via the dedicated submodules `marathi-transliterate/gender` / `marathi-transliterate/ling`:

```javascript
import {
  getGender,
  getPronoun,
  formatWithPronoun,
  getOppositeGender,
  changeGender,
  isMasculine,
  isFeminine,
  isNeuter,
  isDualGender,
  GENDERS
} from "marathi-transliterate";
// Or: import { getGender } from "marathi-transliterate/gender";
```

### 1. Gender Detection (`getGender`)
Accepts either Devanagari Marathi text or phonetic Latin English typing (auto-transliterated):

```javascript
// Kirana & Grocery items
getGender("कांदा");
// → { word: "कांदा", gender: "पुल्लिंग", pronoun: "तो", label: "पुल्लिंग (तो)", formatted: "तो कांदा" }

getGender("sakhar");
// → { word: "sakhar", devanagari: "साखर", gender: "स्त्रीलिंग", pronoun: "ती", formatted: "ती साखर" }

getGender("tel");
// → { word: "tel", devanagari: "तेल", gender: "नपुंसकलिंग", pronoun: "ते", formatted: "ते तेल" }
```

### 2. Demonstrative Pronoun Resolution (`getPronoun`, `formatWithPronoun`)
```javascript
getPronoun("साखर"); // → "ती"
getPronoun("कांदा"); // → "तो"
getPronoun("दूध");   // → "ते"

formatWithPronoun("कांदा");  // → "तो कांदा"
formatWithPronoun("साखर");  // → "ती साखर"
formatWithPronoun("पुस्तक"); // → "ते पुस्तक"
```

### 3. Opposite Gender Inflection (`getOppositeGender`, `changeGender`)
Pairs masculine and feminine counterparts (Family, Occupations, Titles, Animals):

```javascript
getOppositeGender("मुलगा");   // → "मुलगी"
getOppositeGender("घोडा");    // → "घोडी"
getOppositeGender("बैल");     // → "गाय"
getOppositeGender("शिक्षक");  // → "शिक्षिका"
getOppositeGender("मालक");    // → "मालकीण"
getOppositeGender("राजा");    // → "राणी"
getOppositeGender("वाघ");     // → "वाघीण"
```

### 4. Dual / Common Gender Recognition (`isDualGender`)
Words that naturally take both masculine and feminine in Marathi:
```javascript
isDualGender("बाग"); // → true ("तो बाग" / "ती बाग")
isDualGender("वेळ"); // → true ("तो वेळ" / "ती वेळ")
```

### 5. Runtime Extensibility (`extendGenderDictionary`)
```javascript
import { extendGenderDictionary, GENDERS } from "marathi-transliterate";

extendGenderDictionary({
  "अनोखीवस्तू": GENDERS.STREELINGA
});
```

---

## 🔍 Phonetic Search & Matching Engine (`/search`)

`marathi-transliterate` includes a zero-dependency, high-performance Marathi Phonetic Search Engine designed for POS, catalogs, billing software, and customer lookups. It allows searching Marathi items using Romanized English, Devanagari, or colloquial phonetic spelling variations.

Import directly from the root package or via the dedicated subpath `marathi-transliterate/search`:

```javascript
import {
  searchMarathi,
  matchMarathi,
  scoreMarathiMatch,
  normalizePhonetics,
  expandSearchVariants
} from "marathi-transliterate";
// Or: import { searchMarathi } from "marathi-transliterate/search";
```

### 1. Catalog & Inventory Search (`searchMarathi`)
Filters and ranks arrays of objects or strings by phonetic relevance score:

```javascript
const products = [
  { id: 1, name: 'काजू तुकडा', nameEn: 'Cashew Bits' },
  { id: 2, name: 'चितळे दूध', nameEn: 'Chitale Milk' },
  { id: 3, name: 'साबुदाणा', nameEn: 'Sago' },
  { id: 4, name: 'सोयाबीन तेल 15 लिटर', nameEn: 'Soybean Oil 15L' }
];

// Search using Romanized English:
searchMarathi(products, 'chitale', { keys: ['name', 'nameEn'] });
// → [{ id: 2, name: 'चितळे दूध', nameEn: 'Chitale Milk' }]

// Multi-word search:
searchMarathi(products, 'soya tel', { keys: ['name', 'nameEn'] });
// → [{ id: 4, name: 'सोयाबीन तेल 15 लिटर', ... }]

// Prefix search (as user types):
searchMarathi(products, 'kaj', { keys: ['name'] });
// → [{ id: 1, name: 'काजू तुकडा', ... }]
```

### 2. Boolean Match Evaluator (`matchMarathi`)
Evaluates whether a target string matches a query across transliterations, suggestions, and deep phonetic variations:

```javascript
// Grocery & Item transliterations
matchMarathi('काजू', 'kaju');         // → true
matchMarathi('साबुदाणा', 'sabudana'); // → true
matchMarathi('चितळे', 'chitale');     // → true
matchMarathi('पोहे', 'poha');         // → true
matchMarathi('पापड', 'papad');       // → true

// Deep phonetic variations
matchMarathi('वाटाणा', 'vatana');     // → true (ण vs न)
matchMarathi('वाटाणा', 'वाटाना');     // → true (ण vs न)
matchMarathi('शेव', 'sev');           // → true (श vs स)
matchMarathi('कांदा', 'कंदा');         // → true (Anuswar tolerance)
matchMarathi('रवा', 'रबा');           // → true (व vs ब)

// Prefix support (default: true)
matchMarathi('काजू', 'kaj');          // → true
matchMarathi('साबुदाणा', 'sab');      // → true

// Multi-word queries (default: 'all')
matchMarathi('काजू तुकडा', 'kaju tukda'); // → true
matchMarathi('सोयाबीन तेल 15 लिटर', 'soya tel'); // → true
```

### 3. Relevance Scoring (`scoreMarathiMatch`)
Returns a score from `0` to `1000` for sorting search results:

| Score | Match Tier | Example |
|---|---|---|
| **1000** | Exact match | `scoreMarathiMatch('काजू', 'काजू')` or `scoreMarathiMatch('काजू', 'kaju')` |
| **800** | Prefix match | `scoreMarathiMatch('काजू तुकडा', 'kaju')` (Target starts with top transliteration) |
| **600** | Top transliteration match | `scoreMarathiMatch('मसाला काजू करी', 'kaju')` (Target contains transliteration) |
| **400** | Secondary suggestion candidate | `scoreMarathiMatch('चितले', 'chitale')` (Candidate in `getSuggestions`) |
| **200** | Substring match | `scoreMarathiMatch('Cashew Bits', 'cashew')` |
| **100** | Phonetic normalized match | `scoreMarathiMatch('शेव', 'सेव')` or `scoreMarathiMatch('रवा', 'रबा')` |
| **0** | No match | `scoreMarathiMatch('हळद', 'sakhar')` |

### 4. Deep Phonetic Normalization (`normalizePhonetics`)
Normalizes common interchangeable Marathi characters and vowel lengths:
- **`ळ ➔ ल`** (`चितळे` ↔ `चितले`)
- **`ण ➔ न`** (`दाणे` ↔ `दाने`, `साबुदाणा` ↔ `साबुदाना`, `धणे` ↔ `धने`, `वाटाणा` ↔ `वाटाना`)
- **`श, ष ➔ स`** (`शेव` ↔ `सेव`, `शाकर` ↔ `साखर`)
- **`व ➔ ब`** (`वरई` ↔ `बरई`, `रवा` ↔ `रबा`)
- **`ी ➔ ि, ू ➔ ु`** (`काजू` ↔ `काजु`, `तूप` ↔ `तुप`)
- **Anuswar tolerance** (`कांदा` ↔ `कंदा`, `शेंगदाणे` ↔ `शेगदाणे`)

```javascript
normalizePhonetics("दाणे") === normalizePhonetics("दाने"); // → true
normalizePhonetics("शेव") === normalizePhonetics("सेव");   // → true
normalizePhonetics("कांदा") === normalizePhonetics("कंदा"); // → true
```

---

## 🌐 Browser CDN Usage (`<script>` tag)

You can use `marathi-transliterate` directly in vanilla HTML via unpkg or jsdelivr without any build tools:

```html
<script src="https://unpkg.com/marathi-transliterate/dist/marathi-transliterate.min.js"></script>
<script>
  // Global MarathiTransliterate object is available
  console.log(MarathiTransliterate.transliterate("sakhar ani kanda"));
  // → 'साखर आणि कांदा'

  console.log(MarathiTransliterate.searchMarathi(['काजू', 'बदाम'], 'kaju'));
  // → ['काजू']
</script>
```

---

## License

MIT © Ketan Katore

