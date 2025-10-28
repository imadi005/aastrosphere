'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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

// Lucky info data based on destiny number
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
  const handleClick = () => {
    const query = new URLSearchParams();
    query.set('name', name);
    query.set('dob', dob);
    window.location.href = `/predictions?${query.toString()}`;
  };

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
  const [antardashaYears, setAntardashaYears] = useState(10);
  const [futureAntardashas, setFutureAntardashas] = useState([]);

  // Helper to repeatedly sum digits until one digit remains
  const sumToSingleDigit = (str) => {
    let s = [...str].map(Number).reduce((a, b) => a + b, 0);
    while (s > 9) {
      s = [...String(s)].map(Number).reduce((a, b) => a + b, 0);
    }
    return s;
  };

  useEffect(() => {
    if (!dob) return;

    const [yearStr, monthStr, dayStr] = dob.split('-');
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);
    const day = parseInt(dayStr);
    const dobDate = new Date(`${yearStr}-${monthStr}-${dayStr}`);
    const today = new Date();

    // Prevent future DOB
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

    // Chart Digits (grid digits)
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
      const dasha = orderedCycle[cycleIndex % 9];  // Cycle repeats
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

    // Build natural digitMap from chartDigits
    const digitMap = {};
    chartDigits.forEach(num => {
      digitMap[num] = (digitMap[num] || 0) + 1;
    });

    // Force-add extra occurrences:
    // If Mahadasha and Antardasha are the same, add 2 extra occurrences;
    // Otherwise, add one extra occurrence for each.
    if (foundDasha !== null && foundDasha === antarRaw) {
      digitMap[foundDasha] = (digitMap[foundDasha] || 0) + 2;
    } else {
      if (foundDasha !== null) {
        digitMap[foundDasha] = (digitMap[foundDasha] || 0) + 1;
      }
      digitMap[antarRaw] = (digitMap[antarRaw] || 0) + 1;
    }

    // Build final grid (each cell is an array of objects)
    const tempGrid = Array(3).fill(null).map(() => Array(3).fill(null).map(() => []));
    Object.entries(digitMap).forEach(([numStr, count]) => {
      const num = parseInt(numStr);
      const pos = numberPositionMap[num];
      if (!pos) return;
      const [r, c] = pos;
      // If both are same:
      if (foundDasha === num && antarRaw === num) {
        // Push normal occurrences (count - 2) then add one 'maha' and one 'antar'
        for (let i = 0; i < Math.max(count - 2, 0); i++) {
          tempGrid[r][c].push({ value: num, highlight: '' });
        }
        tempGrid[r][c].push({ value: num, highlight: 'maha' });
        tempGrid[r][c].push({ value: num, highlight: 'antar' });
      } else if (foundDasha === num) {
        for (let i = 0; i < Math.max(count - 1, 0); i++) {
          tempGrid[r][c].push({ value: num, highlight: '' });
        }
        tempGrid[r][c].push({ value: num, highlight: 'maha' });
      } else if (antarRaw === num) {
        for (let i = 0; i < Math.max(count - 1, 0); i++) {
          tempGrid[r][c].push({ value: num, highlight: '' });
        }
        tempGrid[r][c].push({ value: num, highlight: 'antar' });
      } else {
        for (let i = 0; i < count; i++) {
          tempGrid[r][c].push({ value: num, highlight: '' });
        }
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
    const startYear = today < bdayThisYear ? thisYear - 1 : thisYear; // Start from correct Antardasha year
  
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
    <div className="h-screen w-screen overflow-auto bg-black text-white px-4 py-10 flex flex-col items-center">
      {/* Header Section */}
      <div className="w-full max-w-6xl text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
          Numerology Chart
        </h1>
        <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6 rounded-full"></div>
      </div>

      {/* Personal Info Card */}
      <div className="w-full max-w-2xl bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-purple-500/30 shadow-lg shadow-purple-900/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                <span className="text-lg">👤</span>
              </div>
              <p className="text-lg"><span className="font-semibold text-purple-300">Name:</span> {name}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                <span className="text-lg">📅</span>
              </div>
              <p className="text-lg"><span className="font-semibold text-purple-300">Date of Birth:</span> {dob}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                <span className="text-lg">🔢</span>
              </div>
              <p className="text-lg"><span className="font-semibold text-purple-300">Basic Number:</span> {basicNumber}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                <span className="text-lg">🎯</span>
              </div>
              <p className="text-lg"><span className="font-semibold text-purple-300">Destiny Number:</span> {destinyNumber}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                <span className="text-lg">🧩</span>
              </div>
              <p className="text-lg">
                <span className="font-semibold text-purple-300">Supportive Numbers:</span>{' '}
                {supportiveNumbers.length ? supportiveNumbers.join(' & ') : 'None'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lucky Details Section */}
      {destinyNumber && luckyInfoMap[destinyNumber] && (
        <div className="w-full max-w-2xl bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-purple-500/30 shadow-lg shadow-purple-900/20">
          <h2 className="text-2xl font-semibold mb-4 text-purple-300">Lucky Details for Destiny Number {destinyNumber}</h2>
          <div className="text-lg text-gray-300 space-y-2">
            <p><span className="font-semibold text-purple-400">Lucky Colors:</span> {luckyInfoMap[destinyNumber].colors.join(', ')}</p>
            <p><span className="font-semibold text-purple-400">Lucky Direction:</span> {luckyInfoMap[destinyNumber].direction}</p>
            <p><span className="font-semibold text-purple-400">Associated Lucky Numbers:</span> {luckyInfoMap[destinyNumber].luckyNumbers.join(', ')}</p>
          </div>
        </div>
      )}

      {/* Grid Section */}
      <div className="w-full max-w-md mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-center text-purple-200">Numerology Grid</h2>
        <div className="grid grid-cols-3 gap-3 p-4 bg-gray-800/50 rounded-xl border border-purple-500/30 shadow-lg">
          {gridData.flat().map((cell, i) => (
            <div
              key={i}
              className="aspect-square flex items-center justify-center rounded-lg bg-gray-900/50 border border-gray-700 hover:border-purple-400 transition-all duration-200"
            >
              <div className="flex flex-wrap justify-center items-center gap-1">
                {cell.map((item, idx) => (
                  <span
                    key={idx}
                    className={`rounded-md text-sm md:text-base px-2 py-1 leading-tight font-medium
                      ${item.highlight === 'maha' ? 'bg-yellow-400 text-gray-900 shadow-md' : ''}
                      ${item.highlight === 'antar' ? 'bg-green-400 text-gray-900 shadow-md' : ''}
                      ${!item.highlight ? 'bg-purple-600/90 text-white shadow-md' : ''}
                    `}
                  >
                    {item.value}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Periods Section */}
      <div className="w-full max-w-2xl mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center text-purple-200">Current Periods</h2>
        <div className="grid grid-cols-1 gap-4">
          {currentDasha && (
            <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-800/20 p-4 rounded-xl border border-yellow-500/30">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center border border-yellow-500/50">
                  <span className="text-lg">🌕</span>
                </div>
                <div>
                  <h3 className="font-bold text-yellow-300">Current Mahadasha</h3>
                  <p className="text-lg">
                    {currentDasha} ({currentDashaPeriod.start} to {currentDashaPeriod.end})
                  </p>
                </div>
              </div>
            </div>
          )}
          {currentAntardasha && (
            <div className="bg-gradient-to-r from-green-600/20 to-green-800/20 p-4 rounded-xl border border-green-500/30">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50">
                  <span className="text-lg">🌿</span>
                </div>
                <div>
                  <h3 className="font-bold text-green-300">Current Antardasha</h3>
                  <p className="text-lg">
                    {currentAntardasha} ({currentAntardashaPeriod.start} to {currentAntardashaPeriod.end})
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Future Dashas Sections */}
      <div className="w-full max-w-4xl space-y-12 mb-12">
        {/* Future Mahadashas */}
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/30 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center text-purple-200">Future Mahadashas</h2>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Years to View:</label>
              <select
                onChange={(e) => setFutureYears(parseInt(e.target.value))}
                className="w-full bg-gray-900/70 border border-purple-500/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                {[10, 20, 30, 40, 50, 60, 70].map((y) => (
                  <option key={y} value={y}>
                    Next {y} years
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={getFutureDashas}
              className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-purple-500/30"
            >
              Get Mahadasha Timeline
            </button>
          </div>

          {futureDashas.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900/80">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Dasha</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Start</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">End</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Duration</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900/50 divide-y divide-gray-800">
                  {futureDashas.map((row, idx) => (
                    <tr
                      key={idx}
                      className={row.dasha === currentDasha ? 'bg-yellow-500/10' : 'hover:bg-gray-800/70'}
                    >
                      <td className="px-4 py-3 whitespace-nowrap font-medium">
                        {row.dasha === currentDasha ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-400 text-gray-900">
                            Current: {row.dasha}
                          </span>
                        ) : (
                          row.dasha
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{row.start}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{row.end}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{row.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Future Antardashas */}
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-green-500/30 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center text-green-200">Future Antardashas</h2>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Years to View:</label>
              <select
                onChange={(e) => setAntardashaYears(parseInt(e.target.value))}
                className="w-full bg-gray-900/70 border border-green-500/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                {[5, 10, 15, 20].map((y) => (
                  <option key={y} value={y}>
                    Next {y} years
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={getFutureAntardashas}
              className="w-full md:w-auto bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-green-500/30"
            >
              Get Antardasha Timeline
            </button>
          </div>

          {futureAntardashas.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900/80">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-green-300 uppercase tracking-wider">Year</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-green-300 uppercase tracking-wider">Antardasha</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-green-300 uppercase tracking-wider">Start</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-green-300 uppercase tracking-wider">End</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900/50 divide-y divide-gray-800">
                  {futureAntardashas.map((row, idx) => {
                    const now = new Date();
                    const startParts = row.start.split('/');
                    const endParts = row.end.split('/');
                    const startDate = new Date(`${startParts[2]}-${startParts[1]}-${startParts[0]}`);
                    const endDate = new Date(`${endParts[2]}-${endParts[1]}-${endParts[0]}`);
                    const isCurrent = now >= startDate && now <= endDate;
                    
                    return (
                      <tr
                        key={idx}
                        className={isCurrent ? 'bg-yellow-500/10' : 'hover:bg-gray-800/70'}
                      >
                        <td className="px-4 py-3 whitespace-nowrap font-medium">{row.year}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {isCurrent ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-400 text-gray-900">
                              Current: {row.antardasha}
                            </span>
                          ) : (
                            row.antardasha
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">{row.start}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{row.end}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Tools & Analysis Section */}
      <div className="w-full max-w-6xl space-y-12 mb-16">
        <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
          Advanced Numerology Tools
        </h2>
        
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Name Analysis */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-pink-500/30 shadow-lg hover:shadow-pink-500/20 transition-all">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-pink-600/20 flex items-center justify-center mr-4 border border-pink-500/50">
                <span className="text-2xl">🔠</span>
              </div>
              <h3 className="text-xl font-semibold text-pink-300">Name Analysis</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Discover the hidden meaning and vibrations of your name. See how it influences your personality and destiny.
            </p>
            <a
              href="/name-checker"
              className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 px-4 py-3 rounded-lg text-white font-medium text-center transition-all flex items-center justify-center space-x-2"
            >
              <span>Analyze My Name</span>
            </a>
          </div>

          {/* Monthly Dasha */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-blue-500/30 shadow-lg hover:shadow-blue-500/20 transition-all">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center mr-4 border border-blue-500/50">
                <span className="text-2xl">📆</span>
              </div>
              <h3 className="text-xl font-semibold text-blue-300">Monthly Dasha</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Get precise monthly predictions based on your current planetary periods. Plan your important events accordingly.
            </p>
            <button
              onClick={() => {
                const query = new URLSearchParams();
                query.set('name', name);
                query.set('dob', dob);
                window.location.href = `/monthly-dasha?${query.toString()}`;
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-4 py-3 rounded-lg text-white font-medium text-center transition-all flex items-center justify-center space-x-2"
            >
              <span>View Monthly Forecast</span>
            </button>
          </div>

          {/* Career Guidance */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-amber-500/30 shadow-lg hover:shadow-amber-500/20 transition-all">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-600/20 flex items-center justify-center mr-4 border border-amber-500/50">
                <span className="text-2xl">💼</span>
              </div>
              <h3 className="text-xl font-semibold text-amber-300">Career Guidance</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Discover your ideal profession based on your numerology chart. Find careers that align with your life path.
            </p>
            <button
              onClick={() => {
                const query = new URLSearchParams();
                query.set('name', name);
                query.set('dob', dob);
                window.location.href = `/profession?${query.toString()}`;
              }}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 px-4 py-3 rounded-lg text-white font-medium text-center transition-all flex items-center justify-center space-x-2"
            >
              <span>Find My Career Path</span>
            </button>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Detailed Predictions */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-purple-500/30 shadow-lg hover:shadow-purple-500/20 transition-all">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center mr-4 border border-purple-500/50">
                <span className="text-2xl">🔮</span>
              </div>
              <h3 className="text-xl font-semibold text-purple-300">Life Predictions</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Get comprehensive insights about your future based on your complete numerology profile and current periods.
            </p>
            <button
              onClick={() => {
                const chartDigits = gridData
                  .flat()
                  .flatMap((cell) => cell.map((item) => item.value));

                const query = new URLSearchParams();
                query.set('name', name);
                query.set('dob', dob);
                query.set('basicNumber', basicNumber);
                query.set('destinyNumber', destinyNumber);
                query.set('maha', currentDasha);
                query.set('antar', currentAntardasha);
                chartDigits.forEach((num) => query.append('gridNumbers', num));

                window.location.href = `/predictions?${query.toString()}`;
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 px-4 py-3 rounded-lg text-white font-medium text-center transition-all flex items-center justify-center space-x-2"
            >
              <span>Get My Predictions</span>
            </button>
          </div>

          {/* Health Analysis */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-red-500/30 shadow-lg hover:shadow-red-500/20 transition-all">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center mr-4 border border-red-500/50">
                <span className="text-2xl">🧬</span>
              </div>
              <h3 className="text-xl font-semibold text-red-300">Health Analysis</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Understand potential health tendencies based on your numerology chart. Get preventive recommendations.
            </p>
            <a
              href={`/health-checker?grid=${encodeURIComponent(
                gridData
                  .flat()
                  .flatMap(cell => cell.map(item => item.value))
                  .join(',')
              )}`}
              className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 px-4 py-3 rounded-lg text-white font-medium text-center transition-all flex items-center justify-center space-x-2"
            >
              <span>Analyze My Health</span>
            </a>
          </div>

          {/* Karmic Debt */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-indigo-500/30 shadow-lg hover:shadow-indigo-500/20 transition-all">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center mr-4 border border-indigo-500/50">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="text-xl font-semibold text-indigo-300">Karmic Debt</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Discover if you're carrying karmic debts from past lives and how they affect your current life path.
            </p>
            <button
              onClick={() => window.location.href = `/karmic`}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 px-4 py-3 rounded-lg text-white font-medium text-center transition-all flex items-center justify-center space-x-2"
            >
              <span>Check Karmic Debt</span>
            </button>
          </div>
        </div>
        <div className="w-full max-w-6xl space-y-12 mb-16">
          {/* Row 3 - New Buttons Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Real Estate Predictions */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-orange-500/30 shadow-lg hover:shadow-orange-500/20 transition-all">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-orange-600/20 flex items-center justify-center mr-4 border border-orange-500/50">
                  <span className="text-2xl">🏠</span>
                </div>
                <h3 className="text-xl font-semibold text-orange-300">Real Estate Guidance</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Discover favorable locations and timings for property investments based on your numerology chart vibrations.
              </p>
              <a
                href={`/real-estate?grid=${encodeURIComponent(
                  gridData.flat().flatMap(cell => cell.map(item => item.value)).join(',')
                )}`}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 px-4 py-3 rounded-lg text-white font-medium text-center transition-all flex items-center justify-center space-x-2"
              >
                <span>Get Property Insights</span>
              </a>
            </div>

            {/* Relationship Checker */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-rose-500/30 shadow-lg hover:shadow-rose-500/20 transition-all">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-rose-600/20 flex items-center justify-center mr-4 border border-rose-500/50">
                  <span className="text-2xl">💑</span>
                </div>
                <h3 className="text-xl font-semibold text-rose-300">Relationship Analysis</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Analyze compatibility with partners based on numerology. Understand relationship strengths and challenges.
              </p>
              <a
                href={`/relationship-checker?grid=${encodeURIComponent(
                  gridData.flat().flatMap(cell => cell.map(item => item.value)).join(',')
                )}&name=${encodeURIComponent(name)}&dob=${encodeURIComponent(dob)}`}
                className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 px-4 py-3 rounded-lg text-white font-medium text-center transition-all flex items-center justify-center space-x-2"
              >
                <span>Check Compatibility</span>
              </a>
            </div>
          </div>
      
          {/* Horoscope Section - Full Width */}
          <div className="bg-gray-800/50 rounded-xl p-8 border border-fuchsia-500/30 shadow-lg hover:shadow-fuchsia-500/20 transition-all text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-fuchsia-600/20 flex items-center justify-center mb-4 border border-fuchsia-500/50">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-2xl font-semibold text-fuchsia-300 mb-3">Life Horoscope </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Get your personalized daily horoscope based on your numerology chart and current planetary periods. 
                See what the stars have in store for you today!
              </p>
              <button
                onClick={() => window.location.href = `/hororscope`}
                className="bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 px-8 py-4 rounded-xl text-white font-semibold text-center transition-all duration-200 shadow-lg hover:shadow-fuchsia-500/30 flex items-center justify-center space-x-2"
              >
                <span className="text-xl">✨</span>
                <span>Get My Horoscope</span>
              </button>
            </div>
          </div>
        </div>
    </div>
  </div>
  );
}

