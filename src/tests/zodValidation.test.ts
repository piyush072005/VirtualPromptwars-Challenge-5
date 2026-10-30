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
});
