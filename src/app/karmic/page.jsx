'use client';

import { useState } from 'react';

export default function KarmicDebtPage() {
  const [dob, setDob] = useState('');
  const [name, setName] = useState('');
  const [result, setResult] = useState(null);

  const handleAnalyze = () => {
    if (!dob || !name) return;

    const [year, month, day] = dob.split('-');
    const dayStr = day.padStart(2, '0');
    const monthStr = month.padStart(2, '0');
    const yearStr = year;

    const sumDigits = (str) => [...str].map(Number).reduce((a, b) => a + b, 0);

    const capitalizeWords = (str) =>
      str.replace(/\b\w/g, (char) => char.toUpperCase());

    const formattedName = capitalizeWords(name.trim());

    const daySum = sumDigits(dayStr);
    const monthSum = sumDigits(monthStr);
    const yearSum = sumDigits(yearStr);
    const totalBeforeReduction = daySum + monthSum + yearSum;

    let path = totalBeforeReduction;
    while (path > 9) path = sumDigits(String(path));

    const karmicNumbers = [13, 14, 16, 19];
    const hasKarmicDebt = karmicNumbers.includes(totalBeforeReduction);

    const karmicInfo = {
      13: {
        title: 'Karmic Debt Number 13',
        case: 'The 13 indicates abuse of morality in a past life, often dealing with material gain. With karmic debt of 13 in your core number calculations, you’ll have to work much harder than others to achieve success. You’ll face obstacles on the road to progress and stability.',
        remedy: 'Avoid shortcuts. Build discipline and take steady, methodical steps to remove this karmic influence and fulfill your greater purpose.',
      },
      14: {
        title: 'Karmic Debt Number 14',
        case: 'The 14 stems from freedom-related imbalances in past lifetimes. It reflects misuse of liberty, addictive tendencies, or lack of personal boundaries. You may face instability and restlessness.',
        remedy: 'Learn self-control, establish strong boundaries, and balance your need for freedom with responsibility.',
      },
      16: {
        title: 'Karmic Debt Number 16',
        case: 'This number is tied to past-life betrayal or abuse of love. In this life, it manifests as repeated emotional pain or destructive relationships. You may experience deep transformation through personal loss.',
        remedy: 'Heal emotional wounds, develop spiritual awareness, and build inner strength through humility and honesty.',
      },
      19: {
        title: 'Karmic Debt Number 19',
        case: 'The 19 indicates an abuse of power or control in a past life. It manifests in this life as challenges in asking for help, ego struggles, or experiencing isolation.',
        remedy: 'Serve others with compassion, let go of control, and cultivate interdependence instead of excessive independence.',
      },
    };

    const karma = karmicInfo[totalBeforeReduction];

    setResult({
      dob: `${dayStr}-${monthStr}-${yearStr}`,
      name: formattedName,
      path,
      totalBeforeReduction,
      hasKarmicDebt,
      ...(karma || {})
    });
  };

  return (
    <div className="h-screen w-screen overflow-auto bg-black text-white px-4 py-10 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-center drop-shadow-xl">🔮 Karmic Debt Analysis</h1>

      <div className="w-full max-w-xl bg-white/5 border border-purple-700 rounded-xl p-6 text-lg shadow-xl mb-8 space-y-6">
        <div>
          <label className="block mb-2 text-purple-300">Your Full Name</label>
          <input
            type="text"
            placeholder="e.g. Aditya Mishra"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-md bg-black/50 text-white placeholder-gray-500 border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
        <div>
          <label className="block mb-2 text-purple-300">Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full p-3 rounded-md bg-black/50 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
        <button
          onClick={handleAnalyze}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-lg shadow-lg hover:scale-105 hover:brightness-110 transition"
        >
          Get My Karmic Analysis
        </button>
      </div>

      {result && (
        <div className="w-full max-w-2xl space-y-8">
          <div className="bg-white/10 border border-blue-500 rounded-xl p-6 shadow-md space-y-2">
            <p><span className="font-semibold text-blue-300">👤 Name:</span> {result.name || 'N/A'}</p>
            <p><span className="font-semibold text-blue-300">📅 Date of Birth:</span> {result.dob}</p>
            <p><span className="font-semibold text-blue-300">🔢 Life Path Number:</span> {result.path}</p>
            <p><span className="font-semibold text-blue-300">🔮 Karmic Number (Before Reduction):</span> {result.totalBeforeReduction}</p>
          </div>

          {result.hasKarmicDebt ? (
            <div className="bg-red-900/60 border border-red-400 p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold text-red-200 mb-4">🚨 {result.title}</h2>
              <p className="mb-2"><span className="font-semibold text-red-300">Cause:</span> {result.case}</p>
              <p className="mb-2"><span className="font-semibold text-red-300">🧘 Remedy:</span> {result.remedy}</p>
              <p className="mt-3 italic text-sm text-gray-300">Facing this karmic debt means you are here to break a past life pattern.</p>
            </div>
          ) : (
            <div className="bg-green-900/60 border border-green-400 p-6 rounded-xl shadow-md">
              <p className="text-xl font-semibold text-green-300 mb-2">✅ No Karmic Debt Detected</p>
              <p className="text-gray-100">You're not carrying karmic burdens through your date of birth. Stay mindful and aligned in your path forward. 🌟</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
