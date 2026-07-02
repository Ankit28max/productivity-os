import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { HiOutlineSparkles, HiOutlineBookOpen, HiOutlineChevronRight } from 'react-icons/hi';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useNotes } from '../../context/NoteContext';

export default function NoteModal({ isOpen, onClose, note, onSubmit }) {
  const isEditMode = !!note;
  const { summarizeNoteAI, generateFlashcardsAI } = useNotes();

  // AI states
  const [aiSummary, setAiSummary] = useState('');
  const [aiFlashcards, setAiFlashcards] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Reset form when note or modal opens
  useEffect(() => {
    if (isOpen) {
      setAiSummary('');
      setAiFlashcards(null);
      if (note) {
        reset({
          title: note.title,
          content: note.content || '',
          tags: note.tags ? note.tags.join(', ') : '',
        });
      } else {
        reset({
          title: '',
          content: '',
          tags: '',
        });
      }
    }
  }, [isOpen, note, reset]);

  const onFormSubmit = (data) => {
    const formattedTags = data.tags
      ? data.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    onSubmit({
      title: data.title,
      content: data.content,
      tags: formattedTags,
    });
    onClose();
  };

  // AI Actions handlers
  const handleSummarize = async () => {
    if (!note) return;
    setIsAiLoading(true);
    try {
      const summary = await summarizeNoteAI(note.id);
      setAiSummary(summary);
      setAiFlashcards(null); // clear other AI outputs
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleFlashcards = async () => {
    if (!note) return;
    setIsAiLoading(true);
    try {
      const cards = await generateFlashcardsAI(note.id);
      setAiFlashcards(cards);
      setAiSummary(''); // clear other AI outputs
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'View & Edit Note' : 'Create New Note'}
      size={isEditMode ? 'xl' : 'md'}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1">
        {/* Editor Form Column */}
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className={`space-y-4 ${isEditMode ? 'lg:col-span-7' : 'lg:col-span-12'}`}
        >
          <Input
            label="Title"
            placeholder="Note title..."
            error={errors.title?.message}
            {...register('title', {
              required: 'Note title is required',
            })}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Content</label>
            <textarea
              rows={8}
              placeholder="Start writing notes (markdown supported)..."
              className="w-full rounded-xl glass-input px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-all duration-250 hover:border-white/12 focus:outline-none focus:border-primary-500/40 focus:ring-1 focus:ring-primary-500/20 font-sans resize-none"
              {...register('content')}
            />
          </div>

          <Input
            label="Tags"
            placeholder="Work, Personal, Development (comma separated)"
            {...register('tags')}
          />

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/[0.04]">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient">
              {isEditMode ? 'Save Note' : 'Create Note'}
            </Button>
          </div>
        </form>

        {/* AI Actions Sidebar Column (Only visible in edit mode) */}
        {isEditMode && (
          <div className="lg:col-span-5 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l border-white/[0.05] pt-4 lg:pt-0 lg:pl-5">
            <div className="flex items-center gap-2 mb-1">
              <HiOutlineSparkles className="h-4 w-4 text-primary-400" />
              <h3 className="text-sm font-bold text-text-primary tracking-tight">Gemini AI Assistant</h3>
            </div>

            {/* AI Action trigger triggers */}
            <div className="grid grid-cols-2 gap-2 shrink-0">
              <Button
                type="button"
                variant="neon"
                size="sm"
                icon={HiOutlineSparkles}
                onClick={handleSummarize}
                disabled={isAiLoading}
              >
                Summarize
              </Button>
              <Button
                type="button"
                variant="neon"
                size="sm"
                icon={HiOutlineBookOpen}
                onClick={handleFlashcards}
                disabled={isAiLoading}
              >
                Flashcards
              </Button>
            </div>

            {/* AI Results Output panel */}
            <div className="flex-1 min-h-[220px] rounded-xl glass-input p-4 overflow-y-auto max-h-[300px]">
              {isAiLoading ? (
                <div className="h-full flex flex-col items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-primary-500" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <p className="text-[11px] text-text-muted">Gemini is processing...</p>
                </div>
              ) : aiSummary ? (
                <div className="space-y-2 text-xs leading-relaxed text-text-secondary">
                  <h4 className="font-bold text-text-primary text-xs flex items-center gap-1.5 mb-2.5">
                    <HiOutlineSparkles className="h-3.5 w-3.5 text-primary-400" />
                    AI Summary
                  </h4>
                  <p className="whitespace-pre-wrap">{aiSummary}</p>
                </div>
              ) : aiFlashcards ? (
                <div className="space-y-3">
                  <h4 className="font-bold text-text-primary text-xs flex items-center gap-1.5 mb-2">
                    <HiOutlineBookOpen className="h-3.5 w-3.5 text-accent-400" />
                    AI Flashcards
                  </h4>
                  {aiFlashcards.map((card, idx) => (
                    <Card key={idx} padding="sm" variant="surface" className="text-[11px]">
                      <p className="font-semibold text-text-primary">Q: {card.q}</p>
                      <p className="text-text-secondary mt-1.5 pl-2 border-l border-white/[0.06] flex items-center gap-1">
                        <HiOutlineChevronRight className="h-2.5 w-2.5 text-accent-400 shrink-0" />
                        {card.a}
                      </p>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-3">
                  <HiOutlineSparkles className="h-6 w-6 text-text-muted mb-2" />
                  <p className="text-[11px] text-text-muted leading-normal">
                    Select an AI action above to summarize notes or generate flashcards instantly.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
