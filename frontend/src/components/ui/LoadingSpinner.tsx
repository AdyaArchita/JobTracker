export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-[1.5px]',
    md: 'w-7 h-7 border-2',
    lg: 'w-10 h-10 border-2',
  };

  return (
    <div className="flex items-center justify-center" role="status" aria-label="Loading">
      <div
        className={`${sizeClasses[size]} border-surface-700 dark:border-surface-700 border-t-brand-500 rounded-full animate-spin`}
      />
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-surface-950 dark:bg-surface-950">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-surface-800 border-t-brand-500 rounded-full animate-spin" />
          <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-r-brand-400/30 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
        <p className="text-surface-500 text-sm font-medium animate-pulse-soft">Loading...</p>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-card p-4 space-y-3 animate-fade-in">
      <div className="shimmer h-3 w-24" />
      <div className="shimmer h-4 w-40" />
      <div className="flex items-center justify-between">
        <div className="shimmer h-5 w-16 rounded-full" />
        <div className="shimmer h-3 w-20" />
      </div>
    </div>
  );
}

export function SkeletonBoard() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 px-4 sm:px-6 lg:px-8 h-full">
      {Array.from({ length: 5 }).map((_, colIdx) => (
        <div key={colIdx} className="kanban-column">
          <div className="px-4 py-3 border-b border-surface-800/60">
            <div className="shimmer h-5 w-24" />
          </div>
          <div className="p-3 space-y-3">
            {Array.from({ length: colIdx === 0 ? 3 : colIdx < 3 ? 1 : 0 }).map((_, cardIdx) => (
              <SkeletonCard key={cardIdx} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
