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

## License

MIT © Ketan Katore
