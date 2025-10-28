// app/horoscope/page.jsx

import { Suspense } from 'react';
import HoroscopeClient from './HoroscopeClient';

// Loading Skeleton
const LoadingSkeleton = () => (
  <div className="min-h-screen w-full flex flex-col items-center bg-black text-white p-4 sm:px-6 pt-24 pb-12">
    <div className="h-10 bg-gray-700 rounded-lg w-2/3 max-w-md animate-pulse mb-8"></div>
    <div className="bg-neutral-900 p-6 sm:p-8 rounded-xl max-w-md w-full animate-pulse">
      <div className="h-6 bg-gray-700 rounded w-1/3 mb-2"></div>
      <div className="h-12 bg-gray-700 rounded-lg mb-4"></div>
      <div className="h-12 bg-purple-700 rounded-lg"></div>
    </div>
  </div>
);

export default function HoroscopePage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <HoroscopeClient />
    </Suspense>
  );
}