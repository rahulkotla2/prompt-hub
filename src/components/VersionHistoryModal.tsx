import React, { useState, useRef, useEffect } from 'react';
import { X, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Prompt } from '../types';
import { getVariables } from '../utils';

function ExpandableContent({ content }: { content: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (textRef.current) {
      setIsOverflowing(textRef.current.scrollHeight > textRef.current.clientHeight);
    }
  }, [content]);

  return (
    <div>
      <pre 
        ref={textRef}
        className={`text-sm font-mono text-gray-700 dark:text-white/70 whitespace-pre-wrap bg-gray-100 dark:bg-[#1a1a1a] p-3 rounded-lg border border-black/5 dark:border-white/5 overflow-hidden ${isExpanded ? '' : 'line-clamp-3 cursor-pointer'}`}
        onClick={() => {
          if (!isExpanded && isOverflowing) setIsExpanded(true);
        }}
      >
        {content}
      </pre>
      
      {isOverflowing && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-xs text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1 font-medium bg-black/5 dark:bg-black/20 hover:bg-black/5 dark:hover:bg-black/40 px-2 py-1 rounded w-fit"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-3 h-3" /> Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" /> Show More
            </>
          )}
        </button>
      )}
    </div>
  );
}

type VersionHistoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  prompt: Prompt | null;
  onCopyAction: (prompt: Prompt) => void;
};

export function VersionHistoryModal({
  isOpen,
  onClose,
  prompt,
  onCopyAction
}: VersionHistoryModalProps) {
  const [copiedVersion, setCopiedVersion] = useState<number | null>(null);

  if (!isOpen || !prompt) return null;

  const versions = prompt.versions || [];
  
  const allVersions = [
    {
      version: 0,
      content: prompt.content,
      createdAt: prompt.createdAt || '',
      isOriginal: true
    },
    ...versions.map((v, i) => ({
      ...v,
      version: i + 1,
      isOriginal: false
    }))
  ];

  const handleCopy = (content: string, versionNum: number) => {
    onCopyAction({ ...prompt, content });
    setCopiedVersion(versionNum);
    setTimeout(() => setCopiedVersion(null), 2000);
    // If it has variables, we close this modal to focus on the compiler modal handled by App.tsx
    if (getVariables(content).length > 0) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[700px] bg-white dark:bg-[#111111] border border-black/20 dark:border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 sm:p-6 border-b border-black/10 dark:border-white/10 flex justify-between items-center bg-gradient-to-r from-purple-500/10 to-transparent shrink-0">
          <div>
            <h2 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white">Version History</h2>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-white/40 mt-1">{prompt.title}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {allVersions.map((v, i) => {
            const hasVars = getVariables(v.content).length > 0;
            const isLatest = i === allVersions.length - 1;
            
            return (
              <div key={v.version} className="bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl p-4 flex flex-col gap-3 relative">
                <div className="absolute top-0 right-0 translate-x-2 -translate-y-2 flex gap-1">
                  {v.isOriginal && (
                    <span className="bg-cyan-600 dark:bg-cyan-500 text-white dark:text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                      ORIGINAL
                    </span>
                  )}
                  {isLatest && (
                    <span className="bg-purple-500 text-gray-900 dark:text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                      LATEST
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-purple-400 font-bold font-mono text-sm">{v.isOriginal ? 'Original Version (v0)' : `Version v${v.version}`}</span>
                    {v.createdAt && (
                      <span className="text-gray-400 dark:text-white/30 text-xs ml-3">
                        {new Date(v.createdAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleCopy(v.content, v.version)}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all flex items-center gap-1.5 ${
                      copiedVersion === v.version
                        ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                        : hasVars
                          ? 'bg-purple-500/20 border border-purple-500/40 text-purple-400 hover:bg-purple-500 hover:text-gray-900 dark:hover:text-white'
                          : 'bg-black/10 dark:bg-white/10 border border-black/20 dark:border-white/20 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white hover:text-gray-900 dark:hover:text-black'
                    }`}
                  >
                    {copiedVersion === v.version ? (
                      <>
                        <Check className="w-3 h-3" />
                        COPIED
                      </>
                    ) : hasVars ? (
                      'COMPILE'
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        COPY RAW
                      </>
                    )}
                  </button>
                </div>
                
                <ExpandableContent content={v.content} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
