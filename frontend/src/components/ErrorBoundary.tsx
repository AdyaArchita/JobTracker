import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

/**
 * @file components/ErrorBoundary.tsx
 * Professional React Error Boundary to catch UI crashes gracefully.
 * Prevents the entire application from unmounting when a specific component fails.
 */

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] w-full flex flex-col items-center justify-center p-8 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 backdrop-blur-sm animate-in fade-in zoom-in duration-300">
          <div className="p-4 bg-rose-50 rounded-full mb-6">
            <AlertCircle className="w-12 h-12 text-rose-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Something went wrong
          </h2>
          
          <p className="text-slate-500 text-center max-w-sm mb-8 italic">
            "The Career Copilot hit an unexpected turbulence. We've logged the issue and are ready to resume."
          </p>

          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-200/50"
          >
            <RefreshCcw className="w-4 h-4" />
            Reload Component
          </button>
          
          {import.meta.env.DEV && (
            <details className="mt-8 p-4 bg-slate-100 rounded-lg text-xs font-mono text-slate-600 max-w-2xl overflow-auto border border-slate-200">
              <summary className="cursor-pointer hover:underline mb-2">View Error Details</summary>
              <pre className="whitespace-pre-wrap">{this.state.error?.toString()}</pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
