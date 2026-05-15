import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { supabase } from './lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

import { PromptCard } from './components/PromptCard';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AuthScreen } from './components/AuthScreen';
import { DbErrorAlert } from './components/DbErrorAlert';
import { AddPromptModal } from './components/AddPromptModal';
import { CompilerModal } from './components/CompilerModal';
import { TagManagerModal } from './components/TagManagerModal';
import { FilterModal } from './components/FilterModal';
import { ProfileModal } from './components/ProfileModal';
import { CommandPalette } from './components/CommandPalette';
import { VersionHistoryModal } from './components/VersionHistoryModal';
import { Toast } from './components/ui/Toast';
import { ConfirmDialog } from './components/ui/ConfirmDialog';
import { ProcessingLoader } from './components/ui/ProcessingLoader';
import { SupabaseConfigRequired, DbSetupRequired } from './components/SetupScreens';
import { getVariables, getLatestContent } from './utils';
import { Prompt } from './types';

export default function App() {
  // --- STATE ---
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [viewingHistoryPrompt, setViewingHistoryPrompt] = useState<Prompt | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  
  // Modals & Overlays
  const [activePrompt, setActivePrompt] = useState<Prompt | null>(null);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [openCmdk, setOpenCmdk] = useState(false);
  const [isAddingPrompt, setIsAddingPrompt] = useState(false);
  const [toast, setToast] = useState<{message: string, isError: boolean} | null>(null);
  const [dbNeedsSetup, setDbNeedsSetup] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // New Prompt Form State
  const [newPrompt, setNewPrompt] = useState<{title: string, content: string, tags: string[], versions: {version: number, content: string, createdAt?: string}[]}>({ title: '', content: '', tags: [], versions: [] });
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  
  // Search, Profile & Tag Management
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);
  const [userTags, setUserTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [sortBy, setSortBy] = useState<'newest'|'oldest'|'a-z'>('newest');
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean, title: string, message: string, onConfirm: () => void } | null>(null);

  // Theme State
  const [theme, setTheme] = useState<'dark'|'light'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // --- PERSISTENCE & SUPABASE ---
  useEffect(() => {
    if (!supabase) {
      setIsAuthLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) {
        setProfileName(session.user.user_metadata?.full_name || '');
        setProfileImage(session.user.user_metadata?.avatar_url || '');
        setUserTags(session.user.user_metadata?.saved_tags || []);
        fetchPrompts(session.user.id);
      }
      setIsAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        setProfileName(session.user.user_metadata?.full_name || '');
        setProfileImage(session.user.user_metadata?.avatar_url || '');
        setUserTags(session.user.user_metadata?.saved_tags || []);
        fetchPrompts(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchPrompts = async (userId: string) => {
    if (!supabase) return;
    setIsProcessing(true);
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        if (error.code === '42P01') {
          setDbNeedsSetup(true);
        } else {
          setDbError(`Fetch Error: ${error.message} (Code: ${error.code})`);
          showToast(`Error fetching prompts: ${error.message}`, true);
        }
        console.error('Supabase fetch error:', error);
        return;
      }
      
      if (data) {
        setDbNeedsSetup(false);
        setDbError(null);
        setPrompts(data.map(p => ({
          id: p.id,
          title: p.title,
          content: p.content,
          tags: p.tags,
          isFavorite: p.is_favorite,
          createdAt: p.created_at,
          versions: Array.isArray(p.versions) ? p.versions : (typeof p.versions === 'string' ? JSON.parse(p.versions) : [])
        })));
      }
    } catch (err: any) {
      if (err.message?.includes('Failed to fetch')) {
        setDbError('Network Error: Failed to connect to Supabase. Check your connection or Supabase config.');
        showToast('Failed to connect to backend', true);
      } else {
        showToast(`Error: ${err.message}`, true);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // --- KEYBOARD SHORTCUTS ---
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpenCmdk((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // --- HELPERS ---
  const showToast = (message: string, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 4000);
  };

  const updateProfile = async () => {
    if (!supabase) return;
    setIsProcessing(true);
    try {
      let avatarUrl = profileImage;

      // Delete old image if it exists and the image is being changed/removed
      const oldAvatarUrl = user?.user_metadata?.avatar_url;
      if (oldAvatarUrl && avatarUrl !== oldAvatarUrl) {
        if (oldAvatarUrl.includes('profile_images/')) {
          const oldFilePath = oldAvatarUrl.split('profile_images/').pop();
          if (oldFilePath) {
            await supabase.storage.from('profile_images').remove([oldFilePath]);
          }
        }
      }

      if (profileImageFile && user) {
        const fileExt = profileImageFile.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('profile_images')
          .upload(filePath, profileImageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('profile_images')
          .getPublicUrl(filePath);

        avatarUrl = publicUrlData.publicUrl;
      }

      const { data, error } = await supabase.auth.updateUser({
        data: { full_name: profileName, avatar_url: avatarUrl }
      });
      if (error) throw error;
      showToast('Profile updated successfully!');
      if (data?.user) {
        setUser(data.user);
        setProfileImage(avatarUrl);
      }
      setIsProfileOpen(false);
      setProfileImageFile(null);
    } catch (err: any) {
      showToast(err.message, true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase) return showToast('Supabase not available', true);
    
    setIsProcessing(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) showToast(error.message, true);
        else showToast('Signup successful! Welcome to Prompt Hub.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) showToast(error.message, true);
        else showToast('Login successful. Welcome back.');
      }
    } catch (err: any) {
      showToast(err.message, true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogout = async () => {
    if (!supabase) return;
    setIsProcessing(true);
    try {
      await supabase.auth.signOut();
      setPrompts([]);
    } catch (err: any) {
      showToast(err.message, true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagInput.trim()) return;
    const tag = newTagInput.trim();
    if (allTags.includes(tag)) {
      setNewTagInput('');
      return;
    }
    
    setIsProcessing(true);
    try {
      const updatedTags = [...userTags, tag];
      setUserTags(updatedTags);
      setNewTagInput('');
      if (supabase) {
        await supabase.auth.updateUser({ data: { saved_tags: updatedTags } });
      }
    } catch (err: any) {
      showToast(err.message, true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Tag',
      message: `Delete tag "${tagToDelete}"? This will remove it from your metadata and all matching prompts.`,
      onConfirm: async () => {
        setConfirmDialog(null);
        setIsProcessing(true);
        try {
          const updatedTags = userTags.filter(t => t !== tagToDelete);
          setUserTags(updatedTags);
          if (supabase) {
            await supabase.auth.updateUser({ data: { saved_tags: updatedTags } });
          }
          
          const promptsToUpdate = prompts.filter(p => p.tags.includes(tagToDelete));
          setPrompts(current => current.map(p => 
            p.tags.includes(tagToDelete) ? { ...p, tags: p.tags.filter(t => t !== tagToDelete) } : p
          ));
          
          if (supabase && promptsToUpdate.length > 0) {
            for (const p of promptsToUpdate) {
              await supabase.from('prompts').update({
                tags: p.tags.filter(t => t !== tagToDelete)
              }).eq('id', p.id);
            }
          }
          
          setSelectedTags(current => current.filter(t => t !== tagToDelete));
          showToast(`Tag "${tagToDelete}" deleted.`);
        } catch (err: any) {
          showToast(err.message, true);
        } finally {
          setIsProcessing(false);
        }
      }
    });
  };

  const toggleTagFilter = (tag: string) => {
    setSelectedTags(current => 
      current.includes(tag) 
        ? current.filter(t => t !== tag) 
        : [...current, tag]
    );
  };

  const deletePrompt = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Prompt',
      message: 'Are you sure you want to delete this prompt?',
      onConfirm: async () => {
        setConfirmDialog(null);
        setIsProcessing(true);
        try {
          if (supabase) {
            const { error } = await supabase.from('prompts').delete().eq('id', id);
            if (error) throw error;
          }
          setPrompts(prompts.filter(p => p.id !== id));
          showToast('Prompt deleted.');
        } catch (err: any) {
          showToast(err.message, true);
        } finally {
          setIsProcessing(false);
        }
      }
    });
  };

  const allTags = useMemo(() => {
    const tags = new Set<string>(userTags);
    prompts.forEach(p => p.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [prompts, userTags]);

  const filteredPrompts = useMemo(() => {
    let filtered = [...prompts];
    if (activeTab === 'favorites') {
      filtered = filtered.filter(p => p.isFavorite);
    }
    if (selectedTags.length > 0) {
      filtered = filtered.filter(p => selectedTags.every(tag => p.tags.includes(tag)));
    }
    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === 'a-z') return a.title.localeCompare(b.title);
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
    });

    return filtered;
  }, [prompts, activeTab, selectedTags, sortBy]);

  const handleCopyAction = (prompt: Prompt) => {
    const latestRaw = getLatestContent(prompt);
    const vars = getVariables(latestRaw);
    if (vars.length > 0) {
      // Prompt has variables -> Open Engine Modal
      setActivePrompt(prompt);
      setVariableValues({});
    } else {
      // Static Prompt -> 1-Click Copy
      navigator.clipboard.writeText(latestRaw);
      showToast('Copied prompt to clipboard!');
    }
  };

  const compiledText = useMemo(() => {
    if (!activePrompt) return '';
    let text = getLatestContent(activePrompt);
    const vars = getVariables(text);
    vars.forEach(v => {
      const val = variableValues[v] || `{{${v}}}`;
      text = text.replaceAll(`{{${v}}}`, val);
    });
    return text;
  }, [activePrompt, variableValues]);

  const copyFinalPrompt = () => {
    navigator.clipboard.writeText(compiledText);
    setActivePrompt(null);
    showToast('Compiled prompt copied securely.');
  };

  const toggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const prompt = prompts.find(p => p.id === id);
    if (!prompt) return;
    
    // Optimistic UI
    setPrompts(prompts.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
    
    setIsProcessing(true);
    try {
      if (supabase) {
        const { error } = await supabase.from('prompts').update({ is_favorite: !prompt.isFavorite }).eq('id', id);
        if (error) throw error;
      }
    } catch (err: any) {
      showToast(`Error: ${err.message}`, true);
      // Revert optimistic update
      setPrompts(prompts.map(p => p.id === id ? { ...p, isFavorite: prompt.isFavorite } : p));
    } finally {
      setIsProcessing(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewPrompt({ ...newPrompt, tags: newPrompt.tags.filter(t => t !== tagToRemove) });
  };

  const togglePredefinedTag = (tag: string) => {
    if (newPrompt.tags.includes(tag)) {
      removeTag(tag);
    } else {
      setNewPrompt({ ...newPrompt, tags: [...newPrompt.tags, tag] });
    }
  };

  const editPrompt = (prompt: Prompt, e: React.MouseEvent) => {
    e.stopPropagation();
    setNewPrompt({ 
      title: prompt.title, 
      content: prompt.content, 
      tags: prompt.tags,
      versions: prompt.versions || []
    });
    setEditingPromptId(prompt.id);
    setIsAddingPrompt(true);
  };

  const saveNewPrompt = async () => {
    if (!newPrompt.title.trim() || !newPrompt.content.trim()) {
      showToast('Title and content are required.', true);
      return;
    }
    
    setIsProcessing(true);
    try {
      if (editingPromptId) {
        const existingPrompt = prompts.find(p => p.id === editingPromptId);
        if (!existingPrompt) throw new Error("Prompt not found");

        const updated = {
          title: newPrompt.title,
          content: newPrompt.content,
          tags: newPrompt.tags,
          versions: newPrompt.versions.map(v => ({
            ...v,
            createdAt: v.createdAt || new Date().toISOString()
          }))
        };

        if (supabase) {
          const { error } = await supabase.from('prompts').update(updated).eq('id', editingPromptId);
          if (error) throw error;
        }

        setPrompts(current => current.map(p => p.id === editingPromptId ? { ...p, ...updated } : p));
        showToast('Prompt updated successfully.');
        setIsAddingPrompt(false);
        setEditingPromptId(null);
        setNewPrompt({ title: '', content: '', tags: [], versions: [] });
      } else {
        // Optimistic UI for create
        const tempId = Date.now().toString();
        const created: Prompt = {
          id: tempId,
          title: newPrompt.title,
          content: newPrompt.content,
          tags: newPrompt.tags,
          isFavorite: false,
          createdAt: new Date().toISOString(),
          versions: newPrompt.versions.map(v => ({
            ...v,
            createdAt: v.createdAt || new Date().toISOString()
          }))
        };
        setPrompts([created, ...prompts]);
        setIsAddingPrompt(false);
        setNewPrompt({ title: '', content: '', tags: [], versions: [] });

        if (supabase && user) {
          const { data, error } = await supabase.from('prompts').insert({
            user_id: user.id,
            title: created.title,
            content: created.content,
            tags: created.tags,
            is_favorite: false,
            versions: created.versions
          }).select().single();

          if (error) {
            throw error;
          } else if (data) {
            setDbError(null);
            setPrompts(current => current.map(p => p.id === tempId ? { ...p, id: data.id } : p));
            showToast('Prompt saved successfully.');
          }
        }
      }
    } catch (err: any) {
      console.error('Supabase save error:', err);
      setDbError(`Save Error: ${err.message} ${err.code ? `(Code: ${err.code})` : ''} - Check RLS policies or schema.`);
      showToast(`Failed to save prompt: ${err.message}`, true);
      if (!editingPromptId) {
        // We can't revert update easily but we can revert optimistic insert
        setPrompts(current => current.filter(p => !p.id.startsWith(Date.now().toString().slice(0,5))));
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // --- SETUP / CONFIG (Missing API Keys) ---
  if (!supabase) {
    return <SupabaseConfigRequired />;
  }

  // --- DATABASE SETUP REQUIRED ---
  if (dbNeedsSetup) {
    return <DbSetupRequired toast={toast} showToast={showToast} />;
  }

  // --- LOADING STATE ---
  if (isAuthLoading) {
    return (
      <div className="w-full h-screen bg-[#fafafa] dark:bg-[#050505] text-gray-900 dark:text-white flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-t-2 border-r-2 border-cyan-600 dark:border-cyan-400 animate-spin"></div>
      </div>
    );
  }

  // --- AUTH PORTAL (Logged out state) ---
  if (!user) {
    return (
      <AuthScreen 
        isProcessing={isProcessing}
        isSignUp={isSignUp}
        setIsSignUp={setIsSignUp}
        handleAuth={handleAuth}
        toast={toast}
      />
    );
  }

  // --- MAIN WORKSPACE ---
  return (
    <div className="w-full h-screen bg-[#fafafa] dark:bg-[#050505] text-gray-900 dark:text-white font-sans overflow-hidden flex flex-col relative">
      <ProcessingLoader isProcessing={isProcessing} />

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-900/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px]"></div>
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[100px]"></div>
      </div>

      <Header 
        user={user} 
        setIsProfileOpen={setIsProfileOpen} 
        handleLogout={handleLogout} 
        theme={theme}
        toggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
      />

      <div className="flex flex-1 z-10 overflow-hidden">
        <Sidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          allTags={allTags}
          setIsAddingPrompt={setIsAddingPrompt}
          setIsTagManagerOpen={setIsTagManagerOpen}
          toggleTagFilter={toggleTagFilter}
        />

        {/* Main Layout Area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto w-full">
          {/* Mobile Nav Pills */}
          <div className="flex md:hidden gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            <button 
              onClick={() => setIsAddingPrompt(true)}
              className="px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors bg-black/10 dark:hover:bg-white/10 text-gray-900 dark:text-white border border-black/20 dark:border-white/20 flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3 h-3" /> New
            </button>
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${activeTab === 'all' ? 'bg-cyan-600/20 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-600/30 dark:border-cyan-500/30' : 'bg-black/5 dark:bg-white/5 text-gray-600 dark:text-white/60 border border-black/10 dark:border-white/10'}`}
            >
              All
            </button>
            <button 
              onClick={() => setActiveTab('favorites')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${activeTab === 'favorites' ? 'bg-cyan-600/20 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-600/30 dark:border-cyan-500/30' : 'bg-black/5 dark:bg-white/5 text-gray-600 dark:text-white/60 border border-black/10 dark:border-white/10'}`}
            >
              Favorites
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div 
              onClick={() => setOpenCmdk(true)}
              className="flex items-center bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 gap-3 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 hover:border-cyan-600/30 dark:hover:border-cyan-500/30 transition-all shadow-inner flex-1 w-full"
            >
              <Search className="w-4 h-4 text-gray-500 dark:text-white/40 shrink-0" />
              <span className="text-sm text-gray-500 dark:text-white/40 flex-grow truncate">Search prompts or tags...</span>
              <div className="hidden sm:flex gap-1 items-center shrink-0 ml-auto">
                <kbd className="bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded text-[10px] text-gray-600 dark:text-white/60">⌘</kbd>
                <kbd className="bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded text-[10px] text-gray-600 dark:text-white/60">K</kbd>
              </div>
            </div>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="w-11 h-11 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/40 hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center transition-colors text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white shrink-0 relative"
              title="Filters & Options"
            >
              <Filter className="w-5 h-5" />
              {selectedTags.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-600 dark:bg-cyan-500 rounded-full border border-black"></span>
              )}
            </button>
          </div>

          <DbErrorAlert error={dbError} />

          {filteredPrompts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60 px-4">
              <div className="w-16 h-16 rounded-full bg-black/5 dark:hover:bg-white/5 flex items-center justify-center mb-4 border border-black/10 dark:border-white/10">
                <Search className="w-6 h-6 text-gray-500 dark:text-white/40" />
              </div>
              <p className="text-gray-800 dark:text-white/80 font-medium">No prompts found.</p>
              <p className="text-gray-500 dark:text-white/40 text-sm mt-1 max-w-[250px] mx-auto text-balance">Try adjusting your filters or creating a new prompt.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pb-20 sm:pb-0">
              {filteredPrompts.map((prompt, i) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  index={i}
                  hasVariables={getVariables(getLatestContent(prompt)).length > 0}
                  onDelete={deletePrompt}
                  onToggleFavorite={toggleFavorite}
                  onCopyAction={handleCopyAction}
                  onEdit={editPrompt}
                  onViewHistory={(p, e) => { e.stopPropagation(); setViewingHistoryPrompt(p); }}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <VersionHistoryModal 
        isOpen={!!viewingHistoryPrompt}
        onClose={() => setViewingHistoryPrompt(null)}
        prompt={viewingHistoryPrompt}
        onCopyAction={(promptToCopy) => {
          handleCopyAction(promptToCopy);
        }}
      />

      <AddPromptModal 
        isOpen={isAddingPrompt}
        isEditing={!!editingPromptId}
        onClose={() => {
          setIsAddingPrompt(false);
          setEditingPromptId(null);
          setNewPrompt({ title: '', content: '', tags: [], versions: [] });
        }}
        newPrompt={newPrompt}
        setNewPrompt={setNewPrompt as any}
        allTags={allTags}
        togglePredefinedTag={togglePredefinedTag}
        saveNewPrompt={saveNewPrompt}
        openTagManager={() => setIsTagManagerOpen(true)}
      />

      <CompilerModal 
        activePrompt={activePrompt}
        setActivePrompt={setActivePrompt}
        variableValues={variableValues}
        setVariableValues={setVariableValues}
        copyFinalPrompt={copyFinalPrompt}
      />

      <CommandPalette 
        open={openCmdk}
        setOpen={setOpenCmdk}
        prompts={prompts}
        onSelectPrompt={handleCopyAction}
      />

      <Toast toast={toast} />

      <div className="fixed bottom-6 right-6 flex items-center gap-3 px-4 py-2 bg-black/5 dark:bg-black/40 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-full text-xs text-gray-500 dark:text-white/50 shadow-lg pointer-events-none hidden lg:flex">
        <span>Quick action</span>
        <div className="flex gap-1">
          <kbd className="px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10 shadow-sm text-gray-900 dark:text-white font-sans">⌘</kbd>
          <kbd className="px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10 shadow-sm text-gray-900 dark:text-white font-sans">K</kbd>
        </div>
      </div>

      <ProfileModal 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profileName={profileName}
        setProfileName={setProfileName}
        profileImage={profileImage}
        setProfileImage={setProfileImage}
        setProfileImageFile={setProfileImageFile}
        updateProfile={updateProfile}
        isProcessing={isProcessing}
      />

      <FilterModal 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        sortBy={sortBy}
        setSortBy={setSortBy}
        allTags={allTags}
        selectedTags={selectedTags}
        toggleTagFilter={toggleTagFilter}
        setSelectedTags={setSelectedTags}
        openTagManager={() => setIsTagManagerOpen(true)}
      />

      <TagManagerModal 
        isOpen={isTagManagerOpen}
        onClose={() => setIsTagManagerOpen(false)}
        allTags={allTags}
        newTagInput={newTagInput}
        setNewTagInput={setNewTagInput}
        handleCreateTag={handleCreateTag}
        handleDeleteTag={handleDeleteTag}
        isProcessing={isProcessing}
      />

      <ConfirmDialog 
        dialog={confirmDialog}
        onClose={() => setConfirmDialog(null)}
      />

    </div>
  );
}
