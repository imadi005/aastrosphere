'use client';

import { useState } from 'react';

const compatibilityChart = {
  1: { notCompatible: [1, 2], good: [3, 6, 8], neutral: [4, 5, 9, 7] },
  2: { notCompatible: [1], good: [2, 3, 6, 7, 8, 9], neutral: [4, 5] },
  3: { notCompatible: [], good: [3, 7, 9, 5], neutral: [1, 8] },
  4: { notCompatible: [], good: [3, 8, 6, 7], neutral: [1, 9] },
  5: { notCompatible: [], good: [5, 7, 3, 8, 9], neutral: [1, 6] },
  6: { notCompatible: [], good: [6, 2, 7], neutral: [1, 4] },
  7: { notCompatible: [], good: [7, 5, 3, 1], neutral: [2, 6] },
  8: { notCompatible: [], good: [3, 7, 5, 2, 1], neutral: [9] },
  9: { notCompatible: [], good: [3, 7, 5], neutral: [] },
};

const calculateDestinyNumber = (dob) => {
  const digits = dob.replace(/-/g, '').split('').map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);
  while (sum > 9) sum = sum.toString().split('').reduce((a, b) => a + +b, 0);
  return sum;
};

const generateChart = (dob, destinyNumber) => {
  const [year, month, day] = dob.split('-');
  const lastTwo = year.slice(2);
  const digits = [...day, ...month, ...lastTwo].map(Number).filter((n) => n !== 0);
  digits.push(destinyNumber);
  if (!(parseInt(day) <= 9 || ['10', '20', '30'].includes(day))) {
    let basic = [...day].map(Number).reduce((a, b) => a + b, 0);
    if (basic > 9) basic = basic.toString().split('').reduce((a, b) => a + +b, 0);
    digits.push(basic);
  }
  const map = {};
  digits.forEach((d) => {
    map[d] = (map[d] || 0) + 1;
  });
  return map;
};

export default function RelationshipChecker() {
  const [maleName, setMaleName] = useState('');
  const [maleDOB, setMaleDOB] = useState('');
  const [femaleName, setFemaleName] = useState('');
  const [femaleDOB, setFemaleDOB] = useState('');
  const [result, setResult] = useState('');

  const handleCheck = () => {
    if (!maleDOB || !femaleDOB) {
      setResult('⚠️ Please enter both birth dates.');
      return;
    }

    const maleDestiny = calculateDestinyNumber(maleDOB);
    const femaleDestiny = calculateDestinyNumber(femaleDOB);
    const maleChart = generateChart(maleDOB, maleDestiny);
    const femaleChart = generateChart(femaleDOB, femaleDestiny);

    const verdict = compatibilityChart[maleDestiny];
    let matchLabel = '❌ Not Compatible.';
    if (verdict.good.includes(femaleDestiny)) matchLabel = '✅ Good Match!';
    else if (verdict.neutral.includes(femaleDestiny)) matchLabel = '⚖️ Neutral Match.';

    const shared = Object.keys(maleChart).filter((n) => femaleChart[n]);
    const countMale6 = maleChart[6] || 0;
    const countFemale6 = femaleChart[6] || 0;
    const countMale7 = maleChart[7] || 0;
    const countFemale7 = femaleChart[7] || 0;

    let analysis = '';

    if (shared.includes('3') && shared.includes('6')) {
      analysis += `You both share powerful Venus and Jupiter energy (3 & 6). This blend brings expansion, love, luxury, and emotional warmth. `;
    }
    if ((maleChart[6] || 0) >= 2 || (femaleChart[6] || 0) >= 2) {
      analysis += `Presence of double 6 suggests a strong romantic attraction and emotional bonding. `;
    }
    if (shared.includes('1') && shared.includes('7')) {
      analysis += `Combination of 1 & 7 indicates individuality and spiritual depth in your connection. `;
    }
    if ((countMale7 >= 3 || countFemale7 >= 3) || (shared.includes('7') && shared.includes('6'))) {
      analysis += `Too many 7s or 6s may sometimes bring misunderstandings due to emotional over-sensitivity. `;
    }

    if (analysis === '') {
      analysis = `Your connection shows potential for growth. Explore each other's emotional needs for a balanced bond.`;
    }

    setResult(`👦 ${maleName} (Destiny ${maleDestiny}) × 👧 ${femaleName} (Destiny ${femaleDestiny}) → ${matchLabel}\n${analysis}`);
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-5xl font-extrabold text-center mb-10 text-pink-500 drop-shadow-lg">
        💘 Relationship Compatibility
      </h1>

      <div className="max-w-5xl mx-auto bg-gray-900/70 border border-pink-500 rounded-2xl shadow-2xl p-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-lg font-semibold mb-1 text-pink-300">👦 Male Name</label>
            <input
              type="text"
              value={maleName}
              onChange={(e) => setMaleName(e.target.value)}
              className="w-full px-4 py-2 bg-black border border-gray-600 rounded-md text-white"
            />
            <label className="block mt-4 text-lg font-semibold mb-1 text-pink-300">📅 DOB</label>
            <input
              type="date"
              value={maleDOB}
              onChange={(e) => setMaleDOB(e.target.value)}
              className="w-full px-4 py-2 bg-black border border-gray-600 rounded-md text-white"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-1 text-pink-300">👧 Female Name</label>
            <input
              type="text"
              value={femaleName}
              onChange={(e) => setFemaleName(e.target.value)}
              className="w-full px-4 py-2 bg-black border border-gray-600 rounded-md text-white"
            />
            <label className="block mt-4 text-lg font-semibold mb-1 text-pink-300">📅 DOB</label>
            <input
              type="date"
              value={femaleDOB}
              onChange={(e) => setFemaleDOB(e.target.value)}
              className="w-full px-4 py-2 bg-black border border-gray-600 rounded-md text-white"
            />
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleCheck}
            className="bg-pink-600 hover:bg-pink-700 text-white text-lg font-semibold px-6 py-3 rounded-lg transition"
          >
            💞 Check Compatibility
          </button>
        </div>

        {result && (
          <div className="text-center text-lg font-medium whitespace-pre-line p-5 bg-black/80 border border-pink-500 rounded-xl shadow-md">
            {result}
          </div>
        )}
      </div>
    </div>
  );
}
