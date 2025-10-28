// app/relationship-checker/page.jsx

import { Suspense } from 'react';
import RelationshipCheckerClient from './RelationshipCheckerClient'; // <-- Purani file

export default function RelationshipCheckerPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">Loading Relationship Checker...</p>
      </div>
    }>
      <RelationshipCheckerClient />
    </Suspense>
  );
}