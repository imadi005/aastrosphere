'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const lovePersonalityInsights = {
  2: {
    title: 'Emotional & Nurturing',
    text: 'The number 2 represents emotions, and the moon is known for its nurturing qualities. When the Dasha of 2 comes into play ,it can signify a time when individuals may be emotionally receptive and open to forming deeper connections. This can be an ideal period for developing relationships that may lead to marriage.',
  },
  3: {
    title: 'Wise & Open to Growth',
    text: 'Jupiter, represented by the number 3, is associated with wisdom, expansion, and growth. During the Dasha of 3, individuals may seek to gain knowledge, learn, and grow. In a relationship context, this Dasha can indicate a period where individuals may be more open to understanding their partners and making informed decisions about marriage.',
  },
  6: {
    title: 'Romantic & Relationship-Oriented',
    text: 'The number 6 is closely associated with love, relationships, and marriage. When the Dasha of 6 is active, it can indicate a favorable period for getting married. Individuals may feel more inclined towards romantic relationships, and there is a higher likelihood of marriage proposals or unions during this time.',
  },
  9: {
    title: 'Passionate & Assertive',
    text: 'The number 9 is linked to passion and energy. The influence of Mars can lead to increased confidence and assertiveness. During the Dasha of 9, individuals may be more proactive in pursuing relationships and partnerships. This assertiveness can contribute to taking the step towards marriage.',
  },
  'combo_17': {
    title: 'Assertive Romantic Seeker',
    text: 'The combination of 17 suggests that individuals may become more assertive in seeking a partner or expressing their desires in a relationship. This assertiveness can lead to initiating conversations about marriage or proposing to a loved one',
  },
  'combo_62': {
    title: 'Luxury & Sensitivity in Love',
    text: 'This combination blends the qualities of 6 (luxury, romance) and 2 (emotions, sensitivity). When this combination is active, it can signify a period of intense emotional and romantic connection.',
  },
};

export default function LovePersonalityPredictionPage() {
  const searchParams = useSearchParams();
  const grid = searchParams.get('grid'); // example: "1,2,6,7,3,9,6,2"
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    if (grid) {
      const numbers = grid.split(',').map(n => parseInt(n));
      const counts = {};
      numbers.forEach(n => {
        counts[n] = (counts[n] || 0) + 1;
      });

      const foundInsights = [];

      // Individual love-focused numbers
      [2, 3, 6, 9].forEach(num => {
        if (counts[num]) foundInsights.push(lovePersonalityInsights[num]);
      });

      // Combo 17 check
      if (counts[1] && counts[7]) {
        foundInsights.push(lovePersonalityInsights['combo_17']);
      }

      // Combo 62 check
      if (counts[6] && counts[2]) {
        foundInsights.push(lovePersonalityInsights['combo_62']);
      }

      setInsights(foundInsights);
    }
  }, [grid]);

  return (
    <div className="h-screen w-screen overflow-auto bg-black text-white px-4 py-10 flex flex-col items-center">
      <h1 className="text-5xl font-extrabold text-center mb-10 tracking-wide drop-shadow">
        ❤️ Love & Marriage Personality Insights
      </h1>

      {insights.length === 0 ? (
        <p className="text-center text-lg text-gray-700">
          No romantic indicators detected in your numerology chart.
        </p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8">
          {insights.map((insight, idx) => (
            <div
              key={idx}
              className="bg-white/70 backdrop-blur-sm border border-pink-300 rounded-xl shadow-md p-6 transition-all hover:scale-[1.01]"
            >
              <h2 className="text-2xl font-semibold text-pink-700 mb-2">
                {insight.title}
              </h2>
              <p className="text-gray-800 text-lg leading-relaxed">{insight.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Match-Making Button */}
      <div className="mt-10 text-center">
        <button
          onClick={() => (window.location.href = '/match-making')}
          className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-2 px-6 rounded-xl shadow-lg hover:scale-105 transition"
        >
          Match-Maker
        </button>
      </div>
    </div>
  );
}
