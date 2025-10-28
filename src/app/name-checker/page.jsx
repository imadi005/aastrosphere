'use client';

import React, { useState } from 'react';

// Numerology letter mapping
const letterValues = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 8, G: 3, H: 5, I: 1,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 7, P: 8, Q: 1, R: 2,
  S: 3, T: 4, U: 6, V: 6, W: 6, X: 5, Y: 1, Z: 7,
};

// Favorable name numbers by destiny number
const favorableNumbers = {
  default: [1, 3, 5, 6],
  8: [3, 5, 6],
  6: [5, 6],
  3: [1, 3, 5],
  9: [1, 3, 5, 6, 9],
};

// Converts a name part to its letters, mapped numbers and sum.
function computeNameDigits(namePart) {
  const letters = namePart.toUpperCase().replace(/[^A-Z]/g, '').split('');
  const digits = letters.map((l) => letterValues[l] || 0);
  const sum = digits.reduce((a, b) => a + b, 0);
  return { letters, digits, sum };
}

// Reduce a number to single digit by summing its digits repeatedly.
function reduceToSingleDigit(num) {
  while (num > 9) {
    num = String(num)
      .split('')
      .reduce((acc, n) => acc + parseInt(n, 10), 0);
  }
  return num;
}

// Calculate Destiny Number from the DOB (format: YYYY-MM-DD)
function calculateDestinyNumber(dob) {
  const parts = dob.split('-');
  if (parts.length !== 3) return null;
  const [year, month, day] = parts.map(Number);
  const digits = [...String(day), ...String(month), ...String(year)].map(Number);
  const sum = digits.reduce((a, b) => a + b, 0);
  return reduceToSingleDigit(sum);
}

/**
 * Generate corrected name suggestions with minimal modifications.
 * This function will try to alter the first and last name using vowel-doubling and, if needed,
 * soft consonant swaps. It forces a loop to generate *at least 3* unique suggestions.
 *
 * @param {string} first - The first name.
 * @param {string} last - The last name.
 * @param {number} destiny - The destiny number.
 * @returns {Array} Array of suggestions each as an object { name, sum, reduced }.
 */
function generateMinimalCorrectedNames(first, last, destiny) {
  const allowed = favorableNumbers[destiny] || favorableNumbers.default;
  const vowels = ['A', 'E', 'I', 'O', 'U'];
  const corrections = new Set();

  // A helper function that attempts a variant given a first and last name;
  // it computes the sum and reduced value. If it’s allowed, it adds to suggestions.
  const tryVariant = (variantFirst, variantLast) => {
    const combined = (variantFirst + variantLast).toUpperCase().replace(/[^A-Z]/g, '');
    const sum = combined.split('').reduce((acc, ch) => acc + (letterValues[ch] || 0), 0);
    const reduced = reduceToSingleDigit(sum);
    if (allowed.includes(reduced)) {
      const formatted =
        variantFirst.charAt(0).toUpperCase() +
        variantFirst.slice(1).toLowerCase() +
        ' ' +
        variantLast.charAt(0).toUpperCase() +
        variantLast.slice(1).toLowerCase();
      corrections.add(JSON.stringify({ name: formatted, sum, reduced }));
    }
  };

  const baseFirst = first.trim();
  const baseLast = last.trim();

  // Generate vowel-doubling variants for a name part up to a given depth
  const getVowelVariants = (name, depth) => {
    const variants = new Set();
    // Base variant
    variants.add(name);
    // For each depth, try doubling each vowel position; do it iteratively.
    for (let d = 0; d < depth; d++) {
      const newVariants = new Set();
      variants.forEach((variant) => {
        for (let i = 0; i < variant.length; i++) {
          const char = variant[i];
          if (vowels.includes(char.toUpperCase())) {
            const newVariant = variant.slice(0, i + 1) + char + variant.slice(i + 1);
            newVariants.add(newVariant);
          }
        }
      });
      newVariants.forEach((v) => variants.add(v));
    }
    return Array.from(variants);
  };

  // We attempt increasing depths until we get at least 3 corrected names or we reach maxDepth.
  let depth = 1;
  const maxDepth = 4;
  while (depth <= maxDepth && corrections.size < 3) {
    const firstVariants = getVowelVariants(baseFirst, depth);
    const lastVariants = getVowelVariants(baseLast, depth);
    for (let fv of firstVariants) {
      for (let lv of lastVariants) {
        tryVariant(fv, lv);
        if (corrections.size >= 3) break;
      }
      if (corrections.size >= 3) break;
    }
    depth++;
  }

  // Return the top 3 suggestions as objects (if fewer, return what we have)
  return Array.from(corrections)
    .map((c) => JSON.parse(c))
    .slice(0, 3);
}

export default function NameChecker() {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('female');

  const [computed, setComputed] = useState(false);
  const [destinyNumber, setDestinyNumber] = useState(null);
  const [finalNumber, setFinalNumber] = useState(0);
  const [finalSum, setFinalSum] = useState(0);
  const [isFavorable, setIsFavorable] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const [firstResult, setFirstResult] = useState(null);
  const [middleResult, setMiddleResult] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Calculate digits for each name part
    const f = computeNameDigits(firstName);
    const m = computeNameDigits(middleName);
    const l = computeNameDigits(lastName);

    setFirstResult(f);
    setMiddleResult(m);
    setLastResult(l);

    // Calculate total sum and reduce to single digit
    const total = f.sum + m.sum + l.sum;
    setFinalSum(total);
    const reduced = reduceToSingleDigit(total);
    setFinalNumber(reduced);

    // Calculate destiny number from DOB
    const dNum = calculateDestinyNumber(dob);
    setDestinyNumber(dNum);

    // Determine if the name's total is favorable according to destiny
    const allowed = favorableNumbers[dNum] || favorableNumbers.default;
    const favorable = allowed.includes(reduced);
    setIsFavorable(favorable);

    // If not favorable, generate minimal corrected name suggestions.
    // We ensure that we always try to generate 3 suggestions.
    if (!favorable) {
      const corrected = generateMinimalCorrectedNames(firstName, lastName, dNum);
      setSuggestions(corrected);
    } else {
      setSuggestions([]);
    }

    setComputed(true);
  };

  return (
    <div className="h-screen w-screen overflow-auto bg-black text-white px-4 py-10 flex flex-col items-center">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-10 tracking-wide">
        ✨ Name Numerology Checker
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-7xl mx-auto">
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          placeholder="First Name"
          className="bg-gray-800 px-4 py-2 rounded-xl"
        />
        <input
          type="text"
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
          placeholder="Middle Name"
          className="bg-gray-800 px-4 py-2 rounded-xl"
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          className="bg-gray-800 px-4 py-2 rounded-xl"
        />
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          required
          className="bg-gray-800 px-4 py-2 rounded-xl"
        />
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="bg-gray-800 px-4 py-2 rounded-xl"
        >
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="other">Other</option>
        </select>

        <div className="sm:col-span-2 lg:col-span-5 mt-4 text-center">
          <button type="submit" className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-full font-semibold text-lg transition">
            🔍 Check My Name
          </button>
        </div>
      </form>

      {computed && (
        <div className="mt-10 max-w-5xl mx-auto space-y-6">
          {/* Detailed breakdown for each name part */}
          {[{ label: 'First', name: firstName, result: firstResult },
            { label: 'Middle', name: middleName, result: middleResult },
            { label: 'Last', name: lastName, result: lastResult }]
            .filter(part => part.name && part.result)
            .map((part, idx) => (
              <div key={idx} className="bg-gray-800 rounded-xl p-4 mb-6">
                <h3 className="text-lg font-bold mb-2">{part.label} Name: {part.name}</h3>
                <table className="w-full text-sm text-center">
                  <thead>
                    <tr className="bg-gray-700 text-purple-300">
                      <th className="py-2">Letters</th>
                      <th className="py-2">Mapped Numbers</th>
                      <th className="py-2">Sum</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2">{part.result.letters.join(' ')}</td>
                      <td className="py-2">{part.result.digits.join(' ')}</td>
                      <td className="py-2 font-bold text-green-400">{part.result.sum}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}

          {/* Totals & Destiny */}
          <div className="text-center bg-gradient-to-r from-purple-800 to-purple-600 rounded-xl py-6 px-4">
            <h3 className="text-lg font-bold text-white">💠 Total Name Sum: {finalSum}</h3>
            <p className="text-2xl font-bold mt-1 text-yellow-300">Reduced to Single Digit: {finalNumber}</p>
            <p className="mt-3 text-xl text-white">
              🎯 Destiny Number (from DOB): <span className="font-bold text-cyan-300">{destinyNumber}</span>
            </p>
            <p className={`mt-2 text-xl font-semibold ${isFavorable ? 'text-green-400' : 'text-red-400'}`}>
              {isFavorable ? '✅ Astrologically Favorable Name!' : '⚠️ Not Favorable As Per Destiny Number'}
            </p>
          </div>

          {/* Corrected Name Suggestions (if not favorable) */}
          {!isFavorable && suggestions.length > 0 && (
            <div className="bg-gray-900 p-5 rounded-xl border border-purple-600">
              <h3 className="text-xl text-purple-300 mb-3">🔁 Suggested Name Corrections</h3>
              <ul className="list-disc pl-6 space-y-2">
                {suggestions.map((sugg, idx) => (
                  <li key={idx} className="text-lg">
                    👉 <b>{sugg.name}</b> <span className="text-gray-400">(Sum: {sugg.sum} → {sugg.reduced})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!isFavorable && suggestions.length === 0 && (
            <div className="bg-red-900 p-5 rounded-xl border border-red-600 text-center">
              <h3 className="text-xl font-semibold">
                No minimal modifications found that yield a favorable result.
              </h3>
              <p className="mt-2 text-gray-200">
                Please try manual adjustments or consult a deeper approach!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
