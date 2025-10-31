// app/relationship-checker/page.jsx
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
};

// Comprehensive Love Personality Insights with Vedic Depth
const lovePersonalityInsights = {
  2: {
    title: 'Emotional & Nurturing Soul',
    icon: '🌙',
    planet: 'Moon',
    element: 'Water',
    loveStyle: 'Caretaker • Empathetic • Family-Focused',
    strength: 'Deep emotional intelligence and nurturing nature',
    challenge: 'May become overly sensitive or dependent',
    soulmateMatch: 'Numbers 6, 3, 9 - Balanced and appreciative partners',
    text: 'The number 2 represents emotions, and the moon is known for its nurturing qualities. When the Dasha of 2 comes into play, it signifies emotional receptivity and openness to deeper connections. This period enhances your natural ability to understand partner emotions and create harmonious relationships.',
    timing: 'Ideal marriage periods: Ages 25, 34, 43 during Moon Mahadasha',
    remedies: 'Wear pearl, practice emotional balance, moon meditation',
    intensity: 'Medium-High',
    compatibilityScore: '92%'
  },
  3: {
    title: 'Wise & Growth-Oriented Partner',
    icon: '🪐',
    planet: 'Jupiter',
    element: 'Fire',
    loveStyle: 'Philosophical • Optimistic • Knowledge-Seeker',
    strength: 'Wisdom in relationships and growth mindset',
    challenge: 'May over-analyze or be too idealistic',
    soulmateMatch: 'Numbers 6, 2, 1 - Practical and grounded partners',
    text: 'Jupiter, represented by the number 3, brings wisdom, expansion, and philosophical depth to relationships. During Dasha of 3, you seek meaningful connections and personal growth through partnerships. This period enhances your ability to make wise relationship decisions.',
    timing: 'Favorable marriage timing: Ages 28, 37, 46 during Jupiter Mahadasha',
    remedies: 'Wear yellow sapphire, practice gratitude, Guru mantras',
    intensity: 'Medium',
    compatibilityScore: '88%'
  },
  6: {
    title: 'Romantic & Artistic Lover',
    icon: '✨',
    planet: 'Venus',
    element: 'Earth',
    loveStyle: 'Romantic • Artistic • Comfort-Loving',
    strength: 'Natural romantic and creator of beautiful relationships',
    challenge: 'May prioritize luxury over practicality',
    soulmateMatch: 'Numbers 2, 3, 9 - Emotional and passionate partners',
    text: 'The number 6 is the primary love number, closely associated with romance, beauty, and marriage. When Dasha of 6 activates, it brings heightened romantic sensitivity and desire for partnership. This is the most favorable period for marriage and deep emotional bonds.',
    timing: 'Perfect marriage window: Ages 24, 33, 42 during Venus Mahadasha',
    remedies: 'Wear diamond, create beautiful spaces, Venus worship',
    intensity: 'Very High',
    compatibilityScore: '95%'
  },
  9: {
    title: 'Passionate & Dynamic Partner',
    icon: '🔥',
    planet: 'Mars',
    element: 'Fire',
    loveStyle: 'Passionate • Assertive • Protective',
    strength: 'Intense passion and protective nature',
    challenge: 'May be too impulsive or dominant',
    soulmateMatch: 'Numbers 6, 2, 4 - Balanced and understanding partners',
    text: 'The number 9, ruled by Mars, brings fiery passion, confidence, and assertiveness to relationships. During Dasha of 9, you become proactive in pursuing love and expressing desires. This energy drives you toward commitment and marriage.',
    timing: 'Dynamic marriage periods: Ages 26, 35, 44 during Mars Mahadasha',
    remedies: 'Wear red coral, physical activities, Hanuman worship',
    intensity: 'High',
    compatibilityScore: '85%'
  },
  'combo_17': {
    title: 'Assertive Romantic Seeker',
    icon: '💫',
    planets: 'Sun + Ketu',
    element: 'Fire + Ether',
    loveStyle: 'Assertive • Spiritual • Independent',
    strength: 'Unique blend of leadership and spiritual depth',
    challenge: 'May struggle with balancing independence and partnership',
    soulmateMatch: 'Numbers 3, 6, 2 - Grounded and emotionally available partners',
    text: 'The powerful combination of 1 (Sun) and 7 (Ketu) creates assertive yet spiritually inclined romantic energy. You actively seek partners while maintaining spiritual integrity. This combination often leads to initiating serious relationships and marriage proposals.',
    timing: 'Special timing during Sun/Ketu periods',
    remedies: 'Balance solar and ketu energies, meditation',
    intensity: 'High',
    compatibilityScore: '87%'
  },
  'combo_62': {
    title: 'Luxury & Sensitivity in Love',
    icon: '💝',
    planets: 'Venus + Moon',
    element: 'Earth + Water',
    loveStyle: 'Luxurious • Emotional • Artistic',
    strength: 'Perfect blend of romance and emotional depth',
    challenge: 'May become too materialistic or emotionally dependent',
    soulmateMatch: 'Numbers 3, 9, 1 - Balanced and growth-oriented partners',
    text: 'This magical combination blends Venus luxury and romance with Moon emotional sensitivity. When active, it creates periods of intense emotional and romantic connection. You experience love as both beautiful art and deep emotional bonding.',
    timing: 'Highly favorable during Venus/Moon periods',
    remedies: 'Balance material and emotional needs, creative expression',
    intensity: 'Very High',
    compatibilityScore: '94%'
  },
  1: {
    title: 'Leadership in Love',
    icon: '👑',
    planet: 'Sun',
    element: 'Fire',
    loveStyle: 'Independent • Leadership • Proud',
    strength: 'Strong personality and relationship leadership',
    challenge: 'May be too dominant or independent',
    soulmateMatch: 'Numbers 3, 6, 2 - Supportive and understanding partners',
    text: 'Number 1 brings leadership qualities and independence to relationships. You take charge in love matters and prefer partnerships where mutual respect and individuality are maintained.',
    timing: 'Leadership marriage timing: Ages 29, 38, 47',
    remedies: 'Wear ruby, practice humility, Sun worship',
    intensity: 'Medium-High',
    compatibilityScore: '83%'
  },
  7: {
    title: 'Mystical Soul Connection',
    icon: '🔮',
    planet: 'Ketu',
    element: 'Ether',
    loveStyle: 'Spiritual • Mysterious • Deep',
    strength: 'Soul-level connections and spiritual bonding',
    challenge: 'May be too detached or mysterious',
    soulmateMatch: 'Numbers 2, 9, 5 - Grounded and passionate partners',
    text: 'Number 7 brings spiritual depth and mysterious attraction to relationships. You seek soul connections rather than superficial bonds, often experiencing intense karmic relationships.',
    timing: 'Spiritual union periods: Ages 27, 36, 45',
    remedies: 'Wear cat\'s eye, meditation, spiritual practices',
    intensity: 'High',
    compatibilityScore: '86%'
  }
};

// Love Archetypes based on combinations
const loveArchetypes = {
  'romantic_nurturer': {
    title: 'The Romantic Nurturer',
    description: 'Combines Venus romance with Moon nurturing - creates the perfect caregiver and romantic partner',
    traits: ['Empathetic', 'Artistic', 'Family-Oriented', 'Compassionate'],
    idealFor: 'Long-term marriage and family life'
  },
  'passionate_leader': {
    title: 'The Passionate Leader', 
    description: 'Mars passion with Sun leadership - creates dynamic and protective relationship energy',
    traits: ['Assertive', 'Protective', 'Dynamic', 'Confident'],
    idealFor: 'Exciting and growth-oriented partnerships'
  },
  'wise_romantic': {
    title: 'The Wise Romantic',
    description: 'Jupiter wisdom with Venus romance - creates philosophical yet deeply loving connections',
    traits: ['Philosophical', 'Romantic', 'Growth-Minded', 'Optimistic'],
    idealFor: 'Spiritually and intellectually stimulating relationships'
  }
};

export default function LovePersonalityPredictionPage() {
  const searchParams = useSearchParams();
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activePersonality, setActivePersonality] = useState(null);

  useEffect(() => {
    // Get data from URL parameters
    const gridNumbers = searchParams.getAll('gridNumbers');
    const name = searchParams.get('name') || '';
    const dob = searchParams.get('dob') || '';
    const destinyNumber = searchParams.get('destinyNumber');
    const currentMaha = searchParams.get('maha');
    const currentAntar = searchParams.get('antar');

    if (gridNumbers && gridNumbers.length > 0) {
      try {
        const numbers = gridNumbers.map(num => parseInt(num)).filter(num => !isNaN(num));
        
        // Count occurrences
        const counts = {};
        numbers.forEach(n => {
          counts[n] = (counts[n] || 0) + 1;
        });

        const foundInsights = [];

        // Individual love-focused numbers
        [2, 3, 6, 9, 1, 7].forEach(num => {
          if (counts[num]) {
            foundInsights.push({
              ...lovePersonalityInsights[num],
              count: counts[num],
              type: 'number'
            });
          }
        });

        // Check combinations
        if (counts[1] && counts[7]) {
          foundInsights.push({
            ...lovePersonalityInsights['combo_17'],
            type: 'combo'
          });
        }

        if (counts[6] && counts[2]) {
          foundInsights.push({
            ...lovePersonalityInsights['combo_62'],
            type: 'combo'
          });
        }

        // Determine love archetype
        let loveArchetype = null;
        if (counts[6] && counts[2]) {
          loveArchetype = loveArchetypes.romantic_nurturer;
        } else if (counts[9] && counts[1]) {
          loveArchetype = loveArchetypes.passionate_leader;
        } else if (counts[3] && counts[6]) {
          loveArchetype = loveArchetypes.wise_romantic;
        }

        // Calculate overall romantic potential
        const hasStrongLoveEnergy = counts[6] >= 2 || counts[2] >= 2 || (counts[6] && counts[2]);
        const romanticPotential = hasStrongLoveEnergy ? "Very High" : 
                                foundInsights.length >= 2 ? "High" : 
                                foundInsights.length === 1 ? "Medium" : "Low";

        setAnalysis({
          name,
          dob,
          insights: foundInsights,
          loveArchetype,
          romanticPotential,
          currentMaha,
          currentAntar,
          destinyNumber,
          totalLoveTraits: foundInsights.length
        });

        // Set first insight as active
        if (foundInsights.length > 0) {
          setActivePersonality(foundInsights[0]);
        }

      } catch (error) {
        console.error('Error analyzing love personality:', error);
      }
    }
    
    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) {
    return (
      <div 
        className="min-h-screen w-full flex items-center justify-center"
        style={{ backgroundColor: colors.primaryBg }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 mx-auto mb-4" 
               style={{ borderColor: colors.lovePink }}></div>
          <p className="text-lg" style={{ color: colors.neutralGray }}>Discovering your love personality...</p>
          <p className="text-sm mt-2" style={{ color: colors.neutralGray }}>Reading romantic energies</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full overflow-x-hidden px-4 sm:px-6 lg:px-8 pt-20 pb-12"
      style={{ backgroundColor: colors.primaryBg }}
    >
      {/* Epic Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 relative"
             style={{ 
               background: `linear-gradient(135deg, ${colors.lovePink}, ${colors.romancePurple})`,
               boxShadow: `0 0 50px ${colors.lovePink}40`
             }}>
          <span className="text-4xl">💖</span>
          <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping"></div>
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
          Love Personality Blueprint
        </h1>
        <p className="text-xl max-w-3xl mx-auto" style={{ color: colors.neutralGray }}>
          Discover your unique romantic archetype through Vedic numerology
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        {analysis ? (
          <div className="space-y-8">
            {/* Romantic Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-6 border border-[#d4af37]/20 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#ffda73] flex items-center justify-center mr-3 shadow-md">
                    <span className="text-lg text-[#0b0f19] font-bold">👤</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">Soul Profile</h2>
                </div>
                <p className="text-white font-semibold mb-2">{analysis.name}</p>
                <p className="text-gray-400 text-sm">{analysis.dob}</p>
              </div>

              <div className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 rounded-2xl p-6 border border-pink-500/30 shadow-lg text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                     style={{ backgroundColor: colors.primaryBg }}>
                  <span className="text-xl">🌟</span>
                </div>
                <h3 className="text-sm text-gray-400 font-medium mb-2">ROMANTIC POTENTIAL</h3>
                <p className={`text-2xl font-bold ${
                  analysis.romanticPotential === 'Very High' ? 'text-pink-400' :
                  analysis.romanticPotential === 'High' ? 'text-green-400' :
                  analysis.romanticPotential === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {analysis.romanticPotential}
                </p>
                <p className="text-xs text-gray-500 mt-1">{analysis.totalLoveTraits} love traits</p>
              </div>

              <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-6 border border-[#d4af37]/20 shadow-lg text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                     style={{ backgroundColor: colors.primaryBg }}>
                  <span className="text-xl">💫</span>
                </div>
                <h3 className="text-sm text-gray-400 font-medium mb-2">CURRENT ENERGY</h3>
                <p className="text-white font-semibold text-lg">
                  M: {analysis.currentMaha || '-'} • A: {analysis.currentAntar || '-'}
                </p>
                <p className="text-xs text-gray-500 mt-1">Mahadasha • Antardasha</p>
              </div>

              <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-2xl p-6 border border-cyan-500/30 shadow-lg text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                     style={{ backgroundColor: colors.primaryBg }}>
                  <span className="text-xl">💞</span>
                </div>
                <h3 className="text-sm text-gray-400 font-medium mb-2">SOULMATE READINESS</h3>
                <p className="text-white font-semibold text-lg">
                  {analysis.romanticPotential === 'Very High' ? 'Ready' : 'Developing'}
                </p>
                <p className="text-xs text-gray-500 mt-1">Connection Level</p>
              </div>
            </div>

            {/* Love Archetype */}
            {analysis.loveArchetype && (
              <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl p-8 border border-purple-500/30 shadow-2xl">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text mb-2">
                    Your Love Archetype
                  </h2>
                  <p className="text-gray-300">Your unique romantic personality pattern</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-pink-300 mb-3">{analysis.loveArchetype.title}</h3>
                    <p className="text-gray-300 mb-4">{analysis.loveArchetype.description}</p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-white">Key Traits:</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.loveArchetype.traits.map((trait, idx) => (
                          <span 
                            key={idx}
                            className="bg-black/30 text-pink-200 px-3 py-1 rounded-full text-sm border border-pink-500/30"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="mt-4 text-cyan-300 font-semibold">
                      💫 Ideal for: {analysis.loveArchetype.idealFor}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full mx-auto flex items-center justify-center text-4xl"
                         style={{ 
                           background: `linear-gradient(135deg, ${colors.lovePink}, ${colors.romancePurple})`,
                           boxShadow: `0 0 30px ${colors.lovePink}40`
                         }}>
                      {analysis.insights[0]?.icon || '💖'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Personality Selector */}
            <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-6 border border-[#d4af37]/20 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-white">
                🎭 Your Love Personalities
              </h2>
              <div className="flex flex-wrap gap-3 justify-center">
                {analysis.insights.map((insight, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePersonality(insight)}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                      activePersonality?.title === insight.title
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-105'
                        : 'bg-[#0b0f19] text-gray-300 border border-gray-600 hover:border-pink-500'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{insight.icon}</span>
                      <span>{insight.type === 'combo' ? 'Combo' : `Number ${Object.keys(lovePersonalityInsights).find(key => lovePersonalityInsights[key].title === insight.title)}`}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Personality Detail */}
            {activePersonality && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Main Personality Card */}
                <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-8 border border-[#d4af37]/20 shadow-2xl">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
                           style={{ backgroundColor: colors.primaryBg }}>
                        {activePersonality.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{activePersonality.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="bg-pink-500 text-white px-2 py-1 rounded text-xs font-bold">
                            {activePersonality.planet}
                          </span>
                          <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-bold">
                            {activePersonality.element}
                          </span>
                          {activePersonality.count && (
                            <span className="bg-cyan-500 text-white px-2 py-1 rounded text-xs font-bold">
                              {activePersonality.count}x
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">{activePersonality.compatibilityScore}</div>
                      <div className="text-xs text-gray-400">Compatibility</div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wider mb-2 flex items-center"
                          style={{ color: colors.accentGold }}>
                        <span className="w-1 h-4 rounded-full mr-2" style={{ backgroundColor: colors.accentGold }}></span>
                        Love Style
                      </h4>
                      <p className="text-lg font-semibold text-pink-300">{activePersonality.loveStyle}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wider mb-2 flex items-center"
                          style={{ color: colors.accentCyan }}>
                        <span className="w-1 h-4 rounded-full mr-2" style={{ backgroundColor: colors.accentCyan }}></span>
                        Personality Insight
                      </h4>
                      <p className="text-gray-300 leading-relaxed">{activePersonality.text}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-1">Strength</h4>
                        <p className="text-green-300 text-sm">{activePersonality.strength}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-1">Challenge</h4>
                        <p className="text-yellow-300 text-sm">{activePersonality.challenge}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Side Details */}
                <div className="space-y-6">
                  {/* Soulmate Match */}
                  <div className="bg-gradient-to-br from-green-900/20 to-emerald-800/10 rounded-2xl p-6 border border-green-500/30">
                    <h4 className="text-lg font-bold text-green-300 mb-3">💑 Ideal Soulmate Match</h4>
                    <p className="text-gray-300 mb-2">{activePersonality.soulmateMatch}</p>
                    <div className="flex space-x-2 mt-3">
                      {activePersonality.soulmateMatch.split(' - ')[0].split(' ')[2].split(',').map(num => (
                        <span key={num} className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-sm">
                          {num}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Timing & Remedies */}
                  <div className="bg-gradient-to-br from-blue-900/20 to-cyan-800/10 rounded-2xl p-6 border border-blue-500/30">
                    <h4 className="text-lg font-bold text-cyan-300 mb-3">⏰ Marriage Timing</h4>
                    <p className="text-gray-300 mb-4">{activePersonality.timing}</p>
                    <h4 className="text-lg font-bold text-cyan-300 mb-3">🕉️ Remedies</h4>
                    <p className="text-gray-300">{activePersonality.remedies}</p>
                  </div>

                  {/* Energy Intensity */}
                  <div className="bg-gradient-to-br from-orange-900/20 to-red-800/10 rounded-2xl p-6 border border-orange-500/30">
                    <h4 className="text-lg font-bold text-orange-300 mb-2">🔥 Romantic Intensity</h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-700 rounded-full h-3">
                        <div 
                          className="h-3 rounded-full bg-gradient-to-r from-pink-500 to-red-500"
                          style={{ 
                            width: activePersonality.intensity === 'Very High' ? '100%' :
                                   activePersonality.intensity === 'High' ? '80%' :
                                   activePersonality.intensity === 'Medium-High' ? '70%' : '50%'
                          }}
                        ></div>
                      </div>
                      <span className="text-white font-semibold">{activePersonality.intensity}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Match Making CTA */}
            <div className="text-center mt-12">
  <button
    onClick={() => {
      // Current URL ke parameters directly pass karo
      const currentParams = window.location.search;
      window.location.href = `/relationships${currentParams}`;
    }}
    className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white py-4 px-12 rounded-2xl font-bold text-xl shadow-2xl hover:scale-105 transition-transform relative overflow-hidden group"
  >
    <span className="relative z-10">💞 Discover My Perfect Match</span>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
  </button>
  <p className="text-gray-400 mt-4 text-sm">
    Find partners who complement your unique love personality
  </p>
</div>
          </div>
        ) : (
          <div className="text-center p-12 rounded-2xl max-w-md mx-auto" 
               style={{ backgroundColor: colors.secondaryBg }}>
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                 style={{ backgroundColor: colors.primaryBg }}>
              <span className="text-2xl">💔</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">No Love Data Available</h3>
            <p className="mb-4" style={{ color: colors.neutralGray }}>
              Please generate your numerology chart first from the main calculator.
            </p>
          </div>
        )}

        {/* Romantic Quote */}
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