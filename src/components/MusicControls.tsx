// components/MusicControls.tsx
import React from "react";
import Button from "@/components/LocalButton";

interface MusicControlsProps {
  isMusicPlaying: boolean;
  toggleMusic: () => void;
  volume: number;
  setVolume: (volume: number) => void;
}

const MusicControls: React.FC<MusicControlsProps> = ({
  isMusicPlaying,
  toggleMusic,
  volume,
  setVolume,
}) => {
  return (
    <div className="flex items-center justify-center space-x-4 my-2">
      <Button onClick={toggleMusic} className="px-4 py-2 text-blue-600">
        {isMusicPlaying ? "⏸️ Pause" : "▶️ Play"}
      </Button>
      <div className="flex items-center justify-center space-x-4">
        <label className="text-sm font-medium dark:text-gray-300">Volume</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-40"
        />
        <span className="text-sm dark:text-gray-300">
          {Math.round(volume * 100)}%
        </span>
      </div>
    </div>
  );
};

export default MusicControls;
