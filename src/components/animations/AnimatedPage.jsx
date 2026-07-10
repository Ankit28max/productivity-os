import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

/**
 * AnimatedPage — wraps page content with smooth enter/exit animations.
 * Use in DashboardLayout to animate route transitions.
 */
const pageVariants = {
  initial: {
    opacity: 0,
    y: 14,
    scale: 0.995,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1], // custom cubic-bezier for a snappy feel
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.995,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

export default function AnimatedPage({ children }) {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger container + item variants — use for lists of cards.
 *
 * Usage:
 *   <motion.div variants={staggerContainer} initial="hidden" animate="show">
 *     {items.map(item => <motion.div key={item.id} variants={staggerItem}>...</motion.div>)}
 *   </motion.div>
 */
export const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/**
 * Fade-in on scroll — use with whileInView.
 *
 * Usage:
 *   <motion.div {...scrollFadeIn}>content</motion.div>
 */
export const scrollFadeIn = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

/**
 * Scale pop — for buttons and interactive elements on click.
 */
export const tapScale = {
  whileTap: { scale: 0.96 },
  transition: { type: 'spring', stiffness: 400, damping: 17 },
};

/**
 * Hover lift — gentle float on hover.
 */
export const hoverLift = {
  whileHover: { y: -3, transition: { duration: 0.2 } },
};
