import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Application, ApplicationStatus } from '../types';
import { ApplicationCard } from './ApplicationCard';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  status: ApplicationStatus;
  applications: Application[];
  onCardClick: (application: Application) => void;
}

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  'Applied': 'from-brand-500 to-indigo-500',
  'Phone Screen': 'from-blue-500 to-cyan-500',
  'Interview': 'from-amber-500 to-orange-500',
  'Offer': 'from-emerald-500 to-teal-500',
  'Rejected': 'from-rose-500 to-red-500',
};

export function KanbanColumn({
  status,
  applications,
  onCardClick,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div className="flex flex-col flex-shrink-0 w-80 lg:w-[22%] h-full group">
      {/* Column Header */}
      <div className="flex items-center justify-between px-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className={`w-1.5 h-6 rounded-full bg-gradient-to-b ${STATUS_COLORS[status]}`} />
          <h2 className="font-bold text-surface-900 dark:text-white tracking-tight">
            {status}
          </h2>
          <span className="px-2 py-0.5 rounded-full bg-surface-200 dark:bg-white/5 text-[11px] font-bold text-surface-500 dark:text-surface-400">
            {applications.length}
          </span>
        </div>
        
        <button className="p-1.5 rounded-lg text-surface-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface-100 dark:hover:bg-white/5">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Droppable Area */}
      <div
        ref={setNodeRef}
        className="flex-1 flex flex-col gap-3 p-2 rounded-2xl bg-surface-100/20 dark:bg-white/[0.02] border border-transparent group-hover:border-surface-200 dark:group-hover:border-white/5 transition-colors overflow-y-auto no-scrollbar"
      >
        <SortableContext
          items={applications.map((app) => app._id)}
          strategy={verticalListSortingStrategy}
        >
          {applications.map((application) => (
            <ApplicationCard
              key={application._id}
              application={application}
              onClick={() => onCardClick(application)}
            />
          ))}
        </SortableContext>

        {applications.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center py-12 border-2 border-dashed border-surface-200 dark:border-white/5 rounded-2xl opacity-40">
            <p className="text-xs font-medium text-surface-400">No applications</p>
          </div>
        )}
      </div>
    </div>
  );
}
