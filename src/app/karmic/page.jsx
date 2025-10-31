import { Suspense } from 'react';
import KarmicDebtContent from './KarmicDebtContent';

// This is a Server Component and will be prerendered.
export default function KarmicPage() {
  return (
    <div>
      {/* You can have other static content here */}
      <h1>My Karmic Page</h1>

      {/*
        Wrap the dynamic component in Suspense.
        Next.js will render the 'fallback' during the build
        and on the initial page load.
      */}
      <Suspense fallback={<p>Loading content...</p>}>
        <KarmicDebtContent />
      </Suspense>
    </div>
  );
}