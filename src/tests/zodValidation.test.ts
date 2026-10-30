import { describe, it, expect } from 'vitest';
import { 
  EventPlanSchema, 
  BudgetItemSchema, 
  ColorSwatchSchema, 
  AICostOptimizationSuggestionSchema 
} from '../schemas/eventSchemas';

describe('Zod Runtime Schema Validation', () => {
  it('validates a well-formed BudgetItem', () => {
    const validItem = {
      id: 'b-100',
      category: 'Catering',
      name: 'Organic Buffet',
      estimatedCost: 5000,
      actualCost: 5200,
      paid: true,
      notes: 'Final payment sent'
    };

    const parsed = BudgetItemSchema.safeParse(validItem);
    expect(parsed.success).toBe(true);
  });

  it('rejects BudgetItem with negative costs', () => {
    const invalidItem = {
      id: 'b-100',
      category: 'Catering',
      name: 'Invalid Item',
      estimatedCost: -500,
      actualCost: 100,
      paid: false
    };

    const parsed = BudgetItemSchema.safeParse(invalidItem);
    expect(parsed.success).toBe(false);
  });

  it('validates valid HEX color codes in ColorSwatch', () => {
    const validSwatch = {
      hex: '#D97706',
      name: 'Terracotta',
      usage: 'Linens'
    };
    expect(ColorSwatchSchema.safeParse(validSwatch).success).toBe(true);

    const invalidSwatch = {
      hex: 'invalid-hex-color',
      name: 'Bad Swatch',
      usage: 'None'
    };
    expect(ColorSwatchSchema.safeParse(invalidSwatch).success).toBe(false);
  });

  it('validates AI Cost Optimization suggestion payload from LLM', () => {
    const validSuggestion = {
      category: 'Catering & Bar',
      currentExpense: 12000,
      potentialSavings: 3000,
      title: 'Opt for Signature Cocktail vs Open Bar',
      recommendation: 'Feature two bespoke cocktails alongside beer/wine.',
      tradeOff: 'Less liquor variety.'
    };

    const parsed = AICostOptimizationSuggestionSchema.safeParse(validSuggestion);
    expect(parsed.success).toBe(true);
  });

  it('validates a complete end-to-end EventPlan structure against EventPlanSchema', () => {
    const samplePlan = {
      id: 'event-test-1',
      name: 'Autumn Harvest Gala',
      eventType: 'Community Festival / Fundraiser',
      date: '2026-11-15',
      time: '18:00',
      location: 'Central Plaza Amphitheater',
      guestCount: 250,
      demographics: 'Local residents and families',
      setting: 'Outdoor',
      vibeTone: 'Rustic and celebratory',
      currency: '$',
      totalBudget: 35000,
      budgetItems: [
        {
          id: 'b-1',
          category: 'Venue & Logistics',
          name: 'Plaza Grounds Rental',
          estimatedCost: 10000,
          actualCost: 9500,
          paid: true
        }
      ],
      macroMilestones: [
        {
          id: 'm-1',
          timeframe: 'T-3 months',
          title: 'Confirm Municipal Permits',
          description: 'File noise permits',
          completed: true,
          priority: 'High'
        }
      ],
      dayOfItinerary: [
        {
          id: 't-1',
          time: '08:00 AM',
          title: 'Load-in & Stage Setup',
          durationMinutes: 120,
          owner: 'Production Crew',
          status: 'Pending',
          category: 'Setup'
        }
      ],
      vendors: [],
      ideation: {
        themeTitle: 'Rustic Harvest',
        vibeStatement: 'Cozy community celebration',
        colorPalette: [
          { hex: '#D97706', name: 'Amber Glow', usage: 'Linens' }
        ],
        decorAndLighting: [],
        menuAndBeverages: {
          cocktails: [],
          cateringCourses: [],
          pairings: []
        },
        contentAndScripts: {
          invitationCopyFormal: 'Welcome',
          invitationCopyCasual: 'Join us',
          toastSpeechOutline: [],
          signageText: []
        }
      },
      createdAt: '2026-10-30T10:00:00Z',
      updatedAt: '2026-10-30T10:00:00Z'
    };

    const parsed = EventPlanSchema.safeParse(samplePlan);
    expect(parsed.success).toBe(true);
  });
});
