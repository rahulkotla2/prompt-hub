import React, { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { Search, Star } from 'lucide-react';
import { Prompt } from '../types';
import { getVariables } from '../utils';

type CommandPaletteProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  prompts: Prompt[];
  onSelectPrompt: (prompt: Prompt) => void;
};

export function CommandPalette({ open, setOpen, prompts, onSelectPrompt }: CommandPaletteProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    if (!open) {
      setSearchTerm('');
      setDebouncedSearch('');
    }
  }, [open]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredPrompts = prompts.filter(prompt => {
    if (!debouncedSearch) return true;
    const searchLower = debouncedSearch.toLowerCase();
    return (
      prompt.title.toLowerCase().includes(searchLower) ||
      prompt.content.toLowerCase().includes(searchLower) ||
      prompt.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/20 dark:bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[5vh] sm:pt-[15vh] px-2 sm:px-4">
      <div className="fixed inset-0" onClick={() => setOpen(false)}></div>
      <Command 
        className="w-full max-w-xl bg-white dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col text-gray-900 dark:text-white relative z-10 animate-in fade-in zoom-in-95 duration-100 max-h-[85vh]"
        shouldFilter={false}
      >
        <div className="flex items-center px-4 border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-white/40 shrink-0" />
          <Command.Input 
            autoFocus
            value={searchTerm}
            onValueChange={setSearchTerm}
            placeholder="Search prompts by title, content, or tag..." 
            className="flex-1 bg-transparent py-3 px-3 sm:p-4 text-gray-900 dark:text-white placeholder-white/40 focus:outline-none text-sm sm:text-[15px] font-medium" 
          />
          <kbd className="hidden sm:inline-block bg-black/5 dark:bg-black/50 border border-black/10 dark:border-white/10 px-2 py-0.5 rounded text-[10px] font-mono text-gray-500 dark:text-white/50">ESC</kbd>
        </div>
        <Command.List className="overflow-y-auto p-1 sm:p-2">
          <Command.Empty className="p-6 sm:p-10 text-center flex flex-col items-center gap-2">
            <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 dark:text-white/20" />
            <p className="text-gray-600 dark:text-white/60 text-sm font-medium">No prompts found.</p>
            <p className="text-gray-500 dark:text-white/40 text-[10px] sm:text-xs text-balance">Try searching for a different keyword or create a new prompt.</p>
          </Command.Empty>
          {filteredPrompts.map(prompt => (
            <Command.Item 
              key={prompt.id} 
              value={prompt.id}
              onSelect={() => { onSelectPrompt(prompt); setOpen(false); }}
              className="px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl flex flex-col gap-1.5 cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 aria-selected:bg-black/10 dark:aria-selected:bg-white/10 transition-colors outline-none mx-1 my-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{prompt.title}</h4>
                  {prompt.isFavorite && <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />}
                </div>
                {getVariables(prompt.content).length > 0 && (
                  <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-600/20 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-600/30 dark:border-cyan-500/30">
                    COMPILES
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-white/40 truncate w-full font-mono font-light">{prompt.content}</p>
            </Command.Item>
          ))}
        </Command.List>
      </Command>
    </div>
  );
}
