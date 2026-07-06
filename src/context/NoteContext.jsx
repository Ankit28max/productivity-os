import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { generateId } from '../utils/helpers';
import toast from 'react-hot-toast';

import { summarizeNote, generateFlashcards } from '../services/ai.service';

const NoteContext = createContext(null);

const STORAGE_KEY = 'productivityos_notes';

const DEFAULT_NOTES = [];

export function NoteProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setNotes(JSON.parse(stored));
      } catch (err) {
        setNotes(DEFAULT_NOTES);
      }
    } else {
      setNotes(DEFAULT_NOTES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_NOTES));
    }
    setIsLoading(false);
  }, []);

  const saveNotes = (newNotes) => {
    setNotes(newNotes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotes));
  };

  const createNote = useCallback((noteData) => {
    const newNote = {
      id: `note-${generateId()}`,
      title: noteData.title || 'Untitled Note',
      content: noteData.content || '',
      tags: noteData.tags || [],
      isPinned: noteData.isPinned || false,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveNotes([newNote, ...notes]);
    toast.success('Note created successfully');
    return newNote;
  }, [notes]);

  const updateNote = useCallback((id, updates) => {
    const updatedNotes = notes.map((note) => {
      if (note.id === id) {
        return {
          ...note,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      return note;
    });
    saveNotes(updatedNotes);
  }, [notes]);

  const deleteNote = useCallback((id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    saveNotes(updatedNotes);
    toast.success('Note deleted');
  }, [notes]);

  const togglePin = useCallback((id) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    updateNote(id, { isPinned: !note.isPinned });
    toast.success(note.isPinned ? 'Note unpinned' : 'Note pinned');
  }, [notes, updateNote]);

  const toggleArchive = useCallback((id) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    updateNote(id, { isArchived: !note.isArchived, isPinned: false });
    toast.success(note.isArchived ? 'Note restored' : 'Note archived');
  }, [notes, updateNote]);

  // Live Gemini integration mapped here
  const summarizeNoteAI = useCallback(async (id) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    
    toast.loading('AI is reading and summarizing your note...', { id: 'ai-summary' });
    try {
      const summary = await summarizeNote(note.title, note.content);
      toast.success('AI Summary Generated!', { id: 'ai-summary' });
      return summary;
    } catch (error) {
      toast.error('Failed to generate AI Summary', { id: 'ai-summary' });
    }
  }, [notes]);

  const generateFlashcardsAI = useCallback(async (id) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;

    toast.loading('AI is generating flashcards...', { id: 'ai-flash' });
    try {
      const results = await generateFlashcards(note.title, note.content);
      const mapped = results.map((item) => ({
        q: item.question || item.q,
        a: item.answer || item.a
      }));
      toast.success(`Generated ${mapped.length} Flashcards!`, { id: 'ai-flash' });
      return mapped;
    } catch (error) {
      toast.error('Failed to generate Flashcards', { id: 'ai-flash' });
    }
  }, [notes]);

  const value = {
    notes,
    isLoading,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    toggleArchive,
    summarizeNoteAI,
    generateFlashcardsAI,
  };

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
}

export function useNotes() {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('useNotes must be used within a NoteProvider');
  }
  return context;
}
