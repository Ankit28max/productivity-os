import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SidebarProvider } from './context/SidebarContext';
import { TaskProvider } from './context/TaskContext';
import { NoteProvider } from './context/NoteContext';
import { HabitProvider } from './context/HabitContext';
import { GoalProvider } from './context/GoalContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <SidebarProvider>
            <TaskProvider>
              <NoteProvider>
                <HabitProvider>
                  <GoalProvider>
                    <AppRoutes />
                  </GoalProvider>
                </HabitProvider>
              </NoteProvider>
            </TaskProvider>
          </SidebarProvider>
        </AuthProvider>
      </ThemeProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--bg-surface)',
            backdropFilter: 'blur(12px)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-default)',
            borderRadius: '16px',
            fontSize: '13px',
            boxShadow: 'var(--glass-card-shadow)',
          },
          success: {
            iconTheme: {
              primary: '#ea580c',
              secondary: 'var(--text-primary)',
            },
          },
          error: {
            iconTheme: {
              primary: '#f43f5e',
              secondary: 'var(--text-primary)',
            },
          },
        }}
      />
    </BrowserRouter>
  );
}
