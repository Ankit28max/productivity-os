# ProductivityOS — Task Checklist

## Phase 1 — Foundation
- [x] Project scaffolding (Vite + React 19)
- [x] Install all frontend dependencies
- [x] Create folder structure
- [x] Tailwind v4 configuration + design system
- [x] Routing (AppRoutes, ProtectedRoute, lazy pages)
- [x] Context (AuthContext, SidebarContext)
- [x] Reusable UI components (Button, Input, Modal, Card, Badge, Avatar, Spinner, Skeleton, SearchBar, ProgressBar, EmptyState)
- [x] Dashboard layout (Sidebar, Navbar, DashboardLayout)
- [x] All pages created (12 total)
- [x] Git init + committed
- [x] Build verified (production build passes)
- [x] Dev server running

## Phase 2 — Redesign & Task Manager
- [x] Complete visual redesign of design system with Nebula cyber-glass theme
- [x] Connect dynamic tasks counts, lists, and productivity score metrics to DashboardPage
- [x] Create TaskContext to manage in-memory CRUD operations persisted in localStorage
- [x] Implement TaskCard UI component with priority neon glow indicators and relative due dates
- [x] Create TaskFilters component with search bar, priority, status, category dropdown filters, and sorting methods
- [x] Create TaskModal form with react-hook-form, standard styling inputs, select options for priority and status
- [x] Connect TasksPage layout with list animation lists, filter callbacks, and modals triggers
- [x] Staged and committed changes

## Phase 3 — Notes Module
- [x] Create NoteContext with CRUD actions, pin/archive state toggles, and simulated Gemini AI summarization and flashcards methods
- [x] Implement NoteCard UI component with custom card design, relative date display, and bookmark style pins
- [x] Create NoteFilters component with title search, active/archived folder tabs, and tag pills
- [x] Implement NoteModal editor with split layouts to display AI Summary and AI Flashcards outputs
- [x] Connect NotesPage layout, connecting NoteContext state, dynamic category lists, and modals
- [x] Staged and committed changes

## Phase 4 — Habit Tracker
- [x] Create HabitContext to transact list of habits, toggle check-ins history, and calculate streaks
- [x] Implement HabitCard UI component with horizontal 7-day checks, streaks, and 30-day progress
- [x] Create HabitModal with name inputs, emoji selector, and color categories
- [x] Connect HabitsPage with stats cards, habits grids, achievements sidebar, and modals triggers
- [x] Integrate dynamic habits check-ins and streaks preview to DashboardPage
- [x] Staged and committed changes

## Phase 5 — Goals & Calendar
- [x] Create `src/context/GoalContext.jsx` for goals and milestone checklists
- [x] Add `GoalProvider` wrapper to `src/App.jsx`
- [x] Implement `src/pages/GoalsPage.jsx` displaying goal progress cards, milestone checkmarks, and AI milestones suggestion
- [x] Implement `src/pages/CalendarPage.jsx` monthly planner, showing task and goal indicators on matching days, with day detail overlays

## Phase 6 — Analytics, AI, & Backend
- [x] Build `src/pages/AnalyticsPage.jsx` with Recharts charts (task trends, habit heatmaps, focus logs)
- [x] Create API service `src/services/ai.service.js` using local Gemini integration with `VITE_GEMINI_API_KEY`
- [x] Implement chat workspace in `src/pages/AIPage.jsx`
- [x] Scaffold Express.js backend schema skeletons inside `server/`

## Phase 7 — Landing Page & Light Mode
- [x] Create `src/context/ThemeContext.jsx` for theme switcher state
- [x] Register `ThemeProvider` in `src/App.jsx`
- [x] Update `src/utils/constants.js` to change `ROUTES.DASHBOARD` to `/dashboard`
- [x] Implement `src/pages/LandingPage.jsx` public landing page
- [x] Update `src/routes/AppRoutes.jsx` to map routes
- [x] Update `src/index.css` to define light mode styles using CSS variables
- [x] Update `src/components/layout/Navbar.jsx` to include the theme toggle button

## Phase 8 — Backend Controllers & Routing
- [x] Create `server/middleware/auth.js` for JWT verification
- [x] Create `server/routes/auth.js` with Register & Login API handlers
- [x] Create `server/routes/tasks.js` with CRUD Task database APIs
- [x] Create `server/routes/notes.js` with CRUD Note database APIs
- [x] Create `server/routes/habits.js` with CRUD Habit database APIs and check-in toggles
- [x] Create `server/routes/goals.js` with CRUD Goal database APIs and milestone toggles
- [x] Update `server/server.js` to register all secure API paths
