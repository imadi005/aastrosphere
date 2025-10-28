'use client';

import { useState } from 'react';
import { Zodiac3DScene } from '@/components/Zodiac3DScene';
import CelestialDoors from '@/components/CelestialDoors';
import EntryForm from '@/components/EntryForm';
import NumerologyChart from '@/components/NumerologyChart';

export default function Home() {
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(null);

  const handleDoorsOpen = () => {
    setDoorsOpen(true);
    setTimeout(() => setShowForm(true), 1200);
  };

  const handleFormSubmit = (data) => {
    setFormData(data);
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative bg-black font-sans">
      {/* 🌌 Dynamic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0f172a] to-black animate-pulse z-0 pointer-events-none" />

      {/* 🌠 3D Scene + Celestial Doors */}
      <Zodiac3DScene doorsOpen={doorsOpen} />
      <CelestialDoors onDoorsOpen={handleDoorsOpen} />

      {/* 💜 Dynamic Header */}
      <div className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex items-center justify-between bg-gradient-to-r from-[#2e1065] via-purple-700 to-[#6b21a8] shadow-lg border-b border-purple-400/30 backdrop-blur-md">
        {/* Left Logo - Home */}
        <h1
          onClick={() => window.location.reload()}
          className="text-2xl sm:text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 cursor-pointer drop-shadow-md hover:scale-105 transition"
        >
          AASTROSPHERE
        </h1>

        {/* Right CTA Button */}
        <button
          onClick={() => alert('🔮 Connecting to Astrologer...')}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold text-sm rounded-lg shadow hover:from-purple-600 hover:to-purple-800 transition"
        >
          🧙 Contact Astrologer
        </button>
      </div>

      {/* 📝 Entry Form */}
      {showForm && !formData && (
        <div className="fixed top-0 left-0 w-screen h-screen z-[60] flex items-center justify-center">
          <EntryForm onSubmit={handleFormSubmit} />
        </div>
      )}

      {/* 📊 Numerology Result Chart */}
      {formData && (
        <div className="absolute top-0 left-0 w-full min-h-screen z-40 p-4 pt-28 sm:pt-24 flex flex-col items-center bg-black/80 overflow-y-auto">
          <div className="mt-10 w-full max-w-4xl px-4">
            <NumerologyChart dob={formData.dob} />
          </div>
        </div>
      )}
    </div>
  );
}
