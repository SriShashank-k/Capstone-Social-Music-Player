import axios from 'axios';

const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

export const searchYouTube = async (query) => {
  const res = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
    params: {
      part: 'snippet',
      maxResults: 1,
      q: query,
      key: YOUTUBE_API_KEY,
      type: 'video',
    },
  });
  const videoId = res.data.items?.[0]?.id?.videoId;
  return videoId ? `https://www.youtube.com/embed/\${videoId}?autoplay=1` : null;
};