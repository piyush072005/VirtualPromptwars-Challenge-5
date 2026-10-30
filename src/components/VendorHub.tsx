import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  ShieldCheck, 
  Phone, 
  Mail, 
  HelpCircle,
  Check,
  ChevronDown,
  ChevronUp,
  Award
} from 'lucide-react';
import { useEventContext } from '../context/useEventContext';
import { VendorCard, VendorStatus } from '../types/event';

export const VendorHub: React.FC = () => {
  const { 
    activeEvent, 
    addVendorCard, 
    updateVendorCard, 
    deleteVendorCard, 
    addVendorQuote, 
    selectQuote,
    triggerCelebration 
  } = useEventContext();

  const [expandedVendorId, setExpandedVendorId] = useState<string | null>(
    activeEvent.vendors[0]?.id || null
  );
  const [isAddVendorModalOpen, setIsAddVendorModalOpen] = useState<boolean>(false);
  const [activeQuoteModalVendorId, setActiveQuoteModalVendorId] = useState<string | null>(null);

  // New Vendor Form State
  const [newVendor, setNewVendor] = useState<{
    category: VendorCard['category'];
    name: string;
    contactPerson: string;
    phone: string;
    email: string;
    estimatedCost: number;
    status: VendorStatus;
  }>({
    category: 'Venue',
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    estimatedCost: 3000,
    status: 'Researching'
  });

  // New Quote Form State
  const [newQuote, setNewQuote] = useState<{
    vendorName: string;
    quoteAmount: number;
    inclusions: string;
    pros: string;
    cons: string;
  }>({
    vendorName: '',
    quoteAmount: 2500,
    inclusions: 'Standard package, 4 hours service, cleanup',
    pros: 'High responsiveness, stellar reviews',
    cons: 'Overtime rate $200/hr'
  });

  const handleCreateVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendor.name.trim()) return;

    addVendorCard({
      ...newVendor,
      vettedQuestions: [
        { question: 'What is your cancellation and deposit refund policy?', answer: 'Deposit refundable up to 90 days prior.' },
        { question: 'Do you carry commercial general liability insurance ($1M+)?', answer: 'Yes, certificate provided upon booking.' }
      ],
      redFlagsToCheck: [
        { flag: 'Excessive overtime fees (> $200/hour)', checked: false },
        { flag: 'Strict non-refundable deposit without force majeure clause', checked: false }
      ],
      quotes: [],
      contractSigned: false
    });

    setIsAddVendorModalOpen(false);
    setNewVendor({
      category: 'Venue',
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      estimatedCost: 3000,
      status: 'Researching'
    });
    triggerCelebration();
  };

  const handleAddQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuoteModalVendorId || !newQuote.vendorName.trim()) return;

    addVendorQuote(activeQuoteModalVendorId, {
      vendorName: newQuote.vendorName,
      quoteAmount: newQuote.quoteAmount,
      inclusions: newQuote.inclusions.split(',').map(s => s.trim()),
      pros: newQuote.pros,
      cons: newQuote.cons,
      isSelected: false
    });

    setActiveQuoteModalVendorId(null);
    setNewQuote({
      vendorName: '',
      quoteAmount: 2500,
      inclusions: 'Standard package, 4 hours service',
      pros: '',
      cons: ''
    });
    triggerCelebration();
  };

  const getStatusBadge = (status: VendorStatus) => {
    switch (status) {
      case 'Hired':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Quoted':
        return 'bg-brand-500/15 text-brand-300 border-brand-500/30';
      case 'Contacted':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Declined':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'Researching':
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 text-xs font-semibold border border-brand-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Vendor Checklists, Vetting & Contract Co-Pilot
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
            Vendor Hub & Contract Co-Pilot
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Compare prospective vendor quotes side-by-side, verify targeted interview questions, and clear contract red flags.
          </p>
        </div>

        <button
          onClick={() => setIsAddVendorModalOpen(true)}
          className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white transition-all shadow-glow-brand"
        >
          <Plus className="w-4 h-4" />
          Add Vendor Card
        </button>
      </div>

      {/* Vendor Cards List */}
      <div className="space-y-4">
        {activeEvent.vendors.map((vendor) => {
          const isExpanded = expandedVendorId === vendor.id;
          const redFlagsCleared = vendor.redFlagsToCheck.filter(r => r.checked).length;
          const totalFlags = vendor.redFlagsToCheck.length;

          return (
            <div
              key={vendor.id}
              className={`glass-panel rounded-2xl border transition-all overflow-hidden ${
                vendor.contractSigned
                  ? 'border-emerald-500/30 bg-emerald-950/10'
                  : 'border-slate-800/90'
              }`}
            >
              {/* Header Bar */}
              <div 
                onClick={() => setExpandedVendorId(isExpanded ? null : vendor.id)}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-surface-900/40 transition-colors"
              >
                <div className="flex items-start md:items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-surface-900 border border-slate-700 flex items-center justify-center text-brand-400 font-bold shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {vendor.name}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-surface-900 text-slate-300 border border-slate-800">
                        {vendor.category}
                      </span>
                      {vendor.contractSigned && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Contract Signed
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3 mt-1">
                      {vendor.contactPerson && (
                        <span>Contact: <strong className="text-slate-300">{vendor.contactPerson}</strong></span>
                      )}
                      {vendor.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-500" /> {vendor.phone}
                        </span>
                      )}
                      {vendor.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-500" /> {vendor.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <div className="text-right">
                    <div className="font-mono text-xs font-bold text-white">
                      {activeEvent.currency}{vendor.estimatedCost.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Target Allocation
                    </div>
                  </div>

                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border ${getStatusBadge(vendor.status)}`}>
                    {vendor.status}
                  </span>

                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Expanded Content Details */}
              {isExpanded && (
                <div className="p-6 border-t border-slate-800/80 bg-surface-950/60 space-y-6">
                  
                  {/* Status, Contract Toggle & Quick Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl bg-surface-900/70 border border-slate-800">
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-semibold text-slate-300">Status:</label>
                      <select
                        value={vendor.status}
                        onChange={(e) => updateVendorCard(vendor.id, { status: e.target.value as VendorStatus })}
                        className="text-xs bg-surface-950 border border-slate-700 rounded-lg px-2.5 py-1 text-white focus:outline-none"
                      >
                        <option value="Researching">Researching</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Quoted">Quoted</option>
                        <option value="Hired">Hired</option>
                        <option value="Declined">Declined</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-200">
                        <input
                          type="checkbox"
                          checked={vendor.contractSigned}
                          onChange={(e) => {
                            updateVendorCard(vendor.id, { contractSigned: e.target.checked });
                            if (e.target.checked) triggerCelebration();
                          }}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-surface-950 border-slate-700 cursor-pointer"
                        />
                        <span className={vendor.contractSigned ? 'text-emerald-300' : 'text-slate-400'}>
                          Binding Contract Executed & Retainer Paid
                        </span>
                      </label>

                      <button
                        onClick={() => deleteVendorCard(vendor.id)}
                        className="text-xs text-slate-500 hover:text-rose-400 transition-colors p-1"
                        title="Delete Vendor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Two Column Layout: Vetting Questions & Red Flag Audit */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Vetting Questions */}
                    <div className="glass-card rounded-xl p-4 border border-slate-800/90 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-accent-400" />
                          Curated Vetting Questions to Ask
                        </h4>
                        <span className="text-[10px] text-slate-500">
                          {vendor.vettedQuestions.length} Questions
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {vendor.vettedQuestions.map((q, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-surface-900/60 border border-slate-800 text-xs space-y-1">
                            <div className="font-semibold text-slate-200">
                              Q: {q.question}
                            </div>
                            {q.answer ? (
                              <div className="text-[11px] text-emerald-300 font-mono pl-3 border-l-2 border-emerald-500/40">
                                Vendor Reply: {q.answer}
                              </div>
                            ) : (
                              <div className="text-[11px] text-slate-500 italic pl-3 border-l-2 border-slate-700">
                                Pending vendor inquiry
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contract Red Flags to Monitor */}
                    <div className="glass-card rounded-xl p-4 border border-slate-800/90 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          Contract Red-Flag Audit Checklist
                        </h4>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {redFlagsCleared}/{totalFlags} Cleared
                        </span>
                      </div>

                      <div className="space-y-2">
                        {vendor.redFlagsToCheck.map((flag, idx) => (
                          <label
                            key={idx}
                            className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                              flag.checked
                                ? 'bg-surface-900/40 border-slate-800/70 text-slate-400'
                                : 'bg-surface-900/90 border-slate-800 text-slate-200 hover:border-slate-700'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={flag.checked}
                              onChange={() => {
                                const updatedFlags = vendor.redFlagsToCheck.map((f, i) =>
                                  i === idx ? { ...f, checked: !f.checked } : f
                                );
                                updateVendorCard(vendor.id, { redFlagsToCheck: updatedFlags });
                              }}
                              className="mt-0.5 w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 bg-surface-950 border-slate-700"
                            />
                            <span className={flag.checked ? 'line-through text-slate-500' : ''}>
                              {flag.flag}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Side-by-Side Quote Comparison Template */}
                  <div className="glass-card rounded-xl p-4 border border-slate-800/90 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-brand-400" />
                        Side-by-Side Quote Comparison ({vendor.quotes.length} Quotes Logged)
                      </h4>
                      <button
                        onClick={() => setActiveQuoteModalVendorId(vendor.id)}
                        className="text-[11px] font-semibold text-brand-300 hover:text-brand-200 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Quote to Compare
                      </button>
                    </div>

                    {vendor.quotes.length === 0 ? (
                      <div className="p-4 text-center rounded-lg bg-surface-900/40 border border-slate-800 text-xs text-slate-500">
                        No prospective quotes logged yet. Click "Add Quote to Compare" to evaluate competing bids.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {vendor.quotes.map((quote) => (
                          <div
                            key={quote.id}
                            className={`p-3.5 rounded-xl border transition-all space-y-2 relative ${
                              quote.isSelected
                                ? 'bg-brand-950/20 border-brand-500/50 ring-1 ring-brand-500/30'
                                : 'bg-surface-900/70 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-white">
                                {quote.vendorName}
                              </span>
                              {quote.isSelected && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-brand-500 text-white shadow-glow-brand">
                                  Selected
                                </span>
                              )}
                            </div>

                            <div className="text-base font-mono font-extrabold text-brand-300">
                              {activeEvent.currency}{quote.quoteAmount.toLocaleString()}
                            </div>

                            <div className="text-[11px] text-slate-300 space-y-1">
                              <div>
                                <span className="font-semibold text-slate-400">Inclusions:</span>{' '}
                                {quote.inclusions.join(', ')}
                              </div>
                              {quote.pros && (
                                <div className="text-emerald-300 text-[10px]">
                                  <strong>Pros:</strong> {quote.pros}
                                </div>
                              )}
                              {quote.cons && (
                                <div className="text-rose-300 text-[10px]">
                                  <strong>Cons:</strong> {quote.cons}
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => {
                                selectQuote(vendor.id, quote.id);
                                triggerCelebration();
                              }}
                              className={`w-full text-xs font-semibold py-1.5 rounded-lg border transition-all mt-2 ${
                                quote.isSelected
                                  ? 'bg-brand-600 text-white border-brand-500'
                                  : 'bg-surface-800 hover:bg-surface-700 text-slate-300 border-slate-700'
                              }`}
                            >
                              {quote.isSelected ? 'Winning Selection' : 'Select Winning Bid'}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Vendor Modal */}
      {isAddVendorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel rounded-2xl p-6 border border-slate-700 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-display font-bold text-white">
              Add New Vendor Card
            </h3>

            <form onSubmit={handleCreateVendor} className="space-y-3">
              <div>
                <label htmlFor="vendor-name-input" className="text-xs font-semibold text-slate-300">Vendor Business Name</label>
                <input
                  id="vendor-name-input"
                  type="text"
                  required
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                  placeholder="e.g. Luminary Sound & Stage, Artisan Plate Collective"
                  className="w-full mt-1 bg-surface-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="vendor-category-select" className="text-xs font-semibold text-slate-300">Category</label>
                  <select
                    id="vendor-category-select"
                    value={newVendor.category}
                    onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value as VendorCard['category'] })}
                    className="w-full mt-1 bg-surface-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  >
                    <option value="Venue">Venue</option>
                    <option value="Catering & Bar">Catering & Bar</option>
                    <option value="Photography / Video">Photography / Video</option>
                    <option value="Music & DJ">Music & DJ</option>
                    <option value="Florist & Decor">Florist & Decor</option>
                    <option value="Permits & Security">Permits & Security</option>
                    <option value="Rentals">Rentals</option>
                    <option value="Planner / Staff">Planner / Staff</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="vendor-budget-input" className="text-xs font-semibold text-slate-300">Target Budget ({activeEvent.currency})</label>
                  <input
                    id="vendor-budget-input"
                    type="number"
                    min="0"
                    value={newVendor.estimatedCost}
                    onChange={(e) => setNewVendor({ ...newVendor, estimatedCost: Number(e.target.value) })}
                    className="w-full mt-1 bg-surface-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="vendor-contact-input" className="text-xs font-semibold text-slate-300">Primary Contact Person</label>
                <input
                  id="vendor-contact-input"
                  type="text"
                  value={newVendor.contactPerson}
                  onChange={(e) => setNewVendor({ ...newVendor, contactPerson: e.target.value })}
                  placeholder="e.g. Elena Vance (Booking Director)"
                  className="w-full mt-1 bg-surface-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="vendor-phone-input" className="text-xs font-semibold text-slate-300">Phone</label>
                  <input
                    id="vendor-phone-input"
                    type="text"
                    value={newVendor.phone}
                    onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full mt-1 bg-surface-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  />
                </div>
                <div>
                  <label htmlFor="vendor-email-input" className="text-xs font-semibold text-slate-300">Email</label>
                  <input
                    id="vendor-email-input"
                    type="email"
                    value={newVendor.email}
                    onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                    placeholder="contact@vendor.com"
                    className="w-full mt-1 bg-surface-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddVendorModalOpen(false)}
                  className="text-xs px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-xs font-semibold px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-glow-brand"
                >
                  Save Vendor Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Quote Comparison Modal */}
      {activeQuoteModalVendorId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel rounded-2xl p-6 border border-slate-700 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-display font-bold text-white">
              Add Competing Bid / Quote
            </h3>

            <form onSubmit={handleAddQuoteSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300">Quoting Company Name</label>
                <input
                  type="text"
                  required
                  value={newQuote.vendorName}
                  onChange={(e) => setNewQuote({ ...newQuote, vendorName: e.target.value })}
                  placeholder="e.g. Apex Visuals LLC"
                  className="w-full mt-1 bg-surface-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Total Quote Amount ({activeEvent.currency})</label>
                <input
                  type="number"
                  min="0"
                  value={newQuote.quoteAmount}
                  onChange={(e) => setNewQuote({ ...newQuote, quoteAmount: Number(e.target.value) })}
                  className="w-full mt-1 bg-surface-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Package Inclusions (comma-separated)</label>
                <input
                  type="text"
                  value={newQuote.inclusions}
                  onChange={(e) => setNewQuote({ ...newQuote, inclusions: e.target.value })}
                  placeholder="6 hours, 2 shooters, drone reels, photo album"
                  className="w-full mt-1 bg-surface-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Key Strengths / Pros</label>
                  <input
                    type="text"
                    value={newQuote.pros}
                    onChange={(e) => setNewQuote({ ...newQuote, pros: e.target.value })}
                    placeholder="e.g. Fast 10-day turnaround"
                    className="w-full mt-1 bg-surface-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Risks / Cons</label>
                  <input
                    type="text"
                    value={newQuote.cons}
                    onChange={(e) => setNewQuote({ ...newQuote, cons: e.target.value })}
                    placeholder="e.g. Extra $300 travel fee"
                    className="w-full mt-1 bg-surface-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveQuoteModalVendorId(null)}
                  className="text-xs px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-xs font-semibold px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-glow-brand"
                >
                  Save Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
