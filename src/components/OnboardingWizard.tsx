import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Loader2, 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Wand2,
  HeartHandshake
} from 'lucide-react';
import { useEventContext } from '../context/useEventContext';
import { EventType } from '../types/event';
import { generateEventDossier, OnboardingInput } from '../services/geminiService';
import { INITIAL_EVENTS } from '../data/mockEvents';

const CURATED_VIBES = [
  {
    title: 'Boho Rustic Elegance',
    desc: 'Warm terracotta, natural linen, organic pampas grass, and golden-hour acoustic intimacy.',
    type: 'Wedding' as EventType
  },
  {
    title: 'Cyberpunk Retro 30th',
    desc: 'Neon Tokyo synthwave, ultraviolet lasers, interactive projection mapping, and street bao.',
    type: 'Milestone Birthday' as EventType
  },
  {
    title: 'Zero-Waste Neighborhood Cookout',
    desc: 'Locally grown harvest, solar-powered sound, compostable tablewares, and folk acoustic.',
    type: 'Community Festival / Fundraiser' as EventType
  },
  {
    title: 'Midnight Black-Tie Gala',
    desc: 'Dramatic obsidian velvet, crystal champagne towers, live jazz big band, and caviar bar.',
    type: 'Anniversary Gala' as EventType
  },
  {
    title: 'Sunset Rooftop Tech Mixer',
    desc: 'Minimalist industrial loft, nitro cold brew & craft spritzes, ambient house, and ambient LED bar.',
    type: 'Corporate Gathering' as EventType
  }
];

export const OnboardingWizard: React.FC = () => {
  const { createEvent, apiKey } = useEventContext();

  const [step, setStep] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStage, setGenerationStage] = useState<string>('');

  const [formData, setFormData] = useState<OnboardingInput>({
    name: 'Serena & Julian Sunset Wedding',
    eventType: 'Wedding',
    date: '2026-10-24',
    time: '16:00',
    location: 'Skyline Terrace Vineyard, Napa Valley, CA',
    guestCount: 130,
    demographics: 'Close friends & extended families, 25-60 age range',
    setting: 'Hybrid',
    vibeTone: 'Modern Wine Country Romance with French Oak barrels, olive branch runners, and twilight string orchestra.',
    currency: '$',
    totalBudget: 35000
  });

  const handleNext = () => setStep(prev => Math.min(prev + 1, 4));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const handleApplyVibe = (vibe: typeof CURATED_VIBES[0]) => {
    setFormData(prev => ({
      ...prev,
      eventType: vibe.type,
      vibeTone: `${vibe.title} — ${vibe.desc}`
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationStage('Synthesizing persona & allocating industry-standard budget...');
    
    try {
      setTimeout(() => {
        setGenerationStage('Generating macro milestones & minute-by-minute run of show...');
      }, 1000);

      setTimeout(() => {
        setGenerationStage('Vetting prospective vendors & drafting contract red flags...');
      }, 2000);

      setTimeout(() => {
        setGenerationStage('Curating color palettes, bespoke cocktail recipes & speech drafts...');
      }, 3000);

      const generatedPlan = await generateEventDossier(formData, apiKey);
      createEvent(generatedPlan);
    } catch (err) {
      console.error(err);
      alert('Event generation failed. Please check your inputs or API key.');
    } finally {
      setIsGenerating(false);
      setGenerationStage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Wizard Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 text-xs font-semibold border border-brand-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          Intelligent Persona Setup & Dossier Synthesis
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
          Design Your Next Celebration
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Feed Gemini AI your event parameters. In seconds, our Copilot generates custom budget splits, minute-by-minute schedules, vendor checklists, and creative moodboards.
        </p>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 max-w-md mx-auto">
        {[
          { num: 1, label: 'Identity' },
          { num: 2, label: 'Scale' },
          { num: 3, label: 'Financial' },
          { num: 4, label: 'Vibe & Vetting' }
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <button
              onClick={() => setStep(s.num)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === s.num
                  ? 'bg-brand-500 text-white shadow-glow-brand ring-2 ring-brand-400/50'
                  : step > s.num
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-surface-800 text-slate-400 border border-slate-700'
              }`}
            >
              {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
            </button>
            <span className={`text-[11px] font-semibold hidden md:inline ${step === s.num ? 'text-white' : 'text-slate-500'}`}>
              {s.label}
            </span>
            {s.num < 4 && <div className="w-4 sm:w-8 h-0.5 bg-slate-800" />}
          </div>
        ))}
      </div>

      {/* Quick Curated Presets Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800/80">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
          <span className="flex items-center gap-1.5 text-brand-300">
            <HeartHandshake className="w-3.5 h-3.5" />
            Quick Inspiration Presets (1-Click Fill)
          </span>
          <span className="text-[11px] text-slate-500">Click to autofill wizard fields</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {INITIAL_EVENTS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => {
                setFormData({
                  name: sample.name,
                  eventType: sample.eventType,
                  date: sample.date,
                  time: sample.time,
                  location: sample.location,
                  guestCount: sample.guestCount,
                  demographics: sample.demographics,
                  setting: sample.setting,
                  vibeTone: sample.vibeTone,
                  currency: sample.currency,
                  totalBudget: sample.totalBudget
                });
              }}
              className="p-2.5 rounded-xl bg-surface-900/70 hover:bg-surface-800 border border-slate-800 hover:border-brand-500/40 text-left transition-all group"
            >
              <div className="text-xs font-semibold text-slate-200 group-hover:text-brand-300 truncate">
                {sample.name}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {sample.eventType} • {sample.currency}{sample.totalBudget.toLocaleString()}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Wizard Form Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800/90 shadow-glass space-y-6">
        
        {/* STEP 1: EVENT PERSONA */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-400" />
              Step 1: Event Identity & Venue Location
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="wizard-event-name" className="text-xs font-semibold text-slate-300">Event Title / Working Name</label>
                <input
                  id="wizard-event-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Liam's Cyberpunk 30th Birthday"
                  className="w-full bg-surface-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="wizard-event-type" className="text-xs font-semibold text-slate-300">Celebration Category</label>
                <select
                  id="wizard-event-type"
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value as EventType })}
                  className="w-full bg-surface-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 cursor-pointer"
                >
                  <option value="Wedding">Wedding</option>
                  <option value="Milestone Birthday">Milestone Birthday</option>
                  <option value="Community Festival / Fundraiser">Community Festival / Fundraiser</option>
                  <option value="Corporate Gathering">Corporate Gathering</option>
                  <option value="Anniversary Gala">Anniversary Gala</option>
                  <option value="Baby Shower / Family Celebration">Baby Shower / Family Celebration</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="wizard-event-date" className="text-xs font-semibold text-slate-300">Target Date</label>
                <input
                  id="wizard-event-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-surface-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="wizard-event-time" className="text-xs font-semibold text-slate-300">Primary Start Time</label>
                <input
                  id="wizard-event-time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full bg-surface-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="wizard-event-location" className="text-xs font-semibold text-slate-300">Location / Venue Concept</label>
                <div className="relative">
                  <input
                    id="wizard-event-location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Industrial Rooftop Studio, Downtown Austin, TX"
                    className="w-full bg-surface-900 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Venue Setting</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Indoor', 'Outdoor', 'Hybrid'] as const).map((setting) => (
                    <button
                      key={setting}
                      type="button"
                      onClick={() => setFormData({ ...formData, setting })}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        formData.setting === setting
                          ? 'bg-brand-600 text-white border-brand-500 shadow-glow-brand'
                          : 'bg-surface-900 text-slate-300 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {setting}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: SCALE & DEMOGRAPHICS */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-400" />
              Step 2: Scale, Attendance & Audience Persona
            </h2>

            <div className="space-y-4">
              <div className="glass-card rounded-xl p-4 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-300">Target Guest Count</span>
                  <span className="text-brand-300 font-display text-base font-bold">
                    {formData.guestCount} Attendees
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="1000"
                  step="5"
                  value={formData.guestCount}
                  onChange={(e) => setFormData({ ...formData, guestCount: Number(e.target.value) })}
                  className="w-full accent-brand-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Intimate (15-50)</span>
                  <span>Medium (50-200)</span>
                  <span>Large Festival (200-1000+)</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="wizard-guest-demographics" className="text-xs font-semibold text-slate-300">
                  Guest Demographics & Audience Persona
                </label>
                <textarea
                  id="wizard-guest-demographics"
                  rows={3}
                  value={formData.demographics}
                  onChange={(e) => setFormData({ ...formData, demographics: e.target.value })}
                  placeholder="e.g., Mix of creative founders, college alumni, tech peers, with diverse dietary preferences (GF, vegan, Halal)."
                  className="w-full bg-surface-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                />
                <p className="text-[11px] text-slate-400">
                  This guides the AI in curating dietary menu options, seating styles, and entertainment pacing.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: FINANCIAL BOUNDARY */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-brand-400" />
              Step 3: Total Budget & Currency Allocator
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="wizard-currency" className="text-xs font-semibold text-slate-300">Preferred Currency</label>
                <select
                  id="wizard-currency"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full bg-surface-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 cursor-pointer"
                >
                  <option value="$">USD ($)</option>
                  <option value="€">EUR (€)</option>
                  <option value="£">GBP (£)</option>
                  <option value="₹">INR (₹)</option>
                  <option value="CAD $">CAD ($)</option>
                  <option value="AUD $">AUD ($)</option>
                </select>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="wizard-total-budget" className="text-xs font-semibold text-slate-300">Total All-Inclusive Budget</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">
                    {formData.currency}
                  </span>
                  <input
                    id="wizard-total-budget"
                    type="number"
                    min="500"
                    step="500"
                    value={formData.totalBudget}
                    onChange={(e) => setFormData({ ...formData, totalBudget: Number(e.target.value) })}
                    className="w-full bg-surface-900 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  />
                </div>
              </div>
            </div>

            {/* Calculated Per-Guest Estimate */}
            <div className="glass-card rounded-xl p-4 border border-slate-800 text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-400">Estimated Cost Per Attendee:</span>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">
                  {formData.currency}{Math.round(formData.totalBudget / (formData.guestCount || 1))} / guest
                </div>
              </div>
              <div className="text-[11px] text-slate-400 text-right">
                Includes 10% Emergency Contingency Reserve
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: VIBE & AESTHETIC TONE */}
        {step === 4 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-brand-400" />
              Step 4: Vibe, Aesthetic Tone & Moodboard Direction
            </h2>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                Pick a Curated Design Concept or Write Your Own:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CURATED_VIBES.map((vibe, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleApplyVibe(vibe)}
                    className="p-3 rounded-xl bg-surface-900/80 hover:bg-surface-800 border border-slate-800 hover:border-brand-500/40 text-left transition-all group"
                  >
                    <div className="text-xs font-bold text-brand-300 group-hover:text-white">
                      {vibe.title}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                      {vibe.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label htmlFor="wizard-custom-vibe" className="text-xs font-semibold text-slate-300">Custom Vibe Statement</label>
              <textarea
                id="wizard-custom-vibe"
                rows={3}
                value={formData.vibeTone}
                onChange={(e) => setFormData({ ...formData, vibeTone: e.target.value })}
                placeholder="e.g., Retro 70s Disco Funk with warm gold sequins, vinyl DJ booths, and spicy mezcal palomas."
                className="w-full bg-surface-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
          {step > 1 ? (
            <button
              onClick={handlePrev}
              disabled={isGenerating}
              className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-surface-900 hover:bg-surface-800 text-slate-300 border border-slate-700 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Previous
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white transition-all shadow-glow-brand"
            >
              Continue
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2.5 text-xs font-bold px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 hover:opacity-95 text-white transition-all shadow-glow-brand disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Synthesizing Dossier...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Complete Event Plan</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Generation Progress Indicator */}
        {isGenerating && (
          <div className="mt-4 p-4 rounded-xl bg-surface-900/90 border border-brand-500/30 flex items-center gap-3 animate-pulse">
            <Loader2 className="w-5 h-5 text-brand-400 animate-spin shrink-0" />
            <div className="text-xs text-brand-200 font-medium">
              {generationStage || 'Synthesizing with Gemini AI...'}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
