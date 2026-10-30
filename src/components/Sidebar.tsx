import React from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  DollarSign, 
  Clock, 
  Users, 
  Palette, 
  FileText,
  MapPin,
  Users2,
  CalendarCheck
} from 'lucide-react';
import { useEventContext, TabType } from '../context/useEventContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, activeEvent } = useEventContext();

  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'Command Center',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'onboarding',
      label: 'AI Event Onboarding',
      icon: <Sparkles className="w-4 h-4 text-brand-400" />,
      badge: 'GenAI'
    },
    {
      id: 'budget',
      label: 'Budget & Ledger',
      icon: <DollarSign className="w-4 h-4" />,
      badge: `${activeEvent.currency}${Math.round(activeEvent.totalBudget / 1000)}k`
    },
    {
      id: 'timeline',
      label: 'Milestones & Itinerary',
      icon: <Clock className="w-4 h-4" />,
      badge: `${activeEvent.dayOfItinerary.length} slots`
    },
    {
      id: 'vendors',
      label: 'Vendor Hub & Contracts',
      icon: <Users className="w-4 h-4" />,
      badge: `${activeEvent.vendors.length} vendors`
    },
    {
      id: 'creative',
      label: 'Creative Ideation',
      icon: <Palette className="w-4 h-4 text-accent-400" />
    },
    {
      id: 'export',
      label: 'Export & Print Dossier',
      icon: <FileText className="w-4 h-4" />
    }
  ];

  // Calculate event date countdown or formatted date
  const eventDate = new Date(activeEvent.date);
  const formattedDate = !isNaN(eventDate.getTime())
    ? eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : activeEvent.date;

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-surface-950/70 backdrop-blur-xl flex flex-col justify-between p-4 shrink-0 no-print">
      
      {/* Navigation Links */}
      <div className="space-y-6">
        <div>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 px-3">
            Core Planning Modules
          </span>
          <nav aria-label="Core Planning Modules" className="mt-2 space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={item.label}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-brand-400 ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-500/20 to-accent-500/10 text-white border border-brand-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-surface-900/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-brand-400' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                          : 'bg-surface-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Active Event Summary Footnote */}
      <div className="glass-card rounded-xl p-3 border border-slate-800/90 text-xs">
        <div className="flex items-center gap-1.5 text-brand-300 font-semibold mb-1">
          <CalendarCheck className="w-3.5 h-3.5" />
          <span className="truncate">{activeEvent.name}</span>
        </div>
        <div className="text-[11px] text-slate-400 space-y-1 mt-1.5">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{activeEvent.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users2 className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{activeEvent.guestCount} Guests • {activeEvent.setting}</span>
          </div>
          <div className="text-[11px] text-brand-400 font-medium pt-1">
            Target Date: {formattedDate}
          </div>
        </div>
      </div>

    </aside>
  );
};
