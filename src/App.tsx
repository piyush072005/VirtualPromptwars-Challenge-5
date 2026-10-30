import React from 'react';
import { EventProvider, useEventContext } from './context/EventContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { OnboardingWizard } from './components/OnboardingWizard';
import { BudgetEngine } from './components/BudgetEngine';
import { TimelineView } from './components/TimelineView';
import { VendorHub } from './components/VendorHub';
import { CreativeStudio } from './components/CreativeStudio';
import { ExportModal } from './components/ExportModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { PrintView } from './components/PrintView';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { 
  LayoutDashboard, 
  Sparkles, 
  DollarSign, 
  Clock, 
  Users, 
  Palette 
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab, setIsExportModalOpen } = useEventContext();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'onboarding':
        return <OnboardingWizard />;
      case 'budget':
        return <BudgetEngine />;
      case 'timeline':
        return <TimelineView />;
      case 'vendors':
        return <VendorHub />;
      case 'creative':
        return <CreativeStudio />;
      case 'export':
        return (
          <section aria-label="Export Master Dossier" className="text-center py-12 space-y-4">
            <h2 className="text-2xl font-bold font-display text-white">Export & Print Master Dossier</h2>
            <p className="text-slate-300 text-sm max-w-md mx-auto">
              Download your complete plan in Markdown, print a run-of-show itinerary, or export a JSON backup.
            </p>
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-glow-brand focus-visible:ring-2 focus-visible:ring-brand-400"
            >
              Open Export & Print Dialog
            </button>
          </section>
        );
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 text-slate-100 flex flex-col selection:bg-brand-500/30 selection:text-brand-200">
      
      {/* Top Navbar Header */}
      <Navbar />

      {/* Main Container */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto overflow-hidden">
        
        {/* Desktop Left Sidebar Nav */}
        <div className="hidden lg:block shrink-0">
          <Sidebar />
        </div>

        {/* Dynamic Main Workspace View with Error Boundary */}
        <main 
          id="main-content"
          role="main"
          className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-65px)] focus:outline-none"
          tabIndex={-1}
        >
          <ErrorBoundary>
            {renderActiveView()}
          </ErrorBoundary>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav 
        aria-label="Mobile Bottom Navigation"
        className="lg:hidden sticky bottom-0 z-40 bg-surface-950/95 border-t border-slate-800 backdrop-blur-xl px-2 py-2 flex items-center justify-around no-print"
      >
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] focus-visible:ring-2 focus-visible:ring-brand-400 ${
            activeTab === 'dashboard' ? 'text-brand-400 font-bold' : 'text-slate-400'
          }`}
          aria-label="Dashboard"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Home</span>
        </button>
        <button
          onClick={() => setActiveTab('budget')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] focus-visible:ring-2 focus-visible:ring-brand-400 ${
            activeTab === 'budget' ? 'text-brand-400 font-bold' : 'text-slate-400'
          }`}
          aria-label="Budget"
        >
          <DollarSign className="w-4 h-4" />
          <span>Budget</span>
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] focus-visible:ring-2 focus-visible:ring-brand-400 ${
            activeTab === 'timeline' ? 'text-brand-400 font-bold' : 'text-slate-400'
          }`}
          aria-label="Timeline"
        >
          <Clock className="w-4 h-4" />
          <span>Timeline</span>
        </button>
        <button
          onClick={() => setActiveTab('vendors')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] focus-visible:ring-2 focus-visible:ring-brand-400 ${
            activeTab === 'vendors' ? 'text-brand-400 font-bold' : 'text-slate-400'
          }`}
          aria-label="Vendors"
        >
          <Users className="w-4 h-4" />
          <span>Vendors</span>
        </button>
        <button
          onClick={() => setActiveTab('creative')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] focus-visible:ring-2 focus-visible:ring-brand-400 ${
            activeTab === 'creative' ? 'text-brand-400 font-bold' : 'text-slate-400'
          }`}
          aria-label="Creative"
        >
          <Palette className="w-4 h-4" />
          <span>Creative</span>
        </button>
        <button
          onClick={() => setActiveTab('onboarding')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] focus-visible:ring-2 focus-visible:ring-brand-400 ${
            activeTab === 'onboarding' ? 'text-brand-400 font-bold' : 'text-slate-400'
          }`}
          aria-label="New Plan"
        >
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span>New</span>
        </button>
      </nav>

      {/* Global Modals */}
      <ApiKeyModal />
      <ExportModal />

      {/* Hidden Print Container */}
      <PrintView />
    </div>
  );
};

export default function App() {
  return (
    <EventProvider>
      <MainLayout />
    </EventProvider>
  );
}
