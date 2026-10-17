import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { NavState } from '../config/navigation';

interface FirstVisitWelcomeModalProps {
  onStartTour: () => void;
}

export const FirstVisitWelcomeModal: React.FC<FirstVisitWelcomeModalProps> = ({
  onStartTour,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const welcomed = localStorage.getItem('echoflow_first_visit_welcomed');
      if (!welcomed) {
        setIsOpen(true);
      }
    } catch {
      // In case localStorage is blocked
    }
  }, []);

  const handleTakeTour = () => {
    try {
      localStorage.setItem('echoflow_first_visit_welcomed', 'tour_started');
    } catch {}
    setIsOpen(false);
    onStartTour();
  };

  const handleSkip = () => {
    try {
      localStorage.setItem('echoflow_first_visit_welcomed', 'skipped');
    } catch {}
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-slate-900 border-2 border-cyan-500/40 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                Welcome to EchoFlow AI
              </span>
              <h2 id="welcome-modal-title" className="text-xl sm:text-2xl font-black text-white">
                Speech Cadence Normalizer
              </h2>
            </div>
          </div>

          <button
            onClick={handleSkip}
            aria-label="Close welcome message"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed mb-6">
          EchoFlow transforms hurried, stressful, or dialect-heavy speech into calm, articulate 150 WPM delivery — while strictly preserving the speaker’s natural human voice and cultural identity.
        </p>

        <div className="space-y-2.5 mb-8 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Preserves the speaker’s own pitch and timbre without generic robot voices</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Reduces Average Handle Time (AHT) by 18.5% across multilingual contact centers</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Processed ephemerally in volatile RAM — zero disk audio writes (GDPR / HIPAA)</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 justify-end">
          <button
            onClick={handleSkip}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            Skip & Explore on my own
          </button>

          <button
            onClick={handleTakeTour}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Take the 2-minute tour</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
