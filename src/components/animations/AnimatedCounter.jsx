import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * AnimatedCounter — smoothly counts up from 0 to the target value.
 *
 * Props:
 *  - value: number — target value
 *  - duration: number — animation duration in ms (default 1200)
 *  - suffix: string — suffix to append (e.g. '%', 'd', ' hrs')
 *  - prefix: string — prefix to prepend (e.g. '$')
 *  - decimals: number — decimal places (default 0)
 *  - className: string
 */
export default function AnimatedCounter({
  value,
  duration = 1200,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = '',
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!isInView || hasStarted.current) return;
    hasStarted.current = true;

    const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * numValue;

      setDisplay(current);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }, [isInView, value, duration]);

  const formatted = decimals > 0 ? display.toFixed(decimals) : Math.round(display);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {prefix}{formatted}{suffix}
    </motion.span>
  );
}
