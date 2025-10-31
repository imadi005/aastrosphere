// app/real-estate/page.jsx
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

// Comprehensive Real Estate Numerology Insights
const realEstateInsights = {
  1: {
    title: "Number 1 — Leadership & New Beginnings",
    icon: "👑",
    significance: "Sun-ruled number representing authority, new ventures, and independent properties",
    propertyTypes: ["Independent Houses", "Luxury Apartments", "Corner Plots", "North-East Facing"],
    favorablePeriods: "Mahadasha 1, 3, 9 | Antardasha 1, 8",
    getPrediction: (count, hasDestiny1, currentDasha) => {
      if (count === 0) {
        return "Number 1 absent - consider partnerships for property investments. Focus on joint ownership rather than solo ventures.";
      } else if (count === 1) {
        return "Single 1 suggests steady property growth. Good for first-time home buyers and long-term investments.";
      } else {
        const destinyBonus = hasDestiny1 ? " Combined with Destiny 1, expect exceptional property appreciation." : "";
        return `Multiple 1s (${count}) indicate strong property leadership. Perfect for real estate development and luxury properties.${destinyBonus}`;
      }
    },
    remedies: "Worship Sun god, wear ruby gemstone, face East during property dealings",
    investmentAdvice: "Best for residential properties, avoid commercial complexes"
  },
  8: {
    title: "Number 8 — Wealth & Transformation",
    icon: "💎",
    significance: "Saturn-ruled number representing inheritance, sudden gains, and bulk properties",
    propertyTypes: ["Agricultural Land", "Industrial Properties", "Inherited Properties", "South-Facing"],
    favorablePeriods: "Mahadasha 8, 1, 4 | Antardasha 8, 5",
    getPrediction: (count, hasDestiny8, currentDasha) => {
      if (count === 0) {
        return "8 absent - focus on earned wealth rather than inherited properties. Systematic investments work better.";
      } else if (count === 1) {
        return "Single 8 brings steady property wealth. Good for long-term land investments and rental properties.";
      } else {
        const dashaBonus = currentDasha === 8 ? " Current Mahadasha 8 amplifies property gains significantly." : "";
        return `Multiple 8s (${count}) indicate massive property wealth. Expect inheritance, joint ventures, or sudden property opportunities.${dashaBonus}`;
      }
    },
    remedies: "Worship Shani Dev, wear blue sapphire, donate black sesame on Saturdays",
    investmentAdvice: "Excellent for land banking, commercial properties, and long-term holdings"
  },
  3: {
    title: "Number 3 — Expansion & Creativity",
    icon: "🎨",
    significance: "Jupiter-ruled number representing growth, family properties, and expansion",
    propertyTypes: ["Family Homes", "Villas", "Garden Properties", "East-Facing"],
    favorablePeriods: "Mahadasha 3, 6, 9 | Antardasha 3, 1",
    getPrediction: (count) => {
      if (count === 0) return "3 absent - focus on practical investments rather than emotional property choices.";
      return `Number 3 present (${count}x) - excellent for family homes, vacation properties, and properties with emotional value.`;
    },
    remedies: "Worship Guru Brihaspati, wear yellow sapphire, chant Guru Mantras",
    investmentAdvice: "Ideal for family residences, holiday homes, and properties with gardens"
  },
  4: {
    title: "Number 4 — Stability & Foundation",
    icon: "🏛️",
    significance: "Rahu-ruled number representing stability, ancestral properties, and fixed assets",
    propertyTypes: ["Ancestral Properties", "Commercial Buildings", "Corner Properties", "South-West Facing"],
    favorablePeriods: "Mahadasha 4, 8, 6 | Antardasha 4, 7",
    getPrediction: (count) => {
      if (count === 0) return "4 absent - avoid long-term property commitments. Focus on liquid investments.";
      return `Number 4 present (${count}x) - strong foundation energy. Excellent for ancestral properties, commercial real estate, and long-term holdings.`;
    },
    remedies: "Worship Rahu, wear gomedh stone, chant Rahu Mantras",
    investmentAdvice: "Best for commercial properties, office spaces, and rental buildings"
  },
  6: {
    title: "Number 6 — Luxury & Comfort",
    icon: "🏠",
    significance: "Venus-ruled number representing luxury, comfort, and beautiful properties",
    propertyTypes: ["Luxury Apartments", "Penthouse", "Water-facing Properties", "South-East Facing"],
    favorablePeriods: "Mahadasha 6, 2, 7 | Antardasha 6, 9",
    getPrediction: (count) => {
      if (count === 0) return "6 absent - focus on functional properties rather than luxury investments.";
      return `Number 6 present (${count}x) - excellent for luxury properties, beautiful homes, and properties that bring comfort and happiness.`;
    },
    remedies: "Worship Goddess Lakshmi, wear diamond, maintain cleanliness in property",
    investmentAdvice: "Perfect for luxury residences, beautiful homes, and comfort-oriented properties"
  },
  9: {
    title: "Number 9 — Completion & Foreign",
    icon: "🌍",
    significance: "Mars-ruled number representing completion, foreign properties, and quick gains",
    propertyTypes: ["Foreign Properties", "Quick-flip Properties", "Red-colored Buildings", "South-Facing"],
    favorablePeriods: "Mahadasha 9, 3, 5 | Antardasha 9, 1",
    getPrediction: (count) => {
      if (count === 0) return "9 absent - avoid quick property flips. Focus on long-term stable investments.";
      return `Number 9 present (${count}x) - excellent for quick gains, foreign properties, and properties that complete your portfolio.`;
    },
    remedies: "Worship Hanuman, wear red coral, chant Hanuman Chalisa",
    investmentAdvice: "Good for short-term investments, foreign properties, and completion projects"
  }
};

// Property Investment Strategies based on combinations
const propertyStrategies = {
  "1-8": {
    title: "Leadership + Wealth Combination",
    description: "Perfect for real estate development and luxury projects",
    recommendation: "Invest in premium residential projects and commercial complexes"
  },
  "3-6": {
    title: "Expansion + Luxury Combination", 
    description: "Ideal for family luxury homes and vacation properties",
    recommendation: "Focus on villas and properties with emotional value"
  },
  "4-8": {
    title: "Stability + Wealth Combination",
    description: "Excellent for long-term commercial investments",
    recommendation: "Invest in rental properties and commercial buildings"
  },
  "1-4": {
    title: "Leadership + Stability Combination",
    description: "Great for entrepreneurial real estate ventures",
    recommendation: "Consider property development and construction business"
  }
};

export default function RealEstatePredictionPage() {
  const searchParams = useSearchParams();
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
        
        // Count occurrences of each number
        const counts = {};
        numbers.forEach(num => {
          if (realEstateInsights[num]) {
            counts[num] = (counts[num] || 0) + 1;
          }
        });

        // Generate predictions
        const predictions = Object.entries(counts).map(([numStr, count]) => {
          const number = parseInt(numStr);
          const data = realEstateInsights[number];
          const hasDestiny = destinyNumber && parseInt(destinyNumber) === number;
          
          return {
            number,
            count,
            title: data.title,
            icon: data.icon,
            significance: data.significance,
            propertyTypes: data.propertyTypes,
            favorablePeriods: data.favorablePeriods,
            prediction: data.getPrediction(count, hasDestiny, currentMaha),
            remedies: data.remedies,
            investmentAdvice: data.investmentAdvice,
            highlight: data.highlight,
            hasDestiny: hasDestiny
          };
        });

        // Find important combinations
        const numberKeys = Object.keys(counts);
        const combinations = [];
        Object.entries(propertyStrategies).forEach(([combo, strategy]) => {
          const [num1, num2] = combo.split('-').map(Number);
          if (numberKeys.includes(num1.toString()) && numberKeys.includes(num2.toString())) {
            combinations.push(strategy);
          }
        });

        // Overall assessment
        const hasStrongRealEstateNumbers = counts[1] >= 2 || counts[8] >= 2 || counts[4] >= 2;
        const overallPotential = hasStrongRealEstateNumbers ? "High" : 
                                Object.keys(counts).length >= 2 ? "Medium" : "Low";

        setAnalysis({
          name,
          dob,
          predictions,
          combinations,
          overallPotential,
          currentMaha,
          currentAntar,
          destinyNumber,
          totalRelevantNumbers: Object.keys(counts).length
        });

      } catch (error) {
        console.error('Error analyzing real estate potential:', error);
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
          <p className="text-lg" style={{ color: colors.neutralGray }}>Analyzing your property potential...</p>
          <p className="text-sm mt-2" style={{ color: colors.neutralGray }}>Reading real estate energies</p>
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
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
             style={{ backgroundColor: colors.secondaryBg }}>
          <span className="text-3xl">🏠</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Real Estate Numerology
        </h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.neutralGray }}>
          Vedic insights for property investment, timing, and wealth through real estate
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        {analysis ? (
          <div className="space-y-8">
            {/* Personal Info & Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-6 border border-[#d4af37]/20 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#ffda73] flex items-center justify-center mr-3 shadow-md">
                    <span className="text-lg text-[#0b0f19] font-bold">👤</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">Profile</h2>
                </div>
                <p className="text-white font-semibold mb-2">{analysis.name}</p>
                <p className="text-gray-400 text-sm">{analysis.dob}</p>
              </div>

              <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-6 border border-[#d4af37]/20 shadow-lg text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                     style={{ backgroundColor: colors.primaryBg }}>
                  <span className="text-xl">📈</span>
                </div>
                <h3 className="text-sm text-gray-400 font-medium mb-2">PROPERTY POTENTIAL</h3>
                <p className={`text-2xl font-bold ${
                  analysis.overallPotential === 'High' ? 'text-green-400' :
                  analysis.overallPotential === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {analysis.overallPotential}
                </p>
                <p className="text-xs text-gray-500 mt-1">{analysis.totalRelevantNumbers} relevant numbers</p>
              </div>

              <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-6 border border-[#d4af37]/20 shadow-lg text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                     style={{ backgroundColor: colors.primaryBg }}>
                  <span className="text-xl">⏰</span>
                </div>
                <h3 className="text-sm text-gray-400 font-medium mb-2">CURRENT PERIOD</h3>
                <p className="text-white font-semibold text-lg">
                  M: {analysis.currentMaha || '-'} • A: {analysis.currentAntar || '-'}
                </p>
                <p className="text-xs text-gray-500 mt-1">Mahadasha • Antardasha</p>
              </div>
            </div>

            {/* Number-wise Analysis */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-center mb-8 text-white">
                🔮 Number Analysis & Predictions
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {analysis.predictions.map((pred, index) => (
                  <div
                    key={index}
                    className={`rounded-2xl p-6 border-l-4 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                      pred.highlight 
                        ? 'bg-gradient-to-r from-yellow-900/20 to-amber-800/10 border-l-yellow-500' 
                        : 'bg-gradient-to-br from-[#121829] to-[#0b0f19] border-l-[#d4af37]'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
                             style={{ 
                               backgroundColor: colors.primaryBg,
                               color: colors.textWhite
                             }}>
                          {pred.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            {pred.title}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="bg-[#d4af37] text-[#0b0f19] px-2 py-1 rounded text-xs font-bold">
                              {pred.count}x
                            </span>
                            {pred.hasDestiny && (
                              <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                                Destiny
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider mb-2 flex items-center"
                            style={{ color: colors.accentGold }}>
                          <span className="w-1 h-4 rounded-full mr-2" style={{ backgroundColor: colors.accentGold }}></span>
                          Prediction
                        </h4>
                        <p className="text-sm leading-relaxed" style={{ color: colors.neutralGray }}>
                          {pred.prediction}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider mb-2 flex items-center"
                            style={{ color: colors.accentCyan }}>
                          <span className="w-1 h-4 rounded-full mr-2" style={{ backgroundColor: colors.accentCyan }}></span>
                          Property Types
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {pred.propertyTypes.map((type, idx) => (
                            <span 
                              key={idx}
                              className="bg-black/30 text-white px-2 py-1 rounded text-xs font-semibold"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 text-xs">
                        <div>
                          <span className="font-semibold text-gray-400">Favorable Periods:</span>
                          <p className="text-gray-300">{pred.favorablePeriods}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-400">Remedies:</span>
                          <p className="text-gray-300">{pred.remedies}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Combinations */}
            {analysis.combinations.length > 0 && (
              <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-8 border border-[#d4af37]/20 shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6 text-white">
                  💫 Powerful Number Combinations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {analysis.combinations.map((combo, index) => (
                    <div key={index} className="bg-[#0b0f19] rounded-xl p-6 border border-[#d4af37]/10">
                      <h3 className="text-lg font-bold text-[#ffda73] mb-2">{combo.title}</h3>
                      <p className="text-gray-300 mb-3">{combo.description}</p>
                      <p className="text-sm text-gray-400"><strong>Recommendation:</strong> {combo.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Overall Recommendations */}
            <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-8 border border-[#d4af37]/20 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-white">
                🎯 Investment Strategy & Timing
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                       style={{ backgroundColor: colors.primaryBg, color: colors.accentGold }}>
                    📅
                  </div>
                  <h3 className="font-semibold mb-2 text-white">Best Timing</h3>
                  <p className="text-sm" style={{ color: colors.neutralGray }}>
                    Focus on property deals during favorable Mahadasha and Antardasha periods
                  </p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                       style={{ backgroundColor: colors.primaryBg, color: colors.accentGold }}>
                    🏘️
                  </div>
                  <h3 className="font-semibold mb-2 text-white">Property Focus</h3>
                  <p className="text-sm" style={{ color: colors.neutralGray }}>
                    Invest in property types aligned with your dominant numbers
                  </p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                       style={{ backgroundColor: colors.primaryBg, color: colors.accentGold }}>
                    ⚠️
                  </div>
                  <h3 className="font-semibold mb-2 text-white">Precautions</h3>
                  <p className="text-sm" style={{ color: colors.neutralGray }}>
                    Follow numerological remedies and avoid conflicting directions
                  </p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                       style={{ backgroundColor: colors.primaryBg, color: colors.accentGold }}>
                    📊
                  </div>
                  <h3 className="font-semibold mb-2 text-white">Strategy</h3>
                  <p className="text-sm" style={{ color: colors.neutralGray }}>
                    Leverage your number combinations for maximum property gains
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-12 rounded-2xl max-w-md mx-auto" 
               style={{ backgroundColor: colors.secondaryBg }}>
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                 style={{ backgroundColor: colors.primaryBg }}>
              <span className="text-2xl">🤔</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">No Real Estate Data</h3>
            <p className="mb-4" style={{ color: colors.neutralGray }}>
              Please generate your numerology chart first from the main calculator.
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 text-center">
          <p className="text-xs" style={{ color: `${colors.neutralGray}99` }}>
            Note: Real estate numerology insights are based on Vedic principles and should be used as guidance only. 
            Always conduct proper due diligence and consult financial advisors before making property investments.
          </p>
        </div>
      </div>
    </div>
  );
}