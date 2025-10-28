'use client';

import React from 'react';

// UI Helper: Renders the cell with count
const RenderCell = ({ number, count }) => {
  return (
    <div className="relative flex items-center justify-center border border-purple-500 h-20 sm:h-24 text-white p-2">
      {count > 0 ? (
        <>
          <span className="text-2xl sm:text-3xl font-bold">{number}</span>
          <span className="absolute top-1 right-1 text-xs bg-purple-600 text-white rounded-full h-5 w-5 flex items-center justify-center">
            {count}
          </span>
        </>
      ) : (
        <span className="text-gray-600">-</span> // Placeholder for empty cells
      )}
    </div>
  );
};

export default function NumerologyChart({ name, dob }) { // Removed unused props
  
  // BUG FIX 1: 'basicNum' logic was incorrect. 
  // e.g., Day 29 -> 2+9=11. It should become 1+1=2.
  const basicNum = (() => {
    let num = parseInt(dob.split('-')[2]); // day, e.g., 29
    while (num >= 10) {
      num = [...String(num)].reduce((a, b) => a + Number(b), 0); // 2+9=11 -> 1+1=2
    }
    return num;
  })();

  // All digits from DOB
  const digits = dob.replaceAll('-', '').split('').map(Number);

  // Destiny number logic seems correct
  const destinyNum = (() => {
    let sum = digits.reduce((a, b) => a + b, 0);
    while (sum >= 10) {
      sum = [...String(sum)].reduce((a, b) => a + Number(b), 0);
    }
    return sum;
  })();

  // Supportive numbers logic seems correct
  const supportiveNums = (() => {
    const day = parseInt(dob.split('-')[2]);
    if (day < 10) return [];
    return String(day).split('').map(Number);
  })();

  // BUG FIX 2: 'gridData' logic was filtering ALL '1's and '9's from the DOB.
  // The comment implied only century digits, but the code was wrong.
  // This version uses ALL digits from DOB, plus basic and destiny numbers.
  const gridData = (() => {
    // We use 'digits' (all numbers from DOB), not the broken 'rawDigits'
    const allDigits = [...digits, ...String(basicNum), ...String(destinyNum)].map(Number);
    const freqMap = Array(10).fill(0); // 0-9
    
    allDigits.forEach(num => {
      if (num !== 0) freqMap[num] += 1;
    });
    return freqMap;
  })();

  return (
    <div className="text-white px-2 sm:px-6 py-10 max-w-3xl mx-auto w-full">
      <h2 className="text-3xl font-bold mb-6 text-center">🔮 Numerology Chart</h2>
      
      {/* UI/Responsiveness Fix: Changed to grid for better mobile layout */}
      <div className="bg-neutral-900 border border-purple-600 p-4 sm:p-6 rounded-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Date of Birth:</strong> {dob}</p>
          <p><strong>Basic Number:</strong> {basicNum}</p>
          <p><strong>Destiny Number:</strong> {destinyNum}</p>
          <p className="col-span-1 sm:col-span-2">
            <strong>Supportive Numbers:</strong> {supportiveNums.length > 0 ? supportiveNums.join(' & ') : 'None'}
          </p>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">🧮 3x3 Numerology Grid</h3>
          <div className="grid grid-cols-3 gap-1 sm:gap-2 bg-black border border-purple-700 p-1 sm:p-2 rounded-md">
            {/* UI Fix: Uses new RenderCell component to prevent text overflow */}
            <RenderCell number={4} count={gridData[4]} />
            <RenderCell number={9} count={gridData[9]} />
            <RenderCell number={2} count={gridData[2]} />
            <RenderCell number={3} count={gridData[3]} />
            <RenderCell number={5} count={gridData[5]} />
            <RenderCell number={7} count={gridData[7]} />
            <RenderCell number={8} count={gridData[8]} />
            <RenderCell number={1} count={gridData[1]} />
            <RenderCell number={6} count={gridData[6]} />
          </div>
        </div>
      </div>

      <p className="text-center mt-6 text-sm italic text-neutral-400">
        Based on traditional Vedic Numerology principles.
      </p>
    </div>
  );
}