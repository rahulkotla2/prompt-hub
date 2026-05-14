import React from 'react';
import { AlertCircle, Copy, Check } from 'lucide-react';

export function SupabaseConfigRequired() {
  return (
    <div className="w-full h-screen bg-[#fafafa] dark:bg-[#050505] text-gray-900 dark:text-white font-sans flex items-center justify-center relative p-4">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-red-900/10 blur-[120px] animate-pulse"></div>
      </div>
      <div className="w-full max-w-lg bg-black/5 dark:bg-black/40 backdrop-blur-2xl border border-red-500/30 rounded-3xl p-6 sm:p-8 relative z-10 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
        <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/50 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-6 h-6 text-red-400" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-center mb-2 tracking-tight">Supabase Configuration Required</h1>
        <p className="text-center text-gray-500 dark:text-white/50 text-sm mb-6 text-balance">
          It looks like we're switching to Supabase. To finalize the backend, you need to add your Supabase connection strings.
        </p>
        <div className="bg-black/20 dark:bg-black/60 border border-black/10 dark:border-white/10 rounded-xl p-4 sm:p-6 text-xs sm:text-sm text-left font-mono text-gray-700 dark:text-white/70 space-y-4">
          <p>1. Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-cyan-600 dark:text-cyan-400 hover:underline">Supabase Dashboard</a> and create a project.</p>
          <p>2. Open AI Studio's App Settings &gt; Environment Variables.</p>
          <p>3. Add the following keys:</p>
          <ul className="list-disc pl-5 space-y-1 text-cyan-300">
            <li>VITE_SUPABASE_URL</li>
            <li>VITE_SUPABASE_ANON_KEY</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

type DbSetupRequiredProps = {
  toast: { message: string, isError: boolean } | null;
  showToast: (msg: string) => void;
};

export function DbSetupRequired({ toast, showToast }: DbSetupRequiredProps) {
  return (
    <div className="w-full min-h-screen bg-[#fafafa] dark:bg-[#050505] text-gray-900 dark:text-white font-sans flex flex-col items-center justify-center relative p-4 py-10">
      <div className="w-full max-w-3xl bg-black/5 dark:bg-black/40 backdrop-blur-2xl border border-red-500/30 rounded-3xl p-6 sm:p-8 relative z-10 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
        <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/50 flex items-center justify-center mb-6">
          <AlertCircle className="w-6 h-6 text-red-400" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold mb-2 tracking-tight">PostgreSQL Database Setup Required</h1>
        <p className="text-gray-700 dark:text-white/70 text-sm mb-6">
          The application is connected to Supabase, but the <strong>"prompts"</strong> table does not exist. Please run the following SQL script in your Supabase Dashboard SQL Editor to create it.
        </p>
        
        <div className="bg-gray-50 dark:bg-[#0f0f0f] border border-black/10 dark:border-white/10 rounded-xl overflow-hidden mb-6 relative group">
          <button
            onClick={() => {
              navigator.clipboard.writeText(`CREATE TABLE public.prompts (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  user_id UUID REFERENCES auth.users NOT NULL,\n  title TEXT NOT NULL,\n  content TEXT NOT NULL,\n  tags TEXT[] DEFAULT '{}',\n  is_favorite BOOLEAN DEFAULT FALSE,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,\n  versions JSONB DEFAULT '[]'::jsonb\n);\n\nALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;\n\nCREATE POLICY "Users can view their own prompts." ON public.prompts FOR SELECT USING (auth.uid() = user_id);\nCREATE POLICY "Users can insert their own prompts." ON public.prompts FOR INSERT WITH CHECK (auth.uid() = user_id);\nCREATE POLICY "Users can update their own prompts." ON public.prompts FOR UPDATE USING (auth.uid() = user_id);\nCREATE POLICY "Users can delete their own prompts." ON public.prompts FOR DELETE USING (auth.uid() = user_id);`);
              showToast('SQL Copied to clipboard!');
            }}
            className="absolute top-4 right-4 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-gray-900 dark:text-white rounded-lg p-2 transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            <span className="text-xs font-bold font-sans">COPY SCRIPT</span>
          </button>
          <pre className="p-4 text-xs font-mono text-cyan-300 overflow-x-auto whitespace-pre">
{`CREATE TABLE public.prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  versions JSONB DEFAULT '[]'::jsonb
);

ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own prompts." ON public.prompts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own prompts." ON public.prompts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prompts." ON public.prompts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prompts." ON public.prompts
  FOR DELETE USING (auth.uid() = user_id);`}
          </pre>
        </div>
        
        <button 
          onClick={() => window.location.reload()}
          className="w-full sm:w-auto px-6 py-3 bg-cyan-600/20 dark:bg-cyan-500/20 hover:bg-cyan-600/30 dark:hover:bg-cyan-500/30 border border-cyan-600/50 dark:border-cyan-500/50 text-cyan-300 rounded-xl font-bold text-sm tracking-widest shadow-[0_8px_30px_rgba(34,211,238,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-transform"
        >
          I RAN THE SCRIPT — RELOAD APP
        </button>
      </div>
      
      {/* Toast for Copying SQL */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-cyan-900/40 border border-cyan-600 dark:border-cyan-400/30 text-cyan-100 backdrop-blur-xl px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_0_30px_rgba(34,211,238,0.2)] animate-in fade-in slide-in-from-bottom-5 z-[200] whitespace-nowrap">
          <div className="w-5 h-5 rounded-full bg-cyan-600/20 dark:bg-cyan-400/20 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
          </div>
          <span className="text-sm font-medium tracking-wide">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
