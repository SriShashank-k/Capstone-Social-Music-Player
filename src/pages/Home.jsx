import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ handleLogout, displayName }) => (
  <div className="min-h-screen w-full bg-dark text-cream font-sans relative overflow-hidden">
    {/* 🔳 Background image */}
    <img
      src="/assets/resized.png"
      alt="Music homepage background"
      className="absolute inset-0 w-full h-full object-cover z-0 translate-y-8 md:translate-y-16"
    />


    {/* 🔝 Top navigation bar */}
    <header className="absolute top-0 left-0 right-0 px-6 py-4 flex justify-between items-center z-30 bg-black/70 backdrop-blur-md shadow-md">
      <h1 className="text-xl font-semibold text-primary tracking-wide">🎵 Beats & Chats</h1>
      <div className="flex items-center gap-6 text-sm md:text-base">
        <Link to="/" className="hover:text-primary transition">Home</Link>
        <Link to="/library" className="hover:text-primary transition">Library</Link>
        <Link to="/search" className="hover:text-primary transition">Search</Link>
        <span className="text-gray-300">Hi, {displayName || 'User'}</span>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-400 hover:text-red-400 transition"
        >
          Logout
        </button>

      </div>
    </header>

    {/* 💬 Hero Content */}
    <main className="relative z-20 flex flex-col items-center justify-center text-center px-4 h-screen">
      <div className="mt-24 md:mt-32">
        <h2 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">Where music connects to life</h2>
        <p className="text-lg md:text-xl text-cream/80 mb-6">Stream your vibe, your way.</p>
        <button className="px-6 py-2 border border-cream text-cream rounded hover:bg-cream hover:text-black transition">
          LISTEN NOW
        </button>
        <Link
          to="/library"
          className="mt-6 block bg-white/10 hover:bg-white/20 text-cream px-6 py-4 rounded-lg shadow-md border border-white/20 transition text-lg font-medium"
        >
          🎧 Open My Library
        </Link>
      </div>
    </main>

    {/* 🔊 Visualizer */}
    <div className="absolute bottom-6 right-10 z-20">
      <div className="flex gap-1">
        {[3, 6, 9, 6, 3].map((h, i) => (
          <div
            key={i}
            className="w-1 bg-primary rounded"
            style={{
              height: `${h * 4}px`,
              animation: `pulse-opacity 1s ease-in-out ${i * 0.1}s infinite alternate`
            }}
          ></div>
        ))}
      </div>
    </div>
  </div>
);

export default Home;
