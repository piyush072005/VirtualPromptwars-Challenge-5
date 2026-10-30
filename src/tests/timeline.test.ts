import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTimeline } from '../hooks/useTimeline';
import { EventPlan } from '../types/event';
import { INITIAL_EVENTS } from '../data/mockEvents';

describe('useTimeline Hook', () => {
  const mockPlan: EventPlan = {
    ...INITIAL_EVENTS[0],
    macroMilestones: [
      { id: 'm-1', timeframe: 'T-6 months', title: 'Site Selection', description: 'Lock venue hold', completed: true, priority: 'High' },
      { id: 'm-2', timeframe: 'T-3 months', title: 'Invitations', description: 'Send RSVP invites', completed: true, priority: 'High' },
      { id: 'm-3', timeframe: 'T-1 month', title: 'Walkthrough', description: 'Finalize run of show', completed: false, priority: 'Medium' }
    ],
    dayOfItinerary: [
      { id: 't-1', time: '08:00', title: 'Setup', durationMinutes: 120, owner: 'Lead', status: 'Completed', category: 'Setup' },
      { id: 't-2', time: '14:00', title: 'Ceremony', durationMinutes: 60, owner: 'Host', status: 'Pending', category: 'Ceremony' },
      { id: 't-3', time: '17:00', title: 'Dinner', durationMinutes: 90, owner: 'Caterer', status: 'Pending', category: 'Reception' }
    ]
  };

  it('computes correct milestone completion statistics', () => {
    const { result } = renderHook(() => useTimeline(mockPlan));
    expect(result.current.totalMilestones).toBe(3);
    expect(result.current.completedMilestones).toBe(2);
    // 2 completed out of 3 milestones = 67%
    expect(result.current.milestonePercentage).toBe(67);
  });

  it('computes correct day-of task statistics', () => {
    const { result } = renderHook(() => useTimeline(mockPlan));
    expect(result.current.totalTasks).toBe(3);
    expect(result.current.completedTasks).toBe(1);
    expect(result.current.pendingTasks).toBe(2);
    // 1 completed out of 3 tasks = 33%
    expect(result.current.itineraryPercentage).toBe(33);
  });

  it('identifies upcoming pending task and calculates total duration in hours', () => {
    const { result } = renderHook(() => useTimeline(mockPlan));
    expect(result.current.upcomingTask?.id).toBe('t-2');
    // 120 + 60 + 90 = 270 minutes = 4.5 hours
    expect(result.current.totalDurationMinutes).toBe(270);
    expect(result.current.totalProgramHours).toBe('4.5');
  });
});
