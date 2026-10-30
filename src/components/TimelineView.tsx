import React, { useState, useMemo, memo } from 'react';
import { 
  Clock, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Layers, 
  User, 
  Tag
} from 'lucide-react';
import { useEventContext } from '../context/useEventContext';
import { useTimeline } from '../hooks/useTimeline';
import { TimelineTask, TaskStatus } from '../types/event';
import { sanitizePromptInput } from '../utils/security';

const TimelineSlotCard = memo(({
  task,
  index,
  totalCount,
  onUpdateStatus,
  onReorder,
  onDelete
}: {
  task: TimelineTask;
  index: number;
  totalCount: number;
  onUpdateStatus: (id: string, status: TaskStatus) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
  onDelete: (id: string) => void;
}) => {
  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Delayed':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'Pending':
      default:
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    }
  };

  return (
    <article 
      className="glass-card rounded-2xl p-4 border border-slate-800/90 hover:border-slate-700/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
      aria-label={`${task.time}: ${task.title}`}
    >
      {/* Time & Title */}
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-surface-900 border border-slate-800 min-w-[80px] shrink-0">
          <time className="font-mono text-xs font-black text-brand-300 tracking-tight">
            {task.time}
          </time>
          <span className="text-[10px] text-slate-400 mt-0.5">
            {task.durationMinutes} min
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-white">
              {task.title}
            </h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-surface-900 text-slate-300 border border-slate-800">
              {task.category}
            </span>
            {task.linkedVendorId && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-brand-500/15 text-brand-300 border border-brand-500/20 flex items-center gap-1">
                <Tag className="w-2.5 h-2.5" /> Vendor Linked
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3 text-brand-400" />
              Owner: <strong className="text-slate-300 font-semibold">{task.owner}</strong>
            </span>
            {task.notes && (
              <>
                <span>•</span>
                <span className="italic text-slate-400">{task.notes}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Status Dropdown & Action Controls */}
      <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
        
        {/* Status Dropdown */}
        <label htmlFor={`status-${task.id}`} className="sr-only">Status for {task.title}</label>
        <select
          id={`status-${task.id}`}
          value={task.status}
          onChange={(e) => onUpdateStatus(task.id, e.target.value as TaskStatus)}
          className={`text-xs font-semibold px-3 py-1.5 rounded-xl border appearance-none cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none ${getStatusBadge(task.status)}`}
        >
          <option value="Pending" className="bg-surface-900 text-amber-300">⏳ Pending</option>
          <option value="Completed" className="bg-surface-900 text-emerald-300">✅ Completed</option>
          <option value="Delayed" className="bg-surface-900 text-rose-300">⚠️ Delayed</option>
        </select>

        {/* Reorder Arrows with Accessible Labels */}
        <div className="flex items-center bg-surface-900 rounded-lg border border-slate-800 p-0.5" role="group" aria-label="Reorder task sequence">
          <button
            onClick={() => index > 0 && onReorder(index, index - 1)}
            disabled={index === 0}
            className="p-1 text-slate-400 hover:text-white disabled:opacity-30 focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:outline-none rounded"
            aria-label={`Move ${task.title} earlier in itinerary`}
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => index < totalCount - 1 && onReorder(index, index + 1)}
            disabled={index === totalCount - 1}
            className="p-1 text-slate-400 hover:text-white disabled:opacity-30 focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:outline-none rounded"
            aria-label={`Move ${task.title} later in itinerary`}
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Delete */}
        <button
          onClick={() => onDelete(task.id)}
          className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none rounded-lg"
          aria-label={`Delete ${task.title}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

      </div>
    </article>
  );
});

TimelineSlotCard.displayName = 'TimelineSlotCard';

export const TimelineView: React.FC = () => {
  const { 
    activeEvent, 
    toggleMilestone, 
    addTimelineTask, 
    updateTimelineTask, 
    deleteTimelineTask, 
    reorderTimelineTask,
    triggerCelebration 
  } = useEventContext();

  const {
    totalMilestones,
    completedMilestones,
    milestonePercentage,
    totalTasks,
    completedTasks,
    itineraryPercentage,
    totalProgramHours
  } = useTimeline(activeEvent);

  const [activeTab, setActiveTab] = useState<'itinerary' | 'macro'>('itinerary');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  const [newTask, setNewTask] = useState<{
    time: string;
    title: string;
    durationMinutes: number;
    owner: string;
    status: TaskStatus;
    notes: string;
    category: TimelineTask['category'];
  }>({
    time: '12:00 PM',
    title: '',
    durationMinutes: 45,
    owner: 'Lead Coordinator',
    status: 'Pending',
    notes: '',
    category: 'Program'
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    addTimelineTask({
      ...newTask,
      title: sanitizePromptInput(newTask.title, 100),
      owner: sanitizePromptInput(newTask.owner, 50),
      notes: sanitizePromptInput(newTask.notes, 200)
    });

    setNewTask({
      time: '12:00 PM',
      title: '',
      durationMinutes: 45,
      owner: 'Lead Coordinator',
      status: 'Pending',
      notes: '',
      category: 'Program'
    });
    setIsAddModalOpen(false);
    triggerCelebration();
  };

  const filteredTasks = useMemo(() => {
    return statusFilter === 'All'
      ? activeEvent.dayOfItinerary
      : activeEvent.dayOfItinerary.filter((t) => t.status === statusFilter);
  }, [statusFilter, activeEvent.dayOfItinerary]);

  return (
    <section 
      aria-label="Master Event Timeline and Itinerary" 
      className="space-y-6 animate-fade-in pb-16"
    >
      
      {/* Header & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/10 text-accent-300 text-xs font-semibold border border-accent-500/20">
            <Clock className="w-3.5 h-3.5" />
            Milestones & Minute-by-Minute Run of Show ({totalProgramHours}h planned)
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
            Master Event Timeline & Itinerary
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Switch between the high-level countdown roadmap and the day-of tactical run-of-show schedule.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub-tab Switcher with ARIA */}
          <div className="bg-surface-900 p-1 rounded-xl border border-slate-800 flex items-center" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === 'itinerary'}
              onClick={() => setActiveTab('itinerary')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-brand-400 ${
                activeTab === 'itinerary'
                  ? 'bg-brand-600 text-white shadow-glow-brand'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Day-Of Run of Show ({totalTasks})
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'macro'}
              onClick={() => setActiveTab('macro')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-brand-400 ${
                activeTab === 'macro'
                  ? 'bg-brand-600 text-white shadow-glow-brand'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Macro Roadmap ({totalMilestones})
            </button>
          </div>

          {activeTab === 'itinerary' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-surface-800 hover:bg-surface-700 text-white border border-slate-700 transition-all focus-visible:ring-2 focus-visible:ring-brand-400"
            >
              <Plus className="w-3.5 h-3.5 text-brand-400" />
              Add Slot
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: DAY-OF RUN OF SHOW */}
      {activeTab === 'itinerary' && (
        <div className="space-y-4">
          
          {/* Filter Bar & Progress */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2" role="group" aria-label="Filter tasks by status">
              <span className="text-slate-300 font-medium">Filter Status:</span>
              {(['All', 'Pending', 'Completed', 'Delayed'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 rounded-lg border transition-all focus-visible:ring-2 focus-visible:ring-brand-400 ${
                    statusFilter === s
                      ? 'bg-brand-500/20 text-brand-300 border-brand-500/40 font-semibold'
                      : 'bg-surface-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                  aria-pressed={statusFilter === s}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span>{completedTasks}/{totalTasks} executed ({itineraryPercentage}%)</span>
              <div className="w-24 bg-surface-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                <div 
                  className="bg-brand-500 h-full rounded-full transition-all" 
                  style={{ width: `${itineraryPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Timeline Slots List */}
          <div className="space-y-3" role="feed" aria-label="Day of itinerary entries">
            {filteredTasks.map((task, index) => (
              <TimelineSlotCard
                key={task.id}
                task={task}
                index={index}
                totalCount={activeEvent.dayOfItinerary.length}
                onUpdateStatus={(id, status) => updateTimelineTask(id, { status })}
                onReorder={(start, end) => reorderTimelineTask(start, end)}
                onDelete={(id) => deleteTimelineTask(id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: MACRO ROADMAP */}
      {activeTab === 'macro' && (
        <div className="space-y-4">
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-brand-400" />
                  Strategic Milestone Roadmap
                </h2>
                <span className="text-xs font-semibold text-brand-300">
                  {completedMilestones}/{totalMilestones} Completed ({milestonePercentage}%)
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Tick off high-impact deliverables at each time bracket to keep the master plan on track.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {activeEvent.macroMilestones.map((m) => (
                <div
                  key={m.id}
                  className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                    m.completed
                      ? 'bg-surface-900/40 border-slate-800/50 opacity-60'
                      : 'bg-surface-900/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <input
                      type="checkbox"
                      id={`macro-${m.id}`}
                      checked={m.completed}
                      onChange={() => toggleMilestone(m.id)}
                      className="mt-1 w-4 h-4 rounded text-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500 bg-surface-950 border-slate-700 cursor-pointer"
                    />
                    <div>
                      <label htmlFor={`macro-${m.id}`} className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/25">
                            {m.timeframe}
                          </span>
                          <span className={`text-sm font-bold ${m.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                            {m.title}
                          </span>
                          {m.linkedVendorCategory && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-surface-800 text-slate-300 border border-slate-700">
                              Requires: {m.linkedVendorCategory}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          {m.description}
                        </p>
                      </label>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                    m.priority === 'High'
                      ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {m.priority} Priority
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Slot Modal */}
      {isAddModalOpen && (
        <div 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="modal-add-task-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
        >
          <div className="glass-panel rounded-2xl p-6 border border-slate-700 max-w-lg w-full space-y-4 shadow-2xl">
            <h2 id="modal-add-task-title" className="text-base font-display font-bold text-white">
              Add Day-of Itinerary Slot
            </h2>

            <form onSubmit={handleAddTask} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="slot-time" className="text-xs font-semibold text-slate-300">Time (e.g. 11:30 AM)</label>
                  <input
                    id="slot-time"
                    type="text"
                    required
                    value={newTask.time}
                    onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                    className="w-full mt-1 bg-surface-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="slot-duration" className="text-xs font-semibold text-slate-300">Duration (Minutes)</label>
                  <input
                    id="slot-duration"
                    type="number"
                    min="5"
                    step="5"
                    value={newTask.durationMinutes}
                    onChange={(e) => setNewTask({ ...newTask, durationMinutes: Number(e.target.value) })}
                    className="w-full mt-1 bg-surface-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="slot-title" className="text-xs font-semibold text-slate-300">Slot Title / Activity</label>
                <input
                  id="slot-title"
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="e.g. Grand Entrance, Speeches & Toast, Sparkler Send-off"
                  className="w-full mt-1 bg-surface-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="slot-owner" className="text-xs font-semibold text-slate-300">Owner / Point Person</label>
                  <input
                    id="slot-owner"
                    type="text"
                    value={newTask.owner}
                    onChange={(e) => setNewTask({ ...newTask, owner: e.target.value })}
                    placeholder="e.g. Lead Coordinator, DJ, Officiant"
                    className="w-full mt-1 bg-surface-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="slot-category" className="text-xs font-semibold text-slate-300">Category</label>
                  <select
                    id="slot-category"
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value as any })}
                    className="w-full mt-1 bg-surface-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
                  >
                    <option value="Setup">Setup</option>
                    <option value="Ceremony">Ceremony</option>
                    <option value="Reception">Reception</option>
                    <option value="Program">Program</option>
                    <option value="Teardown">Teardown</option>
                    <option value="Buffer">Buffer</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="slot-notes" className="text-xs font-semibold text-slate-300">Notes / Audio Cue Instructions</label>
                <input
                  id="slot-notes"
                  type="text"
                  value={newTask.notes}
                  onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                  placeholder="e.g. Cue track 4 on Spotify; dim lights to 30%."
                  className="w-full mt-1 bg-surface-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
                />
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
                  Save Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};
