// types.ts

// --- Constants: Vowels & Characters ---
export const E_VOWEL = "‌ေ"; // Special Myanmar Vowel Sign E

// --- Types ---
export interface Lessons {
  [level: string]: { [lesson: string]: string[] };
}

export interface KeyMapEntry {
  base?: string;
  shift?: string;
  alt?: string;
  label?: string;
}

export interface CharKeyMapping {
  code: string;
  shift: boolean;
}

// --- Keyboard Maps ---
export const KEY_MAP: Record<string, KeyMapEntry> = {
  Backquote: { base: "ၐ", shift: "ဎ", label: "`" },
  Digit1: { base: "၁", shift: "ဍ", label: "1" },
  Digit2: { base: "၂", shift: "ၒ", label: "2" },
  Digit3: { base: "၃", shift: "ဋ", label: "3" },
  Digit4: { base: "၄", shift: "ၓ", label: "4" },
  Digit5: { base: "၅", shift: "ၔ", label: "5" },
  Digit6: { base: "၆", shift: "ၕ", label: "6" },
  Digit7: { base: "၇", shift: "ရ", label: "7" },
  Digit8: { base: "၈", shift: "*", label: "8" },
  Digit9: { base: "၉", shift: "(", label: "9" },
  Digit0: { base: "၀", shift: ")", label: "0" },
  Minus: { base: "-", shift: "_", label: "-" },
  Equal: { base: "=", shift: "+", label: "=" },

  KeyQ: { base: "ဆ", shift: "ဈ", label: "Q" },
  KeyW: { base: "တ", shift: "ဝ", label: "W" },
  KeyE: { base: "န", shift: "ဣ", label: "E" },
  KeyR: { base: "မ", shift: "၎င်း", label: "R" },
  KeyT: { base: "အ", shift: "ဤ", label: "T" },
  KeyY: { base: "ပ", shift: "၌", label: "Y" },
  KeyU: { base: "က", shift: "ဥ", label: "U" },
  KeyI: { base: "င", shift: "၍", label: "I" },
  KeyO: { base: "သ", shift: "ဿ", label: "O" },
  KeyP: { base: "စ", shift: "ဏ", label: "P" },
  BracketLeft: { base: "ဟ", shift: "ဧ", label: "[" },
  BracketRight: { base: "ဩ", shift: "ဪ", label: "]" },

  KeyA: { base: E_VOWEL, shift: "ဗ", label: "A" },
  KeyS: { base: "ျ", shift: "ှ", label: "S" },
  KeyD: { base: "ိ", shift: "ီ", label: "D" },
  KeyF: { base: "်", shift: "္", label: "F" },
  KeyG: { base: "ါ", shift: "ွ", label: "G" },
  KeyH: { base: "့", shift: "ံ", label: "H" },
  KeyJ: { base: "ြ", shift: "ဲ", label: "J" },
  KeyK: { base: "ု", shift: "ဒ", label: "K" },
  KeyL: { base: "ူ", shift: "ဓ", label: "L" },
  Semicolon: { base: "း", shift: "ဂ", label: ";" },
  Quote: { base: "'", shift: '"', label: "'" },

  KeyZ: { base: "ဖ", shift: "ဇ", label: "Z" },
  KeyX: { base: "ထ", shift: "ဌ", label: "X" },
  KeyC: { base: "ခ", shift: "ဃ", label: "C" },
  KeyV: { base: "လ", shift: "ဠ", label: "V" },
  KeyB: { base: "ဘ", shift: "ယ", label: "B" },
  KeyN: { base: "ည", shift: "ဉ", label: "N" },
  KeyM: { base: "ာ", shift: "ဦ", label: "M" },
  Comma: { base: ",", shift: "၊", label: "," },
  Period: { base: ".", shift: "။", label: "." },
  Slash: { base: "/", shift: "?", label: "/" },

  Space: { base: " ", shift: " ", label: "Space" },
  ShiftLeft: { base: "", shift: "", label: "Shift" },
  ShiftRight: { base: "", shift: "", label: "Shift" },
  ControlLeft: { base: "", shift: "", label: "Ctrl" },
  ControlRight: { base: "", shift: "", label: "Ctrl" },
};

// 2. Keyboard Layout Rows
export const KEY_ROWS: string[][] = [
  [
    "Backquote",
    "Digit1",
    "Digit2",
    "Digit3",
    "Digit4",
    "Digit5",
    "Digit6",
    "Digit7",
    "Digit8",
    "Digit9",
    "Digit0",
    "Minus",
    "Equal",
  ],
  [
    "KeyQ",
    "KeyW",
    "KeyE",
    "KeyR",
    "KeyT",
    "KeyY",
    "KeyU",
    "KeyI",
    "KeyO",
    "KeyP",
    "BracketLeft",
    "BracketRight",
  ],
  [
    "KeyA",
    "KeyS",
    "KeyD",
    "KeyF",
    "KeyG",
    "KeyH",
    "KeyJ",
    "KeyK",
    "KeyL",
    "Semicolon",
    "Quote",
  ],
  [
    "KeyZ",
    "KeyX",
    "KeyC",
    "KeyV",
    "KeyB",
    "KeyN",
    "KeyM",
    "Comma",
    "Period",
    "Slash",
  ],
  ["ShiftLeft", "ControlLeft", "Space"],
];

// 3. Music Playlist
export const MUSIC_LIST = [
  "/sound/Always.mp3",
  "/sound/Anglebaby.mp3",
  "/sound/Dj.mp3",
  "/sound/HtetYan.mp3",
  "/sound/Kira.mp3",
  "/sound/Letter.mp3",
  "/sound/Raymond.mp3",
  "/sound/SaiHteeSai.mp3",
  "/sound/WinOo.mp3",
  "/sound/LinLin.mp3",
];

// --- HELPER: Build Reverse Map for Highlighting ---
export const buildCharToKeyMap = (): Record<string, CharKeyMapping[]> => {
  const map: Record<string, CharKeyMapping[]> = {};
  Object.keys(KEY_MAP).forEach((code) => {
    const entry = KEY_MAP[code];
    if (!entry) return;
    if (entry.base) {
      map[entry.base] = map[entry.base] || [];
      map[entry.base].push({ code, shift: false });
    }
    if (entry.shift) {
      map[entry.shift] = map[entry.shift] || [];
      map[entry.shift].push({ code, shift: true });
    }
    if (entry.alt) {
      map[entry.alt] = map[entry.alt] || [];
      map[entry.alt].push({ code, shift: false });
    }
  });
  return map;
};

export const CHAR_TO_KEYS = buildCharToKeyMap();

export const KEYBOARD_THEMES: Record<string, { bg: string; text: string }> = {
  blue: {
    bg: "bg-blue-200 dark:bg-blue-700",
    text: "text-black dark:text-white",
  },
  green: {
    bg: "bg-green-200 dark:bg-green-700",
    text: "text-black dark:text-white",
  },
  pink: {
    bg: "bg-pink-200 dark:bg-pink-700",
    text: "text-black dark:text-white",
  },
  yellow: {
    bg: "bg-yellow-200 dark:bg-yellow-700",
    text: "text-black dark:text-white",
  },
  purple: {
    bg: "bg-purple-300 dark:bg-purple-700",
    text: "text-black dark:text-white",
  },
};