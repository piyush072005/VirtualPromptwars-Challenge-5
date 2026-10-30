export type EventType = 
  | 'Wedding'
  | 'Milestone Birthday'
  | 'Community Festival / Fundraiser'
  | 'Corporate Gathering'
  | 'Anniversary Gala'
  | 'Baby Shower / Family Celebration';

export type TaskStatus = 'Pending' | 'Completed' | 'Delayed';
export type VendorStatus = 'Researching' | 'Contacted' | 'Quoted' | 'Hired' | 'Declined';
export type PriorityLevel = 'High' | 'Medium' | 'Low';
export type EventSetting = 'Indoor' | 'Outdoor' | 'Hybrid';
export type TaskCategory = 'Setup' | 'Ceremony' | 'Reception' | 'Program' | 'Teardown' | 'Buffer';
export type VendorCategory = 
  | 'Venue' 
  | 'Catering & Bar' 
  | 'Photography / Video' 
  | 'Music & DJ' 
  | 'Florist & Decor' 
  | 'Permits & Security' 
  | 'Rentals' 
  | 'Planner / Staff';

export interface BudgetItem {
  readonly id: string;
  readonly category: string;
  readonly name: string;
  readonly estimatedCost: number;
  readonly actualCost: number;
  readonly paid: boolean;
  readonly vendorId?: string;
  readonly notes?: string;
  readonly isContingency?: boolean;
}

export interface TimelineTask {
  readonly id: string;
  readonly time: string;
  readonly title: string;
  readonly durationMinutes: number;
  readonly owner: string;
  readonly status: TaskStatus;
  readonly notes?: string;
  readonly category: TaskCategory;
  readonly linkedVendorId?: string;
}

export interface MacroMilestone {
  readonly id: string;
  readonly timeframe: 'T-6 months' | 'T-3 months' | 'T-1 month' | 'T-2 weeks' | 'T-1 week' | 'Day Before';
  readonly title: string;
  readonly description: string;
  readonly completed: boolean;
  readonly dueDate?: string;
  readonly priority: PriorityLevel;
  readonly linkedVendorCategory?: VendorCategory;
}

export interface VendorQuote {
  readonly id: string;
  readonly vendorName: string;
  readonly quoteAmount: number;
  readonly inclusions: readonly string[];
  readonly pros: string;
  readonly cons: string;
  readonly isSelected?: boolean;
}

export interface VendorCard {
  readonly id: string;
  readonly category: VendorCategory;
  readonly name: string;
  readonly status: VendorStatus;
  readonly contactPerson?: string;
  readonly phone?: string;
  readonly email?: string;
  readonly estimatedCost: number;
  readonly vettedQuestions: readonly {
    readonly question: string;
    readonly answer?: string;
  }[];
  readonly redFlagsToCheck: readonly {
    readonly flag: string;
    readonly checked: boolean;
  }[];
  readonly quotes: readonly VendorQuote[];
  readonly contractSigned: boolean;
  readonly linkedBudgetItemId?: string;
}

export interface ColorSwatch {
  readonly hex: string;
  readonly name: string;
  readonly usage: string;
}

export interface DecorConcept {
  readonly category: string;
  readonly suggestion: string;
  readonly promptForVisuals: string;
}

export interface MenuCurator {
  readonly cocktails: readonly {
    readonly name: string;
    readonly type: 'Cocktail' | 'Mocktail';
    readonly ingredients: string;
    readonly flavorNotes: string;
  }[];
  readonly cateringCourses: readonly {
    readonly course: string;
    readonly dishName: string;
    readonly dietaryTags: readonly string[];
    readonly description: string;
  }[];
  readonly pairings: readonly string[];
}

export interface ContentDrafts {
  readonly invitationCopyFormal: string;
  readonly invitationCopyCasual: string;
  readonly toastSpeechOutline: readonly {
    readonly section: string;
    readonly talkingPoints: string;
    readonly durationEstimate: string;
  }[];
  readonly signageText: readonly {
    readonly signType: string;
    readonly text: string;
  }[];
}

export interface CreativeIdeation {
  readonly themeTitle: string;
  readonly vibeStatement: string;
  readonly colorPalette: readonly ColorSwatch[];
  readonly decorAndLighting: readonly DecorConcept[];
  readonly menuAndBeverages: MenuCurator;
  readonly contentAndScripts: ContentDrafts;
}

export interface EventPlan {
  readonly id: string;
  readonly name: string;
  readonly eventType: EventType;
  readonly date: string;
  readonly time: string;
  readonly location: string;
  readonly guestCount: number;
  readonly demographics: string;
  readonly setting: EventSetting;
  readonly vibeTone: string;
  readonly currency: string;
  readonly totalBudget: number;
  readonly budgetItems: readonly BudgetItem[];
  readonly macroMilestones: readonly MacroMilestone[];
  readonly dayOfItinerary: readonly TimelineTask[];
  readonly vendors: readonly VendorCard[];
  readonly ideation: CreativeIdeation;
  readonly customNotes?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface AICostOptimizationSuggestion {
  readonly category: string;
  readonly currentExpense: number;
  readonly potentialSavings: number;
  readonly title: string;
  readonly recommendation: string;
  readonly tradeOff: string;
}

// Discriminated Union for State Transitions
export type EventAction =
  | { type: 'SET_EVENTS'; payload: readonly EventPlan[] }
  | { type: 'SELECT_EVENT'; payload: { id: string } }
  | { type: 'CREATE_EVENT'; payload: EventPlan }
  | { type: 'UPDATE_ACTIVE_EVENT'; payload: Partial<EventPlan> }
  | { type: 'DELETE_EVENT'; payload: { id: string } }
  | { type: 'ADD_BUDGET_ITEM'; payload: BudgetItem }
  | { type: 'UPDATE_BUDGET_ITEM'; payload: { id: string; updates: Partial<BudgetItem> } }
  | { type: 'DELETE_BUDGET_ITEM'; payload: { id: string } }
  | { type: 'ADD_TIMELINE_TASK'; payload: TimelineTask }
  | { type: 'UPDATE_TIMELINE_TASK'; payload: { id: string; updates: Partial<TimelineTask> } }
  | { type: 'DELETE_TIMELINE_TASK'; payload: { id: string } }
  | { type: 'REORDER_TIMELINE_TASKS'; payload: { startIndex: number; endIndex: number } }
  | { type: 'TOGGLE_MILESTONE'; payload: { id: string } }
  | { type: 'ADD_VENDOR_CARD'; payload: VendorCard }
  | { type: 'UPDATE_VENDOR_CARD'; payload: { id: string; updates: Partial<VendorCard> } }
  | { type: 'DELETE_VENDOR_CARD'; payload: { id: string } }
  | { type: 'SELECT_VENDOR_QUOTE'; payload: { vendorId: string; quoteId: string } }
  | { type: 'SYNC_VENDOR_TO_BUDGET'; payload: { vendorId: string; agreedCost: number; vendorName: string; category: string } }
  | { type: 'UPDATE_IDEATION'; payload: Partial<CreativeIdeation> };
