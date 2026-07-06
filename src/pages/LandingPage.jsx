import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiOutlineSparkles,
  HiOutlineClipboardList,
  HiOutlineFire,
  HiOutlineDocumentText,
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineArrowRight
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const FEATURES = [
  {
    title: 'Task Telemetry',
    desc: 'Organize your checklist items with glowing priority badges, category separation, and dynamic sort filters.',
    icon: HiOutlineClipboardList,
    color: 'text-primary-400',
    borderColor: 'hover:border-primary-500/30'
  },
  {
    title: 'Habit Consistency Tracker',
    desc: 'Build positive actions using visual 7-day checklists, interactive streak metrics, and lockable progress badges.',
    icon: HiOutlineFire,
    color: 'text-warning-400',
    borderColor: 'hover:border-warning-500/30'
  },
  {
    title: 'Hologram Notebook',
    desc: 'Draft summaries and extract educational flashcards using integrated Google Gemini AI assistant workflows.',
    icon: HiOutlineDocumentText,
    color: 'text-secondary-400',
    borderColor: 'hover:border-secondary-500/30'
  },
  {
    title: 'Interactive Scheduler',
    desc: 'Plot goal target deadlines on a monthly calendar grid. Click day blocks to manage instant schedules.',
    icon: HiOutlineCalendar,
    color: 'text-accent-400',
    borderColor: 'hover:border-accent-500/30'
  },
  {
    title: 'Productivity Analytics',
    desc: 'Track completed counts, weekly deep work durations, and habits logs through customized Recharts graphics.',
    icon: HiOutlineChartBar,
    color: 'text-info-400',
    borderColor: 'hover:border-info-500/30'
  },
  {
    title: 'AI Productivity Coach',
    desc: 'Chat directly with Gemini using custom context feeds to get weekly recommendations and scheduling guidelines.',
    icon: HiOutlineSparkles,
    color: 'text-emerald-400',
    borderColor: 'hover:border-emerald-500/30'
  }
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLaunchApp = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#050510] text-[#f0f0ff] relative overflow-hidden font-sans">
      {/* Decorative ambient background orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[150px] opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)' }}
      />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[150px] opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)' }}
      />

      {/* Landing Navbar */}
      <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between relative z-10 select-none">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/10">
            <HiOutlineSparkles className="h-5.5 w-5.5 text-white" />
          </div>
          <span className="font-extrabold text-lg text-text-primary tracking-tight">ProductivityOS</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-xs font-bold text-text-secondary hover:text-text-primary transition-colors tracking-wide uppercase">
            Log In
          </Link>
          <Link to="/signup">
            <Button size="sm" variant="outline">Sign Up</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-[10px] font-bold text-primary-400 tracking-wider uppercase select-none">
            <HiOutlineSparkles className="h-3.5 w-3.5 animate-pulse" />
            AI-Powered Workstation Command Deck
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1] text-text-primary">
            Initialize Your Unified <br />
            <span className="gradient-text">Productivity Command Center</span>
          </h1>

          {/* Subheading */}
          <p className="text-sm md:text-base text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Take complete control of your schedule, notes, goals, and habits. Built with neon-accented cyber telemetry grids and powered by Google Gemini API logic.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="md" variant="gradient" icon={HiOutlineArrowRight} onClick={handleLaunchApp}>
              Launch Workspace
            </Button>
            <Link to="/signup">
              <Button size="md" variant="outline">
                Register Command
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Dashboard Preview Glass Card Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 max-w-5xl mx-auto relative group"
        >
          {/* Background glowing glow borders */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/20 to-secondary-500/20 blur-xl group-hover:blur-2xl transition-all duration-300 pointer-events-none" />
          
          <Card variant="neon" className="border border-white/10 p-2 overflow-hidden shadow-2xl relative">
            {/* Header bar mock */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.04] bg-surface-900/50 select-none">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-danger-500/40" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning-500/40" />
                <span className="h-2.5 w-2.5 rounded-full bg-accent-500/40" />
              </div>
              <span className="text-[10px] font-mono text-text-muted">productivityos.dev/console</span>
              <span className="w-10 h-1" />
            </div>

            {/* Content mockup image/visual */}
            <div className="aspect-[16/9] w-full bg-surface-950/90 relative flex items-center justify-center p-6 border-t border-white/[0.01]">
              <div className="text-center space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/10 border border-primary-500/20 text-primary-400">
                  <HiOutlineSparkles className="h-6 w-6 animate-spin" style={{ animationDuration: '4s' }} />
                </div>
                <div>
                  <p className="text-xs font-bold text-text-primary tracking-wider uppercase">Console System Loaded</p>
                  <p className="text-[10px] text-text-muted mt-1 font-mono">1096 modules successfully initialized. Awaiting user registration...</p>
                </div>
                <Button size="xs" variant="outline" onClick={handleLaunchApp}>Enter System Gateway</Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Features Grid Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/[0.03] relative z-10">
        <div className="text-center space-y-2.5 mb-14">
          <h2 className="text-2xl font-extrabold text-text-primary">System Architecture Modules</h2>
          <p className="text-xs text-text-secondary max-w-lg mx-auto leading-relaxed">
            Each feature integrates directly into our global context state database, synced in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, idx) => (
            <Card
              key={idx}
              className={`p-6 border border-white/[0.03] transition-all duration-300 bg-surface-900/15 ${feat.borderColor}`}
              hover
            >
              <div className={`p-3 rounded-xl bg-surface-800/40 w-fit border border-white/[0.02] ${feat.color}`}>
                <feat.icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-text-primary mt-4 tracking-tight">{feat.title}</h3>
              <p className="text-xs text-text-secondary mt-2 leading-relaxed">{feat.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action Footer */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center border-t border-white/[0.03] relative z-10 select-none">
        <div className="space-y-6">
          <h2 className="text-3xl font-extrabold text-text-primary">Establish Your command deck Today</h2>
          <p className="text-xs text-text-secondary max-w-md mx-auto leading-relaxed">
            Organize tasks, map goal targets, check in daily routines, and query assistant logs with direct feedback.
          </p>
          <Button size="md" variant="gradient" onClick={handleLaunchApp}>
            Initialize Console Free
          </Button>
        </div>
      </section>

      {/* Footer bar */}
      <footer className="py-8 text-center border-t border-white/[0.02] relative z-10 text-[10px] text-text-muted font-mono select-none">
        ProductivityOS © 2026. Designed under Cyber-Glass Aesthetics guidelines.
      </footer>
    </div>
  );
}
