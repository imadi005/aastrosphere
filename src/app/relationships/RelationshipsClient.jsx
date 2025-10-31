// app/match-making/page.jsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Brand Colors with Romantic Theme
const colors = {
  primaryBg: '#0b0f19',
  secondaryBg: '#121829',
  accentGold: '#d4af37',
  highlightGold: '#ffda73',
  textWhite: '#ffffff',
  neutralGray: '#b0b0b0',
  success: '#2ecc71',
  warning: '#ff4d4d',
  accentCyan: '#00ffff',
  lovePink: '#ff6b9d',
  romancePurple: '#c084fc',
  passionRed: '#ff4d6d',
  soulmateBlue: '#4cc9f0',
  harmonyGreen: '#2ecc71',
};

// Vedic Numerology Compatibility System
const compatibilityRules = {
  // Destiny Number Compatibility
  destiny: {
    1: { best: [1, 3, 5], good: [2, 4, 6, 9], avoid: [7, 8] },
    2: { best: [2, 4, 6, 8], good: [1, 3, 7], avoid: [5, 9] },
    3: { best: [3, 6, 9], good: [1, 5, 8], avoid: [2, 4, 7] },
    4: { best: [2, 4, 8], good: [6, 7], avoid: [1, 3, 5, 9] },
    5: { best: [1, 5, 7], good: [3, 8, 9], avoid: [2, 4, 6] },
    6: { best: [3, 6, 9], good: [2, 4, 8], avoid: [1, 5, 7] },
    7: { best: [5, 7], good: [2, 4, 8], avoid: [1, 3, 6, 9] },
    8: { best: [2, 4, 8], good: [5, 6], avoid: [1, 3, 7, 9] },
    9: { best: [3, 6, 9], good: [1, 5], avoid: [2, 4, 7, 8] },
  },
  
  // Basic Number Compatibility
  basic: {
    1: { compatible: [1, 3, 5, 9], neutral: [2, 4, 6, 8], challenging: [7] },
    2: { compatible: [2, 4, 6, 8], neutral: [1, 3, 7, 9], challenging: [5] },
    3: { compatible: [3, 6, 9], neutral: [1, 5, 8], challenging: [2, 4, 7] },
    4: { compatible: [2, 4, 8], neutral: [6, 7], challenging: [1, 3, 5, 9] },
    5: { compatible: [1, 5, 7], neutral: [3, 8, 9], challenging: [2, 4, 6] },
    6: { compatible: [3, 6, 9], neutral: [2, 4, 8], challenging: [1, 5, 7] },
    7: { compatible: [5, 7], neutral: [2, 4, 8], challenging: [1, 3, 6, 9] },
    8: { compatible: [2, 4, 8], neutral: [5, 6], challenging: [1, 3, 7, 9] },
    9: { compatible: [3, 6, 9], neutral: [1, 5], challenging: [2, 4, 7, 8] },
  }
};

// Love Language Based on Numbers
const loveLanguages = {
  1: { primary: "Acts of Service", secondary: "Quality Time", description: "Shows love through actions and leadership" },
  2: { primary: "Words of Affirmation", secondary: "Physical Touch", description: "Expresses love through emotions and nurturing" },
  3: { primary: "Quality Time", secondary: "Words of Affirmation", description: "Shares love through growth and learning" },
  4: { primary: "Acts of Service", secondary: "Receiving Gifts", description: "Demonstrates love through stability and security" },
  5: { primary: "Physical Touch", secondary: "Quality Time", description: "Expresses love through adventure and freedom" },
  6: { primary: "Receiving Gifts", secondary: "Acts of Service", description: "Shows love through beauty and romance" },
  7: { primary: "Quality Time", secondary: "Words of Affirmation", description: "Expresses love through spiritual connection" },
  8: { primary: "Receiving Gifts", secondary: "Acts of Service", description: "Demonstrates love through protection and provision" },
  9: { primary: "Physical Touch", secondary: "Quality Time", description: "Shows love through passion and intensity" },
};

// Relationship Archetypes
const relationshipArchetypes = {
  'soulmate_connection': {
    title: "Divine Soulmate Connection",
    score: "95-100%",
    description: "A karmic bond that transcends lifetimes. Deep understanding and effortless harmony.",
    strengths: ["Telepathic connection", "Shared life purpose", "Unconditional acceptance"],
    challenges: ["Intense emotions", "Karmic lessons", "Soul growth demands"],
    advice: "Cherish this rare connection. Work through challenges with compassion."
  },
  'harmonious_partners': {
    title: "Harmonious Life Partners",
    score: "85-94%",
    description: "Balanced and supportive relationship with strong foundation for growth.",
    strengths: ["Excellent communication", "Mutual respect", "Shared values"],
    challenges: ["Comfort zone tendencies", "Need for conscious effort", "Balance maintenance"],
    advice: "Keep nurturing the relationship with conscious love and shared goals."
  },
  'growth_companions': {
    title: "Growth-Oriented Companions",
    score: "75-84%",
    description: "Relationship focused on mutual evolution and learning together.",
    strengths: ["Personal growth", "Learning opportunities", "Dynamic energy"],
    challenges: ["Different paces", "Communication gaps", "Adjustment needs"],
    advice: "Focus on patience and understanding. Celebrate differences as growth opportunities."
  },
  'karmic_teachers': {
    title: "Karmic Teachers",
    score: "65-74%",
    description: "Relationship designed for soul lessons and spiritual evolution.",
    strengths: ["Deep transformation", "Spiritual growth", "Life lessons"],
    challenges: ["Intense conflicts", "Past life patterns", "Emotional triggers"],
    advice: "Approach with mindfulness. Every challenge is an opportunity for healing."
  },
  'casual_connection': {
    title: "Casual Soul Connection",
    score: "Below 65%",
    description: "Temporary connection for specific life experiences and learning.",
    strengths: ["Fun experiences", "Freedom", "Light energy"],
    challenges: ["Lack of depth", "Different paths", "Temporary nature"],
    advice: "Enjoy the journey without expectations. Learn what you need and move forward."
  }
};

export default function MatchMakingPage() {
  const searchParams = useSearchParams();
  const [user1, setUser1] = useState(null);
  const [user2, setUser2] = useState({
    name: '',
    dob: '',
    basicNumber: null,
    destinyNumber: null,
    gridNumbers: []
  });
  const [compatibility, setCompatibility] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate numerology numbers from DOB
  const calculateNumbers = (dob) => {
    const [year, month, day] = dob.split('-');
    const dayStr = day.padStart(2, '0');
    const monthStr = month.padStart(2, '0');
    const yearStr = year;

    const sumToSingleDigit = (str) => {
      let s = [...str].map(Number).reduce((a, b) => a + b, 0);
      while (s > 9) {
        s = [...String(s)].map(Number).reduce((a, b) => a + b, 0);
      }
      return s;
    };

    // Basic Number
    let basicRaw = [...dayStr].map(Number).reduce((a, b) => a + b, 0);
    const basicNumber = basicRaw > 9 ? sumToSingleDigit(String(basicRaw)) : basicRaw;

    // Destiny Number
    const allDigits = [...dayStr, ...monthStr, ...yearStr].map(Number);
    let destinyRaw = allDigits.reduce((a, b) => a + b, 0);
    destinyRaw = sumToSingleDigit(String(destinyRaw));

    // Simple grid numbers for compatibility
    const gridDigits = [...dayStr, ...monthStr, ...yearStr.slice(2)]
      .map(Number)
      .filter(n => n !== 0);
    const gridNumbers = [...gridDigits, destinyRaw];
    if (!(parseInt(day) <= 9 || [10, 20, 30].includes(parseInt(day)))) {
      gridNumbers.push(basicNumber);
    }

    return { basicNumber, destinyNumber: destinyRaw, gridNumbers };
  };

  useEffect(() => {
    // Get User 1 data from URL parameters
    const name = searchParams.get('name') || '';
    const dob = searchParams.get('dob') || '';
    const basicNumber = searchParams.get('basicNumber');
    const destinyNumber = searchParams.get('destinyNumber');
    const gridNumbers = searchParams.getAll('gridNumbers');

    if (name && dob) {
      const user1Data = {
        name,
        dob,
        basicNumber: basicNumber ? parseInt(basicNumber) : null,
        destinyNumber: destinyNumber ? parseInt(destinyNumber) : null,
        gridNumbers: gridNumbers.map(num => parseInt(num)).filter(num => !isNaN(num))
      };
      
      setUser1(user1Data);
    }
    
    setIsLoading(false);
  }, [searchParams]);

  const handleUser2Submit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('partnerName');
    const dob = formData.get('partnerDob');

    if (!name || !dob) {
      alert('Please enter both name and date of birth for your partner');
      return;
    }

    const numbers = calculateNumbers(dob);
    const user2Data = {
      name,
      dob,
      ...numbers
    };

    setUser2(user2Data);
    calculateCompatibility(user1, user2Data);
  };

  const calculateCompatibility = (user1, user2) => {
    if (!user1 || !user2) return;

    // Destiny Number Compatibility (40% weight)
    const destinyComp = compatibilityRules.destiny[user1.destinyNumber];
    let destinyScore = 50; // Base score
    
    if (destinyComp.best.includes(user2.destinyNumber)) {
      destinyScore = 95;
    } else if (destinyComp.good.includes(user2.destinyNumber)) {
      destinyScore = 75;
    } else if (destinyComp.avoid.includes(user2.destinyNumber)) {
      destinyScore = 30;
    }

    // Basic Number Compatibility (30% weight)
    const basicComp = compatibilityRules.basic[user1.basicNumber];
    let basicScore = 50;
    
    if (basicComp.compatible.includes(user2.basicNumber)) {
      basicScore = 90;
    } else if (basicComp.neutral.includes(user2.basicNumber)) {
      basicScore = 70;
    } else if (basicComp.challenging.includes(user2.basicNumber)) {
      basicScore = 40;
    }

    // Grid Number Overlap (20% weight)
    const commonNumbers = user1.gridNumbers.filter(num => 
      user2.gridNumbers.includes(num)
    );
    const gridScore = Math.min(100, (commonNumbers.length / Math.max(user1.gridNumbers.length, user2.gridNumbers.length)) * 100);

    // Life Path Harmony (10% weight)
    const lifePathDiff = Math.abs(user1.destinyNumber - user2.destinyNumber);
    const lifePathScore = lifePathDiff <= 2 ? 90 : lifePathDiff <= 4 ? 70 : 50;

    // Final Weighted Score
    const finalScore = Math.round(
      (destinyScore * 0.4) + 
      (basicScore * 0.3) + 
      (gridScore * 0.2) + 
      (lifePathScore * 0.1)
    );

    // Determine Relationship Archetype
    let archetype;
    if (finalScore >= 95) archetype = relationshipArchetypes.soulmate_connection;
    else if (finalScore >= 85) archetype = relationshipArchetypes.harmonious_partners;
    else if (finalScore >= 75) archetype = relationshipArchetypes.growth_companions;
    else if (finalScore >= 65) archetype = relationshipArchetypes.karmic_teachers;
    else archetype = relationshipArchetypes.casual_connection;

    setCompatibility({
      score: finalScore,
      archetype,
      details: {
        destiny: { score: destinyScore, compatibility: getCompatibilityLevel(destinyScore) },
        basic: { score: basicScore, compatibility: getCompatibilityLevel(basicScore) },
        grid: { score: gridScore, compatibility: getCompatibilityLevel(gridScore) },
        lifePath: { score: lifePathScore, compatibility: getCompatibilityLevel(lifePathScore) },
        commonNumbers,
        loveLanguage1: loveLanguages[user1.destinyNumber],
        loveLanguage2: loveLanguages[user2.destinyNumber]
      }
    });
  };

  const getCompatibilityLevel = (score) => {
    if (score >= 90) return { level: "Excellent", color: colors.harmonyGreen };
    if (score >= 75) return { level: "Good", color: colors.success };
    if (score >= 60) return { level: "Moderate", color: colors.highlightGold };
    return { level: "Challenging", color: colors.warning };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center" style={{ backgroundColor: colors.primaryBg }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 mx-auto mb-4" style={{ borderColor: colors.lovePink }}></div>
          <p className="text-lg" style={{ color: colors.neutralGray }}>Loading your cosmic data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden px-4 sm:px-6 lg:px-8 pt-20 pb-12" style={{ backgroundColor: colors.primaryBg }}>
      {/* Epic Header */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 relative" style={{ 
          background: `linear-gradient(135deg, ${colors.lovePink}, ${colors.romancePurple})`,
          boxShadow: `0 0 50px ${colors.lovePink}40`
        }}>
          <span className="text-4xl">💞</span>
          <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping"></div>
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
          Cosmic Match Making
        </h1>
        <p className="text-xl max-w-3xl mx-auto" style={{ color: colors.neutralGray }}>
          Discover your divine connection through Vedic numerology compatibility
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        {!user1 ? (
          <div className="text-center p-12 rounded-2xl max-w-md mx-auto" style={{ backgroundColor: colors.secondaryBg }}>
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: colors.primaryBg }}>
              <span className="text-2xl">💔</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Your Data Missing</h3>
            <p className="mb-4" style={{ color: colors.neutralGray }}>Please generate your numerology chart first from the main calculator.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* User Profiles */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* User 1 Card */}
              <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-6 border border-[#d4af37]/20 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#ffda73] flex items-center justify-center mr-3 shadow-md">
                    <span className="text-lg text-[#0b0f19] font-bold">👤</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Your Profile</h2>
                    <p className="text-gray-400 text-sm">Numerology Ready</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-white font-semibold text-lg">{user1.name}</p>
                  <p className="text-gray-400">{user1.dob}</p>
                  <div className="flex space-x-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#ffda73]">{user1.destinyNumber}</div>
                      <div className="text-xs text-gray-500">Destiny</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#ffda73]">{user1.basicNumber}</div>
                      <div className="text-xs text-gray-500">Basic</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* User 2 Card/Form */}
              {!user2.name ? (
                <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-6 border border-[#d4af37]/20 shadow-lg">
                  <h2 className="text-xl font-bold mb-4 text-white">Your Partner's Details</h2>
                  <form onSubmit={handleUser2Submit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Partner's Full Name</label>
                      <input
                        type="text"
                        name="partnerName"
                        required
                        className="w-full p-3 rounded-lg bg-[#0b0f19] border border-gray-600 text-white placeholder-gray-500 focus:border-[#d4af37] focus:outline-none transition-colors"
                        placeholder="Enter partner's name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Partner's Date of Birth</label>
                      <input
                        type="date"
                        name="partnerDob"
                        required
                        className="w-full p-3 rounded-lg bg-[#0b0f19] border border-gray-600 text-white focus:border-[#d4af37] focus:outline-none transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:scale-105 transition-transform"
                    >
                      Calculate Compatibility
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-6 border border-[#d4af37]/20 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mr-3 shadow-md">
                      <span className="text-lg text-white font-bold">💑</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Partner's Profile</h2>
                      <p className="text-gray-400 text-sm">Numerology Calculated</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-white font-semibold text-lg">{user2.name}</p>
                    <p className="text-gray-400">{user2.dob}</p>
                    <div className="flex space-x-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-400">{user2.destinyNumber}</div>
                        <div className="text-xs text-gray-500">Destiny</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-400">{user2.basicNumber}</div>
                        <div className="text-xs text-gray-500">Basic</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Compatibility Results */}
            {compatibility && (
              <div className="space-y-8">
                {/* Main Compatibility Score */}
                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl p-8 border border-purple-500/30 shadow-2xl text-center">
                  <h2 className="text-3xl font-bold mb-4 text-white">Cosmic Compatibility Score</h2>
                  <div className="relative inline-block">
                    <div className="w-48 h-48 rounded-full flex items-center justify-center mx-auto relative" style={{
                      background: `conic-gradient(${colors.harmonyGreen} ${compatibility.score}%, ${colors.primaryBg} 0%)`,
                      boxShadow: `0 0 30px ${colors.lovePink}40`
                    }}>
                      <div className="w-40 h-40 rounded-full bg-[#0b0f19] flex items-center justify-center">
                        <div>
                          <div className="text-4xl font-bold text-white">{compatibility.score}%</div>
                          <div className="text-sm text-gray-400 mt-1">Match</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mt-6 text-transparent bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text">
                    {compatibility.archetype.title}
                  </h3>
                  <p className="text-gray-300 mt-2 max-w-2xl mx-auto">{compatibility.archetype.description}</p>
                </div>

                {/* Navigation Tabs */}
                <div className="flex space-x-4 mb-8 border-b border-gray-700">
                  {['overview', 'details', 'love-languages', 'advice'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-4 px-6 font-semibold transition-all ${
                        activeTab === tab 
                          ? 'text-pink-400 border-b-2 border-pink-400' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-6 border border-[#d4af37]/20">
                      <h3 className="text-xl font-bold mb-4 text-white">Relationship Strengths</h3>
                      <ul className="space-y-2">
                        {compatibility.archetype.strengths.map((strength, idx) => (
                          <li key={idx} className="flex items-center text-green-300">
                            <span className="text-lg mr-2">✅</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-6 border border-[#d4af37]/20">
                      <h3 className="text-xl font-bold mb-4 text-white">Growth Opportunities</h3>
                      <ul className="space-y-2">
                        {compatibility.archetype.challenges.map((challenge, idx) => (
                          <li key={idx} className="flex items-center text-yellow-300">
                            <span className="text-lg mr-2">💡</span>
                            {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'details' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Object.entries(compatibility.details).map(([key, detail]) => {
                      if (key === 'loveLanguage1' || key === 'loveLanguage2' || key === 'commonNumbers') return null;
                      return (
                        <div key={key} className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-6 border border-[#d4af37]/20 text-center">
                          <div className="text-2xl font-bold mb-2" style={{ color: detail.compatibility.color }}>
                            {detail.score}%
                          </div>
                          <div className="text-sm font-semibold text-white mb-1 capitalize">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </div>
                          <div className="text-xs" style={{ color: detail.compatibility.color }}>
                            {detail.compatibility.level}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeTab === 'love-languages' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 rounded-2xl p-6 border border-pink-500/30">
                      <h3 className="text-xl font-bold mb-4 text-pink-300">{user1.name}'s Love Language</h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-gray-400">Primary: </span>
                          <span className="text-white font-semibold">{compatibility.details.loveLanguage1.primary}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Secondary: </span>
                          <span className="text-white font-semibold">{compatibility.details.loveLanguage1.secondary}</span>
                        </div>
                        <p className="text-gray-300 text-sm">{compatibility.details.loveLanguage1.description}</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-2xl p-6 border border-cyan-500/30">
                      <h3 className="text-xl font-bold mb-4 text-cyan-300">{user2.name}'s Love Language</h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-gray-400">Primary: </span>
                          <span className="text-white font-semibold">{compatibility.details.loveLanguage2.primary}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Secondary: </span>
                          <span className="text-white font-semibold">{compatibility.details.loveLanguage2.secondary}</span>
                        </div>
                        <p className="text-gray-300 text-sm">{compatibility.details.loveLanguage2.description}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'advice' && (
                  <div className="bg-gradient-to-br from-green-900/20 to-emerald-800/10 rounded-2xl p-8 border border-green-500/30">
                    <h3 className="text-2xl font-bold mb-6 text-green-300 text-center">Relationship Guidance</h3>
                    <div className="space-y-6">
                      <p className="text-gray-300 text-lg text-center leading-relaxed">
                        {compatibility.archetype.advice}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div className="text-center p-4">
                          <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: colors.primaryBg, color: colors.accentGold }}>
                            💬
                          </div>
                          <h4 className="font-semibold mb-2 text-white">Communication</h4>
                          <p className="text-sm" style={{ color: colors.neutralGray }}>
                            Practice active listening and express needs clearly
                          </p>
                        </div>
                        <div className="text-center p-4">
                          <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: colors.primaryBg, color: colors.accentGold }}>
                            🌱
                          </div>
                          <h4 className="font-semibold mb-2 text-white">Growth</h4>
                          <p className="text-sm" style={{ color: colors.neutralGray }}>
                            Support each other's personal and spiritual evolution
                          </p>
                        </div>
                        <div className="text-center p-4">
                          <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: colors.primaryBg, color: colors.accentGold }}>
                            ⚖️
                          </div>
                          <h4 className="font-semibold mb-2 text-white">Balance</h4>
                          <p className="text-sm" style={{ color: colors.neutralGray }}>
                            Maintain individuality while building togetherness
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Try Another Match */}
            {user2.name && (
              <div className="text-center">
                <button
                  onClick={() => {
                    setUser2({ name: '', dob: '', basicNumber: null, destinyNumber: null, gridNumbers: [] });
                    setCompatibility(null);
                  }}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-8 rounded-xl font-semibold hover:scale-105 transition-transform"
                >
                  Try Another Match
                </button>
              </div>
            )}
          </div>
        )}

        {/* Cosmic Love Quote */}
        <div className="text-center mt-16">
          <blockquote className="text-lg italic text-gray-400 max-w-2xl mx-auto">
            "The meeting of two personalities is like the contact of two chemical substances: if there is any reaction, both are transformed."
            <footer className="text-sm mt-2 text-gray-500">- Carl Jung</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}