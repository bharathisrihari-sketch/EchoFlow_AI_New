import React from 'react';
import { ChevronLeft, ChevronRight, Compass, ArrowRight } from 'lucide-react';
import { NavSection, NavState, TOUR_STEPS, serializeHash } from '../config/navigation';

interface NavigationStepperProps {
  navState: NavState;
  onNavigate: (state: NavState) => void;
}

export const NavigationStepper: React.FC<NavigationStepperProps> = ({
  navState,
  onNavigate,
}) => {
  const currentStepIndex = TOUR_STEPS.findIndex((s) => s.id === navState.section);
  const isTourSection = currentStepIndex !== -1;
  const currentStep = isTourSection ? TOUR_STEPS[currentStepIndex] : null;

  const handleBack = () => {
    if (currentStepIndex > 0) {
      const prev = TOUR_STEPS[currentStepIndex - 1];
      if (prev.id === 'try') {
        onNavigate({ section: 'try', sub: 'normalizer' });
      } else if (prev.id === 'how') {
        onNavigate({ section: 'how', sub: 'architecture' });
      } else {
        onNavigate({ section: prev.id });
      }
    }
  };

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      const next = TOUR_STEPS[currentStepIndex + 1];
      if (next.id === 'try') {
        onNavigate({ section: 'try', sub: 'normalizer' });
      } else if (next.id === 'how') {
        onNavigate({ section: 'how', sub: 'architecture' });
      } else {
        onNavigate({ section: next.id });
      }
    }
  };

  if (!isTourSection) {
    // If user is currently in Help or outside the 5 main steps, show a sleek "Resume tour" chip
    return (
      <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2 text-xs">
        <span className="text-slate-400">Viewing Reference & Support</span>
        <button
          onClick={() => onNavigate({ section: 'start' })}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/40 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Resume 5-Step Tour</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-3.5 sm:px-5 shadow-md backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Step Indicator & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((s, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    if (s.id === 'try') onNavigate({ section: 'try', sub: 'normalizer' });
                    else if (s.id === 'how') onNavigate({ section: 'how', sub: 'architecture' });
                    else onNavigate({ section: s.id });
                  }}
                  title={s.title}
                  aria-label={`Jump to ${s.title}`}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    isCurrent
                      ? 'w-8 bg-cyan-400 shadow-sm shadow-cyan-400/50'
                      : isPast
                      ? 'w-4 bg-emerald-400/70 hover:bg-emerald-300'
                      : 'w-4 bg-slate-800 hover:bg-slate-700'
                  }`}
                />
              );
            })}
          </div>

          <div className="text-xs font-mono text-slate-300">
            <span className="text-cyan-400 font-bold">Step {currentStep?.stepNumber} of 5:</span>{' '}
            <span className="text-slate-200 font-medium">{currentStep?.title}</span>
          </div>
        </div>

        {/* Back and Next Controls */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            aria-label="Previous step"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepIndex === TOUR_STEPS.length - 1}
            aria-label="Next step"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 disabled:pointer-events-none transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer shadow-sm shadow-cyan-500/20"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface NextStepButtonProps {
  currentSection: NavSection;
  onNavigate: (state: NavState) => void;
}

export const NextStepFooterButton: React.FC<NextStepButtonProps> = ({
  currentSection,
  onNavigate,
}) => {
  const currentStepIndex = TOUR_STEPS.findIndex((s) => s.id === currentSection);
  if (currentStepIndex === -1 || currentStepIndex >= TOUR_STEPS.length - 1) return null;

  const nextStep = TOUR_STEPS[currentStepIndex + 1];

  const handleAdvance = () => {
    if (nextStep.id === 'try') {
      onNavigate({ section: 'try', sub: 'normalizer' });
    } else if (nextStep.id === 'how') {
      onNavigate({ section: 'how', sub: 'architecture' });
    } else {
      onNavigate({ section: nextStep.id });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pt-8 pb-4 flex justify-end">
      <button
        onClick={handleAdvance}
        className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
      >
        <span>Next: {nextStep.nextLabel}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
