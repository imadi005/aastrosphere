// app/health-checker/HealthCheckerClient.jsx
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
  gridBorder: '#8b5cf6',
  gridBg: '#000000',
};

// Health Data
const healthData = {
  1: {
    issues: 'Headache, eye problems, migraine, heat stroke, heart problems, ENT (Ear, Nose, Throat) issues.',
    analysis: 'Individuals may frequently experience ailments such as headaches, migraines, or ENT-related concerns. During adverse dashas, heart-related issues or heat strokes may also arise.'
  },
  2: {
    issues: 'Depression, insomnia, disturbed menstrual cycle (for women), indigestion.',
    analysis: 'People with number 2 in their chart often deal with emotional disturbances, leading to insomnia or digestive discomfort. Women may face menstrual irregularities especially during stressful periods.'
  },
  3: {
    issues: 'Liver issues, skin problems, ear issues, gland problems, tonsils.',
    analysis: 'Number 3 may manifest physically in skin outbreaks, weak liver functions, or tonsil problems, especially if recurring in the grid or destiny cycle.'
  },
  4: {
    issues: 'Diabetes, asthma, heart problems, diagnostic confusion.',
    analysis: 'This number is associated with chronic conditions like diabetes and asthma. People may also suffer from diagnostic delays or confusion in treatment processes.'
  },
  5: {
    issues: 'Anxiety, insomnia, skin problems, constipation, nervous breakdown, weak immunity, general weakness.',
    analysis: 'Number 5 represents nervous energy. Repeated occurrence may lead to long-term anxiety or breakdowns. Exercise and physical intimacy can serve as healing remedies.'
  },
  6: {
    issues: 'Gynecological issues, low sperm count(for men), coughs, colds, miscarriages or abortions.',
    analysis: 'Linked with reproductive and hormonal health, number 6 shows gynec issues in women and sperm count(for men ) or miscarriage concerns in both genders.'
  },
  7: {
    issues: 'Anxiety, sleep disorders, instability, indigestion.',
    analysis: 'Mental imbalance or chronic stress is common with this number. Digestive weakness or nervous digestion can appear in health cycles.'
  },
  8: {
    issues: 'Teeth and digestion problems, memory loss after age 55, intestinal issues (especially for destiny number 8).',
    analysis: 'Chronic digestive issues, dental weakness, and aging memory concerns are visible. More intense if this is your destiny number.'
  },
  9: {
    issues: 'High fevers, pimples, accidents, throat infections.',
    analysis: 'Indicative of sudden health upsets like infections, fevers, or accidents. Strong Mars energy can lead to heat-related symptoms.'
  }
};

// Severity Configuration
const severityConfig = {
  Severe: {
    border: `border-[${colors.warning}]`,
    bg: 'bg-gradient-to-r from-red-900/20 to-red-800/10',
    text: `text-[${colors.warning}]`,
    badge: `bg-[${colors.warning}] text-white`,
    glow: 'shadow-red-500/20',
    icon: '🔴'
  },
  Moderate: {
    border: `border-[${colors.highlightGold}]`,
    bg: 'bg-gradient-to-r from-yellow-900/20 to-amber-800/10',
    text: `text-[${colors.highlightGold}]`,
    badge: `bg-[${colors.highlightGold}] text-[${colors.primaryBg}]`,
    glow: 'shadow-yellow-500/20',
    icon: '🟡'
  },
  Mild: {
    border: `border-[${colors.success}]`,
    bg: 'bg-gradient-to-r from-green-900/20 to-emerald-800/10',
    text: `text-[${colors.success}]`,
    badge: `bg-[${colors.success}] text-white`,
    glow: 'shadow-green-500/20',
    icon: '🟢'
  },
};

// Grid position mapping - EXACTLY like your result page
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

// Grid Cell Component - EXACTLY like your result page
const RenderCell = ({ number, items = [] }) => {
  return (
    <div 
      className="aspect-square flex items-center justify-center rounded-xl bg-gradient-to-br from-[#0b0f19] to-[#121829] border border-[#d4af37]/30 hover:border-[#ffda73] transition-all duration-300 shadow-inner"
    >
      <div className="flex flex-wrap justify-center items-center gap-1 max-w-full">
        {items.map((item, idx) => {
          const size = items.length > 4 ? 'text-xs' : items.length > 2 ? 'text-sm' : 'text-base';
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
        {items.length === 0 && (
          <span className="text-gray-600 text-lg">-</span>
        )}
      </div>
    </div>
  );
};

export default function HealthCheckerClient() {
  const searchParams = useSearchParams();
  const [healthInfo, setHealthInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gridData, setGridData] = useState(Array(3).fill(null).map(() => Array(3).fill(null).map(() => [])));
  const [personalInfo, setPersonalInfo] = useState({});
  const [gridNumbers, setGridNumbers] = useState([]);

  useEffect(() => {
    // Get all parameters from URL
    const name = searchParams.get('name') || '';
    const dob = searchParams.get('dob') || '';
    const basicNumber = searchParams.get('basicNumber');
    const destinyNumber = searchParams.get('destinyNumber');
    const maha = searchParams.get('maha');
    const antar = searchParams.get('antar');
    const mahaStart = searchParams.get('mahaStart');
    const mahaEnd = searchParams.get('mahaEnd');
    const antarStart = searchParams.get('antarStart');
    const antarEnd = searchParams.get('antarEnd');
    
    // Get grid numbers from URL parameters
    const gridNumbersParam = searchParams.getAll('gridNumbers');
    console.log('Received grid numbers:', gridNumbersParam);

    setPersonalInfo({ 
      name, 
      dob, 
      basicNumber, 
      destinyNumber, 
      maha, 
      antar,
      mahaStart,
      mahaEnd, 
      antarStart,
      antarEnd
    });

    if (gridNumbersParam && gridNumbersParam.length > 0) {
      try {
        const numbers = gridNumbersParam.map(num => parseInt(num)).filter(num => !isNaN(num) && num >= 1 && num <= 9);
        setGridNumbers(numbers);
        
        // Create frequency map for health analysis
        const freqMap = {};
        numbers.forEach(num => {
          freqMap[num] = (freqMap[num] || 0) + 1;
        });

        // Build grid data EXACTLY like result page
        const tempGrid = Array(3).fill(null).map(() => Array(3).fill(null).map(() => []));
        
        Object.entries(freqMap).forEach(([numStr, count]) => {
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
            if (maha && num === parseInt(maha) && !mahaAdded) {
              highlight = 'maha';
              mahaAdded = true;
            } else if (antar && num === parseInt(antar) && !antarAdded) {
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

        // Health analysis
        const infoArray = Object.entries(freqMap).map(([numStr, count]) => {
          const number = parseInt(numStr);
          let severity = 'Mild';
          if (count === 2) severity = 'Moderate';
          else if (count >= 3) severity = 'Severe';

          return {
            number,
            count,
            severity,
            ...healthData[number],
          };
        });

        // Sort by severity
        infoArray.sort((a, b) => {
          const severityOrder = { Severe: 0, Moderate: 1, Mild: 2 };
          return severityOrder[a.severity] - severityOrder[b.severity];
        });

        setHealthInfo(infoArray);
      } catch (error) {
        console.error('Error processing grid:', error);
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
          <p className="text-lg" style={{ color: colors.neutralGray }}>Analyzing your health data...</p>
          <p className="text-sm mt-2" style={{ color: colors.neutralGray }}>Reading numerological patterns</p>
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
      <div className="max-w-7xl mx-auto text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
             style={{ backgroundColor: colors.secondaryBg }}>
          <span className="text-2xl">🧠</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Health Analysis
        </h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.neutralGray }}>
          Based on your numerological chart patterns and recurring numbers
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Personal Info & Grid Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-12">
          {/* Personal Profile */}
          <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-6 border border-[#d4af37]/20 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#ffda73] flex items-center justify-center mr-3 shadow-md">
                <span className="text-lg text-[#0b0f19] font-bold">👤</span>
              </div>
              <h2 className="text-xl font-bold text-white">Personal Profile</h2>
            </div>
            
            <div className="space-y-5">
              <div className="bg-[#0b0f19] rounded-lg p-4 border border-[#d4af37]/10">
                <p className="text-sm text-gray-400 font-medium mb-2">NAME</p>
                <div className="min-h-[2.5rem]">
                  <p className="text-white font-semibold text-lg break-words leading-tight">
                    {personalInfo.name || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="bg-[#0b0f19] rounded-lg p-4 border border-[#d4af37]/10">
                <p className="text-sm text-gray-400 font-medium mb-1">DATE OF BIRTH</p>
                <p className="text-white font-semibold text-lg">{personalInfo.dob || 'Not provided'}</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-[#0b0f19] to-[#121829] rounded-lg p-4 text-center border border-[#d4af37]/20">
                  <p className="text-sm text-gray-400 font-medium mb-2">BASIC</p>
                  <div className="text-2xl font-bold text-[#ffda73]">{personalInfo.basicNumber || '-'}</div>
                </div>
                <div className="bg-gradient-to-br from-[#0b0f19] to-[#121829] rounded-lg p-4 text-center border border-[#d4af37]/20">
                  <p className="text-sm text-gray-400 font-medium mb-2">DESTINY</p>
                  <div className="text-2xl font-bold text-[#ffda73]">{personalInfo.destinyNumber || '-'}</div>
                </div>
                <div className="bg-gradient-to-br from-[#0b0f19] to-[#121829] rounded-lg p-4 text-center border border-[#d4af37]/20">
                  <p className="text-sm text-gray-400 font-medium mb-2">SUPPORTIVE</p>
                  <div className="text-lg font-bold text-white">
                    <span className="text-sm text-gray-500 font-normal">-</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Numerology Grid - EXACT layout like result page */}
          <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-6 border border-[#d4af37]/20 shadow-lg">
            <h2 className="text-xl font-bold mb-6 text-white text-center">Your Numerology Grid</h2>
            <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
              {gridData.map((row, rowIndex) => 
                row.map((cell, colIndex) => (
                  <RenderCell 
                    key={`${rowIndex}-${colIndex}`} 
                    number={null} 
                    items={cell} 
                  />
                ))
              )}
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

          {/* Current Periods with Dates */}
          <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-6 border border-[#d4af37]/20 shadow-lg">
            <h2 className="text-xl font-bold mb-6 text-white text-center">Current Periods</h2>
            <div className="space-y-5">
              {personalInfo.maha && (
                <div className="bg-gradient-to-r from-[#d4af37]/10 to-transparent rounded-xl p-5 border-2 border-[#d4af37] hover:bg-[#d4af37]/15 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-[#d4af37] flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                        <span className="text-lg text-[#0b0f19] font-bold">M</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">Mahadasha</h3>
                      </div>
                    </div>
                    <span className="text-xs text-[#ffda73] font-bold bg-[#d4af37]/20 px-2 py-1 rounded">Current</span>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-white font-semibold text-2xl">
                      <span className="text-3xl text-[#ffda73] font-bold">{personalInfo.maha}</span>
                    </p>
                    {personalInfo.mahaStart && personalInfo.mahaEnd && (
                      <p className="text-gray-300 text-sm font-medium">
                        {personalInfo.mahaStart} to {personalInfo.mahaEnd}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {personalInfo.antar && (
                <div className="bg-gradient-to-r from-green-500/10 to-transparent rounded-xl p-5 border-2 border-green-500 hover:bg-green-500/15 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                        <span className="text-lg text-white font-bold">A</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">Antardasha</h3>
                      </div>
                    </div>
                    <span className="text-xs text-green-300 font-bold bg-green-500/20 px-2 py-1 rounded">Current</span>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-white font-semibold text-2xl">
                      <span className="text-3xl text-green-300 font-bold">{personalInfo.antar}</span>
                    </p>
                    {personalInfo.antarStart && personalInfo.antarEnd && (
                      <p className="text-gray-300 text-sm font-medium">
                        {personalInfo.antarStart} to {personalInfo.antarEnd}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {(!personalInfo.maha && !personalInfo.antar) && (
                <div className="text-center py-8">
                  <p className="text-gray-400">No current periods data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Health Analysis Section */}
        {healthInfo.length === 0 ? (
          <div className="text-center p-12 rounded-2xl max-w-md mx-auto" 
               style={{ backgroundColor: colors.secondaryBg }}>
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                 style={{ backgroundColor: colors.primaryBg }}>
              <span className="text-2xl">🤔</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">No Health Patterns Found</h3>
            <p className="mb-4" style={{ color: colors.neutralGray }}>
              Your numerology grid doesn't show significant recurring health patterns.
            </p>
          </div>
        ) : (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-white">
              📊 Health Pattern Analysis
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {healthInfo.map(({ number, count, severity, issues, analysis }) => {
                const config = severityConfig[severity];
                return (
                  <div
                    key={number}
                    className={`rounded-2xl border-l-4 p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${config.glow}`}
                    style={{ 
                      borderLeftColor: config.border.replace('border-[', '').replace(']', ''),
                      backgroundColor: colors.secondaryBg
                    }}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
                             style={{ 
                               backgroundColor: colors.primaryBg,
                               color: colors.textWhite
                             }}>
                          {number}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white">
                            Number {number}
                          </h2>
                          <p className="text-sm" style={{ color: colors.neutralGray }}>
                            {count} occurrence{count > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${config.badge} flex items-center space-x-1`}
                      >
                        <span>{config.icon}</span>
                        <span>{severity}</span>
                      </span>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-2 flex items-center"
                            style={{ color: colors.accentGold }}>
                          <span className="w-1 h-4 rounded-full mr-2" style={{ backgroundColor: colors.accentGold }}></span>
                          Potential Symptoms
                        </h3>
                        <p className="text-sm leading-relaxed" style={{ color: colors.neutralGray }}>
                          {issues}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-2 flex items-center"
                            style={{ color: colors.accentCyan }}>
                          <span className="w-1 h-4 rounded-full mr-2" style={{ backgroundColor: colors.accentCyan }}></span>
                          Numerological Analysis
                        </h3>
                        <p className="text-sm leading-relaxed italic" style={{ color: colors.neutralGray }}>
                          {analysis}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t" style={{ borderColor: `${colors.primaryBg}66` }}>
                      <div className="flex justify-between items-center text-xs">
                        <span style={{ color: colors.neutralGray }}>Health Priority</span>
                        <span className={`font-semibold ${config.text}`}>
                          {severity === 'Severe' ? 'High Attention Needed' : 
                           severity === 'Moderate' ? 'Monitor Regularly' : 'General Awareness'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Health Tips Section */}
        {healthInfo.length > 0 && (
          <div className="p-8 rounded-2xl mb-8" style={{ backgroundColor: colors.secondaryBg }}>
            <h2 className="text-2xl font-bold text-center mb-6 text-white">
              🌟 Health Maintenance Tips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                     style={{ backgroundColor: colors.primaryBg, color: colors.accentGold }}>
                  💧
                </div>
                <h3 className="font-semibold mb-2 text-white">Stay Hydrated</h3>
                <p className="text-sm" style={{ color: colors.neutralGray }}>
                  Drink plenty of water to flush toxins and maintain energy levels
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                     style={{ backgroundColor: colors.primaryBg, color: colors.accentGold }}>
                  🧘
                </div>
                <h3 className="font-semibold mb-2 text-white">Manage Stress</h3>
                <p className="text-sm" style={{ color: colors.neutralGray }}>
                  Practice meditation and breathing exercises for mental balance
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                     style={{ backgroundColor: colors.primaryBg, color: colors.accentGold }}>
                  🏃
                </div>
                <h3 className="font-semibold mb-2 text-white">Regular Exercise</h3>
                <p className="text-sm" style={{ color: colors.neutralGray }}>
                  Maintain physical activity to boost immunity and circulation
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="text-center">
          <p className="text-xs" style={{ color: `${colors.neutralGray}99` }}>
            Note: This analysis is based on numerological patterns and should be used for guidance purposes only. 
            Always consult healthcare professionals for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}