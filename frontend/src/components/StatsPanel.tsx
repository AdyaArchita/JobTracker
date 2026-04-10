import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  Activity,
  Trophy,
  Zap,
} from 'lucide-react';
import { getApplicationStats } from '../api/applications';
import { MatchScore } from './ui/MatchScore';
import { APPLICATION_STATUSES } from '../types';

const STATUS_COLORS: Record<string, string> = {
  Applied: 'bg-blue-400',
  'Phone Screen': 'bg-amber-400',
  Interview: 'bg-violet-400',
  Offer: 'bg-emerald-400',
  Rejected: 'bg-red-400',
};

export function StatsPanel() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['applicationStats'],
    queryFn: getApplicationStats,
    refetchInterval: 30000,
  });

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 px-4 sm:px-6 lg:px-8 mb-4 animate-fade-in">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="glass-card p-4">
            <div className="shimmer h-3 w-16 mb-2" />
            <div className="shimmer h-7 w-10" />
          </div>
        ))}
      </div>
    );
  }

  const maxStatusCount = Math.max(
    ...APPLICATION_STATUSES.map((s) => stats.byStatus[s] || 0),
    1
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 mb-4 space-y-3 animate-fade-in-up">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {/* Total */}
        <div className="glass-card p-4 flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider">
              Total
            </p>
            <p className="text-2xl font-bold text-surface-100 dark:text-surface-100 mt-1 tabular-nums">
              {stats.total}
            </p>
          </div>
          <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400">
            <BarChart3 className="w-4 h-4" />
          </div>
        </div>

        {/* In Progress */}
        <div className="glass-card p-4 flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider">
              In Progress
            </p>
            <p className="text-2xl font-bold text-surface-100 dark:text-surface-100 mt-1 tabular-nums">
              {stats.inProgressCount}
            </p>
          </div>
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
            <Activity className="w-4 h-4" />
          </div>
        </div>

        {/* Offers Received */}
        <div className="glass-card p-4 flex items-start justify-between border-emerald-500/20">
          <div>
            <p className="text-[11px] font-semibold text-amber-500 uppercase tracking-wider">
              Offers
            </p>
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-teal-400 mt-1 tabular-nums">
              {stats.offersReceived}
            </p>
          </div>
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shadow-glow-sm">
            <Trophy className="w-4 h-4" />
          </div>
        </div>

        {/* Average Match Score */}
        <div className="glass-card p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider">
              Avg Match
            </p>
            <div className="mt-2 flex items-center gap-2">
               <Zap className="w-4 h-4 text-brand-500" />
               <span className="text-xl font-bold text-surface-900 dark:text-white tabular-nums">{stats.averageMatchScore}%</span>
            </div>
          </div>
          <div className="shrink-0">
             <MatchScore score={stats.averageMatchScore} size="lg" />
          </div>
        </div>

        {/* Pipeline Breakdown (wider) */}
        <div className="glass-card p-4 col-span-2 sm:col-span-4 lg:col-span-1">
          <p className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider mb-3">
            Pipeline
          </p>
          <div className="space-y-2">
            {APPLICATION_STATUSES.map((status) => {
              const count = stats.byStatus[status] || 0;
              const pct = (count / maxStatusCount) * 100;
              return (
                <div key={status} className="flex items-center gap-2">
                  <span className="text-[10px] text-surface-400 w-16 truncate font-medium">
                    {status === 'Phone Screen' ? 'Phone' : status}
                  </span>
                  <div className="flex-1 h-1.5 bg-surface-800/50 dark:bg-surface-800/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${STATUS_COLORS[status]} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-surface-400 tabular-nums w-4 text-right font-medium">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
