import { z } from 'zod';

export const EventTypeSchema = z.enum([
  'Wedding',
  'Milestone Birthday',
  'Community Festival / Fundraiser',
  'Corporate Gathering',
  'Anniversary Gala',
  'Baby Shower / Family Celebration'
]);

export const TaskStatusSchema = z.enum(['Pending', 'Completed', 'Delayed']);

export const VendorStatusSchema = z.enum([
  'Researching',
  'Contacted',
  'Quoted',
  'Hired',
  'Declined'
]);

export const SettingSchema = z.enum(['Indoor', 'Outdoor', 'Hybrid']);

export const PrioritySchema = z.enum(['High', 'Medium', 'Low']);

export const TaskCategorySchema = z.enum([
  'Setup',
  'Ceremony',
  'Reception',
  'Program',
  'Teardown',
  'Buffer'
]);

export const VendorCategorySchema = z.enum([
  'Venue',
  'Catering & Bar',
  'Photography / Video',
  'Music & DJ',
  'Florist & Decor',
  'Permits & Security',
  'Rentals',
  'Planner / Staff'
]);

export const BudgetItemSchema = z.object({
  id: z.string().min(1),
  category: z.string().min(1),
  name: z.string().min(1),
  estimatedCost: z.number().nonnegative(),
  actualCost: z.number().nonnegative(),
  paid: z.boolean(),
  vendorId: z.string().optional(),
  notes: z.string().optional(),
  isContingency: z.boolean().optional()
});

export const TimelineTaskSchema = z.object({
  id: z.string().min(1),
  time: z.string().min(1),
  title: z.string().min(1),
  durationMinutes: z.number().positive(),
  owner: z.string().min(1),
  status: TaskStatusSchema,
  notes: z.string().optional(),
  category: TaskCategorySchema,
  linkedVendorId: z.string().optional()
});

export const MacroMilestoneSchema = z.object({
  id: z.string().min(1),
  timeframe: z.enum([
    'T-6 months',
    'T-3 months',
    'T-1 month',
    'T-2 weeks',
    'T-1 week',
    'Day Before'
  ]),
  title: z.string().min(1),
  description: z.string().min(1),
  completed: z.boolean(),
  dueDate: z.string().optional(),
  priority: PrioritySchema,
  linkedVendorCategory: VendorCategorySchema.optional()
});

export const VendorQuoteSchema = z.object({
  id: z.string().min(1),
  vendorName: z.string().min(1),
  quoteAmount: z.number().nonnegative(),
  inclusions: z.array(z.string()),
  pros: z.string(),
  cons: z.string(),
  isSelected: z.boolean().optional()
});

export const VendorCardSchema = z.object({
  id: z.string().min(1),
  category: VendorCategorySchema,
  name: z.string().min(1),
  status: VendorStatusSchema,
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  estimatedCost: z.number().nonnegative(),
  vettedQuestions: z.array(
    z.object({
      question: z.string().min(1),
      answer: z.string().optional()
    })
  ),
  redFlagsToCheck: z.array(
    z.object({
      flag: z.string().min(1),
      checked: z.boolean()
    })
  ),
  quotes: z.array(VendorQuoteSchema),
  contractSigned: z.boolean(),
  linkedBudgetItemId: z.string().optional()
});

export const ColorSwatchSchema = z.object({
  hex: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Invalid HEX color code'),
  name: z.string().min(1),
  usage: z.string().min(1)
});

export const DecorConceptSchema = z.object({
  category: z.string().min(1),
  suggestion: z.string().min(1),
  promptForVisuals: z.string()
});

export const CocktailSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['Cocktail', 'Mocktail']),
  ingredients: z.string().min(1),
  flavorNotes: z.string().min(1)
});

export const CateringCourseSchema = z.object({
  course: z.string().min(1),
  dishName: z.string().min(1),
  dietaryTags: z.array(z.string()),
  description: z.string().min(1)
});

export const MenuCuratorSchema = z.object({
  cocktails: z.array(CocktailSchema),
  cateringCourses: z.array(CateringCourseSchema),
  pairings: z.array(z.string())
});

export const ToastOutlineSchema = z.object({
  section: z.string().min(1),
  talkingPoints: z.string().min(1),
  durationEstimate: z.string().min(1)
});

export const SignageSchema = z.object({
  signType: z.string().min(1),
  text: z.string().min(1)
});

export const ContentDraftsSchema = z.object({
  invitationCopyFormal: z.string(),
  invitationCopyCasual: z.string(),
  toastSpeechOutline: z.array(ToastOutlineSchema),
  signageText: z.array(SignageSchema)
});

export const CreativeIdeationSchema = z.object({
  themeTitle: z.string().min(1),
  vibeStatement: z.string().min(1),
  colorPalette: z.array(ColorSwatchSchema).min(1),
  decorAndLighting: z.array(DecorConceptSchema),
  menuAndBeverages: MenuCuratorSchema,
  contentAndScripts: ContentDraftsSchema
});

export const EventPlanSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  eventType: EventTypeSchema,
  date: z.string().min(1),
  time: z.string(),
  location: z.string().min(1),
  guestCount: z.number().int().positive(),
  demographics: z.string(),
  setting: SettingSchema,
  vibeTone: z.string().min(1),
  currency: z.string().min(1),
  totalBudget: z.number().nonnegative(),
  budgetItems: z.array(BudgetItemSchema),
  macroMilestones: z.array(MacroMilestoneSchema),
  dayOfItinerary: z.array(TimelineTaskSchema),
  vendors: z.array(VendorCardSchema),
  ideation: CreativeIdeationSchema,
  customNotes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const AICostOptimizationSuggestionSchema = z.object({
  category: z.string().min(1),
  currentExpense: z.number().nonnegative(),
  potentialSavings: z.number().nonnegative(),
  title: z.string().min(1),
  recommendation: z.string().min(1),
  tradeOff: z.string().min(1)
});

export type EventPlanValidated = z.infer<typeof EventPlanSchema>;
export type BudgetItemValidated = z.infer<typeof BudgetItemSchema>;
export type TimelineTaskValidated = z.infer<typeof TimelineTaskSchema>;
export type MacroMilestoneValidated = z.infer<typeof MacroMilestoneSchema>;
export type VendorCardValidated = z.infer<typeof VendorCardSchema>;
export type CreativeIdeationValidated = z.infer<typeof CreativeIdeationSchema>;
export type AICostOptimizationSuggestionValidated = z.infer<typeof AICostOptimizationSuggestionSchema>;
