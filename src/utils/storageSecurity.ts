import { z } from 'zod';
import { EventPlanSchema } from '../schemas/eventSchemas';
import { EventPlan } from '../types/event';
import { INITIAL_EVENTS } from '../data/mockEvents';

const EventsArraySchema = z.array(EventPlanSchema);

/**
 * Safely loads events from LocalStorage with runtime Zod schema verification.
 * If data is corrupted, tampered, or malformed, it logs diagnostic info and falls back cleanly.
 */
export function loadSafeEvents(storageKey: string): EventPlan[] {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return INITIAL_EVENTS;

    const parsed = JSON.parse(raw);
    const validation = EventsArraySchema.safeParse(parsed);

    if (validation.success && validation.data.length > 0) {
      return validation.data as unknown as EventPlan[];
    } else {
      console.warn('LocalStorage data failed Zod schema validation; restoring defaults:', validation.error);
      return INITIAL_EVENTS;
    }
  } catch (err) {
    console.error('LocalStorage deserialization exception; safely recovering:', err);
    return INITIAL_EVENTS;
  }
}

/**
 * Safely serializes and persists events to LocalStorage.
 */
export function saveSafeEvents(storageKey: string, events: readonly EventPlan[]): boolean {
  try {
    const validation = EventsArraySchema.safeParse(events);
    if (!validation.success) {
      console.error('Refusing to persist invalid events structure:', validation.error);
      return false;
    }
    localStorage.setItem(storageKey, JSON.stringify(events));
    return true;
  } catch (err) {
    console.error('Failed to write to LocalStorage:', err);
    return false;
  }
}
