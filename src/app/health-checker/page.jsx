// app/health-checker/page.jsx

import { Suspense } from 'react';
import HealthCheckerClient from './HealthCheckerClient';

// UI IMPROVEMENT: Skeleton loading component
// Yeh aapke real card jaisa dikhta hai aur user ko loading state ka pata chalata hai
const LoadingSkeleton = () => (
  <div className="min-h-screen w-full overflow-x-hidden bg-black text-white px-4 sm:px-6 lg:px-8 pt-24 pb-12 flex flex-col items-center">
    <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
      🧠 Analyzing Health Status...
    </h1>
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-lg shadow-2xl border-l-8 border-gray-700 bg-gray-900/50 p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="h-8 bg-gray-700 rounded w-1/3"></div>
            <div className="h-6 bg-gray-700 rounded-full w-1/4"></div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4 mt-1"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4 mt-1"></div>
            </div>
          </div>
          <div className="h-3 bg-gray-700 rounded w-1/5 mt-4 ml-auto"></div>
        </div>
      ))}
    </div>
  </div>
);

export default function HealthCheckerPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <HealthCheckerClient />
    </Suspense>
  );
}