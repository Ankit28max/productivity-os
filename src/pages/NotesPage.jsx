import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePlus, HiOutlineDocumentText } from 'react-icons/hi';
import { useNotes } from '../context/NoteContext';
import NoteCard from '../components/notes/NoteCard';
import NoteFilters from '../components/notes/NoteFilters';
import NoteModal from '../components/notes/NoteModal';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonList } from '../components/ui/Skeleton';

export default function NotesPage() {
  const { notes, isLoading, createNote, updateNote, deleteNote, togglePin, toggleArchive } = useNotes();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  // Filters state
  const [search, setSearch] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [selectedTag, setSelectedTag] = useState('all');

  // Derive list of unique tags from all active/archived notes
  const tags = useMemo(() => {
    const allTags = notes
      .filter((n) => n.isArchived === showArchived)
      .flatMap((n) => n.tags || [])
      .filter(Boolean);
    return Array.from(new Set(allTags));
  }, [notes, showArchived]);

  // Modal actions
  const handleOpenCreateModal = () => {
    setSelectedNote(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (formData) => {
    if (selectedNote) {
      updateNote(selectedNote.id, formData);
    } else {
      createNote(formData);
    }
  };

  // Filter & Sort notes
  const processedNotes = useMemo(() => {
    return notes
      .filter((note) => {
        const matchesArchive = note.isArchived === showArchived;
        const matchesSearch =
          note.title.toLowerCase().includes(search.toLowerCase()) ||
          note.content.toLowerCase().includes(search.toLowerCase());
        const matchesTag = selectedTag === 'all' || (note.tags && note.tags.includes(selectedTag));

        return matchesArchive && matchesSearch && matchesTag;
      })
      .sort((a, b) => {
        // Pin priority logic
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        // Otherwise latest updated first
        return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
      });
  }, [notes, showArchived, search, selectedTag]);

  // Separate pinned vs active notes for cleaner headings on dashboard-style view
  const pinnedNotes = useMemo(() => processedNotes.filter((n) => n.isPinned), [processedNotes]);
  const otherNotes = useMemo(() => processedNotes.filter((n) => !n.isPinned), [processedNotes]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-[1400px]"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">Notes</h1>
          <p className="text-xs text-text-muted mt-0.5 font-medium">
            Keep track of architectural design, lists, or notes backed by Gemini summaries.
          </p>
        </div>
        <Button variant="gradient" size="sm" icon={HiOutlinePlus} onClick={handleOpenCreateModal}>
          New Note
        </Button>
      </div>

      {/* Filters */}
      <Card padding="sm" variant="surface">
        <NoteFilters
          search={search}
          setSearch={setSearch}
          showArchived={showArchived}
          setShowArchived={setShowArchived}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          tags={tags}
        />
      </Card>

      {/* Content layout */}
      {isLoading ? (
        <div className="py-8">
          <SkeletonList count={3} />
        </div>
      ) : processedNotes.length === 0 ? (
        <Card variant="default" className="py-12">
          <EmptyState
            icon={HiOutlineDocumentText}
            title={search || selectedTag !== 'all' ? 'No matching notes' : 'Notes is empty'}
            description={
              search || selectedTag !== 'all'
                ? 'Try adjusting tags or search term parameters.'
                : showArchived
                ? 'No notes archived yet.'
                : 'Click New Note to start journaling or jotting ideas.'
            }
            action={
              search || selectedTag !== 'all' ? (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearch('');
                    setSelectedTag('all');
                  }}
                >
                  Clear Filters
                </Button>
              ) : !showArchived ? (
                <Button variant="gradient" icon={HiOutlinePlus} onClick={handleOpenCreateModal}>
                  Create Note
                </Button>
              ) : null
            }
          />
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Pinned section header */}
          {pinnedNotes.length > 0 && (
            <div className="space-y-3.5">
              <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest block pl-1.5">
                📌 Pinned Notes
              </span>
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {pinnedNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onEdit={handleOpenEditModal}
                      onDelete={deleteNote}
                      onPin={togglePin}
                      onArchive={toggleArchive}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          )}

          {/* Regular section header */}
          {otherNotes.length > 0 && (
            <div className="space-y-3.5">
              {pinnedNotes.length > 0 && (
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block pl-1.5 pt-2">
                  🗒 Notes
                </span>
              )}
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {otherNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onEdit={handleOpenEditModal}
                      onDelete={deleteNote}
                      onPin={togglePin}
                      onArchive={toggleArchive}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </div>
      )}

      {/* Edit/Create Note modal wrapper */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        note={selectedNote}
        onSubmit={handleModalSubmit}
      />
    </motion.div>
  );
}
