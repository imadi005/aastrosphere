// app/monthly-dasha/page.jsx

import { Suspense } from 'react';
import MonthlyDashaClient from './MonthlyDashaClient'; // <-- Ye aapki purani file hai

export default function MonthlyDashaPage() {
  return (
    // "Loading..." fallback aap apne hisaab se style kar sakte hain
    <Suspense fallback={
      <div className="h-screen w-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">Loading Monthly Dasha...</p>
      </div>
    }>
      <MonthlyDashaClient />
    </Suspense>
  );
}