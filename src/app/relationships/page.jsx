// app/relationships/page.jsx

import { Suspense } from 'react';
import RelationshipsClient from './RelationshipsClient'; // <-- Purani file

export default function RelationshipsPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">Loading Relationships Analysis...</p>
      </div>
    }>
      <RelationshipsClient />
    </Suspense>
  );
}