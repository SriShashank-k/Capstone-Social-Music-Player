import React, { useEffect, useState } from 'react';
import { getUserPlaylists } from '../utils/spotify';
import { Link } from 'react-router-dom';

const Library = ({ token }) => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    getUserPlaylists(token).then(res => setPlaylists(res.data.items));
  }, [token]);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Your Playlists</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {playlists.map((playlist) => (
          <Link to={`/playlist/${playlist.id}`} key={playlist.id} className="bg-gray-700 hover:bg-gray-600 p-4 rounded shadow-md transition">
            <img src={playlist.images[0]?.url} alt="cover" className="w-full h-40 object-cover rounded" />
            <h3 className="text-lg mt-2 font-semibold">{playlist.name}</h3>
            <p className="text-sm text-gray-300">{playlist.tracks.total} songs</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Library;