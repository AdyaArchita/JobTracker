import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Briefcase, Mail, Lock, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!', { icon: '👋' });
      navigate('/');
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || 'Login failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/[0.07] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/[0.05] rounded-full blur-3xl" />
      </div>

      {/* Theme toggle (top right) */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2.5 rounded-xl glass text-surface-400 hover:text-surface-200 transition-all duration-200 z-10"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      <div className="w-full max-w-[420px] animate-slide-up relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center mx-auto mb-5 shadow-glow-lg p-1">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight pb-1">
            <span className="text-gradient pr-1">Job</span>
            <span className="text-slate-900 dark:text-surface-200">Tracker</span>
          </h1>
          <p className="text-surface-400 mt-2.5 text-[15px]">
            Welcome back. Sign in to continue.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-modal p-8 space-y-5">
          <Input
            label="Email"
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            icon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Password"
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            icon={<Lock className="w-4 h-4" />}
          />

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full !py-3"
            size="lg"
            id="login-submit-button"
          >
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-surface-400 mt-8">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-brand-400 hover:text-brand-300 font-semibold transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
