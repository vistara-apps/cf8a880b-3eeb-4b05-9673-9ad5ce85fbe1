'use client';

import { type ReactNode } from 'react';

// Simple provider wrapper for now - OnchainKit integration can be added later
export function Providers({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      {children}
    </div>
  );
}
