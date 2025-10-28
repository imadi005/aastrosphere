// app/result/page.jsx
import { Suspense } from 'react';
import ResultClient from './ResultClient';

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen bg-black text-white flex items-center justify-center">
          <p className="text-xl animate-pulse text-center">
            Loading your Numerology Results...
          </p>
        </div>
      }
    >
      <ResultClient />
    </Suspense>
  );
}
