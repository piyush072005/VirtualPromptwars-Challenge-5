import React from 'react';
import { 
  DollarSign, 
  Clock, 
  Users, 
  Sparkles, 
  AlertTriangle, 
  GlassWater,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useEventContext } from '../context/useEventContext';

export const DashboardView: React.FC = () => {
  const { 
    activeEvent, 
    setActiveTab, 
    toggleMilestone, 
    updateTimelineTask,
    setIsExportModalOpen 
  } = useEventContext();

  // Financial calculations
  const totalBudget = activeEvent.totalBudget;
  const totalActual = activeEvent.budgetItems.reduce((acc, curr) => acc + (curr.actualCost || 0), 0);
  const remaining = totalBudget - totalActual;
  const isOverBudget = remaining < 0;
  const budgetBurnPercent = Math.min(100, Math.round((totalActual / totalBudget) * 100));

  // Milestones
  const totalMilestones = activeEvent.macroMilestones.length;
  const completedMilestones = activeEvent.macroMilestones.filter(m => m.completed).length;
  const milestonePercent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  // Day-of tasks
  const totalTasks = activeEvent.dayOfItinerary.length;
  const completedTasks = activeEvent.dayOfItinerary.filter(t => t.status === 'Completed').length;

  // Vendors
  const totalVendors = activeEvent.vendors.length;
  const signedVendors = activeEvent.vendors.filter(v => v.contractSigned).length;

  // Countdown calculations: deterministic day delta from event schedule
  const eventTime = Date.parse(activeEvent.date) || 0;
  const refTime = Date.parse(activeEvent.createdAt || activeEvent.updatedAt) || 0;
  const diffDays = Math.max(1, Math.ceil((eventTime - refTime) / (1000 * 60 * 60 * 24)));

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Hero Event Banner */}
      <div className="relative overflow-hidden rounded-2xl p-6 lg:p-8 bg-gradient-to-br from-surface-900 via-surface-900/90 to-surface-950 border border-slate-800 shadow-glass">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-accent-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/25">
                {activeEvent.eventType}
              </span>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-surface-800 text-slate-300 border border-slate-700/60">
                {activeEvent.setting} Setting • {activeEvent.guestCount} Guests
              </span>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-surface-800 text-slate-300 border border-slate-700/60">
                {activeEvent.location}
              </span>
            </div>

            <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
              {activeEvent.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl italic leading-relaxed">
              "{activeEvent.vibeTone}"
            </p>
          </div>

          {/* Countdown Card */}
          <div className="glass-panel rounded-2xl p-4 md:p-5 border border-slate-700/50 flex items-center gap-4 shrink-0 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-500 flex items-center justify-center text-white shadow-glow-brand">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-display font-black text-white">
                {diffDays > 0 ? diffDays : 0}
                <span className="text-xs font-semibold text-brand-300 ml-1.5 uppercase tracking-wider">Days to Go</span>
              </div>
              <div className="text-xs text-slate-400">
                Target: {activeEvent.date} ({activeEvent.time || '14:00'})
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Row */}
        <div className="relative z-10 mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveTab('budget')}
            className="flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white transition-all shadow-glow-brand"
          >
            <DollarSign className="w-3.5 h-3.5" />
            Manage Expenses
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className="flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl bg-surface-800 hover:bg-surface-700 text-slate-200 border border-slate-700 transition-all"
          >
            <Clock className="w-3.5 h-3.5 text-accent-400" />
            Day-of Run of Show
          </button>
          <button
            onClick={() => setActiveTab('vendors')}
            className="flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl bg-surface-800 hover:bg-surface-700 text-slate-200 border border-slate-700 transition-all"
          >
            <Users className="w-3.5 h-3.5 text-brand-400" />
            Vendor Contracts
          </button>
          <button
            onClick={() => setActiveTab('creative')}
            className="flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl bg-surface-800 hover:bg-surface-700 text-slate-200 border border-slate-700 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Creative Moodboard
          </button>
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl bg-surface-800 hover:bg-surface-700 text-slate-200 border border-slate-700 transition-all ml-auto"
          >
            Print Dossier
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Budget Card */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800/90 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Budget Burn</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-display font-extrabold text-white">
              {activeEvent.currency}{totalActual.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">
              / {activeEvent.currency}{totalBudget.toLocaleString()}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 w-full bg-surface-900 rounded-full h-2 overflow-hidden border border-slate-800">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${
                isOverBudget ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-500 to-brand-500'
              }`}
              style={{ width: `${Math.min(100, budgetBurnPercent)}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className={isOverBudget ? 'text-rose-400 font-bold flex items-center gap-1' : 'text-slate-400'}>
              {isOverBudget ? (
                <>
                  <AlertTriangle className="w-3 h-3 inline" />
                  Over by {activeEvent.currency}{Math.abs(remaining).toLocaleString()}
                </>
              ) : (
                <>Remaining: {activeEvent.currency}{remaining.toLocaleString()}</>
              )}
            </span>
            <span className="text-slate-400 font-semibold">{budgetBurnPercent}% spent</span>
          </div>
        </div>

        {/* Macro Milestones Card */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800/90">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Macro Milestones</span>
            <Layers className="w-4 h-4 text-accent-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-display font-extrabold text-white">
              {completedMilestones}
            </span>
            <span className="text-xs text-slate-400">
              / {totalMilestones} Completed
            </span>
          </div>

          <div className="mt-3 w-full bg-surface-900 rounded-full h-2 overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-accent-500 to-brand-400 rounded-full transition-all duration-500"
              style={{ width: `${milestonePercent}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>{totalMilestones - completedMilestones} Milestones Left</span>
            <span className="font-semibold text-accent-300">{milestonePercent}% Ready</span>
          </div>
        </div>

        {/* Day-of Itinerary Card */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800/90">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Day-Of Run of Show</span>
            <Clock className="w-4 h-4 text-brand-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-display font-extrabold text-white">
              {completedTasks}
            </span>
            <span className="text-xs text-slate-400">
              / {totalTasks} Slots Executed
            </span>
          </div>

          <div className="mt-3 w-full bg-surface-900 rounded-full h-2 overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-brand-500 to-pink-400 rounded-full transition-all duration-500"
              style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Next: {activeEvent.dayOfItinerary.find(t => t.status === 'Pending')?.time || 'All done!'}</span>
            <span className="font-semibold text-brand-300">{totalTasks - completedTasks} Pending</span>
          </div>
        </div>

        {/* Vendor Hub Card */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800/90">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Vendor Vetting & Contracts</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-display font-extrabold text-white">
              {signedVendors}
            </span>
            <span className="text-xs text-slate-400">
              / {totalVendors} Signed
            </span>
          </div>

          <div className="mt-3 w-full bg-surface-900 rounded-full h-2 overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${totalVendors > 0 ? (signedVendors / totalVendors) * 100 : 0}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>{totalVendors - signedVendors} In Negotiations</span>
            <span className="font-semibold text-amber-300">
              {totalVendors > 0 ? Math.round((signedVendors / totalVendors) * 100) : 0}% Locked
            </span>
          </div>
        </div>

      </div>

      {/* Two Column Layout: Macro Roadmap & Day-Of Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Macro Timeline Roadmap */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800/90 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-400" />
                Macro Milestone Roadmap
              </h2>
              <p className="text-xs text-slate-400">
                Key deadlines from T-6 Months through Day Before
              </p>
            </div>
            <button
              onClick={() => setActiveTab('timeline')}
              className="text-xs text-brand-300 hover:text-brand-200 flex items-center gap-1 font-semibold group"
            >
              Full Timeline <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {activeEvent.macroMilestones.map((milestone) => (
              <div
                key={milestone.id}
                className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                  milestone.completed
                    ? 'bg-surface-900/40 border-slate-800/60 opacity-70'
                    : 'bg-surface-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={milestone.completed}
                    onChange={() => toggleMilestone(milestone.id)}
                    className="mt-1 w-4 h-4 rounded text-brand-600 focus:ring-brand-500 bg-surface-950 border-slate-700 cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/20">
                        {milestone.timeframe}
                      </span>
                      <span className={`text-xs font-semibold ${milestone.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {milestone.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {milestone.description}
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                  milestone.priority === 'High'
                    ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  {milestone.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Creative Vibe & Day-Of Sneak Peek */}
        <div className="space-y-6">
          
          {/* Aesthetic Palette Snippet */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800/90 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-accent-400" />
                Color Harmony & Mood
              </h3>
              <button
                onClick={() => setActiveTab('creative')}
                className="text-[11px] text-accent-300 hover:text-accent-200 font-semibold"
              >
                Moodboard →
              </button>
            </div>

            <p className="text-xs text-slate-300 italic">
              "{activeEvent.ideation.themeTitle}"
            </p>

            {/* 5 Swatches */}
            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {activeEvent.ideation.colorPalette.map((swatch, idx) => (
                <div key={idx} className="group relative">
                  <div
                    className="h-10 rounded-lg shadow-sm border border-white/10 transition-transform group-hover:scale-105"
                    style={{ backgroundColor: swatch.hex }}
                    title={`${swatch.name} (${swatch.hex})`}
                  />
                  <div className="text-[9px] text-slate-400 truncate text-center mt-1">
                    {swatch.name.split(' ')[0]}
                  </div>
                </div>
              ))}
            </div>

            {/* Signature Sip */}
            {activeEvent.ideation.menuAndBeverages.cocktails[0] && (
              <div className="mt-3 p-3 rounded-xl bg-surface-900/90 border border-slate-800/80 text-xs">
                <div className="flex items-center gap-2 text-brand-300 font-semibold mb-1">
                  <GlassWater className="w-3.5 h-3.5" />
                  <span>Signature Sip: {activeEvent.ideation.menuAndBeverages.cocktails[0].name}</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {activeEvent.ideation.menuAndBeverages.cocktails[0].ingredients}
                </p>
              </div>
            )}
          </div>

          {/* Day-of Next Actions Snippet */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800/90 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-brand-400" />
                Day-Of Run of Show (Top 3)
              </h3>
              <button
                onClick={() => setActiveTab('timeline')}
                className="text-[11px] text-brand-300 hover:text-brand-200 font-semibold"
              >
                View All →
              </button>
            </div>

            <div className="space-y-2">
              {activeEvent.dayOfItinerary.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="p-2.5 rounded-xl bg-surface-900/70 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-brand-400">{task.time}</span>
                      <span className="font-medium text-slate-200 truncate max-w-[150px]">{task.title}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Owner: {task.owner} • {task.durationMinutes} min
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
                      updateTimelineTask(task.id, { status: nextStatus });
                    }}
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                      task.status === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {task.status}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
