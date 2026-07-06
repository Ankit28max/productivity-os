import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { summarizeNote, generateFlashcards } from '../services/ai.service';
import { useAuth } from './AuthContext';

const NoteContext = createContext(null);

export function NoteProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Load notes from database
  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/notes');
      if (res.success && res.notes) {
        setNotes(res.notes);
      }
    } catch (err) {
      console.error('Error fetching notes:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotes();
    } else {
      setNotes([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchNotes]);

  const createNote = useCallback(async (noteData) => {
    try {
      const res = await api.post('/notes', noteData);
      if (res.success && res.note) {
        setNotes((prev) => [res.note, ...prev]);
        toast.success('Note created');
        return res.note;
      }
    } catch (err) {
      toast.error(err.message || 'Error creating note');
      throw err;
    }
  }, []);

  const updateNote = useCallback(async (id, updates) => {
    try {
      const res = await api.put(`/notes/${id}`, updates);
      if (res.success && res.note) {
        setNotes((prev) => prev.map((n) => (n._id === id || n.id === id ? res.note : n)));
        return res.note;
      }
    } catch (err) {
      toast.error(err.message || 'Error updating note');
      throw err;
    }
  }, []);

  const deleteNote = useCallback(async (id) => {
    try {
      const res = await api.delete(`/notes/${id}`);
      if (res.success) {
        setNotes((prev) => prev.filter((n) => n._id !== id && n.id !== id));
        toast.success('Note deleted');
      }
    } catch (err) {
      toast.error(err.message || 'Error deleting note');
      throw err;
    }
  }, []);

  const togglePin = useCallback(async (id) => {
    const note = notes.find((n) => n._id === id || n.id === id);
    if (!note) return;
    try {
      const updated = await updateNote(id, { isPinned: !note.isPinned });
      if (updated) {
        toast.success(updated.isPinned ? 'Note pinned' : 'Note unpinned');
      }
    } catch (err) {
      console.error('Error toggling note pin:', err);
    }
  }, [notes, updateNote]);

  const toggleArchive = useCallback(async (id) => {
    const note = notes.find((n) => n._id === id || n.id === id);
    if (!note) return;
    try {
      const updated = await updateNote(id, { isArchived: !note.isArchived, isPinned: false });
      if (updated) {
        toast.success(updated.isArchived ? 'Note archived' : 'Note restored');
      }
    } catch (err) {
      console.error('Error toggling note archive:', err);
    }
  }, [notes, updateNote]);

  // Live Gemini integration mapped here
  const summarizeNoteAI = useCallback(async (id) => {
    const note = notes.find((n) => n._id === id || n.id === id);
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
    const note = notes.find((n) => n._id === id || n.id === id);
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
