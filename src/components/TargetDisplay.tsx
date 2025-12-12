// components/TargetDisplay.tsx
import React from "react";
import clsx from "clsx";

interface TargetDisplayProps {
  currentText: string;
  input: string;
  shake: boolean;
}

const TargetDisplay: React.FC<TargetDisplayProps> = ({
  currentText,
  input,
  shake,
}) => {
  // Render text highlighting
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
        "md:text-3xl text-xl mb-6 font-bold leading-relaxed whitespace-pre-wrap transition-all",
        shake ? "animate-shake" : ""
      )}
    >
      {currentText ? renderHighlighted() : "Loading lesson..."}
    </div>
  );
};

export default TargetDisplay;