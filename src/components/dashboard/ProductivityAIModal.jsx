import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineX, HiOutlineSparkles, HiOutlineTrendingUp, HiOutlineLightBulb, HiOutlineCheckCircle } from 'react-icons/hi';
import { generateProductivityAnalysis } from '../../services/ai.service';
import Button from '../ui/Button';

export default function ProductivityAIModal({ isOpen, onClose, stats }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const runAnalysis = async () => {
      setLoading(true);
      try {
        const result = await generateProductivityAnalysis(stats);
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    runAnalysis();
  }, [isOpen, stats]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', stiffness: 350, damping: 26 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.06] bg-surface-950 p-6 shadow-2xl z-10 glass-surface"
          >
            {/* Background ambient glow */}
            <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.04] mb-5 relative z-10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400">
                  <HiOutlineSparkles className="h-4 w-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">AI Performance Audit</h3>
                  <p className="text-[10px] text-text-muted">Gemini cognitive telemetry review</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                <HiOutlineX className="h-4 w-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="relative z-10">
              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="relative flex items-center justify-center h-20 w-20">
                    {/* Ring pings */}
                    <div className="absolute inset-0 rounded-full border border-orange-500/20 animate-ping" style={{ animationDuration: '2s' }} />
                    <div className="absolute inset-2 rounded-full border border-violet-500/20 animate-ping" style={{ animationDuration: '2.5s' }} />
                    <div className="h-12 w-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 animate-spin" style={{ animationDuration: '6s' }}>
                      <HiOutlineSparkles className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-primary animate-pulse">Running diagnostic checkups...</p>
                    <p className="text-[10px] text-text-muted mt-1 font-mono">analyzing tasks, sleep indices, hydration logs</p>
                  </div>
                </div>
              ) : data ? (
                <div className="space-y-5">
                  {/* Top Stats Overview */}
                  <div className="flex items-center gap-4 bg-white/[0.01] border border-white/[0.03] p-4 rounded-xl">
                    {/* Pulsing circular score indicator */}
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-500/15 to-violet-500/15 border border-orange-500/20 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(234,88,12,0.15)] shrink-0">
                      <span className="text-lg font-black text-orange-400 tracking-tighter">{data.score}%</span>
                      <span className="text-[7px] font-bold text-text-muted uppercase tracking-widest leading-none">Score</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-text-primary uppercase tracking-wider">AI Executive Index</h4>
                      <p className="text-[10px] text-text-muted mt-0.5 leading-relaxed">
                        Evaluated across {stats.tasksTotal} task entries, today's habit check-ins, and wellness routines.
                      </p>
                    </div>
                  </div>

                  {/* Critique Section */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-extrabold text-text-muted uppercase tracking-widest flex items-center gap-1.5 pl-0.5">
                      <HiOutlineTrendingUp className="h-3 w-3 text-orange-400" />
                      Critical Diagnostics
                    </span>
                    <p className="text-xs text-text-secondary leading-relaxed bg-surface-900/40 p-3.5 rounded-xl border border-white/[0.02]">
                      {data.analysis}
                    </p>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-extrabold text-text-muted uppercase tracking-widest flex items-center gap-1.5 pl-0.5">
                      <HiOutlineLightBulb className="h-3.5 w-3.5 text-lime-400" />
                      Action Checklist Tomorrow
                    </span>
                    <ul className="space-y-2">
                      {data.recommendations?.map((rec, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.15 }}
                          className="flex items-start gap-2.5 text-xs text-text-secondary bg-white/[0.01] border border-white/[0.02] p-3 rounded-xl hover:border-white/5 transition-colors"
                        >
                          <HiOutlineCheckCircle className="h-4 w-4 text-lime-400 mt-0.5 shrink-0" />
                          <span className="leading-relaxed">{rec}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer button */}
                  <div className="pt-2 flex justify-end">
                    <Button size="sm" variant="gradient" onClick={onClose} className="text-xs">
                      Acknowledge Advice
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-text-muted italic">
                  Could not compile diagnostics. Try logging steps or checking off tasks first.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
