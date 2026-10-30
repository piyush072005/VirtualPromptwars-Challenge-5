import React, { useState, useMemo, memo } from 'react';
import { 
  DollarSign, 
  Plus, 
  Trash2, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Circle,
  PieChart,
  ShieldAlert,
  Loader2,
  Tag
} from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import { useBudgetCalculator } from '../hooks/useBudgetCalculator';
import { BudgetItem, AICostOptimizationSuggestion } from '../types/event';
import { generateCostOptimizations } from '../services/geminiService';
import { sanitizePromptInput } from '../utils/security';

// Memoized Row Component to avoid unnecessary re-renders in large budgets
const BudgetItemRow = memo(({
  item,
  currency,
  onTogglePaid,
  onUpdateActual,
  onDelete
}: {
  item: BudgetItem;
  currency: string;
  onTogglePaid: (id: string, paid: boolean) => void;
  onUpdateActual: (id: string, actual: number) => void;
  onDelete: (id: string) => void;
}) => {
  const variance = item.actualCost - item.estimatedCost;
  const isOver = variance > 0;

  return (
    <tr className="hover:bg-surface-900/50 transition-colors">
      <td className="py-3 px-4 text-center">
        <button
          onClick={() => onTogglePaid(item.id, !item.paid)}
          className="text-slate-400 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none rounded-full p-1"
          aria-label={item.paid ? `Mark ${item.name} as unpaid` : `Mark ${item.name} as paid`}
        >
          {item.paid ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <Circle className="w-4 h-4 text-slate-500" />
          )}
        </button>
      </td>

      <td className="py-3 px-4">
        <div className="font-semibold text-slate-100 flex items-center gap-2">
          <span className={item.paid ? 'line-through text-slate-400' : ''}>
            {item.name}
          </span>
          {item.isContingency && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Contingency
            </span>
          )}
          {item.vendorId && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-brand-500/15 text-brand-300 border border-brand-500/20 flex items-center gap-1">
              <Tag className="w-2.5 h-2.5" /> Vendor Linked
            </span>
          )}
        </div>
        {item.notes && (
          <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
            {item.notes}
          </div>
        )}
      </td>

      <td className="py-3 px-4">
        <span className="text-[11px] text-slate-300 px-2.5 py-0.5 rounded-md bg-surface-900 border border-slate-800">
          {item.category}
        </span>
      </td>

      <td className="py-3 px-4 text-right font-mono text-slate-300">
        {currency}{item.estimatedCost.toLocaleString()}
      </td>

      <td className="py-3 px-4 text-right font-mono font-bold text-white">
        <label htmlFor={`cost-${item.id}`} className="sr-only">Actual cost for {item.name}</label>
        <input
          id={`cost-${item.id}`}
          type="number"
          min="0"
          value={item.actualCost}
          onChange={(e) => onUpdateActual(item.id, Number(e.target.value))}
          className="w-24 bg-surface-900 border border-slate-700/80 rounded px-2 py-1 text-right text-xs font-mono text-white focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
        />
      </td>

      <td className="py-3 px-4 text-center font-mono text-[11px]">
        {variance === 0 ? (
          <span className="text-slate-500">—</span>
        ) : (
          <span className={`font-semibold ${isOver ? 'text-rose-400' : 'text-emerald-400'}`}>
            {isOver ? '+' : ''}{currency}{variance.toLocaleString()}
          </span>
        )}
      </td>

      <td className="py-3 px-4 text-right">
        <button
          onClick={() => onDelete(item.id)}
          className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none rounded-lg"
          aria-label={`Delete ${item.name}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
});

BudgetItemRow.displayName = 'BudgetItemRow';

export const BudgetEngine: React.FC = () => {
  const { 
    activeEvent, 
    addBudgetItem, 
    updateBudgetItem, 
    deleteBudgetItem,
    apiKey,
    triggerCelebration 
  } = useEventContext();

  // Memoized Budget Math via custom hook
  const {
    totalBudget,
    totalActual,
    remainingBalance,
    isOverBudget,
    burnPercentage,
    contingencyTotal,
    contingencyPercent,
    categorySummaries,
    categories
  } = useBudgetCalculator(activeEvent);

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizations, setOptimizations] = useState<AICostOptimizationSuggestion[] | null>(null);

  const [newItem, setNewItem] = useState<{
    category: string;
    name: string;
    estimatedCost: number;
    actualCost: number;
    paid: boolean;
    notes: string;
    isContingency: boolean;
  }>({
    category: 'Catering & Beverages',
    name: '',
    estimatedCost: 1000,
    actualCost: 1000,
    paid: false,
    notes: '',
    isContingency: false
  });

  const filteredItems = useMemo(() => {
    return selectedCategoryFilter === 'All'
      ? activeEvent.budgetItems
      : activeEvent.budgetItems.filter(b => b.category === selectedCategoryFilter);
  }, [selectedCategoryFilter, activeEvent.budgetItems]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;

    addBudgetItem({
      ...newItem,
      name: sanitizePromptInput(newItem.name, 100),
      notes: sanitizePromptInput(newItem.notes, 200)
    });

    setNewItem({
      category: 'Catering & Beverages',
      name: '',
      estimatedCost: 1000,
      actualCost: 1000,
      paid: false,
      notes: '',
      isContingency: false
    });
    setIsAddModalOpen(false);
    triggerCelebration();
  };

  const handleRunOptimizer = async () => {
    setIsOptimizing(true);
    try {
      const results = await generateCostOptimizations(activeEvent, apiKey);
      setOptimizations(results);
    } catch (err) {
      console.error(err);
      alert('Could not generate optimizations.');
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <section 
      aria-label="Financial Engine and Budget Allocator" 
      className="space-y-6 animate-fade-in pb-16"
    >
      
      {/* Header & Optimizer CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-semibold border border-emerald-500/20">
            <DollarSign className="w-3.5 h-3.5" />
            Dynamic Allocation & Expense Burn-down
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
            Financial Engine & Budget Allocator
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time tracking with industry-standard category allocation and Gemini cost optimization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunOptimizer}
            disabled={isOptimizing}
            className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white transition-all shadow-glow-brand disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-brand-400"
            aria-live="polite"
          >
            {isOptimizing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing Burn-down...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>AI Cost Optimizer</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl bg-surface-800 hover:bg-surface-700 text-white border border-slate-700 transition-all focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            <Plus className="w-4 h-4 text-brand-400" />
            Add Expense
          </button>
        </div>
      </div>

      {/* Burn-Down Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" role="region" aria-label="Budget summary cards">
        
        {/* Total Budget */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-xs text-slate-300 font-medium">All-Inclusive Budget</span>
          <div className="mt-2 text-2xl font-display font-extrabold text-white">
            {activeEvent.currency}{totalBudget.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Baseline for {activeEvent.guestCount} guests
          </div>
        </div>

        {/* Total Spent / Committed */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-xs text-slate-300 font-medium">Actual Committed</span>
          <div className="mt-2 text-2xl font-display font-extrabold text-white">
            {activeEvent.currency}{totalActual.toLocaleString()}
          </div>
          <div className="text-[11px] text-brand-300 mt-1 font-semibold">
            {burnPercentage}% of total ceiling
          </div>
        </div>

        {/* Remaining Balance / Overrun */}
        <div 
          className={`glass-card rounded-2xl p-5 border ${isOverBudget ? 'border-rose-500/50 bg-rose-950/20' : 'border-slate-800'}`}
          aria-live="polite"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300">
              {isOverBudget ? 'Budget Overrun' : 'Remaining Balance'}
            </span>
            {isOverBudget && <AlertTriangle className="w-4 h-4 text-rose-400" />}
          </div>
          <div className={`mt-2 text-2xl font-display font-extrabold ${isOverBudget ? 'text-rose-400' : 'text-emerald-400'}`}>
            {isOverBudget ? '-' : ''}{activeEvent.currency}{Math.abs(remainingBalance).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-300 mt-1">
            {isOverBudget ? 'Exceeds budget ceiling! Run optimizer.' : 'Available for unallocated items'}
          </div>
        </div>

        {/* Contingency Reserve */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300 font-medium">Contingency Reserve</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-display font-extrabold text-amber-300">
            {activeEvent.currency}{contingencyTotal.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {contingencyPercent}% buffer against unforeseen surprises
          </div>
        </div>

      </div>

      {/* Visual Category Allocation Stacked Bar */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3" role="region" aria-label="Category allocation distribution">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-brand-400" />
            Dynamic Category Allocation (Industry Standards)
          </span>
          <span className="text-slate-400 text-[11px]">
            Target: 40% Venue/Catering • 15% Media • 10% Decor • 10% Music • 10% Ops • 15% Reserve
          </span>
        </div>

        {/* Stacked Progress Bar with ARIA */}
        <div 
          role="progressbar" 
          aria-valuenow={burnPercentage} 
          aria-valuemin={0} 
          aria-valuemax={100} 
          aria-label="Overall budget burn-down"
          className="w-full h-4 rounded-full overflow-hidden flex bg-surface-900 border border-slate-800"
        >
          {categorySummaries.map((cat, idx) => {
            const colors = [
              'bg-brand-500',
              'bg-accent-500',
              'bg-emerald-500',
              'bg-amber-500',
              'bg-cyan-500',
              'bg-pink-500',
              'bg-indigo-500'
            ];
            return (
              <div
                key={cat.category}
                className={`${colors[idx % colors.length]} transition-all relative`}
                style={{ width: `${cat.percentageOfBudget}%` }}
                title={`${cat.category}: ${activeEvent.currency}${cat.actualTotal.toLocaleString()} (${cat.percentageOfBudget}%)`}
              />
            );
          })}
        </div>

        {/* Category Legend Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {categorySummaries.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setSelectedCategoryFilter(cat.category === selectedCategoryFilter ? 'All' : cat.category)}
              className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-brand-400 ${
                selectedCategoryFilter === cat.category
                  ? 'bg-brand-500/20 text-white border-brand-500/50'
                  : 'bg-surface-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
              aria-pressed={selectedCategoryFilter === cat.category}
            >
              <span className="w-2 h-2 rounded-full bg-brand-400" />
              <span className="font-medium">{cat.category}</span>
              <span className="text-slate-400 text-[10px]">{cat.percentageOfBudget}%</span>
            </button>
          ))}
          {selectedCategoryFilter !== 'All' && (
            <button
              onClick={() => setSelectedCategoryFilter('All')}
              className="text-[10px] text-brand-400 hover:underline px-2 focus-visible:ring-2 focus-visible:ring-brand-400"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* AI Cost Optimizer Suggestions Panel */}
      {optimizations && optimizations.length > 0 && (
        <div 
          role="region" 
          aria-label="AI Budget Optimization Proposals" 
          className="glass-panel rounded-2xl p-6 border border-brand-500/30 bg-gradient-to-br from-brand-950/20 via-surface-900 to-surface-950 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center text-brand-300 border border-brand-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-display font-bold text-base text-white">
                  Gemini AI Budget Optimizer: Identified Compromises
                </h2>
                <p className="text-xs text-slate-300">
                  Targeted tradeoffs to save funds without ruining attendee satisfaction
                </p>
              </div>
            </div>
            <button
              onClick={() => setOptimizations(null)}
              className="text-xs text-slate-400 hover:text-white focus-visible:ring-2 focus-visible:ring-brand-400"
            >
              Dismiss
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
            {optimizations.map((opt, idx) => (
              <div
                key={idx}
                className="glass-card rounded-xl p-4 border border-slate-800/90 hover:border-brand-500/30 transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    Est. Savings: {activeEvent.currency}{opt.potentialSavings.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">{opt.category}</span>
                </div>

                <div className="text-xs font-bold text-white">
                  {opt.title}
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {opt.recommendation}
                </p>

                <div className="p-2 rounded-lg bg-surface-950/60 border border-slate-800/60 text-[10px] text-amber-300">
                  <span className="font-semibold text-amber-200">Trade-off Consideration:</span> {opt.tradeOff}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expense Ledger Table */}
      <div className="glass-panel rounded-2xl border border-slate-800/90 overflow-hidden shadow-glass" role="region" aria-label="Interactive Expense Ledger">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-sm text-white">
              Interactive Expense Ledger ({filteredItems.length} items)
            </h2>
            {selectedCategoryFilter !== 'All' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-300">
                Filtered: {selectedCategoryFilter}
              </span>
            )}
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white transition-all shadow-glow-brand focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Row
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <caption className="sr-only">Detailed list of budgeted line items, actual costs, and payment statuses</caption>
            <thead className="bg-surface-900/80 text-slate-300 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-800">
              <tr>
                <th scope="col" className="py-3 px-4 w-12 text-center">Paid</th>
                <th scope="col" className="py-3 px-4">Line Item & Notes</th>
                <th scope="col" className="py-3 px-4">Category</th>
                <th scope="col" className="py-3 px-4 text-right">Estimated</th>
                <th scope="col" className="py-3 px-4 text-right">Actual Cost</th>
                <th scope="col" className="py-3 px-4 text-center">Variance</th>
                <th scope="col" className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredItems.map((item) => (
                <BudgetItemRow
                  key={item.id}
                  item={item}
                  currency={activeEvent.currency}
                  onTogglePaid={(id, paid) => updateBudgetItem(id, { paid })}
                  onUpdateActual={(id, actualCost) => updateBudgetItem(id, { actualCost })}
                  onDelete={(id) => deleteBudgetItem(id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isAddModalOpen && (
        <div 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="modal-add-expense-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
        >
          <div className="glass-panel rounded-2xl p-6 border border-slate-700 max-w-lg w-full space-y-4 shadow-2xl">
            <h2 id="modal-add-expense-title" className="text-base font-display font-bold text-white">
              Add Budget Line Item
            </h2>

            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <label htmlFor="new-item-name" className="text-xs font-semibold text-slate-300">Item Name</label>
                <input
                  id="new-item-name"
                  type="text"
                  required
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g., Live Jazz Saxophonist, Biodegradable Confetti Cannons"
                  className="w-full mt-1 bg-surface-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
                />
              </div>

              <div>
                <label htmlFor="new-item-category" className="text-xs font-semibold text-slate-300">Category</label>
                <select
                  id="new-item-category"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full mt-1 bg-surface-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
                >
                  <option value="Venue & Logistics">Venue & Logistics</option>
                  <option value="Catering & Beverages">Catering & Beverages</option>
                  <option value="Media & Documentation">Media & Documentation</option>
                  <option value="Entertainment & Sound">Entertainment & Sound</option>
                  <option value="Design & Atmosphere">Design & Atmosphere</option>
                  <option value="Permits & Operations">Permits & Operations</option>
                  <option value="Contingency Reserve">Contingency Reserve</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="new-item-est" className="text-xs font-semibold text-slate-300">Estimated Cost ({activeEvent.currency})</label>
                  <input
                    id="new-item-est"
                    type="number"
                    min="0"
                    value={newItem.estimatedCost}
                    onChange={(e) => setNewItem({ ...newItem, estimatedCost: Number(e.target.value) })}
                    className="w-full mt-1 bg-surface-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="new-item-actual" className="text-xs font-semibold text-slate-300">Actual Cost ({activeEvent.currency})</label>
                  <input
                    id="new-item-actual"
                    type="number"
                    min="0"
                    value={newItem.actualCost}
                    onChange={(e) => setNewItem({ ...newItem, actualCost: Number(e.target.value) })}
                    className="w-full mt-1 bg-surface-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="new-item-notes" className="text-xs font-semibold text-slate-300">Notes / Contract Reference</label>
                <input
                  id="new-item-notes"
                  type="text"
                  value={newItem.notes}
                  onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                  placeholder="e.g., Deposit paid on March 1st; balance due week of event."
                  className="w-full mt-1 bg-surface-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={newItem.paid}
                    onChange={(e) => setNewItem({ ...newItem, paid: e.target.checked })}
                    className="rounded text-brand-600 bg-surface-900 border-slate-700 focus-visible:ring-2 focus-visible:ring-brand-400"
                  />
                  <span>Already Paid</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={newItem.isContingency}
                    onChange={(e) => setNewItem({ ...newItem, isContingency: e.target.checked })}
                    className="rounded text-brand-600 bg-surface-900 border-slate-700 focus-visible:ring-2 focus-visible:ring-brand-400"
                  />
                  <span>Emergency Contingency Item</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-xs px-4 py-2 rounded-xl text-slate-400 hover:text-white focus-visible:ring-2 focus-visible:ring-brand-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-xs font-semibold px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-glow-brand focus-visible:ring-2 focus-visible:ring-brand-400"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};
