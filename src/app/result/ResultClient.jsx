'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const numberPositionMap = {
  1: [0, 1],
  2: [2, 0],
  3: [0, 0],
  4: [2, 2],
  5: [1, 2],
  6: [1, 0],
  7: [1, 1],
  8: [2, 1],
  9: [0, 2],
};

const dashaDurations = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9 };
const weekdayValues = { 0: 1, 1: 2, 2: 9, 3: 5, 4: 3, 5: 6, 6: 8 };

const luckyInfoMap = {
  1: { colors: ['Golden', 'Orange'], direction: 'East', luckyNumbers: [1, 3] },
  2: { colors: ['Milky white', 'Cream'], direction: 'Northwest', luckyNumbers: [1, 3] },
  3: { colors: ['Yellow', 'Orange'], direction: 'Northeast', luckyNumbers: [1, 3] },
  4: { colors: ['Blue', 'Black'], direction: 'Southwest', luckyNumbers: [6, 5] },
  5: { colors: ['Green'], direction: 'North', luckyNumbers: [6, 5] },
  6: { colors: ['White', 'Metallic color'], direction: 'Southeast', luckyNumbers: [6, 5] },
  7: { colors: ['Sandal Grey'], direction: 'Southwest and Space', luckyNumbers: [7, 9] },
  8: { colors: ['Blue', 'Black'], direction: 'West', luckyNumbers: [8, 7] },
  9: { colors: ['Red'], direction: 'South', luckyNumbers: [7, 9] },
};

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || '';
  const dob = searchParams.get('dob') || '';

  const [basicNumber, setBasicNumber] = useState(null);
  const [destinyNumber, setDestinyNumber] = useState(null);
  const [supportiveNumbers, setSupportiveNumbers] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [currentDasha, setCurrentDasha] = useState(null);
  const [currentDashaPeriod, setCurrentDashaPeriod] = useState({});
  const [currentAntardasha, setCurrentAntardasha] = useState(null);
  const [currentAntardashaPeriod, setCurrentAntardashaPeriod] = useState({});
  const [futureYears, setFutureYears] = useState(10);
  const [futureDashas, setFutureDashas] = useState([]);
  const [antardashaYears, setAntardashaYears] = useState(5);
  const [futureAntardashas, setFutureAntardashas] = useState([]);

  const sumToSingleDigit = (str) => {
    let s = [...str].map(Number).reduce((a, b) => a + b, 0);
    while (s > 9) {
      s = [...String(s)].map(Number).reduce((a, b) => a + b, 0);
    }
    return s;
  };

  const navigateToTool = (path, additionalParams = {}) => {
    const query = new URLSearchParams();
    query.set('name', name);
    query.set('dob', dob);
    
    if (basicNumber) query.set('basicNumber', basicNumber);
    if (destinyNumber) query.set('destinyNumber', destinyNumber);
    if (currentDasha) query.set('maha', currentDasha);
    if (currentAntardasha) query.set('antar', currentAntardasha);
    
    const chartDigits = gridData.flat().flatMap((cell) => cell.map((item) => item.value));
    chartDigits.forEach((num) => query.append('gridNumbers', num));
    
    Object.entries(additionalParams).forEach(([key, value]) => {
      query.set(key, value);
    });
    
    window.location.href = `${path}?${query.toString()}`;
  };

  useEffect(() => {
    if (!dob) return;

    const [yearStr, monthStr, dayStr] = dob.split('-');
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);
    const day = parseInt(dayStr);
    const dobDate = new Date(`${yearStr}-${monthStr}-${dayStr}`);
    const today = new Date();

    if (dobDate > today) {
      alert('Date of Birth cannot be in the future!');
      return;
    }

    // Basic Number
    let basicRaw = [...dayStr].map(Number).reduce((a, b) => a + b, 0);
    const basic = basicRaw > 9 ? sumToSingleDigit(String(basicRaw)) : basicRaw;
    setBasicNumber(basic);

    // Destiny Number
    const allDigits = [...dayStr, ...monthStr, ...yearStr].map(Number);
    let destinyRaw = allDigits.reduce((a, b) => a + b, 0);
    destinyRaw = sumToSingleDigit(String(destinyRaw));
    setDestinyNumber(destinyRaw);

    // Supportive Numbers
    const supportive = (day > 9 && ![10, 20, 30].includes(day))
      ? [...dayStr].map(Number)
      : [];
    setSupportiveNumbers(supportive);

    // Chart Digits
    const gridDigits = [...dayStr, ...monthStr, ...yearStr.slice(2)]
      .map(Number)
      .filter(n => n !== 0);
    let chartDigits = [...gridDigits, destinyRaw];
    if (!(day <= 9 || [10, 20, 30].includes(day))) chartDigits.push(basic);
    supportive.forEach(num => { if (!chartDigits.includes(num)) chartDigits.push(num); });

    // Determine Mahadasha
    const dashaCycle = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const startIndex = dashaCycle.indexOf(basic);
    const orderedCycle = [...dashaCycle.slice(startIndex), ...dashaCycle.slice(0, startIndex)];

    let foundDasha = null;
    let currDate = new Date(dobDate);
    let cycleIndex = 0;

    while (!foundDasha) {
      const dasha = orderedCycle[cycleIndex % 9];
      const duration = dashaDurations[dasha];
      const end = new Date(currDate);
      end.setFullYear(end.getFullYear() + duration);
      
      if (today >= currDate && today < end) {
        foundDasha = dasha;
        setCurrentDasha(dasha);
        setCurrentDashaPeriod({
          start: currDate.toLocaleDateString('en-GB'),
          end: end.toLocaleDateString('en-GB'),
        });
        break;
      }

      currDate = end;
      cycleIndex++;
    }

    // Determine Antardasha
    const bdayThisYear = new Date(today.getFullYear(), month - 1, day);
    const antardashaYear = today < bdayThisYear ? today.getFullYear() - 1 : today.getFullYear();
    const weekday = new Date(antardashaYear, month - 1, day).getDay();
    const weekdayVal = weekdayValues[weekday];
    let antarRaw = basic + month + parseInt(String(antardashaYear).slice(2)) + weekdayVal;
    antarRaw = sumToSingleDigit(String(antarRaw));
    setCurrentAntardasha(antarRaw);
    setCurrentAntardashaPeriod({
      start: new Date(antardashaYear, month - 1, day).toLocaleDateString('en-GB'),
      end: new Date(antardashaYear + 1, month - 1, day - 1).toLocaleDateString('en-GB'),
    });

    // Build grid data - Show multiple occurrences as separate numbers
    const digitMap = {};
    chartDigits.forEach(num => {
      digitMap[num] = (digitMap[num] || 0) + 1;
    });

    if (foundDasha !== null && foundDasha === antarRaw) {
      digitMap[foundDasha] = (digitMap[foundDasha] || 0) + 2;
    } else {
      if (foundDasha !== null) {
        digitMap[foundDasha] = (digitMap[foundDasha] || 0) + 1;
      }
      digitMap[antarRaw] = (digitMap[antarRaw] || 0) + 1;
    }

    const tempGrid = Array(3).fill(null).map(() => Array(3).fill(null).map(() => []));
    Object.entries(digitMap).forEach(([numStr, count]) => {
      const num = parseInt(numStr);
      const pos = numberPositionMap[num];
      if (!pos) return;
      const [r, c] = pos;
      
      // Create multiple objects for each occurrence
      const totalCount = count;
      let mahaAdded = false;
      let antarAdded = false;
      
      for (let i = 0; i < totalCount; i++) {
        let highlight = '';
        if (foundDasha === num && !mahaAdded) {
          highlight = 'maha';
          mahaAdded = true;
        } else if (antarRaw === num && !antarAdded) {
          highlight = 'antar';
          antarAdded = true;
        }
        
        tempGrid[r][c].push({ 
          value: num, 
          highlight: highlight
        });
      }
    });
    setGridData(tempGrid);
  }, [dob]);

  const getFutureDashas = () => {
    if (!dob || !basicNumber || !currentDashaPeriod?.end) return;
    const [yearStr, monthStr, dayStr] = dob.split('-');
    const dobDate = new Date(`${yearStr}-${monthStr}-${dayStr}`);
    const dashaCycle = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const startIndex = dashaCycle.indexOf(basicNumber);
    const orderedCycle = [...dashaCycle.slice(startIndex), ...dashaCycle.slice(0, startIndex)];
  
    let curr = new Date(dobDate);
    let totalYears = 0;
    let currentIndex = 0;
    const timeline = [];
  
    while (totalYears < futureYears) {
      const dasha = orderedCycle[currentIndex % 9];
      const duration = dashaDurations[dasha];
      const start = new Date(curr);
      const end = new Date(curr);
      end.setFullYear(end.getFullYear() + duration);
      timeline.push({
        dasha,
        start: start.toLocaleDateString('en-GB'),
        end: end.toLocaleDateString('en-GB'),
        duration: `${duration} yrs`,
      });
      curr = end;
      totalYears += duration;
      currentIndex++;
    }
    setFutureDashas(timeline);
  };

  const getFutureAntardashas = () => {
    if (!dob || !basicNumber) return;
    const [yearStr, monthStr, dayStr] = dob.split('-');
    const month = parseInt(monthStr);
    const day = parseInt(dayStr);
  
    const today = new Date();
    const thisYear = today.getFullYear();
    const bdayThisYear = new Date(thisYear, month - 1, day);
    const startYear = today < bdayThisYear ? thisYear - 1 : thisYear;
  
    const table = [];
    for (let i = 0; i < antardashaYears; i++) {
      const year = startYear + i;
      const weekday = new Date(year, month - 1, day).getDay();
      const weekdayVal = weekdayValues[weekday];
      let val = basicNumber + month + parseInt(String(year).slice(2)) + weekdayVal;
      val = sumToSingleDigit(String(val));
      table.push({
        year,
        antardasha: val,
        start: new Date(year, month - 1, day).toLocaleDateString('en-GB'),
        end: new Date(year + 1, month - 1, day - 1).toLocaleDateString('en-GB'),
      });
    }
    setFutureAntardashas(table);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white px-4 py-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#ffda73] tracking-tight">
          Numerology Insights
        </h1>
        <div className="h-1 w-40 bg-gradient-to-r from-[#d4af37] to-[#ffda73] mx-auto rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Row: Personal Info + Grid + Current Periods */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Personal Profile */}
          <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-6 border border-[#d4af37]/20 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#ffda73] flex items-center justify-center mr-3 shadow-md">
                <span className="text-lg text-[#0b0f19] font-bold">👤</span>
              </div>
              <h2 className="text-xl font-bold text-white">Personal Profile</h2>
            </div>
            
            <div className="space-y-5">
              {/* NAME Section - Fixed */}
              <div className="bg-[#0b0f19] rounded-lg p-4 border border-[#d4af37]/10">
                <p className="text-sm text-gray-400 font-medium mb-2">NAME</p>
                <div className="min-h-[2.5rem]">
                  <p className="text-white font-semibold text-lg break-words leading-tight">
                    {name || 'Not provided'}
                  </p>
                </div>
              </div>

              {/* DATE OF BIRTH */}
              <div className="bg-[#0b0f19] rounded-lg p-4 border border-[#d4af37]/10">
                <p className="text-sm text-gray-400 font-medium mb-1">DATE OF BIRTH</p>
                <p className="text-white font-semibold text-lg">{dob || 'Not provided'}</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-[#0b0f19] to-[#121829] rounded-lg p-4 text-center border border-[#d4af37]/20">
                  <p className="text-sm text-gray-400 font-medium mb-2">BASIC</p>
                  <div className="text-2xl font-bold text-[#ffda73]">{basicNumber || '-'}</div>
                </div>
                <div className="bg-gradient-to-br from-[#0b0f19] to-[#121829] rounded-lg p-4 text-center border border-[#d4af37]/20">
                  <p className="text-sm text-gray-400 font-medium mb-2">DESTINY</p>
                  <div className="text-2xl font-bold text-[#ffda73]">{destinyNumber || '-'}</div>
                </div>
                <div className="bg-gradient-to-br from-[#0b0f19] to-[#121829] rounded-lg p-4 text-center border border-[#d4af37]/20">
                  <p className="text-sm text-gray-400 font-medium mb-2">SUPPORTIVE</p>
                  <div className="text-lg font-bold text-white">
                    {supportiveNumbers.length ? (
                      <div className="flex justify-center space-x-1">
                        {supportiveNumbers.map((num, idx) => (
                          <span key={idx} className="bg-[#d4af37] text-[#0b0f19] px-2 py-1 rounded text-sm font-bold">
                            {num}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 font-normal">None</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Numerology Grid */}
          <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-6 border border-[#d4af37]/20 shadow-lg">
            <h2 className="text-xl font-bold mb-6 text-white text-center">Numerology Grid</h2>
            <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
              {gridData.flat().map((cell, i) => (
                <div
                  key={i}
                  className="aspect-square flex items-center justify-center rounded-xl bg-gradient-to-br from-[#0b0f19] to-[#121829] border border-[#d4af37]/30 hover:border-[#ffda73] transition-all duration-300 shadow-inner"
                >
                  <div className="flex flex-wrap justify-center items-center gap-1 max-w-full">
                    {cell.map((item, idx) => {
                      const size = cell.length > 4 ? 'text-xs' : cell.length > 2 ? 'text-sm' : 'text-base';
                      return (
                        <div key={idx} className="flex flex-col items-center">
                          <span
                            className={`rounded-lg px-2 py-1 font-bold ${size} transition-all duration-300 ${
                              item.highlight === 'maha' 
                                ? 'bg-[#d4af37] text-[#0b0f19] shadow-lg' 
                                : item.highlight === 'antar' 
                                ? 'bg-green-500 text-white shadow-lg' 
                                : 'bg-[#1e293b] text-white border border-[#334155]'
                            }`}
                          >
                            {item.value}
                          </span>
                          {item.highlight && (
                            <span className={`text-[10px] font-bold mt-1 ${
                              item.highlight === 'maha' ? 'text-[#d4af37]' : 'text-green-400'
                            }`}>
                              {item.highlight === 'maha' ? 'M' : 'A'}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            {/* Grid Notation */}
            <div className="mt-4 text-center space-y-2">
              <div className="flex justify-center items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-[#d4af37] rounded"></div>
                  <span className="text-gray-300">M = Mahadasha</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-gray-300">A = Antardasha</span>
                </div>
              </div>
            </div>
          </div>

          {/* Current Periods */}
          <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-6 border border-[#d4af37]/20 shadow-lg">
            <h2 className="text-xl font-bold mb-6 text-white text-center">Current Periods</h2>
            <div className="space-y-5">
              {currentDasha && (
                <div className="bg-gradient-to-r from-[#d4af37]/10 to-transparent rounded-xl p-5 border-2 border-[#d4af37] hover:bg-[#d4af37]/15 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-[#d4af37] flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                        <span className="text-lg text-[#0b0f19] font-bold">M</span>
                      </div>
                      <h3 className="font-bold text-white text-lg">Mahadasha</h3>
                    </div>
                    <span className="text-xs text-[#ffda73] font-bold bg-[#d4af37]/20 px-2 py-1 rounded">Current</span>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold text-lg">
                      <span className="text-2xl text-[#ffda73] font-bold">{currentDasha}</span> • {currentDashaPeriod.start} to {currentDashaPeriod.end}
                    </p>
                  </div>
                </div>
              )}
              {currentAntardasha && (
                <div className="bg-gradient-to-r from-green-500/10 to-transparent rounded-xl p-5 border-2 border-green-500 hover:bg-green-500/15 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                        <span className="text-lg text-white font-bold">A</span>
                      </div>
                      <h3 className="font-bold text-white text-lg">Antardasha</h3>
                    </div>
                    <span className="text-xs text-green-300 font-bold bg-green-500/20 px-2 py-1 rounded">Current</span>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold text-lg">
                      <span className="text-2xl text-green-300 font-bold">{currentAntardasha}</span> • {currentAntardashaPeriod.start} to {currentAntardashaPeriod.end}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Middle Row: Lucky Details + Future Periods */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Lucky Details */}
          {destinyNumber && luckyInfoMap[destinyNumber] && (
            <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-6 border border-[#d4af37]/20 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#ffda73] flex items-center justify-center mr-3 shadow-md">
                  <span className="text-lg text-[#0b0f19] font-bold">✨</span>
                </div>
                <h2 className="text-xl font-bold text-white">Lucky Attributes</h2>
              </div>
              
              <div className="space-y-5">
                <div className="bg-[#0b0f19] rounded-xl p-4 border border-[#d4af37]/10">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#d4af37] to-[#ffda73] flex items-center justify-center mr-3 shadow-sm">
                      <span className="text-sm text-[#0b0f19]">🎨</span>
                    </div>
                    <h3 className="font-bold text-white">Lucky Colors</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {luckyInfoMap[destinyNumber].colors.map((color, idx) => (
                      <span 
                        key={idx}
                        className="bg-[#d4af37]/20 text-white px-3 py-2 rounded-lg text-sm font-semibold border border-[#d4af37]/30"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#0b0f19] rounded-xl p-4 border border-[#d4af37]/10">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#d4af37] to-[#ffda73] flex items-center justify-center mr-2 shadow-sm">
                        <span className="text-sm text-[#0b0f19]">🧭</span>
                      </div>
                      <h3 className="font-bold text-white text-sm">Direction</h3>
                    </div>
                    <p className="text-white font-semibold text-lg mt-2">{luckyInfoMap[destinyNumber].direction}</p>
                  </div>

                  <div className="bg-[#0b0f19] rounded-xl p-4 border border-[#d4af37]/10">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#d4af37] to-[#ffda73] flex items-center justify-center mr-2 shadow-sm">
                        <span className="text-sm text-[#0b0f19]">🔢</span>
                      </div>
                      <h3 className="font-bold text-white text-sm">Lucky Numbers</h3>
                    </div>
                    <div className="flex space-x-2 mt-2">
                      {luckyInfoMap[destinyNumber].luckyNumbers.map((num, idx) => (
                        <span 
                          key={idx}
                          className="bg-[#d4af37] text-[#0b0f19] px-3 py-2 rounded-lg text-sm font-bold flex-1 text-center shadow-sm"
                        >
                          {num}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Future Periods */}
          <div className="xl:col-span-2 space-y-6">
            {/* Future Mahadashas */}
            <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-6 border border-[#d4af37]/20 shadow-lg">
              <h2 className="text-xl font-bold mb-6 text-white">Future Mahadashas</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <select
                    value={futureYears}
                    onChange={(e) => setFutureYears(parseInt(e.target.value))}
                    className="flex-1 bg-[#0b0f19] border border-[#d4af37]/30 rounded-lg px-4 py-3 text-white font-semibold focus:border-[#ffda73] focus:outline-none transition-colors"
                  >
                    {[10, 20, 30, 50, 70, 100].map((y) => (
                      <option key={y} value={y}>{y} years</option>
                    ))}
                  </select>
                  <button
                    onClick={getFutureDashas}
                    className="bg-[#d4af37] text-[#0b0f19] px-6 py-3 rounded-lg font-bold text-sm hover:bg-[#ffda73] transition-colors shadow-md hover:shadow-lg"
                  >
                    Get Timeline
                  </button>
                </div>
                {futureDashas.length > 0 && (
                  <div className="max-h-80 overflow-y-auto rounded-lg border border-[#d4af37]/20">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-[#0b0f19] border-b border-[#d4af37]/30">
                        <tr>
                          <th className="text-left p-4 text-white font-bold">Dasha</th>
                          <th className="text-left p-4 text-white font-bold">Start Date</th>
                          <th className="text-left p-4 text-white font-bold">End Date</th>
                          <th className="text-left p-4 text-white font-bold">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {futureDashas.map((row, idx) => {
                          const today = new Date();
                          const startParts = row.start.split('/');
                          const endParts = row.end.split('/');
                          const startDate = new Date(`${startParts[2]}-${startParts[1]}-${startParts[0]}`);
                          const endDate = new Date(`${endParts[2]}-${endParts[1]}-${endParts[0]}`);
                          const isCurrent = today >= startDate && today <= endDate;
                          
                          return (
                            <tr 
                              key={idx} 
                              className={`border-b border-[#d4af37]/10 transition-colors ${
                                isCurrent ? 'bg-[#d4af37]/10' : 'hover:bg-[#0b0f19]/50'
                              }`}
                            >
                              <td className="p-4">
                                {isCurrent ? (
                                  <span className="bg-[#d4af37] text-[#0b0f19] px-3 py-2 rounded text-sm font-bold shadow-sm">
                                    Current: {row.dasha}
                                  </span>
                                ) : (
                                  <span className="font-bold text-white">{row.dasha}</span>
                                )}
                              </td>
                              <td className="p-4 font-semibold">{row.start}</td>
                              <td className="p-4 font-semibold">{row.end}</td>
                              <td className="p-4">
                                <span className="bg-[#d4af37]/20 text-[#ffda73] px-3 py-1 rounded-full text-sm font-bold">
                                  {row.duration}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Future Antardashas */}
            <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-6 border border-[#d4af37]/20 shadow-lg">
              <h2 className="text-xl font-bold mb-6 text-white">Future Antardashas</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <select
                    value={antardashaYears}
                    onChange={(e) => setAntardashaYears(parseInt(e.target.value))}
                    className="flex-1 bg-[#0b0f19] border border-[#d4af37]/30 rounded-lg px-4 py-3 text-white font-semibold focus:border-[#ffda73] focus:outline-none transition-colors"
                  >
                    {[5, 10, 15].map((y) => (
                      <option key={y} value={y}>{y} years</option>
                    ))}
                  </select>
                  <button
                    onClick={getFutureAntardashas}
                    className="bg-[#d4af37] text-[#0b0f19] px-6 py-3 rounded-lg font-bold text-sm hover:bg-[#ffda73] transition-colors shadow-md hover:shadow-lg"
                  >
                    Get Timeline
                  </button>
                </div>
                {futureAntardashas.length > 0 && (
                  <div className="max-h-80 overflow-y-auto rounded-lg border border-[#d4af37]/20">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-[#0b0f19] border-b border-[#d4af37]/30">
                        <tr>
                          <th className="text-left p-4 text-white font-bold">Year</th>
                          <th className="text-left p-4 text-white font-bold">Antardasha</th>
                          <th className="text-left p-4 text-white font-bold">Period</th>
                        </tr>
                      </thead>
                      <tbody>
                        {futureAntardashas.map((row, idx) => {
                          const now = new Date();
                          const startParts = row.start.split('/');
                          const endParts = row.end.split('/');
                          const startDate = new Date(`${startParts[2]}-${startParts[1]}-${startParts[0]}`);
                          const endDate = new Date(`${endParts[2]}-${endParts[1]}-${endParts[0]}`);
                          const isCurrent = now >= startDate && now <= endDate;

                          return (
                            <tr key={idx} className="border-b border-[#d4af37]/10 hover:bg-[#0b0f19]/50 transition-colors">
                              <td className="p-4 font-bold">{row.year}</td>
                              <td className="p-4">
                                {isCurrent ? (
                                  <span className="bg-green-500 text-white px-3 py-2 rounded text-sm font-bold shadow-sm">
                                    Current: {row.antardasha}
                                  </span>
                                ) : (
                                  <span className="font-bold">{row.antardasha}</span>
                                )}
                              </td>
                              <td className="p-4 font-semibold text-sm">{row.start} to {row.end}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Tools */}
        <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-8 border border-[#d4af37]/20 shadow-lg">
          <h2 className="text-3xl font-bold mb-8 text-center text-white tracking-tight">Advanced Numerology Tools</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: '🔠', title: 'Name Analysis', desc: 'Discover hidden name meanings', path: '/name-checker' },
              { icon: '📆', title: 'Monthly Dasha', desc: 'Precise monthly predictions', path: '/monthly-dasha' },
              { icon: '💼', title: 'Career Guidance', desc: 'Find ideal professions', path: '/profession' },
              { icon: '🔮', title: 'Life Predictions', desc: 'Comprehensive future insights', path: '/predictions' },
              { icon: '🧬', title: 'Health Analysis', desc: 'Health tendencies & advice', path: '/health-checker' },
              { icon: '🔄', title: 'Karmic Debt', desc: 'Past life karmic debts', path: '/karmic' },
              { icon: '🏠', title: 'Real Estate', desc: 'Property investment guidance', path: '/real-estate' },
              { icon: '💑', title: 'Relationship', desc: 'Partner compatibility analysis', path: '/relationship-checker' },
            ].map((tool, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#0b0f19] to-[#121829] rounded-xl p-5 border border-[#d4af37]/20 hover:border-[#ffda73] hover:scale-105 transition-all duration-300 cursor-pointer group shadow-md hover:shadow-lg"
                onClick={() => navigateToTool(tool.path)}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#ffda73] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <span className="text-xl text-[#0b0f19]">{tool.icon}</span>
                  </div>
                  <h3 className="font-bold text-white text-lg">{tool.title}</h3>
                  <p className="text-gray-300 text-sm leading-tight">{tool.desc}</p>
                  <button className="w-full bg-gradient-to-r from-[#d4af37] to-[#ffda73] text-[#0b0f19] py-2 rounded-lg font-bold text-sm hover:scale-105 transition-transform shadow-sm">
                    Explore
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Horoscope */}
          <div className="text-center pt-6 border-t border-[#d4af37]/20">
            <button
              onClick={() => navigateToTool('/horoscope')}
              className="bg-gradient-to-r from-[#d4af37] to-[#ffda73] text-[#0b0f19] px-8 py-3 rounded-lg font-bold text-lg hover:scale-105 transition-transform shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
            >
              <span>✨</span>
              <span>Get My Horoscope</span>
              <span>✨</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}