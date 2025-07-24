import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => (
  <div className="w-60 h-screen bg-[#1a1a1a] p-6 shadow-lg">
    {/* Logo / Title */}
    <h2 className="text-2xl font-bold text-orange-400 mb-8 tracking-wide flex items-center gap-1">
      <span>🎵</span> My Music
    </h2>

    {/* Navigation Links */}
    <nav className="space-y-4 text-lg">
      <Link
        to="/"
        className="block text-gray-200 hover:text-orange-400 transition duration-200"
      >
        Home
      </Link>
      <Link
        to="/library"
        className="block text-gray-200 hover:text-orange-400 transition duration-200"
      >
        Library
      </Link>
    </nav>
  </div>
);

export default Sidebar;
