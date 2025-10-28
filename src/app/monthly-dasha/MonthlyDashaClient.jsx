'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const monthlyDurations = {
  1: 8, 2: 16, 3: 24, 4: 32, 5: 41, 6: 49, 7: 57, 8: 65, 9: 73,
};

const numberPositionMap = {
  1: [0, 1], 2: [2, 0], 3: [0, 0], 4: [2, 2], 5: [1, 2], 6: [1, 0], 7: [1, 1], 8: [2, 1], 9: [0, 2],
};

const monthlyDashaCases = {
  1: {
    title: "Initiation, Authority & Personal Drive",
    traits: ["Strong-willed and self-reliant", "Natural leader with pioneering spirit", "Independent mindset with bold decision-making"],
    professional: ["Ideal time for launching new projects", "Supports leadership and entrepreneurship", "Favorable for self-promotion and personal branding"],
    negatives: ["Risk of arrogance or impatience", "Difficulty cooperating with teams", "Can become overly controlling or ego-driven"],
    advice: ["Lead with humility and integrity", "Use this cycle to start what you've been delaying", "Avoid power struggles — focus on purpose, not pride"],
    combinations: [
      { condition: ({ chartMap, maha, antar }) => maha === 4 || maha === 8 || antar === 4 || antar === 8, note: "Leadership will be tested under Saturn's watch. Stay disciplined and avoid misuse of power." }
    ]
  },
  2: {
    title: "Harmony, Emotions & Partnerships",
    traits: ["Emotionally intuitive and sensitive", "Strong desire for peace and companionship", "Excellent at cooperation and negotiation"],
    professional: ["Great time for collaborations and partnerships", "Suitable for healing arts and counseling", "Favorable for team building and nurturing roles"],
    negatives: ["Over-sensitivity to criticism", "Mood swings and self-doubt", "May avoid confrontation even when needed"],
    advice: ["Focus on empathy and emotional balance", "Use this time to resolve conflicts gently", "Don't let indecision slow your progress — trust your instincts"],
    combinations: [
      { condition: ({ chartMap, maha, antar }) => maha === 8 || antar === 8, note: "Emotional suppression possible under Saturn's discipline. Don't bottle up — express calmly." }
    ]
  },
  3: {
    title: "Growth, Wisdom & Creative Expansion",
    traits: ["Optimistic, expressive, and enthusiastic", "Strong urge to share ideas and knowledge", "Natural ability to inspire and teach others"],
    professional: ["Excellent period for education and public speaking", "Supports artistic ventures and content creation", "Ideal for starting mentorship roles"],
    negatives: ["Scattered focus due to overcommitment", "Tendency to speak without thinking", "Can become egoistic in teaching or preaching"],
    advice: ["Channel your ideas with structure and clarity", "Avoid overpromising — focus on follow-through", "Take time to reflect before advising others"],
    combinations: [
      { condition: ({ chartMap, maha, antar }) => maha === 6 || antar === 6, note: "Creative energy gets romantic or indulgent. Maintain discipline while expressing beauty or love." }
    ]
  },
  4: {
    title: "Disruption, Innovation & Groundwork",
    traits: ["Highly unconventional thinker", "Craves freedom, uniqueness, and change", "Deep desire to break old structures"],
    professional: ["Great time for technology and radical career shifts", "Supports research, startup ideas, and innovation", "Time to build foundations for future success"],
    negatives: ["Prone to unpredictability and overthinking", "Tendency to rebel without reason", "Risk of confusion, obsession, or digital addiction"],
    advice: ["Use this energy to build rather than destroy", "Balance structure with innovation", "Avoid shortcuts — Rahu gives but tests later"],
    combinations: [
      { condition: ({ chartMap, maha, antar }) => maha === 1 || antar === 1, note: "Your ambition is firing fast — don't let ego lead to impulsive actions." }
    ]
  },
  5: {
    title: "Communication, Change & Mental Agility",
    traits: ["Sharp thinker and fast decision-maker", "Excellent with logic, communication, and adaptability", "Restless energy, curious, loves multitasking"],
    professional: ["Perfect time for media, marketing, and writing", "Supports travel, trade, and public relations", "Ideal phase to switch strategies or diversify career paths"],
    negatives: ["Scattered thoughts due to excess mental stimulation", "Tendency to lie, gossip, or manipulate if imbalanced", "Indecisiveness due to too many options"],
    advice: ["Speak clearly and truthfully — Mercury rewards honesty", "Stay focused — don't chase every shiny distraction", "Write, share, and express — but mind your tone"],
    combinations: [
      { condition: ({ chartMap, maha, antar }) => maha === 3 || antar === 3, note: "You're in a dynamic learning cycle. Use your voice wisely — your words carry influence now." }
    ]
  },
  6: {
    title: "Love, Beauty & Relationships",
    traits: ["Romantic, artistic, and emotionally nurturing", "Has a strong desire for harmony and connection", "Attracted to aesthetics, luxury, and sensual pleasures"],
    professional: ["Great time for artistic, fashion, and beauty careers", "Supports healing, hospitality, and counseling", "Excellent phase for resolving conflicts through empathy"],
    negatives: ["Risk of becoming emotionally dependent or obsessive", "Can over-prioritize appearance over substance", "Tendency to avoid tough decisions to 'keep the peace'"],
    advice: ["Don't suppress your emotions — express with grace", "Use your charm and elegance wisely, not manipulatively", "Balance love with logic; harmony with honesty"],
    combinations: [
      { condition: ({ chartMap, maha, antar }) => maha === 2 || antar === 2, note: "Moon-Venus energy enhances romance and creativity. Follow your heart, but don't lose your head." }
    ]
  },
  7: {
    title: "Spirituality, Intuition & Inner Detachment",
    traits: ["Deep thinker with introspective energy", "Seeks solitude, truth, and spiritual meaning", "Highly intuitive, sometimes psychic"],
    professional: ["Best time for research and spiritual practices", "Supports roles in healing, teaching, and analysis", "Productive for writing, meditation, and wisdom-seeking"],
    negatives: ["Prone to isolation, confusion, or emotional detachment", "Struggles with trust and interpersonal expression", "May fall into escapism or over-analysis"],
    advice: ["Spend time alone, but don't cut off emotionally", "Pursue spiritual growth without avoiding practical life", "Balance logic with faith — trust your gut, but verify facts"],
    combinations: [
      { condition: ({ chartMap, maha, antar }) => maha === 2 || antar === 2, note: "Moon-Ketu influence can cloud emotions — journal and meditate to gain clarity." }
    ]
  },
  8: {
    title: "Karma, Discipline & Long-Term Vision",
    traits: ["Highly responsible and grounded", "Focused on long-term results, not instant gratification", "Works hard behind the scenes with consistency"],
    professional: ["Great time for government, legal, or structured careers", "Supports finance, real estate, and engineering", "Favors methodical growth and system-building"],
    negatives: ["Feelings of burden or slow progress", "Tendency to isolate or suppress emotions", "Overworking without acknowledgment or joy"],
    advice: ["Stick to your responsibilities — Saturn rewards patience", "Don't mistake slowness for failure — build silently", "Balance seriousness with rest and occasional lightness"],
    combinations: [
      { condition: ({ chartMap, maha, antar }) => maha === 4 || antar === 4, note: "Rahu-Saturn influence — confusion or delays may arise. Stay grounded and avoid shortcuts." }
    ]
  },
  9: {
    title: "Action, Passion & Completion",
    traits: ["Bold, fearless, and energetic", "Driven by passion and purpose", "Desires to complete goals and protect others"],
    professional: ["Excellent time for sports, leadership, and entrepreneurship", "Favours competitive exams and bold decisions", "Supports any task that requires courage and momentum"],
    negatives: ["Tendency to become aggressive, impulsive, or overconfident", "Can ignore logic in emotional heat", "Risk of burnout or unnecessary conflict"],
    advice: ["Channel energy into meaningful action, not fights", "Complete unfinished projects with focus", "Be assertive, not aggressive — lead with purpose"],
    combinations: [
      { condition: ({ chartMap, maha, antar }) => maha === 5 || antar === 5, note: "Mars-Mercury tension — control your speech, avoid sarcasm or heated debates." }
    ]
  }
};

export default function MonthlyDashaPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || '';
  const dobStr = searchParams.get('dob') || '';
  const [monthlyDashas, setMonthlyDashas] = useState([]);
  const [grid, setGrid] = useState(Array(3).fill(null).map(() => Array(3).fill([])));
  const [currentMahadasha, setCurrentMahadasha] = useState(null);
  const [currentAntardasha, setCurrentAntardasha] = useState(null);
  const [currentMonthly, setCurrentMonthly] = useState(null);
  const [basicNumber, setBasicNumber] = useState(null);
  const [destinyNumber, setDestinyNumber] = useState(null);
  const [supportiveNumbers, setSupportiveNumbers] = useState([]);
  const [monthlyInsight, setMonthlyInsight] = useState(null);
  const [activeTab, setActiveTab] = useState('timeline');

  useEffect(() => {
    if (!dobStr) return;
    
    const [yearStr, monthStr, dayStr] = dobStr.split('-');
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);
    const day = parseInt(dayStr);
    const dob = new Date(year, month - 1, day);
    const today = new Date();

    // Basic Number
    const basicRaw = [...dayStr].map(Number).reduce((a, b) => a + b, 0);
    const basic = basicRaw > 9 ? [...String(basicRaw)].map(Number).reduce((a, b) => a + b, 0) : basicRaw;
    setBasicNumber(basic);

    // Destiny Number
    const allDigits = [...dayStr, ...monthStr, ...yearStr].map(Number);
    let destinyRaw = allDigits.reduce((a, b) => a + b, 0);
    while (destinyRaw > 9) destinyRaw = [...String(destinyRaw)].map(Number).reduce((a, b) => a + b, 0);
    setDestinyNumber(destinyRaw);

    // Supportive Numbers
    const supportive = (day > 9 && ![10, 20, 30].includes(day)) ? [...dayStr].map(Number) : [];
    setSupportiveNumbers(supportive);

    // Monthly Dashas
    let monthly = [];
    let current = new Date(today.getFullYear(), month - 1, day);
    if (current > today) current.setFullYear(current.getFullYear() - 1);
    let dasha = basic;

    while (monthly.reduce((acc, m) => acc + monthlyDurations[m.dasha], 0) < 365) {
      const duration = monthlyDurations[dasha];
      const start = new Date(current);
      const end = new Date(current);
      end.setDate(end.getDate() + duration - 1);
      monthly.push({ dasha, start, end });
      current.setDate(current.getDate() + duration);
      dasha = dasha === 9 ? 1 : dasha + 1;
    }
    setMonthlyDashas(monthly);

    // Grid Setup
    const gridDigits = [...dayStr, ...monthStr, ...yearStr.slice(2)].map(Number).filter(n => n !== 0);
    let chartDigits = [...gridDigits, destinyRaw];
    if (!(day <= 9 || [10, 20, 30].includes(day))) chartDigits.push(basic);
    supportive.forEach(num => { if (!chartDigits.includes(num)) chartDigits.push(num); });

    const digitMap = {};
    chartDigits.forEach(num => {
      digitMap[num] = (digitMap[num] || 0) + 1;
    });

    // Mahadasha Calculation
    const dashaCycle = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const startIndex = dashaCycle.indexOf(basic);
    const orderedCycle = [...dashaCycle.slice(startIndex), ...dashaCycle.slice(0, startIndex)];

    let mahaDate = new Date(dob);
    let maha = null;
    for (let i = 0; i < 45; i++) {
      const d = orderedCycle[i % 9];
      const end = new Date(mahaDate);
      end.setFullYear(end.getFullYear() + d);
      if (today >= mahaDate && today < end) {
        maha = d;
        break;
      }
      mahaDate = end;
    }
    setCurrentMahadasha(maha);

    // Antardasha Calculation
    const bdayThisYear = new Date(today.getFullYear(), month - 1, day);
    const antardashaYear = today < bdayThisYear ? today.getFullYear() - 1 : today.getFullYear();
    const weekday = new Date(antardashaYear, month - 1, day).getDay();
    const weekdayValues = { 0: 1, 1: 2, 2: 9, 3: 5, 4: 3, 5: 6, 6: 8 };
    const weekdayVal = weekdayValues[weekday];
    let antar = basic + month + parseInt(String(antardashaYear).slice(2)) + weekdayVal;
    while (antar > 9) antar = [...String(antar)].reduce((a, b) => a + Number(b), 0);
    setCurrentAntardasha(antar);

    // Current Monthly Dasha
    const now = new Date();
    const currentMon = monthly.find(c => now >= c.start && now <= c.end);
    setCurrentMonthly(currentMon);

    // Build Grid with Highlights
    const tempGrid = Array(3).fill(null).map(() => Array(3).fill(null).map(() => []));
    Object.entries(digitMap).forEach(([numStr, count]) => {
      const num = parseInt(numStr);
      const pos = numberPositionMap[num];
      if (!pos) return;
      const [r, c] = pos;
      for (let i = 0; i < count; i++) {
        tempGrid[r][c].push({ value: num, highlight: '' });
      }
    });

    const mahaPos = numberPositionMap[maha];
    const antarPos = numberPositionMap[antar];
    const monthlyPos = currentMon ? numberPositionMap[currentMon.dasha] : null;

    if (mahaPos) tempGrid[mahaPos[0]][mahaPos[1]].push({ value: maha, highlight: 'maha' });
    if (antarPos) tempGrid[antarPos[0]][antarPos[1]].push({ value: antar, highlight: 'antar' });
    if (monthlyPos) tempGrid[monthlyPos[0]][monthlyPos[1]].push({ value: currentMon.dasha, highlight: 'monthly' });

    setGrid(tempGrid);

    // Monthly Insight
    if (currentMon && monthlyDashaCases[currentMon.dasha]) {
      const chartMap = digitMap;
      const mahaD = maha;
      const antarD = antar;
      const base = monthlyDashaCases[currentMon.dasha];
      const matchedCombo = base.combinations.find((combo) => combo.condition({ chartMap, maha: mahaD, antar: antarD }));
      const insight = {
        title: base.title,
        traits: base.traits,
        professional: base.professional,
        negatives: base.negatives,
        advice: base.advice,
        note: matchedCombo?.note || null
      };
      setMonthlyInsight(insight);
    }
  }, [dobStr]);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white px-3 sm:px-4 py-4 sm:py-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-6 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-[#ffda73] tracking-tight px-2">
          📆 Monthly Dasha
        </h1>
        <div className="h-1 w-32 sm:w-40 bg-gradient-to-r from-[#d4af37] to-[#ffda73] mx-auto rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Personal Profile - Mobile Optimized */}
        <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#d4af37]/20 shadow-lg">
          <div className="flex items-center mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#ffda73] flex items-center justify-center mr-2 sm:mr-3 shadow-md">
              <span className="text-sm sm:text-lg text-[#0b0f19] font-bold">👤</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Personal Profile</h2>
          </div>
          
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            <div className="bg-[#0b0f19] rounded-lg p-3 sm:p-4 border border-[#d4af37]/10">
              <p className="text-xs sm:text-sm text-gray-400 font-medium mb-1">NAME</p>
              <p className="text-white font-semibold text-sm sm:text-lg break-words leading-tight">
                {name || 'Not provided'}
              </p>
            </div>
            <div className="bg-[#0b0f19] rounded-lg p-3 sm:p-4 border border-[#d4af37]/10">
              <p className="text-xs sm:text-sm text-gray-400 font-medium mb-1">DOB</p>
              <p className="text-white font-semibold text-sm sm:text-lg">{dobStr || 'Not provided'}</p>
            </div>
            <div className="bg-[#0b0f19] rounded-lg p-3 sm:p-4 border border-[#d4af37]/10">
              <p className="text-xs sm:text-sm text-gray-400 font-medium mb-1">BASIC</p>
              <p className="text-xl sm:text-2xl font-bold text-[#ffda73]">{basicNumber || '-'}</p>
            </div>
            <div className="bg-[#0b0f19] rounded-lg p-3 sm:p-4 border border-[#d4af37]/10">
              <p className="text-xs sm:text-sm text-gray-400 font-medium mb-1">DESTINY</p>
              <p className="text-xl sm:text-2xl font-bold text-[#ffda73]">{destinyNumber || '-'}</p>
            </div>
            <div className="bg-[#0b0f19] rounded-lg p-3 sm:p-4 border border-[#d4af37]/10">
              <p className="text-xs sm:text-sm text-gray-400 font-medium mb-1">SUPPORT</p>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {supportiveNumbers.length ? (
                  supportiveNumbers.map((num, idx) => (
                    <span key={idx} className="bg-[#d4af37] text-[#0b0f19] px-2 py-1 rounded text-xs sm:text-sm font-bold">
                      {num}
                    </span>
                  ))
                ) : (
                  <span className="text-xs sm:text-sm text-gray-500 font-normal">None</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Current Periods - Mobile Stack */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {currentMahadasha && (
            <div className="bg-gradient-to-r from-[#d4af37]/10 to-transparent rounded-xl p-3 sm:p-4 border-2 border-[#d4af37] group hover:bg-[#d4af37]/15 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#d4af37] flex items-center justify-center">
                    <span className="text-xs sm:text-sm text-[#0b0f19] font-bold">M</span>
                  </div>
                  <h3 className="font-bold text-white text-sm sm:text-base">Mahadasha</h3>
                </div>
                <span className="text-xs text-[#ffda73] font-bold bg-[#d4af37]/20 px-2 py-1 rounded">Current</span>
              </div>
              <p className="text-white font-semibold text-center">
                <span className="text-xl sm:text-2xl text-[#ffda73] font-bold">{currentMahadasha}</span>
              </p>
            </div>
          )}
          {currentAntardasha && (
            <div className="bg-gradient-to-r from-green-500/10 to-transparent rounded-xl p-3 sm:p-4 border-2 border-green-500 group hover:bg-green-500/15 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-xs sm:text-sm text-white font-bold">A</span>
                  </div>
                  <h3 className="font-bold text-white text-sm sm:text-base">Antardasha</h3>
                </div>
                <span className="text-xs text-green-300 font-bold bg-green-500/20 px-2 py-1 rounded">Current</span>
              </div>
              <p className="text-white font-semibold text-center">
                <span className="text-xl sm:text-2xl text-green-300 font-bold">{currentAntardasha}</span>
              </p>
            </div>
          )}
          {currentMonthly && (
            <div className="bg-gradient-to-r from-pink-500/10 to-transparent rounded-xl p-3 sm:p-4 border-2 border-pink-500 group hover:bg-pink-500/15 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-pink-500 flex items-center justify-center">
                    <span className="text-xs sm:text-sm text-white font-bold">MD</span>
                  </div>
                  <h3 className="font-bold text-white text-sm sm:text-base">Monthly</h3>
                </div>
                <span className="text-xs text-pink-300 font-bold bg-pink-500/20 px-2 py-1 rounded">Active</span>
              </div>
              <p className="text-white font-semibold text-center">
                <span className="text-xl sm:text-2xl text-pink-300 font-bold">{currentMonthly.dasha}</span>
              </p>
              <p className="text-gray-300 text-xs text-center mt-1">
                {currentMonthly.start.toLocaleDateString()} - {currentMonthly.end.toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Numerology Grid - Mobile Optimized */}
        <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#d4af37]/20 shadow-lg">
          <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-white text-center">Numerology Grid</h2>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-[280px] sm:max-w-xs mx-auto">
            {grid.flat().map((cell, i) => (
              <div
                key={i}
                className="aspect-square flex items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-[#0b0f19] to-[#121829] border border-[#d4af37]/30 hover:border-[#ffda73] transition-all duration-300 shadow-inner"
              >
                <div className="flex flex-wrap justify-center items-center gap-1 max-w-full">
                  {cell.map((item, idx) => {
                    const size = cell.length > 4 ? 'text-xs' : cell.length > 2 ? 'text-xs sm:text-sm' : 'text-sm sm:text-base';
                    return (
                      <div key={idx} className="flex flex-col items-center">
                        <span
                          className={`rounded-md sm:rounded-lg px-1 sm:px-2 py-[0.1rem] sm:py-[0.15rem] font-bold ${size} transition-all duration-300 ${
                            item.highlight === 'monthly' 
                              ? 'bg-pink-500 text-white shadow-lg' 
                              : item.highlight === 'maha' 
                              ? 'bg-[#d4af37] text-[#0b0f19] shadow-lg' 
                              : item.highlight === 'antar' 
                              ? 'bg-green-500 text-white shadow-lg' 
                              : 'bg-[#1e293b] text-white border border-[#334155]'
                          }`}
                        >
                          {item.value}
                        </span>
                        {item.highlight && (
                          <span className={`text-[8px] sm:text-[10px] font-bold mt-0.5 ${
                            item.highlight === 'maha' ? 'text-[#d4af37]' : 
                            item.highlight === 'antar' ? 'text-green-400' : 'text-pink-400'
                          }`}>
                            {item.highlight === 'maha' ? 'M' : item.highlight === 'antar' ? 'A' : 'MD'}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center space-y-2">
            <div className="flex flex-col xs:flex-row justify-center items-center space-y-2 xs:space-y-0 xs:space-x-4 text-xs sm:text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#d4af37] rounded"></div>
                <span className="text-gray-300">M = Mahadasha</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded"></div>
                <span className="text-gray-300">A = Antardasha</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-pink-500 rounded"></div>
                <span className="text-gray-300">MD = Monthly</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation - Mobile Friendly */}
        <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-xl sm:rounded-2xl p-2 border border-[#d4af37]/20 shadow-lg">
          <div className="flex space-x-1 sm:space-x-2">
            {[
              { id: 'timeline', label: 'Timeline', icon: '📅', shortIcon: '📊' },
              { id: 'insights', label: 'Insights', icon: '🔮', shortIcon: '💫' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-1 sm:space-x-2 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#ffda73] text-[#0b0f19] shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-sm sm:text-base">{window.innerWidth < 640 ? tab.shortIcon : tab.icon}</span>
                <span className="text-xs sm:text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content - Mobile Optimized */}
        <div className="min-h-[300px] sm:min-h-[400px]">
          {activeTab === 'timeline' && (
            <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#d4af37]/20 shadow-lg">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white text-center">Monthly Dasha Timeline</h2>
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <div className="min-w-full">
                  <table className="w-full">
                    <thead className="bg-[#0b0f19] border-b border-[#d4af37]/30">
                      <tr>
                        <th className="text-left p-2 sm:p-4 text-white font-bold text-xs sm:text-sm">Dasha</th>
                        <th className="text-left p-2 sm:p-4 text-white font-bold text-xs sm:text-sm">Start</th>
                        <th className="text-left p-2 sm:p-4 text-white font-bold text-xs sm:text-sm">End</th>
                        <th className="text-left p-2 sm:p-4 text-white font-bold text-xs sm:text-sm">Days</th>
                        <th className="text-left p-2 sm:p-4 text-white font-bold text-xs sm:text-sm">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyDashas.map((row, idx) => {
                        const isCurrent = new Date() >= row.start && new Date() <= row.end;
                        const isPast = new Date() > row.end;
                        return (
                          <tr 
                            key={idx} 
                            className={`border-b border-[#d4af37]/10 transition-colors ${
                              isCurrent 
                                ? 'bg-pink-500/10 hover:bg-pink-500/15' 
                                : isPast
                                ? 'hover:bg-[#0b0f19]/50'
                                : 'hover:bg-[#0b0f19]/30'
                            }`}
                          >
                            <td className="p-2 sm:p-4">
                              <span className={`font-bold text-sm sm:text-lg ${
                                isCurrent ? 'text-pink-400' : 'text-white'
                              }`}>
                                {row.dasha}
                              </span>
                            </td>
                            <td className="p-2 sm:p-4 font-semibold text-gray-300 text-xs sm:text-sm">
                              {row.start.toLocaleDateString()}
                            </td>
                            <td className="p-2 sm:p-4 font-semibold text-gray-300 text-xs sm:text-sm">
                              {row.end.toLocaleDateString()}
                            </td>
                            <td className="p-2 sm:p-4">
                              <span className="bg-[#d4af37]/20 text-[#ffda73] px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
                                {monthlyDurations[row.dasha]}d
                              </span>
                            </td>
                            <td className="p-2 sm:p-4">
                              {isCurrent ? (
                                <span className="bg-pink-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
                                  Active
                                </span>
                              ) : isPast ? (
                                <span className="bg-gray-600 text-gray-300 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
                                  Done
                                </span>
                              ) : (
                                <span className="bg-green-500/20 text-green-400 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
                                  Upcoming
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'insights' && monthlyInsight && (
            <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#d4af37]/20 shadow-lg">
              <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center text-pink-400">{monthlyInsight.title}</h2>
              <p className="text-gray-400 text-center mb-6 text-sm sm:text-base">Current Monthly Dasha: {currentMonthly?.dasha}</p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-[#0b0f19] rounded-xl p-4 sm:p-5 border border-[#d4af37]/10">
                    <h3 className="text-base sm:text-lg font-semibold text-yellow-300 mb-3 flex items-center">
                      <span className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-400 rounded-full flex items-center justify-center mr-2 text-[#0b0f19] text-xs sm:text-sm">🌟</span>
                      Key Traits
                    </h3>
                    <ul className="space-y-2">
                      {monthlyInsight.traits.map((trait, i) => (
                        <li key={i} className="text-gray-300 flex items-start text-sm sm:text-base">
                          <span className="text-yellow-400 mr-2 mt-1">•</span>
                          {trait}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#0b0f19] rounded-xl p-4 sm:p-5 border border-[#d4af37]/10">
                    <h3 className="text-base sm:text-lg font-semibold text-green-300 mb-3 flex items-center">
                      <span className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center mr-2 text-white text-xs sm:text-sm">💼</span>
                      Professional
                    </h3>
                    <ul className="space-y-2">
                      {monthlyInsight.professional.map((item, i) => (
                        <li key={i} className="text-gray-300 flex items-start text-sm sm:text-base">
                          <span className="text-green-400 mr-2 mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-[#0b0f19] rounded-xl p-4 sm:p-5 border border-[#d4af37]/10">
                    <h3 className="text-base sm:text-lg font-semibold text-red-300 mb-3 flex items-center">
                      <span className="w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center mr-2 text-white text-xs sm:text-sm">⚠️</span>
                      Challenges
                    </h3>
                    <ul className="space-y-2">
                      {monthlyInsight.negatives.map((item, i) => (
                        <li key={i} className="text-gray-300 flex items-start text-sm sm:text-base">
                          <span className="text-red-400 mr-2 mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#0b0f19] rounded-xl p-4 sm:p-5 border border-[#d4af37]/10">
                    <h3 className="text-base sm:text-lg font-semibold text-blue-300 mb-3 flex items-center">
                      <span className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2 text-white text-xs sm:text-sm">🧘</span>
                      Guidance
                    </h3>
                    <ul className="space-y-2">
                      {monthlyInsight.advice.map((item, i) => (
                        <li key={i} className="text-gray-300 flex items-start text-sm sm:text-base">
                          <span className="text-blue-400 mr-2 mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {monthlyInsight.note && (
                <div className="mt-4 sm:mt-6 bg-gradient-to-r from-[#d4af37]/10 to-transparent rounded-xl p-4 sm:p-5 border-2 border-[#d4af37]">
                  <h3 className="text-base sm:text-lg font-semibold text-[#ffda73] mb-2 flex items-center">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 bg-[#ffda73] rounded-full flex items-center justify-center mr-2 text-[#0b0f19] text-xs sm:text-sm">💎</span>
                    Special Insight
                  </h3>
                  <p className="text-white text-sm sm:text-base">{monthlyInsight.note}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}