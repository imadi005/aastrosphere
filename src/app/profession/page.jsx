// app/profession/page.jsx

import { Suspense } from 'react';
import ProfessionClient from './ProfessionClient'; // <-- Yeh aapki purani 'page.jsx' file hogi

export default function ProfessionPage() {
  return (
    // "Loading..." fallback
    <Suspense fallback={
      <div className="h-screen w-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">Loading Profession Analysis...</p>
      </div>
    }>
      <ProfessionClient />
    </Suspense>
  );
}