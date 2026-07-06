import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import Spinner from '../components/ui/Spinner';

const LoginPage = lazy(() => import('../pages/LoginPage'));
const SignupPage = lazy(() => import('../pages/SignupPage'));
const LandingPage = lazy(() => import('../pages/LandingPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const TasksPage = lazy(() => import('../pages/TasksPage'));
const NotesPage = lazy(() => import('../pages/NotesPage'));
const HabitsPage = lazy(() => import('../pages/HabitsPage'));
const GoalsPage = lazy(() => import('../pages/GoalsPage'));
const CalendarPage = lazy(() => import('../pages/CalendarPage'));
const PomodoroPage = lazy(() => import('../pages/PomodoroPage'));
const AnalyticsPage = lazy(() => import('../pages/AnalyticsPage'));
const AIPage = lazy(() => import('../pages/AIPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Spinner size="lg" />
    </div>
  );
}

function AuthRedirect({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <AuthRedirect>
              <LandingPage />
            </AuthRedirect>
          }
        />
        <Route
          path="/login"
          element={
            <AuthRedirect>
              <LoginPage />
            </AuthRedirect>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthRedirect>
              <SignupPage />
            </AuthRedirect>
          }
        />

        {/* Protected routes — wrapped in DashboardLayout */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="habits" element={<HabitsPage />} />
          <Route path="goals" element={<GoalsPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="pomodoro" element={<PomodoroPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="ai" element={<AIPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
