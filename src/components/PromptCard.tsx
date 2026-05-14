import React from 'react';
import { Trash2, Star, Copy, Edit3 } from 'lucide-react';
import { Prompt } from '../types';
import { getLatestContent } from '../utils';

type PromptCardProps = {
  key?: React.Key;
  prompt: Prompt;
  index: number;
  hasVariables: boolean;
  onDelete: (id: string, e: React.MouseEvent) => void | Promise<void>;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void | Promise<void>;
  onCopyAction: (prompt: Prompt) => void;
  onEdit: (prompt: Prompt, e: React.MouseEvent) => void;
  onViewHistory?: (prompt: Prompt, e: React.MouseEvent) => void;
};

export function PromptCard({ 
  prompt, 
  index, 
  hasVariables, 
  onDelete, 
  onToggleFavorite, 
  onCopyAction,
  onEdit,
  onViewHistory
}: PromptCardProps) {
  const hoverStyles = [
    'hover:border-cyan-600/40 dark:hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] group-hover:text-cyan-600 dark:group-hover:text-cyan-400',
    'hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] group-hover:text-purple-400',
    'hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] group-hover:text-blue-400'
  ];
  const styleIdx = index % hoverStyles.length;
  const [cardHover, , titleHover] = hoverStyles[styleIdx].split(' ');
  const fullCardHover = `${cardHover} ${hoverStyles[styleIdx].split(' ')[1]}`;

  return (
    <div className={`bg-white sm:bg-white dark:bg-white/[0.03] sm:dark:bg-white/[0.03] backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 group transition-all min-h-[200px] h-auto sm:h-[220px] ${fullCardHover}`}>
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-center gap-2">
          <h3 className={`font-semibold text-[15px] sm:text-lg transition-colors line-clamp-2 sm:line-clamp-1 pr-2 ${titleHover} leading-tight`}>{prompt.title}</h3>
          {(prompt.versions && prompt.versions.length > 0) && (
            <button 
              onClick={(e) => onViewHistory && onViewHistory(prompt, e)}
              className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 whitespace-nowrap hover:bg-purple-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              title="View Version History"
            >
              v{(prompt.versions?.length || 0) + 1}
            </button>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0 pt-1 relative z-10">
          <button 
            onClick={(e) => onEdit(prompt, e)}
            className={`text-gray-400 dark:text-white/30 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors p-1`}
            title="Edit Prompt"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => onDelete(prompt.id, e)}
            className={`text-gray-400 dark:text-white/30 hover:text-red-400 transition-colors p-1`}
            title="Delete Prompt"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => onToggleFavorite(prompt.id, e)}
            className={`${prompt.isFavorite ? 'text-yellow-400' : 'text-gray-400 dark:text-white/30 hover:text-yellow-400'} transition-colors p-1`}
          >
            <Star className="w-5 h-5" fill={prompt.isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
      <p className="text-sm font-mono text-gray-500 dark:text-white/50 line-clamp-3 overflow-hidden">{getLatestContent(prompt)}</p>
      
      <div className="mt-auto flex items-center justify-between gap-3 relative z-10">
        <div className="flex flex-wrap gap-2 overflow-hidden max-h-[24px]">
          {prompt.tags.slice(0, 2).map(tag => {
            const tagColors = ['text-cyan-600 dark:text-cyan-400 bg-cyan-600/20 dark:bg-cyan-500/20 border-cyan-600/30 dark:border-cyan-500/30', 'text-purple-400 bg-purple-500/20 border-purple-500/30', 'text-blue-400 bg-blue-500/20 border-blue-500/30'];
            const colorClass = tagColors[tag.length % tagColors.length];
            return (
              <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap ${colorClass}`}>
                {tag}
              </span>
            )
          })}
          {prompt.tags.length > 2 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-500 dark:text-white/50 whitespace-nowrap">
              +{prompt.tags.length - 2}
            </span>
          )}
        </div>
        
        <button 
          onClick={() => onCopyAction(prompt)}
          className={`px-3 py-1.5 sm:px-4 text-[10px] sm:text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1 flex-nowrap ${
            hasVariables 
              ? 'bg-cyan-600/20 dark:bg-cyan-500/20 border border-cyan-600/40 dark:border-cyan-500/40 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-600 dark:hover:bg-cyan-500 hover:text-white dark:hover:text-black hover:shadow-[0_0_15px_rgba(34,211,238,0.5)]' 
              : 'bg-black/10 dark:bg-white/10 border border-black/20 dark:border-white/20 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white hover:text-gray-900 dark:hover:text-black'
          }`}
        >
          {hasVariables ? 'COMPILE' : (
            <>
              <Copy className="w-3 h-3 shrink-0" />
              COPY
            </>
          )}
        </button>
      </div>
    </div>
  );
}
