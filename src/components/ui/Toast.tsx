import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

type ToastProps = {
  toast: { message: string; isError: boolean } | null;
};

export function Toast({ toast }: ToastProps) {
  if (!toast) return null;

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 backdrop-blur-xl px-6 py-3 rounded-full flex items-center gap-3 shadow-lg animate-in fade-in slide-in-from-bottom-5 z-[200] whitespace-nowrap border ${
      toast.isError
        ? 'bg-red-900/40 border-red-500/30 text-red-100 shadow-[0_0_30px_rgba(239,68,68,0.3)]'
        : 'bg-cyan-900/40 border-cyan-600 dark:border-cyan-400/30 text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.2)]'
    }`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${toast.isError ? 'bg-red-500/20' : 'bg-cyan-600/20 dark:bg-cyan-400/20'}`}>
        {toast.isError ? <AlertCircle className="w-4 h-4 text-red-400" /> : <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />}
      </div>
      <span className="text-sm font-medium tracking-wide">{toast.message}</span>
    </div>
  );
}
