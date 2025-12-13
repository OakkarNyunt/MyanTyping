// components/VirtualKeyboard.tsx
import React, { useMemo } from "react";
import { KEY_ROWS, KEYBOARD_THEMES, CHAR_TO_KEYS, E_VOWEL } from "@/type";
import KeyboardKey from "./KeyboardKey";

interface VirtualKeyboardProps {
  keyboardTheme: string;
  setKeyboardTheme: (theme: string) => void;
  nextChar: string;
  pressedPhysical: Record<string, boolean>;
  modifierState: { Shift: boolean; Control: boolean; Alt: boolean };
  handleVirtualKey: (code: string) => void;
  lastPressedChar: string;
}

// Logic: Highlighting Helper (Moved from main component)
const computeNextKeyCodesForChar = (ch: string): Set<string> => {
  const out = new Set<string>();
  if (!ch) return out;

  // SPECIAL FIX: If character is E vowel (any form), return KeyA
  if (ch === E_VOWEL || ch === "\u1031" || ch.includes("\u1031")) {
    out.add("KeyA");
    return out;
  }

  const candidates = CHAR_TO_KEYS[ch] || [];

  if (candidates.length > 0) {
    const candidate = candidates[0];
    out.add(candidate.code);
    if (candidate.shift) {
      out.add("ShiftLeft");
      out.add("ShiftRight");
    }
  }
  return out;
};

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  keyboardTheme,
  setKeyboardTheme,
  nextChar,
  pressedPhysical,
  modifierState,
  handleVirtualKey,
  lastPressedChar,
}) => {
  // Calculate Active Keys for Highlighting
  const activeKeys = useMemo(() => {
    return computeNextKeyCodesForChar(nextChar);
  }, [nextChar]);

  return (
    <div className="mt-4 flex flex-col items-center space-y-2 select-none">
      {/* Theme Selector */}
      <div className="flex justify-center space-x-2 my-4">
        {Object.keys(KEYBOARD_THEMES).map((theme) => (
          <span
            key={theme}
            onClick={() => setKeyboardTheme(theme)}
            className={`w-8 h-8 rounded-full border-2 cursor-pointer ${
              keyboardTheme === theme ? "ring-2 ring-black dark:ring-white" : ""
            } ${KEYBOARD_THEMES[theme].bg}`}
            aria-label={`${theme} keyboard theme`}
          />
        ))}
      </div>

      {/* Keyboard UI Rows */}
      {KEY_ROWS.map((row, rIdx) => (
        <div
          key={rIdx}
          className="flex items-center justify-center space-x-2 mb-2"
        >
          {row.map((code) => (
            <KeyboardKey
              key={code}
              code={code}
              rowIndex={rIdx}
              keyboardTheme={keyboardTheme}
              isPressed={!!pressedPhysical[code]}
              isRequired={activeKeys.has(code)}
              modifierState={modifierState}
              onClick={handleVirtualKey}
            />
          ))}
        </div>
      ))}

      <div className="mt-2 text-sm opacity-75">
        <span className="inline-block px-2">
          Next key → <strong>{nextChar || "—"}</strong>
        </span>
        <span className="inline-block px-2">
          Last pressed → <strong>{lastPressedChar || "—"}</strong>
        </span>
      </div>
    </div>
  );
};

export default VirtualKeyboard;
