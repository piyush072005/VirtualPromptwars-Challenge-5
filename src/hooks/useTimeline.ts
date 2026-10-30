import { useMemo } from 'react';
import { EventPlan } from '../types/event';

export function useTimeline(event: EventPlan) {
  const calculations = useMemo(() => {
    const totalMilestones = event.macroMilestones.length;
    const completedMilestones = event.macroMilestones.filter((m) => m.completed).length;
    const milestonePercentage =
      totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    const totalTasks = event.dayOfItinerary.length;
    const completedTasks = event.dayOfItinerary.filter((t) => t.status === 'Completed').length;
    const pendingTasks = event.dayOfItinerary.filter((t) => t.status === 'Pending').length;
    const delayedTasks = event.dayOfItinerary.filter((t) => t.status === 'Delayed').length;
    const itineraryPercentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const upcomingTask = event.dayOfItinerary.find((t) => t.status === 'Pending') || null;

    // Total duration of program in hours
    const totalDurationMinutes = event.dayOfItinerary.reduce(
      (acc, t) => acc + (t.durationMinutes || 0),
      0
    );
    const totalProgramHours = (totalDurationMinutes / 60).toFixed(1);

    return {
      totalMilestones,
      completedMilestones,
      milestonePercentage,
      totalTasks,
      completedTasks,
      pendingTasks,
      delayedTasks,
      itineraryPercentage,
      upcomingTask,
      totalDurationMinutes,
      totalProgramHours
    };
  }, [event.macroMilestones, event.dayOfItinerary]);

  return calculations;
}
