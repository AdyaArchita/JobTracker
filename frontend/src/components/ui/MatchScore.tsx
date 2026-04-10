

interface MatchScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export function MatchScore({ score, size = 'md' }: MatchScoreProps) {
  const radius = size === 'sm' ? 12 : size === 'lg' ? 24 : 18;
  const strokeWidth = size === 'sm' ? 2.5 : size === 'lg' ? 4 : 3;
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;



  const sizeClass = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-14 h-14' : 'w-10 h-10';
  const textClass = size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-sm' : 'text-xs';

  return (
    <div className={`relative flex items-center justify-center ${sizeClass}`}>
      <svg height="100%" width="100%" className="-rotate-90 transform drop-shadow-sm">
        <defs>
          <linearGradient id={`gradient-${score}`} x1="0%" y1="0%" x2="100%" y2="0%">
            {score >= 75 ? (
              <>
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#10b981" />
              </>
            ) : score >= 50 ? (
              <>
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#fbbf24" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#f87171" />
              </>
            )}
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {/* Background circle */}
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          className="text-surface-200 dark:text-white/10"
          r={normalizedRadius}
          cx="50%"
          cy="50%"
        />
        {/* Progress circle */}
        <circle
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-out' }}
          stroke={`url(#gradient-${score})`}
          strokeLinecap="round"
          filter={score >= 75 ? 'url(#glow)' : ''}
          r={normalizedRadius}
          cx="50%"
          cy="50%"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-black tabular-nums tracking-tighter ${textClass} text-surface-900 dark:text-white`}>
          {score}
        </span>
      </div>
    </div>
  );
}
