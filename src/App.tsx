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

interface Lessons {
  [key: string]: string[];
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
  // const [selectedLesson, setSelectedLesson] = useState("lesson1");

  useEffect(() => {
    fetch("/lessons.json")
      .then((res) => res.json())
      .then((data) => {
        setLessons(data);
        setCurrentList(data[level]?.[selectedLesson] || []);
      })
      .catch((err) => console.error("Failed to load lessons.json", err));
  }, [level, selectedLesson]);

  useEffect(() => {
    if (lessons[selectedLesson]) {
      setCurrentList(lessons[selectedLesson]);
      setCurrentIndex(0);
      setInput("");
      setModalOpen(false);
    }
  }, [selectedLesson, lessons]);

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
        "min-h-screen w-full flex items-center justify-center",
        dark ? "bg-gray-900 text-white" : "bg-white text-black"
      )}
    >
      {/* content */}

      <div className="p-6 rounded-2xl shadow-lg">
        <div className="flex justify-end">
          <Button
            className=" py-4 border rounded-md text-white"
            onClick={() => setDark(!dark)}
          >
            {dark ? "Light Mode" : "Dark Mode"}
          </Button>
        </div>
        <div className="text-center w-full">
          <div className="">
            <h1 className="text-3xl font-bold my-8 text-center border p-6 rounded-4xl border-amber-200">
              Myanmar Easy Typing
            </h1>
          </div>

          <div className="flex space-x-6 mb-8">
            {/* Level Selector */}

            <Select
              value={level}
              onValueChange={(val: string) => setLevel(val)}
            >
              <SelectTrigger className="w-[180px] text-white text-xl">
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
              <SelectTrigger className="w-[180px] text-white text-xl">
                <SelectValue placeholder="Select Lesson" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Lesson</SelectLabel>
                  {Array.from({ length: 36 }, (_, i) => (
                    <SelectItem key={i} value={`lesson${i + 1}`}>
                      Lesson {i + 1}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full p-3 border rounded-lg text-lg mb-4"
          >
            <option value="basic">Basic</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select> */}

          {/* Lesson Selector */}

          {/* <select
            value={selectedLesson}
            onChange={(e) => setSelectedLesson(e.target.value)}
            className="w-full p-3 border rounded-lg text-lg mb-6 dark:bg-gray-800"
          >
            {Array.from({ length: 36 }, (_, i) => (
              <option key={i} value={`lesson${i + 1}`}>
                Lesson {i + 1}
              </option>
            ))}
          </select> */}

          <div
            className={
              "text-3xl mb-10 leading-relaxed whitespace-pre-wrap transition-all " +
              (shake ? "animate-shake" : "")
            }
          >
            {renderHighlighted()}
          </div>

          <textarea
            value={input}
            onChange={handleChange}
            rows={4}
            placeholder="Start typing here..."
            className="w-full p-4 border rounded-lg text-lg dark:bg-gray-800"
          />

          <div className="mt-4 text-gray-500 dark:text-gray-300">
            {currentIndex + 1} / {currentList.length}
          </div>

          {modalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-80 text-center">
                <h2 className="text-2xl font-bold mb-4">
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
                    const keys = Object.keys(lessons);
                    const nextIndex = keys.indexOf(selectedLesson) + 1;

                    setModalOpen(false);

                    if (nextIndex < keys.length) {
                      setSelectedLesson(keys[nextIndex]);
                    }
                  }}
                >
                  Next Lesson →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* content */}

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
  );
};

export default MyanmarTyping;
