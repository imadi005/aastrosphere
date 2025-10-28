'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

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

export default function HealthCheckerPage() {
  const searchParams = useSearchParams();
  const grid = searchParams.get('grid'); // Example: "1,1,2,3,4,4,4,5,5,6"

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
          ...healthData[number]
        };
      });

      setHealthInfo(infoArray);
    }
  }, [grid]);

  return (
    <div className="h-screen w-screen overflow-auto bg-black text-white px-4 py-10 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6 text-center">🧠 Health Status Based on Numerology</h1>

      {healthInfo.length === 0 ? (
        <p className="text-center text-lg">No valid numbers found in chart.</p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          {healthInfo.map(({ number, count, severity, issues, analysis }) => (
            <div
              key={number}
              className={`p-6 rounded-lg shadow-md border-l-8 ${
                severity === 'Severe'
                  ? 'border-red-600 bg-red-900/20'
                  : severity === 'Moderate'
                  ? 'border-yellow-500 bg-yellow-900/20'
                  : 'border-green-500 bg-green-900/20'
              }`}
            >
              <h2 className="text-xl font-bold mb-2">
                Number {number} — <span className="capitalize">{severity} Issue</span>
              </h2>
              <p className="text-sm text-gray-300 mb-1">Occurrences in chart: {count}</p>
              <p className="text-white mb-1">
                <b>Symptoms:</b> {issues}
              </p>
              <p className="text-white text-sm italic opacity-90">
                <b>Analysis:</b> {analysis}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
