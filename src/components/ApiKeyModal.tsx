import React, { useState } from 'react';
import { 
  X, 
  Key, 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Lock
} from 'lucide-react';
import { useEventContext } from '../context/EventContext';

export const ApiKeyModal: React.FC = () => {
  const { 
    apiKey, 
    setApiKey, 
    isApiKeyModalOpen, 
    setIsApiKeyModalOpen 
  } = useEventContext();

  const [inputKey, setInputKey] = useState<string>(apiKey);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  if (!isApiKeyModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setApiKey(inputKey.trim());
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsApiKeyModalOpen(false);
    }, 1200);
  };

  const handleClear = () => {
    setInputKey('');
    setApiKey('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in no-print">
      <div className="glass-panel rounded-2xl border border-slate-700 max-w-lg w-full p-6 space-y-5 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-300 border border-brand-500/30">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-display font-bold text-white">
                Gemini API Configuration
              </h3>
              <p className="text-xs text-slate-400">
                Direct client-side connection with Gemini 1.5 Flash
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsApiKeyModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Banner */}
        <div className="p-3.5 rounded-xl bg-surface-900/90 border border-slate-800 text-xs text-slate-300 space-y-2">
          <div className="flex items-center gap-2 text-brand-300 font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>Private & Zero-Server Exposure</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Your key is persisted strictly in your browser's <code className="text-brand-300">localStorage</code> and transmitted directly to Google's Generative Language API. It never touches any intermediate proxy servers.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Google Gemini API Key</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-brand-400 hover:underline flex items-center gap-1 text-[11px]"
              >
                Get API Key <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full mt-1.5 bg-surface-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            />
          </div>

          {/* Fallback Notice */}
          <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Zero-Friction Fallback Mode Included:</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              If you leave this blank or are evaluating offline, EventVibe AI activates its built-in high-fidelity heuristic generator. All wizard synthesis, budget optimizer tips, and moodboards work immediately out of the box!
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            {apiKey ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-rose-400 hover:underline"
              >
                Clear Saved Key
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsApiKeyModalOpen(false)}
                className="text-xs px-4 py-2 rounded-xl text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-glow-brand transition-all"
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save API Key</span>
                )}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
