import { motion } from 'framer-motion';
import { HiOutlineDocumentText } from 'react-icons/hi';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';

export default function NotesPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Notes</h1>
          <p className="text-sm text-text-secondary mt-0.5">Capture your thoughts and ideas</p>
        </div>
        <Button icon={HiOutlineDocumentText}>New Note</Button>
      </div>
      <Card>
        <EmptyState
          icon={HiOutlineDocumentText}
          title="No notes yet"
          description="Start writing your first note. Supports rich text and AI-powered summaries."
          action={<Button icon={HiOutlineDocumentText}>Create Note</Button>}
        />
      </Card>
    </motion.div>
  );
}
