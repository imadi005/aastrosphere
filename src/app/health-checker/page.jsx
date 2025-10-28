// app/health-checker/page.jsx

import { Suspense } from 'react';
import HealthCheckerClient from './HealthCheckerClient'; // <-- Ye aapki purani file hai

export default function HealthCheckerPage() {
  return (
    // Next.js ko batata hai ki server pe "Loading..." dikhao
    // aur client (browser) mein 'HealthCheckerClient' component load karo
    <Suspense fallback={
      <div className="h-screen w-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">Loading Health Analysis...</p>
      </div>
    }>
      <HealthCheckerClient />
    </Suspense>
  );
}