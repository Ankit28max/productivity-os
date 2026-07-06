import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  HiOutlineSparkles,
  HiOutlineClipboardList,
  HiOutlineFire,
  HiOutlineDocumentText,
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineArrowRight,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineClock
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

// Seed grid data for the GitHub-style heatmap (7 rows x 26 columns)
const HEATMAP_COLS = 26;
const HEATMAP_ROWS = 7;
const seedHeatmap = () => {
  const data = [];
  for (let r = 0; r < HEATMAP_ROWS; r++) {
    const row = [];
    for (let c = 0; c < HEATMAP_COLS; c++) {
      // Create random intensity (0 = empty, 1-4 = neon shades)
      const val = Math.floor(Math.random() * 5);
      row.push(val);
    }
    data.push(row);
  }
  return data;
};

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [heatmapData] = useState(seedHeatmap());

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

  return (
    <div className="min-h-screen bg-[#050508] text-[#f0f0ff] relative overflow-x-hidden font-sans">
      
      {/* Dynamic Animated background orbs */}
      <div className="absolute top-[10%] left-[-15%] w-[600px] h-[600px] rounded-full blur-[160px] opacity-25 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 65%)' }}
      />
      <div className="absolute bottom-[20%] right-[-15%] w-[700px] h-[700px] rounded-full blur-[180px] opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 65%)' }}
      />

      {/* FIXED TOP NAVBAR */}
      <header className="fixed top-0 left-0 right-0 h-14 z-50 bg-[#050508]/85 backdrop-blur-md border-b border-white/[0.03] select-none flex items-center justify-between px-6 max-w-[1400px] mx-auto">
        {/* Left Logo */}
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <HiOutlineSparkles className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="font-extrabold text-sm text-text-primary tracking-tight">ProductivityOS</span>
        </div>

        {/* Center Navigation links */}
        <nav className="hidden md:flex items-center gap-7">
          <a href="#features" className="text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors tracking-wide">
            Features
          </a>
          <a href="#consistency" className="text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors tracking-wide">
            Heatmap
          </a>
          <a href="#telemetry" className="text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors tracking-wide">
            Telemetry
          </a>
          <a href="#coaching" className="text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors tracking-wide">
            AI Coach
          </a>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors cursor-pointer"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <HiOutlineSun className="h-4.5 w-4.5" /> : <HiOutlineMoon className="h-4.5 w-4.5" />}
          </button>
          
          <button
            onClick={handleLaunchApp}
            className="px-4 py-1.5 rounded-full text-xs font-bold text-dark-950 bg-white hover:bg-white/90 transition-all shadow-[0_4px_12px_rgba(255,255,255,0.15)] cursor-pointer"
          >
            Start
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[90vh]">
        {/* Left Intro Panel */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.08] text-text-primary">
            Practice never <br />
            feels lonely <span className="relative inline-block italic text-orange-500 font-extrabold pr-2">
              here
              {/* Hand-drawn underline SVG */}
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
              Explore Workspace
            </button>
          </div>
        </div>

        {/* Right Dashboard Visual Scene with floating widgets */}
        <div className="lg:col-span-6 relative flex items-center justify-center min-h-[420px]">
          {/* Animated central HUD core */}
          <div className="relative h-72 w-72 flex items-center justify-center">
            {/* Spinning decorative radar circles */}
            <div className="absolute inset-0 rounded-full border border-orange-500/10 animate-spin" style={{ animationDuration: '10s' }} />
            <div className="absolute inset-4 rounded-full border border-primary-500/5 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
            <div className="absolute inset-10 rounded-full border border-dashed border-white/5" />
            
            {/* Glowing brand silhouette mockup */}
            <div className="h-44 w-44 rounded-full bg-surface-950/80 border border-white/10 flex items-center justify-center shadow-2xl relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="text-center z-10 select-none">
                <HiOutlineSparkles className="h-10 w-10 text-orange-500 mx-auto animate-pulse" />
                <p className="text-[10px] font-bold tracking-wider text-text-primary uppercase mt-2">CONSOLE ACTIVE</p>
              </div>
            </div>
          </div>

          {/* Floating Widget 1: Streak (Top Left) */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-4 left-6"
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

          {/* Floating Widget 2: Leaderboard (Right Side) */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute right-4 top-14"
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

          {/* Floating Widget 3: AI Review Comment (Bottom Left) */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
            className="absolute bottom-4 left-2"
          >
            <div className="glass-card rounded-2xl p-3 border border-white/10 shadow-lg bg-[#0e0e15]/90 backdrop-blur w-64 space-y-1">
              <div className="flex items-center justify-between border-b border-white/[0.03] pb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[9px] font-bold text-text-primary">Gemini reviewed</span>
                </div>
                <span className="text-[8px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">+15 XP</span>
              </div>
              <p className="text-[9.5px] font-mono text-text-secondary leading-normal">
                "*Focus session completed. Try breaking down the next task into smaller checkpoints.*"
              </p>
            </div>
          </motion.div>

          {/* Floating Widget 4: Live Status Dot (Bottom Right) */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
            className="absolute bottom-6 right-6"
          >
            <div className="px-3 py-1.5 rounded-full border border-white/10 bg-[#0e0e15]/95 shadow-md flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ef4444] animate-pulse" />
              <span className="text-[9px] font-bold text-text-secondary tracking-wide uppercase">Live sessions - 384 in</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Consistency Panels */}
      <section id="consistency" className="max-w-6xl mx-auto px-6 py-24 border-t border-white/[0.03] relative z-10 text-center space-y-12">
        <div className="space-y-3">
          <p className="text-xs text-orange-500 font-bold uppercase tracking-wider">Consistency that compounds</p>
          <h2 className="text-xl md:text-3xl font-extrabold text-text-primary tracking-tight max-w-2xl mx-auto">
            Skip a day, your tracker flags it. Complete a goal, your telemetry celebrate.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
          {/* Left Card: Avatars List */}
          <Card className="p-6 border border-white/[0.04] bg-surface-900/20 flex flex-col justify-between min-h-[300px]">
            <div>
              <h3 className="text-base font-bold text-text-primary">A community that shows up</h3>
              <p className="text-xs text-text-secondary mt-1 max-w-sm leading-relaxed">
                Check-ins, study rooms, and peer telemetry logs. The log never goes quiet because someone is always building.
              </p>
            </div>

            <div className="py-6 space-y-4">
              {/* Overlapping Mock Avatars */}
              <div className="flex items-center pl-2">
                {['A', 'S', 'N', 'Y', 'H'].map((initial, idx) => (
                  <div
                    key={idx}
                    className="h-10 w-10 rounded-full border border-dark-950 bg-surface-850 flex items-center justify-center text-xs font-bold text-text-primary -ml-2 select-none"
                    style={{ zIndex: 5 - idx }}
                  >
                    {initial}
                  </div>
                ))}
                <span className="text-[10px] text-text-secondary font-bold ml-3 tracking-wide uppercase">
                  50,000+ Workspace Users
                </span>
              </div>
            </div>

            <div className="px-3 py-2 rounded-xl bg-surface-950/40 border border-white/[0.02] w-fit font-mono text-[9px] text-text-secondary">
              <span className="text-primary-400 font-bold">&gt; Aman: </span>
              "checked off morning checklist, focus quotient +1"
            </div>
          </Card>

          {/* Right Card: GitHub Heatmap Check-in Logs */}
          <Card className="p-6 border border-white/[0.04] bg-surface-900/20 flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-text-primary">Commitment Heatmap</h3>
                <span className="text-[9.5px] font-mono text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/15">
                  127 day streak
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed max-w-sm">
                Daily streaks, reminders, and a system that logs details for showing up. We track the line, you execute it.
              </p>
            </div>

            {/* Heatmap Matrix Grid Rendering */}
            <div className="py-5 select-none overflow-x-auto">
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
                        title={`Day ${rIdx + 1}, Col ${cIdx + 1}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-[8px] text-text-muted font-mono mt-3 max-w-[270px]">
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

      {/* Section 3: Telemetry Panels */}
      <section id="telemetry" className="max-w-6xl mx-auto px-6 py-24 border-t border-white/[0.03] relative z-10 text-center space-y-12">
        <div className="space-y-3">
          <p className="text-xs text-primary-400 font-bold uppercase tracking-wider">Telemetry that matters</p>
          <h2 className="text-xl md:text-3xl font-extrabold text-text-primary tracking-tight max-w-2xl mx-auto">
            Live checklists that move with the project.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left items-start">
          {/* Left card: Mock live task quiz checklist */}
          <Card className="lg:col-span-7 p-6 border border-white/[0.04] bg-surface-900/20 space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.03] pb-3 select-none">
              <div className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-orange-500" />
                <span className="text-[10px] font-bold text-text-primary tracking-wide uppercase">Goals breakdown</span>
              </div>
              <span className="text-[9px] font-mono text-text-muted">115 milestones checked</span>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-text-primary">
                  What does `setTimeout` inside a `for` loop log?
                </h4>
                <p className="text-[10px] text-text-secondary mt-1 font-semibold">Asked by AI Coach · 10s left</p>
              </div>

              {/* Multiple choice options progress */}
              <div className="space-y-2.5">
                {[
                  { label: 'A. Closure captures variables', percent: 82, active: true },
                  { label: 'B. Loop scope block issue', percent: 12, active: false },
                  { label: 'C. Class bindings block', percent: 4, active: false },
                  { label: 'D. Promise reference triggers', percent: 2, active: false }
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
                      <span>{opt.label}</span>
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
            <Card className="p-4 border border-white/[0.04] bg-surface-900/20 flex items-center gap-4 select-none">
              <div className="h-10 w-10 rounded-full bg-surface-950 flex items-center justify-center text-orange-500 border border-white/5">
                <HiOutlineSparkles className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-text-primary">Gemini Coach active</p>
                <div className="flex items-center gap-3 mt-1 text-[9px] font-mono text-text-muted">
                  <span>goals 03/05</span>
                  <span>sessions 449</span>
                  <span>avg progress 76%</span>
                </div>
              </div>
            </Card>

            {/* Leaderboard list */}
            <Card className="p-5 border border-white/[0.04] bg-surface-900/20">
              <div className="flex items-center justify-between border-b border-white/[0.03] pb-3 mb-4 select-none">
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Live Leaderboard</h3>
                <span className="text-[9px] font-mono text-text-muted">Top 5 this week</span>
              </div>

              <div className="space-y-3">
                {[
                  { name: '1. Nausheen', score: 612, color: 'bg-primary-500/20 border-primary-500/35 text-primary-400' },
                  { name: '2. Ashutosh', score: 589, color: 'bg-emerald-500/20 border-emerald-500/35 text-emerald-400' },
                  { name: '3. Pallab', score: 457, color: 'bg-secondary-500/20 border-secondary-500/35 text-secondary-400' },
                  { name: '4. Debesh', score: 430, color: 'bg-orange-500/20 border-orange-500/35 text-orange-400' }
                ].map((user, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-text-primary">{user.name}</span>
                      <span className="font-mono text-text-secondary text-[10px]">{user.score}</span>
                    </div>
                    {/* Visual progress score bar */}
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

      {/* Launch app footer section */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center border-t border-white/[0.03] relative z-10 select-none">
        <div className="space-y-5">
          <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">Establish Your Command Deck Today</h2>
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

      {/* Footer copyright */}
      <footer className="py-8 text-center border-t border-white/[0.02] relative z-10 text-[9px] text-text-muted font-mono select-none">
        ProductivityOS © 2026. Custom layout tailored for cyber-command metrics.
      </footer>
    </div>
  );
}
