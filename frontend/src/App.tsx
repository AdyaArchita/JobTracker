import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  },
});

function AppToaster() {
  const { isDark } = useTheme();

  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3000,
        style: isDark
          ? {
              background: '#1e293b',
              color: '#e2e8f0',
              border: '1px solid rgba(51, 65, 85, 0.4)',
              borderRadius: '14px',
              fontSize: '13px',
              fontWeight: '500',
              padding: '12px 16px',
              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.2)',
            }
          : {
              background: '#ffffff',
              color: '#1e293b',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              borderRadius: '14px',
              fontSize: '13px',
              fontWeight: '500',
              padding: '12px 16px',
              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.08)',
            },
        success: {
          iconTheme: {
            primary: '#6366f1',
            secondary: isDark ? '#e2e8f0' : '#ffffff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: isDark ? '#e2e8f0' : '#ffffff',
          },
        },
      }}
    />
  );
}

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <AppToaster />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
