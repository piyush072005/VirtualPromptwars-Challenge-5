import React from 'react';
import { 
  Sparkles, 
  Key, 
  Printer, 
  Calendar, 
  Plus, 
  FolderSync
} from 'lucide-react';
import { useEventContext } from '../context/useEventContext';

export const Navbar: React.FC = () => {
  const { 
    events, 
    activeEvent, 
    selectEvent, 
    setActiveTab, 
    setIsApiKeyModalOpen, 
    setIsExportModalOpen, 
    apiKey,
    resetToSampleData 
  } = useEventContext();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-surface-950/80 backdrop-blur-xl px-4 lg:px-8 py-3 no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-400 p-[1px] shadow-glow-brand flex items-center justify-center">
            <div className="w-full h-full bg-surface-950 rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-brand-400 animate-pulse-subtle" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                EventVibe <span className="text-brand-400">AI</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20">
                PlanPulse
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              GenAI Celebration & Event Planning Copilot
            </p>
          </div>
        </div>

        {/* Center: Event Selector */}
        <div className="flex items-center gap-2 max-w-xs md:max-w-md">
          <div className="relative">
            <select
              value={activeEvent.id}
              onChange={(e) => selectEvent(e.target.value)}
              aria-label="Select active event plan"
              className="appearance-none bg-surface-900 border border-slate-700/80 hover:border-slate-600 text-slate-100 text-xs md:text-sm rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500/40 cursor-pointer max-w-[200px] sm:max-w-xs truncate"
            >
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.eventType === 'Wedding' ? '💍 ' : evt.eventType === 'Milestone Birthday' ? '🎂 ' : '🎪 '}
                  {evt.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400" aria-hidden="true">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>

          <button
            onClick={() => setActiveTab('onboarding')}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-brand-600/20 hover:bg-brand-600/30 text-brand-300 border border-brand-500/30 transition-all focus-visible:ring-2 focus-visible:ring-brand-400"
            title="Create New Event Plan"
            aria-label="Create New Event Plan"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden md:inline">New Plan</span>
          </button>
        </div>

        {/* Right Actions: AI Key status, Export, Reset */}
        <div className="flex items-center gap-2">
          {/* AI Status Badge */}
          <button
            onClick={() => setIsApiKeyModalOpen(true)}
            aria-label={apiKey ? "Gemini 1.5 Active, configure API key" : "AI Copilot Ready, enter API key"}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-all focus-visible:ring-2 focus-visible:ring-brand-400 ${
              apiKey
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:bg-emerald-950/60'
                : 'bg-surface-900 text-slate-300 border-slate-700 hover:border-brand-500/40'
            }`}
            title={apiKey ? "Gemini API Key Connected" : "Running in Zero-Friction Hybrid Heuristic Mode. Click to add your Gemini API Key."}
          >
            <span className={`w-2 h-2 rounded-full ${apiKey ? 'bg-emerald-400 animate-ping' : 'bg-brand-400'}`} aria-hidden="true" />
            <Key className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden lg:inline">
              {apiKey ? 'Gemini 1.5 Active' : 'AI Copilot Ready'}
            </span>
          </button>

          {/* Export / Print Button */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            aria-label="Export or Print Event Dossier"
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-surface-900 hover:bg-surface-800 text-slate-200 border border-slate-700/80 transition-all focus-visible:ring-2 focus-visible:ring-brand-400"
            title="Print Run-of-Show or Export Markdown"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span className="hidden sm:inline">Export / Print</span>
          </button>

          {/* Quick Presets Reset */}
          <button
            onClick={() => {
              if (window.confirm("Reload default sample showcase events (Boho Wedding, Cyberpunk 30th, Community Fair)?")) {
                resetToSampleData();
              }
            }}
            aria-label="Reload sample showcase events"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-surface-900 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-brand-400"
            title="Reload Sample Showcases"
          >
            <FolderSync className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

      </div>
    </header>
  );
};
