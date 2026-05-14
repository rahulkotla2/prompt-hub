import React, { useMemo } from 'react';
import { X, Copy } from 'lucide-react';
import { Prompt } from '../types';
import { getVariables, getLatestContent } from '../utils';

type CompilerModalProps = {
  activePrompt: Prompt | null;
  setActivePrompt: (prompt: Prompt | null) => void;
  variableValues: Record<string, string>;
  setVariableValues: (vals: Record<string, string>) => void;
  copyFinalPrompt: () => void;
};

export function CompilerModal({
  activePrompt,
  setActivePrompt,
  variableValues,
  setVariableValues,
  copyFinalPrompt
}: CompilerModalProps) {
  if (!activePrompt) return null;

  const latestRaw = getLatestContent(activePrompt);

  const renderLivePreview = () => {
    const regex = /{{(.*?)}}/g;
    const parts = latestRaw.split(regex);
    
    return (
      <div className="bg-black/5 dark:bg-black/40 border border-black/5 dark:border-white/5 rounded-xl p-4 font-mono text-xs leading-relaxed text-gray-700 dark:text-white/70 min-h-[120px] relative overflow-hidden whitespace-pre-wrap">
        {parts.map((part, i) => {
          if (i % 2 !== 0) {
            const varName = part.trim();
            const val = variableValues[varName];
            return (
              <span key={i} className="text-cyan-600 dark:text-cyan-400 bg-cyan-600/10 dark:bg-cyan-400/10 px-1 rounded break-all">
                {val || `...`}
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
        <div className="absolute top-0 right-0 p-2">
          <div className="w-2 h-2 rounded-full bg-cyan-600 dark:bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse"></div>
        </div>
      </div>
    );
  };

  const variables = getVariables(latestRaw);

  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-[540px] bg-white dark:bg-[#111111] border border-cyan-600/20 dark:border-cyan-500/20 rounded-2xl sm:rounded-3xl shadow-[0_0_50px_rgba(34,211,238,0.1)] outline outline-1 outline-white/10 flex flex-col max-h-[92vh] sm:max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 sm:p-6 border-b border-black/10 dark:border-white/10 flex justify-between items-center bg-cyan-900/10 shrink-0">
          <div className="pr-2 sm:pr-4 min-w-0 flex-1">
            <h2 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white flex items-center gap-2 truncate">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-600 dark:bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] shrink-0"></div>
              Compiler Engine
            </h2>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-white/50 mt-1 truncate">Executing: {activePrompt.title}</p>
          </div>
          <button 
            onClick={() => setActivePrompt(null)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/5 dark:bg-black/50 hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center transition-colors shrink-0 border border-black/10 dark:border-white/10 ml-2"
          >
            <X className="w-4 h-4 text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white" />
          </button>
        </div>
        
        <div className="p-4 sm:p-6 flex flex-col gap-5 sm:gap-6 overflow-y-auto min-h-0">
          {variables.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {variables.map(v => (
                <div key={v} className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase font-bold text-cyan-600 dark:text-cyan-400 tracking-wider w-full overflow-hidden text-ellipsis px-1">{v}</label>
                  <textarea 
                    rows={3}
                    autoFocus
                    placeholder={`Enter ${v.replace(/_/g, ' ')}...`}
                    value={variableValues[v] || ''}
                    onChange={(e) => setVariableValues({ ...variableValues, [v]: e.target.value })}
                    className="bg-black/5 dark:bg-black/50 border border-black/10 dark:border-white/10 border-b-cyan-600/50 dark:border-b-cyan-500/50 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-b-cyan-600 dark:focus:border-b-cyan-400 focus:bg-black/5 dark:focus:bg-white/5 transition-colors shadow-inner w-full text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 resize-y"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <label className="text-[10px] uppercase font-bold text-purple-400 tracking-wider px-1">Compiled Output</label>
            {renderLivePreview()}
          </div>

          <button 
            onClick={copyFinalPrompt}
            className="w-full py-4 bg-gradient-to-r from-cyan-600 dark:from-cyan-500 to-purple-600 rounded-xl font-bold text-sm tracking-widest shadow-[0_8px_30px_rgba(34,211,238,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 text-gray-900 dark:text-white"
          >
            <Copy className="w-4 h-4" />
            COPY FINAL INSTRUCTIONS
          </button>
        </div>
      </div>
    </div>
  );
}
