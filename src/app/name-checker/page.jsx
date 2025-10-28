// name-checker/page.jsx
'use client';

import React, { useState, useEffect } from 'react';

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
  if (!namePart || namePart.trim() === '') {
    return { letters: [], digits: [], sum: 0 };
  }
  const letters = namePart.toUpperCase().replace(/[^A-Z]/g, '').split('');
  const digits = letters.map((l) => letterValues[l] || 0);
  const sum = digits.reduce((a, b) => a + b, 0);
  return { letters, digits, sum };
}

// Reduce a number to single digit by summing its digits repeatedly.
function reduceToSingleDigit(num) {
  let n = num;
  while (n > 9) {
    n = String(n)
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return n;
}

// Calculate Destiny Number from the DOB (format: YYYY-MM-DD)
function calculateDestinyNumber(dob) {
  if (!dob) return null;
  
  // Handle both YYYY-MM-DD and DD-MM-YYYY formats
  let day, month, year;
  
  if (dob.includes('-')) {
    const parts = dob.split('-');
    if (parts[0].length === 4) {
      // YYYY-MM-DD format
      [year, month, day] = parts.map(Number);
    } else {
      // DD-MM-YYYY format
      [day, month, year] = parts.map(Number);
    }
  } else {
    return null;
  }

  const digits = [
    ...String(day).split('').map(Number),
    ...String(month).split('').map(Number),
    ...String(year).split('').map(Number)
  ];
  
  const sum = digits.reduce((a, b) => a + b, 0);
  return reduceToSingleDigit(sum);
}

/**
 * Generate corrected name suggestions
 */
function generateMinimalCorrectedNames(first, last, destiny) {
  const allowed = favorableNumbers[destiny] || favorableNumbers.default;
  const vowels = ['A', 'E', 'I', 'O', 'U'];
  const corrections = new Set();

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

  const baseFirst = (first || '').trim();
  const baseLast = (last || '').trim();

  if (!baseFirst || !baseLast) return [];

  // Simple vowel doubling strategy
  for (let i = 0; i < baseFirst.length && corrections.size < 3; i++) {
    const char = baseFirst[i].toUpperCase();
    if (vowels.includes(char)) {
      const newFirst = baseFirst.slice(0, i + 1) + baseFirst[i] + baseFirst.slice(i + 1);
      tryVariant(newFirst, baseLast);
    }
  }

  for (let i = 0; i < baseLast.length && corrections.size < 3; i++) {
    const char = baseLast[i].toUpperCase();
    if (vowels.includes(char)) {
      const newLast = baseLast.slice(0, i + 1) + baseLast[i] + baseLast.slice(i + 1);
      tryVariant(baseFirst, newLast);
    }
  }

  return Array.from(corrections)
    .map((c) => JSON.parse(c))
    .slice(0, 3);
}

export default function NameChecker() {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');

  const [computed, setComputed] = useState(false);
  const [destinyNumber, setDestinyNumber] = useState(null);
  const [finalNumber, setFinalNumber] = useState(0);
  const [finalSum, setFinalSum] = useState(0);
  const [isFavorable, setIsFavorable] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const [firstResult, setFirstResult] = useState(null);
  const [middleResult, setMiddleResult] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  // URL se automatically data process karo
  useEffect(() => {
    const processUrlData = () => {
      try {
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          const name = url.searchParams.get('name') || '';
          const dob = url.searchParams.get('dob') || '';
          
          console.log('URL Params:', { name, dob });
          
          if (name) {
            const nameParts = name.split(' ');
            
            // Smart name splitting logic
            if (nameParts.length === 1) {
              // Ek hi word hai - first name
              setFirstName(nameParts[0]);
              setMiddleName('');
              setLastName('');
            } else if (nameParts.length === 2) {
              // Do words hain - first name aur last name
              setFirstName(nameParts[0]);
              setMiddleName('');
              setLastName(nameParts[1]);
            } else {
              // Teen ya zyada words hain
              setFirstName(nameParts[0]);
              setMiddleName(nameParts.slice(1, -1).join(' ')); // Beech ke sab middle name
              setLastName(nameParts[nameParts.length - 1]); // Last word last name
            }
          }
          
          if (dob) {
            // Date format conversion if needed
            setDob(dob);
          }
        }
      } catch (error) {
        console.error('Error processing URL params:', error);
      }
    };

    processUrlData();
  }, []);

  // Jab bhi name ya dob change ho, automatically calculate karo
  useEffect(() => {
    if (firstName && dob) {
      performCalculation();
    }
  }, [firstName, middleName, lastName, dob]);

  const performCalculation = () => {
    if (!firstName || !dob) return;

    console.log('Auto-calculating with:', { firstName, middleName, lastName, dob });

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
    if (!favorable) {
      const corrected = generateMinimalCorrectedNames(firstName, lastName, dNum);
      setSuggestions(corrected);
    } else {
      setSuggestions([]);
    }

    setComputed(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    performCalculation();
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white px-4 py-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#ffda73] tracking-tight">
          🔮 Name Numerology Analysis
        </h1>
        <div className="h-1 w-40 bg-gradient-to-r from-[#d4af37] to-[#ffda73] mx-auto rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Input Form - Still show for manual testing */}
        <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-8 border border-[#d4af37]/20 shadow-lg mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full bg-[#0b0f19] border border-[#d4af37]/30 rounded-xl px-4 py-3 text-white focus:border-[#ffda73] focus:outline-none transition-colors"
                  placeholder="Enter first name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Middle Name</label>
                <input
                  type="text"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-[#d4af37]/30 rounded-xl px-4 py-3 text-white focus:border-[#ffda73] focus:outline-none transition-colors"
                  placeholder="Optional"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-[#d4af37]/30 rounded-xl px-4 py-3 text-white focus:border-[#ffda73] focus:outline-none transition-colors"
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                  className="w-full bg-[#0b0f19] border border-[#d4af37]/30 rounded-xl px-4 py-3 text-white focus:border-[#ffda73] focus:outline-none transition-colors"
                />
              </div>
              
              <div className="flex items-end">
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#d4af37] to-[#ffda73] text-[#0b0f19] py-3 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-lg"
                >
                  🔍 Analyze Name Energy
                </button>
              </div>
            </div>
          </form>
        </div>

        {computed && (
          <div className="space-y-6">
            {/* Name Numerology Breakdown */}
            <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-6 border border-[#d4af37]/20 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-[#ffda73] text-center">📊 Name Numerology Breakdown</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'First Name', name: firstName, result: firstResult },
                  { label: 'Middle Name', name: middleName, result: middleResult },
                  { label: 'Last Name', name: lastName, result: lastResult }
                ].filter(part => part.result && part.result.sum > 0).map((part, idx) => (
                  <div key={idx} className="bg-[#0b0f19] rounded-xl p-4 border border-[#d4af37]/10">
                    <h3 className="font-bold text-lg mb-3 text-white">{part.label}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Letters:</span>
                        <span className="font-mono">{part.result.letters.join(' ') || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Numbers:</span>
                        <span className="font-mono text-[#ffda73]">{part.result.digits.join(' ') || '-'}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-700 pt-2">
                        <span className="text-gray-400">Sum:</span>
                        <span className="font-bold text-lg text-green-400">{part.result.sum}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-[#d4af37]/10 to-transparent rounded-xl p-6 border-2 border-[#d4af37]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-gray-400 text-sm">Total Name Sum</p>
                    <p className="text-3xl font-bold text-white">{finalSum}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Reduced Number</p>
                    <p className="text-4xl font-bold text-[#ffda73]">{finalNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Destiny Number</p>
                    <p className="text-3xl font-bold text-cyan-300">{destinyNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Result Status */}
            <div className={`rounded-2xl p-8 border-2 shadow-lg text-center ${
              isFavorable 
                ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/5 border-green-500' 
                : 'bg-gradient-to-r from-red-500/10 to-rose-500/5 border-red-500'
            }`}>
              <h2 className="text-3xl font-bold mb-4">
                {isFavorable ? '✅' : '⚠️'} {isFavorable ? 'Astrologically Favourable!' : 'Needs Correction'}
              </h2>
              <p className={`text-xl font-semibold ${isFavorable ? 'text-green-400' : 'text-red-400'}`}>
                {isFavorable 
                  ? 'Your name perfectly aligns with your destiny number! 🎉'
                  : 'Your name number conflicts with your destiny energy'
                }
              </p>
            </div>

            {/* Suggestions */}
            {!isFavorable && suggestions.length > 0 && (
              <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-8 border border-[#d4af37]/20 shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-[#ffda73] text-center">✨ Suggested Corrections</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {suggestions.map((sugg, idx) => (
                    <div key={idx} className="bg-[#0b0f19] rounded-xl p-4 border border-[#d4af37]/20 hover:border-[#ffda73] transition-all group">
                      <div className="text-center mb-3">
                        <h3 className="font-bold text-lg text-white group-hover:text-[#ffda73] transition-colors">
                          {sugg.name}
                        </h3>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Sum: {sugg.sum}</span>
                        <span className="bg-[#d4af37] text-[#0b0f19] px-3 py-1 rounded-full text-sm font-bold">
                          → {sugg.reduced}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isFavorable && suggestions.length === 0 && (
              <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-8 border border-red-500/20 shadow-lg text-center">
                <h2 className="text-2xl font-bold mb-4 text-red-400">No Corrections Found</h2>
                <p className="text-gray-300">
                  Try manual adjustments or consult a numerology expert for personalized suggestions.
                </p>
              </div>
            )}
          </div>
        )}

        {!computed && firstName && dob && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ffda73] mx-auto"></div>
            <p className="mt-4 text-gray-400">Calculating your numerology...</p>
          </div>
        )}
      </div>
    </div>
  );
}