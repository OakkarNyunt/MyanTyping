import React, { useState, useEffect, useRef } from "react";
// import { Button} from "./components/ui/button";

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
// import { Card } from "./components/ui/card";
// import { Card } from "./components/ui/card";

interface Lessons {
  [level: string]: { [lesson: string]: string[] };
}

// Local Button component to avoid build failure if the external file is missing.
// This preserves the original API (className, onClick, children) so nothing else needs to change.
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

  useEffect(() => {
    // safe audio init
    try {
      wrongSoundRef.current = new Audio("/wrong.mp3");
    } catch (e) {
      wrongSoundRef.current = null;
    }
  }, []);

  // Load lessons.json once
  useEffect(() => {
    fetch("/lessons.json")
      .then((res) => res.json())
      .then((data) => setLessons(data))
      .catch(() => console.error("Failed to load lessons.json"));
  }, []);

  // When level changes → reset lesson to lesson1 (safe)
  useEffect(() => {
    if (!lessons[level]) return;

    const firstLesson = Object.keys(lessons[level])[0] || "lesson1";

    setSelectedLesson(firstLesson);
    setCurrentIndex(0);
    setInput("");

    setCurrentList(lessons[level][firstLesson] || []);
  }, [level, lessons]);

  // When selected lesson changes → load lesson text
  useEffect(() => {
    if (!lessons[level]) return;

    const list = lessons[level][selectedLesson] || [];

    setCurrentList(list);
    setCurrentIndex(0);
    setInput("");
    setModalOpen(false);
  }, [selectedLesson, level, lessons]);

  const currentText = currentList[currentIndex] || "";

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);

    // only compare when there is something to compare against
    if (value.length > 0 && currentText.length >= value.length) {
      if (value[value.length - 1] !== currentText[value.length - 1]) {
        setShake(true);
        wrongSoundRef.current?.play();
        setTimeout(() => setShake(false), 150);
      }
    }

    if (value === currentText && currentText !== "") {
      setTimeout(() => {
        setInput("");

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

  return (
    <div
      className={clsx(
        "min-h-screen flex justify-center items-center",
        dark ? "bg-black text-white" : "bg-gray-100 text-black"
      )}
    >
      {/* content */}

      <div className="lg:min-w-2xl md:min-w-xl sm:min-w-sm w-full p-6 container mx-auto">
        {/* Title */}
        <div className="">
          <p className="lg:text-3xl text-xl font-bold mb-4 text-center">
            Myanmar Easy Typing
          </p>
        </div>
        {/* Light & Dark Mode */}
        <div className="flex justify-end mb-4 mx-auto">
          <Button
            className="border rounded-md text-white"
            onClick={() => setDark(!dark)}
          >
            <div className="flex space-x-2">
              <div className="">{dark ? "☀️" : "🌙"}</div>
              <div className="">{dark ? "Light Mode" : "Dark Mode"}</div>
            </div>
          </Button>
        </div>
        {/* Light & Dark Mode */}

        <div className="text-center ">
          {/* Level & Lessons */}
          <div className="flex justify-center space-x-6 my-8">
            {/* Level Selector */}

            <Select
              value={level}
              onValueChange={(val: string) => setLevel(val)}
            >
              <SelectTrigger className="w-[230px] text-white">
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

            {/* Lesson Selector */}

            <Select
              value={selectedLesson}
              onValueChange={(val: string) => setSelectedLesson(val)}
            >
              <SelectTrigger className="w-[230px] text-white text-xl">
                <SelectValue placeholder="Select Lesson" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Lesson</SelectLabel>
                  {Array.from({ length: 39 }, (_, i) => (
                    <SelectItem key={i} value={`lesson${i + 1}`}>
                      Lesson {i + 1}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/* Level & Lessons */}

          {/* Text & Input Box */}
          <div
            className={
              "text-3xl mb-10  font-bold leading-relaxed whitespace-pre-wrap transition-all " +
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

          {/* <div className="mt-4 text-gray-500 dark:text-gray-300">
            {currentIndex + 1} / {currentList.length}
          </div> */}

          {/* Text & Input Box */}

          {/* Dialog Box */}
          {modalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-80 text-center">
                <h2 className="text-black font-bold  text-2xl mb-4 ">
                  🎉 Lesson Completed!
                </h2>

                <button
                  className="w-full bg-blue-600 text-white p-3 rounded-lg mb-3"
                  onClick={() => {
                    setModalOpen(false);
                    setCurrentIndex(0);
                    setInput("");
                  }}
                >
                  Try Again
                </button>

                <button
                  className="w-full bg-green-600 text-white p-3 rounded-lg"
                  onClick={() => {
                    const levelLessons = Object.keys(lessons[level] || {});
                    const currentIdx = levelLessons.indexOf(selectedLesson);
                    const nextIdx = currentIdx + 1;

                    setModalOpen(false);

                    if (nextIdx < levelLessons.length) {
                      setSelectedLesson(levelLessons[nextIdx]);
                    }
                  }}
                >
                  Next Lesson →
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Dialog Box */}

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
      `}</style>
      </div>

      {/* content */}
    </div>
  );
};

export default MyanmarTyping;
