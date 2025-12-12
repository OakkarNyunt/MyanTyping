// components/ProgressBar.tsx (Block Style)
import React from "react";
import clsx from "clsx";

interface ProgressBarProps {
  currentIndex: number;
  totalItems: number; // currentList.length
  dark: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentIndex,
  totalItems,
  dark,
}) => {
  if (totalItems === 0) return null; // <--- Crucial check

  // Create an array representing each block in the lesson (e.g., [0, 1, 2, 3...])
  const lessonBlocks = Array.from({ length: totalItems }, (_, i) => i);

  // Calculate overall progress percentage
  const progressPercent = Math.min(
    100,
    Math.round(((currentIndex) / totalItems) * 100)
  );

  return (
    <div className="w-full max-w-2xl mx-auto my-6 p-2 rounded-lg">
      
      {/* 📊 Progress Text */}
      <div className="flex justify-between mb-2">
        <span
          className={clsx(
            "text-sm font-semibold",
            dark ? "text-gray-300" : "text-gray-700"
          )}
        >
          Lesson Progress
        </span>
        <span className="text-sm font-bold text-blue-500">
          {progressPercent}% Complete ({currentIndex} / {totalItems})
        </span>
      </div>

      {/* 🧱 Block Bar Container */}
      <div
        className={clsx(
          "flex h-4 rounded-md overflow-hidden shadow-md border",
          dark ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-gray-200"
        )}
      >
        {lessonBlocks.map((blockIndex) => {
          let blockClass = "";
          
          if (blockIndex < currentIndex) {
            blockClass = "bg-green-500"; 
          } else if (blockIndex === currentIndex) {
            blockClass = "bg-yellow-500 animate-pulse";
          } else {
            blockClass = dark ? "bg-gray-600" : "bg-gray-400";
          }

          return (
            <div
              key={blockIndex}
              // Width calculated dynamically based on the number of blocks
              style={{ width: `${100 / totalItems}%` }}
              className={clsx("h-full transition-colors duration-300", blockClass)}
            />
          );
        })}
      </div>
      
    </div>
  );
};

export default ProgressBar;