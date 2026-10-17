/**
 * EchoFlow AI: Global Telemetry HUD Bar
 * 
 * Provides an always-visible, persistent telemetry display across all application pages.
 * Displays real-time streaming latency (<550ms SLA), cadence normalization, pitch retention,
 * and the 4-stage DSP latency breakdown with a one-click jump to the Live Waveform Studio.
 */

import React, { useState } from 'react';
import {
  Clock,
  Activity,
  Sparkles,
  Zap,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldCheck,
  Radio,
} from 'lucide-react';
import { TelemetryData } from '../types';
import { AppTab } from './GcpConsoleNav';

interface GlobalTelemetryBarProps {
  telemetry: TelemetryData;
  isStreaming: boolean;
  onNavigateToStudio: () => void;
  currentTab: AppTab;
  onOpenTestFeature?: () => void;
}

export const GlobalTelemetryBar: React.FC<GlobalTelemetryBarProps> = ({
  telemetry,
  isStreaming,
  onNavigateToStudio,
  currentTab,
  onOpenTestFeature,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-slate-900/90 border-b border-cyan-500/20 px-4 sm:px-6 py-2.5 shadow-md backdrop-blur-md relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Telemetry Title & Quick Indicators */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                  isStreaming ? 'bg-cyan-400 opacity-75' : 'bg-emerald-400 opacity-75'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isStreaming ? 'bg-cyan-500' : 'bg-emerald-500'
                }`}
              />
            </span>
            <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5 uppercase tracking-wider font-mono">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>Live Gateway Telemetry</span>
            </span>
          </div>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
            SLA &lt; 550ms
          </span>

          <span className="text-[11px] font-mono text-slate-400 hidden xl:inline">
            Model: <strong className="text-slate-200">gemini-3.8-live</strong>
          </span>
        </div>

        {/* Center: Key Metric Pills */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {/* Latency Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-cyan-500/30 shrink-0">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-mono text-slate-400">Latency:</span>
            <span className="text-xs font-bold font-mono text-cyan-300">
              {telemetry.latencyMs} ms
            </span>
          </div>

          {/* Cadence Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-purple-500/30 shrink-0">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[11px] font-mono text-slate-400">Cadence:</span>
            <span className="text-xs font-bold font-mono text-purple-300">
              {telemetry.targetPaceWpm} WPM
            </span>
            <span className="text-[10px] font-mono text-emerald-400">
              (-{telemetry.cadenceVarianceReduction}%)
            </span>
          </div>

          {/* Pitch Preservation Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-emerald-500/30 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-mono text-slate-400">F0 Pitch:</span>
            <span className="text-xs font-bold font-mono text-emerald-300">
              {telemetry.pitchPreservationIndex}%
            </span>
          </div>

          {/* Intelligibility Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-amber-500/30 shrink-0 hidden sm:flex">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-mono text-slate-400">Intelligibility:</span>
            <span className="text-xs font-bold font-mono text-amber-300">
              +{telemetry.phoneticIntelligibilityLift}%
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          {onOpenTestFeature && (
            <button
              onClick={onOpenTestFeature}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400 text-slate-950 shadow-md hover:scale-105 active:scale-95 transition-all shrink-0 animate-pulse border border-white/20"
              title="Test 3 Live Examples: English, Tamil, Telugu"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Test Feature Now</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-cyan-300 px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-800 transition-all border border-slate-700"
          >
            <span>{isExpanded ? 'Hide Pipeline' : 'DSP Breakdown'}</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {currentTab !== 'studio' && (
            <button
              onClick={onNavigateToStudio}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 border border-cyan-500/40 transition-all shadow-sm"
              title="Open full Dual Waveform Canvas and Audio Testbench"
            >
              <span>Full Studio HUD</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Expanded 4-Stage Latency Breakdown Drawer */}
      {isExpanded && (
        <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-in fade-in-50 duration-200">
          <div className="p-2.5 rounded-lg bg-slate-950/90 border border-blue-500/30">
            <div className="text-[10px] font-mono uppercase text-blue-400">1. Client Ingestion</div>
            <div className="text-sm font-bold font-mono text-slate-100 mt-0.5">
              {telemetry.latencyBreakdown.ingestion} ms
            </div>
            <div className="text-[10px] text-slate-400">16kHz PCM slicing (20ms frames)</div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/90 border border-purple-500/30">
            <div className="text-[10px] font-mono uppercase text-purple-400">2. Gemini Live Bidi</div>
            <div className="text-sm font-bold font-mono text-slate-100 mt-0.5">
              {telemetry.latencyBreakdown.geminiLiveRelay} ms
            </div>
            <div className="text-[10px] text-slate-400">FastAPI &rarr; Google Bidi WebSocket</div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/90 border border-emerald-500/30">
            <div className="text-[10px] font-mono uppercase text-emerald-400">3. DSP Resynthesis</div>
            <div className="text-sm font-bold font-mono text-slate-100 mt-0.5">
              {telemetry.latencyBreakdown.resynthesisDsp} ms
            </div>
            <div className="text-[10px] text-slate-400">150 WPM pacing & decimation filter</div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/90 border border-cyan-500/30">
            <div className="text-[10px] font-mono uppercase text-cyan-400">4. Jitter Buffer</div>
            <div className="text-sm font-bold font-mono text-slate-100 mt-0.5">
              {telemetry.latencyBreakdown.jitterBuffer} ms
            </div>
            <div className="text-[10px] text-slate-400">Jitter: {telemetry.jitterMs}ms (Health: {telemetry.bufferHealth})</div>
          </div>
        </div>
      )}
    </div>
  );
};
