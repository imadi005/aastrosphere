'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const professionMap = {
  1: ['Leadership roles', 'Entrepreneurship', 'Administration', 'Government Positions', 'Public Speaking'],
  2: ['Art & Design', 'Creative Writing', 'Makeup & Fashion', 'Cinematography', 'Emotional Healing Work'],
  3: ['Education', 'Therapy', 'Spiritual Guidance', 'Astrology', 'Human Resource'],
  4: ['IT', 'Scientific Research', 'Analytics', 'Coding/Development', 'Data Security'],
  5: ['Finance', 'Banking', 'Taxation', 'Auditing', 'Investments'],
  6: ['Food Industry', 'Beauty & Wellness', 'Artistry', 'Luxury Services', 'Hospitality'],
  7: ['Deep Research', 'Forensics', 'Secret Services', 'Occult Science', 'Healing Professions'],
  8: ['Engineering', 'Surgery', 'Mechanical Fields', 'NGO Service', 'Operations Management'],
  9: ['Law Enforcement', 'Legal Advocacy', 'Political Roles', 'Leadership Under Pressure']
};

const cautionProfessions = {
  '4,6': {
    title: 'Business Partnerships, Legal Arbitrations',
    reason: 'This combination creates conflict between logic (4) and harmony (6), often leading to disputes or unstable collaborations.'
  },
  '1,2,4': {
    title: 'Joint Leadership Roles, Founding Partnerships',
    reason: 'The mix of dominance (1), emotion (2), and logic (4) leads to indecisive or conflicting decisions in shared authority roles.'
  },
  '9,5,5': {
    title: 'Politics in Conflict Zones, Aggressive Law Enforcement',
    reason: 'Strong Mars (9) and Mercury (5) energy can result in aggression, communication imbalance, and legal troubles.'
  },
  '1,1': {
    title: 'Military Command, CEO in Crisis-driven Companies',
    reason: 'Excess leadership energy may cause ego clashes, impulsive decisions, and poor team synergy.'
  }
};

const jobChangeFavDasha = [3, 4, 7, 8];

function ProfessionPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || 'User';
  const dob = searchParams.get('dob') || '0000-00-00';

  const [destinyNumber, setDestinyNumber] = useState(null);
  const [basicNumber, setBasicNumber] = useState(null);
  const [mahadasha, setMahadasha] = useState(null);
  const [gridValues, setGridValues] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [avoidProfessions, setAvoidProfessions] = useState([]);
  const [yogaInsights, setYogaInsights] = useState([]);

  const sumToSingleDigit = (num) => {
    let s = num;
    while (s > 9) {
      s = [...String(s)].map(Number).reduce((a, b) => a + b, 0);
    }
    return s;
  };

  useEffect(() => {
    if (!dob) return;
    const [yearStr, monthStr, dayStr] = dob.split('-');
    const allDigits = [...dayStr, ...monthStr, ...yearStr].map(Number);
    const day = parseInt(dayStr);
    const month = parseInt(monthStr);
    const year = parseInt(yearStr);
    const dobDate = new Date(`${yearStr}-${monthStr}-${dayStr}`);
    const today = new Date();

    const destiny = sumToSingleDigit(allDigits.reduce((a, b) => a + b, 0));
    setDestinyNumber(destiny);

    const basicRaw = [...dayStr].map(Number).reduce((a, b) => a + b, 0);
    const basic = basicRaw > 9 ? sumToSingleDigit(basicRaw) : basicRaw;
    setBasicNumber(basic);

    const dashaCycle = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const startIndex = dashaCycle.indexOf(basic);
    const orderedCycle = [...dashaCycle.slice(startIndex), ...dashaCycle.slice(0, startIndex)];

    let currDate = new Date(dobDate);
    for (let d of orderedCycle) {
      const duration = d;
      const end = new Date(currDate);
      end.setFullYear(end.getFullYear() + duration);
      if (today >= currDate && today < end) {
        setMahadasha(d);
        break;
      }
      currDate = end;
    }

    const grid = [...dayStr, ...monthStr, ...yearStr.slice(2)].map(Number).filter(n => n !== 0);
    setGridValues(grid);

    setRecommendations(professionMap[destiny] || []);

    const avoidList = [];
    const detailedReasons = [];

    Object.entries(cautionProfessions).forEach(([combo, { title, reason }]) => {
      const nums = combo.split(',').map(Number);
      const found = nums.every(n => {
        const requiredCount = nums.filter(x => x === n).length;
        const availableCount = grid.filter(x => x === n).length;
        return availableCount >= requiredCount;
      });
      if (found) {
        avoidList.push(title);
        detailedReasons.push(`🛑 <b>Avoid:</b> ${title} — <i>${reason}</i>`);
      }
    });

    setAvoidProfessions([...new Set(avoidList)]);
    setYogaInsights(detailedReasons);
  }, [dob]);

  return (
    <div className="h-screen w-screen overflow-auto bg-black text-white px-4 py-10 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center mb-10">🔍 Profession Analysis Report</h1>

      <div className="max-w-5xl mx-auto bg-gray-800 bg-opacity-80 p-10 rounded-xl shadow-xl space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p><b>👤 Name:</b> {name}</p>
            <p><b>📅 Date of Birth:</b> {dob}</p>
          </div>
          <div>
            <p><b>🔢 Destiny Number:</b> {destinyNumber}</p>
            <p><b>🎯 Basic Number:</b> {basicNumber}</p>
            <p><b>🔥 Current Mahadasha:</b> {mahadasha} (<span className={jobChangeFavDasha.includes(mahadasha) ? 'text-green-400' : 'text-red-400'}>{jobChangeFavDasha.includes(mahadasha) ? 'Favorable for Career Transition' : 'Stable / Avoid Job Change'}</span>)</p>
          </div>
        </div>

        <div className="bg-green-700 p-6 rounded-md">
          <h2 className="text-2xl font-bold mb-2">✅ Most Suitable Career Paths for You</h2>
          <ul className="list-disc list-inside text-lg">
            {recommendations.map((job, i) => <li key={i}>{job}</li>)}
          </ul>
        </div>

        {avoidProfessions.length > 0 && (
          <div className="bg-red-700 p-6 rounded-md">
            <h2 className="text-2xl font-bold mb-2">🚫 Professions to Avoid (Red Flags)</h2>
            <ul className="list-disc list-inside text-lg">
              {yogaInsights.map((text, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: text }}></li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 mt-4 text-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-3">💡 Final Advice for {name}</h2>
          <p className="text-lg leading-relaxed">
            Dear {name}, born on {dob}, your Destiny Number {destinyNumber} aligns you with broader career domains like <b>{professionMap[destinyNumber]?.slice(0, 3).join(', ')}</b>, which combine your mental framework and cosmic blueprint. 
            Your Mahadasha {mahadasha} is <b>{jobChangeFavDasha.includes(mahadasha) ? 'an ideal window for fresh starts and shifts' : 'better suited for steady planning rather than risky transitions'}</b>. 
            Make choices that energize your innate strength.
            {avoidProfessions.length > 0 && (
              <> <br /><br />🚫 Your chart indicates areas of caution. Avoid <b>{avoidProfessions.join(', ')}</b> to stay clear of recurring conflict or stagnation in your professional path.</>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfessionPage;
