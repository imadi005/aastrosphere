// app/karmic/page.jsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Brand Colors
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
};

// Karmic Debt Information
const karmicInfo = {
  13: {
    title: 'Karmic Debt Number 13',
    case: 'The 13 indicates abuse of morality in a past life, often dealing with material gain. With karmic debt of 13 in your core number calculations, you\'ll have to work much harder than others to achieve success. You\'ll face obstacles on the road to progress and stability.',
    remedy: 'Avoid shortcuts. Build discipline and take steady, methodical steps to remove this karmic influence and fulfill your greater purpose.',
    icon: '⚖️',
    severity: 'High',
    areas: ['Work Ethic', 'Discipline', 'Patience'],
    color: 'from-red-500/20 to-red-800/10',
    border: 'border-red-500'
  },
  14: {
    title: 'Karmic Debt Number 14',
    case: 'The 14 stems from freedom-related imbalances in past lifetimes. It reflects misuse of liberty, addictive tendencies, or lack of personal boundaries. You may face instability and restlessness.',
    remedy: 'Learn self-control, establish strong boundaries, and balance your need for freedom with responsibility.',
    icon: '🕊️',
    severity: 'Medium',
    areas: ['Freedom', 'Addictions', 'Boundaries'],
    color: 'from-orange-500/20 to-orange-800/10',
    border: 'border-orange-500'
  },
  16: {
    title: 'Karmic Debt Number 16',
    case: 'This number is tied to past-life betrayal or abuse of love. In this life, it manifests as repeated emotional pain or destructive relationships. You may experience deep transformation through personal loss.',
    remedy: 'Heal emotional wounds, develop spiritual awareness, and build inner strength through humility and honesty.',
    icon: '💔',
    severity: 'High',
    areas: ['Relationships', 'Emotions', 'Trust'],
    color: 'from-purple-500/20 to-purple-800/10',
    border: 'border-purple-500'
  },
  19: {
    title: 'Karmic Debt Number 19',
    case: 'The 19 indicates an abuse of power or control in a past life. It manifests in this life as challenges in asking for help, ego struggles, or experiencing isolation.',
    remedy: 'Serve others with compassion, let go of control, and cultivate interdependence instead of excessive independence.',
    icon: '👑',
    severity: 'Medium',
    areas: ['Power', 'Control', 'Ego'],
    color: 'from-yellow-500/20 to-yellow-800/10',
    border: 'border-yellow-500'
  },
};

export default function KarmicDebtPage() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [personalInfo, setPersonalInfo] = useState({});

  useEffect(() => {
    // Get data from URL parameters
    const name = searchParams.get('name') || '';
    const dob = searchParams.get('dob') || '';
    
    setPersonalInfo({ name, dob });

    if (dob) {
      try {
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
        const karma = karmicInfo[totalBeforeReduction];

        setResult({
          dob: `${dayStr}-${monthStr}-${yearStr}`,
          name: formattedName,
          path,
          totalBeforeReduction,
          hasKarmicDebt,
          ...(karma || {})
        });
      } catch (error) {
        console.error('Error calculating karmic debt:', error);
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
               style={{ borderColor: colors.accentGold }}></div>
          <p className="text-lg" style={{ color: colors.neutralGray }}>Analyzing your karmic patterns...</p>
          <p className="text-sm mt-2" style={{ color: colors.neutralGray }}>Reading past life energies</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full overflow-x-hidden px-4 sm:px-6 lg:px-8 pt-20 pb-12"
      style={{ backgroundColor: colors.primaryBg }}
    >
      {/* Header Section */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
             style={{ backgroundColor: colors.secondaryBg }}>
          <span className="text-3xl">🔄</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Karmic Debt Analysis
        </h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.neutralGray }}>
          Discover past life patterns and karmic lessons influencing your current journey
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Personal Info Card */}
        <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-6 border border-[#d4af37]/20 shadow-lg mb-8">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#ffda73] flex items-center justify-center mr-3 shadow-md">
              <span className="text-lg text-[#0b0f19] font-bold">👤</span>
            </div>
            <h2 className="text-xl font-bold text-white">Personal Profile</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0b0f19] rounded-xl p-4 border border-[#d4af37]/10">
              <p className="text-sm text-gray-400 font-medium mb-2">NAME</p>
              <p className="text-white font-semibold text-lg">
                {personalInfo.name || 'Not provided'}
              </p>
            </div>
            
            <div className="bg-[#0b0f19] rounded-xl p-4 border border-[#d4af37]/10">
              <p className="text-sm text-gray-400 font-medium mb-2">DATE OF BIRTH</p>
              <p className="text-white font-semibold text-lg">{personalInfo.dob || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {result ? (
          <div className="space-y-8">
            {/* Numerical Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-6 border border-[#d4af37]/20 shadow-lg text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                     style={{ backgroundColor: colors.primaryBg }}>
                  <span className="text-2xl">🔢</span>
                </div>
                <h3 className="text-sm text-gray-400 font-medium mb-2">LIFE PATH NUMBER</h3>
                <p className="text-3xl font-bold" style={{ color: colors.highlightGold }}>{result.path}</p>
                <p className="text-xs text-gray-500 mt-2">Your core life purpose</p>
              </div>

              <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-6 border border-[#d4af37]/20 shadow-lg text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                     style={{ backgroundColor: colors.primaryBg }}>
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-sm text-gray-400 font-medium mb-2">KARMIC NUMBER</h3>
                <p className="text-3xl font-bold" style={{ color: colors.highlightGold }}>{result.totalBeforeReduction}</p>
                <p className="text-xs text-gray-500 mt-2">Before reduction</p>
              </div>

              <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-6 border border-[#d4af37]/20 shadow-lg text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                     style={{ backgroundColor: colors.primaryBg }}>
                  <span className="text-2xl">{result.hasKarmicDebt ? '⚡' : '✅'}</span>
                </div>
                <h3 className="text-sm text-gray-400 font-medium mb-2">KARMIC STATUS</h3>
                <p className={`text-lg font-bold ${result.hasKarmicDebt ? 'text-red-400' : 'text-green-400'}`}>
                  {result.hasKarmicDebt ? 'Debt Detected' : 'No Karmic Debt'}
                </p>
                <p className="text-xs text-gray-500 mt-2">Past life influence</p>
              </div>
            </div>

            {/* Karmic Debt Analysis */}
            {result.hasKarmicDebt ? (
              <div className="space-y-6">
                {/* Karmic Debt Card */}
                <div className={`bg-gradient-to-br ${result.color} rounded-2xl p-8 border-2 ${result.border} shadow-2xl`}>
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
                    <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
                           style={{ backgroundColor: colors.primaryBg }}>
                        {result.icon}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{result.title}</h2>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                            result.severity === 'High' 
                              ? 'bg-red-500 text-white' 
                              : 'bg-yellow-500 text-black'
                          }`}>
                            {result.severity} Priority
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Affected Areas */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 flex items-center"
                        style={{ color: colors.accentGold }}>
                      <span className="w-1 h-4 rounded-full mr-2" style={{ backgroundColor: colors.accentGold }}></span>
                      Areas of Influence
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.areas.map((area, index) => (
                        <span 
                          key={index}
                          className="bg-black/30 text-white px-3 py-2 rounded-lg text-sm font-semibold border border-white/10"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Karmic Story */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 flex items-center"
                          style={{ color: colors.accentCyan }}>
                        <span className="w-1 h-4 rounded-full mr-2" style={{ backgroundColor: colors.accentCyan }}></span>
                        Past Life Pattern
                      </h3>
                      <p className="text-gray-200 leading-relaxed" style={{ color: colors.neutralGray }}>
                        {result.case}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 flex items-center"
                          style={{ color: colors.success }}>
                        <span className="w-1 h-4 rounded-full mr-2" style={{ backgroundColor: colors.success }}></span>
                        Healing Remedy
                      </h3>
                      <p className="text-gray-200 leading-relaxed italic" style={{ color: colors.neutralGray }}>
                        {result.remedy}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Spiritual Guidance */}
                <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-8 border border-[#d4af37]/20 shadow-lg">
                  <h2 className="text-2xl font-bold text-center mb-6 text-white">🌟 Spiritual Guidance</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4">
                      <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                           style={{ backgroundColor: colors.primaryBg, color: colors.accentGold }}>
                        🧘
                      </div>
                      <h3 className="font-semibold mb-2 text-white">Meditation</h3>
                      <p className="text-sm" style={{ color: colors.neutralGray }}>
                        Practice daily meditation to connect with your higher self and release past patterns
                      </p>
                    </div>
                    
                    <div className="text-center p-4">
                      <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                           style={{ backgroundColor: colors.primaryBg, color: colors.accentGold }}>
                        📝
                      </div>
                      <h3 className="font-semibold mb-2 text-white">Journaling</h3>
                      <p className="text-sm" style={{ color: colors.neutralGray }}>
                        Write about recurring patterns to understand and transform karmic lessons
                      </p>
                    </div>
                    
                    <div className="text-center p-4">
                      <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                           style={{ backgroundColor: colors.primaryBg, color: colors.accentGold }}>
                        💫
                      </div>
                      <h3 className="font-semibold mb-2 text-white">Service</h3>
                      <p className="text-sm" style={{ color: colors.neutralGray }}>
                        Help others selflessly to balance karmic energy and create positive new patterns
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* No Karmic Debt */
              <div className="bg-gradient-to-br from-green-900/20 to-emerald-800/10 rounded-2xl p-8 border-2 border-green-500 shadow-2xl text-center">
                <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-green-500/20">
                  <span className="text-3xl">✅</span>
                </div>
                <h2 className="text-3xl font-bold text-green-300 mb-4">No Karmic Debt Detected</h2>
                <p className="text-xl mb-6 text-gray-200">
                  Your soul is not carrying significant karmic burdens from past lives through your birth date.
                </p>
                <div className="bg-black/30 rounded-xl p-6 border border-green-500/30 max-w-2xl mx-auto">
                  <h3 className="text-lg font-semibold text-green-300 mb-3">🌟 Positive Soul Journey</h3>
                  <p className="text-gray-300 mb-4">
                    This indicates a relatively clear path forward. However, maintain mindfulness and continue 
                    making conscious choices to stay aligned with your soul's purpose.
                  </p>
                  <div className="flex justify-center space-x-4 text-sm">
                    <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full">Clear Path</span>
                    <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full">Soul Growth</span>
                    <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full">Conscious Living</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* No Data Available */
          <div className="text-center p-12 rounded-2xl max-w-md mx-auto" 
               style={{ backgroundColor: colors.secondaryBg }}>
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                 style={{ backgroundColor: colors.primaryBg }}>
              <span className="text-2xl">🤔</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">No Data Available</h3>
            <p className="mb-4" style={{ color: colors.neutralGray }}>
              Please generate your numerology chart first from the main calculator.
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 text-center">
          <p className="text-xs" style={{ color: `${colors.neutralGray}99` }}>
            Note: Karmic debt analysis is based on numerological patterns and should be used for spiritual guidance purposes only. 
            Your current actions and choices always have the power to transform your destiny.
          </p>
        </div>
      </div>
    </div>
  );
}