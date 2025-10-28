// app/predictions/page.jsx

import { Suspense } from 'react';
import PredictionsClient from './PredictionsClient'; // <-- Ye aapki purani file hai

export default function PredictionsPage() {
  return (
    // "Loading..." fallback
    <Suspense fallback={
      <div className="h-screen w-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">Loading Predictions...</p>
      </div>
    }>
      <PredictionsClient />
    </Suspense>
  );
}