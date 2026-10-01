'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-3xl font-bold mb-3">Something went wrong</h2>
      <p className="text-slate-400 mb-6 max-w-md text-sm">
        An unexpected error occurred. You can attempt to recover by clicking below.
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors cursor-pointer"
      >
        Try again
      </button>
    </div>
  );
}
