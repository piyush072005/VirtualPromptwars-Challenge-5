import { describe, it, expect, beforeEach } from 'vitest';
import { loadSafeEvents, saveSafeEvents } from '../utils/storageSecurity';
import { INITIAL_EVENTS } from '../data/mockEvents';

describe('Storage Security & Runtime Persistence', () => {
  const TEST_KEY = 'test_eventvibe_storage';

  beforeEach(() => {
    localStorage.clear();
  });

  it('returns INITIAL_EVENTS when storage is empty', () => {
    const loaded = loadSafeEvents(TEST_KEY);
    expect(loaded).toEqual(INITIAL_EVENTS);
  });

  it('recovers safely with INITIAL_EVENTS when storage has corrupted non-JSON data', () => {
    localStorage.setItem(TEST_KEY, 'INVALID_MALFORMED_JSON_STRING{{{');
    const loaded = loadSafeEvents(TEST_KEY);
    expect(loaded).toEqual(INITIAL_EVENTS);
  });

  it('recovers safely with INITIAL_EVENTS when schema validation fails (tampered missing fields)', () => {
    const tamperedData = [{ invalidField: true }];
    localStorage.setItem(TEST_KEY, JSON.stringify(tamperedData));
    const loaded = loadSafeEvents(TEST_KEY);
    expect(loaded).toEqual(INITIAL_EVENTS);
  });

  it('persists and loads valid events with integrity intact', () => {
    const success = saveSafeEvents(TEST_KEY, INITIAL_EVENTS);
    expect(success).toBe(true);

    const loaded = loadSafeEvents(TEST_KEY);
    expect(loaded.length).toBe(INITIAL_EVENTS.length);
    expect(loaded[0].name).toBe(INITIAL_EVENTS[0].name);
  });
});

