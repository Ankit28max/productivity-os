import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineFire,
  HiOutlineChevronDown,
  HiOutlineSun,
  HiOutlineMoon,
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/ui/Card';

// Seed grid data for the GitHub-style heatmap (7 rows x 26 columns)
const HEATMAP_COLS = 26;
const HEATMAP_ROWS = 7;
const seedHeatmap = () => {
  const data = [];
  for (let r = 0; r < HEATMAP_ROWS; r++) {
    const row = [];
    for (let c = 0; c < HEATMAP_COLS; c++) {
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
  
  // Interactive slider state for coder XP calculator
  const [focusHours, setFocusHours] = useState(40);
  const [heatmapData] = useState(seedHeatmap());
  const [openFaq, setOpenFaq] = useState(null);

  // Generate background particles
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
      0: 'bg-[#1a1a24] border border-white/[0.01]',
      1: 'bg-[#4c2415] border border-orange-500/10 shadow-[0_0_2px_rgba(249,115,22,0.1)]',
      2: 'bg-[#853715] border border-orange-500/20 shadow-[0_0_4px_rgba(249,115,22,0.2)]',
      3: 'bg-[#c24e15] border border-orange-500/35 shadow-[0_0_8px_rgba(249,115,22,0.3)]',
      4: 'bg-[#ea580c] border border-orange-500/50 shadow-[0_0_12px_rgba(249,115,22,0.5)]',
    };
    return map[intensity] || map[0];
  };

  // Calculate XP rank based on slider hours
  const getXPRank = (hours) => {
    if (hours < 20) return { rank: 'Code Novice', xp: hours * 100, color: 'text-text-secondary' };
    if (hours < 60) return { rank: 'Telemetry Architect', xp: hours * 115, color: 'text-primary-400' };
    if (hours < 90) return { rank: 'Algorithm Ninja', xp: hours * 130, color: 'text-secondary-400' };
    return { rank: 'System Archmage', xp: hours * 150, color: 'text-orange-500' };
  };

  const { rank, xp, color: rankColor } = getXPRank(focusHours);

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-[#f0f0ff] relative overflow-x-hidden font-sans select-none">
      
      {/* Floating neon star particles in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white/20"
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

      {/* Decorative ambient sunset orange/amber color blurs */}
      <div className="absolute top-[10%] left-[-15%] w-[600px] h-[600px] rounded-full blur-[150px] opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(234,88,12,0.15) 0%, transparent 65%)' }}
      />
      <div className="absolute bottom-[20%] right-[-15%] w-[600px] h-[600px] rounded-full blur-[150px] opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(217,119,6,0.12) 0%, transparent 65%)' }}
      />

      {/* NAVBAR MATCHING SCREENSHOT EXACTLY (STYLING & MOCK LINKS) */}
      <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-[#0c0c0e] border-b border-white/[0.03] flex items-center justify-between px-6 md:px-12 max-w-[1400px] mx-auto">
        {/* Left: SVG Mascot logo (MUSTACHE MAN) */}
        <div className="flex items-center">
          <svg className="h-9 w-9 text-white select-none cursor-pointer" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={handleLaunchApp}>
            {/* Turban shape */}
            <path d="M50 15C32 15 22 28 22 42C22 45 23 48 25 50C29 45 35 40 45 42C48 38 52 38 55 42C65 40 71 45 75 50C77 48 78 45 78 42C78 28 68 15 50 15Z" fill="white" />
            {/* Diagonal stripes on turban */}
            <path d="M30 20L45 35M40 16L60 36M52 15L70 33" stroke="#0c0c0e" strokeWidth="2.5" strokeLinecap="round" />
            {/* Orange forehead bindi */}
            <circle cx="50" cy="46" r="4.5" fill="#ea580c" />
            {/* Glasses frames */}
            <circle cx="36" cy="62" r="12" stroke="white" strokeWidth="4" />
            <circle cx="64" cy="62" r="12" stroke="white" strokeWidth="4" />
            <path d="M48 62H52" stroke="white" strokeWidth="4" />
            {/* Angle brackets inside lenses */}
            <path d="M38 59L34 62L38 65" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M62 59L66 62L62 65" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Mustache */}
            <path d="M33 76C43 76 47 70 50 74C53 70 57 76 67 76C73 76 76 72 76 72C76 72 70 82 50 82C30 82 24 72 24 72C24 72 27 76 33 76Z" fill="white" />
          </svg>
        </div>

        {/* Center navigation links matches screenshot exactly */}
        <nav className="hidden md:flex items-center gap-9">
          <a href="#features" className="text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors tracking-wide">
            Hackathons
          </a>
          <a href="#consistency" className="text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors tracking-wide">
            Quiz
          </a>
          <a href="#telemetry" className="text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors tracking-wide">
            Stories
          </a>
          <a href="#coaching" className="text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors tracking-wide">
            Courses
          </a>
        </nav>

        {/* Right side controls: Split Circle Theme Toggle & Capsule solid button */}
        <div className="flex items-center gap-5">
          {/* Split Circle Theme Toggle Icon button */}
          <button
            onClick={toggleTheme}
            className="p-1 rounded-full text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-center"
            title="Toggle Theme"
          >
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93s3.05-7.44 7-7.93v15.86z"/>
            </svg>
          </button>

          {/* Capsule Button exactly matches layout */}
          <button
            onClick={handleLaunchApp}
            className="px-5 py-2 rounded-full text-xs font-bold text-dark-950 bg-white hover:bg-white/90 transition-all cursor-pointer shadow-lg shadow-white/5"
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
            Practice never <br />
            feels lonely <span className="relative inline-block italic text-orange-500 font-extrabold pr-2">
              here
              {/* Underline SVG */}
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
              className="px-5 py-2.5 rounded-full text-xs font-bold text-dark-950 bg-white hover:bg-white/90 transition-all shadow-[0_4px_16px_rgba(255,255,255,0.15)] flex items-center gap-1.5 cursor-pointer"
            >
              Start Learning
            </button>
            <button
              onClick={handleLaunchApp}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-text-primary bg-surface-900/40 border border-white/[0.06] hover:bg-surface-800/50 hover:border-white/12 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              Download App
            </button>
          </div>
        </div>

        {/* Right Panel: Large glowing mascot and floating widgets matching screenshot */}
        <div className="lg:col-span-6 relative flex items-center justify-center min-h-[440px]">
          {/* Faint orange glow backdrop behind mascot */}
          <div className="absolute h-80 w-80 rounded-full bg-orange-600/10 filter blur-3xl" />
          
          <div className="relative h-[320px] w-[320px] flex items-center justify-center">
            {/* SVG Mascot logo (MUSTACHE MAN) rendering in large high-fidelity center-right */}
            <svg className="h-[280px] w-[280px] text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.12)] select-none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Turban */}
              <path d="M50 15C32 15 22 28 22 42C22 45 23 48 25 50C29 45 35 40 45 42C48 38 52 38 55 42C65 40 71 45 75 50C77 48 78 45 78 42C78 28 68 15 50 15Z" fill="white" />
              {/* Stripes */}
              <path d="M30 20L45 35M40 16L60 36M52 15L70 33" stroke="#0c0c0e" strokeWidth="2.5" strokeLinecap="round" />
              {/* Bindi forehead dot */}
              <circle cx="50" cy="46" r="4.5" fill="#ea580c" />
              {/* Glasses */}
              <circle cx="36" cy="62" r="12" stroke="white" strokeWidth="4" />
              <circle cx="64" cy="62" r="12" stroke="white" strokeWidth="4" />
              <path d="M48 62H52" stroke="white" strokeWidth="4" />
              {/* Angle brackets inside lenses */}
              <path d="M38 59L34 62L38 65" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M62 59L66 62L62 65" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {/* Mustache */}
              <path d="M33 76C43 76 47 70 50 74C53 70 57 76 67 76C73 76 76 72 76 72C76 72 70 82 50 82C30 82 24 72 24 72C24 72 27 76 33 76Z" fill="white" />
            </svg>
          </div>

          {/* Floating Widget 1: Streak */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-4 left-4"
          >
            <div className="glass-card rounded-2xl p-3 border border-white/10 shadow-lg bg-[#0e0e15]/90 backdrop-blur flex items-center gap-3 w-44">
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
            className="absolute right-0 top-14"
          >
            <div className="glass-card rounded-2xl p-4 border border-white/10 shadow-lg bg-[#0e0e15]/95 backdrop-blur w-48 space-y-2.5">
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
            className="absolute bottom-4 left-0"
          >
            <div className="glass-card rounded-2xl p-3 border border-white/10 shadow-lg bg-[#0e0e15]/90 backdrop-blur w-64 space-y-1">
              <div className="flex items-center justify-between border-b border-white/[0.03] pb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[9px] font-bold text-text-primary">Hitesh reviewed</span>
                </div>
                <span className="text-[8px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">+12 XP</span>
              </div>
              <p className="text-[9.5px] font-mono text-text-secondary leading-normal">
                "Clean recursion. Try memoizing the helper - we go from O(2ⁿ) to O(n)."
              </p>
            </div>
          </motion.div>

          {/* Floating Widget 4: Live Status Dot */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
            className="absolute bottom-6 right-2"
          >
            <div className="px-3 py-1.5 rounded-full border border-white/10 bg-[#0e0e15]/95 shadow-md flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ef4444] animate-pulse" />
              <span className="text-[9px] font-bold text-text-secondary tracking-wide uppercase">Live Quiz - 384 in</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Consistency */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24 border-t border-white/[0.03] relative z-10 text-center space-y-12">
        <div className="space-y-3">
          <h2 className="text-xl md:text-3xl font-extrabold text-text-primary tracking-tight max-w-3xl mx-auto leading-relaxed">
            Skip a day, your community pulls you back. Solve a hard one, your community celebrates.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
          {/* Left Card: Avatars List */}
          <Card className="p-6 border border-white/[0.04] bg-surface-900/20 flex flex-col justify-between min-h-[320px]">
            <div>
              <h3 className="text-base font-bold text-text-primary">A community that shows up</h3>
              <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                Town halls with Voice Rooms. Peer reviews on every submission. The chat never goes quiet, because someone is also stuck on the same problem.
              </p>
            </div>

            <div className="py-6 space-y-4">
              <div className="flex items-center pl-2">
                {['A', 'S', 'N', 'Y', 'H'].map((initial, idx) => (
                  <div
                    key={idx}
                    className="h-10 w-10 rounded-full border-2 border-[#0c0c0e] bg-surface-850 flex items-center justify-center text-xs font-bold text-text-primary -ml-2.5 shadow-md"
                    style={{ zIndex: 5 - idx }}
                  >
                    {initial}
                  </div>
                ))}
                <span className="text-[10px] text-text-secondary font-bold ml-4 tracking-wide uppercase">
                  50,000+ Coders
                </span>
              </div>
              <p className="text-[10px] text-text-muted font-semibold tracking-wide">HACKATHON - 40 VOICE ROOMS LIVE</p>
            </div>

            <div className="px-3.5 py-2.5 rounded-xl bg-surface-950/40 border border-white/[0.02] w-fit font-mono text-[9.5px] text-text-secondary">
              <span className="text-orange-400 font-bold">&gt; Aman: </span>
              "memoize the helper, O(n) instead"
            </div>
          </Card>

          {/* Right Card: github style consistency check-in heatmap */}
          <Card className="p-6 border border-white/[0.04] bg-surface-900/20 flex flex-col justify-between min-h-[320px]">
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

            {/* Heatmap Matrix Grid Rendering */}
            <div id="consistency" className="py-5 select-none overflow-x-auto">
              <p className="text-[8px] font-bold text-text-muted uppercase mb-2">Last Seven Weeks</p>
              <div className="grid grid-flow-col gap-1 w-fit">
                {heatmapData.map((row, rIdx) => (
                  <div key={rIdx} className="grid gap-1">
                    {row.map((intensity, cIdx) => (
                      <div
                        key={cIdx}
                        className={`h-2.5 w-2.5 rounded-sm transition-colors duration-300 ${getHeatmapColor(
                          intensity
                        )}`}
                        title={`Check-in day score: ${intensity}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-[8.5px] text-text-muted font-mono mt-3 max-w-[270px]">
                <span>Less</span>
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span key={i} className={`h-2 w-2 rounded-sm ${getHeatmapColor(i)}`} />
                  ))}
                </div>
                <span>More</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Interactive Section: XP Calculator Slider */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-white/[0.03] relative z-10 text-center space-y-8 select-none">
        <div className="space-y-2">
          <p className="text-xs text-orange-500 font-bold uppercase tracking-wider">XP Calculator</p>
          <h2 className="text-xl md:text-2xl font-extrabold text-text-primary tracking-tight">
            Estimate your rank telemetry output
          </h2>
          <p className="text-xs text-text-secondary max-w-md mx-auto leading-relaxed">
            Drag the focus hours controller slider to calculate XP gains and watch your coder profile level up dynamically.
          </p>
        </div>

        <Card className="max-w-xl mx-auto p-6 border border-white/[0.04] bg-surface-900/20 space-y-6">
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
              className="w-full h-1 bg-surface-950 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-white/[0.03] pt-4 text-left">
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
      <section id="telemetry" className="max-w-6xl mx-auto px-6 py-20 border-t border-white/[0.03] relative z-10 text-center space-y-12">
        <div className="space-y-3">
          <h2 className="text-xl md:text-3xl font-extrabold text-text-primary tracking-tight max-w-2xl mx-auto">
            Live quizzes that move with the room.
          </h2>
          <p className="text-xs text-text-secondary max-w-xl mx-auto leading-relaxed">
            Your host runs the question, word clouds, leaderboards, score deltas. The most interactive quiz format, built for cohort live classes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left items-start">
          {/* Left card: Mock live task quiz checklist */}
          <Card className="lg:col-span-7 p-6 border border-white/[0.04] bg-surface-900/20 space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.03] pb-3">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-7 rounded bg-orange-600 text-[8px] font-bold text-white flex items-center justify-center select-none uppercase">Live</span>
                <span className="text-[9px] font-bold text-text-muted tracking-wide uppercase">single choice</span>
              </div>
              <span className="text-[9px] font-mono text-text-muted">115 voting</span>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-text-primary leading-snug">
                  What does <code className="text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded font-mono">setTimeout</code> inside a for loop log?
                </h4>
                <p className="text-[10px] text-text-secondary mt-1 font-semibold">Asked by Hitesh · Web Dev Cohort 26 · 10s left</p>
              </div>

              {/* Multiple choice options progress */}
              <div className="space-y-2.5">
                {[
                  { key: 'A', label: 'Closure captures variables', percent: 18, active: true },
                  { key: 'B', label: 'Loop scope', percent: 3, active: false },
                  { key: 'C', label: 'Class bin...', percent: 2, active: false },
                  { key: 'D', label: 'Promise..', percent: 2, active: false }
                ].map((opt, idx) => (
                  <div
                    key={idx}
                    className={`relative rounded-xl p-3 border transition-all text-xs font-semibold overflow-hidden select-none ${
                      opt.active
                        ? 'border-orange-500/30 bg-[#ea580c]/5 text-text-primary shadow-[0_0_12px_rgba(234,88,12,0.05)]'
                        : 'border-white/[0.03] bg-surface-950/20 text-text-secondary hover:text-text-primary hover:bg-surface-800/10'
                    }`}
                  >
                    {/* Background indicator bar representing votes */}
                    <div
                      className={`absolute top-0 left-0 bottom-0 z-0 transition-all duration-1000 ${
                        opt.active ? 'bg-orange-600/15' : 'bg-white/5'
                      }`}
                      style={{ width: `${opt.percent}%` }}
                    />
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`h-5.5 w-5.5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          opt.active ? 'bg-orange-600 text-white' : 'bg-surface-950 text-text-secondary'
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

          {/* Right card: Telemetry charts & leaderboard lists */}
          <div className="lg:col-span-5 space-y-6">
            {/* Coach stats badge */}
            <Card className="p-4 border border-white/[0.04] bg-surface-900/20 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-surface-950 flex items-center justify-center text-orange-500 border border-white/5 overflow-hidden">
                <div className="h-9 w-9 rounded-full bg-orange-600/10 flex items-center justify-center text-orange-500 text-xs font-bold font-mono border border-orange-500/20">
                  H
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-text-primary">Hitesh <span className="text-[9px] font-bold text-orange-500 ml-1.5 uppercase bg-orange-500/10 px-1.5 py-0.5 rounded">host</span></p>
                <p className="text-[9px] text-text-muted mt-0.5">Web Dev Cohort 26</p>
              </div>
              <div className="text-right border-l border-white/[0.04] pl-4 font-mono select-none">
                <p className="text-[8px] text-text-muted uppercase">Live Users</p>
                <p className="text-xs font-bold text-text-primary">449</p>
              </div>
            </Card>

            {/* Leaderboard list */}
            <Card className="p-5 border border-white/[0.04] bg-surface-900/20">
              <div className="flex items-center justify-between border-b border-white/[0.03] pb-3 mb-4 select-none">
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Live Leaderboard</h3>
                <span className="text-[9px] font-mono text-text-muted">Top 5</span>
              </div>

              <div className="space-y-4">
                {[
                  { name: '1. Nausheen', score: 612, color: 'bg-primary-500/25 border-primary-500/35 text-primary-400' },
                  { name: '2. Ashutosh', score: 589, color: 'bg-emerald-500/25 border-emerald-500/35 text-emerald-400' },
                  { name: '3. Pallab', score: 457, color: 'bg-secondary-500/25 border-secondary-500/35 text-secondary-400' },
                  { name: '4. Debesh', score: 430, color: 'bg-orange-500/25 border-orange-500/35 text-orange-400' }
                ].map((user, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-text-primary">{user.name}</span>
                      <span className="font-mono text-text-secondary text-[10px]">{user.score}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-surface-950 overflow-hidden">
                      <div className={`h-full rounded-full ${user.color.split(' ')[0]}`} style={{ width: `${(user.score / 650) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="coaching" className="max-w-4xl mx-auto px-6 py-20 border-t border-white/[0.03] relative z-10 space-y-10 select-none">
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
              className="p-4 border border-white/[0.04] bg-[#0e0e15]/40 hover:bg-surface-850/30 transition-all duration-300 cursor-pointer overflow-hidden"
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
                    className="text-text-secondary text-[11px] leading-relaxed pr-6 border-t border-white/[0.02] pt-3"
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
      <section className="max-w-5xl mx-auto px-6 py-24 text-center border-t border-white/[0.03] relative z-10">
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight">Establish Your Command Deck Today</h2>
          <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
            Organize tasks, check in daily routines, and map target milestones with integrated AI logic.
          </p>
          <button
            onClick={handleLaunchApp}
            className="px-6 py-2.5 rounded-full text-xs font-bold text-dark-950 bg-white hover:bg-white/90 transition-all shadow-[0_4px_16px_rgba(255,255,255,0.15)] cursor-pointer"
          >
            Launch Free Console
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-white/[0.02] relative z-10 text-[9px] text-text-muted font-mono select-none">
        ProductivityOS © 2026. Custom layout tailored for cyber-command metrics.
      </footer>
    </div>
  );
}
