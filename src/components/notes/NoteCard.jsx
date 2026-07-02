import { motion } from 'framer-motion';
import { HiOutlineArchive, HiOutlineTrash, HiTag } from 'react-icons/hi';
import { BsPinAngle, BsPinAngleFill } from 'react-icons/bs';
import Card from '../ui/Card';
import { formatDate } from '../../utils/helpers';

export default function NoteCard({ note, onEdit, onDelete, onPin, onArchive }) {
  // Strip Markdown characters for the card text preview
  const getPreviewText = (text = '') => {
    return text
      .replace(/[#*`_-]/g, '') // remove markdown symbols
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // remove links but keep text
      .trim();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`group flex flex-col h-56 justify-between transition-all duration-300 relative ${
          note.isPinned ? 'border-primary-500/20 shadow-[0_0_20px_rgba(6,182,212,0.04)]' : ''
        }`}
        hover
        onClick={() => onEdit(note)}
      >
        <div>
          {/* Header Row */}
          <div className="flex items-start justify-between gap-2.5 mb-2.5">
            <h4 className="text-sm font-semibold text-text-primary group-hover:text-primary-400 transition-colors line-clamp-1">
              {note.title || 'Untitled Note'}
            </h4>
            
            {/* Quick Pin Action */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPin(note.id);
              }}
              className={`p-1.5 rounded-lg hover:bg-white/5 transition-all shrink-0 ${
                note.isPinned ? 'text-primary-400' : 'text-text-muted opacity-0 group-hover:opacity-100'
              }`}
              title={note.isPinned ? 'Unpin Note' : 'Pin Note'}
            >
              {note.isPinned ? <BsPinAngleFill className="h-4 w-4" /> : <BsPinAngle className="h-4 w-4" />}
            </button>
          </div>

          {/* Preview Content */}
          <p className="text-xs text-text-secondary line-clamp-4 leading-relaxed whitespace-pre-line">
            {getPreviewText(note.content) || 'No additional text'}
          </p>
        </div>

        {/* Footer info & Hover Actions */}
        <div className="flex items-center justify-between border-t border-white/[0.03] pt-3 mt-4 shrink-0">
          <span className="text-[10px] text-text-muted font-medium">
            {formatDate(note.updatedAt || note.createdAt)}
          </span>

          {/* Tags */}
          <div className="flex items-center gap-1 max-w-[50%] overflow-hidden">
            {note.tags && note.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-primary-400 bg-primary-500/10 px-1.5 py-0.5 rounded-md truncate"
              >
                <HiTag className="h-2 w-2 shrink-0" />
                {tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onArchive(note.id);
              }}
              className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors"
              title={note.isArchived ? 'Unarchive Note' : 'Archive Note'}
            >
              <HiOutlineArchive className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              className="p-1.5 rounded-lg hover:bg-danger-500/10 text-text-muted hover:text-danger-400 transition-colors"
              title="Delete Note"
            >
              <HiOutlineTrash className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
