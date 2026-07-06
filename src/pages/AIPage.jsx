import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineSparkles,
  HiOutlinePaperAirplane,
  HiOutlineTrash,
  HiOutlineTerminal
} from 'react-icons/hi';
import { useTasks } from '../context/TaskContext';
import { useHabits } from '../context/HabitContext';
import { useGoals } from '../context/GoalContext';
import { useNotes } from '../context/NoteContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { chatWithAssistant } from '../services/ai.service';
import toast from 'react-hot-toast';

// Simple Custom Markdown/Text renderer to safely convert bold, bullets, and line breaks
function FormattedText({ text }) {
  if (!text) return null;

  const lines = text.split('\n');

  return (
    <div className="space-y-1.5 text-xs text-text-secondary leading-relaxed">
      {lines.map((line, lineIdx) => {
        // Bullet list item
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          const content = line.trim().substring(2);
          return (
            <li key={lineIdx} className="list-disc list-inside pl-2">
              {renderBoldText(content)}
            </li>
          );
        }

        // Headers
        if (line.trim().startsWith('### ')) {
          return (
            <h4 key={lineIdx} className="text-xs font-bold text-text-primary mt-2 uppercase tracking-wide">
              {line.trim().substring(4)}
            </h4>
          );
        }
        if (line.trim().startsWith('## ')) {
          return (
            <h3 key={lineIdx} className="text-sm font-bold text-text-primary mt-3 border-b border-white/[0.04] pb-1">
              {line.trim().substring(3)}
            </h3>
          );
        }

        return <p key={lineIdx}>{renderBoldText(line)}</p>;
      })}
    </div>
  );
}

function renderBoldText(text) {
  const parts = text.split('**');
  return parts.map((part, index) => {
    // Every second part is bold
    if (index % 2 === 1) {
      return <strong key={index} className="font-extrabold text-text-primary">{part}</strong>;
    }
    return part;
  });
}

const SUGGESTED_PROMPTS = [
  'Analyze my current productivity and schedule.',
  'Help me formulate milestones for my goals.',
  'How can I improve my habits consistency?',
  'Suggest a structured daily study plan.'
];

export default function AIPage() {
  const { tasks } = useTasks();
  const { habits, getStreak } = useHabits();
  const { goals } = useGoals();
  const { notes } = useNotes();

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      content: "Hello! I am your **ProductivityOS AI Companion**. I have loaded your goals, tasks, habits, and notes context. Ask me to structure your schedule, outline milestones, or suggest custom productivity tips!",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const chatEndRef = useRef(null);

  // Check if API key exists
  const hasApiKey = !!import.meta.env.VITE_GEMINI_API_KEY;

  // Scroll to bottom on messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Aggregate user context dynamically to send as background instruction
  const aggregatedContext = useMemo(() => {
    const pendingTasks = tasks
      .filter((t) => t.status !== 'completed')
      .map((t) => `- [${t.priority.toUpperCase()}] ${t.title} (Due: ${t.dueDate})`)
      .join('\n');

    const activeHabits = habits
      .map((h) => `- ${h.name} (Streak: ${getStreak(h)} days, checkins: ${h.history.length})`)
      .join('\n');

    const currentGoals = goals
      .map((g) => {
        const done = g.milestones.filter((m) => m.completed).length;
        const total = g.milestones.length;
        return `- ${g.title} (Progress: ${done}/${total} milestones, Target: ${g.targetDate})`;
      })
      .join('\n');

    const notesSummary = notes
      .map((n) => `- Note: "${n.title}" (${n.tags.join(', ')})`)
      .join('\n');

    return `PENDING TASKS:\n${pendingTasks || 'None'}\n\nACTIVE HABITS:\n${activeHabits || 'None'}\n\nACTIVE GOALS:\n${currentGoals || 'None'}\n\nRECENT NOTES:\n${notesSummary || 'None'}`;
  }, [tasks, habits, goals, notes, getStreak]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim() || isGenerating) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsGenerating(true);

    try {
      // Build message payload history
      const historyPayload = [...messages, userMsg].map(m => ({
        sender: m.sender,
        content: m.content
      }));

      const replyText = await chatWithAssistant(historyPayload, aggregatedContext);

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-ai-${Date.now()}`,
          sender: 'assistant',
          content: replyText,
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      toast.error(error.message || 'AI request failed');
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'assistant',
          content: "Sorry, I encountered an error communicating with the Gemini servers. Please check your network connection or API keys.",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        content: "Chat cleared. I am ready to review your schedules, track milestones, or discuss habit optimization strategies!",
        timestamp: new Date()
      }
    ]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-[1000px] mx-auto flex flex-col h-[calc(100vh-140px)]"
    >
      {/* Header Panel */}
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-3 select-none flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight flex items-center gap-2">
            <HiOutlineSparkles className="h-5.5 w-5.5 text-primary-400 animate-pulse" />
            AI Productivity Coach
          </h1>
          <p className="text-xs text-text-muted mt-0.5 font-medium">
            AI-driven schedule breakdown, habit stacking, and milestones analysis.
          </p>
        </div>
        
        {/* Sandbox vs Active Mode indicators */}
        <div className="flex items-center gap-3">
          {!hasApiKey ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border text-warning-400 bg-warning-500/10 border-warning-500/20">
              <HiOutlineTerminal className="h-3.5 w-3.5" />
              Sandbox Mode
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border text-primary-400 bg-primary-500/10 border-primary-500/20">
              <HiOutlineSparkles className="h-3.5 w-3.5" />
              Gemini Live
            </span>
          )}
          
          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-lg text-text-muted hover:text-danger-400 hover:bg-surface-700/40 transition-colors"
            title="Clear Chat"
          >
            <HiOutlineTrash className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* Sandbox Warning Banner */}
      {!hasApiKey && (
        <div className="p-3 rounded-xl bg-warning-500/5 border border-warning-500/10 flex-shrink-0">
          <p className="text-[10px] text-warning-400 leading-normal">
            <strong>Notice:</strong> The <code>VITE_GEMINI_API_KEY</code> is not loaded. I will simulate contextual responses. Create a <code>.env</code> file in the project root with your API key to connect live.
          </p>
        </div>
      )}

      {/* Messages Workspace */}
      <Card className="flex-1 min-h-0 p-4 border border-white/[0.04] bg-surface-900/25 flex flex-col justify-between overflow-hidden">
        {/* Conversation flow */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((m) => {
              const isAssistant = m.sender === 'assistant';
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 border text-xs shadow-md transition-all duration-200 ${
                      isAssistant
                        ? 'bg-surface-800/40 border-white/[0.03] text-text-secondary rounded-tl-sm'
                        : 'bg-primary-500/10 border-primary-500/30 text-text-primary rounded-tr-sm'
                    }`}
                  >
                    <FormattedText text={m.content} />
                    <span className="block text-[9px] text-text-muted text-right mt-1.5 select-none font-semibold">
                      {m.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              );
            })}

            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-surface-800/40 border border-white/[0.03] rounded-2xl rounded-tl-sm px-4 py-3 shadow-md flex items-center gap-2">
                  <Spinner size="xs" />
                  <span className="text-[11px] text-text-muted font-semibold">Gemini is thinking...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        {/* Dynamic Bubble Prompts (Show when input is empty & not generating) */}
        {inputText.length === 0 && !isGenerating && (
          <div className="flex flex-wrap gap-2 py-3 border-t border-white/[0.03] mt-3 justify-center select-none flex-shrink-0">
            {SUGGESTED_PROMPTS.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(prompt)}
                className="px-3 py-1.5 rounded-full border border-white/[0.04] bg-surface-900/30 text-[10px] text-text-secondary hover:text-text-primary hover:bg-surface-800 hover:border-white/10 transition-all cursor-pointer font-semibold"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="flex gap-2.5 items-center pt-3 border-t border-white/[0.03] flex-shrink-0">
          <input
            type="text"
            placeholder="Type your productivity query here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isGenerating}
            className="flex-1 rounded-xl glass-input px-4 py-3 text-xs text-text-primary placeholder:text-text-muted transition-all duration-250 hover:border-white/12 focus:outline-none focus:border-primary-500/40 focus:ring-1 focus:ring-primary-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
          />
          <Button
            variant="gradient"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isGenerating}
            className="p-3.5 rounded-xl aspect-square flex items-center justify-center cursor-pointer"
          >
            <HiOutlinePaperAirplane className="h-4.5 w-4.5 rotate-90" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
