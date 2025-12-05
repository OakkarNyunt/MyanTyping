import React, { useState, useEffect, useRef } from "react";

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
  const [lessons, setLessons] = useState<Lessons>({});
  const [selectedLesson, setSelectedLesson] = useState("lesson1");
  const [currentList, setCurrentList] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [dark, setDark] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [shake, setShake] = useState(false);
  const [level, setLevel] = useState("basic");
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null);

  // ------------------ TIMER ------------------
  const [time, setTime] = useState(0); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  const resetTimer = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
    setTime(0);
  };
  // -------------------------------------------

  useEffect(() => {
    try {
      wrongSoundRef.current = new Audio("/wrong.mp3");
    } catch {
      wrongSoundRef.current = null;
    }
  }, []);

  useEffect(() => {
    fetch("/lessons.json")
      .then((res) => res.json())
      .then((data) => setLessons(data))
      .catch(() => console.error("Failed to load lessons.json"));
  }, []);

  // Cleanup timer when unmounting
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Register service worker for PWA (if exists)
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      // Register on mount, ignore errors — it's optional
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((reg) => {
          // optionally listen for updates
          // console.log("SW registered", reg);
        })
        .catch(() => {
          // console.warn("SW registration failed (okay for dev)");
        });
    }
  }, []);

  // When level changes
  useEffect(() => {
    if (!lessonAvailable()) return;

    const firstLesson = sortedLessons()[0] || "lesson1";

    setSelectedLesson(firstLesson);
    setCurrentIndex(0);
    setInput("");

    setCurrentList(lessons[level][firstLesson] || []);

    resetTimer();
  }, [level, lessons]);

  // When lesson changes
  useEffect(() => {
    if (!lessonAvailable()) return;

    const list = lessons[level][selectedLesson] || [];

    setCurrentList(list);
    setCurrentIndex(0);
    setInput("");
    setModalOpen(false);
    resetTimer();
  }, [selectedLesson, level, lessons]);

  const lessonAvailable = () => !!lessons[level];
  const sortedLessons = () =>
    Object.keys(lessons[level] || {}).sort(
      (a, b) =>
        Number(a.replace("lesson", "")) - Number(b.replace("lesson", ""))
    );

  const currentText = currentList[currentIndex] || "";

  // Keyboard state helpers
  const lastPressedChar = input.length > 0 ? input[input.length - 1] : "";
  const nextChar = currentText[input.length] || "";

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    // START TIMER ON FIRST TYPE
    if (!isRunning && currentText.length > 0 && value.length > 0) {
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    }

    setInput(value);

    // Wrong character alert
    if (value.length > 0 && currentText.length >= value.length) {
      if (value[value.length - 1] !== currentText[value.length - 1]) {
        setShake(true);
        wrongSoundRef.current?.play();
        setTimeout(() => setShake(false), 150);
      }
    }

    // Completed current text
    if (value === currentText && currentText !== "") {
      setTimeout(() => {
        setInput("");

        resetTimer();

        if (currentIndex + 1 < currentList.length) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setModalOpen(true);
        }
      }, 300);
    }
  };

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

  // --- On-screen Burmese keyboard layout (rows)
  const keyboardRows: string[][] = [
    ["က", "ခ", "ဂ", "ဃ", "င", "စ", "ဆ", "ဇ", "ဈ"],
    ["ဋ", "ဌ", "ဍ", "ဎ", "ဏ", "တ", "ထ", "ဒ", "ဓ"],
    ["န", "ပ", "ဖ", "ဗ", "ဘ", "မ", "ယ", "ရ", "လ"],
    ["ဝ", "သ", "ဟ", "ဠ", "အ", "ါ", "ာ", "ိ", "ီ"],
    ["့", "း", "္", "၊", "။", " ", "0", "1", "2"],
  ];

  // Determine classes for each key:
  const getKeyClass = (keyChar: string) => {
    const base =
      "px-3 py-2 rounded-md border select-none inline-flex items-center justify-center text-lg";
    const classes = [base];

    // Next char hint
    if (nextChar && keyChar === nextChar) {
      classes.push("bg-yellow-200 ring-2 ring-yellow-400");
    }

    // Correctly typed occurrences: if any position in currentText matched and user typed that char at same position
    // For simplicity: if lastPressedChar equals this key and it was correct, mark green; if wrong, red.
    if (lastPressedChar && keyChar === lastPressedChar) {
      const pos = input.length - 1;
      const wasCorrect = currentText[pos] === lastPressedChar;
      if (wasCorrect) classes.push("bg-green-200");
      else classes.push("bg-red-200");
      classes.push("ring-1");
    }

    // Also highlight keys that appear in already-correctly-typed input (green)
    // If any position in input matched char and equals keyChar, mark subtle green
    if (
      input
        .split("")
        .some((ch, idx) => ch === keyChar && currentText[idx] === ch)
    ) {
      classes.push("opacity-95");
    }

    // Space key styling
    if (keyChar === " ") classes.push("w-32");

    return classes.join(" ");
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
          Myanmar Easy Typing
        </p>

        {/* TIMER */}
        <div className="text-center text-xl flex items-center justify-center space-x-2 my-4">
          <div className="rounded-2xl p-2 space-x-4 border-2 border-green-500">
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
          <div className="flex justify-center space-x-6 my-8">
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

            {/* LESSON SELECT — ONLY JSON LESSONS */}
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

          <div
            className={
              "text-3xl mb-6 font-bold leading-relaxed whitespace-pre-wrap transition-all " +
              (shake ? "animate-shake" : "")
            }
          >
            {renderHighlighted()}
          </div>

          <textarea
            value={input}
            onChange={handleChange}
            rows={3}
            placeholder="ဒီနေရာမှ စတင်ရိုက်ပါ........"
            className="w-8/12 p-4 border rounded-lg text-lg"
          />

          {/* On-screen Keyboard */}
          <div className="mt-6 flex flex-col items-center space-y-2 select-none">
            {keyboardRows.map((row, rIdx) => (
              <div
                key={rIdx}
                className="flex items-center justify-center space-x-2"
              >
                {row.map((keyChar) => (
                  <div key={keyChar} className={getKeyClass(keyChar)}>
                    {keyChar === " " ? (
                      <span>Space</span>
                    ) : (
                      <span>{keyChar}</span>
                    )}
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
        </div>

        <style>{`
        .animate-shake {
          animation: shake 0.15s linear;
        }
        @keyframes shake {
          0% { transform: translateX(0px); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
          100% { transform: translateX(0px); }
        }

        /* small keyboard tweak */
        .keyboard .key { min-width: 40px; }
      `}</style>
      </div>
    </div>
  );
};

export default MyanmarTyping;
