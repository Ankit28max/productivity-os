import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineSparkles,
  HiOutlineFire,
  HiOutlineChevronDown,
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/ui/Card';
import Logo from '../components/ui/Logo';

// Seed grid data for the GitHub-style heatmap (7 rows x 26 columns)
const HEATMAP_ROWS = 7;
const seedHeatmap = () => {
  const data = [];
  for (let r = 0; r < HEATMAP_ROWS; r++) {
    const row = [];
    for (let c = 0; c < 26; c++) {
      row.push(Math.floor(Math.random() * 5));
    }
    data.push(row);
  }
  return data;
};

// FAQ Accordion items
const FAQ_ITEMS = [
  {
    q: 'How does the streak tracking work?',
    a: 'Your daily check-in is logged on our central dashboard. Checking off any habit or task increments your current active streak automatically. If you miss a day, your telemetry alerts compile the delta.'
  },
  {
    q: 'Can I connect my local editor workspaces?',
    a: 'Yes, our Node.js Express server scaffolding is designed to accommodate webhook triggers from editors, logging your coding sessions directly to the monthly calendar.'
  },
  {
    q: 'Is the Gemini AI productivity coach free?',
    a: 'Yes, the AI assistant utilizes your local API key or fallback mock engines to summarize notes, formulate study flashcards, and guide goals checkpoint lists completely free.'
  }
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [focusHours, setFocusHours] = useState(40);
  const [heatmapData] = useState(seedHeatmap());
  const [openFaq, setOpenFaq] = useState(null);

  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const list = [];
    for (let i = 0; i < 20; i++) {
      list.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 6 + 4
      });
    }
    setParticles(list);
  }, []);

  const handleLaunchApp = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const getHeatmapColor = (intensity) => {
    const map = {
      0: 'bg-surface-900 border border-border-default',
      1: 'bg-orange-900/40 border border-orange-500/10',
      2: 'bg-orange-800/50 border border-orange-500/20',
      3: 'bg-orange-700/60 border border-orange-500/35',
      4: 'bg-orange-600 border border-orange-500/50',
    };
    return map[intensity] || map[0];
  };

  const getXPRank = (hours) => {
    if (hours < 20) return { rank: 'Focused Novice', xp: hours * 100, color: 'text-text-secondary' };
    if (hours < 60) return { rank: 'Telemetry Architect', xp: hours * 115, color: 'text-primary-400' };
    if (hours < 90) return { rank: 'Efficiency Ninja', xp: hours * 130, color: 'text-secondary-400' };
    return { rank: 'Productivity Archmage', xp: hours * 150, color: 'text-orange-500' };
  };

  const { rank, xp, color: rankColor } = getXPRank(focusHours);

  return (
    <div className="min-h-screen bg-dark-950 text-text-primary relative overflow-x-hidden font-sans select-none transition-colors duration-300">
      
      {/* Floating particles in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-text-muted/20"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`
            }}
            animate={{
              opacity: [0.1, 0.6, 0.1],
              y: [`${p.y}%`, `${p.y - 10}%`, `${p.y}%`]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      {/* Decorative ambient color blur shapes */}
      <div className="absolute top-[10%] left-[-15%] w-[600px] h-[600px] rounded-full blur-[150px] opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(234,88,12,0.15) 0%, transparent 65%)' }}
      />
      <div className="absolute bottom-[20%] right-[-15%] w-[600px] h-[600px] rounded-full blur-[150px] opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(217,119,6,0.12) 0%, transparent 65%)' }}
      />

      {/* FIXED TOP NAVBAR */}
      <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-dark-950/95 backdrop-blur-sm border-b border-border-default flex items-center justify-between px-6 md:px-12 max-w-[1400px] mx-auto transition-colors duration-300">
        {/* Left Logo */}
        <Logo size="sm" className="cursor-pointer" onClick={handleLaunchApp} />

        {/* Center navigation links */}
        <nav className="hidden md:flex items-center gap-9">
          <a href="#features" className="text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors tracking-wide">Features</a>
          <a href="#consistency" className="text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors tracking-wide">Heatmap</a>
          <a href="#telemetry" className="text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors tracking-wide">Telemetry</a>
          <a href="#coaching" className="text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors tracking-wide">AI Coach</a>
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-5">
          <button
            onClick={toggleTheme}
            className="p-1 rounded-full text-text-muted hover:text-text-primary hover:bg-surface-700/30 transition-colors cursor-pointer flex items-center justify-center"
            title="Toggle Theme"
          >
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93s3.05-7.44 7-7.93v15.86z"/>
            </svg>
          </button>

          <button
            onClick={handleLaunchApp}
            className="px-5 py-2 rounded-full text-xs font-bold text-white bg-primary-500 hover:bg-primary-600 transition-all cursor-pointer shadow-lg shadow-primary-500/20"
          >
            Start
          </button>
        </div>
      </header>

      {/* Hero section */}
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[90vh]">
        {/* Left Panel */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.08] text-text-primary">
            Staying focused <br />
            never feels lonely <span className="relative inline-block italic text-orange-500 font-extrabold pr-2">
              here
              <svg className="absolute left-0 bottom-[-6px] w-full h-2 text-orange-500" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0,5 C30,8 70,2 100,5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="text-xs md:text-sm text-text-secondary leading-relaxed max-w-xl">
            ProductivityOS is the coding command deck where every task, habit, and milestone is built to help you grow. Track streaks, analyze progress, and query Gemini contextually.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={handleLaunchApp}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-primary-500 hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              Start Tracking
            </button>
            <button
              onClick={handleLaunchApp}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-text-primary bg-surface-800/60 border border-border-subtle hover:bg-surface-700/60 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              Explore Workspace
            </button>
          </div>
        </div>

        {/* Right Panel: HUD and floating widgets */}
        <div className="lg:col-span-6 relative flex items-center justify-center min-h-[360px] sm:min-h-[440px]">
          {/* Faint orange glow backdrop */}
          <div className="absolute h-64 w-64 sm:h-80 sm:w-80 rounded-full bg-orange-600/10 filter blur-3xl" />
          
          <div className="relative h-[280px] w-[280px] sm:h-[320px] sm:w-[320px] flex items-center justify-center scale-90 sm:scale-100 transition-all duration-300">
            {/* Spinning HUD radar geometry */}
            <div className="absolute inset-0 rounded-full border border-orange-500/15 animate-spin" style={{ animationDuration: '14s' }} />
            <div className="absolute inset-4 sm:inset-6 rounded-full border border-dashed border-border-default animate-spin" style={{ animationDuration: '9s', animationDirection: 'reverse' }} />
            <div className="absolute inset-8 sm:inset-12 rounded-full border border-orange-500/5" />
            
            {/* Glowing Brand Spark Circle */}
            <div className="h-36 w-36 sm:h-44 sm:w-44 rounded-full bg-surface-800/80 border border-border-subtle flex items-center justify-center shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-secondary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="text-center z-10 select-none">
                <HiOutlineSparkles className="h-10 w-10 sm:h-12 sm:w-12 text-orange-500 mx-auto animate-pulse" />
                <p className="text-[9px] sm:text-[10px] font-bold tracking-wider text-text-primary uppercase mt-2 sm:mt-3">CONSOLE ACTIVE</p>
                <p className="text-[7px] sm:text-[8px] font-mono text-text-muted mt-1">v1.0.0 // DB_OK</p>
              </div>
            </div>
          </div>

          {/* Floating Widget 1: Streak */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="hidden sm:block absolute top-4 left-4"
          >
            <div className="glass-card rounded-2xl p-3 shadow-lg flex items-center gap-3 w-44">
              <div className="h-8 w-8 rounded-lg bg-orange-600/10 flex items-center justify-center text-orange-500">
                <HiOutlineFire className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-text-muted uppercase">Current Streak</p>
                <p className="text-xs font-bold text-text-primary mt-0.5">127 days</p>
              </div>
            </div>
          </motion.div>

          {/* Floating Widget 2: Leaderboard */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="hidden sm:block absolute right-0 top-14"
          >
            <div className="glass-card rounded-2xl p-4 shadow-lg w-48 space-y-2.5">
              <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Leaderboard - This Week</p>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-semibold">
                  <span className="text-text-primary">1. Anirudh</span>
                  <span className="text-text-secondary">4,820</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-semibold">
                  <span className="text-text-primary">2. Shubham</span>
                  <span className="text-text-secondary">4,210</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold text-orange-500">
                  <span>3. You</span>
                  <span>3,985</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating Widget 3: AI Review Comment */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
            className="hidden sm:block absolute bottom-4 left-0"
          >
            <div className="glass-card rounded-2xl p-3 shadow-lg w-64 space-y-1">
              <div className="flex items-center justify-between border-b border-border-default pb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[9px] font-bold text-text-primary">AI Coach reviewed</span>
                </div>
                <span className="text-[8px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">+15 XP</span>
              </div>
              <p className="text-[9.5px] font-mono text-text-secondary leading-normal">
                "Focus session completed. Break down the next milestone into smaller checkpoints."
              </p>
            </div>
          </motion.div>

          {/* Floating Widget 4: Live Status Dot */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
            className="hidden sm:block absolute bottom-6 right-2"
          >
            <div className="px-3 py-1.5 rounded-full border border-border-subtle glass-card shadow-md flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[9px] font-bold text-text-secondary tracking-wide uppercase">Active Users - 384 online</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Consistency */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24 border-t border-border-default relative z-10 text-center space-y-12">
        <div className="space-y-3">
          <h2 className="text-xl md:text-3xl font-extrabold text-text-primary tracking-tight max-w-3xl mx-auto leading-relaxed">
            Skip a day, your tracker flags it. Complete a habit, your analytics celebrate.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
          {/* Left Card: A Workspace That Adapts */}
          <Card className="p-6 border border-border-subtle bg-surface-800/40 flex flex-col gap-5 min-h-[380px] hover:border-orange-500/20 transition-all duration-300">
            <div>
              <h3 className="text-base font-bold text-text-primary">A workspace that adapts</h3>
              <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                Connect check-ins, habit targets, and calendar grids. The telemetry console logs your actions in real-time.
              </p>
            </div>

            {/* INTEGRATIONS DOCK */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-2.5 rounded-xl bg-surface-900/50 border border-border-default flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-text-muted">VS CODE</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                </div>
                <p className="text-xs font-bold text-text-primary">4.2 hrs logged</p>
                <div className="w-full h-1 bg-surface-700 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-[70%]" />
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-900/50 border border-border-default flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-text-muted">GITHUB</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-xs font-bold text-text-primary">12 commits</p>
                <div className="w-full h-1 bg-surface-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[85%]" />
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-900/50 border border-border-default flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-text-muted">TERMINAL</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                </div>
                <p className="text-xs font-bold text-text-primary">Active shell</p>
                <div className="w-full h-1 bg-surface-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[40%]" />
                </div>
              </div>
            </div>

            {/* Mini activity bar chart */}
            <div className="p-3 rounded-xl bg-surface-900/50 border border-border-default">
              <p className="text-[9px] font-mono text-text-muted uppercase mb-2">Daily Focus Hours — This Week</p>
              <div className="flex items-end gap-1.5 h-10">
                {[3, 5, 4, 7, 6, 5, 4].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-sm ${i === 3 ? 'bg-orange-500' : 'bg-surface-700'}`}
                      style={{ height: `${(v / 7) * 100}%` }}
                    />
                    <span className="text-[7px] text-text-muted">{['M','T','W','T','F','S','S'][i]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto space-y-3">
              <div className="flex items-center pl-2">
                {['A', 'S', 'N', 'Y', 'H'].map((initial, idx) => (
                  <div
                    key={idx}
                    className="h-8 w-8 rounded-full border-2 border-dark-950 bg-surface-700 flex items-center justify-center text-xs font-bold text-text-primary -ml-2 shadow-md"
                    style={{ zIndex: 5 - idx }}
                  >
                    {initial}
                  </div>
                ))}
                <span className="text-[10px] text-text-secondary font-bold ml-3 tracking-wide uppercase">12,000+ Active Users</span>
              </div>
              <div className="px-3 py-2 rounded-xl bg-surface-900/40 border border-border-default w-full font-mono text-[9.5px] text-text-secondary">
                <span className="text-orange-400 font-bold">&gt; Aman: </span>
                "completed task: build UI context layout"
              </div>
            </div>
          </Card>

          {/* Right Card: consistency heatmap & stats summary */}
          <Card className="p-6 border border-border-subtle bg-surface-800/40 flex flex-col justify-between min-h-[380px] hover:border-orange-500/20 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-text-primary">Consistency that compounds</h3>
                <span className="text-[10px] font-mono text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded border border-orange-500/15">
                  127 day streak
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                Daily streaks, gentle nudges, and a system that rewards you for showing up. We track the line, you walk it.
              </p>
            </div>

            {/* Heatmap Grid — 10 weeks × 7 days rendered horizontally */}
            <div id="consistency" className="py-2 select-none">
              <p className="text-[8px] font-bold text-text-muted uppercase mb-2">Last Ten Weeks</p>
              <div className="flex gap-1">
                {Array.from({ length: 10 }).map((_, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-1">
                    {Array.from({ length: 7 }).map((_, dIdx) => {
                      const randomIntensity = Math.floor(Math.random() * 5);
                      return (
                        <div
                          key={dIdx}
                          className={`h-3 w-3 rounded-sm ${getHeatmapColor(randomIntensity)}`}
                          title={`Intensity: ${randomIntensity}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-[8px] text-text-muted font-mono mt-2">
                <span>Less</span>
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span key={i} className={`h-2.5 w-2.5 rounded-sm block ${getHeatmapColor(i)}`} />
                  ))}
                </div>
                <span>More</span>
              </div>
            </div>

            {/* Consistency Stats Summary: Fills remaining space beautifully */}
            <div className="grid grid-cols-3 gap-2 border-t border-border-default pt-3 mt-2 select-none">
              <div>
                <p className="text-[8px] font-bold text-text-muted uppercase">Total Check-ins</p>
                <p className="text-sm font-extrabold text-text-primary mt-0.5">854 days</p>
              </div>
              <div>
                <p className="text-[8px] font-bold text-text-muted uppercase">Intensity Avg</p>
                <p className="text-sm font-extrabold text-orange-500 mt-0.5">High</p>
              </div>
              <div>
                <p className="text-[8px] font-bold text-text-muted uppercase">Targets Met</p>
                <p className="text-sm font-extrabold text-text-primary mt-0.5">88.4%</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* XP Calculator Slider */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-border-default relative z-10 text-center space-y-8 select-none">
        <div className="space-y-2">
          <p className="text-xs text-orange-500 font-bold uppercase tracking-wider">XP Calculator</p>
          <h2 className="text-xl md:text-2xl font-extrabold text-text-primary tracking-tight">
            Estimate your rank telemetry output
          </h2>
          <p className="text-xs text-text-secondary max-w-md mx-auto leading-relaxed">
            Drag the focus hours controller slider to calculate XP gains and watch your coder profile level up dynamically.
          </p>
        </div>

        <Card className="max-w-xl mx-auto p-6 border border-border-subtle bg-surface-800/40 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-text-primary">
              <span>Weekly Target Focus</span>
              <span className="text-orange-500">{focusHours} Hours</span>
            </div>
            <input
              type="range"
              min="5"
              max="120"
              value={focusHours}
              onChange={(e) => setFocusHours(Number(e.target.value))}
              className="w-full h-1 bg-surface-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-border-default pt-4 text-left">
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase">Estimated XP Output</p>
              <p className="text-lg font-extrabold text-text-primary mt-0.5">{xp.toLocaleString()} XP</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase">Estimated Rank</p>
              <p className={`text-sm font-extrabold mt-1.5 ${rankColor}`}>{rank}</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Section 3: Telemetry Quiz Panel */}
      <section id="telemetry" className="max-w-6xl mx-auto px-6 py-20 border-t border-border-default relative z-10 text-center space-y-12">
        <div className="space-y-3">
          <h2 className="text-xl md:text-3xl font-extrabold text-text-primary tracking-tight max-w-2xl mx-auto">
            Interactive checklists that move with your goals.
          </h2>
          <p className="text-xs text-text-secondary max-w-xl mx-auto leading-relaxed">
            Your AI coach runs checks, suggestions, and milestones targets. Track your focus sessions metrics and watch your consistency score rise.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left items-start">
          {/* Left card: Quiz */}
          <Card className="lg:col-span-7 p-6 border border-border-subtle bg-surface-800/40 space-y-5">
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-7 rounded bg-orange-600 text-[8px] font-bold text-white flex items-center justify-center select-none uppercase">Live</span>
                <span className="text-[9px] font-bold text-text-muted tracking-wide uppercase">single choice</span>
              </div>
              <span className="text-[9px] font-mono text-text-muted">115 voting</span>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-text-primary leading-snug">
                  How do you prioritize high-urgency, low-importance tasks in the Eisenhower Matrix?
                </h4>
                <p className="text-[10px] text-text-secondary mt-1 font-semibold">Asked by AI Coach · Productivity OS · 10s left</p>
              </div>

              <div className="space-y-2.5">
                {[
                  { key: 'A', label: 'Delegate task check-ins to other tools', percent: 82, active: true },
                  { key: 'B', label: 'Do it immediately', percent: 12, active: false },
                  { key: 'C', label: 'Eliminate from checklist', percent: 4, active: false },
                  { key: 'D', label: 'Postpone for next sprint', percent: 2, active: false }
                ].map((opt, idx) => (
                  <div
                    key={idx}
                    className={`relative rounded-xl p-3 border transition-all text-xs font-semibold overflow-hidden select-none ${
                      opt.active
                        ? 'border-orange-500/30 bg-orange-500/5 text-text-primary'
                        : 'border-border-default bg-surface-900/20 text-text-secondary hover:text-text-primary hover:bg-surface-700/20'
                    }`}
                  >
                    <div
                      className={`absolute top-0 left-0 bottom-0 z-0 transition-all duration-1000 ${
                        opt.active ? 'bg-orange-600/15' : 'bg-surface-700/20'
                      }`}
                      style={{ width: `${opt.percent}%` }}
                    />
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`h-5.5 w-5.5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          opt.active ? 'bg-orange-600 text-white' : 'bg-surface-700 text-text-secondary'
                        }`}>{opt.key}</span>
                        <span>{opt.label}</span>
                      </div>
                      <span className="font-mono text-[10px] text-text-muted">{opt.percent}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Right card */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-4 border border-border-subtle bg-surface-800/40 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-surface-700 flex items-center justify-center text-orange-500 border border-border-default overflow-hidden">
                <div className="h-9 w-9 rounded-full bg-orange-600/10 flex items-center justify-center text-orange-500 text-xs font-bold font-mono border border-orange-500/20">
                  AI
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-text-primary">AI Coach <span className="text-[9px] font-bold text-orange-500 ml-1.5 uppercase bg-orange-500/10 px-1.5 py-0.5 rounded">helper</span></p>
                <p className="text-[9px] text-text-muted mt-0.5">Productivity OS</p>
              </div>
              <div className="text-right border-l border-border-default pl-4 font-mono select-none">
                <p className="text-[8px] text-text-muted uppercase">Active Users</p>
                <p className="text-xs font-bold text-text-primary">449</p>
              </div>
            </Card>

            <Card className="p-5 border border-border-subtle bg-surface-800/40">
              <div className="flex items-center justify-between border-b border-border-default pb-3 mb-4 select-none">
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Live Leaderboard</h3>
                <span className="text-[9px] font-mono text-text-muted">Top 5</span>
              </div>

              <div className="space-y-4">
                {[
                  { name: '1. Nausheen', score: 612, barColor: 'bg-primary-500/40' },
                  { name: '2. Ashutosh', score: 589, barColor: 'bg-emerald-500/40' },
                  { name: '3. Pallab', score: 457, barColor: 'bg-secondary-500/40' },
                  { name: '4. Debesh', score: 430, barColor: 'bg-orange-500/40' }
                ].map((user, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-text-primary">{user.name}</span>
                      <span className="font-mono text-text-secondary text-[10px]">{user.score}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-surface-700 overflow-hidden">
                      <div className={`h-full rounded-full ${user.barColor}`} style={{ width: `${(user.score / 650) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="coaching" className="max-w-4xl mx-auto px-6 py-20 border-t border-border-default relative z-10 space-y-10 select-none">
        <div className="text-center space-y-2">
          <p className="text-xs text-orange-500 font-bold uppercase tracking-wider">Help Desk</p>
          <h2 className="text-xl md:text-2xl font-extrabold text-text-primary tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
            Everything you need to know about setting up and running ProductivityOS.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, idx) => (
            <Card
              key={idx}
              className="p-4 border border-border-subtle bg-surface-800/40 hover:bg-surface-700/40 transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
            >
              <div className="flex items-center justify-between font-bold text-xs text-text-primary">
                <span>{faq.q}</span>
                <HiOutlineChevronDown
                  className={`h-4.5 w-4.5 text-text-muted transition-transform duration-300 ${
                    openFaq === idx ? 'transform rotate-180 text-orange-500' : ''
                  }`}
                />
              </div>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-text-secondary text-[11px] leading-relaxed pr-6 border-t border-border-default pt-3"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer launch section */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center border-t border-border-default relative z-10">
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight">Establish Your Command Deck Today</h2>
          <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
            Organize tasks, check in daily routines, and map target milestones with integrated AI logic.
          </p>
          <button
            onClick={handleLaunchApp}
            className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-primary-500 hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20 cursor-pointer"
          >
            Launch Free Console
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-border-default relative z-10 text-[9px] text-text-muted font-mono select-none">
        ProductivityOS © 2026. Custom layout tailored for cyber-command metrics.
      </footer>
    </div>
  );
}
