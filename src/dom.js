import { transliterateWord, getSuggestions } from './index.js';

export function attachDevanagari(target, options = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) {
    console.warn('[marathi-transliterate] attachDevanagari: element not found', target);
    return { detach: () => {}, setEnabled: () => {}, isEnabled: () => false, toggle: () => false };
  }

  const {
    defaultEnabled = true,
    showSuggestions = true,
    enableShortcut = true,
    maxSuggestions = 5,
    onToggle,
    onTransliterate
  } = options;

  let enabled = defaultEnabled;
  let lastConversion = null;
  let activeWord = '';
  let activeWordStart = -1;
  let candidates = [];
  let selectedIndex = 0;
  let popupEl = null;

  function createPopup() {
    if (typeof document === 'undefined') return;
    popupEl = document.createElement('div');
    popupEl.className = 'devanagari-suggestion-popup';
    Object.assign(popupEl.style, {
      position: 'fixed',
      zIndex: '999999',
      display: 'none',
      flexDirection: 'column',
      background: 'rgba(23, 23, 23, 0.95)',
      color: '#f8fafc',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '8px',
      padding: '4px',
      boxShadow: '0 12px 30px -4px rgba(0, 0, 0, 0.5), 0 6px 12px -4px rgba(0, 0, 0, 0.3)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '13px',
      minWidth: '160px',
      maxWidth: '300px',
      userSelect: 'none',
      pointerEvents: 'auto'
    });
    document.body.appendChild(popupEl);
  }

  if (showSuggestions) createPopup();

  function positionPopup() {
    if (!popupEl || !el) return;
    const rect = el.getBoundingClientRect();
    const popupHeight = popupEl.offsetHeight || 120;
    const spaceBelow = window.innerHeight - rect.bottom;
    let top = rect.bottom + 4;
    if (spaceBelow < popupHeight && rect.top > popupHeight) {
      top = rect.top - popupHeight - 4;
    }
    popupEl.style.top = Math.max(8, top) + 'px';
    popupEl.style.left = Math.max(8, Math.min(rect.left, window.innerWidth - 320)) + 'px';
  }

  function hidePopup() {
    if (!popupEl) return;
    popupEl.style.display = 'none';
    candidates = [];
    selectedIndex = 0;
    activeWord = '';
    activeWordStart = -1;
  }

  function renderPopup() {
    if (!popupEl || candidates.length === 0) {
      hidePopup();
      return;
    }
    popupEl.innerHTML = '';
    candidates.forEach((cand, idx) => {
      const item = document.createElement('div');
      item.className = 'devanagari-suggestion-item';
      const isSelected = idx === selectedIndex;
      Object.assign(item.style, {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 10px',
        borderRadius: '5px',
        cursor: 'pointer',
        background: isSelected ? 'rgba(59, 130, 246, 0.95)' : 'transparent',
        color: isSelected ? '#ffffff' : '#f1f5f9',
        fontWeight: isSelected ? '700' : '500',
        transition: 'background 0.1s ease'
      });
      const label = document.createElement('span');
      label.textContent = cand;
      label.style.overflow = 'hidden';
      label.style.textOverflow = 'ellipsis';
      label.style.whiteSpace = 'nowrap';
      const keyBadge = document.createElement('span');
      keyBadge.textContent = String(idx + 1);
      Object.assign(keyBadge.style, {
        fontSize: '10px',
        fontWeight: '700',
        opacity: isSelected ? '1' : '0.6',
        marginLeft: '8px',
        background: isSelected ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.12)',
        padding: '1px 5px',
        borderRadius: '3px'
      });
      item.appendChild(label);
      item.appendChild(keyBadge);
      item.addEventListener('mousedown', (e) => {
        e.preventDefault();
        selectCandidate(idx, ' ');
      });
      popupEl.appendChild(item);
    });
    popupEl.style.display = 'flex';
    positionPopup();
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
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function selectCandidate(index, delimiter = ' ') {
    if (index < 0 || index >= candidates.length) return;
    const chosen = candidates[index];
    const currentValue = el.value;
    const before = currentValue.slice(0, activeWordStart);
    const after = currentValue.slice(el.selectionStart);
    const newValue = before + chosen + delimiter + after;
    setNativeValue(el, newValue);
    const newCursor = activeWordStart + chosen.length + delimiter.length;
    setTimeout(() => { el.setSelectionRange(newCursor, newCursor); }, 0);
    lastConversion = {
      original: activeWord,
      converted: chosen,
      startPos: activeWordStart,
      endPos: activeWordStart + chosen.length
    };
    if (onTransliterate) {
      onTransliterate({ original: activeWord, transliterated: chosen });
    }
    hidePopup();
  }

  function setEnabled(val) {
    enabled = Boolean(val);
    if (!enabled) hidePopup();
    if (onToggle) onToggle(enabled);
  }

  function isEnabled() { return enabled; }

  function toggle() { setEnabled(!enabled); return enabled; }

  function handleInput() {
    if (!enabled || !showSuggestions) return;
    const cursorPos = el.selectionStart;
    const textBeforeCursor = el.value.slice(0, cursorPos);
    const match = textBeforeCursor.match(/([a-zA-Z]+)$/);
    if (match) {
      activeWord = match[1];
      activeWordStart = cursorPos - activeWord.length;
      candidates = getSuggestions(activeWord, { maxSuggestions, includeOriginal: true });
      selectedIndex = 0;
      renderPopup();
    } else {
      hidePopup();
    }
  }

  function handleKeyDown(e) {
    const isCmdOrCtrl = e.metaKey || e.ctrlKey;
    if (enableShortcut && isCmdOrCtrl && e.key.toLowerCase() === 'm') {
      e.preventDefault();
      toggle();
      return;
    }
    if (!enabled) return;

    if (popupEl && popupEl.style.display !== 'none' && candidates.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % candidates.length;
        renderPopup();
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + candidates.length) % candidates.length;
        renderPopup();
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        hidePopup();
        return;
      }
      if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        selectCandidate(selectedIndex, e.key === 'Enter' ? '' : ' ');
        return;
      }
      if (e.key === ' ' || e.key === 'Spacebar' || e.code === 'Space') {
        e.preventDefault();
        selectCandidate(selectedIndex, ' ');
        return;
      }
      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= candidates.length) {
        e.preventDefault();
        selectCandidate(num - 1, ' ');
        return;
      }
    }

    const cursorPos = el.selectionStart;
    if (e.key === 'Backspace' && lastConversion) {
      if (cursorPos === lastConversion.endPos || cursorPos === lastConversion.endPos + 1) {
        e.preventDefault();
        const currentValue = el.value;
        const before = currentValue.slice(0, lastConversion.startPos);
        const after = currentValue.slice(cursorPos);
        const restored = before + lastConversion.original + after;
        setNativeValue(el, restored);
        const newCursor = lastConversion.startPos + lastConversion.original.length;
        setTimeout(() => { el.setSelectionRange(newCursor, newCursor); }, 0);
        lastConversion = null;
        hidePopup();
        return;
      }
    }
    if (e.key !== 'Backspace') {
      lastConversion = null;
    }
  }

  function handleBlur() {
    setTimeout(() => { hidePopup(); }, 200);
  }

  el.addEventListener('keydown', handleKeyDown);
  el.addEventListener('input', handleInput);
  el.addEventListener('blur', handleBlur);

  function detach() {
    el.removeEventListener('keydown', handleKeyDown);
    el.removeEventListener('input', handleInput);
    el.removeEventListener('blur', handleBlur);
    if (popupEl && popupEl.parentNode) {
      popupEl.parentNode.removeChild(popupEl);
    }
    popupEl = null;
  }

  return { detach, setEnabled, isEnabled, toggle };
}
