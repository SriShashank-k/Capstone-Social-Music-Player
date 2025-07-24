import axios from 'axios';

// 🔐 Handles 401 errors globally and redirects to login
const handleSpotifyError = (error) => {
  if (error.response?.status === 401) {
    console.warn("⛔ Spotify token invalid — clearing session and redirecting to login.");
    localStorage.clear();
    window.location.href = "/"; // You could use loginUrl if preferred
  }
  throw error;
};

// 🎵 Get current user's playlists
export const getUserPlaylists = (token) => {
  return axios
    .get('https://api.spotify.com/v1/me/playlists', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .catch(handleSpotifyError);
};

// 📀 Get tracks for a playlist by ID
export const getTracksByPlaylistId = (token, playlistId) => {
  return axios
    .get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .catch(handleSpotifyError);
};
