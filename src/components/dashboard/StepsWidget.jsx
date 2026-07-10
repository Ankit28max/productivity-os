import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineFire, HiOutlineLocationMarker, HiOutlineClock, HiOutlineSparkles, HiOutlinePlus, HiOutlineMinus } from 'react-icons/hi';
import { useSteps } from '../../context/StepContext';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function StepsWidget() {
  const { getTodayLog, logSteps, logWater, logSleep, getWellnessMetrics } = useSteps();
  const todayLog = getTodayLog();
  
  const [activeTab, setActiveTab] = useState('steps'); // 'steps' | 'water' | 'sleep'
  const [isEditing, setIsEditing] = useState(false);
  
  // Input fields state
  const [inputVal, setInputVal] = useState(0);
  const [inputTarget, setInputTarget] = useState(10000);

  const { kcal, distance, time } = getWellnessMetrics(todayLog.count);

  const getPercent = (val, target) => {
    if (!target) return 0;
    return Math.min(Math.round((val / target) * 100), 100);
  };

  const handleEditClick = () => {
    if (activeTab === 'steps') {
      setInputVal(todayLog.count);
      setInputTarget(todayLog.target || 10000);
    } else if (activeTab === 'water') {
      setInputVal(todayLog.water || 0);
      setInputTarget(todayLog.waterTarget || 2000);
    } else {
      setInputVal(todayLog.sleep || 0);
      setInputTarget(todayLog.sleepTarget || 8);
    }
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activeTab === 'steps') {
      await logSteps(parseInt(inputVal) || 0, parseInt(inputTarget) || 10000);
    } else if (activeTab === 'water') {
      await logWater(parseInt(inputVal) || 0, parseInt(inputTarget) || 2000);
    } else {
      await logSleep(parseFloat(inputVal) || 0, parseInt(inputTarget) || 8);
    }
    setIsEditing(false);
  };

  const adjustWater = async (amount) => {
    const current = todayLog.water || 0;
    const next = Math.max(0, current + amount);
    await logWater(next, todayLog.waterTarget || 2000);
  };

  // SVG circular progress parameters for Steps
  const radius = 45;
  const strokeWidth = 6.5;
  const circumference = 2 * Math.PI * radius;
  
  const stepsPercent = getPercent(todayLog.count, todayLog.target);
  const waterPercent = getPercent(todayLog.water || 0, todayLog.waterTarget || 2000);
  const sleepPercent = getPercent(todayLog.sleep || 0, todayLog.sleepTarget || 8);

  const getDashoffset = (pct) => circumference - (pct / 100) * circumference;

  return (
    <Card
      variant="default"
      className="flex flex-col hover:border-white/10 group relative border border-white/[0.04] overflow-hidden card-tilt"
      glow={activeTab === 'steps' ? 'cyan' : activeTab === 'water' ? 'cyan' : 'violet'}
    >
      <div>
        {/* Header Tab List */}
        <div className="flex items-center justify-between mb-4 select-none">
          <div className="flex bg-surface-900/50 p-0.5 rounded-lg border border-white/[0.03]">
            {[
              { id: 'steps', label: '🚶 Steps' },
              { id: 'water', label: '💧 Water' },
              { id: 'sleep', label: '😴 Sleep' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setIsEditing(false); }}
                className={`text-[10px] font-bold px-2 py-1.5 rounded-md transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                    : 'text-text-muted hover:text-text-secondary border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <Button
            size="xs"
            variant="ghost"
            onClick={handleEditClick}
            className="text-[9px] py-1 px-2 border border-white/[0.05]"
          >
            Log
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {!isEditing ? (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {/* STEPS TAB */}
              {activeTab === 'steps' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-1">
                  <div className="md:col-span-5 flex flex-col items-center justify-center relative">
                    <svg className="w-28 h-28 transform -rotate-90">
                      <circle cx="56" cy="56" r={radius} className="stroke-surface-800 fill-none" strokeWidth={strokeWidth} />
                      <motion.circle
                        cx="56" cy="56" r={radius} className="stroke-orange-500 fill-none" strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        animate={{ strokeDashoffset: getDashoffset(stepsPercent) }}
                        transition={{ duration: 1.0, ease: 'easeOut' }}
                        strokeLinecap="round"
                        style={{ filter: 'drop-shadow(0 0 5px rgba(234, 88, 12, 0.4))' }}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-lg font-black text-text-primary leading-none">{stepsPercent}%</span>
                      <span className="text-[8px] font-bold text-text-muted mt-0.5 tracking-wider uppercase">Steps</span>
                    </div>
                  </div>

                  <div className="md:col-span-7 space-y-2.5">
                    <div>
                      <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Steps Logged</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-xl font-black text-orange-400 tracking-tight leading-none">
                          {todayLog.count.toLocaleString()}
                        </span>
                        <span className="text-[9px] text-text-muted font-bold">
                          / {todayLog.target.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1 border-t border-white/[0.04] pt-2">
                      <div>
                        <div className="flex items-center gap-0.5 text-[8px] font-bold text-text-muted uppercase">
                          <HiOutlineFire className="h-2.5 w-2.5 text-red-400" />
                          kcal
                        </div>
                        <p className="text-[11px] font-bold text-text-primary">{kcal}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-0.5 text-[8px] font-bold text-text-muted uppercase">
                          <HiOutlineLocationMarker className="h-2.5 w-2.5 text-cyan-400" />
                          km
                        </div>
                        <p className="text-[11px] font-bold text-text-primary">{distance}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-0.5 text-[8px] font-bold text-text-muted uppercase">
                          <HiOutlineClock className="h-2.5 w-2.5 text-lime-400" />
                          mins
                        </div>
                        <p className="text-[11px] font-bold text-text-primary">{time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* WATER TAB */}
              {activeTab === 'water' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-1">
                  <div className="md:col-span-5 flex flex-col items-center justify-center relative">
                    <svg className="w-28 h-28 transform -rotate-90">
                      <circle cx="56" cy="56" r={radius} className="stroke-surface-800 fill-none" strokeWidth={strokeWidth} />
                      <motion.circle
                        cx="56" cy="56" r={radius} className="stroke-cyan-500 fill-none" strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        animate={{ strokeDashoffset: getDashoffset(waterPercent) }}
                        transition={{ duration: 1.0, ease: 'easeOut' }}
                        strokeLinecap="round"
                        style={{ filter: 'drop-shadow(0 0 5px rgba(6, 182, 212, 0.4))' }}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-lg font-black text-text-primary leading-none">{waterPercent}%</span>
                      <span className="text-[8px] font-bold text-text-muted mt-0.5 tracking-wider uppercase">Hydrate</span>
                    </div>
                  </div>

                  <div className="md:col-span-7 space-y-3">
                    <div>
                      <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Water Intake</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-xl font-black text-cyan-400 tracking-tight leading-none">
                          {todayLog.water || 0}
                        </span>
                        <span className="text-[9px] text-text-muted font-bold">
                          / {todayLog.waterTarget || 2000} ml
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 border-t border-white/[0.04] pt-2">
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => adjustWater(250)}
                        icon={HiOutlinePlus}
                        className="flex-1 text-[9px] py-1 border-white/[0.04]"
                      >
                        250 ml
                      </Button>
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => adjustWater(-250)}
                        icon={HiOutlineMinus}
                        className="flex-1 text-[9px] py-1 border-white/[0.04]"
                      >
                        250 ml
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* SLEEP TAB */}
              {activeTab === 'sleep' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-1">
                  <div className="md:col-span-5 flex flex-col items-center justify-center relative">
                    <svg className="w-28 h-28 transform -rotate-90">
                      <circle cx="56" cy="56" r={radius} className="stroke-surface-800 fill-none" strokeWidth={strokeWidth} />
                      <motion.circle
                        cx="56" cy="56" r={radius} className="stroke-purple-500 fill-none" strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        animate={{ strokeDashoffset: getDashoffset(sleepPercent) }}
                        transition={{ duration: 1.0, ease: 'easeOut' }}
                        strokeLinecap="round"
                        style={{ filter: 'drop-shadow(0 0 5px rgba(168, 85, 247, 0.4))' }}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-lg font-black text-text-primary leading-none">{sleepPercent}%</span>
                      <span className="text-[8px] font-bold text-text-muted mt-0.5 tracking-wider uppercase">Rest</span>
                    </div>
                  </div>

                  <div className="md:col-span-7 space-y-2.5">
                    <div>
                      <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Sleep Duration</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-xl font-black text-purple-400 tracking-tight leading-none">
                          {todayLog.sleep || 0}
                        </span>
                        <span className="text-[9px] text-text-muted font-bold">
                          / {todayLog.sleepTarget || 8} hrs
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-white/[0.04] pt-2 text-[9px] text-text-muted leading-relaxed">
                      💡 Recommended: 7-9 hours of consistent sleep for optimal cognitive performance.
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.form
              key="edit"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="space-y-3 pt-1"
            >
              <div className="space-y-2">
                <div>
                  <label className="text-[9px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                    {activeTab === 'steps' ? 'Steps Count' : activeTab === 'water' ? 'Water Intake (ml)' : 'Sleep Hours'}
                  </label>
                  <input
                    type="number"
                    step={activeTab === 'sleep' ? '0.1' : '1'}
                    value={inputVal}
                    onChange={(e) => setInputVal(Math.max(0, parseFloat(e.target.value) || 0))}
                    onFocus={(e) => e.target.select()}
                    className="w-full bg-surface-900 border border-white/[0.06] rounded-xl px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-orange-500/50 transition-all font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                    Daily Goal Target
                  </label>
                  <input
                    type="number"
                    value={inputTarget}
                    onChange={(e) => setInputTarget(Math.max(1, parseInt(e.target.value) || 0))}
                    onFocus={(e) => e.target.select()}
                    className="w-full bg-surface-900 border border-white/[0.06] rounded-xl px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-orange-500/50 transition-all font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Button size="xs" variant="gradient" type="submit" className="flex-1 text-[10px]">
                  Save logs
                </Button>
                <Button size="xs" variant="outline" type="button" onClick={() => setIsEditing(false)} className="flex-1 text-[10px] border-white/[0.05]">
                  Cancel
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
      
      {/* Bottom achievement / status pill */}
      {!isEditing && (
        <div className="mt-4 bg-orange-500/5 border border-orange-500/10 rounded-xl px-3 py-2 flex items-center justify-between text-[10px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-2 relative z-10">
            <HiOutlineSparkles className="h-3.5 w-3.5 text-orange-400" />
            <span className="font-bold text-text-secondary">
              {activeTab === 'steps' && (stepsPercent >= 100 ? '🎉 Steps target achieved!' : '🚶 Keep moving to hit goal!')}
              {activeTab === 'water' && (waterPercent >= 100 ? '🎉 Hydrated successfully today!' : '💧 Remember to drink water!')}
              {activeTab === 'sleep' && (sleepPercent >= 100 ? '🎉 Sleep target satisfied!' : '😴 Get some quality rest!')}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}
