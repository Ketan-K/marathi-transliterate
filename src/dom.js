import { transliterateWord } from './index.js';

/**
 * Attaches Devanagari (Marathi) phonetic typing to any HTML input or textarea element.
 * Works seamlessly with Vanilla JS, React, Vue, Svelte, or any web framework.
 *
 * @param {HTMLInputElement|HTMLTextAreaElement|string} target - DOM element or CSS selector
 * @param {Object} [options]
 * @param {boolean} [options.defaultEnabled=true] - Initial typing mode
 * @param {boolean} [options.enableShortcut=true] - Enable Ctrl+M / Cmd+M toggle shortcut
 * @param {string[]} [options.triggerKeys=[' ', 'Enter', ',', '.']] - Keys that trigger transliteration
 * @param {Function} [options.onToggle] - Callback when enabled state changes `(isEnabled) => void`
 * @param {Function} [options.onTransliterate] - Callback when a word is transliterated
 * @returns {{ detach: Function, setEnabled: Function, isEnabled: Function, toggle: Function }}
 */
export function attachDevanagari(target, options = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) {
    console.warn('[marathi-transliterate] attachDevanagari: element not found', target);
    return {
      detach: () => {},
      setEnabled: () => {},
      isEnabled: () => false,
      toggle: () => false
    };
  }

  const {
    defaultEnabled = true,
    enableShortcut = true,
    triggerKeys = [' ', 'Enter', ',', '.'],
    onToggle,
    onTransliterate
  } = options;

  let enabled = defaultEnabled;
  let lastConversion = null;

  function setEnabled(val) {
    enabled = Boolean(val);
    if (onToggle) onToggle(enabled);
  }

  function isEnabled() {
    return enabled;
  }

  function toggle() {
    setEnabled(!enabled);
    return enabled;
  }

  function setNativeValue(input, newValue) {
    const isInput = input instanceof HTMLInputElement;
    const proto = isInput ? HTMLInputElement.prototype : HTMLTextAreaElement.prototype;
    const desc = Object.getOwnPropertyDescriptor(proto, 'value');

    if (desc && desc.set) {
      desc.set.call(input, newValue);
    } else {
      input.value = newValue;
    }

    // Dispatch standard events for reactive frameworks (React, Vue, etc.)
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function handleKeyDown(e) {
    const isCmdOrCtrl = e.metaKey || e.ctrlKey;

    // 1. Toggle shortcut: Ctrl+M / Cmd+M
    if (enableShortcut && isCmdOrCtrl && e.key.toLowerCase() === 'm') {
      e.preventDefault();
      toggle();
      return;
    }

    if (!enabled) return;

    const cursorPos = el.selectionStart;

    // 2. Undo on Backspace: if immediately following a conversion
    if (e.key === 'Backspace' && lastConversion) {
      if (cursorPos === lastConversion.endPos || cursorPos === lastConversion.endPos + 1) {
        e.preventDefault();
        const currentValue = el.value;
        const before = currentValue.slice(0, lastConversion.startPos);
        const after = currentValue.slice(cursorPos);
        const restored = before + lastConversion.original + after;

        setNativeValue(el, restored);

        const newCursor = lastConversion.startPos + lastConversion.original.length;
        setTimeout(() => {
          el.setSelectionRange(newCursor, newCursor);
        }, 0);

        lastConversion = null;
        return;
      }
    }

    // Any other key resets single-step undo
    if (e.key !== 'Backspace') {
      lastConversion = null;
    }

    // 3. Trigger transliteration on space, enter, or punctuation
    if (triggerKeys.includes(e.key)) {
      const textBeforeCursor = el.value.slice(0, cursorPos);
      const match = textBeforeCursor.match(/([a-zA-Z]+)$/);

      if (match) {
        const originalWord = match[1];
        const wordStartPos = cursorPos - originalWord.length;
        const marathiWord = transliterateWord(originalWord);

        if (marathiWord && marathiWord !== originalWord) {
          e.preventDefault();
          const delimiter = e.key === 'Enter' ? '' : e.key;
          const currentValue = el.value;
          const before = currentValue.slice(0, wordStartPos);
          const after = currentValue.slice(cursorPos);
          const newValue = before + marathiWord + delimiter + after;

          setNativeValue(el, newValue);

          const newCursor = wordStartPos + marathiWord.length + delimiter.length;
          setTimeout(() => {
            el.setSelectionRange(newCursor, newCursor);
          }, 0);

          lastConversion = {
            original: originalWord,
            converted: marathiWord,
            startPos: wordStartPos,
            endPos: wordStartPos + marathiWord.length
          };

          if (onTransliterate) {
            onTransliterate({
              original: originalWord,
              transliterated: marathiWord
            });
          }
        }
      }
    }
  }

  el.addEventListener('keydown', handleKeyDown);

  function detach() {
    el.removeEventListener('keydown', handleKeyDown);
    lastConversion = null;
  }

  return {
    detach,
    setEnabled,
    isEnabled,
    toggle
  };
}
