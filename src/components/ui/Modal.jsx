import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineX } from 'react-icons/hi';
import { cn } from '../../utils/cn';

const sizeMap = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[90vw]',
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true,
  className,
}) {
  const overlayRef = useRef(null);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className={cn(
              'w-full rounded-2xl bg-surface-800 border border-border-default shadow-2xl shadow-black/40',
              sizeMap[size],
              className
            )}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {(title || showClose) && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-border-default">
                {title && (
                  <h2 className="text-lg font-semibold text-text-primary">
                    {title}
                  </h2>
                )}
                {showClose && (
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-700 transition-colors"
                  >
                    <HiOutlineX className="h-5 w-5" />
                  </button>
                )}
              </div>
            )}
            <div className="px-6 py-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
