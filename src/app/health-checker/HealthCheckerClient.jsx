'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Data object (No changes)
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

// UI IMPROVEMENT: Color mapping object for cleaner code
const severityConfig = {
  Severe: {
    border: 'border-red-500',
    bg: 'bg-red-900/30',
    text: 'text-red-300',
    badge: 'bg-red-500 text-white',
  },
  Moderate: {
    border: 'border-yellow-500',
    bg: 'bg-yellow-900/30',
    text: 'text-yellow-300',
    badge: 'bg-yellow-500 text-black',
  },
  Mild: {
    border: 'border-green-500',
    bg: 'bg-green-900/30',
    text: 'text-green-300',
    badge: 'bg-green-500 text-black',
  },
};

export default function HealthCheckerClient() {
  const searchParams = useSearchParams();
  const grid = searchParams.get('grid');
  const [healthInfo, setHealthInfo] = useState([]);

  useEffect(() => {
    if (grid) {
      const numbers = grid.split(',').map(Number);
      const countMap = {};

      numbers.forEach((num) => {
        if (healthData[num]) {
          countMap[num] = (countMap[num] || 0) + 1;
        }
      });

      const infoArray = Object.entries(countMap).map(([numStr, count]) => {
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

      setHealthInfo(infoArray);
    }
  }, [grid]);

  return (
    // RESPONSIVENESS FIX: 
    // `min-h-screen` (flexible height) instead of `h-screen`
    // `w-full` (flexible width) instead of `w-screen`
    // Added responsive padding: `px-4 sm:px-6 lg:px-8`
    // Added `pt-24` (for main header) and `pb-12` (for bottom spacing)
    <div className="min-h-screen w-full overflow-x-hidden bg-black text-white px-4 sm:px-6 lg:px-8 pt-24 pb-12 flex flex-col items-center">
      
      {/* RESPONSIVENESS FIX: Responsive font size */}
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
        🧠 Health Status Based on Numerology
      </h1>

      {healthInfo.length === 0 ? (
        // UI IMPROVEMENT: Better empty state
        <div className="text-center p-10 bg-gray-900/50 rounded-lg max-w-md w-full">
          <p className="text-2xl mb-2">🤔</p>
          <p className="text-lg text-gray-300">No Health Data Found</p>
          <p className="text-sm text-gray-500">
            The numerology grid might be empty or invalid.
          </p>
        </div>
      ) : (
        // UI IMPROVEMENT: Changed max-w-4xl to 3xl for better readability
        <div className="w-full max-w-3xl mx-auto space-y-6">
          {healthInfo.map(({ number, count, severity, issues, analysis }) => {
            const colors = severityConfig[severity];
            return (
              <div
                key={number}
                className={`rounded-lg shadow-2xl border-l-8 p-6 ${colors.border} ${colors.bg} transition-all duration-300 hover:shadow-purple-900/50`}
              >
                {/* UI IMPROVEMENT: Better header with number and severity badge */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-0">
                    Number {number}
                  </h2>
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${colors.badge} w-fit`}
                  >
                    {severity} Issue
                  </span>
                </div>

                {/* UI IMPROVEMENT: Clearer labels for Symptoms and Analysis */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Symptoms
                    </h3>
                    <p className="text-gray-200">{issues}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Analysis
                    </h3>
                    <p className="text-gray-300 italic opacity-90">
                      {analysis}
                    </p>
                  </div>
                </div>

                {/* UI IMPROVEMENT: Moved count to the bottom as metadata */}
                <p className="text-xs text-gray-500 mt-4 text-right">
                  Occurrences in chart: {count}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}