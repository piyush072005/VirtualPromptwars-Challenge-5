import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  EventPlan, 
  BudgetItem, 
  TimelineTask, 
  VendorCard, 
  CreativeIdeation, 
  VendorQuote
} from '../types/event';
import { INITIAL_EVENTS } from '../data/mockEvents';
import { loadSafeEvents, saveSafeEvents } from '../utils/storageSecurity';
import { EventContext, TabType } from './EventContextInstance';

const STORAGE_KEY_EVENTS = 'eventvibe_ai_events';
const STORAGE_KEY_ACTIVE_ID = 'eventvibe_ai_active_id';
const STORAGE_KEY_API_KEY = 'eventvibe_ai_gemini_key';

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load events with Zod runtime validation
  const [events, setEvents] = useState<readonly EventPlan[]>(() => {
    return loadSafeEvents(STORAGE_KEY_EVENTS);
  });

  const [activeEventId, setActiveEventId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
      if (savedId) return savedId;
    } catch {
      // Ignore storage read error
    }
    return INITIAL_EVENTS[0]?.id || '';
  });

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const [apiKey, setApiKeyState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_API_KEY) || '';
    } catch {
      return '';
    }
  });

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Persist validated events to LocalStorage
  useEffect(() => {
    saveSafeEvents(STORAGE_KEY_EVENTS, events);
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, activeEventId);
    } catch {
      // Ignore storage write error
    }
  }, [activeEventId]);

  const setApiKey = useCallback((key: string) => {
    setApiKeyState(key);
    try {
      localStorage.setItem(STORAGE_KEY_API_KEY, key);
    } catch {
      // Ignore storage write error
    }
  }, []);

  const activeEvent = events.find((e) => e.id === activeEventId) || events[0] || INITIAL_EVENTS[0];

  const triggerCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d946ef', '#6366f1', '#06b6d4', '#eab308']
      });
    } catch {
      // Ignore canvas error
    }
  }, []);

  const selectEvent = useCallback((id: string) => {
    setActiveEventId(id);
  }, []);

  const createEvent = useCallback((newEvent: EventPlan) => {
    setEvents((prev) => [newEvent, ...prev]);
    setActiveEventId(newEvent.id);
    setActiveTab('dashboard');
    triggerCelebration();
  }, [triggerCelebration]);

  const updateActiveEvent = useCallback((updated: Partial<EventPlan>) => {
    setEvents((prev) =>
      prev.map((item) =>
        item.id === activeEvent.id
          ? { ...item, ...updated, updatedAt: new Date().toISOString() }
          : item
      )
    );
  }, [activeEvent.id]);

  const deleteEvent = useCallback((id: string) => {
    if (events.length <= 1) {
      alert("At least one event plan must be preserved. Create another before deleting this one.");
      return;
    }
    const filtered = events.filter((e) => e.id !== id);
    setEvents(filtered);
    if (activeEventId === id) {
      setActiveEventId(filtered[0].id);
    }
  }, [events, activeEventId]);

  const resetToSampleData = useCallback(() => {
    setEvents(INITIAL_EVENTS);
    setActiveEventId(INITIAL_EVENTS[0].id);
    setActiveTab('dashboard');
  }, []);

  // Budget Operations
  const addBudgetItem = useCallback((item: Omit<BudgetItem, 'id'>) => {
    const newItem: BudgetItem = {
      ...item,
      id: 'b-' + Date.now() + Math.random().toString(36).substring(2, 5)
    };
    updateActiveEvent({
      budgetItems: [...activeEvent.budgetItems, newItem]
    });
  }, [activeEvent.budgetItems, updateActiveEvent]);

  const updateBudgetItem = useCallback((id: string, updates: Partial<BudgetItem>) => {
    const updatedItems = activeEvent.budgetItems.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    updateActiveEvent({ budgetItems: updatedItems });
  }, [activeEvent.budgetItems, updateActiveEvent]);

  const deleteBudgetItem = useCallback((id: string) => {
    const updatedItems = activeEvent.budgetItems.filter((item) => item.id !== id);
    updateActiveEvent({ budgetItems: updatedItems });
  }, [activeEvent.budgetItems, updateActiveEvent]);

  // Timeline Operations
  const addTimelineTask = useCallback((task: Omit<TimelineTask, 'id'>) => {
    const newTask: TimelineTask = {
      ...task,
      id: 't-' + Date.now() + Math.random().toString(36).substring(2, 5)
    };
    updateActiveEvent({
      dayOfItinerary: [...activeEvent.dayOfItinerary, newTask]
    });
  }, [activeEvent.dayOfItinerary, updateActiveEvent]);

  const updateTimelineTask = useCallback((id: string, updates: Partial<TimelineTask>) => {
    const updatedTasks = activeEvent.dayOfItinerary.map((task) => {
      if (task.id === id) {
        if (updates.status === 'Completed' && task.status !== 'Completed') {
          triggerCelebration();
        }
        return { ...task, ...updates };
      }
      return task;
    });
    updateActiveEvent({ dayOfItinerary: updatedTasks });
  }, [activeEvent.dayOfItinerary, updateActiveEvent, triggerCelebration]);

  const deleteTimelineTask = useCallback((id: string) => {
    const updatedTasks = activeEvent.dayOfItinerary.filter((t) => t.id !== id);
    updateActiveEvent({ dayOfItinerary: updatedTasks });
  }, [activeEvent.dayOfItinerary, updateActiveEvent]);

  const reorderTimelineTask = useCallback((startIndex: number, endIndex: number) => {
    const list = Array.from(activeEvent.dayOfItinerary);
    const [removed] = list.splice(startIndex, 1);
    list.splice(endIndex, 0, removed);
    updateActiveEvent({ dayOfItinerary: list });
  }, [activeEvent.dayOfItinerary, updateActiveEvent]);

  const toggleMilestone = useCallback((id: string) => {
    const updatedMilestones = activeEvent.macroMilestones.map((m) => {
      if (m.id === id) {
        const nextState = !m.completed;
        if (nextState) triggerCelebration();
        return { ...m, completed: nextState };
      }
      return m;
    });
    updateActiveEvent({ macroMilestones: updatedMilestones });
  }, [activeEvent.macroMilestones, updateActiveEvent, triggerCelebration]);

  // Vendor Operations with Cross-Pillar Synchronization
  const addVendorCard = useCallback((card: Omit<VendorCard, 'id'>) => {
    const newVendorId = 'v-' + Date.now() + Math.random().toString(36).substring(2, 5);
    const newVendor: VendorCard = {
      ...card,
      id: newVendorId
    };
    updateActiveEvent({
      vendors: [...activeEvent.vendors, newVendor]
    });
  }, [activeEvent.vendors, updateActiveEvent]);

  const updateVendorCard = useCallback((id: string, updates: Partial<VendorCard>) => {
    const updatedVendors = activeEvent.vendors.map((v) =>
      v.id === id ? { ...v, ...updates } : v
    );
    updateActiveEvent({ vendors: updatedVendors });
  }, [activeEvent.vendors, updateActiveEvent]);

  const deleteVendorCard = useCallback((id: string) => {
    const updatedVendors = activeEvent.vendors.filter((v) => v.id !== id);
    updateActiveEvent({ vendors: updatedVendors });
  }, [activeEvent.vendors, updateActiveEvent]);

  const addVendorQuote = useCallback((vendorId: string, quote: Omit<VendorQuote, 'id'>) => {
    const newQuote: VendorQuote = {
      ...quote,
      id: 'q-' + Date.now() + Math.random().toString(36).substring(2, 5)
    };
    const updatedVendors = activeEvent.vendors.map((v) => {
      if (v.id === vendorId) {
        return { ...v, quotes: [...v.quotes, newQuote] };
      }
      return v;
    });
    updateActiveEvent({ vendors: updatedVendors });
  }, [activeEvent.vendors, updateActiveEvent]);

  /**
   * Explicit Synchronization: When a vendor quote is selected,
   * it synchronizes with the active Budget line item, updating estimated and actual cost!
   */
  const selectQuote = useCallback((vendorId: string, quoteId: string) => {
    const vendor = activeEvent.vendors.find((v) => v.id === vendorId);
    if (!vendor) return;

    const selectedQuote = vendor.quotes.find((q) => q.id === quoteId);
    if (!selectedQuote) return;

    // 1. Update vendor quotes and status
    const updatedVendors = activeEvent.vendors.map((v) => {
      if (v.id === vendorId) {
        const updatedQuotes = v.quotes.map((q) => ({
          ...q,
          isSelected: q.id === quoteId
        }));
        return {
          ...v,
          quotes: updatedQuotes,
          estimatedCost: selectedQuote.quoteAmount,
          status: 'Quoted' as const
        };
      }
      return v;
    });

    // 2. Cross-pillar sync to budget items
    const updatedBudgetItems = activeEvent.budgetItems.map((b) => {
      if (b.vendorId === vendorId || (vendor.linkedBudgetItemId && b.id === vendor.linkedBudgetItemId)) {
        return {
          ...b,
          actualCost: selectedQuote.quoteAmount,
          notes: `Updated from selected bid: ${selectedQuote.vendorName} (${activeEvent.currency}${selectedQuote.quoteAmount.toLocaleString()})`
        };
      }
      return b;
    });

    updateActiveEvent({
      vendors: updatedVendors,
      budgetItems: updatedBudgetItems
    });
  }, [activeEvent.vendors, activeEvent.budgetItems, activeEvent.currency, updateActiveEvent]);

  const updateIdeation = useCallback((ideationUpdates: Partial<CreativeIdeation>) => {
    updateActiveEvent({
      ideation: {
        ...activeEvent.ideation,
        ...ideationUpdates
      }
    });
  }, [activeEvent.ideation, updateActiveEvent]);

  return (
    <EventContext.Provider
      value={{
        events,
        activeEvent,
        activeTab,
        setActiveTab,
        selectEvent,
        createEvent,
        updateActiveEvent,
        deleteEvent,
        resetToSampleData,
        addBudgetItem,
        updateBudgetItem,
        deleteBudgetItem,
        addTimelineTask,
        updateTimelineTask,
        deleteTimelineTask,
        reorderTimelineTask,
        toggleMilestone,
        addVendorCard,
        updateVendorCard,
        deleteVendorCard,
        addVendorQuote,
        selectQuote,
        updateIdeation,
        apiKey,
        setApiKey,
        isApiKeyModalOpen,
        setIsApiKeyModalOpen,
        isExportModalOpen,
        setIsExportModalOpen,
        triggerCelebration
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
