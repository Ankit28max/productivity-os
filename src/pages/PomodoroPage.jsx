import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineClock, HiOutlinePlay, HiOutlinePause, HiOutlineRefresh } from 'react-icons/hi';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const MODES = [
  { label: 'Focus', minutes: 25, color: 'cyan' },
  { label: 'Short Break', minutes: 5, color: 'lime' },
  { label: 'Long Break', minutes: 15, color: 'violet' },
];

export default function PomodoroPage() {
  const [modeIndex, setModeIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MODES[0].minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef(null);

  const mode = MODES[modeIndex];
  const totalSeconds = mode.minutes * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const tick = useCallback(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        setIsRunning(false);
        clearInterval(intervalRef.current);
        if (modeIndex === 0) setSessions((s) => s + 1);
        return 0;
      }
      return prev - 1;
    });
  }, [modeIndex]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(tick, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, tick]);

  const handleModeChange = (index) => {
    setModeIndex(index);
    setTimeLeft(MODES[index].minutes * 60);
    setIsRunning(false);
    clearInterval(intervalRef.current);
  };

  const handleReset = () => {
    setTimeLeft(mode.minutes * 60);
    setIsRunning(false);
    clearInterval(intervalRef.current);
  };

  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const colorMap = {
    cyan: { stroke: '#ea580c', bg: 'rgba(234, 88, 12, 0.04)', glow: 'rgba(234, 88, 12, 0.3)' },
    lime: { stroke: '#f59e0b', bg: 'rgba(245, 158, 11, 0.04)', glow: 'rgba(245, 158, 11, 0.3)' },
    violet: { stroke: '#d97706', bg: 'rgba(217, 119, 6, 0.04)', glow: 'rgba(217, 119, 6, 0.3)' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div className="text-center">
        <h1 className="text-xl font-bold text-text-primary">Pomodoro Timer</h1>
        <p className="text-sm text-text-secondary mt-0.5">Stay focused with timed work sessions</p>
      </div>

      {/* Mode Selector */}
      <div className="flex items-center justify-center gap-2">
        {MODES.map((m, i) => (
          <button
            key={m.label}
            onClick={() => handleModeChange(i)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              i === modeIndex
                ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20 shadow-[0_0_15px_rgba(6,182,212,0.06)]'
                : 'text-text-secondary border border-transparent hover:bg-white/[0.03] hover:text-text-primary'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Timer */}
      <Card className="flex flex-col items-center py-12 relative overflow-hidden" variant="neon">
        <div className="absolute inset-0 pointer-events-none opacity-30 blur-[60px]" style={{
          background: `radial-gradient(circle, ${colorMap[mode.color].glow} 0%, transparent 65%)`
        }} />
        <div className="relative mb-10">
          <svg width="280" height="280" viewBox="0 0 280 280">
            <circle
              cx="140" cy="140" r="120"
              fill="none"
              stroke="rgba(255, 255, 255, 0.03)"
              strokeWidth="8"
            />
            <circle
              cx="140" cy="140" r="120"
              fill="none"
              stroke={colorMap[mode.color].stroke}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 140 140)"
              className="transition-all duration-1000 ease-linear"
              style={{ filter: `drop-shadow(0 0 8px ${colorMap[mode.color].stroke}80)` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-text-primary tabular-nums tracking-tight">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-xs font-semibold text-text-muted mt-2 uppercase tracking-widest">{mode.label}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Button
            variant={isRunning ? 'secondary' : 'neon'}
            size="lg"
            icon={isRunning ? HiOutlinePause : HiOutlinePlay}
            onClick={() => setIsRunning(!isRunning)}
            className="w-32"
          >
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button variant="ghost" size="lg" icon={HiOutlineRefresh} onClick={handleReset}>
            Reset
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center hover:border-primary-500/20 transition-all duration-300" hover>
          <p className="text-2xl font-bold text-primary-400">{sessions}</p>
          <p className="text-xs text-text-muted mt-1 font-medium">Sessions Today</p>
        </Card>
        <Card className="text-center hover:border-accent-500/20 transition-all duration-300" hover>
          <p className="text-2xl font-bold text-accent-400">{Math.round(sessions * 25 / 60 * 10) / 10}h</p>
          <p className="text-xs text-text-muted mt-1 font-medium">Focus Time</p>
        </Card>
        <Card className="text-center hover:border-secondary-500/20 transition-all duration-300" hover>
          <p className="text-2xl font-bold text-secondary-400">🔥</p>
          <p className="text-xs text-text-muted mt-1 font-medium">Daily Streak</p>
        </Card>
      </div>
    </motion.div>
  );
}
