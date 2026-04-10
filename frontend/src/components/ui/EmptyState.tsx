import { Plus, Sparkles, Briefcase } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  onAddClick: () => void;
}

export function EmptyState({ onAddClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] px-4 animate-fade-in-up">
      <div className="relative mb-8">
        {/* Background decorative glow */}
        <div className="absolute inset-0 bg-brand-500/20 blur-[80px] rounded-full animate-pulse-soft" />
        
        {/* Icon container */}
        <div className="relative glass-card p-10 rounded-[32px] border-surface-200/50 dark:border-white/10 shadow-2xl">
          <div className="relative">
            <Briefcase className="w-16 h-16 text-surface-300 dark:text-surface-700" />
            <div className="absolute -top-3 -right-3 w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/30 animate-float">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="text-center max-w-md space-y-4">
        <h3 className="text-3xl font-bold tracking-tight text-surface-950 dark:text-white">
          Start your <span className="text-gradient">dream journey</span>
        </h3>
        <p className="text-surface-500 dark:text-surface-400 text-lg leading-relaxed">
          Your job search doesn't have to be overwhelming. Add your first application and let our AI handle the boring details.
        </p>
      </div>

      <div className="mt-10">
        <Button
          onClick={onAddClick}
          size="lg"
          icon={<Plus className="w-5 h-5" />}
          className="shadow-xl shadow-brand-500/20 hover:shadow-brand-500/40"
          id="empty-state-add-button"
        >
          Add First Application
        </Button>
      </div>

      <p className="mt-8 text-sm text-surface-400 font-medium flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-brand-500" />
        AI parsing included for free
      </p>
    </div>
  );
}
