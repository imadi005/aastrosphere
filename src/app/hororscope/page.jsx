"use client";

import { useState } from "react";

const numberMeanings = {
  1: "Leadership, willpower, independence. Often self-driven with strong ego.",
  2: "Emotional balance, harmony, intuition. Natural peacekeeper.",
  3: "Creativity, joy, artistic talent. Loves self-expression.",
  4: "Discipline, responsibility, hard work. Prefers structure and order.",
  5: "Freedom-seeking, adventurous, loves change. Can be impulsive.",
  6: "Nurturing, love, beauty, family. Emotionally responsible.",
  7: "Spiritual, deep thinker, researcher. Needs inner peace.",
  8: "Material success, power, ambition. Strong business mind.",
  9: "Compassion, universal love, idealism. Wants to help the world."
};

const calculateLifeNumber = (dob) => {
  const digits = dob.split("/").join("").split("").map(Number); // DD/MM/YYYY
  const sum = digits.reduce((a, b) => a + b, 0);
  let reduced = sum;
  while (reduced > 9 && reduced !== 11 && reduced !== 22) {
    reduced = String(reduced).split("").reduce((a, b) => a + Number(b), 0);
  }
  return { lifeNumber: reduced, sumBefore: sum };
};

const countNumberFrequencies = (dob) => {
  const digits = dob.split("/").join("").split("");
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
  return `Your Life Path is ruled by number ${lifeNumber}. Dominant digits in your birth chart are: ${
    dominant.length ? dominant.join(", ") : "None repeated"
  }. These numbers heavily influence your personality. ${
    dominantTraits || "You are balanced across many aspects of life."
  }`;
};

export default function MyHoroscope() {
  const [dob, setDob] = useState("");
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleaned = dob.trim();
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(cleaned)) {
      setDob(cleaned);
      setShowResult(true);
    } else {
      alert("Please enter your DOB in DD/MM/YYYY format.");
    }
  };

  const { lifeNumber, sumBefore } = dob ? calculateLifeNumber(dob) : {};
  const freq = dob ? countNumberFrequencies(dob) : {};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-200 to-indigo-200 p-4">
      <h1 className="text-3xl font-bold mb-6 text-purple-900">🪐 Discover Your Horoscope</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border border-purple-200"
        autoComplete="off"
      >
        <label className="block text-gray-700 font-semibold mb-2">
          Enter Your Date of Birth <span className="text-sm text-gray-500">(DD/MM/YYYY)</span>:
        </label>
        <input
          type="tel"
          inputMode="numeric"
          placeholder="e.g. 14/12/2003"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900"
          required
        />
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 active:scale-95 transition font-semibold"
        >
          Show My Horoscope
        </button>
      </form>

      {showResult && (
        <div className="bg-white mt-10 p-6 rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-200">
          <h2 className="text-xl font-bold mb-2 text-center text-purple-800">🔮 Horoscope Result</h2>
          <p className="text-center text-sm text-gray-600 mb-4">
            DOB: {dob} | Life Number: {lifeNumber} (from sum: {sumBefore})
          </p>

          <h3 className="font-semibold mb-1 text-purple-700">🔢 Digit Frequencies:</h3>
          <ul className="list-disc list-inside mb-4 text-gray-800">
            {Object.entries(freq).sort().map(([num, count]) => (
              <li key={num}>
                <strong>{num}</strong>: {count} time(s)
              </li>
            ))}
          </ul>

          <h3 className="font-semibold mb-1 text-purple-700">📖 Life Number Traits:</h3>
          <p className="mb-4 text-gray-800">{numberMeanings[lifeNumber]}</p>

          <h3 className="font-semibold mb-1 text-purple-700">🌟 Personality Summary:</h3>
          <p className="text-gray-900 font-medium">{getSummary(lifeNumber, freq)}</p>

          <div className="text-center mt-6">
            <button
              onClick={() => setShowResult(false)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 shadow"
            >
              Try Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
