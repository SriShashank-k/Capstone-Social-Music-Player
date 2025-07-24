import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatBox from '../components/ChatBox';
import { getTracksByPlaylistId } from '../utils/spotify';

const PlaylistDetails = ({ token, setCurrentTrack }) => {
  const { id } = useParams();
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    getTracksByPlaylistId(token, id)
      .then((res) => setTracks(res.data.items))
      .catch((err) => console.error("Error fetching tracks:", err));
  }, [token, id]);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#f5f5dc] p-6 font-sans">
      <h2 className="text-3xl font-bold mb-8 text-orange-400 tracking-wide">🎵 Playlist Tracks</h2>

      <div className="space-y-6">
        {tracks.map(({ track }) => (
          <div
            key={track.id}
            className="bg-[#2a2a2a] border border-orange-500/20 rounded-xl shadow-lg p-5 hover:bg-[#333] transition duration-200"
          >
            <div className="flex justify-between items-center mb-3">
              <div>
                <div className="text-lg font-semibold">{track.name}</div>
                <div className="text-sm text-[#ccc]">{track.artists?.[0]?.name}</div>
              </div>
              <button
                onClick={() => setCurrentTrack(track)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded-lg text-sm transition duration-150"
              >
                ▶️ Play
              </button>
            </div>

            <ChatBox songId={track.id || track.name} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistDetails;
