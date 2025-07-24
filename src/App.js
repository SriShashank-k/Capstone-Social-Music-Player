import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { getTokenFromUrl, loginUrl } from './utils/auth';
import Home from './pages/Home';
import Library from './components/Library';
import PlaylistDetails from './pages/PlaylistDetails';
import Player from './components/Player';
import TrackSearch from './components/TrackSearch';

const App = () => {
  const [token, setToken] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [displayName, setDisplayName] = useState("User");

  useEffect(() => {
    const hash = getTokenFromUrl();
    window.location.hash = '';
    const _token = hash.access_token;

    if (_token) {
      localStorage.setItem("spotify_token", _token);
      setToken(_token);

      fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${_token}` },
      })
        .then(res => res.json())
        .then(data => {
          console.log("🎧 Spotify user data:", data);
          const name = data.display_name || "User";
          setDisplayName(name);
          localStorage.setItem("spotify_display_name", name);
        })
        .catch(() => {
          localStorage.clear();
          window.location.href = loginUrl;
        });
    } else {
      const storedToken = localStorage.getItem("spotify_token");
      const storedName = localStorage.getItem("spotify_display_name");
      if (storedToken) {
        setToken(storedToken);
        if (storedName) setDisplayName(storedName);
      } else {
        window.location.href = loginUrl;
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    const popup = window.open("https://accounts.spotify.com/en/logout", "spotifyLogout", "width=500,height=600");
    const pollTimer = window.setInterval(() => {
      if (popup.closed) {
        window.clearInterval(pollTimer);
        window.location.href = "http://localhost:3000";
      }
    }, 500);
  };

  return (
    <BrowserRouter>
      {/* 🔝 Top Bar */}
      {/* <div className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-green-400">🎵 Music App</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300">Hi, {displayName}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-400 hover:underline"
          >
            Logout
          </button>
        </div>
      </div> */}

      {/* 📦 Layout */}
      
          <Routes>
            <Route path="/" element={<Home handleLogout={handleLogout} />} />
            <Route path="/" element={<Home handleLogout={handleLogout} displayName={displayName} />} />
            <Route path="/library" element={<Library token={token} />} />
            <Route path="/playlist/:id" element={<PlaylistDetails token={token} setCurrentTrack={setCurrentTrack} />} />
            <Route path="/search" element={<TrackSearch token={token} />} />
          </Routes>
        

      <Player track={currentTrack} setCurrentTrack={setCurrentTrack} />
    </BrowserRouter>
  );
};

export default App;
