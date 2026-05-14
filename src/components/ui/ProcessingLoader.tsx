import React from 'react';

export function ProcessingLoader({ isProcessing }: { isProcessing: boolean }) {
  if (!isProcessing) return null;
  
  return (
    <div className="absolute inset-0 z-[1000] bg-black/5 dark:bg-black/20 backdrop-blur-[1px] flex items-center justify-center">
      <div className="bg-black/20 dark:bg-black/60 border border-black/10 dark:border-white/10 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-xl backdrop-blur-xl">
        <div className="w-4 h-4 border-2 border-cyan-600/30 dark:border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
        <span className="text-sm font-medium text-gray-800 dark:text-white/80 tracking-widest">PROCESSING...</span>
      </div>
    </div>
  );
}
