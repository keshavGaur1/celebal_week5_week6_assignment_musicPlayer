import React, { useState } from "react";

const PlayerControls = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="player-controls">
      <button onClick={() => console.log("Previous track")}>⏮</button>
      <button className="play" onClick={handlePlayPause}>
        {isPlaying ? "⏸" : "▶"}
      </button>
      <button onClick={() => console.log("Next track")}>⏭</button>
    </div>
  );
};

export default PlayerControls;
