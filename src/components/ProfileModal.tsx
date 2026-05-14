import React from 'react';
import { X } from 'lucide-react';

type ProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  profileName: string;
  setProfileName: (val: string) => void;
  profileImage: string;
  setProfileImage: (val: string) => void;
  updateProfile: () => void;
  isProcessing: boolean;
};

export function ProfileModal({
  isOpen,
  onClose,
  profileName,
  setProfileName,
  profileImage,
  setProfileImage,
  updateProfile,
  isProcessing
}: ProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="w-full max-w-[400px] bg-white dark:bg-[#111111] border border-black/20 dark:border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 sm:p-6 border-b border-black/10 dark:border-white/10 flex justify-between items-center bg-gradient-to-r from-black/5 dark:from-white/5 to-transparent shrink-0">
            <div>
              <h2 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white">Profile Settings</h2>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-white/40 mt-1">Configure your uplink identity.</p>
            </div>
            <button 
              onClick={onClose}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/5 dark:bg-black/40 hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center transition-colors text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white shrink-0 ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        
        <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-5 overflow-y-auto min-h-0">
          {profileImage && (
            <div className="flex justify-center mb-2">
              <img src={profileImage} alt="Preview" className="w-20 h-20 rounded-full object-cover border-4 border-cyan-600/30 dark:border-cyan-500/30" />
            </div>
          )}
          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold text-gray-600 dark:text-white/60 tracking-wider px-1">Display Name</label>
            <input 
              type="text" 
              autoFocus
              placeholder="e.g. Orion Data"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-600 dark:focus:border-cyan-400 transition-colors shadow-inner w-full text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold text-gray-600 dark:text-white/60 tracking-wider px-1">Profile Image</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setProfileImage(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-600 dark:focus:border-cyan-400 transition-colors shadow-inner w-full text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-cyan-600/20 dark:file:bg-cyan-500/20 file:text-cyan-600 dark:file:text-cyan-400 hover:file:bg-cyan-600/30 dark:file:bg-cyan-500/30"
            />
          </div>

          <button 
            onClick={updateProfile}
            disabled={isProcessing}
            className="mt-4 w-full py-3.5 bg-gray-900 text-white dark:bg-white dark:text-black rounded-xl font-bold text-sm tracking-widest shadow-[0_8px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.15)] hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isProcessing ? 'SAVING...' : 'SAVE PROFILE'}
          </button>
        </div>
      </div>
    </div>
  );
}
