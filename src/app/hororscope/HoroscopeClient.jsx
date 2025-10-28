"use client";

import { useState, useEffect } from "react";
// IMPORT ZAROORI HAI
import { useSearchParams } from 'next/navigation';

// ... (Aapka saara data aur functions jaise numberMeanings, calculateLifeNumber, etc. yahaan rahenge) ...
const numberMeanings = {
  1: "Leadership, willpower, independence. Often self-driven with strong ego.",
  2: "Emotional balance, harmony, intuition. Natural peacekeeper.",
  3: "Creativity, joy, artistic talent. Loves self-expression.",
  4: "Discipline, responsibility, hard work. Prefers structure and order.",
  5: "Freedom-seeking, adventurous, loves change. Can be impulsive.",
  6: "Nurturing, love, beauty, family. Emotionally responsible.",
  7: "Spiritual, deep thinker, researcher. Needs inner peace.",
  8: "Material success, power, ambition. Strong business mind.",
  9: "Compassion, universal love, idealism. Wants to help the world.",
  11: "Master Number: Spiritual intuition, visionary. Heightened sensitivity.",
  22: "Master Number: Master builder, practical visionary. Can achieve great things.",
};

const calculateLifeNumber = (dob) => {
  const digits = dob.split("-").join("").split("").map(Number);
  const sum = digits.reduce((a, b) => a + b, 0);
  let reduced = sum;
  while (reduced > 9 && reduced !== 11 && reduced !== 22) {
    reduced = String(reduced).split("").reduce((a, b) => a + Number(b), 0);
  }
  return { lifeNumber: reduced, sumBefore: sum };
};

const countNumberFrequencies = (dob) => {
  const digits = dob.split("-").join("").split("");
  const freq = {};
  for (let d of digits) {
    if (d !== "0") {
      freq[d] = (freq[d] || 0) + 1;
    }
  }
  return freq;
};

const getSummary = (lifeNumber, freq) => {
  const dominant = Object.entries(freq)
    .filter(([k, v]) => v >= 2)
    .map(([k]) => Number(k));
  const dominantTraits = dominant.map(num => numberMeanings[num]).join(" ");
  return `Your Life Path is ruled by ${lifeNumber}. Dominant digits: ${
    dominant.length ? dominant.join(", ") : "None"
  }. ${dominantTraits || "You are balanced."}`;
};


// YEH HAI MAIN COMPONENT
export default function HoroscopeClient() {
  const searchParams = useSearchParams();
  const [dob, setDob] = useState("");
  const [showResult, setShowResult] = useState(false);

  // YEH NAYA LOGIC HAI
  useEffect(() => {
    const dobFromUrl = searchParams.get('dob');
    if (dobFromUrl) {
      setDob(dobFromUrl); // DOB ko URL se set karo
      setShowResult(true); // Aur seedha result dikhao
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!dob) {
      alert("Please select your date of birth.");
      return;
    }
    setShowResult(true);
  };

  const { lifeNumber, sumBefore } = showResult ? calculateLifeNumber(dob) : {};
  const freq = showResult ? countNumberFrequencies(dob) : {};

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-black text-white p-4 sm:px-6 pt-24 pb-12">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
        🪐 Discover Your Life Path Number
      </h1>

      {/* AGAR URL MEIN DOB NAHIN HAI, TABHI YEH FORM DIKHEGA */}
      {!showResult && (
        <form
          onSubmit={handleSubmit}
          className="bg-neutral-900 p-6 sm:p-8 rounded-xl shadow-lg shadow-purple-900/30 border border-purple-700 max-w-md w-full"
          autoComplete="off"
        >
          <label className="block text-gray-300 font-semibold mb-2">
            Enter Your Date of Birth:
          </label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full p-3 border border-neutral-700 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-neutral-800 text-white [color-scheme:dark]"
            required
          />
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 active:scale-95 transition font-semibold"
          >
            Calculate My Numbers
          </button>
        </form>
      )}

      {/* JAISE HI 'showResult' TRUE HOGA (URL SE YA FORM SE), YEH DIKHEGA */}
      {showResult && (
        <div className="bg-neutral-900/90 backdrop-blur-sm mt-10 p-6 rounded-xl shadow-lg border border-gray-800 max-w-2xl w-full">
          <h2 className="text-2xl font-bold mb-2 text-center text-purple-300">
            🔮 Your Numerology Reading
          </h2>
          {/* ... (baaki ka poora result card code jaisa aapne diya tha) ... */}
          <p className="text-center text-sm text-gray-400 mb-4">
            DOB: {dob} | Life Number: {lifeNumber} (from sum: {sumBefore})
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-neutral-800/50 p-4 rounded-lg border border-neutral-700">
              <h3 className="font-semibold mb-2 text-purple-400">🔢 Digit Frequencies:</h3>
              <ul className="list-disc list-inside text-gray-200 space-y-1">
                {Object.entries(freq).sort().map(([num, count]) => (
                  <li key={num}>
                    <strong>{num}</strong>: {count} time(s)
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-neutral-800/50 p-4 rounded-lg border border-neutral-700">
              <h3 className="font-semibold mb-2 text-purple-400">📖 Life Number Traits:</h3>
              <p className="text-gray-200">{numberMeanings[lifeNumber]}</p>
            </div>
          </div>
          <div className="mt-6 bg-neutral-800/50 p-4 rounded-lg border border-neutral-700">
            <h3 className="font-semibold mb-2 text-purple-400">🌟 Personality Summary:</h3>
            <p className="text-white font-medium">{getSummary(lifeNumber, freq)}</p>

          </div>
        </div>
      )}
    </div>
  );
}