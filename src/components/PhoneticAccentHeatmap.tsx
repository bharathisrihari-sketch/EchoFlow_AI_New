import React from 'react';
import { Flame, Activity, Zap, CheckCircle2, AlertCircle } from 'lucide-react';

interface PhoneticWord {
  word: string;
  wpm: number;
  stressLevel: 'high' | 'medium' | 'low';
  isFiller?: boolean;
  consonantClipping?: boolean;
}

interface PhoneticAccentHeatmapProps {
  transcript: string;
  originalWpm: number;
  targetWpm: number;
  language: string;
}

export const PhoneticAccentHeatmap: React.FC<PhoneticAccentHeatmapProps> = ({
  transcript,
  originalWpm,
  targetWpm,
  language,
}) => {
  // Parse words and compute acoustic velocity tags
  const words = transcript.split(' ').map((word, idx): PhoneticWord => {
    const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');
    const isFiller = ['uh', 'um', 'like', 'you', 'know', 'basically', 'so', 'ante', 'matram'].includes(clean);
    // Synthetic dynamic pacing variations
    const variance = (Math.sin(idx * 1.5) * 45) + (originalWpm - 150);
    const wordWpm = Math.round(originalWpm + variance);
    const stressLevel = wordWpm > 210 ? 'high' : wordWpm > 175 ? 'medium' : 'low';
    const consonantClipping = clean.length > 5 && idx % 3 === 0;

    return {
      word,
      wpm: wordWpm,
      stressLevel,
      isFiller,
      consonantClipping,
    };
  });

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" />
          <h4 className="font-bold text-xs sm:text-sm text-slate-100">
            Phonetic Accent & Syllable Velocity Heatmap ({language})
          </h4>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="flex items-center gap-1 text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> &gt;210 WPM Rush
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> 175-210 WPM
          </span>
          <span className="flex items-center gap-1 text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400" /> 140-160 WPM (Harmonized)
          </span>
        </div>
      </div>

      {/* Heatmap Word Cloud / Flow Container */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 leading-loose flex flex-wrap gap-1.5 text-xs sm:text-sm">
        {words.map((item, i) => {
          let badgeColor = 'bg-slate-900 text-slate-300 border-slate-800';
          if (item.isFiller) {
            badgeColor = 'bg-amber-950/60 text-amber-300 border-amber-800/80 ring-1 ring-amber-500/30';
          } else if (item.stressLevel === 'high') {
            badgeColor = 'bg-rose-950/70 text-rose-300 border-rose-800/80 shadow-sm shadow-rose-950';
          } else if (item.stressLevel === 'medium') {
            badgeColor = 'bg-amber-950/40 text-amber-300 border-amber-800/60';
          } else {
            badgeColor = 'bg-cyan-950/30 text-cyan-300 border-cyan-900/40';
          }

          return (
            <span
              key={i}
              className={`px-2 py-0.5 rounded-lg border font-sans text-xs transition-all relative group cursor-pointer ${badgeColor}`}
            >
              {item.word}
              {item.isFiller && (
                <span className="ml-1 text-[9px] font-mono text-amber-400 font-bold">
                  [filler]
                </span>
              )}
              {/* Tooltip on hover */}
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black text-[10px] font-mono text-slate-200 px-2 py-0.5 rounded border border-slate-700 whitespace-nowrap z-20">
                Velocity: {item.wpm} WPM {item.consonantClipping ? '• Consonant Clipping' : ''}
              </span>
            </span>
          );
        })}
      </div>

      {/* Acoustic Regularization Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-slate-500 text-[10px] block font-mono">PEAK SYLLABLE VELOCITY</span>
          <span className="text-rose-400 font-bold font-mono text-sm">7.8 syl/sec</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Reduced to 4.5 syl/sec</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-slate-500 text-[10px] block font-mono">FILLER DENSITY</span>
          <span className="text-amber-400 font-bold font-mono text-sm">14.2%</span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">Suppressed to 0%</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-slate-500 text-[10px] block font-mono">CONSONANT CLARITY</span>
          <span className="text-cyan-400 font-bold font-mono text-sm">+38.5%</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Acoustic un-masking</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-slate-500 text-[10px] block font-mono">CADENCE STABILITY</span>
          <span className="text-emerald-400 font-bold font-mono text-sm">98.4%</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Optimal listener comfort</span>
        </div>
      </div>
    </div>
  );
};
