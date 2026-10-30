import React, { useState } from 'react';
import { 
  Palette, 
  Sparkles, 
  GlassWater, 
  Utensils, 
  FileText, 
  Copy, 
  Check, 
  Wand2, 
  Loader2, 
  Volume2, 
  Layers
} from 'lucide-react';
import { useEventContext } from '../context/useEventContext';
import { refreshCreativeIdeation } from '../services/geminiService';

export const CreativeStudio: React.FC = () => {
  const { activeEvent, updateIdeation, apiKey, triggerCelebration } = useEventContext();

  const [activeTab, setActiveTab] = useState<'moodboard' | 'menu' | 'scripts'>('moodboard');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleRegenerateConcept = async () => {
    setIsRefreshing(true);
    try {
      const refreshed = await refreshCreativeIdeation(activeEvent, customPrompt, apiKey);
      updateIdeation(refreshed);
      setCustomPrompt('');
      triggerCelebration();
    } catch (err) {
      console.error(err);
      alert('Could not refresh creative concept.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const { ideation } = activeEvent;

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Header & Sub-tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/10 text-accent-300 text-xs font-semibold border border-accent-500/20">
            <Palette className="w-3.5 h-3.5" />
            GenAI Creative Ideation Suite
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
            Creative Moodboard & Content Drafter
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Generative styling: cohesive HEX palettes, curated culinary menus, signature drinks, and copy-ready speeches.
          </p>
        </div>

        {/* Studio Sub-tabs */}
        <div className="bg-surface-900 p-1 rounded-xl border border-slate-800 flex items-center">
          <button
            onClick={() => setActiveTab('moodboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'moodboard'
                ? 'bg-brand-600 text-white shadow-glow-brand'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Aesthetics & Decor
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'menu'
                ? 'bg-brand-600 text-white shadow-glow-brand'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Menu & Beverages
          </button>
          <button
            onClick={() => setActiveTab('scripts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'scripts'
                ? 'bg-brand-600 text-white shadow-glow-brand'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Speeches & Invitations
          </button>
        </div>
      </div>

      {/* AI Prompt Refinement Bar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-brand-500/20 bg-gradient-to-r from-surface-900 via-surface-900/90 to-surface-950 flex flex-col sm:flex-row items-center gap-3 shadow-glass">
        <div className="w-9 h-9 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-300 border border-brand-500/30 shrink-0">
          <Wand2 className="w-4 h-4" />
        </div>
        <div className="flex-1 w-full">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Direct Gemini AI: e.g., 'Make it more dark romantic with burgundy tones' or 'Incorporate Mexican agave & churro bar'..."
            className="w-full bg-surface-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
          />
        </div>
        <button
          onClick={handleRegenerateConcept}
          disabled={isRefreshing}
          className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 hover:opacity-95 text-white shadow-glow-brand shrink-0 disabled:opacity-50"
        >
          {isRefreshing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Regenerating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Refresh Theme</span>
            </>
          )}
        </button>
      </div>

      {/* TAB 1: MOODBOARD & AESTHETICS */}
      {activeTab === 'moodboard' && (
        <div className="space-y-6">
          
          {/* Theme Title & Vibe Statement Banner */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/20">
              Thematic Aura
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white">
              {ideation.themeTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic max-w-3xl">
              "{ideation.vibeStatement}"
            </p>
          </div>

          {/* Color Palette Section */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-brand-400" />
                Cohesive HEX Color Palette (Click to Copy Code)
              </h3>
              {copiedText && (
                <span className="text-xs text-emerald-400 font-semibold animate-pulse flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Copied {copiedText}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {ideation.colorPalette.map((swatch, idx) => (
                <div
                  key={idx}
                  onClick={() => copyToClipboard(swatch.hex, swatch.hex)}
                  className="glass-card rounded-xl p-3 border border-slate-800 hover:border-brand-500/40 cursor-pointer transition-all group hover:scale-[1.02]"
                >
                  <div
                    className="w-full h-24 rounded-lg shadow-inner border border-white/10 flex items-end p-2 transition-transform"
                    style={{ backgroundColor: swatch.hex }}
                  >
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-sm">
                      {swatch.hex}
                    </span>
                  </div>

                  <div className="mt-2.5">
                    <div className="text-xs font-bold text-white group-hover:text-brand-300 truncate">
                      {swatch.name}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
                      {swatch.usage}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decor & Atmospheric Lighting Concepts */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-400" />
              Decor, Centerpieces & Lighting Directives
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ideation.decorAndLighting.map((concept, idx) => (
                <div
                  key={idx}
                  className="glass-card rounded-xl p-4 border border-slate-800 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-accent-500/15 text-accent-300 border border-accent-500/20">
                      {concept.category}
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {concept.suggestion}
                    </p>
                  </div>

                  {concept.promptForVisuals && (
                    <div className="p-2.5 rounded-lg bg-surface-950/80 border border-slate-800/80 space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
                        <span>AI Visual Generation Prompt:</span>
                        <button
                          onClick={() => copyToClipboard(concept.promptForVisuals, 'DALL-E Prompt')}
                          className="hover:text-white"
                          title="Copy Image Generation Prompt"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400 italic line-clamp-3">
                        "{concept.promptForVisuals}"
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: MENU & BEVERAGES */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          
          {/* Signature Cocktails & Mocktails */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                <GlassWater className="w-4 h-4 text-brand-400" />
                Themed Signature Sips (Cocktails & Mocktails)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ideation.menuAndBeverages.cocktails.map((drink, idx) => (
                <div
                  key={idx}
                  className="glass-card rounded-xl p-5 border border-slate-800 space-y-2.5 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-extrabold text-base text-white">
                      {drink.name}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      drink.type === 'Cocktail'
                        ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30'
                        : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {drink.type}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300">
                    <strong className="text-slate-400 font-medium">Recipe / Ingredients:</strong>{' '}
                    {drink.ingredients}
                  </div>

                  <div className="p-2.5 rounded-lg bg-surface-950/70 border border-slate-800/80 text-[11px] text-brand-200">
                    <strong>Flavor Profile:</strong> {drink.flavorNotes}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Catering Courses & Dietary Consideration */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
              <Utensils className="w-4 h-4 text-emerald-400" />
              Dietary-Conscious Catering Courses
            </h3>

            <div className="space-y-3">
              {ideation.menuAndBeverages.cateringCourses.map((course, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-surface-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-surface-950 text-slate-400 border border-slate-800">
                        {course.course}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {course.dishName}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      {course.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    {course.dietaryTags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Pairings */}
            {ideation.menuAndBeverages.pairings && ideation.menuAndBeverages.pairings.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-800/80">
                <span className="text-xs font-bold text-slate-300">Sommelier & Beverage Pairings:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {ideation.menuAndBeverages.pairings.map((pairing, pIdx) => (
                    <span
                      key={pIdx}
                      className="text-xs px-3 py-1 rounded-xl bg-surface-900 text-slate-200 border border-slate-800"
                    >
                      🍷 {pairing}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 3: SCRIPTS & INVITATIONS */}
      {activeTab === 'scripts' && (
        <div className="space-y-6">
          
          {/* Invitation Copy Drafting */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Formal Invitation */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-brand-400" />
                  Formal Invitation Copy
                </span>
                <button
                  onClick={() => copyToClipboard(ideation.contentAndScripts.invitationCopyFormal, 'Formal Invite')}
                  className="text-xs text-brand-300 hover:text-brand-200 flex items-center gap-1 font-semibold"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>

              <div className="p-4 rounded-xl bg-surface-950 border border-slate-800 font-serif text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                {ideation.contentAndScripts.invitationCopyFormal}
              </div>
            </div>

            {/* Casual Invitation */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-accent-400" />
                  Casual / Digital Message Copy
                </span>
                <button
                  onClick={() => copyToClipboard(ideation.contentAndScripts.invitationCopyCasual, 'Casual Invite')}
                  className="text-xs text-accent-300 hover:text-accent-200 flex items-center gap-1 font-semibold"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>

              <div className="p-4 rounded-xl bg-surface-950 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                {ideation.contentAndScripts.invitationCopyCasual}
              </div>
            </div>

          </div>

          {/* Toast / Speech Outline */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-amber-400" />
                Toast & Keynote Speech Structure (Timed)
              </h3>
              <button
                onClick={() => {
                  const speechFull = ideation.contentAndScripts.toastSpeechOutline
                    .map(s => `${s.section} (${s.durationEstimate}):\n${s.talkingPoints}`)
                    .join('\n\n');
                  copyToClipboard(speechFull, 'Full Speech Outline');
                }}
                className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1 font-semibold"
              >
                <Copy className="w-3 h-3" /> Copy Full Outline
              </button>
            </div>

            <div className="space-y-3">
              {ideation.contentAndScripts.toastSpeechOutline.map((section, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-surface-900/80 border border-slate-800 flex items-start gap-3.5"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-500/30">
                    {idx + 1}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">
                        {section.section}
                      </span>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-surface-950 text-slate-400 border border-slate-800">
                        {section.durationEstimate}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {section.talkingPoints}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Signage Copy */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-400" />
              Event Signage & Wayfinding Copy
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {ideation.contentAndScripts.signageText.map((sign, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-surface-900/80 border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-500/15 text-brand-300 border border-brand-500/30">
                      {sign.signType}
                    </span>
                    <button
                      onClick={() => copyToClipboard(sign.text, sign.signType)}
                      className="text-slate-500 hover:text-white"
                      title="Copy text"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    "{sign.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
