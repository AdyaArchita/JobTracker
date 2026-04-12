import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Application, ApplicationStatus } from '../types';
import { Building2, MapPin, Calendar, ExternalLink, Clock, Briefcase, Sparkles } from 'lucide-react';
import { format, formatDistanceToNow, differenceInDays } from 'date-fns';
import { MatchScore } from './ui/MatchScore';

interface ApplicationCardProps {
  application: Application;
  onClick: () => void;
}

const STATUS_SHADOWS: Record<ApplicationStatus, string> = {
  'Applied': 'hover:shadow-brand-500/10',
  'Phone Screen': 'hover:shadow-blue-500/10',
  'Interview': 'hover:shadow-amber-500/10',
  'Offer': 'hover:shadow-emerald-500/10',
  'Rejected': 'hover:shadow-rose-500/10',
};

const STATUS_GLOWS: Record<ApplicationStatus, string> = {
  'Applied': 'group-hover:border-brand-500/30',
  'Phone Screen': 'group-hover:border-blue-500/30',
  'Interview': 'group-hover:border-amber-500/30',
  'Offer': 'group-hover:border-emerald-500/30',
  'Rejected': 'group-hover:border-rose-500/30',
};

/**
 * Component: ApplicationCard
 * Interactive Kanban card representation of a job application.
 * Integrates dnd-kit for sortable drag-and-drop functionality and 
 * provides automated visual feedback for overdue status.
 */
export function ApplicationCard({ application, onClick }: ApplicationCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: application._id });

  const updatedAt = application.updatedAt ? new Date(application.updatedAt) : new Date();
  const isOverdue = 
    application.status !== 'Rejected' && 
    application.status !== 'Offer' && 
    !isNaN(updatedAt.getTime()) &&
    differenceInDays(new Date(), updatedAt) >= 7;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="w-full h-32 rounded-2xl bg-surface-100/50 dark:bg-white/5 border-2 border-dashed border-surface-200 dark:border-white/10 opacity-50"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`group relative w-full glass-card p-4 cursor-grab active:cursor-grabbing select-none 
                 hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] 
                 border-surface-200/50 dark:border-white/5 ${STATUS_GLOWS[application.status]} ${STATUS_SHADOWS[application.status]}
                 shadow-lg hover:shadow-2xl transition-all duration-300`}
    >
      <div className={`absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-r ${
        application.status === 'Offer' ? 'from-emerald-400 to-teal-400 animate-pulse' :
        application.status === 'Rejected' ? 'from-rose-400 to-red-400' :
        application.status === 'Interview' ? 'from-amber-400 to-orange-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]' :
        application.status === 'Phone Screen' ? 'from-blue-400 to-cyan-400' :
        'from-brand-400 to-indigo-400'
      }`} />

      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex flex-wrap gap-1.5">
          {application.priority && (
            <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-widest ${
              application.priority === 'High' ? 'bg-red-500/15 text-red-500 dark:text-red-400' :
              application.priority === 'Low' ? 'bg-blue-500/15 text-blue-500 dark:text-blue-400' :
              'bg-amber-500/15 text-amber-500 dark:text-amber-400'
            }`}>
              {application.priority}
            </span>
          )}
          {isOverdue && (
            <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-widest bg-orange-500/15 text-orange-500 dark:text-orange-400 animate-pulse border border-orange-500/20">
              ⚠️ Overdue
            </span>
          )}
        </div>
        {application.matchScore > 0 ? (
          <div title="Match Score" className="shrink-0 -mt-1 -mr-1">
             <MatchScore score={application.matchScore} size="sm" />
          </div>
        ) : (
          application.resumeBullets.length === 0 && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/20 animate-pulse shrink-0">
               <Sparkles className="w-2.5 h-2.5 text-violet-500" />
               <span className="text-[8px] font-extrabold text-violet-600 dark:text-violet-400 uppercase tracking-tighter">AI Optimizing...</span>
            </div>
          )
        )}
      </div>

      <div className="space-y-3">
        <div className="pr-1">
          <h4 className="font-bold text-surface-950 dark:text-white truncate leading-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {application.role}
          </h4>
          <div className="flex items-center gap-1.5 mt-1 text-surface-500 dark:text-surface-400">
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs font-semibold truncate uppercase tracking-wider">{application.company}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <div title={application.locationType} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-100/50 dark:bg-white/5 text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-tight">
            <MapPin className="w-3 h-3" />
            {application.locationType === 'Remote' 
              ? (application.location ? `Remote (${application.location})` : 'Remote')
              : (application.location || application.locationType || 'Remote')
            }
          </div>
          {application.jobType && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-100/50 dark:bg-white/5 text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-tight">
              <Briefcase className="w-3 h-3" />
              {application.jobType}
            </div>
          )}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-100/50 dark:bg-white/5 text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-tight">
            <Calendar className="w-3 h-3" />
            {application.dateApplied ? (
              isNaN(new Date(application.dateApplied).getTime()) ? 'Recent' : format(new Date(application.dateApplied), 'MMM d')
            ) : 'Recent'}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-200/50 dark:border-white/5">
        <div className="flex items-center gap-1 text-[9px] text-surface-400 dark:text-surface-500 font-medium">
          <Clock className="w-3 h-3" />
          Updated {!isNaN(updatedAt.getTime()) ? formatDistanceToNow(updatedAt, { addSuffix: true }) : 'just now'}
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <ExternalLink className="w-3.5 h-3.5 text-surface-300 dark:text-surface-600" />
        </div>
      </div>
    </div>
  );
}
