import React from "react";
import clsx from "clsx";

interface ProgressBarProps {
  current: number;
  total: number;
  dark: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, dark }) => {
  const percent =
    total > 0 ? Math.min(Math.round((current / total) * 100), 100) : 0;

  return (
    <div className="mb-3">
      {/* Percentage Text */}
      <div
        className={clsx(
          "text-right text-sm font-bold mb-1",
          dark ? "text-gray-200" : "text-gray-700"
        )}
      >
        {percent}%
      </div>

      {/* Progress Bar */}
      <div
        className={clsx(
          "w-full h-3 rounded-full overflow-hidden",
          dark ? "bg-gray-700" : "bg-gray-300"
        )}
      >
        <div
          className={clsx(
            "h-full transition-all duration-200 ease-out",
            "bg-linear-to-r from-green-400 to-blue-500"
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
