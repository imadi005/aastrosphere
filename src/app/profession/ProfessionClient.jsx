'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const professionMap = {
  1: {
    title: "Leadership & Entrepreneurship",
    careers: ['CEO & Executive Roles', 'Startup Founder', 'Government Administration', 'Public Speaking', 'Project Management'],
    traits: ['Natural leader', 'Self-motivated', 'Innovative thinker', 'Strong decision-maker'],
    industries: ['Corporate Leadership', 'Politics', 'Consulting', 'Real Estate Development'],
    successTips: ['Take initiative', 'Trust your instincts', 'Build strong networks', 'Embrace challenges']
  },
  2: {
    title: "Creative & Healing Arts",
    careers: ['Art Director', 'Creative Writer', 'Makeup Artist & Stylist', 'Cinematographer', 'Emotional Healing Therapist'],
    traits: ['Highly intuitive', 'Artistic sensibility', 'Emotionally intelligent', 'Diplomatic'],
    industries: ['Entertainment', 'Fashion', 'Wellness', 'Hospitality'],
    successTips: ['Follow your intuition', 'Collaborate with others', 'Express emotions creatively', 'Create harmonious environments']
  },
  3: {
    title: "Education & Communication",
    careers: ['Teacher & Professor', 'Therapist & Counselor', 'Spiritual Guide', 'Astrologer', 'Human Resources'],
    traits: ['Excellent communicator', 'Wise counselor', 'Optimistic', 'Knowledge seeker'],
    industries: ['Education', 'Publishing', 'Media', 'Spiritual Services'],
    successTips: ['Share your knowledge', 'Stay curious', 'Build communities', 'Practice patience']
  },
  4: {
    title: "Technology & Innovation",
    careers: ['Software Developer', 'Data Scientist', 'Cybersecurity Expert', 'Research Scientist', 'Systems Analyst'],
    traits: ['Analytical thinker', 'Problem solver', 'Detail-oriented', 'Innovative'],
    industries: ['IT & Technology', 'Research & Development', 'Engineering', 'Digital Security'],
    successTips: ['Embrace change', 'Continuous learning', 'Build strong foundations', 'Think outside the box']
  },
  5: {
    title: "Finance & Communication",
    careers: ['Financial Analyst', 'Investment Banker', 'Stock Trader', 'Tax Consultant', 'Media Professional'],
    traits: ['Quick thinker', 'Adaptable', 'Excellent communicator', 'Risk-taker'],
    industries: ['Banking & Finance', 'Media & Journalism', 'Sales & Marketing', 'International Business'],
    successTips: ['Stay informed', 'Be versatile', 'Network actively', 'Manage risks wisely']
  },
  6: {
    title: "Beauty & Wellness",
    careers: ['Restaurant Owner', 'Beauty & Wellness Expert', 'Interior Designer', 'Luxury Brand Manager', 'Hospitality Director'],
    traits: ['Artistic', 'Service-oriented', 'Harmony seeker', 'Quality conscious'],
    industries: ['Food & Beverage', 'Beauty & Cosmetics', 'Luxury Goods', 'Hospitality'],
    successTips: ['Focus on quality', 'Create beauty', 'Serve with love', 'Build lasting relationships']
  },
  7: {
    title: "Research & Mystical Sciences",
    careers: ['Research Scientist', 'Forensic Expert', 'Intelligence Officer', 'Occult Researcher', 'Healing Practitioner'],
    traits: ['Deep thinker', 'Intuitive', 'Analytical', 'Spiritually inclined'],
    industries: ['Research & Academia', 'Investigative Services', 'Spiritual Healing', 'Mystical Arts'],
    successTips: ['Trust your intuition', 'Go deep into research', 'Maintain secrecy', 'Balance logic with faith']
  },
  8: {
    title: "Engineering & Management",
    careers: ['Engineer', 'Surgeon', 'Operations Manager', 'Construction Director', 'NGO Leader'],
    traits: ['Disciplined', 'Practical', 'Hardworking', 'Results-oriented'],
    industries: ['Engineering', 'Healthcare', 'Construction', 'Social Services'],
    successTips: ['Be patient', 'Focus on long-term goals', 'Maintain integrity', 'Build systematically']
  },
  9: {
    title: "Law & Leadership",
    careers: ['Police Officer', 'Lawyer & Advocate', 'Political Leader', 'Military Officer', 'Crisis Manager'],
    traits: ['Courageous', 'Passionate', 'Protective', 'Action-oriented'],
    industries: ['Law Enforcement', 'Legal Services', 'Politics', 'Defense'],
    successTips: ['Fight for justice', 'Lead with compassion', 'Take bold actions', 'Protect the vulnerable']
  }
};

const cautionProfessions = {
  '4,6': {
    title: 'Business Partnerships & Legal Arbitrations',
    reason: 'Conflict between analytical thinking (4) and emotional harmony (6) leads to unstable collaborations and frequent disputes.',
    solution: 'Focus on solo ventures or structured partnerships with clear boundaries.'
  },
  '1,2,4': {
    title: 'Joint Leadership & Founding Partnerships',
    reason: 'Mix of dominance (1), emotion (2), and logic (4) creates indecisive leadership and conflicting decisions.',
    solution: 'Take clear leadership roles rather than shared authority positions.'
  },
  '9,5,5': {
    title: 'Politics & Aggressive Law Enforcement',
    reason: 'Strong Mars (9) and Mercury (5) energy leads to aggression and communication conflicts.',
    solution: 'Channel energy into constructive leadership rather than confrontational roles.'
  },
  '1,1': {
    title: 'Military Command & Crisis Management',
    reason: 'Excess leadership energy causes ego clashes and impulsive decision-making.',
    solution: 'Develop team collaboration skills and practice humility in leadership.'
  }
};

const jobChangeFavDasha = [3, 4, 7, 8];

const dashaMeanings = {
  3: { meaning: 'Expansion & Growth', advice: 'Excellent time for career growth and new opportunities' },
  4: { meaning: 'Transformation & Change', advice: 'Ideal for career shifts and innovative ventures' },
  7: { meaning: 'Research & Depth', advice: 'Perfect for specialization and in-depth learning' },
  8: { meaning: 'Discipline & Structure', advice: 'Good for building foundations and long-term planning' }
};

function ProfessionPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || 'User';
  const dob = searchParams.get('dob') || '0000-00-00';

  const [destinyNumber, setDestinyNumber] = useState(null);
  const [basicNumber, setBasicNumber] = useState(null);
  const [mahadasha, setMahadasha] = useState(null);
  const [gridValues, setGridValues] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [avoidProfessions, setAvoidProfessions] = useState([]);
  const [yogaInsights, setYogaInsights] = useState([]);
  const [activeTab, setActiveTab] = useState('careers');

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

    setRecommendations(professionMap[destiny] || null);

    const avoidList = [];
    const detailedReasons = [];

    Object.entries(cautionProfessions).forEach(([combo, data]) => {
      const nums = combo.split(',').map(Number);
      const found = nums.every(n => {
        const requiredCount = nums.filter(x => x === n).length;
        const availableCount = grid.filter(x => x === n).length;
        return availableCount >= requiredCount;
      });
      if (found) {
        avoidList.push(data.title);
        detailedReasons.push(data);
      }
    });

    setAvoidProfessions([...new Set(avoidList)]);
    setYogaInsights(detailedReasons);
  }, [dob]);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white px-4 py-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-[#ffda73] tracking-tight">
          💼 Career Guidance
        </h1>
        <div className="h-1 w-40 bg-gradient-to-r from-[#d4af37] to-[#ffda73] mx-auto rounded-full mb-6"></div>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Discover your ideal career path based on your numerology and cosmic blueprint
        </p>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Personal Profile Card */}
        <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-6 border border-[#d4af37]/20 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0b0f19] rounded-xl p-4 border border-[#d4af37]/10">
              <p className="text-sm text-gray-400 font-medium mb-1">NAME</p>
              <p className="text-white font-semibold text-lg">{name}</p>
            </div>
            <div className="bg-[#0b0f19] rounded-xl p-4 border border-[#d4af37]/10">
              <p className="text-sm text-gray-400 font-medium mb-1">DATE OF BIRTH</p>
              <p className="text-white font-semibold text-lg">{dob}</p>
            </div>
            <div className="bg-[#0b0f19] rounded-xl p-4 border border-[#d4af37]/10">
              <p className="text-sm text-gray-400 font-medium mb-1">DESTINY NUMBER</p>
              <p className="text-2xl font-bold text-[#ffda73]">{destinyNumber}</p>
            </div>
          </div>
        </div>

        {/* Current Mahadasha Status */}
        <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-6 border border-[#d4af37]/20 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Current Career Period</h2>
            <div className={`px-4 py-2 rounded-full font-bold text-sm ${
              jobChangeFavDasha.includes(mahadasha) 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {jobChangeFavDasha.includes(mahadasha) ? '🟢 Favorable for Changes' : '🔴 Stable Period'}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0b0f19] rounded-xl p-4 text-center border border-[#d4af37]/10">
              <p className="text-gray-400 text-sm mb-2">Current Mahadasha</p>
              <p className="text-3xl font-bold text-[#ffda73]">{mahadasha}</p>
            </div>
            <div className="bg-[#0b0f19] rounded-xl p-4 text-center border border-[#d4af37]/10">
              <p className="text-gray-400 text-sm mb-2">Period Meaning</p>
              <p className="text-white font-semibold">{dashaMeanings[mahadasha]?.meaning || 'Building Phase'}</p>
            </div>
            <div className="bg-[#0b0f19] rounded-xl p-4 text-center border border-[#d4af37]/10">
              <p className="text-gray-400 text-sm mb-2">Career Advice</p>
              <p className="text-white font-semibold text-sm">{dashaMeanings[mahadasha]?.advice || 'Focus on steady growth'}</p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-2 border border-[#d4af37]/20 shadow-lg">
          <div className="flex space-x-2">
            {[
              { id: 'careers', label: '🎯 Career Paths', icon: '💼' },
              { id: 'traits', label: '🌟 Your Strengths', icon: '✨' },
              { id: 'cautions', label: '⚠️ Precautions', icon: '🛡️' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#ffda73] text-[#0b0f19] shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'careers' && recommendations && (
            <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-6 border border-[#d4af37]/20 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#ffda73] flex items-center justify-center mr-3 shadow-md">
                  <span className="text-lg text-[#0b0f19] font-bold">🎯</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{recommendations.title}</h2>
                  <p className="text-gray-400">Ideal career paths for Destiny Number {destinyNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recommended Careers */}
                <div className="bg-[#0b0f19] rounded-xl p-5 border border-[#d4af37]/10">
                  <h3 className="text-lg font-semibold text-green-300 mb-4 flex items-center">
                    <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-2 text-white text-sm">💼</span>
                    Top Career Choices
                  </h3>
                  <div className="space-y-3">
                    {recommendations.careers.map((career, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <span className="text-white font-medium">{career}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Industries */}
                <div className="bg-[#0b0f19] rounded-xl p-5 border border-[#d4af37]/10">
                  <h3 className="text-lg font-semibold text-blue-300 mb-4 flex items-center">
                    <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2 text-white text-sm">🏢</span>
                    Suitable Industries
                  </h3>
                  <div className="space-y-3">
                    {recommendations.industries.map((industry, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <span className="text-white font-medium">{industry}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Success Tips */}
              <div className="mt-6 bg-gradient-to-r from-[#d4af37]/10 to-transparent rounded-xl p-5 border-2 border-[#d4af37]">
                <h3 className="text-lg font-semibold text-[#ffda73] mb-3 flex items-center">
                  <span className="w-6 h-6 bg-[#ffda73] rounded-full flex items-center justify-center mr-2 text-[#0b0f19] text-sm">🚀</span>
                  Success Strategies
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {recommendations.successTips.map((tip, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2">
                      <span className="text-[#ffda73] text-lg">•</span>
                      <span className="text-white">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'traits' && recommendations && (
            <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-6 border border-[#d4af37]/20 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#ffda73] flex items-center justify-center mr-3 shadow-md">
                  <span className="text-lg text-[#0b0f19] font-bold">🌟</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Your Professional Strengths</h2>
                  <p className="text-gray-400">Natural talents and personality traits for career success</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Key Traits */}
                <div className="bg-[#0b0f19] rounded-xl p-5 border border-[#d4af37]/10">
                  <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center">
                    <span className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-2 text-white text-sm">💫</span>
                    Key Personality Traits
                  </h3>
                  <div className="space-y-3">
                    {recommendations.traits.map((trait, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">
                          ✓
                        </div>
                        <span className="text-white font-medium">{trait}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Career Advantages */}
                <div className="bg-[#0b0f19] rounded-xl p-5 border border-[#d4af37]/10">
                  <h3 className="text-lg font-semibold text-cyan-300 mb-4 flex items-center">
                    <span className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center mr-2 text-white text-sm">⚡</span>
                    Career Advantages
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                      <p className="text-white font-medium">Natural alignment with {recommendations.title.toLowerCase()} fields</p>
                    </div>
                    <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                      <p className="text-white font-medium">Strong cosmic support for chosen career path</p>
                    </div>
                    <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                      <p className="text-white font-medium">Inherent skills that match professional requirements</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cautions' && (
            <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-6 border border-[#d4af37]/20 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#ffda73] flex items-center justify-center mr-3 shadow-md">
                  <span className="text-lg text-[#0b0f19] font-bold">⚠️</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Career Precautions</h2>
                  <p className="text-gray-400">Areas requiring attention and careful planning</p>
                </div>
              </div>

              {yogaInsights.length > 0 ? (
                <div className="space-y-4">
                  {yogaInsights.map((insight, index) => (
                    <div key={index} className="bg-red-500/10 rounded-xl p-5 border-2 border-red-500/30">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          ⚠️
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-red-300 mb-2">{insight.title}</h3>
                          <p className="text-gray-300 mb-3">{insight.reason}</p>
                          <div className="bg-red-500/20 rounded-lg p-3 border border-red-500/30">
                            <p className="text-red-200 text-sm">
                              <span className="font-semibold">Solution:</span> {insight.solution}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-green-500/10 rounded-xl p-8 text-center border-2 border-green-500/30">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                    ✅
                  </div>
                  <h3 className="text-xl font-semibold text-green-300 mb-2">No Major Career Conflicts Detected</h3>
                  <p className="text-gray-300">
                    Your numerology chart shows good alignment with your career path. Continue focusing on your strengths and natural talents.
                  </p>
                </div>
              )}

              {/* General Career Advice */}
              <div className="mt-6 bg-gradient-to-r from-[#d4af37]/10 to-transparent rounded-xl p-5 border-2 border-[#d4af37]">
                <h3 className="text-lg font-semibold text-[#ffda73] mb-3 flex items-center">
                  <span className="w-6 h-6 bg-[#ffda73] rounded-full flex items-center justify-center mr-2 text-[#0b0f19] text-sm">💡</span>
                  General Career Wisdom
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <p className="text-gray-300">• Always align your work with your core values</p>
                  <p className="text-gray-300">• Continuous learning ensures career growth</p>
                  <p className="text-gray-300">• Build genuine professional relationships</p>
                  <p className="text-gray-300">• Balance ambition with personal well-being</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Final Summary */}
        <div className="bg-gradient-to-br from-[#121829] to-[#0b0f19] rounded-2xl p-6 border border-[#d4af37]/20 shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-[#ffda73]">Career Summary for {name}</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#0b0f19] rounded-xl p-5 border border-[#d4af37]/10">
              <h3 className="text-lg font-semibold text-green-300 mb-3">✅ Your Path</h3>
              <p className="text-gray-300">
                With Destiny Number <span className="text-[#ffda73] font-bold">{destinyNumber}</span>, you are naturally inclined towards{' '}
                <span className="text-green-400 font-semibold">{recommendations?.title.toLowerCase()}</span>. 
                Your inherent strengths in {recommendations?.traits.slice(0, 2).join(' and ').toLowerCase()} make you well-suited for these professional domains.
              </p>
            </div>

            <div className="bg-[#0b0f19] rounded-xl p-5 border border-[#d4af37]/10">
              <h3 className="text-lg font-semibold text-blue-300 mb-3">📅 Current Phase</h3>
              <p className="text-gray-300">
                Your current Mahadasha <span className="text-[#ffda73] font-bold">{mahadasha}</span> indicates{' '}
                <span className={jobChangeFavDasha.includes(mahadasha) ? 'text-green-400' : 'text-blue-400'}>
                  {jobChangeFavDasha.includes(mahadasha) ? 'an excellent time for career transitions and new opportunities' : 'a period better suited for consolidation and steady growth'}
                </span>.
              </p>
            </div>
          </div>

          {yogaInsights.length > 0 && (
            <div className="mt-4 bg-red-500/10 rounded-xl p-4 border border-red-500/30">
              <p className="text-red-200 text-center">
                <span className="font-semibold">Note:</span> Pay special attention to the career precautions mentioned above to ensure smooth professional growth.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfessionPage;