// app/real-estate/page.jsx

import { Suspense } from 'react';
import RealEstateClient from './RealEstateClient'; // <-- Yeh aapki purani file hogi

export default function RealEstatePage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">Loading Real Estate Analysis...</p>
      </div>
    }>
      <RealEstateClient />
    </Suspense>
  );
}