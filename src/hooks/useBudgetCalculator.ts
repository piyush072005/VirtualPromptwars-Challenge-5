import { useMemo } from 'react';
import { EventPlan } from '../types/event';

export interface CategorySummary {
  category: string;
  estimatedTotal: number;
  actualTotal: number;
  percentageOfBudget: number;
  itemCount: number;
}

export function useBudgetCalculator(event: EventPlan) {
  const calculations = useMemo(() => {
    const totalBudget = Math.max(0, event.totalBudget || 0);

    let totalEstimated = 0;
    let totalActual = 0;
    let paidTotal = 0;
    let unpaidTotal = 0;
    let contingencyTotal = 0;

    const categoryMap: Record<string, { estimated: number; actual: number; count: number }> = {};

    for (let i = 0; i < event.budgetItems.length; i++) {
      const item = event.budgetItems[i];
      const est = Math.max(0, item.estimatedCost || 0);
      const act = Math.max(0, item.actualCost || 0);

      totalEstimated += est;
      totalActual += act;

      if (item.paid) {
        paidTotal += act;
      } else {
        unpaidTotal += act;
      }

      if (item.isContingency) {
        contingencyTotal += est;
      }

      const cat = item.category || 'Uncategorized';
      if (!categoryMap[cat]) {
        categoryMap[cat] = { estimated: 0, actual: 0, count: 0 };
      }
      categoryMap[cat].estimated += est;
      categoryMap[cat].actual += act;
      categoryMap[cat].count += 1;
    }

    const remainingBalance = totalBudget - totalActual;
    const isOverBudget = remainingBalance < 0;
    const burnPercentage = totalBudget > 0 ? Math.min(100, Math.round((totalActual / totalBudget) * 100)) : 0;
    const variance = totalActual - totalEstimated;

    const categorySummaries: CategorySummary[] = Object.entries(categoryMap).map(([category, stats]) => ({
      category,
      estimatedTotal: stats.estimated,
      actualTotal: stats.actual,
      percentageOfBudget: totalBudget > 0 ? Math.round((stats.actual / totalBudget) * 100) : 0,
      itemCount: stats.count
    }));

    return {
      totalBudget,
      totalEstimated,
      totalActual,
      remainingBalance,
      isOverBudget,
      burnPercentage,
      variance,
      paidTotal,
      unpaidTotal,
      contingencyTotal,
      contingencyPercent: totalBudget > 0 ? Math.round((contingencyTotal / totalBudget) * 100) : 0,
      categorySummaries,
      categories: Object.keys(categoryMap)
    };
  }, [event.totalBudget, event.budgetItems]);

  return calculations;
}
