import React, { useState } from "react";
import { usePlayer } from "../context/PlayerContext";
import { mockSongs, mockAlbums, mockPlaylists } from "../data/mockData";
import "../App.css";
import {
  isSongLiked,
  likeSong,
  unlikeSong,
  getUserPlaylists,
  addSongToPlaylist,
  createPlaylist,
} from "../data/likeAndPlaylistUtils";
import {
  getLikedSongs,
  addLikedSongToPlaylist,
  removeLikedSongFromPlaylist,
} from "../data/mockData";

const Home = () => {
  const { playSong } = usePlayer();

  // Get popular tracks (first 6 songs from mock data)
  const popularTracks = mockSongs;

  // Get featured albums (first 4 albums)
  const featuredAlbums = mockAlbums.slice(0, 4);

  // Get featured playlists (first 4 playlists)
  const featuredPlaylists = mockPlaylists.slice(0, 4);

  const [likeState, setLikeState] = useState(() =>
    popularTracks.map((song) => isSongLiked(song.id))
  );
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState(null);
  const [playlists, setPlaylists] = useState(getUserPlaylists());
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [playlistMessage, setPlaylistMessage] = useState("");
  const [playlistModalTab, setPlaylistModalTab] = useState("choose"); // "choose", "create", "add"

  const handleSongClick = (song) => {
    playSong(song);
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleLikeClick = (song, idx) => {
    if (getLikedSongs().includes(song.id)) {
      unlikeSong(song.id);
      removeLikedSongFromPlaylist(song.id);
    } else {
      likeSong(song.id);
      addLikedSongToPlaylist(song.id);
    }
    setLikeState((prev) => {
      const updated = [...prev];
      updated[idx] = !prev[idx];
      return updated;
    });
  };

  const handleAddToPlaylistClick = (songId) => {
    setSelectedSongId(songId);
    setShowPlaylistModal(true);
    setPlaylists(getUserPlaylists());
    setPlaylistMessage("");
    setPlaylistModalTab("choose");
  };

  const handleSelectPlaylist = (playlistId) => {
    addSongToPlaylist(playlistId, selectedSongId);
    setPlaylists(getUserPlaylists());
    setPlaylistMessage("Song added to playlist!");
    setTimeout(() => setPlaylistMessage(""), 1500);
  };

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      const newPlaylist = createPlaylist(newPlaylistName.trim());
      addSongToPlaylist(newPlaylist.id, selectedSongId);
      setPlaylists(getUserPlaylists());
      setNewPlaylistName("");
      setPlaylistMessage("Playlist created and song added!");
      setTimeout(() => setPlaylistMessage(""), 1500);
    }
  };

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>Welcome to Spotify 2.0</h1>
        <p>Discover and enjoy your favorite music</p>
      </div>

      <div className="home-content">
        {/* Popular Tracks Section */}
        <section className="section">
          <h2>Popular Tracks</h2>
          <div className="songs-grid">
            {popularTracks.map((song, idx) => (
              <div key={song.id} className="song-card">
                <div className="song-cover">
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-cover.png";
                    }}
                    onClick={() => handleSongClick(song)}
                    style={{ cursor: "pointer" }}
                  />
                  <div
                    className="play-overlay"
                    onClick={() => handleSongClick(song)}
                    style={{ cursor: "pointer" }}
                  >
                    <i className="fas fa-play"></i>
                  </div>
                  <div className="song-meta-overlay">
                    <h3>{song.title}</h3>
                    <p>{song.artist}</p>
                    <span className="duration">
                      {formatDuration(song.duration)}
                    </span>
                  </div>
                </div>
                <div className="song-actions">
                  <button
                    className="like-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikeClick(song, idx);
                    }}
                    title={isSongLiked(song.id) ? "Unlike" : "Like"}
                  >
                    <i
                      className={
                        isSongLiked(song.id) ? "fas fa-heart" : "far fa-heart"
                      }
                    ></i>
                  </button>
                  <button
                    className="playlist-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToPlaylistClick(song.id);
                    }}
                    title="Add to Playlist"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Albums Section */}
        <section className="section">
          <h2>Featured Albums</h2>
          <div className="albums-grid">
            {featuredAlbums.map((album) => (
              <div key={album.id} className="album-card">
                <div className="album-cover">
                  <img
                    src={album.coverUrl}
                    alt={album.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-cover.png";
                    }}
                  />
                  <div className="play-overlay">
                    <i className="fas fa-play"></i>
                  </div>
                </div>
                <div className="album-info">
                  <h3>{album.name}</h3>
                  <p>{album.artist}</p>
                  <span className="year">{album.year}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Playlists Section */}
        <section className="section">
          <h2>Featured Playlists</h2>
          <div className="playlists-grid">
            {featuredPlaylists.map((playlist) => (
              <div key={playlist.id} className="playlist-card">
                <div className="playlist-cover">
                  <img
                    src={playlist.coverUrl}
                    alt={playlist.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-cover.png";
                    }}
                  />
                  <div className="play-overlay">
                    <i className="fas fa-play"></i>
                  </div>
                </div>
                <div className="playlist-info">
                  <h3>{playlist.name}</h3>
                  <p>{playlist.description}</p>
                  <span className="song-count">
                    {playlist.songs.length} songs
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Playlist Modal */}
      {showPlaylistModal && (
        <div
          className="playlist-modal-overlay"
          onClick={() => setShowPlaylistModal(false)}
        >
          <div className="playlist-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add to Playlist</h3>
            {playlistMessage && (
              <div className="playlist-message">{playlistMessage}</div>
            )}
            {playlistModalTab === "choose" && (
              <div className="playlist-modal-options">
                <button
                  className="modal-option-btn"
                  onClick={() => setPlaylistModalTab("create")}
                >
                  Create a Playlist
                </button>
                <button
                  className="modal-option-btn"
                  onClick={() => setPlaylistModalTab("add")}
                >
                  Add to Existing Playlist
                </button>
              </div>
            )}
            {playlistModalTab === "create" && (
              <div className="create-playlist-section">
                <input
                  type="text"
                  placeholder="New playlist name"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                />
                <button onClick={handleCreatePlaylist}>Create & Add</button>
                <button
                  className="back-btn"
                  onClick={() => setPlaylistModalTab("choose")}
                >
                  Back
                </button>
              </div>
            )}
            {playlistModalTab === "add" && (
              <div className="playlist-list">
                {playlists.length > 0 ? (
                  playlists.map((playlist) => (
                    <div key={playlist.id} className="playlist-option">
                      <span>{playlist.name}</span>
                      <button onClick={() => handleSelectPlaylist(playlist.id)}>
                        Add
                      </button>
                    </div>
                  ))
                ) : (
                  <div>No playlists found.</div>
                )}
                <button
                  className="back-btn"
                  onClick={() => setPlaylistModalTab("choose")}
                >
                  Back
                </button>
              </div>
            )}
            <button
              className="close-modal-btn"
              onClick={() => setShowPlaylistModal(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
