import React from 'react';
import { X, Settings, Tag as TagIcon } from 'lucide-react';

type AddPromptModalProps = {
  isOpen: boolean;
  isEditing?: boolean;
  onClose: () => void;
  newPrompt: { title: string; content: string; tags: string[], versions: {version: number, content: string, createdAt?: string}[] };
  setNewPrompt: (updater: (prev: { title: string; content: string; tags: string[], versions: {version: number, content: string, createdAt?: string}[] }) => { title: string; content: string; tags: string[], versions: {version: number, content: string, createdAt?: string}[] }) => void;
  allTags: string[];
  togglePredefinedTag: (tag: string) => void;
  saveNewPrompt: () => void;
  openTagManager: () => void;
};

export function AddPromptModal({
  isOpen,
  isEditing,
  onClose,
  newPrompt,
  setNewPrompt,
  allTags,
  togglePredefinedTag,
  saveNewPrompt,
  openTagManager
}: AddPromptModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-[600px] bg-white dark:bg-[#111111] border border-black/20 dark:border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 sm:p-6 border-b border-black/10 dark:border-white/10 flex justify-between items-center bg-gradient-to-r from-black/5 dark:from-white/5 to-transparent shrink-0">
          <div>
            <h2 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white">{isEditing ? 'Edit Prompt' : 'Create New Prompt'}</h2>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-white/40 mt-1">Wrap variables in {"{{curly_braces}}"} to dynamically fill them later.</p>
          </div>
          <button 
            onClick={onClose}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/5 dark:bg-black/40 hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center transition-colors text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white shrink-0 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-4 sm:p-5 flex flex-col gap-4 sm:gap-5 overflow-y-auto min-h-0">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold text-gray-600 dark:text-white/60 tracking-wider px-1">Prompt Title *</label>
            <input 
              type="text" 
              autoFocus
              placeholder="e.g. UX Copywriter Guru"
              value={newPrompt.title}
              onChange={(e) => setNewPrompt(prev => ({...prev, title: e.target.value}))}
              className="bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-600 dark:focus:border-cyan-400 transition-colors shadow-inner w-full text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30"
            />
          </div>

          {(() => {
            const allVers = [
              { isOriginal: true, version: 0, content: newPrompt.content },
              ...(newPrompt.versions || []).map((v, i) => ({ isOriginal: false, version: i + 1, content: v.content }))
            ];
            
            return allVers.map((ver, idx) => (
              <div key={idx} className="flex flex-col gap-2 opacity-80 hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500 dark:text-white/50 tracking-wider">
                    {ver.isOriginal ? 'Original Version (v0)' : `Version v${ver.version}`}
                    {idx === allVers.length - 1 && ' [LATEST]'}
                  </label>
                  <button
                    onClick={() => {
                      setNewPrompt(prev => {
                        const currentAllContent = [prev.content, ...(prev.versions || []).map(v => v.content)];
                        const currentAllObj = [
                          { version: 0, createdAt: undefined }, 
                          ...(prev.versions || [])
                        ];
                        
                        const nextAllContent = currentAllContent.filter((_, i) => i !== idx);
                        const nextAllObj = currentAllObj.filter((_, i) => i !== idx);
                        
                        // If all versions are deleted, at least keep one empty original version
                        if (nextAllContent.length === 0) {
                          nextAllContent.push('');
                        }
                        
                        return {
                          ...prev,
                          content: nextAllContent[0],
                          versions: nextAllContent.slice(1).map((c, i) => ({ 
                            version: i + 1, 
                            content: c,
                            createdAt: nextAllObj[i + 1]?.createdAt
                          }))
                        };
                      });
                    }}
                    className="text-gray-500 dark:text-white/40 hover:text-red-400 p-1 rounded transition-colors"
                    title="Remove Version"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <textarea 
                  rows={ver.isOriginal ? 5 : 4}
                  placeholder={ver.isOriginal ? "You are an expert... Here is the task: {{task}}." : ""}
                  value={ver.content}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewPrompt(prev => {
                      const currentAllContent = [prev.content, ...(prev.versions || []).map(v => v.content)];
                      const currentAllObj = [
                        { version: 0, createdAt: undefined }, 
                        ...(prev.versions || [])
                      ];
                      
                      currentAllContent[idx] = val;
                      
                      return {
                        ...prev,
                        content: currentAllContent[0],
                        versions: currentAllContent.slice(1).map((c, i) => ({ 
                          version: i + 1, 
                          content: c,
                          createdAt: currentAllObj[i + 1]?.createdAt
                        }))
                      };
                    });
                  }}
                  className={`bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-${ver.isOriginal ? 'cyan' : 'purple'}-400 transition-colors shadow-inner w-full text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 font-mono resize-y`}
                />
              </div>
            ));
          })()}

          <div className="flex justify-end mt-1">
            <button
              onClick={() => {
                setNewPrompt(prev => {
                  return {
                    ...prev,
                    versions: [
                      ...(prev.versions || []),
                      { version: (prev.versions?.length || 0) + 1, content: '' }
                    ]
                  };
                });
              }}
              className="px-4 py-2 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 text-gray-900 dark:text-white rounded-lg transition-colors"
            >
              + ADD NEW VERSION
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] uppercase font-bold text-gray-600 dark:text-white/60 tracking-wider">Tags</label>
              <button 
                onClick={() => { openTagManager(); }}
                className="text-[10px] uppercase font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-300 tracking-wider flex items-center gap-1"
              >
                <Settings className="w-3 h-3" /> Manage Tags
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-2 px-1">
              {allTags.length === 0 ? (
                <p className="text-xs text-gray-500 dark:text-white/40 italic py-2">No tags available. Create some to categorize prompts.</p>
              ) : (
                allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => togglePredefinedTag(tag)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      newPrompt.tags.includes(tag) 
                        ? 'bg-cyan-600/20 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-600/40 dark:border-cyan-500/40 shadow-[0_0_10px_rgba(34,211,238,0.2)]' 
                        : 'bg-black/5 dark:bg-white/5 text-gray-600 dark:text-white/60 border-black/10 dark:border-white/10 hover:border-cyan-600 dark:hover:border-cyan-400/40 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <TagIcon className="w-3 h-3" /> {tag}
                  </button>
                ))
              )}
            </div>
          </div>

          <button 
            onClick={saveNewPrompt}
            className="mt-2 w-full py-3.5 bg-gray-900 text-white dark:bg-white dark:text-black rounded-xl font-bold text-sm tracking-widest shadow-[0_8px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.15)] hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            {isEditing ? 'SAVE CHANGES' : 'INITIALIZE PROMPT'}
          </button>
        </div>
      </div>
    </div>
  );
}
