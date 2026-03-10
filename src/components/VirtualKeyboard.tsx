// components/VirtualKeyboard.tsx
import React, { useMemo, useState } from "react";
import { KEY_ROWS, KEYBOARD_THEMES, CHAR_TO_KEYS, E_VOWEL } from "@/type";
import KeyboardKey from "@/components/KeyboardKey";

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
  // lastPressedChar,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Calculate Active Keys for Highlighting
  const activeKeys = useMemo(() => {
    return computeNextKeyCodesForChar(nextChar);
  }, [nextChar]);

  return (
    <div className="mt-8 flex flex-col items-center w-full select-none">
      {/* Control Bar: Toggle Switch + Theme Selector */}
      <div className="mb-6 flex flex-wrap justify-center items-center gap-6 p-4 bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl">
        {/* Toggle Switch */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsVisible((v) => !v)}
            className={`w-12 h-6 rounded-full transition-all duration-300 ${
              isVisible ? "bg-green-500" : "bg-gray-400"
            }`}
          >
            <span
              className={`block w-5 h-5 bg-white rounded-full transition-transform ${isVisible ? "translate-x-6" : "translate-x-1"}`}
            />
          </button>
          <span className="text-sm font-semibold opacity-80">Keyboard</span>
        </div>

        {/* Theme Selector (Visible only when keyboard is ON) */}
        {isVisible && (
          <div className="flex gap-2">
            {Object.keys(KEYBOARD_THEMES).map((theme) => (
              <button
                key={theme}
                onClick={() => setKeyboardTheme(theme)}
                className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
                  keyboardTheme === theme ? "ring-2 ring-white scale-110" : ""
                } ${KEYBOARD_THEMES[theme].bg}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Keyboard UI Section */}
      {isVisible && (
        <div className="bg-white/10 dark:bg-black/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-2xl transition-all duration-300">
          <div className="flex flex-col gap-2">
            {KEY_ROWS.map((row, rIdx) => (
              <div key={rIdx} className="flex justify-center gap-1.5">
                {row.map((code) => (
                  <div
                    key={code}
                    className="transition-transform duration-100 active:scale-95"
                  >
                    <KeyboardKey
                      code={code}
                      rowIndex={rIdx}
                      keyboardTheme={keyboardTheme}
                      isPressed={!!pressedPhysical[code]}
                      isRequired={activeKeys.has(code)}
                      modifierState={modifierState}
                      onClick={handleVirtualKey}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualKeyboard;
