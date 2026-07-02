import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { generateId } from '../utils/helpers';
import toast from 'react-hot-toast';

const NoteContext = createContext(null);

const STORAGE_KEY = 'productivityos_notes';

const DEFAULT_NOTES = [
  {
    id: 'n-1',
    title: 'ProductivityOS Project Architecture',
    content: '## Frontend Tech Stack\n- React 19 + Vite\n- Tailwind CSS v4\n- Framer Motion\n- Recharts\n\n## Backend Tech Stack\n- Node.js + Express\n- MongoDB + Mongoose\n\nUse standard MVC pattern and modular folder structure.',
    tags: ['Work', 'Architecture'],
    isPinned: true,
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'n-2',
    title: 'Weekly Grocery List',
    content: '- Spinach & Kale\n- Almond Milk\n- Avocados\n- Greek Yogurt\n- Protein powder (vanilla)',
    tags: ['Personal', 'Health'],
    isPinned: false,
    isArchived: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

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

  // Mock AI summary features (Gemini integration will be mapped to this)
  const summarizeNoteAI = useCallback(async (id) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    
    toast.loading('AI is reading and summarizing your note...', { id: 'ai-summary' });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const summary = `### AI Summary of: ${note.title}\n\nThe note covers structural tech stack highlights including React 19, Tailwind CSS v4, and Node.js. It details database schemas and setup specifications for folders in the MVC architecture.`;
    
    toast.success('AI Summary Generated!', { id: 'ai-summary' });
    return summary;
  }, [notes]);

  const generateFlashcardsAI = useCallback(async (id) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;

    toast.loading('AI is generating flashcards...', { id: 'ai-flash' });
    await new Promise((resolve) => setTimeout(resolve, 1800));

    const flashcards = [
      { q: 'What is the frontend framework version?', a: 'React 19' },
      { q: 'What database collection adapter is used?', a: 'Mongoose' },
      { q: 'What folder houses API controllers?', a: 'server/controllers/' },
    ];

    toast.success('Generated 3 Flashcards!', { id: 'ai-flash' });
    return flashcards;
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
