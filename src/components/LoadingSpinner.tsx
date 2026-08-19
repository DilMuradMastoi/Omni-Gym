import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC<{ label?: string }> = ({ label = 'Loading gym data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-400 gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      <span className="text-xs font-semibold tracking-wide text-slate-300">{label}</span>
    </div>
  );
};

export const SkeletonLoader: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4 animate-pulse my-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-16 bg-slate-800/60 rounded-xl border border-slate-700/40 w-full" />
      ))}
    </div>
  );
};
