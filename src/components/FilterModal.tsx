import React from 'react';
import { X, Settings, Tag as TagIcon } from 'lucide-react';

type FilterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  sortBy: string;
  setSortBy: (val: 'newest' | 'oldest' | 'a-z') => void;
  allTags: string[];
  selectedTags: string[];
  toggleTagFilter: (tag: string) => void;
  setSelectedTags: (tags: string[]) => void;
  openTagManager: () => void;
};

export function FilterModal({
  isOpen,
  onClose,
  sortBy,
  setSortBy,
  allTags,
  selectedTags,
  toggleTagFilter,
  setSelectedTags,
  openTagManager
}: FilterModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-[400px] bg-white dark:bg-[#111111] border border-black/20 dark:border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 sm:p-6 border-b border-black/10 dark:border-white/10 flex justify-between items-center bg-gradient-to-r from-black/5 dark:from-white/5 to-transparent shrink-0">
          <div>
            <h2 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white">Filters & Options</h2>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-white/40 mt-1">Refine your prompts list.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-black/5 dark:bg-black/40 hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center transition-colors text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white shrink-0 ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-4 sm:p-6 flex flex-col gap-6 overflow-y-auto min-h-0">
          
          {/* Sort Section */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase font-bold text-gray-600 dark:text-white/60 tracking-wider">Sort By</label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['newest', 'oldest', 'a-z'] as const).map(option => (
                <button
                  key={option}
                  onClick={() => setSortBy(option)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                    sortBy === option 
                      ? 'bg-cyan-600/20 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-600/50 dark:border-cyan-500/50' 
                      : 'bg-black/5 dark:bg-black/40 text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 border border-black/10 dark:border-white/10'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Tags Section */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase font-bold text-gray-600 dark:text-white/60 tracking-wider">Tags Filter</label>
              <button 
                onClick={() => { onClose(); openTagManager(); }}
                className="text-[10px] uppercase font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-300 tracking-wider flex items-center gap-1"
              >
                <Settings className="w-3 h-3" /> Manage Tags
              </button>
            </div>
            {allTags.length === 0 ? (
              <p className="text-xs text-gray-500 dark:text-white/40 italic">No tags defined yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTagFilter(tag)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isSelected 
                          ? 'bg-cyan-600 dark:bg-cyan-500 text-white dark:text-black shadow-[0_0_15px_rgba(34,211,238,0.4)] border border-cyan-600 dark:border-cyan-400' 
                          : 'bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-700 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <TagIcon className="w-3 h-3" /> {tag}
                    </button>
                  );
                })}
              </div>
            )}
            {selectedTags.length > 0 && (
              <button 
                onClick={() => setSelectedTags([])}
                className="text-xs text-red-400 hover:text-red-300 mt-2 self-start"
              >
                Clear tag filters
              </button>
            )}
          </div>
        </div>
        
        <div className="p-4 sm:p-6 border-t border-black/10 dark:border-white/10 shrink-0">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-gray-900 text-white dark:bg-white dark:text-black rounded-xl font-bold text-sm tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            APPLY FILTERS
          </button>
        </div>
      </div>
    </div>
  );
}
