import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineClock, HiOutlinePlay, HiOutlinePause, HiOutlineRefresh } from 'react-icons/hi';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const MODES = [
  { label: 'Focus', minutes: 25, color: 'primary' },
  { label: 'Short Break', minutes: 5, color: 'accent' },
  { label: 'Long Break', minutes: 15, color: 'secondary' },
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
    primary: { stroke: '#6366f1', glow: 'shadow-primary-500/20' },
    accent: { stroke: '#10b981', glow: 'shadow-accent-500/20' },
    secondary: { stroke: '#a855f7', glow: 'shadow-secondary-500/20' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-text-primary">Pomodoro Timer</h1>
        <p className="text-sm text-text-secondary mt-0.5">Stay focused with timed work sessions</p>
      </div>

      {/* Mode Selector */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {MODES.map((m, i) => (
          <button
            key={m.label}
            onClick={() => handleModeChange(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              i === modeIndex
                ? 'bg-primary-600/15 text-primary-400'
                : 'text-text-secondary hover:bg-surface-700 hover:text-text-primary'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Timer */}
      <Card className="flex flex-col items-center py-10">
        <div className="relative mb-8">
          <svg width="280" height="280" viewBox="0 0 280 280">
            <circle
              cx="140" cy="140" r="120"
              fill="none"
              stroke="#1e293b"
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
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-text-primary tabular-nums">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-sm text-text-secondary mt-1">{mode.label}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={isRunning ? 'secondary' : 'primary'}
            size="lg"
            icon={isRunning ? HiOutlinePause : HiOutlinePlay}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button variant="ghost" size="lg" icon={HiOutlineRefresh} onClick={handleReset}>
            Reset
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <Card className="text-center">
          <p className="text-2xl font-bold text-primary-400">{sessions}</p>
          <p className="text-xs text-text-secondary mt-1">Sessions Today</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-accent-400">{Math.round(sessions * 25 / 60 * 10) / 10}h</p>
          <p className="text-xs text-text-secondary mt-1">Focus Time</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-warning-400">🔥</p>
          <p className="text-xs text-text-secondary mt-1">Keep Going!</p>
        </Card>
      </div>
    </motion.div>
  );
}
