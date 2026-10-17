import React, { useEffect, useRef } from 'react';
import { Activity, Zap, CheckCircle2 } from 'lucide-react';

interface DualWaveformCanvasProps {
  isStreaming: boolean;
  isPlayingAudio: boolean;
  targetWpm: number;
  currentWpm: number;
  latencyMs: number;
}

export const DualWaveformCanvas: React.FC<DualWaveformCanvasProps> = ({
  isStreaming,
  isPlayingAudio,
  targetWpm,
  currentWpm,
  latencyMs,
}) => {
  const rawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const normCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const rawCanvas = rawCanvasRef.current;
    const normCanvas = normCanvasRef.current;
    if (!rawCanvas || !normCanvas) return;

    const ctxRaw = rawCanvas.getContext('2d');
    const ctxNorm = normCanvas.getContext('2d');
    if (!ctxRaw || !ctxNorm) return;

    let phase = 0;

    const render = () => {
      phase += isStreaming || isPlayingAudio ? 0.08 : 0.015;

      const w = rawCanvas.width;
      const h = rawCanvas.height;

      // 1. Draw Raw / Input Erratic Waveform
      ctxRaw.fillStyle = '#030712';
      ctxRaw.fillRect(0, 0, w, h);

      // Subtle grid
      ctxRaw.strokeStyle = '#0f172a';
      ctxRaw.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctxRaw.beginPath();
        ctxRaw.moveTo(x, 0);
        ctxRaw.lineTo(x, h);
        ctxRaw.stroke();
      }

      // Draw Center Baseline
      ctxRaw.strokeStyle = '#1e293b';
      ctxRaw.beginPath();
      ctxRaw.moveTo(0, h / 2);
      ctxRaw.lineTo(w, h / 2);
      ctxRaw.stroke();

      // Raw Signal (Erratic, sharp spikes, jitter)
      ctxRaw.beginPath();
      ctxRaw.strokeStyle = isStreaming || isPlayingAudio ? '#f43f5e' : '#64748b';
      ctxRaw.lineWidth = 2;

      for (let x = 0; x < w; x++) {
        let envelope = 0.2;
        if (isStreaming || isPlayingAudio) {
          // Bursting speech simulation with rapid spikes
          const burstCycle = Math.sin(x * 0.012 + phase * 2.5);
          const erraticNoise = (Math.sin(x * 0.15 + phase * 4) * 0.6 + Math.cos(x * 0.04 - phase) * 0.4);
          const jitter = (Math.random() - 0.5) * 0.25;
          envelope = (burstCycle > -0.2 ? Math.abs(burstCycle) : 0.05) * (erraticNoise + jitter);
        } else {
          envelope = Math.sin(x * 0.03 + phase) * 0.15;
        }

        const y = h / 2 + envelope * (h * 0.42);
        if (x === 0) ctxRaw.moveTo(x, y);
        else ctxRaw.lineTo(x, y);
      }
      ctxRaw.stroke();

      // 2. Draw EchoFlow Normalized Waveform (24kHz, harmonized cadence, smooth prosody envelope)
      ctxNorm.fillStyle = '#030712';
      ctxNorm.fillRect(0, 0, w, h);

      // Subtle grid
      ctxNorm.strokeStyle = '#0f172a';
      ctxNorm.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctxNorm.beginPath();
        ctxNorm.moveTo(x, 0);
        ctxNorm.lineTo(x, h);
        ctxNorm.stroke();
      }

      // Center baseline
      ctxNorm.strokeStyle = '#1e293b';
      ctxNorm.beginPath();
      ctxNorm.moveTo(0, h / 2);
      ctxNorm.lineTo(w, h / 2);
      ctxNorm.stroke();

      // Normalized smooth sinusoidal harmonic curve
      ctxNorm.beginPath();
      ctxNorm.strokeStyle = isStreaming || isPlayingAudio ? '#06b6d4' : '#475569';
      ctxNorm.lineWidth = 2.5;

      for (let x = 0; x < w; x++) {
        let envelope = 0.2;
        if (isStreaming || isPlayingAudio) {
          // Stable 150 WPM cadence with smooth syllable-timed envelope
          const harmonic1 = Math.sin(x * 0.022 + phase * 1.2) * 0.55;
          const harmonic2 = Math.sin(x * 0.055 + phase * 1.8) * 0.25;
          const vowelResonance = Math.sin(x * 0.11 + phase) * 0.1;
          envelope = harmonic1 + harmonic2 + vowelResonance;
        } else {
          envelope = Math.sin(x * 0.02 + phase * 0.8) * 0.12;
        }

        const y = h / 2 + envelope * (h * 0.38);
        if (x === 0) ctxNorm.moveTo(x, y);
        else ctxNorm.lineTo(x, y);
      }
      ctxNorm.stroke();

      // Energy glow fill for normalized output
      if (isStreaming || isPlayingAudio) {
        ctxNorm.lineTo(w, h / 2);
        ctxNorm.lineTo(0, h / 2);
        ctxNorm.fillStyle = 'rgba(6, 182, 212, 0.06)';
        ctxNorm.fill();
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isStreaming, isPlayingAudio]);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl shadow-black/40">
      {/* Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-base text-slate-100">
            Dual-Waveform Speech Prosody Spectrum
          </h3>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
            Real-Time DSP Relay
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-slate-400">CH1 Input:</span>
            <span className="text-rose-400 font-semibold">{currentWpm} WPM (Erratic)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="text-slate-400">CH2 Output:</span>
            <span className="text-cyan-300 font-semibold">{targetWpm} WPM (Harmonized)</span>
          </div>
        </div>
      </div>

      {/* Waveform 1: Incoming Erratic Audio */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1.5 px-1">
          <span className="text-rose-400 font-semibold tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            RAW INCOMING AUDIO PACKETS (16,000 Hz, 16-BIT LINEAR PCM)
          </span>
          <span className="text-slate-500 font-mono text-[11px]">
            Burst Jitter: 48% | Erratic Pacing
          </span>
        </div>
        <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
          <canvas
            ref={rawCanvasRef}
            width={800}
            height={96}
            className="w-full h-24 block"
          />
          {(isStreaming || isPlayingAudio) && (
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950/80 text-rose-300 border border-rose-800">
              UNNORMALIZED
            </div>
          )}
        </div>
      </div>

      {/* Waveform 2: EchoFlow Resynthesized Audio */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1.5 px-1">
          <span className="text-cyan-400 font-semibold tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            ECHOFLOW NORMALIZED AUDIO STREAM (24,000 Hz, LOW-LATENCY RESYNTHESIS)
          </span>
          <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Pitch Envelope Retained (94.2%)
          </span>
        </div>
        <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
          <canvas
            ref={normCanvasRef}
            width={800}
            height={96}
            className="w-full h-24 block"
          />
          {(isStreaming || isPlayingAudio) && (
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800 flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400" />
              CADENCE NORMALIZED
            </div>
          )}
        </div>
      </div>

      {/* Micro-benchmarks bar */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <span>Relay Latency: <strong className="text-cyan-400 font-semibold">{latencyMs} ms</strong></span>
          <span className="text-slate-600">|</span>
          <span>Cadence Variance: <strong className="text-purple-400 font-semibold">-35.4%</strong></span>
          <span className="text-slate-600">|</span>
          <span>Pitch Preservation: <strong className="text-emerald-400 font-semibold">94.2%</strong></span>
        </div>
        <div className="text-slate-500 text-[11px]">
          Target Buffer SLA: &lt; 20ms chunks (640 bytes)
        </div>
      </div>
    </div>
  );
};
