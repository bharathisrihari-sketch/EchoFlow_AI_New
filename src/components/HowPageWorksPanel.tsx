import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, CheckCircle, ArrowRight } from 'lucide-react';
import { PAGE_GUIDES, PageHelpGuide } from '../config/navigation';

interface HowPageWorksPanelProps {
  pageKey: string;
  className?: string;
}

export const HowPageWorksPanel: React.FC<HowPageWorksPanelProps> = ({
  pageKey,
  className = '',
}) => {
  const guide: PageHelpGuide | undefined = PAGE_GUIDES[pageKey] || PAGE_GUIDES[pageKey.split('/')[0]];
  const storageKey = `echoflow_guide_expanded_${pageKey}`;

  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved !== null ? saved === 'true' : true; // Default expanded for first-time clarity
    } catch {
      return true;
    }
  });

  const toggle = () => {
    const next = !isExpanded;
    setIsExpanded(next);
    try {
      localStorage.setItem(storageKey, String(next));
    } catch {}
  };

  if (!guide) return null;

  return (
    <div
      className={`rounded-2xl border border-cyan-500/30 bg-slate-900/90 shadow-lg shadow-cyan-950/20 overflow-hidden transition-all ${className}`}
    >
      <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950/60 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-100 flex items-center gap-2">
              <span>How this page works</span>
              <span className="text-[11px] font-mono text-cyan-400 font-normal hidden sm:inline">
                • {guide.title}
              </span>
            </h3>
          </div>
        </div>

        <button
          onClick={toggle}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Hide how this page works panel' : 'Show how this page works panel'}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
        >
          <span>{isExpanded ? 'Hide Guide' : 'How to use this page'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-5 space-y-4 text-xs text-slate-300 animate-in fade-in-50 duration-200">
          {/* 1. What it shows */}
          <div className="flex items-start gap-3">
            <div className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-[10px] font-mono font-bold text-cyan-300 shrink-0 mt-0.5">
              WHAT IT SHOWS
            </div>
            <p className="text-slate-200 text-xs sm:text-sm font-medium leading-relaxed">
              {guide.whatItShows}
            </p>
          </div>

          {/* 2. 3 Steps to try it */}
          <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800/80 space-y-2.5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              3 STEPS TO TRY IT
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {guide.threeSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-xs text-slate-300 leading-snug">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. What to expect */}
          <div className="flex items-start gap-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3">
            <div className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-[10px] font-mono font-bold text-emerald-300 shrink-0 mt-0.5">
              WHAT TO EXPECT
            </div>
            <p className="text-emerald-200 text-xs leading-relaxed flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{guide.whatToExpect}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
