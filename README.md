# ProductivityOS — AI Powered Personal Productivity Platform

A modern, full-stack productivity platform built with React 19, Vite, and Tailwind CSS v4.

## Features

- 📋 **Task Manager** — Create, edit, filter, and organize tasks with priorities
- 📝 **Notes** — Rich note-taking with AI-powered summaries
- 🔄 **Habit Tracker** — Build daily habits with streaks and statistics
- 🎯 **Goals** — Set and track long-term goals with milestones
- 📅 **Calendar** — Monthly/weekly views with task scheduling
- ⏱ **Pomodoro Timer** — Focus sessions with customizable timers
- 📊 **Analytics** — Charts and insights for your productivity
- 🤖 **AI Assistant** — Powered by Gemini for smart planning
- 🔐 **Authentication** — JWT-based auth with protected routes
- 🌙 **Dark Mode** — Beautiful dark theme by default

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, Vite, Tailwind CSS v4, Framer Motion, Recharts |
| Backend | Node.js, Express.js, MongoDB, JWT |
| AI | Google Gemini API |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```
VITE_API_URL=http://localhost:5000/api
VITE_GEMINI_API_KEY=your_key_here
```

## License

MIT
