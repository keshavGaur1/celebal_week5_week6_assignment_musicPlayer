import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";

const PlayerContext = createContext();

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [currentPlaylist, setCurrentPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState("none"); // none, one, all
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(new Audio());
  const [shuffledPlaylist, setShuffledPlaylist] = useState([]);

  useEffect(() => {
    const audio = audioRef.current;

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleSongEnd);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleSongEnd);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (isShuffled && currentPlaylist.length > 0) {
      const shuffled = [...currentPlaylist].sort(() => Math.random() - 0.5);
      setShuffledPlaylist(shuffled);
    }
  }, [isShuffled, currentPlaylist]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    setProgress(audio.currentTime);
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    setDuration(audio.duration);
  };

  const handleSongEnd = () => {
    if (repeatMode === "one") {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      playNext();
    }
  };

  const handleError = (error) => {
    console.error("Audio playback error:", error);
    playNext();
  };

  const playSong = (song, playlist = [], index = 0) => {
    setCurrentSong(song);
    setCurrentPlaylist(playlist);
    setCurrentIndex(index);

    if (song && song.audioUrl) {
      audioRef.current.src = song.audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const playNext = () => {
    const playlist = isShuffled ? shuffledPlaylist : currentPlaylist;
    if (playlist.length === 0) return;

    let nextIndex = currentIndex + 1;
    if (nextIndex >= playlist.length) {
      if (repeatMode === "all") {
        nextIndex = 0;
      } else {
        setIsPlaying(false);
        return;
      }
    }

    const nextSong = playlist[nextIndex];
    playSong(nextSong, currentPlaylist, nextIndex);
  };

  const playPrevious = () => {
    const playlist = isShuffled ? shuffledPlaylist : currentPlaylist;
    if (playlist.length === 0) return;

    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      if (repeatMode === "all") {
        prevIndex = playlist.length - 1;
      } else {
        return;
      }
    }

    const prevSong = playlist[prevIndex];
    playSong(prevSong, currentPlaylist, prevIndex);
  };

  const togglePlay = () => {
    if (!currentSong) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
    setCurrentSong(null); // remove the player instantly
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    const modes = ["none", "all", "one"];
    const currentModeIndex = modes.indexOf(repeatMode);
    const nextModeIndex = (currentModeIndex + 1) % modes.length;
    setRepeatMode(modes[nextModeIndex]);
  };

  const seekTo = (time) => {
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  const setVolumeLevel = (level) => {
    setVolume(level);
  };

  const value = {
    currentSong,
    currentPlaylist,
    currentIndex,
    isPlaying,
    isShuffled,
    repeatMode,
    volume,
    progress,
    duration,
    playSong,
    playNext,
    playPrevious,
    togglePlay,
    toggleShuffle,
    toggleRepeat,
    seekTo,
    setVolumeLevel,
    pause, // add pause to context
  };

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};
