import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { usePlayer } from "../context/PlayerContext";
import { mockAlbums, getSongsByAlbum } from "../data/mockData";
import "../App.css";

const AlbumPage = () => {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playSong, currentSong, isPlaying } = usePlayer();

  useEffect(() => {
    const fetchAlbumData = () => {
      setLoading(true);

      // Find album from mock data
      const foundAlbum = mockAlbums.find((a) => a.id === parseInt(albumId));

      if (foundAlbum) {
        setAlbum(foundAlbum);
        // Get songs for this album
        const albumSongs = getSongsByAlbum(parseInt(albumId));
        setSongs(albumSongs);
      }

      setLoading(false);
    };

    fetchAlbumData();
  }, [albumId]);

  const handleSongClick = (song) => {
    playSong(song);
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return <div className="loading">Loading album...</div>;
  }

  if (!album) {
    return <div className="error">Album not found</div>;
  }

  return (
    <div className="album-page">
      <div className="album-header">
        <div className="album-cover-large">
          <img
            src={album.coverUrl}
            alt={album.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-cover.png";
            }}
          />
        </div>
        <div className="album-info">
          <h1>{album.name}</h1>
          <p className="artist">{album.artist}</p>
          <p className="year">
            {album.year} • {album.genre}
          </p>
          <p className="song-count">{songs.length} songs</p>
        </div>
      </div>

      <div className="album-content">
        <div className="songs-list">
          {songs.map((song, index) => (
            <div
              key={song.id}
              className={`song-item ${
                currentSong?.id === song.id ? "playing" : ""
              }`}
              onClick={() => handleSongClick(song)}
            >
              <div className="song-number">
                {currentSong?.id === song.id && isPlaying ? (
                  <i className="fas fa-volume-up"></i>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="song-cover">
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-cover.png";
                  }}
                />
                <div className="play-overlay">
                  <i className="fas fa-play"></i>
                </div>
              </div>
              <div className="song-details">
                <h3>{song.title}</h3>
                <p>{song.artist}</p>
              </div>
              <div className="song-duration">
                {formatDuration(song.duration)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlbumPage;
