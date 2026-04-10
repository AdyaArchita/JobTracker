import { useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
} from '@dnd-kit/sortable';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Application, ApplicationStatus } from '../types';
import { updateApplicationStatus } from '../api/applications';
import { KanbanColumn } from './KanbanColumn';
import { ApplicationCard } from './ApplicationCard';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface KanbanBoardProps {
  applications: Application[];
  onCardClick: (application: Application) => void;
}

const COLUMNS: ApplicationStatus[] = [
  'Applied',
  'Phone Screen',
  'Interview',
  'Offer',
  'Rejected',
];

export function KanbanBoard({ applications, onCardClick }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Group applications by status into structured columns
  const columns = useMemo(() => {
    return COLUMNS.reduce((acc, status) => {
      acc[status] = applications.filter((app) => app.status === status);
      return acc;
    }, {} as Record<ApplicationStatus, Application[]>);
  }, [applications]);

  const activeApplication = useMemo(
    () => applications.find((app) => app._id === activeId),
    [activeId, applications]
  );

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicationStatus }) =>
      updateApplicationStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['applications'] });
      const previousApps = queryClient.getQueryData<Application[]>(['applications']);

      queryClient.setQueryData<Application[]>(['applications'], (old) => {
        if (!old) return [];
        return old.map((app) =>
          app._id === id ? { ...app, status } : app
        );
      });

      return { previousApps };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousApps) {
        queryClient.setQueryData(['applications'], context.previousApps);
      }
      toast.error('Failed to update status');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeApp = applications.find((app) => app._id === active.id);
    if (!activeApp) return;

    // Logic for dragging over a column container or another card
    const overId = over.id as string;
    const overStatus = COLUMNS.includes(overId as ApplicationStatus)
      ? (overId as ApplicationStatus)
      : applications.find((app) => app._id === overId)?.status;

    if (overStatus && activeApp.status !== overStatus) {
      mutation.mutate({ id: activeApp._id, status: overStatus });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { over } = event;
    if (!over) return;
    
    // Finalization logic if needed
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full gap-5 overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
        {COLUMNS.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            applications={columns[status]}
            onCardClick={onCardClick}
          />
        ))}
      </div>

      <DragOverlay
        dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: '0.4',
              },
            },
          }),
        }}
      >
        {activeId && activeApplication && (
          <div className="rotate-2 scale-105 transition-transform duration-200 pointer-events-none">
            <ApplicationCard
              application={activeApplication}
              onClick={() => {}}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
