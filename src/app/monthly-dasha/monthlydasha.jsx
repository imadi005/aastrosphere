'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const monthlyDurations = {
  1: 8,
  2: 16,
  3: 24,
  4: 32,
  5: 41,
  6: 49,
  7: 57,
  8: 65,
  9: 73,
};

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
const monthlyDashaCases = {
  1: {
    title: "Initiation, Authority & Personal Drive",
    traits: [
      "Strong-willed and self-reliant",
      "Natural leader with pioneering spirit",
      "Independent mindset with bold decision-making"
    ],
    professional: [
      "Ideal time for launching new projects",
      "Supports leadership, entrepreneurship, and individual tasks",
      "Favorable for self-promotion and personal branding"
    ],
    negatives: [
      "Risk of arrogance or impatience",
      "Difficulty cooperating with teams",
      "Can become overly controlling or ego-driven"
    ],
    advice: [
      "Lead with humility and integrity",
      "Use this cycle to start what you’ve been delaying",
      "Avoid power struggles — focus on purpose, not pride"
    ],
    combinations: [
      {
        condition: ({ chartMap, maha, antar }) => maha === 4 || maha === 8 || antar === 4 || antar === 8,
        note: "Leadership will be tested under Saturn's watch (Mahadasha or Antardasha 4 or 8). Stay disciplined and avoid misuse of power."
      },
      {
        condition: ({ chartMap }) => (chartMap[1] || 0) >= 2 && (chartMap[5] || 0) >= 2,
        note: "This is a time of ego-speech conflict. Practice clarity and calmness to avoid misunderstandings."
      },
      {
        condition: ({ chartMap }) => (chartMap[1] || 0) === 1,
        note: "This cycle is ideal to build your inner confidence and take initiative — don’t wait for validation."
      },
      {
        condition: ({ chartMap }) => (chartMap[2] || 0) === 0 && (chartMap[6] || 0) === 0,
        note: "Lack of 2 & 6 suggests imbalance in harmony. Be mindful of emotional detachment and cold decisions."
      }
    ]
  },
  2: {
    title: "Harmony, Emotions & Partnerships",
    traits: [
      "Emotionally intuitive and sensitive",
      "Strong desire for peace and companionship",
      "Excellent at cooperation and negotiation"
    ],
    professional: [
      "Great time for collaborations and partnerships",
      "Suitable for healing arts, design, and counseling",
      "Favorable for team building and nurturing roles"
    ],
    negatives: [
      "Over-sensitivity to criticism",
      "Mood swings and self-doubt",
      "May avoid confrontation even when needed"
    ],
    advice: [
      "Focus on empathy and emotional balance",
      "Use this time to resolve conflicts gently",
      "Don’t let indecision slow your progress — trust your instincts"
    ],
    combinations: [
      {
        condition: ({ chartMap, maha, antar }) =>
          maha === 8 || antar === 8,
        note: "Emotional suppression possible under Saturn's discipline. Don't bottle up — express calmly."
      },
      {
        condition: ({ chartMap }) =>
          (chartMap[2] || 0) >= 3,
        note: "Your emotional intelligence is heightened. Use it to strengthen bonds — both personal and professional."
      },
      {
        condition: ({ chartMap }) =>
          !(chartMap[1] || 0) && !(chartMap[3] || 0),
        note: "Lack of self-expression and leadership in chart. Time to gently assert your voice while staying kind."
      },
      {
        condition: ({ chartMap }) =>
          (chartMap[6] || 0) >= 2 && (chartMap[2] || 0) >= 2,
        note: "Venus-Moon energy supports love, art, and family healing. Pursue harmony in home and heart."
      }
    ]
  },
  3 : {
    title: "Growth, Wisdom & Creative Expansion",
    traits: [
      "Optimistic, expressive, and enthusiastic",
      "Strong urge to share ideas and knowledge",
      "Natural ability to inspire and teach others"
    ],
    professional: [
      "Excellent period for education, writing, and public speaking",
      "Supports artistic ventures and content creation",
      "Ideal for starting mentorship roles or spiritual studies"
    ],
    negatives: [
      "Scattered focus due to overcommitment",
      "Tendency to speak without thinking",
      "Can become egoistic in teaching or preaching"
    ],
    advice: [
      "Channel your ideas with structure and clarity",
      "Avoid overpromising — focus on follow-through",
      "Take time to reflect before advising others"
    ],
    combinations: [
      {
        condition: ({ chartMap, maha, antar }) =>
          maha === 6 || antar === 6,
        note: "Creative energy gets romantic or indulgent. Maintain discipline while expressing beauty or love."
      },
      {
        condition: ({ chartMap }) =>
          (chartMap[3] || 0) >= 3,
        note: "Powerful Jupiterian energy! Teach, create, and uplift — but don't become a know-it-all."
      },
      {
        condition: ({ chartMap }) =>
          (chartMap[3] || 0) >= 1 && !(chartMap[9] || 0),
        note: "Wisdom without completion. This is the time to finish what you start — avoid leaving ideas incomplete."
      },
      {
        condition: ({ chartMap }) =>
          (chartMap[3] || 0) >= 2 && (chartMap[1] || 0) >= 1,
        note: "Self-expression and leadership aligned. Speak your truth boldly, but with responsibility."
      }
    ]
  },
  4 :{
    title: "Disruption, Innovation & Groundwork",
    traits: [
      "Highly unconventional thinker",
      "Craves freedom, uniqueness, and change",
      "Deep desire to break old structures"
    ],
    professional: [
      "Great time for technology, invention, or radical career shifts",
      "Supports research, startup ideas, and innovation",
      "Time to build foundations for future success"
    ],
    negatives: [
      "Prone to unpredictability and overthinking",
      "Tendency to rebel without reason",
      "Risk of confusion, obsession, or digital addiction"
    ],
    advice: [
      "Use this energy to build rather than destroy",
      "Balance structure with innovation",
      "Avoid shortcuts — Rahu gives but tests later"
    ],
    combinations: [
      {
        condition: ({ chartMap, maha, antar }) =>
          maha === 1 || antar === 1,
        note: "Your ambition is firing fast — don’t let ego lead to impulsive actions."
      },
      {
        condition: ({ chartMap }) =>
          (chartMap[4] || 0) >= 2 && !(chartMap[6] || 0),
        note: "Lack of Venus (6) with Rahu brings loneliness. Focus on grounding relationships while chasing goals."
      },
      {
        condition: ({ chartMap }) =>
          (chartMap[4] || 0) >= 3,
        note: "You’re in a karmic acceleration cycle — massive changes possible. Stay ethical and transparent."
      },
      {
        condition: ({ chartMap }) =>
          (chartMap[8] || 0) >= 2,
        note: "Rahu + Saturn patterns = delays, obstacles, and tests of integrity. Do not cut corners."
      }
    ]
  },
  5 :{
    title: "Communication, Change & Mental Agility",
    traits: [
      "Sharp thinker and fast decision-maker",
      "Excellent with logic, communication, and adaptability",
      "Restless energy, curious, loves multitasking"
    ],
    professional: [
      "Perfect time for media, marketing, writing, and business",
      "Supports travel, trade, and public relations",
      "Ideal phase to switch strategies or diversify career paths"
    ],
    negatives: [
      "Scattered thoughts due to excess mental stimulation",
      "Tendency to lie, gossip, or manipulate if imbalanced",
      "Indecisiveness due to too many options"
    ],
    advice: [
      "Speak clearly and truthfully — Mercury rewards honesty",
      "Stay focused — don't chase every shiny distraction",
      "Write, share, and express — but mind your tone"
    ],
    combinations: [
      {
        condition: ({ chartMap, maha, antar }) =>
          maha === 3 || antar === 3,
        note: "You’re in a dynamic learning cycle. Use your voice wisely — your words carry influence now."
      },
      {
        condition: ({ chartMap }) =>
          (chartMap[5] || 0) >= 3,
        note: "Mental firepower is supercharged. Meditate or journal to channel your ideas clearly."
      },
      {
        condition: ({ chartMap }) =>
          (chartMap[2] || 0) === 0,
        note: "Lack of emotional grounding. You may talk a lot but connect very little — listen more this month."
      },
      {
        condition: ({ chartMap }) =>
          (chartMap[1] || 0) >= 2 && (chartMap[5] || 0) >= 2,
        note: "Ego + intellect combo — powerful or dangerous. Avoid manipulative tactics at work or in relationships."
      }
    ]
  },
  6:{
    title: "Love, Beauty & Relationships",
    traits: [
      "Romantic, artistic, and emotionally nurturing",
      "Has a strong desire for harmony and connection",
      "Attracted to aesthetics, luxury, and sensual pleasures"
    ],
    professional: [
      "Great time for artistic, fashion, beauty, or relationship-based careers",
      "Supports healing, hospitality, counseling, and design work",
      "Excellent phase for resolving conflicts through empathy"
    ],
    negatives: [
      "Risk of becoming emotionally dependent or obsessive",
      "Can over-prioritize appearance over substance",
      "Tendency to avoid tough decisions to ‘keep the peace’"
    ],
    advice: [
      "Don’t suppress your emotions — express with grace",
      "Use your charm and elegance wisely, not manipulatively",
      "Balance love with logic; harmony with honesty"
    ],
    combinations: [
      {
        condition: ({ chartMap, maha, antar }) =>
          maha === 2 || antar === 2,
        note: "Moon-Venus energy enhances romance and creativity. Follow your heart, but don’t lose your head."
      },
      {
        condition: ({ chartMap }) =>
          (chartMap[6] || 0) >= 3,
        note: "You may become overly concerned with love or appearance. Use this cycle to create something truly beautiful — not just attractive."
      },
      {
        condition: ({ chartMap }) =>
          !(chartMap[1] || 0),
        note: "Lack of self-identity can make you overly reliant on others. Build inner confidence alongside relationships."
      },
      {
        condition: ({ chartMap }) =>
          (chartMap[3] || 0) >= 1 && (chartMap[6] || 0) >= 1,
        note: "Creative expression is at its peak. This is the time to start a passion project or showcase your talent."
      }
    ]
  },
  7 : {
    title: "Spirituality, Intuition & Inner Detachment",
    traits: [
      "Deep thinker with introspective energy",
      "Seeks solitude, truth, and spiritual meaning",
      "Highly intuitive, sometimes psychic"
    ],
    professional: [
      "Best time for research, spiritual practices, or solo work",
      "Supports roles in healing, teaching, analysis, or behind-the-scenes strategy",
      "Productive for writing, meditation, and wisdom-seeking tasks"
    ],
    negatives: [
      "Prone to isolation, confusion, or emotional detachment",
      "Struggles with trust and interpersonal expression",
      "May fall into escapism or over-analysis"
    ],
    advice: [
      "Spend time alone, but don’t cut off emotionally",
      "Pursue spiritual growth without avoiding practical life",
      "Balance logic with faith — trust your gut, but verify facts"
    ],
    combinations: [
      {
        condition: ({ chartMap, maha, antar }) =>
          maha === 2 || antar === 2,
        note: "Moon-Ketu influence can cloud emotions — journal and meditate to gain clarity."
      },
      {
        condition: ({ chartMap }) =>
          (chartMap[7] || 0) >= 3,
        note: "Heightened spiritual sensitivity — this is a powerful time to break karmic cycles or go inward deeply."
      },
      {
        condition: ({ chartMap }) =>
          !(chartMap[5] || 0) && !(chartMap[9] || 0),
        note: "With Mercury and Mars missing, you may lack grounding and focus. Practice mindfulness and stay rooted in routines."
      },
      {
        condition: ({ chartMap }) =>
          (chartMap[4] || 0) >= 2 && (chartMap[7] || 0) >= 2,
        note: "Rahu-Ketu axis activated — big karmic revelations are possible. Don’t resist change; observe and evolve."
      }
    ]
  },
  8: {
    title: "Karma, Discipline & Long-Term Vision",
    traits: [
      "Highly responsible and grounded",
      "Focused on long-term results, not instant gratification",
      "Works hard behind the scenes with consistency"
    ],
    professional: [
      "Great time for government, legal, or structured careers",
      "Supports finance, real estate, engineering, and disciplined ventures",
      "Favors methodical growth and system-building"
    ],
    negatives: [
      "Feelings of burden or slow progress",
      "Tendency to isolate or suppress emotions",
      "Overworking without acknowledgment or joy"
    ],
    advice: [
      "Stick to your responsibilities — Saturn rewards patience",
      "Don’t mistake slowness for failure — build silently",
      "Balance seriousness with rest and occasional lightness"
    ],
    combinations: [
      {
        condition: ({ chartMap, maha, antar }) =>
          maha === 4 || antar === 4,
        note: "Rahu-Saturn influence — confusion or delays may arise. Stay grounded and avoid shortcuts."
      },
      {
        condition: ({ chartMap }) =>
          (chartMap[8] || 0) >= 3,
        note: "You are entering a deep karmic cycle. Handle responsibilities maturely to clear long-standing blocks."
      },
      {
        condition: ({ chartMap }) =>
          (chartMap[2] || 0) === 0 && (chartMap[6] || 0) === 0,
        note: "Emotional detachment risk — don’t ignore loved ones while chasing goals."
      },
      {
        condition: ({ chartMap }) =>
          (chartMap[4] || 0) >= 2 && (chartMap[8] || 0) >= 2,
        note: "You may face spiritual tests or karmic justice — integrity is non-negotiable this month."
      }
    ]
  },
  9 :{
    title: "Action, Passion & Completion",
    traits: [
      "Bold, fearless, and energetic",
      "Driven by passion and purpose",
      "Desires to complete goals and protect others"
    ],
    professional: [
      "Excellent time for sports, leadership, entrepreneurship, and defense-related fields",
      "Favours competitive exams, bold decisions, and physical projects",
      "Supports any task that requires courage, momentum, and completion"
    ],
    negatives: [
      "Tendency to become aggressive, impulsive, or overconfident",
      "Can ignore logic in emotional heat",
      "Risk of burnout or unnecessary conflict"
    ],
    advice: [
      "Channel energy into meaningful action, not fights",
      "Complete unfinished projects with focus",
      "Be assertive, not aggressive — lead with purpose"
    ],
    combinations: [
      {
        condition: ({ chartMap, maha, antar }) =>
          maha === 5 || antar === 5,
        note: "Mars-Mercury tension — control your speech, avoid sarcasm or heated debates."
      },
      {
        condition: ({ chartMap }) =>
          (chartMap[9] || 0) >= 3,
        note: "Your warrior energy is peaking. Use it to finish big tasks or overcome obstacles — but stay calm under pressure."
      },
      {
        condition: ({ chartMap }) =>
          (chartMap[2] || 0) === 0 && (chartMap[6] || 0) === 0,
        note: "Lack of emotional and romantic grounding. Don’t let fire overpower softness — balance your drive with empathy."
      },
      {
        condition: ({ chartMap }) =>
          (chartMap[1] || 0) >= 1 && (chartMap[3] || 0) >= 1 && !(chartMap[9] || 0),
        note: "Strong leadership and ideas, but no closure energy. This is your chance to finish something important."
      }
    ]
  }
}  
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


  useEffect(() => {
    if (!dobStr) return;
    const [yearStr, monthStr, dayStr] = dobStr.split('-');
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);
    const day = parseInt(dayStr);
    const dob = new Date(year, month - 1, day);
    const today = new Date();

    const basicRaw = [...dayStr].map(Number).reduce((a, b) => a + b, 0);
    const basic = basicRaw > 9 ? [...String(basicRaw)].map(Number).reduce((a, b) => a + b, 0) : basicRaw;
    setBasicNumber(basic);

    const allDigits = [...dayStr, ...monthStr, ...yearStr].map(Number);
    let destinyRaw = allDigits.reduce((a, b) => a + b, 0);
    while (destinyRaw > 9) destinyRaw = [...String(destinyRaw)].map(Number).reduce((a, b) => a + b, 0);
    setDestinyNumber(destinyRaw);

    const supportive = (day > 9 && ![10, 20, 30].includes(day)) ? [...dayStr].map(Number) : [];
    setSupportiveNumbers(supportive);

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

    const gridDigits = [...dayStr, ...monthStr, ...yearStr.slice(2)].map(Number).filter(n => n !== 0);
    let chartDigits = [...gridDigits, destinyRaw];
    if (!(day <= 9 || [10, 20, 30].includes(day))) chartDigits.push(basic);
    supportive.forEach(num => { if (!chartDigits.includes(num)) chartDigits.push(num); });

    const digitMap = {};
    chartDigits.forEach(num => {
      digitMap[num] = (digitMap[num] || 0) + 1;
    });

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

    const bdayThisYear = new Date(today.getFullYear(), month - 1, day);
    const antardashaYear = today < bdayThisYear ? today.getFullYear() - 1 : today.getFullYear();
    const weekday = new Date(antardashaYear, month - 1, day).getDay();
    const weekdayValues = { 0: 1, 1: 2, 2: 9, 3: 5, 4: 3, 5: 6, 6: 8 };
    const weekdayVal = weekdayValues[weekday];
    let antar = basic + month + parseInt(String(antardashaYear).slice(2)) + weekdayVal;
    while (antar > 9) antar = [...String(antar)].reduce((a, b) => a + Number(b), 0);
    setCurrentAntardasha(antar);

    const now = new Date();
    const currentMon = monthly.find(c => now >= c.start && now <= c.end);
    setCurrentMonthly(currentMon);

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

    // 👉 Monthly Insight Matching Logic
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
    <div className="h-screen w-screen overflow-auto bg-black text-white px-4 py-10 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6 text-white drop-shadow">📆 Monthly Dasha Chart</h1>

      <div className="border border-purple-500 rounded-xl p-4 md:p-6 w-full max-w-md mb-6 text-lg space-y-2 shadow-lg bg-gray-800 bg-opacity-80">
        <p><b>👤 Name:</b> {name}</p>
        <p><b>📅 Date of Birth:</b> {dobStr}</p>
        <p><b>🔢 Basic Number:</b> {basicNumber}</p>
        <p><b>🎯 Destiny Number:</b> {destinyNumber}</p>
        <p><b>🧩 Supportive Numbers:</b> {supportiveNumbers.join(' & ')}</p>
      </div>

      {currentMahadasha && currentAntardasha && currentMonthly && (
        <div className="grid grid-cols-3 gap-4 bg-black/40 text-white rounded-xl p-4 mb-6 shadow-lg border border-white/10 w-full max-w-4xl text-center">
          <div className="bg-yellow-400 text-black font-bold rounded-xl py-2">Mahadasha: {currentMahadasha}</div>
          <div className="bg-green-400 text-black font-bold rounded-xl py-2">Antardasha: {currentAntardasha}</div>
          <div className="bg-pink-400 text-black font-bold rounded-xl py-2">Monthly Dasha: {currentMonthly.dasha}</div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 border-4 border-blue-600 p-3 rounded-xl bg-white/10 shadow-xl mb-6">
        {grid.flat().map((cell, i) => (
          <div
            key={i}
            className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-md font-bold text-xl border-2 bg-transparent border-gray-600"
          >
            <div className="flex flex-wrap justify-center items-center gap-1">
              {cell.map((item, idx) => (
                <span
                  key={idx}
                  className={`rounded-md text-sm md:text-base px-2 py-[0.15rem] leading-tight
                    ${item.highlight === 'monthly' ? 'bg-pink-400 text-black' : ''}
                    ${item.highlight === 'maha' ? 'bg-yellow-400 text-black' : ''}
                    ${item.highlight === 'antar' ? 'bg-green-400 text-black' : ''}
                    ${!item.highlight ? 'bg-purple-600 text-white' : ''}`}
                >
                  {item.value}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      {monthlyInsight && (
  <div className="bg-gray-900/80 text-white w-full max-w-4xl p-6 mb-6 rounded-xl border border-white/10 shadow-lg space-y-4">
    <h2 className="text-2xl font-bold text-pink-400 drop-shadow">{monthlyInsight.title}</h2>
    
    <div>
      <h3 className="text-lg font-semibold text-yellow-300">🌟 Traits</h3>
      <ul className="list-disc list-inside space-y-1">
        {monthlyInsight.traits.map((trait, i) => (
          <li key={i}>{trait}</li>
        ))}
      </ul>
    </div>

    <div>
      <h3 className="text-lg font-semibold text-green-300">💼 Professional</h3>
      <ul className="list-disc list-inside space-y-1">
        {monthlyInsight.professional.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>

    <div>
      <h3 className="text-lg font-semibold text-red-300">⚠️ Negatives</h3>
      <ul className="list-disc list-inside space-y-1">
        {monthlyInsight.negatives.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>

    <div>
      <h3 className="text-lg font-semibold text-blue-300">🧘 Advice</h3>
      <ul className="list-disc list-inside space-y-1">
        {monthlyInsight.advice.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>

    {monthlyInsight.combinationNote && (
      <div className="bg-black/40 mt-4 border-l-4 border-yellow-400 pl-4 py-2 text-yellow-200 text-base">
        <strong>🧩 Special Insight:</strong> {monthlyInsight.combinationNote}
      </div>
    )}
  </div>
)}
      <table className="w-full max-w-4xl text-lg rounded-lg overflow-hidden border border-blue-700">
        <thead>
          <tr className="bg-blue-700 text-white">
            <th className="p-3">Monthly Dasha</th>
            <th className="p-3">Start Date</th>
            <th className="p-3">End Date</th>
            <th className="p-3">Duration (Days)</th>
          </tr>
        </thead>
        <tbody>
          {monthlyDashas.map((row, idx) => {
            const isCurrent = new Date() >= row.start && new Date() <= row.end;
            return (
              <tr
                key={idx}
                className={`text-center ${isCurrent ? 'bg-pink-400 text-black font-bold' : 'bg-blue-900 text-white'}`}
              >
                <td className="p-3 font-bold">{row.dasha}</td>
                <td className="p-3">{row.start.toLocaleDateString('en-GB')}</td>
                <td className="p-3">{row.end.toLocaleDateString('en-GB')}</td>
                <td className="p-3">{(row.end - row.start) / (1000 * 60 * 60 * 24) + 1}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    
  );
}
