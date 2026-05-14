import React from 'react';

type ConfirmDialogProps = {
  dialog: { isOpen: boolean; title: string; message: string; onConfirm: () => void } | null;
  onClose: () => void;
};

export function ConfirmDialog({ dialog, onClose }: ConfirmDialogProps) {
  if (!dialog || !dialog.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-[320px] bg-white dark:bg-[#111111] border border-black/20 dark:border-white/20 rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200 p-6">
        <h2 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{dialog.title}</h2>
        <p className="text-sm text-gray-600 dark:text-white/60 mb-6">{dialog.message}</p>
        <div className="flex gap-3 justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={dialog.onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-bold bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
