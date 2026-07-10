import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ConfettiBurst — renders a small confetti explosion at the trigger point.
 * Completely self-contained — just toggle `active` to fire.
 */
const PARTICLE_COUNT = 12;
const COLORS = ['#f97316', '#f59e0b', '#84cc16', '#06b6d4', '#a855f7', '#ec4899'];

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

export default function ConfettiBurst({ active }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!active) return;
    const newParticles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: `${Date.now()}-${i}`,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      x: randomRange(-60, 60),
      y: randomRange(-80, -20),
      rotate: randomRange(-180, 180),
      scale: randomRange(0.4, 1),
      size: randomRange(4, 8),
    }));
    setParticles(newParticles);

    const timer = setTimeout(() => setParticles([]), 800);
    return () => clearTimeout(timer);
  }, [active]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-50">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              opacity: 1,
              x: 0,
              y: 0,
              scale: 0,
              rotate: 0,
            }}
            animate={{
              opacity: [1, 1, 0],
              x: p.x,
              y: p.y,
              scale: p.scale,
              rotate: p.rotate,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute top-1/2 left-1/2 rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: `0 0 6px ${p.color}60`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * useConfetti — hook to trigger confetti bursts.
 *
 * Usage:
 *   const { fire, isActive } = useConfetti();
 *   // In handler: fire();
 *   // In JSX: <ConfettiBurst active={isActive} />
 */
export function useConfetti() {
  const [isActive, setIsActive] = useState(false);

  const fire = useCallback(() => {
    setIsActive(false);
    // Force re-trigger on next tick
    requestAnimationFrame(() => setIsActive(true));
  }, []);

  return { fire, isActive };
}
