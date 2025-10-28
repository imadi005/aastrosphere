'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const realEstateInsights = {
  1: {
    title: "Number 1 — Real Estate Leader",
    highlight: true,
    getPrediction: (count) => {
      if (count === 0) {
        return "Even though 1 is absent, if Dasha of 1 is active, property opportunities still exist.";
      } else if (count === 1) {
        return "Single 1 suggests success in property acquisition and real estate careers.";
      } else {
        return "Multiple 1s mean strong potential, but check if Destiny 1 is also present. Without it, avoid risky investments.";
      }
    }
  },
  8: {
    title: "Number 8 — Property Magnifier",
    highlight: true,
    getPrediction: (count) => {
      if (count === 0) {
        return "Number 8 is missing. Bulk property benefits may be reduced.";
      } else if (count === 1) {
        return "8 in your chart supports property investment, especially during Dasha 8.";
      } else {
        return "88 in grid means golden chances for bulk, gifted, or profitable property purchases.";
      }
    }
  },
  3: {
    title: "Dasha 3 — Expansion",
    highlight: false,
    getPrediction: () => "Brings expansion energy. Good for portfolio growth or new ventures."
  },
  6: {
    title: "Dasha 6 — Time to Own",
    highlight: false,
    getPrediction: () => "Highly favorable for home purchases. Aligns with property ownership goals."
  },
  4: {
    title: "Dasha 4 — Vehicles & Assets",
    highlight: false,
    getPrediction: () => "Supports buying vehicles or structured assets, especially in yearly cycles."
  },
  5: {
    title: "Dasha 5 — Financial Flow",
    highlight: false,
    getPrediction: () => "Cash flow-friendly. If combined with 88 & Dasha 1, expect gifted or luxury properties."
  }
};

export default function RealEstatePredictionPage() {
  const searchParams = useSearchParams();
  const grid = searchParams.get('grid');
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    if (grid) {
      const counts = {};
      grid.split(',').forEach((n) => {
        const num = parseInt(n);
        if (realEstateInsights[num]) {
          counts[num] = (counts[num] || 0) + 1;
        }
      });

      const results = Object.entries(counts).map(([numStr, count]) => {
        const n = parseInt(numStr);
        const data = realEstateInsights[n];
        return {
          number: n,
          count,
          title: data.title,
          explanation: data.getPrediction ? data.getPrediction(count) : data.explanation,
          highlight: data.highlight,
        };
      });

      setPredictions(results);
    }
  }, [grid]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#140824] via-[#1e153f] to-[#0a0c1c] text-white px-6 py-10">
      <h1 className="text-5xl font-extrabold text-center mb-10 tracking-widest text-purple-300 drop-shadow-glow">
        🏠 Real Estate Predictions
      </h1>

      {predictions.length === 0 ? (
        <p className="text-center text-lg text-purple-200">No impactful numbers found in your chart.</p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8">
          {predictions.map(({ title, explanation, count }) => (
            <div
              key={title}
              className="bg-white/10 border border-purple-500 rounded-2xl p-6 shadow-2xl backdrop-blur-xl hover:scale-[1.015] transition-transform"
            >
              <h2 className="text-2xl font-semibold text-yellow-300 mb-2">
                {title} <span className="text-sm text-white/60">×{count}</span>
              </h2>
              <p className="text-base leading-relaxed text-purple-100 whitespace-pre-line">
                {explanation}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
