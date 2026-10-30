import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBudgetCalculator } from '../hooks/useBudgetCalculator';
import { EventPlan } from '../types/event';

const mockEvent: EventPlan = {
  id: 'test-event-1',
  name: 'Test Gala',
  eventType: 'Wedding',
  date: '2026-10-15',
  time: '15:00',
  location: 'City Loft',
  guestCount: 100,
  demographics: 'Family & Peers',
  setting: 'Indoor',
  vibeTone: 'Elegance',
  currency: '$',
  totalBudget: 20000,
  budgetItems: [
    { id: '1', category: 'Venue', name: 'Hall', estimatedCost: 8000, actualCost: 8500, paid: true },
    { id: '2', category: 'Catering', name: 'Dinner', estimatedCost: 6000, actualCost: 5500, paid: false },
    { id: '3', category: 'Media', name: 'Photo', estimatedCost: 2000, actualCost: 2000, paid: true },
    { id: '4', category: 'Reserve', name: 'Emergency', estimatedCost: 2000, actualCost: 0, paid: false, isContingency: true }
  ],
  macroMilestones: [],
  dayOfItinerary: [],
  vendors: [],
  ideation: {
    themeTitle: 'Theme',
    vibeStatement: 'Vibe',
    colorPalette: [],
    decorAndLighting: [],
    menuAndBeverages: { cocktails: [], cateringCourses: [], pairings: [] },
    contentAndScripts: { invitationCopyFormal: '', invitationCopyCasual: '', toastSpeechOutline: [], signageText: [] }
  },
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01'
};

describe('useBudgetCalculator Hook', () => {
  it('correctly aggregates total estimated, actual spend, and remaining balance', () => {
    const { result } = renderHook(() => useBudgetCalculator(mockEvent));

    expect(result.current.totalBudget).toBe(20000);
    expect(result.current.totalEstimated).toBe(18000);
    expect(result.current.totalActual).toBe(16000);
    expect(result.current.remainingBalance).toBe(4000);
    expect(result.current.isOverBudget).toBe(false);
    expect(result.current.burnPercentage).toBe(80);
    expect(result.current.paidTotal).toBe(10500); // 8500 + 2000
    expect(result.current.unpaidTotal).toBe(5500); // 5500 + 0
    expect(result.current.contingencyTotal).toBe(2000);
    expect(result.current.contingencyPercent).toBe(10);
  });

  it('detects budget overrun and negative variance', () => {
    const overrunEvent: EventPlan = {
      ...mockEvent,
      totalBudget: 15000, // actual is 16000 -> overrun of 1000
    };

    const { result } = renderHook(() => useBudgetCalculator(overrunEvent));

    expect(result.current.isOverBudget).toBe(true);
    expect(result.current.remainingBalance).toBe(-1000);
    expect(result.current.burnPercentage).toBe(100);
  });

  it('handles zero budget gracefully without NaN or divide-by-zero crashes', () => {
    const zeroBudgetEvent: EventPlan = {
      ...mockEvent,
      totalBudget: 0,
      budgetItems: []
    };

    const { result } = renderHook(() => useBudgetCalculator(zeroBudgetEvent));

    expect(result.current.totalBudget).toBe(0);
    expect(result.current.burnPercentage).toBe(0);
    expect(result.current.contingencyPercent).toBe(0);
    expect(result.current.remainingBalance).toBe(0);
  });

  it('handles extreme monetary caps and decimal precision', () => {
    const extremeEvent: EventPlan = {
      ...mockEvent,
      totalBudget: 10000000,
      budgetItems: [
        { id: '1', category: 'Production', name: 'Mega Stage', estimatedCost: 4500000.5, actualCost: 4600000.75, paid: true }
      ]
    };

    const { result } = renderHook(() => useBudgetCalculator(extremeEvent));

    expect(result.current.totalActual).toBeCloseTo(4600000.75, 2);
    expect(result.current.remainingBalance).toBeCloseTo(5399999.25, 2);
  });
});
