import React from 'react';
import { User, ChevronRight } from 'lucide-react';
import { ProcessingLoader } from './ui/ProcessingLoader';
import { Toast } from './ui/Toast';

type AuthScreenProps = {
  isProcessing: boolean;
  isSignUp: boolean;
  setIsSignUp: (val: boolean) => void;
  handleAuth: (e: React.FormEvent<HTMLFormElement>) => void;
  toast: { message: string; isError: boolean } | null;
};

export function AuthScreen({ isProcessing, isSignUp, setIsSignUp, handleAuth, toast }: AuthScreenProps) {
  return (
    <div className="w-full h-screen bg-[#fafafa] dark:bg-[#050505] text-gray-900 dark:text-white font-sans overflow-hidden flex items-center justify-center relative p-4">
      <ProcessingLoader isProcessing={isProcessing} />
      
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-900/20 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px]"></div>
      </div>
      
      <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <h1 className="text-2xl font-bold text-center mb-2 tracking-tight">Prompt Hub</h1>
        <p className="text-center text-gray-500 dark:text-white/40 text-sm mb-6 sm:mb-8">Access your futuristic command center</p>
        
        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold text-cyan-600 dark:text-cyan-400 tracking-wider px-1">Email</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-white/40" />
              <input 
                type="email" 
                name="email"
                required
                placeholder="agent@prompthub.dev"
                className="w-full bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-cyan-600 dark:focus:border-cyan-400 transition-colors shadow-inner text-gray-900 dark:text-white placeholder-white/20"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold text-cyan-600 dark:text-cyan-400 tracking-wider px-1">Password</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              <input 
                type="password" 
                name="password"
                required
                placeholder="••••••••"
                minLength={6}
                className="w-full bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-cyan-600 dark:focus:border-cyan-400 transition-colors shadow-inner text-gray-900 dark:text-white placeholder-white/20"
              />
            </div>
          </div>
          <button 
            type="submit"
            disabled={isProcessing}
            className="mt-2 sm:mt-4 w-full py-3 sm:py-3.5 bg-gradient-to-r from-cyan-600 dark:from-cyan-500 to-purple-600 rounded-xl font-bold text-sm tracking-widest shadow-[0_8px_30px_rgba(34,211,238,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100"
          >
            {isProcessing ? 'PROCESSING...' : (isSignUp ? 'SIGN UP' : 'LOGIN')}
            {!isProcessing && <ChevronRight className="w-4 h-4" />}
          </button>
          
          <div className="text-center">
            <button 
              type="button" 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-gray-500 dark:text-white/50 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              {isSignUp ? 'Already have an account? Login' : 'No account? Sign up here'}
            </button>
          </div>
        </form>
      </div>

      <Toast toast={toast} />
    </div>
  );
}
