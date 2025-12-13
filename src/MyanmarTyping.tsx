// MyanmarTyping.tsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import clsx from "clsx";

// Import types, constants, and helpers
import {
  type Lessons,
  KEY_MAP,
  MUSIC_LIST,
  E_VOWEL,
  // CHAR_TO_KEYS,
} from "@/type";

// Import child components
import LessonControls from "./components/LessonControls";
import MusicControls from "./components/MusicControls";
import TargetDisplay from "./components/TargetDisplay";
import VirtualKeyboard from "./components/VirtualKeyboard";
import Button from "./components/LocalButton"; // Assuming you update LocalButton.tsx to export default Button
import AboutDialog from "./components/AboutUs";
import ProgressBar from "./components/ProgressBar";

// import backgroundImage from "@/assets/image/background.jpg";

// --- HELPER: Logic for next required character (Moved from inline to be a proper helper) ---

const computeNextRequiredChar = (target: string, input: string): string => {
  if (!target) return "";
  const L = input.length;

  // Pattern: [C, E_VOWEL, ...rest] - This is the visual form (e.g., 'ကေ')
  const isEPattern =
    target.length >= 2 &&
    target[1] === E_VOWEL &&
    target[0] !== " " &&
    target[0] !== E_VOWEL;

  if (!isEPattern) {
    // Normal: follow visual order
    return target[L] ?? "";
  }

  // Typing order for E-pattern (e.g., for 'ကေ' the order is 'ေ' then 'က'):
  // 1. E vowel (input length 0)
  if (L === 0) return E_VOWEL;

  // 2. Consonant (input length 1)
  if (L === 1) {
    if (input[0] === E_VOWEL) return target[0];
    return ""; // user typed something wrong first
  }

  // 3. Remaining signs (input length 2+)
  // The remaining text starts at target index 2.
  const restIndex = L - 2;
  return target[2 + restIndex] ?? "";
};

// --- COMPONENT START ---
const MyanmarTyping: React.FC = () => {
  // -- Core lesson state
  const [lessons, setLessons] = useState<Lessons>({});
  const [level, setLevel] = useState("basic");
  const [selectedLesson, setSelectedLesson] = useState("lesson1");
  const [currentList, setCurrentList] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [dark, setDark] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false); // About Modal
  const [shake, setShake] = useState(false);

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
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Track last pressed char
  const [lastPressedChar, setLastPressedChar] = useState("");

  // -- Keyboard Themes --
  const [keyboardTheme, setKeyboardTheme] = useState("blue");

  // --- Logic: Current Target Text & Next Char ---
  const currentText = (currentList[currentIndex] || "") as string;
  const nextChar = useMemo(
    () => computeNextRequiredChar(currentText, input),
    [currentText, input]
  );

  // Progress calculation (correct chars only)
  const correctCharCount = useMemo(() => {
    let count = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === currentText[i]) count++;
      else break; // stop on first mistake (RapidTyping behavior)
    }
    return count;
  }, [input, currentText]);

  const totalChars = currentText.length;

  // --- MUSIC SYSTEM STATE & LOGIC ---
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicEnabledByUser, setMusicEnabledByUser] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.7);

  // Init Audio
  useEffect(() => {
    const audio = new Audio(MUSIC_LIST[currentTrack]);
    audio.volume = volume;
    audio.loop = false;
    const handleEnded = () => {
      setCurrentTrack((prev) => (prev + 1) % MUSIC_LIST.length);
    };
    audio.addEventListener("ended", handleEnded);
    musicRef.current = audio;
    return () => {
      audio.pause();
      audio.removeEventListener("ended", handleEnded);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Volume Change
  useEffect(() => {
    if (musicRef.current) musicRef.current.volume = volume;
  }, [volume]);

  // Track Change
  useEffect(() => {
    if (!musicRef.current) return;
    const audio = musicRef.current;
    const wasPlaying = isMusicPlaying;
    audio.pause();
    audio.src = MUSIC_LIST[currentTrack];
    audio.load();
    if (wasPlaying) {
      audio.play().catch(() => setIsMusicPlaying(false));
    }
  }, [currentTrack]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleMusic = () => {
    if (!musicEnabledByUser) setMusicEnabledByUser(true);
    if (isMusicPlaying) {
      musicRef.current?.pause();
      setIsMusicPlaying(false);
    } else {
      musicRef.current
        ?.play()
        .then(() => setIsMusicPlaying(true))
        .catch(() => {});
    }
  };

  // --- TIMER & LOAD LOGIC ---
  const resetTimer = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
    setTime(0);
  };

  // Fetch Lessons
  useEffect(() => {
    fetch("/lessons.json")
      .then((r) => r.json())
      .then((d) => setLessons(d))
      .catch(() => console.error("Failed to load lessons.json"));
  }, []);

  // Lesson Helpers (Moved back to main component scope)
  const lessonAvailable = () => !!lessons[level];
  const sortedLessons = useMemo(
    () =>
      Object.keys(lessons[level] || {}).sort(
        (a, b) =>
          Number(a.replace("lesson", "")) - Number(b.replace("lesson", ""))
      ),
    [level, lessons]
  );

  // Initialize Lesson
  useEffect(() => {
    if (!lessonAvailable()) return;
    const firstLesson = sortedLessons[0] || "lesson1";
    setSelectedLesson(firstLesson);
  }, [level, lessons, sortedLessons]);

  // Initialize List
  useEffect(() => {
    if (!lessonAvailable()) return;
    const list = lessons[level][selectedLesson] || [];
    setCurrentList(list);
    setCurrentIndex(0);
    setInput("");
    setModalOpen(false);
    resetTimer();
  }, [selectedLesson, level, lessons]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- INPUT PROCESSING ---
  const startTimerIfNeeded = (newInput: string) => {
    if (!isRunning && currentText.length > 0 && newInput.length > 0) {
      setIsRunning(true);
      timerRef.current = window.setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    }
  };

  const charForKey = (code: string, shift: boolean, alt: boolean) => {
    const entry = KEY_MAP[code];
    if (!entry) return "";
    if (alt && entry.alt) return entry.alt;
    if (shift && entry.shift) return entry.shift;
    return entry.base ?? "";
  };

  const processInput = (raw: string) => {
    let value = raw;

    // (1) Update Input and Timer
    setInput(value);
    startTimerIfNeeded(value);

    // (2) Shake on Error
    const pos = value.length - 1;
    if (pos >= 0 && currentText[pos] !== undefined) {
      if (value[pos] !== currentText[pos]) {
        setShake(true);
        setTimeout(() => setShake(false), 150);
      }
    }

    // (3) Completion Check
    if (value === currentText && currentText.length > 0) {
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

    setLastPressedChar(value.length ? value[value.length - 1] : "");
  };

  // --- KEYBOARD EVENT HANDLERS ---
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // 🔑 CRITICAL FIX: Explicitly focus the textarea on any key press
      // to ensure state updates and correct typing behavior.
      if (
        textareaRef.current &&
        document.activeElement !== textareaRef.current
      ) {
        textareaRef.current.focus();
      }

      setModifierState({
        Shift: e.shiftKey,
        Control: e.ctrlKey,
        Alt: e.altKey,
      });

      const code = e.code;
      setPressedPhysical((p) => ({ ...p, [code]: true }));

      const ch = charForKey(code, e.shiftKey, e.altKey);
      if (ch) {
        e.preventDefault();
        processInput(input + ch);
      } else {
        if (code === "Space") {
          e.preventDefault();
          processInput(input + " ");
        }
        if (code === "Backspace") {
          e.preventDefault();
          processInput(input.slice(0, -1));
        }
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
  }, [input, currentText, currentIndex, currentList, isRunning]); // eslint-disable-line react-hooks/exhaustive-deps

  // Virtual Key Click Handler (Passed to VirtualKeyboard)
  const handleVirtualKey = (code: string) => {
    const shift = modifierState.Shift;
    const ch = charForKey(code, shift, false);

    setPressedPhysical((p) => ({ ...p, [code]: true }));
    setTimeout(() => {
      setPressedPhysical((p) => ({ ...p, [code]: false }));
    }, 120);

    if (code.includes("Control")) {
      setModifierState((m) => ({ ...m, Control: !m.Control }));
      return;
    }
    if (code.includes("Shift")) {
      setModifierState((m) => ({ ...m, Shift: !m.Shift }));
      return;
    }
    if (code === "Space") {
      processInput(input + " ");
      return;
    }
    if (ch) {
      processInput(input + ch);
    }

    textareaRef.current?.focus();
  };

  // --- RENDER ---
  return (
    <div
      className={clsx(
        "min-h-screen flex justify-center items-center",
        "bg-cover bg-fixed bg-no-repeat",
        dark ? "bg-black text-white" : "bg-gray-100 text-black"
      )}
    >
      <div className="lg:min-w-2xl md:min-w-xl sm:min-w-sm w-full p-4 container mx-auto">
        {/* Title */}
        <p className="lg:text-3xl md:text-xl text-sm font-bold mb-4 text-center">
          Myanmar Easy Typing — Pyidaungsu
        </p>
        {/* Lesson & General Controls */}
        <LessonControls
          lessons={lessons}
          level={level}
          setLevel={setLevel}
          selectedLesson={selectedLesson}
          setSelectedLesson={setSelectedLesson}
          time={time}
          dark={dark}
          setDark={setDark}
          MUSIC_LIST={MUSIC_LIST}
          currentTrack={currentTrack}
          setCurrentTrack={setCurrentTrack}
        />
        <Button
          onClick={() => setAboutModalOpen(true)} // <-- Open dialog on click
          className={clsx(
            "text-sm px-3 py-1 rounded-full font-medium transition-colors",
            dark
              ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          )}
        >
          ℹ️ info
        </Button>
        {/* 2. ABOUT DIALOG COMPONENT */}
        <AboutDialog
          isOpen={aboutModalOpen}
          onClose={() => setAboutModalOpen(false)}
          dark={dark}
        />
        {/* Music Controls */}
        <MusicControls
          isMusicPlaying={isMusicPlaying}
          toggleMusic={toggleMusic}
          volume={volume}
          setVolume={setVolume}
        />
        <div className="">
          <div className="flex justify-center">
            {/* Target Text Display */}
            <TargetDisplay
              currentText={currentText}
              input={input}
              shake={shake}
            />
          </div>
          {/* Progress Bar */}
          <div className="w-7/12 lg:w-7/12 mx-auto">
            <ProgressBar
              current={correctCharCount}
              total={totalChars}
              dark={dark}
            />
          </div>

          <div className="flex justify-center">
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => processInput(e.target.value)}
              rows={2}
              placeholder="ဒီနေရာမှ စတင်ရိုက်ပါ........"
              className={`${
                dark ? "bg-gray-700 text-white" : "bg-white text-black"
              } w-7/12 lg:w-7/12 p-2 shadow-lg shadow-lime-300 border rounded-lg text-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500`}
              autoFocus // Added autoFocus for better UX
            />
          </div>
        </div>
        {/* Virtual Keyboard */}
        <VirtualKeyboard
          keyboardTheme={keyboardTheme}
          setKeyboardTheme={setKeyboardTheme}
          nextChar={nextChar}
          pressedPhysical={pressedPhysical}
          modifierState={modifierState}
          handleVirtualKey={handleVirtualKey}
          lastPressedChar={lastPressedChar}
        />
        <div className="flex justify-center items-center mt-2">
          <p
            className={`text-md lg:text-xl font-bold ${
              dark ? "text-white" : "text-black"
            }`}
          >
            Developed by Oakkar Nyunt
          </p>
        </div>
        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div
              className={`${
                dark ? "bg-gray-800" : "bg-white"
              } p-6 rounded-xl w-80 text-center shadow-2xl`}
            >
              <h2
                className={`${
                  dark ? "text-white" : "text-black"
                } font-bold text-2xl mb-4`}
              >
                🎉 Lesson Completed!
              </h2>

              <Button
                className="w-full p-3 rounded-lg mb-3 transition"
                onClick={() => {
                  setModalOpen(false);
                  setCurrentIndex(0);
                  setInput("");
                  resetTimer();
                }}
              >
                <span className="text-blue-600 font-bold">Try Again</span>
              </Button>

              <Button
                className="w-full p-3 rounded-lg transition"
                onClick={() => {
                  const levelLessons = sortedLessons;
                  const idx = levelLessons.indexOf(selectedLesson);
                  const next = levelLessons[idx + 1];
                  setModalOpen(false);
                  if (next) setSelectedLesson(next);
                }}
              >
                <span className="text-blue-600 font-bold">Next Lesson →</span>
              </Button>
            </div>
          </div>
        )}
        {/* CSS Animation for Shake */}
        <style>{`
          .animate-shake { animation: shake 0.15s linear; }
          @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
            100% { transform: translateX(0); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default MyanmarTyping;
