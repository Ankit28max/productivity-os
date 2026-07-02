import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SidebarProvider } from './context/SidebarContext';
import { TaskProvider } from './context/TaskContext';
import { NoteProvider } from './context/NoteContext';
import { HabitProvider } from './context/HabitContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SidebarProvider>
          <TaskProvider>
            <NoteProvider>
              <HabitProvider>
                <AppRoutes />
              </HabitProvider>
            </NoteProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: 'rgba(19, 19, 43, 0.85)',
                  backdropFilter: 'blur(12px)',
                  color: '#f0f0ff',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  fontSize: '14px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                },
                success: {
                  iconTheme: {
                    primary: '#06b6d4',
                    secondary: '#f0f0ff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#f43f5e',
                    secondary: '#f0f0ff',
                  },
                },
              }}
            />
          </TaskProvider>
        </SidebarProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
