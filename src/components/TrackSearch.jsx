import React, { useState } from 'react';
import axios from 'axios';
import Player from './Player';
import ChatBox from './ChatBox';

const TrackSearch = ({ token }) => {
  const [query, setQuery] = useState('');
  const [trackInfo, setTrackInfo] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);

  const searchTrack = async () => {
    if (!query.trim()) return;

    try {
      const res = await axios.get('https://api.spotify.com/v1/search', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          q: query,
          type: 'track',
          limit: 1,
        },
      });

      const item = res.data.tracks.items[0];
      if (item) {
        setTrackInfo(item);
        setCurrentTrack({
          name: item.name,
          artists: [{ name: item.artists[0].name }]
        });
      } else {
        setTrackInfo(null);
        setCurrentTrack(null);
      }
    } catch (error) {
      console.error('Search error:', error);
      setTrackInfo(null);
      setCurrentTrack(null);
    }
  };

  return (
    <div className="p-6 text-white max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">🔍 Search Track by Name</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter song name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow p-2 rounded bg-gray-900 text-white text-sm"
        />
        <button
          onClick={searchTrack}
          className="bg-green-600 px-4 rounded hover:bg-green-700 text-sm"
        >
          Search
        </button>
      </div>

      {trackInfo && (
        <div className="bg-gray-800 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">{trackInfo.name}</h3>
          <p className="text-gray-300">Artist: {trackInfo.artists.map(a => a.name).join(', ')}</p>
          <img
            src={trackInfo.album.images[0]?.url}
            alt={trackInfo.name}
            className="w-32 h-32 object-cover rounded mt-2"
          />
        </div>
      )}

      {currentTrack && (
        <Player track={currentTrack} setCurrentTrack={setCurrentTrack} />
      )}

      {trackInfo && (
        <div className="mt-8">
          <ChatBox songId={trackInfo.id} currentUserName={trackInfo.artists[0]?.name} />
        </div>
      )}
    </div>
  );
};

export default TrackSearch;
