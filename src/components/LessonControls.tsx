// components/LessonControls.tsx
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Button from "./LocalButton";
// Keep this import if it's from your project
import type { Lessons } from "@/type";
import clsx from "clsx";

interface LessonControlsProps {
  lessons: Lessons;
  level: string;
  setLevel: (level: string) => void;
  selectedLesson: string;
  setSelectedLesson: (lesson: string) => void;
  time: number;
  dark: boolean;
  setDark: (dark: boolean) => void;
  // Music props are moved to MusicControls, but needed for the dropdown
  MUSIC_LIST: string[];
  currentTrack: number;
  setCurrentTrack: (track: number) => void;
}

const LessonControls: React.FC<LessonControlsProps> = ({
  lessons,
  level,
  setLevel,
  selectedLesson,
  setSelectedLesson,
  time,
  dark,
  setDark,
  MUSIC_LIST,
  currentTrack,
  setCurrentTrack,
}) => {
  const lessonAvailable = () => !!lessons[level];
  const sortedLessons = () =>
    Object.keys(lessons[level] || {}).sort(
      (a, b) =>
        Number(a.replace("lesson", "")) - Number(b.replace("lesson", ""))
    );

  return (
    <div className="text-center">
      {/* Timer, Dark Mode, About Us */}
      <div className="text-xl flex items-center justify-center space-x-4 mb-4">
        {/* ⏱️ 1. TIMER DISPLAY: Cleaner, dynamically colored border */}
        <div
          className={clsx(
            "rounded-lg p-2 font-mono text-xl font-bold transition-colors duration-300",
            dark
              ? "bg-gray-700 border-2 border-lime-400 text-lime-400"
              : "bg-white border-2 border-blue-600 text-blue-600"
          )}
        >
          <span>⏱️ </span>
          <span>
            {String(Math.floor(time / 60)).padStart(2, "0")}:
            {String(time % 60).padStart(2, "0")}
          </span>
        </div>

        {/* 🌙☀️ 2. DARK/LIGHT MODE TOGGLE: Enhanced Button */}
        <div>
          <Button
            onClick={() => setDark(!dark)}
            className={clsx(
              "rounded-lg p-2 font-semibold transition-all duration-300 shadow-md",
              dark
                ? "bg-gray-700 text-yellow-300 hover:bg-gray-600 hover:shadow-lg"
                : "bg-blue-100 text-blue-800 hover:bg-blue-200 hover:shadow-lg"
            )}
          >
            <div className="flex items-center space-x-2">
              <div>{dark ? "☀️" : "🌙"}</div>
              {/* Made the text more descriptive */}
              <div className="hidden sm:inline">
                {dark ? "Light Mode" : "Dark Mode"}
              </div>
            </div>
          </Button>
        </div>
      </div>

      {/* Selectors */}
      <div className="flex justify-center items-center flex-wrap gap-4">
        {/* LEVEL SELECT */}
        <Select value={level} onValueChange={setLevel}>
          <SelectTrigger className="w-35 text-blue-600">
            <SelectValue placeholder="Select Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup className="text-gray-500">
              <SelectLabel>Level</SelectLabel>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* LESSON SELECT */}
        <Select value={selectedLesson} onValueChange={setSelectedLesson}>
          <SelectTrigger className="w-30 text-blue-600">
            <SelectValue placeholder="Select Lesson" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup className="text-gray-500">
              <SelectLabel>Lesson</SelectLabel>
              {lessonAvailable() &&
                sortedLessons().map((lesson) => (
                  <SelectItem key={lesson} value={lesson}>
                    {lesson.replace("lesson", "Lesson ")}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* MUSIC SELECT */}
        <Select
          value={String(currentTrack)}
          onValueChange={(v) => setCurrentTrack(Number(v))}
        >
          <SelectTrigger className="w-32.5 text-blue-600">
            <SelectValue placeholder="Select Music" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup className="text-gray-500">
              <SelectLabel>Music</SelectLabel>
              {MUSIC_LIST.map((_, idx) => (
                <SelectItem value={String(idx)} key={idx}>
                  Music {idx + 1}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LessonControls;
