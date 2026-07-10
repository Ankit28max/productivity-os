import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineUser, HiOutlineFire, HiOutlineLocationMarker, HiOutlineClock, HiOutlinePlus, HiOutlineSparkles } from 'react-icons/hi';
import { useSteps } from '../../context/StepContext';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function StepsWidget() {
  const { getTodayLog, logSteps, getWellnessMetrics } = useSteps();
  const todayLog = getTodayLog();
  
  const [isEditing, setIsEditing] = useState(false);
  const [inputSteps, setInputSteps] = useState(todayLog.count);
  const [inputTarget, setInputTarget] = useState(todayLog.target || 10000);

  const { kcal, distance, time } = getWellnessMetrics(todayLog.count);
  const percent = Math.min(Math.round((todayLog.count / todayLog.target) * 100), 100);

  // SVG circular progress parameters
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await logSteps(parseInt(inputSteps) || 0, parseInt(inputTarget) || 10000);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setInputSteps(todayLog.count);
    setInputTarget(todayLog.target || 10000);
    setIsEditing(true);
  };

  return (
    <Card
      variant="default"
      className="flex flex-col hover:border-white/10 group relative border border-white/[0.04] overflow-hidden card-tilt"
      glow="orange"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚶</span>
            <div>
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Wellness Telemetry</h3>
              <p className="text-[10px] text-text-muted">Daily steps & physical energy logs</p>
            </div>
          </div>
          
          <Button
            size="xs"
            variant="ghost"
            onClick={handleEditClick}
            className="text-[10px] py-1 px-2 border border-white/[0.05]"
          >
            Log Session
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {!isEditing ? (
            <motion.div
              key="view"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center pt-2"
            >
              {/* Left Column: Progress Circle */}
              <div className="md:col-span-5 flex flex-col items-center justify-center relative">
                <svg className="w-32 h-32 transform -rotate-90">
                  {/* Track */}
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    className="stroke-surface-800 fill-none"
                    strokeWidth={strokeWidth}
                  />
                  {/* Glowing progress ring */}
                  <motion.circle
                    cx="64"
                    cy="64"
                    r={radius}
                    className="stroke-orange-500 fill-none"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    strokeLinecap="round"
                    style={{
                      filter: 'drop-shadow(0 0 6px rgba(234, 88, 12, 0.45))',
                    }}
                  />
                </svg>
                {/* Center text overlay */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-black text-text-primary leading-none">
                    {percent}%
                  </span>
                  <span className="text-[9px] font-bold text-text-muted mt-1 uppercase tracking-widest">
                    Goal
                  </span>
                </div>
              </div>

              {/* Right Column: Mini Stats list */}
              <div className="md:col-span-7 space-y-3">
                {/* Steps count */}
                <div>
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Steps Logged</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-black text-orange-400 tracking-tight leading-none">
                      {todayLog.count.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-text-muted font-bold">
                      / {todayLog.target.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Substats Row */}
                <div className="grid grid-cols-3 gap-2 border-t border-white/[0.04] pt-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-[9px] font-bold text-text-muted uppercase">
                      <HiOutlineFire className="h-3 w-3 text-red-400" />
                      Burned
                    </div>
                    <p className="text-xs font-extrabold text-text-primary">{kcal} <span className="text-[9px] text-text-muted font-medium">kcal</span></p>
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-[9px] font-bold text-text-muted uppercase">
                      <HiOutlineLocationMarker className="h-3 w-3 text-cyan-400" />
                      Distance
                    </div>
                    <p className="text-xs font-extrabold text-text-primary">{distance} <span className="text-[9px] text-text-muted font-medium">km</span></p>
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-[9px] font-bold text-text-muted uppercase">
                      <HiOutlineClock className="h-3 w-3 text-lime-400" />
                      Active
                    </div>
                    <p className="text-xs font-extrabold text-text-primary">{time} <span className="text-[9px] text-text-muted font-medium">min</span></p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="edit"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="space-y-3.5 pt-2"
            >
              <div className="space-y-2.5">
                <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                    Steps Logged
                  </label>
                  <input
                    type="number"
                    value={inputSteps}
                    onChange={(e) => setInputSteps(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-surface-900 border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-orange-500/50 transition-all font-semibold"
                    placeholder="Enter steps count"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                    Daily Target Goal
                  </label>
                  <input
                    type="number"
                    value={inputTarget}
                    onChange={(e) => setInputTarget(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full bg-surface-900 border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-orange-500/50 transition-all font-semibold"
                    placeholder="10,000 steps"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1.5">
                <Button
                  size="xs"
                  variant="gradient"
                  type="submit"
                  className="flex-1 text-[10px]"
                >
                  Log Telemetry
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 text-[10px] border-white/[0.05]"
                >
                  Cancel
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
      
      {/* Bottom achievement / status pill */}
      {!isEditing && (
        <div className="mt-4 bg-orange-500/5 border border-orange-500/10 rounded-xl px-3 py-2.5 flex items-center justify-between text-[10px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-2 relative z-10">
            <HiOutlineSparkles className="h-3.5 w-3.5 text-orange-400" />
            <span className="font-bold text-text-secondary">
              {percent >= 100 ? '🎉 Goal achieved today!' : '🚶 Keep moving to hit goal!'}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}
