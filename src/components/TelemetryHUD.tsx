import React from 'react';
import { Gauge, Clock, Sparkles, TrendingDown, ShieldCheck, ArrowDownRight, Layers } from 'lucide-react';
import { TelemetryData } from '../types';

interface TelemetryHUDProps {
  telemetry: TelemetryData;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({ telemetry }) => {
  return (
    <div className="space-y-4">
      {/* 4 Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Latency */}
        <div className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-cyan-500/60 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-wider mb-2">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Streaming Latency
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              SLA &lt; 550ms
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-cyan-400 tracking-tight">
              {telemetry.latencyMs}
            </span>
            <span className="text-sm font-medium text-slate-400">ms</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-emerald-400">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>-132ms below maximum SLA limit</span>
          </div>
        </div>

        {/* Metric 2: Cadence Variance */}
        <div className="bg-slate-900/80 border border-purple-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-purple-500/60 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-wider mb-2">
            <span className="flex items-center gap-1.5 font-medium">
              <TrendingDown className="w-3.5 h-3.5 text-purple-400" />
              Cadence Variance
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
              Harmonized
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-purple-400 tracking-tight">
              -{telemetry.cadenceVarianceReduction.toFixed(1)}%
            </span>
            <span className="text-sm font-medium text-slate-400">variance</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-purple-300">
            <span>Paced to 140–160 WPM Target</span>
          </div>
        </div>

        {/* Metric 3: Pitch Preservation Index */}
        <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-emerald-500/60 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-wider mb-2">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Pitch Retention Index
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              Pearson r
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-emerald-400 tracking-tight">
              {telemetry.pitchPreservationIndex.toFixed(1)}%
            </span>
            <span className="text-sm font-medium text-slate-400">correlation</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-emerald-300">
            <span>Original speaker inflection preserved</span>
          </div>
        </div>

        {/* Metric 4: Intelligibility Lift */}
        <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-amber-500/60 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-wider mb-2">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Intelligibility Lift
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
              ASR WER
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-amber-400 tracking-tight">
              +{telemetry.phoneticIntelligibilityLift.toFixed(1)}%
            </span>
            <span className="text-sm font-medium text-slate-400">clarity</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-amber-300">
            <span>Accented phonemes normalized</span>
          </div>
        </div>
      </div>

      {/* Latency Budget Waterfall Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
          <span className="flex items-center gap-1.5 font-medium">
            <Layers className="w-4 h-4 text-cyan-400" />
            End-to-End Latency Waterfall Breakdown ({telemetry.latencyMs} ms Total)
          </span>
          <span className="text-emerald-400 font-mono text-xs font-semibold">
            Under 550ms Interactive Speech Threshold
          </span>
        </div>

        {/* Proportional Multi-Segment Bar */}
        <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
          <div
            style={{ width: `${(telemetry.latencyBreakdown.ingestion / telemetry.latencyMs) * 100}%` }}
            className="bg-blue-500 h-full transition-all"
            title={`Audio Ingestion Buffer: ${telemetry.latencyBreakdown.ingestion}ms`}
          />
          <div
            style={{ width: `${(telemetry.latencyBreakdown.geminiLiveRelay / telemetry.latencyMs) * 100}%` }}
            className="bg-cyan-400 h-full transition-all"
            title={`Gemini Live Bidi Relay: ${telemetry.latencyBreakdown.geminiLiveRelay}ms`}
          />
          <div
            style={{ width: `${(telemetry.latencyBreakdown.resynthesisDsp / telemetry.latencyMs) * 100}%` }}
            className="bg-purple-500 h-full transition-all"
            title={`24kHz Resynthesis DSP: ${telemetry.latencyBreakdown.resynthesisDsp}ms`}
          />
          <div
            style={{ width: `${(telemetry.latencyBreakdown.jitterBuffer / telemetry.latencyMs) * 100}%` }}
            className="bg-amber-400 h-full transition-all"
            title={`Client Jitter Buffer: ${telemetry.latencyBreakdown.jitterBuffer}ms`}
          />
        </div>

        {/* Legend */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Mic Ingestion: <strong className="text-slate-200">{telemetry.latencyBreakdown.ingestion}ms</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Gemini Live Relay: <strong className="text-slate-200">{telemetry.latencyBreakdown.geminiLiveRelay}ms</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span>Resynthesis: <strong className="text-slate-200">{telemetry.latencyBreakdown.resynthesisDsp}ms</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Jitter Buffer: <strong className="text-slate-200">{telemetry.latencyBreakdown.jitterBuffer}ms</strong></span>
          </div>
        </div>
      </div>

      {/* Active Multi-Lingual Pacing Strategy Banner */}
      {telemetry.activeLanguage && (
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-slate-400 font-mono text-[11px]">RELAY PACING STRATEGY:</span>
            <span className="font-bold text-slate-100">{telemetry.activeLanguage}</span>
            <span className="text-cyan-400 font-mono font-semibold">({telemetry.pacingStrategy || 'Syllable Regularization'})</span>
          </div>
          <div className="text-[10px] font-mono text-slate-400 truncate max-w-md">
            Target Cadence: <strong className="text-emerald-400">{telemetry.targetPaceWpm} WPM</strong> • System Instruction Active
          </div>
        </div>
      )}
    </div>
  );
};
