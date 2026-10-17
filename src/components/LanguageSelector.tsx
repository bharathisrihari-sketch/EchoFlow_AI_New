import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { LanguageKey } from '../types';
import { LANGUAGE_CONFIGS, getStoredLanguage, setStoredLanguage } from '../config/languages';

interface LanguageSelectorProps {
  currentLanguage: LanguageKey;
  onLanguageChange: (lang: LanguageKey) => void;
  isStreaming?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
  isStreaming,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recentUpdate, setRecentUpdate] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const activeConfig = LANGUAGE_CONFIGS[currentLanguage] || LANGUAGE_CONFIGS.English;

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelectLanguage = (lang: LanguageKey) => {
    setStoredLanguage(lang);
    onLanguageChange(lang);
    setIsOpen(false);
    setRecentUpdate(`${lang} Relay Synced`);
    setTimeout(() => setRecentUpdate(null), 2500);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 text-xs text-slate-100 transition-all shadow-sm hover:border-cyan-500/60 focus:outline-none"
        title="Change Language & WebSocket Pacing Instruction"
      >
        <div className="flex items-center gap-1.5">
          <span className="text-sm leading-none">{activeConfig.flag}</span>
          <span className="font-semibold text-slate-200">{activeConfig.name}</span>
          <span className="text-[10px] font-mono text-cyan-400 font-bold px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-800">
            {activeConfig.targetPaceWpm} WPM
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-cyan-400' : ''
          }`}
        />
      </button>

      {/* System Instruction Updated Notification Toast */}
      {recentUpdate && (
        <div className="absolute top-10 right-0 z-50 whitespace-nowrap px-2.5 py-1 rounded-lg bg-emerald-950/95 border border-emerald-500/80 text-[10px] font-mono text-emerald-300 shadow-xl flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
          <Zap className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span>System Instruction Updated: {recentUpdate}</span>
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-slate-950/95 border border-slate-800 shadow-2xl p-2 z-50 backdrop-blur-xl animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-slate-800/80 mb-1 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-300">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>DIALECT PACING MATRIX</span>
            </div>
            <span className="text-[9px] font-mono text-slate-500 uppercase">
              {isStreaming ? 'STREAMING ACTIVE' : 'PERSISTENT'}
            </span>
          </div>

          <div className="space-y-1">
            {(Object.keys(LANGUAGE_CONFIGS) as LanguageKey[]).map((langKey) => {
              const cfg = LANGUAGE_CONFIGS[langKey];
              const isSelected = langKey === currentLanguage;

              return (
                <button
                  key={langKey}
                  type="button"
                  onClick={() => handleSelectLanguage(langKey)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-cyan-950/50 border border-cyan-500/60 shadow-sm shadow-cyan-950'
                      : 'hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-base mt-0.5">{cfg.flag}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-100">{cfg.name}</span>
                        <span className="text-[10px] text-slate-400 font-sans">
                          • {cfg.nativeName}
                        </span>
                      </div>
                      <div className="text-[10px] text-cyan-400/90 font-mono mt-0.5">
                        {cfg.pacingStrategy}
                      </div>
                      <div className="text-[9px] text-slate-500 line-clamp-1 mt-0.5">
                        Filters: {cfg.fillerWords.slice(0, 4).join(', ')}...
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                      {cfg.targetPaceWpm} WPM
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 mt-1" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800/80 px-2 text-[10px] text-slate-400 flex items-center justify-between font-mono">
            <span>Relay: WebSocket & Gemini Live</span>
            <span className="text-emerald-400">Low-Latency Bidi</span>
          </div>
        </div>
      )}
    </div>
  );
};
