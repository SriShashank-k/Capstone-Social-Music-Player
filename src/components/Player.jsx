import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Player = ({ track, setCurrentTrack }) => {
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    const fetchYouTube = async () => {
      if (track?.name) {
        const query = `${track.name} ${track.artists?.[0]?.name}`;
        try {
          const res = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
            params: {
              part: 'snippet',
              q: query,
              key: process.env.REACT_APP_YOUTUBE_API_KEY,
              maxResults: 1,
              type: 'video'
            }
          });
          const videoId = res.data.items[0]?.id?.videoId;
          if (videoId) setVideoUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1`);
        } catch (err) {
          console.error('YouTube API error:', err);
          setVideoUrl(null);
        }
      }
    };

    fetchYouTube();
  }, [track]);

  if (!track || !videoUrl) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black rounded-xl shadow-lg w-80 h-48 z-50 overflow-hidden">
      <button
        onClick={() => {
          setCurrentTrack(null);
        }}
        className="absolute top-1 right-2 text-white text-sm hover:text-red-400"
      >
        ✖
      </button>

      <iframe
        width="100%"
        height="100%"
        src={videoUrl}
        title="YouTube Music Player"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    </div>

  );
};


export default Player;
