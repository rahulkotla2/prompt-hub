import React from 'react';
import { X, Plus, Trash2, Tag as TagIcon } from 'lucide-react';

type TagManagerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  allTags: string[];
  newTagInput: string;
  setNewTagInput: (val: string) => void;
  handleCreateTag: () => void;
  handleDeleteTag: (tag: string) => void;
  isProcessing: boolean;
};

export function TagManagerModal({
  isOpen,
  onClose,
  allTags,
  newTagInput,
  setNewTagInput,
  handleCreateTag,
  handleDeleteTag,
  isProcessing
}: TagManagerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-[400px] bg-white dark:bg-[#111111] border border-black/20 dark:border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 sm:p-6 border-b border-black/10 dark:border-white/10 flex justify-between items-center shrink-0">
          <div>
            <h2 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white">Tag Management</h2>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-white/40 mt-1">Create or remove tags globally.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-black/5 dark:bg-black/40 hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center transition-colors text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white shrink-0 ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto min-h-0">
          
          <div className="flex gap-2">
            <input 
              type="text"
              placeholder="New tag name..."
              value={newTagInput}
              onChange={e => setNewTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreateTag()}
              className="flex-1 bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-600 dark:focus:border-cyan-400 transition-colors shadow-inner text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30"
            />
            <button
              onClick={handleCreateTag}
              disabled={isProcessing || !newTagInput.trim()}
              className="bg-cyan-600 dark:bg-cyan-500 hover:bg-cyan-700 dark:hover:bg-cyan-400 text-white dark:text-black px-4 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 font-bold text-sm shrink-0"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex flex-col gap-1 mt-2">
            {allTags.length === 0 ? (
              <p className="text-xs text-gray-500 dark:text-white/40 italic text-center py-4">No tags available.</p>
            ) : (
              allTags.map(tag => (
                <div key={tag} className="flex items-center justify-between bg-black/5 dark:bg-black/40 border border-black/5 dark:border-white/5 px-3 py-2 rounded-lg group">
                  <span className="text-sm text-gray-800 dark:text-white/80 flex items-center gap-2">
                    <TagIcon className="w-3.5 h-3.5 text-gray-400 dark:text-white/30" /> {tag}
                  </span>
                  <button
                    onClick={() => handleDeleteTag(tag)}
                    className="text-gray-400 dark:text-white/20 hover:text-red-400 transition-colors p-1"
                    title="Delete Tag"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
