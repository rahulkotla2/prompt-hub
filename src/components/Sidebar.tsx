import React from 'react';
import { Plus, List, Star, Settings, Tag as TagIcon } from 'lucide-react';

type SidebarProps = {
  activeTab: 'all' | 'favorites';
  setActiveTab: (tab: 'all' | 'favorites') => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  allTags: string[];
  setIsAddingPrompt: (val: boolean) => void;
  setIsTagManagerOpen: (val: boolean) => void;
  toggleTagFilter: (tag: string) => void;
};

export function Sidebar({
  activeTab,
  setActiveTab,
  selectedTags,
  setSelectedTags,
  allTags,
  setIsAddingPrompt,
  setIsTagManagerOpen,
  toggleTagFilter
}: SidebarProps) {
  return (
    <aside className="w-64 border-r border-black/10 dark:border-white/10 backdrop-blur-lg bg-black/5 dark:bg-white/5 p-6 flex flex-col gap-8 h-full overflow-y-auto hidden md:flex">
      <button 
        onClick={() => setIsAddingPrompt(true)}
        className="w-full py-2.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-cyan-600 dark:hover:border-cyan-400/40 rounded-xl font-bold text-xs tracking-widest hover:bg-cyan-600/10 dark:hover:bg-cyan-500/10 transition-all flex items-center justify-center gap-2 text-gray-800 dark:text-white/80 hover:text-cyan-600 dark:hover:text-cyan-400 group"
      >
        <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
        CREATE PROMPT
      </button>

      <nav className="flex flex-col gap-2">
        <button 
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'all' ? 'bg-cyan-600/10 dark:bg-cyan-400/10 text-cyan-600 dark:text-cyan-400 border border-cyan-600 dark:border-cyan-400/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]' : 'text-gray-600 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5'}`}
        >
          <List className="w-4 h-4 shrink-0" />
          <span className="text-sm font-medium">All Prompts</span>
        </button>
        <button 
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'favorites' ? 'bg-cyan-600/10 dark:bg-cyan-400/10 text-cyan-600 dark:text-cyan-400 border border-cyan-600 dark:border-cyan-400/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]' : 'text-gray-600 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5'}`}
        >
          <Star className="w-4 h-4 shrink-0" />
          <span className="text-sm font-medium">Favorites</span>
        </button>
      </nav>

      <div>
        <div className="flex items-center justify-between mb-4 px-3 border-t border-black/10 dark:border-white/10 pt-6">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-white/30">Tags</p>
          <div className="flex items-center gap-2">
            {selectedTags.length > 0 && (
              <button 
                onClick={() => setSelectedTags([])}
                className="text-[10px] text-cyan-600 dark:text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Clear
              </button>
            )}
            <button 
              onClick={() => setIsTagManagerOpen(true)}
              className="text-gray-500 dark:text-white/40 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              title="Manage Tags"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-1 px-1">
          {allTags.length === 0 ? (
            <p className="text-xs text-gray-500 dark:text-white/40 px-2 italic">No tags defined.</p>
          ) : (
            allTags.map(tag => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTagFilter(tag)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-cyan-600/10 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-600 dark:border-cyan-400/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]'
                      : 'bg-transparent border border-transparent text-gray-600 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <TagIcon className={`w-3 h-3 ${isSelected ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-400 dark:text-white/30'}`} />
                  <span className="truncate">{tag}</span>
                </button>
              )
            })
          )}
        </div>
      </div>
    </aside>
  );
}
