import React from 'react';
import { LogOut, User, Moon, Sun } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

type HeaderProps = {
  user: SupabaseUser | null;
  setIsProfileOpen: (open: boolean) => void;
  handleLogout: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
};

export function Header({ user, setIsProfileOpen, handleLogout, theme, toggleTheme }: HeaderProps) {
  return (
    <header className="h-[60px] sm:h-16 flex items-center justify-between px-4 sm:px-6 border-b border-black/10 dark:border-white/10 backdrop-blur-md bg-black/5 dark:bg-white/5 z-20 shrink-0 gap-4">
      <div className="flex items-center gap-3 shrink-0">
        <span className="font-bold tracking-tight text-lg sm:text-xl lg:block">Prompt<span className="text-cyan-600 dark:text-cyan-400">Hub</span></span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-semibold text-gray-800 dark:text-white/80">{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</p>
        </div>
        
        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/40 hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center transition-colors text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {user?.user_metadata?.avatar_url ? (
          <img 
            src={user.user_metadata.avatar_url} 
            alt="Profile" 
            className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 object-cover cursor-pointer hover:border-cyan-600 dark:hover:border-cyan-400 transition-colors" 
            onClick={() => setIsProfileOpen(true)} 
          />
        ) : (
          <button
            onClick={() => setIsProfileOpen(true)}
            className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/40 hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center transition-colors text-gray-900 dark:text-white cursor-pointer"
          >
            <User className="w-4 h-4" />
          </button>
        )}
        <button 
          onClick={handleLogout}
          className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/40 hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center transition-colors text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white"
          title="Disconnect"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
