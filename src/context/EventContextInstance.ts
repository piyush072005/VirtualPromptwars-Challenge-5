import { createContext } from 'react';
import { 
  EventPlan, 
  BudgetItem, 
  TimelineTask, 
  VendorCard, 
  CreativeIdeation, 
  VendorQuote 
} from '../types/event';

export type TabType = 'dashboard' | 'onboarding' | 'budget' | 'timeline' | 'vendors' | 'creative' | 'export';

export interface EventContextType {
  events: readonly EventPlan[];
  activeEvent: EventPlan;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectEvent: (id: string) => void;
  createEvent: (newEvent: EventPlan) => void;
  updateActiveEvent: (updated: Partial<EventPlan>) => void;
  deleteEvent: (id: string) => void;
  resetToSampleData: () => void;
  
  // Budget operations
  addBudgetItem: (item: Omit<BudgetItem, 'id'>) => void;
  updateBudgetItem: (id: string, updates: Partial<BudgetItem>) => void;
  deleteBudgetItem: (id: string) => void;
  
  // Timeline operations
  addTimelineTask: (task: Omit<TimelineTask, 'id'>) => void;
  updateTimelineTask: (id: string, updates: Partial<TimelineTask>) => void;
  deleteTimelineTask: (id: string) => void;
  reorderTimelineTask: (startIndex: number, endIndex: number) => void;
  toggleMilestone: (id: string) => void;
  
  // Vendor operations with cross-pillar sync
  addVendorCard: (card: Omit<VendorCard, 'id'>) => void;
  updateVendorCard: (id: string, updates: Partial<VendorCard>) => void;
  deleteVendorCard: (id: string) => void;
  addVendorQuote: (vendorId: string, quote: Omit<VendorQuote, 'id'>) => void;
  selectQuote: (vendorId: string, quoteId: string) => void;
  
  // Creative Studio
  updateIdeation: (ideation: CreativeIdeation) => void;
  
  // API Key management
  apiKey: string;
  setApiKey: (key: string) => void;
  isApiKeyModalOpen: boolean;
  setIsApiKeyModalOpen: (open: boolean) => void;
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
  
  // Confetti trigger
  triggerCelebration: () => void;
}

export const EventContext = createContext<EventContextType | undefined>(undefined);

