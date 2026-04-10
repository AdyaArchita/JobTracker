import { ApplicationStatus } from '../../types';

interface BadgeProps {
  status: ApplicationStatus;
  size?: 'sm' | 'md';
}

const statusStyles: Record<ApplicationStatus, { badge: string; dot: string }> = {
  Applied: {
    badge: 'bg-blue-500/12 text-blue-400 dark:text-blue-400 border-blue-500/20',
    dot: 'bg-blue-400',
  },
  'Phone Screen': {
    badge: 'bg-amber-500/12 text-amber-400 dark:text-amber-400 border-amber-500/20',
    dot: 'bg-amber-400',
  },
  Interview: {
    badge: 'bg-violet-500/12 text-violet-400 dark:text-violet-400 border-violet-500/20',
    dot: 'bg-violet-400',
  },
  Offer: {
    badge: 'bg-emerald-500/12 text-emerald-400 dark:text-emerald-400 border-emerald-500/20',
    dot: 'bg-emerald-400',
  },
  Rejected: {
    badge: 'bg-red-500/12 text-red-400 dark:text-red-400 border-red-500/20',
    dot: 'bg-red-400',
  },
};

const lightStatusStyles: Record<ApplicationStatus, string> = {
  Applied: 'bg-blue-50 text-blue-600 border-blue-200/60',
  'Phone Screen': 'bg-amber-50 text-amber-600 border-amber-200/60',
  Interview: 'bg-violet-50 text-violet-600 border-violet-200/60',
  Offer: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
  Rejected: 'bg-red-50 text-red-600 border-red-200/60',
};

const sizeClasses = {
  sm: 'text-[11px] px-2 py-0.5 gap-1.5',
  md: 'text-xs px-2.5 py-1 gap-1.5',
};

export function Badge({ status, size = 'sm' }: BadgeProps) {
  const styles = statusStyles[status];

  return (
    <>
      {/* Dark badge */}
      <span
        className={`hidden dark:inline-flex items-center font-medium rounded-full border ${styles.badge} ${sizeClasses[size]}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
        {status}
      </span>
      {/* Light badge */}
      <span
        className={`inline-flex dark:hidden items-center font-medium rounded-full border ${lightStatusStyles[status]} ${sizeClasses[size]}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
        {status}
      </span>
    </>
  );
}
