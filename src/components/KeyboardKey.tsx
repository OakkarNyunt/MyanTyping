// components/KeyboardKey.tsx
import React from "react";
import clsx from "clsx";
import { KEY_MAP, KEYBOARD_THEMES } from "@/type";

interface KeyboardKeyProps {
  code: string;
  rowIndex: number;
  keyboardTheme: string;
  isPressed: boolean;
  isRequired: boolean;
  modifierState: { Shift: boolean; Control: boolean; Alt: boolean };
  onClick: (code: string) => void;
}

const keyLabel = (code: string) => {
  const e = KEY_MAP[code];
  if (!e) return { upper: "", middle: code, lower: "" };
  return {
    upper: e.shift || "",
    middle: e.label || "",
    lower: e.base || "",
  };
};

const KeyboardKey: React.FC<KeyboardKeyProps> = ({
  code,
  rowIndex,
  keyboardTheme,
  isPressed,
  isRequired,
  modifierState,
  onClick,
}) => {
  const keyClasses = () => {
    let base =
      "flex flex-col items-center justify-center select-none transition-all duration-150 shadow-md border rounded-xl cursor-pointer";

    // Dimensions based on key type - Use responsive utility classes
    const height = rowIndex === 0 ? "h-12" : "h-14";
    let widthClass = "w-6 md:w-14 lg:w-20 flex-shrink-0";

    if (code === "Space") {
      widthClass = "lg:min-w-120 md:min-w-80 min-w-60 h-16 text-lg";
    } else if (code.startsWith("Shift")) {
      widthClass = " w-10 md:w-16";
    } else if (code.startsWith("Control") || code.startsWith("Alt")) {
      widthClass = "w-10 md:w-16";
    }

    // Apply base styles and dimensions
    base += ` ${height} ${widthClass} px-1 md:px-3 py-1`;

    const theme = KEYBOARD_THEMES[keyboardTheme] || KEYBOARD_THEMES.blue;
    base += ` ${theme.bg} ${theme.text}`;
    base += " border-gray-400 dark:border-gray-700";

    // Dynamic states
    if (isPressed) {
      base +=
        " translate-y-[2px] shadow-inner shadow-black bg-opacity-90 ring-2 ring-blue-500";
    } else if (isRequired) {
      // Highlight Logic for next required key
      if (code.startsWith("Shift")) {
        base +=
          " bg-red-500 text-white animate-pulse ring-4 ring-red-300 dark:ring-red-900";
      } else {
        base +=
          " ring-4 ring-red-500 shadow-lg shadow-green-400/50 scale-105 z-10 font-bold";
      }
    } else if (
      (code.startsWith("Shift")) &&
      modifierState.Shift
    ) {
      // Show Shift key as pressed if the modifier is active
      base += " bg-gray-400 dark:bg-gray-600 text-white shadow-inner";
    }

    base += " hover:brightness-105";
    return base;
  };

  const label = keyLabel(code);

  return (
    <div
      onMouseDown={(e) => {
        e.preventDefault();
        onClick(code);
      }}
      onTouchStart={(e) => {
        e.preventDefault();
        onClick(code);
      }}
      className={clsx(keyClasses())}
    >
      <div className="flex flex-col items-center justify-center h-full w-full p-3 pointer-events-none">
        <div className="text-[12px]">{label.upper}</div>
        <div className="text-xs font-bold">{label.middle}</div>
        <div className="text-[12px]">{label.lower}</div>
      </div>
    </div>
  );
};

export default KeyboardKey;