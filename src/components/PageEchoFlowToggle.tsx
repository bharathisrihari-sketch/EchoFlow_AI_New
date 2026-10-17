/**
 * EchoFlow AI: Page-Specific EchoFlow ON/OFF Toggle
 * 
 * Allows users to toggle EchoFlow normalization ON or OFF independently
 * on every single page/tab to observe the immediate contrast between
 * raw, erratic speech delivery and EchoFlow's 150 WPM normalized cadence.
 */

import React, { useState, useEffect } from 'react';
import { Zap, Volume2, VolumeX, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface PageEchoFlowToggleProps {
  pageId: string;
  pageTitle: string;
  description?: string;
  onToggleChange?: (isActive: boolean) => void;
  className?: string;
}

export const PageEchoFlowToggle: React.FC<PageEchoFlowToggleProps> = ({
  pageId,
  pageTitle,
  description,
  onToggleChange,
  className = '',
}) => {
  // Store page-specific EchoFlow state in localStorage
  const storageKey = `echoflow_toggle_${pageId}`;
  const [isActive, setIsActive] = useState<boolean>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved !== null ? saved === 'true' : true; // Default ON
  });

  const toggle = () => {
    const nextState = !isActive;
    setIsActive(nextState);
    localStorage.setItem(storageKey, String(nextState));
    if (onToggleChange) {
      onToggleChange(nextState);
    }
  };

  useEffect(() => {
    if (onToggleChange) {
      onToggleChange(isActive);
    }
  }, [isActive, onToggleChange]);

  return (
    <div
      className={`rounded-2xl p-4 transition-all duration-300 border ${
        isActive
          ? 'bg-gradient-to-r from-cyan-950/60 via-slate-900/80 to-emerald-950/40 border-cyan-500/40 shadow-lg shadow-cyan-500/5'
          : 'bg-gradient-to-r from-amber-950/40 via-slate-900/80 to-slate-950 border-amber-500/40 shadow-lg shadow-amber-500/5'
      } ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Status & Context */}
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
              isActive
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-md shadow-cyan-500/20'
                : 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/20'
            }`}
          >
            {isActive ? <Zap className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                <span>EchoFlow Normalization Engine:</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-mono font-semibold uppercase tracking-wider ${
                    isActive
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                      : 'bg-amber-950 text-amber-300 border border-amber-700/60'
                  }`}
                >
                  {isActive ? '● ACTIVE (150 WPM)' : '○ BYPASSED (Raw Speech)'}
                </span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                [Scope: <strong className="text-slate-200">{pageTitle}</strong>]
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {isActive ? (
                <span>
                  <strong className="text-cyan-400">Active:</strong> Normalizing erratic pace to steady{' '}
                  <strong>150 WPM</strong>, suppressing cognitive fillers, preserving pitch ($F_0$), and harmonizing
                  accents for this screen.
                </span>
              ) : (
                <span>
                  <strong className="text-amber-400">Bypassed:</strong> Audio runs in raw pass-through mode without
                  normalization. Retaining original pacing, cognitive fillers, and native accent friction.
                </span>
              )}
            </p>

            {description && <p className="text-[11px] text-slate-400 mt-0.5 italic">{description}</p>}
          </div>
        </div>

        {/* Right: Master Toggle Switch */}
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          <span className="text-xs font-mono font-medium text-slate-400 hidden md:inline">
            {isActive ? 'Normalization Active' : 'Pass-Through Mode'}
          </span>

          <button
            onClick={toggle}
            type="button"
            role="switch"
            aria-checked={isActive}
            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 border ${
              isActive
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 border-cyan-400'
                : 'bg-slate-800 border-slate-700'
            }`}
          >
            <span className="sr-only">Toggle EchoFlow on {pageTitle}</span>
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-slate-950 shadow-md transition-transform flex items-center justify-center ${
                isActive ? 'translate-x-9 text-cyan-400' : 'translate-x-1 text-slate-400'
              }`}
            >
              {isActive ? <Zap className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
