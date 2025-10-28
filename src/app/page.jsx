'use client';

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import CelestialDoors from '@/components/CelestialDoors';
import { CenterOrb } from '@/components/CenterOrb';
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
    <div className="relative w-screen h-screen overflow-hidden bg-[var(--bg-primary)] font-sans">
      {/* 🌌 Animated deep-space gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] via-[#0f172a] to-black animate-pulse opacity-90 pointer-events-none" />

      {/* 🌠 Cosmic background (stars / glowing orb / wheel) */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* keep all cosmic visuals here */}
        <div className="fixed inset-0 -z-10">
  <Canvas camera={{ position: [0, 0, 3] }}>
    <ambientLight intensity={0.5} />
    <pointLight position={[10, 10, 10]} intensity={1.2} />
    <CenterOrb />
  </Canvas>
</div>
      </div>

      {/* 🚪 Celestial door animation */}
      <CelestialDoors onDoorsOpen={handleDoorsOpen} />
     

      {/* 🌟 Header — Minimal Premium Branding */}
      <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex items-center justify-between bg-[var(--bg-surface)]/50 border-b border-[var(--line)] backdrop-blur-xl shadow-glow">
        <h1
          onClick={() => window.location.reload()}
          className="text-2xl sm:text-3xl font-[Cinzel] tracking-wide text-[var(--accent-gold)] cursor-pointer hover:text-[var(--accent-gold-light)] transition-transform duration-300 hover:scale-105"
        >
          AASTROSPHERE
        </h1>
      </header>

      {/* 🪶 Entry form overlay */}
      {showForm && !formData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <EntryForm onSubmit={handleFormSubmit} />
        </div>
      )}

      {/* 📊 Numerology Chart Output */}
      {formData && (
        <div className="absolute top-0 left-0 w-full min-h-screen z-40 flex flex-col items-center bg-[var(--bg-primary)]/90 overflow-y-auto">
          <div className="w-full max-w-4xl px-4 pt-28 sm:pt-24 pb-10">
            <NumerologyChart dob={formData.dob} />
          </div>
        </div>
      )}
    </div>
  );
}
