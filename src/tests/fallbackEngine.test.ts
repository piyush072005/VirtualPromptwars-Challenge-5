import { describe, it, expect } from 'vitest';
import { generateFallbackEventPlan, OnboardingInput } from '../services/geminiService';
import { EventPlanSchema } from '../schemas/eventSchemas';

describe('Heuristic Fallback Engine', () => {
  const weddingInput: OnboardingInput = {
    name: 'Sophia & Alexander Nuptials',
    eventType: 'Wedding',
    date: '2026-09-18',
    time: '15:30',
    location: 'Napa Valley Vineyard Estate',
    guestCount: 150,
    demographics: 'Family, friends, close colleagues',
    setting: 'Outdoor',
    vibeTone: 'Rustic elegance with candlelit vineyard dining',
    currency: '$',
    totalBudget: 60000
  };

  it('generates a schema-compliant event plan for wedding input', () => {
    const plan = generateFallbackEventPlan(weddingInput);
    const validation = EventPlanSchema.safeParse(plan);
    expect(validation.success).toBe(true);
  });

  it('enforces realistic wedding budget allocations with contingency reserve', () => {
    const plan = generateFallbackEventPlan(weddingInput);
    const contingencyItem = plan.budgetItems.find(b => b.isContingency);
    expect(contingencyItem).toBeDefined();
    // 10% contingency on $60,000 = $6,000
    expect(contingencyItem?.estimatedCost).toBe(6000);

    const venueItem = plan.budgetItems.find(b => b.category === 'Venue & Logistics');
    expect(venueItem).toBeDefined();
    expect(venueItem?.estimatedCost).toBe(21000); // 35% of 60,000
  });

  it('adapts festival budgets with permit allocations and higher entertainment shares', () => {
    const festivalInput: OnboardingInput = {
      ...weddingInput,
      name: 'Pacific Arts & Music Festival',
      eventType: 'Community Festival / Fundraiser',
      totalBudget: 40000
    };

    const plan = generateFallbackEventPlan(festivalInput);
    const permitsItem = plan.budgetItems.find(b => b.category === 'Permits & Operations');
    expect(permitsItem).toBeDefined();
    // Festival permits share = 7% of 40,000 = $2,800
    expect(permitsItem?.estimatedCost).toBe(2800);
  });

  it('generates a 5-color HEX palette with descriptions', () => {
    const plan = generateFallbackEventPlan(weddingInput);
    expect(plan.ideation.colorPalette).toHaveLength(5);
    plan.ideation.colorPalette.forEach(swatch => {
      expect(swatch.hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(swatch.name.length).toBeGreaterThan(0);
      expect(swatch.usage.length).toBeGreaterThan(0);
    });
  });

  it('generates multi-tier milestones and minute-by-minute itinerary', () => {
    const plan = generateFallbackEventPlan(weddingInput);
    expect(plan.macroMilestones.length).toBeGreaterThanOrEqual(4);
    expect(plan.dayOfItinerary.length).toBeGreaterThanOrEqual(5);
  });
});

