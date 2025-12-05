import React, { useEffect, useRef, useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import clsx from "clsx";

interface Lessons {
  [level: string]: { [lesson: string]: string[] };
}

// Local Button
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button type="button" className={className} {...props}>
      {children}
    </button>
  );
};

const MyanmarTyping: React.FC = () => {
  // -- Core lesson state
  const [lessons, setLessons] = useState<Lessons>({});
  const [selectedLesson, setSelectedLesson] = useState("lesson1");
  const [currentList, setCurrentList] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [dark, setDark] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [shake, setShake] = useState(false);
  const [level, setLevel] = useState("basic");
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null);

  // -- Timer
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  // -- Keyboard UI & keys
  const [pressedPhysical, setPressedPhysical] = useState<
    Record<string, boolean>
  >({});
  const [modifierState, setModifierState] = useState({
    Shift: false,
    Control: false,
    Alt: false,
  });

  // track last pressed char & next char
  const [lastPressedChar, setLastPressedChar] = useState("");
  const currentText = (currentList[currentIndex] || "") as string;
  const nextChar = currentText[input.length] || "";

  const resetTimer = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
    setTime(0);
  };

  useEffect(() => {
    try {
      wrongSoundRef.current = new Audio("/wrong.mp3");
    } catch {
      wrongSoundRef.current = null;
    }
  }, []);

  useEffect(() => {
    fetch("/lessons.json")
      .then((r) => r.json())
      .then((d) => setLessons(d))
      .catch(() => console.error("Failed to load lessons.json"));
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // PWA sw register (optional)
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js").catch(() => {
        /* ignore for dev */
      });
    }
  }, []);

  // lesson helpers
  const lessonAvailable = () => !!lessons[level];
  const sortedLessons = () =>
    Object.keys(lessons[level] || {}).sort(
      (a, b) =>
        Number(a.replace("lesson", "")) - Number(b.replace("lesson", ""))
    );

  useEffect(() => {
    if (!lessonAvailable()) return;
    const firstLesson = sortedLessons()[0] || "lesson1";
    setSelectedLesson(firstLesson);
    setCurrentIndex(0);
    setInput("");
    setCurrentList(lessons[level][firstLesson] || []);
    resetTimer();
  }, [level, lessons]);

  useEffect(() => {
    if (!lessonAvailable()) return;
    const list = lessons[level][selectedLesson] || [];
    setCurrentList(list);
    setCurrentIndex(0);
    setInput("");
    setModalOpen(false);
    resetTimer();
  }, [selectedLesson, level, lessons]);

  // ------------ PYIDAUNGSU KEY MAPPINGS ------------
  // Map physical key 'code' -> characters for base, shift and alt (Alt layer used as AltGr)
  // This mapping is a practical, broad mapping for Pyidaungsu. Extend as needed.
  const KEY_MAP: Record<
    string,
    { base?: string; shift?: string; alt?: string; label?: string }
  > = {
    Backquote: { base: "ေ", shift: "=", label: "`" }, // example
    Digit1: { base: "၁", shift: "!", label: "1" },
    Digit2: { base: "၂", shift: "@", label: "2" },
    Digit3: { base: "၃", shift: "#", label: "3" },
    Digit4: { base: "၄", shift: "$", label: "4" },
    Digit5: { base: "၅", shift: "%", label: "5" },
    Digit6: { base: "၆", shift: "^", label: "6" },
    Digit7: { base: "၇", shift: "&", label: "7" },
    Digit8: { base: "၈", shift: "*", label: "8" },
    Digit9: { base: "၉", shift: "(", label: "9" },
    Digit0: { base: "၀", shift: ")", label: "0" },
    Minus: { base: "-", shift: "_", label: "-" },
    Equal: { base: "=", shift: "+", label: "=" },

    KeyQ: { base: "ဆ", shift: "ဈ", label: "Q" }, // some punctuation examples
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

    KeyA: { base: "‌ေ", shift: "ဗ", label: "A" },
    KeyS: { base: "ျ", shift: "ှ", label: "S" },
    KeyD: { base: "ိ", shift: "ီ", label: "D" },
    KeyF: { base: "်", shift: "္", label: "F" },
    KeyG: { base: "ါ", shift: "ွ", label: "G" },
    KeyH: { base: "့", shift: "ံ", label: "H" },
    KeyJ: { base: "ြ", shift: "ဲ", label: "J" },
    KeyK: { base: "ု", shift: "ဒ", label: "K" },
    KeyL: { base: "ူ", shift: "ဓ", label: "L" },
    Semicolon: { base: "'", shift: '"', label: ";" },
    Quote: { base: "’", shift: '"', label: "'" },

    KeyZ: { base: "ဖ", shift: "ဇ", label: "Z" },
    KeyX: { base: "ထ", shift: "ဌ", label: "X" },
    KeyC: { base: "ဃ", shift: "ဃ", label: "C" },
    KeyV: { base: "လ", shift: "ဠ", label: "V" },
    KeyB: { base: "ဘ", shift: "ယ", label: "B" },
    KeyN: { base: "ဉ", shift: "ည", label: "N" },
    KeyM: { base: "ာ", shift: "ဦ", label: "M" },
    Comma: { base: ",", shift: "၊", label: "," },
    Period: { base: ".", shift: "။", label: "." },
    Slash: { base: "/", shift: "?", label: "/" },

    Space: { base: " ", shift: " ", label: "Space" },
    // Add more mappings if you need specific Alt layer characters.
  };

  // Keyboard visual layout using physical key codes in rows
  const KEY_ROWS: string[][] = [
    // Top number row
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
    // Q row
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
    // A row
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
    // Z row
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
    // Bottom row: single Ctrl + Space
    ["Control", "Space"],
  ];

  // Helper: get character for a key given modifiers
  const charForKey = (code: string, shift: boolean, alt: boolean) => {
    const entry = KEY_MAP[code];
    if (!entry) return "";
    if (alt && entry.alt) return entry.alt;
    if (shift && entry.shift) return entry.shift;
    return entry.base ?? "";
  };

  // ------------ Input / typing logic shared for physical & virtual typing ------------
  const startTimerIfNeeded = (newInput: string) => {
    if (!isRunning && currentText.length > 0 && newInput.length > 0) {
      setIsRunning(true);
      timerRef.current = window.setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    }
  };

  const processInput = (newInput: string) => {
    // Automatic reorder for 'ေ' + consonant
    if (
      newInput.length >= 2 &&
      newInput[newInput.length - 1] !== " " && // ignore spaces
      newInput[newInput.length - 1] !== "ေ" &&
      newInput[newInput.length - 2] === "‌ေ"
    ) {
      const lastChar = newInput[newInput.length - 1];
      const beforeE = newInput.slice(0, newInput.length - 2);
      newInput = beforeE + lastChar + "‌ေ"; // reorder
    }

    setInput(newInput);

    // start timer if needed
    startTimerIfNeeded(newInput);

    // wrong character check
    if (newInput.length > 0 && currentText.length >= newInput.length) {
      if (newInput[newInput.length - 1] !== currentText[newInput.length - 1]) {
        setShake(true);
        wrongSoundRef.current?.play();
        setTimeout(() => setShake(false), 150);
      }
    }

    // completion
    if (newInput === currentText && currentText !== "") {
      setTimeout(() => {
        setInput("");
        resetTimer();
        if (currentIndex + 1 < currentList.length) {
          setCurrentIndex((i) => i + 1);
        } else {
          setModalOpen(true);
        }
      }, 300);
    }

    // update last pressed char for UI
    setLastPressedChar(newInput.length ? newInput[newInput.length - 1] : "");
  };

  // Physical keyboard handlers
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Update modifier state
      setModifierState({
        Shift: e.shiftKey,
        Control: e.ctrlKey,
        Alt: e.altKey,
      });

      // highlight physical key by code
      const code = e.code;
      setPressedPhysical((p) => ({ ...p, [code]: true }));

      // If ctrl/alt pressed alone, don't insert char (but still highlight)
      // We'll allow modifiers + key combos to produce mapped characters.
      const ch = charForKey(code, e.shiftKey, e.altKey);
      if (ch) {
        // Prevent default to avoid native layout interference when inserting mapped unicode
        e.preventDefault();
        processInput(input + ch);
      } else {
        // If this is Space or Enter or other handled keys
        if (code === "Space") {
          e.preventDefault();
          processInput(input + " ");
        }
        if (code === "Backspace") {
          e.preventDefault();
          processInput(input.slice(0, -1));
        }
        // Allow other keys (arrows etc.)
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      setModifierState({
        Shift: e.shiftKey,
        Control: e.ctrlKey,
        Alt: e.altKey,
      });
      const code = e.code;
      setPressedPhysical((p) => ({ ...p, [code]: false }));
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, currentText, currentIndex, currentList, isRunning]);

  // Virtual key click (on-screen)
  const handleVirtualKey = (code: string) => {
    const shift = modifierState.Shift;
    const ch = charForKey(code, shift, false);

    setPressedPhysical((p) => ({ ...p, [code]: true }));
    setTimeout(() => {
      setPressedPhysical((p) => ({ ...p, [code]: false }));
    }, 120);

    if (code === "Control") {
      setModifierState((m) => ({ ...m, Control: !m.Control }));
      return;
    }

    if (code === "Space") {
      processInput(input + " ");
      return;
    }

    if (code === "ShiftLeft" || code === "ShiftRight") {
      setModifierState((m) => ({ ...m, Shift: !m.Shift }));
      return;
    }

    if (ch) {
      processInput(input + ch);
    }
  };

  // Render highlighted characters for target
  const renderHighlighted = () => {
    return currentText.split("").map((char, i) => {
      let style = "";

      if (i < input.length) {
        style =
          input[i] === char
            ? "text-green-500 font-bold"
            : "text-red-500 font-bold";
      }

      return (
        <span key={i} className={style}>
          {char}
        </span>
      );
    });
  };

  // get key display label and classes
  const keyLabel = (code: string) => {
    const e = KEY_MAP[code];
    if (!e) return { upper: "", middle: code, lower: "" };

    return {
      upper: e.shift || "",
      middle: e.label || "",
      lower: e.base || "",
    };
  };

  const keyClasses = (code: string, rowIndex: number) => {
    const pressed = !!pressedPhysical[code];
    const activeNext =
      code && charForKey(code, modifierState.Shift, false) === nextChar;

    // Base styles
    let base =
      "flex flex-col items-center justify-center select-none transition-all duration-150 shadow-md border rounded-xl";

    // Adjust key size per row (top row smaller)
    const height = rowIndex === 0 ? "h-12" : "h-14";
    const minWidth =
      code === "Space"
        ? "min-w-[60%]"
        : code === "ShiftLeft" || code === "ShiftRight" || code === "Control"
        ? "min-w-[60px]"
        : "min-w-[50px]"; // slightly bigger than before

    base += ` ${height} ${minWidth} px-3 py-1`;

    // Theme
    const theme = KEYBOARD_THEMES[keyboardTheme];
    base += ` ${theme.bg} ${theme.text}`;

    // Add subtle border gradient
    base += " border-gray-400 dark:border-gray-700";

    // Pressed state
    if (pressed) {
      base += " translate-y-[2px] shadow-inner shadow-black bg-opacity-90";
    }
    // Next key hint
    else if (activeNext) {
      base += " ring-2 ring-yellow-400";
    }

    // Modifier key
    if (code === "ShiftLeft" || code === "ShiftRight" || code === "Control") {
      base += " bg-gray-400 dark:bg-gray-600 text-white font-bold shadow-inner";
    }

    // Hover effect
    base += " hover:brightness-105 hover:scale-105";

    return base;
  };

  // textarea reference to focus
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Add this near your other state hooks
  const [keyboardTheme, setKeyboardTheme] = useState("blue");

  const KEYBOARD_THEMES: Record<string, { bg: string; text: string }> = {
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
      bg: "bg-purple-200 dark:bg-purple-700",
      text: "text-black dark:text-white",
    },
  };

  return (
    <div
      className={clsx(
        "min-h-screen flex justify-center items-center",
        dark ? "bg-black text-white" : "bg-gray-100 text-black"
      )}
    >
      <div className="lg:min-w-2xl md:min-w-xl sm:min-w-sm w-full p-6 container mx-auto">
        {/* Title */}
        <p className="lg:text-3xl text-xl font-bold mb-2 text-center">
          Myanmar Easy Typing — Pyidaungsu Keyboard
        </p>

        {/* TIMER */}
        <div className="text-center text-xl flex items-center justify-center space-x-2 my-4">
          <div className="rounded-2xl p-2 border-2 border-green-500">
            <span>⏱️</span>
            <span>
              {String(Math.floor(time / 60)).padStart(2, "0")}:
              {String(time % 60).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Light/Dark Mode */}
        <div className="flex justify-end mb-4 mx-auto">
          <Button
            className="border rounded-md text-white"
            onClick={() => setDark(!dark)}
          >
            <div className="flex space-x-2">
              <div>{dark ? "☀️" : "🌙"}</div>
              <div>{dark ? "Light Mode" : "Dark Mode"}</div>
            </div>
          </Button>
        </div>

        <div className="text-center">
          {/* Selectors */}
          <div className="flex justify-center space-x-6 my-6">
            {/* LEVEL SELECT */}
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="w-[230px]">
                <SelectValue placeholder="Select Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Level</SelectLabel>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* LESSON SELECT */}
            <Select value={selectedLesson} onValueChange={setSelectedLesson}>
              <SelectTrigger className="w-[230px] text-xl">
                <SelectValue placeholder="Select Lesson" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Lesson</SelectLabel>
                  {sortedLessons().map((lesson) => (
                    <SelectItem key={lesson} value={lesson}>
                      {lesson.replace("lesson", "Lesson ")}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Target text */}
          <div
            className={
              "text-3xl mb-6 font-bold leading-relaxed whitespace-pre-wrap transition-all " +
              (shake ? "animate-shake" : "")
            }
          >
            {renderHighlighted()}
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => processInput(e.target.value)}
            rows={3}
            placeholder="ဒီနေရာမှ စတင်ရိုက်ပါ........"
            className="w-8/12 p-4 border rounded-lg text-lg"
          />

          <div className="flex justify-center space-x-2 my-4">
            {Object.keys(KEYBOARD_THEMES).map((theme) => (
              <span
                key={theme}
                onClick={() => setKeyboardTheme(theme)}
                className={clsx(
                  "w-8 h-8 rounded-full border-2",
                  keyboardTheme === theme
                    ? "ring-2 ring-black dark:ring-white"
                    : "",
                  KEYBOARD_THEMES[theme].bg
                )}
                aria-label={`${theme} keyboard theme`}
              />
            ))}
          </div>

          {/* On-screen physical-style keyboard */}
          <div className="mt-6 flex flex-col items-center space-y-2 select-none">
            {/* Modifier indicators */}
            <div className="mb-2 text-sm">
              <span className="px-2">
                Shift: {modifierState.Shift ? "ON" : "OFF"}
              </span>
              <span className="px-2">
                Ctrl: {modifierState.Control ? "ON" : "OFF"}
              </span>
              <span className="px-2">
                Alt: {modifierState.Alt ? "ON" : "OFF"}
              </span>
            </div>

            {/* Rows */}
            {KEY_ROWS.map((row, rIdx) => (
              <div
                key={rIdx}
                className={`flex items-center justify-center space-x-2 mb-2`}
              >
                {row.map((code) => (
                  <div
                    key={code}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleVirtualKey(code);
                      textareaRef.current?.focus();
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      handleVirtualKey(code);
                      textareaRef.current?.focus();
                    }}
                    className={keyClasses(code, rIdx)}
                  >
                    <div className="flex flex-col items-center justify-center h-full w-full">
                      <div className="text-[12px]">{keyLabel(code).upper}</div>
                      <div className="text-xs font-semibold">
                        {keyLabel(code).middle}
                      </div>
                      <div className="text-[12px]">{keyLabel(code).lower}</div>
                    </div>
                  </div>
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

          {/* Modal */}
          {modalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-80 text-center">
                <h2 className="font-bold text-2xl mb-4">
                  🎉 Lesson Completed!
                </h2>

                <button
                  className="w-full bg-blue-600 p-3 rounded-lg mb-3"
                  onClick={() => {
                    setModalOpen(false);
                    setCurrentIndex(0);
                    setInput("");
                    resetTimer();
                  }}
                >
                  <span className="text-white font-bold">Try Again</span>
                </button>

                <button
                  className="w-full bg-green-600 p-3 rounded-lg"
                  onClick={() => {
                    const levelLessons = sortedLessons();
                    const idx = levelLessons.indexOf(selectedLesson);
                    const next = levelLessons[idx + 1];
                    setModalOpen(false);
                    if (next) setSelectedLesson(next);
                  }}
                >
                  <span className="text-white font-bold">Next Lesson →</span>
                </button>
              </div>
            </div>
          )}

          <style>{`
            .animate-shake { animation: shake 0.15s linear; }
            @keyframes shake {
              0% { transform: translateX(0px); }
              25% { transform: translateX(-5px); }
              50% { transform: translateX(5px); }
              75% { transform: translateX(-5px); }
              100% { transform: translateX(0px); }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default MyanmarTyping;
