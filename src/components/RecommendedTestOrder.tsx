import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Compass,
  Zap,
  Activity,
  Mic,
  Video,
  Radio,
  PhoneCall,
  DollarSign,
} from 'lucide-react';

interface RecommendedTestOrderProps {
  onNavigateToStep: (stepNumber: number) => void;
}

interface TestItem {
  id: string;
  stepNumber: number;
  title: string;
  badge: string;
  priority: 'P0' | 'P1';
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  expectedResult: string;
}

export const RECOMMENDED_TESTS: TestItem[] = [
  {
    id: 'quick_test',
    stepNumber: 1,
    title: '1. Quick Test (Archetypes & Tone Highlight)',
    badge: 'Step 1 • 1 min',
    priority: 'P0',
    icon: Zap,
    description: 'Evaluate Child, Lady, and Senior Man voice archetypes. Trigger "Play Sequence (Raw ➔ Converted)" to experience tone-preserving deceleration.',
    expectedResult: 'Raw hurried audio plays first; 1.0s pause; 150 WPM normalized speech plays with natural pitch retained.',
  },
  {
    id: 'normalizer',
    stepNumber: 2,
    title: '2. Normalizer & Languages Studio',
    badge: 'Step 2 • 1 min',
    priority: 'P0',
    icon: Activity,
    description: 'Test target cadence sliders (120–180 WPM) and pitch retention thresholds (80–100%) across regional dialect presets.',
    expectedResult: 'Adjusting cadence smoothly recalibrates target WPM; server synthesizes 24kHz audio via pcmToWavBlob.',
  },
  {
    id: 'my_voice',
    stepNumber: 3,
    title: '3. My Voice (Live Mic Capture)',
    badge: 'Step 3 • 1 min',
    priority: 'P0',
    icon: Mic,
    description: 'Accept the voice identity privacy charter, record 10–30s of your hurried speech, and compare raw vs pace-adjusted output.',
    expectedResult: 'Your authentic voice plays back at 150 WPM using hardware preservesPitch with zero robotic replacement.',
  },
  {
    id: 'video',
    stepNumber: 4,
    title: '4. Video Comparison (Side-by-Side Sync)',
    badge: 'Step 4 • 1 min',
    priority: 'P0',
    icon: Video,
    description: 'Play synchronized video streams. Listen to the raw audio track on the left, then toggle to EchoFlow on the right.',
    expectedResult: 'Both video players maintain exact synchronized frame playback while right side outputs pace-adjusted voice.',
  },
  {
    id: 'near_live',
    stepNumber: 5,
    title: '5. Near-Live Mode (WebSocket /ws/stream)',
    badge: 'Step 5 • 1 min',
    priority: 'P0',
    icon: Radio,
    description: 'Connect to /ws/stream. Stream live 16kHz PCM chunks and measure real round-trip network latency ping.',
    expectedResult: 'WebSocket connection opens; measured RTT latency card shows live milliseconds; packet counter increments.',
  },
  {
    id: 'pbx',
    stepNumber: 6,
    title: '6. In a Call (PBX Simulator)',
    badge: 'Step 6 • 1 min',
    priority: 'P0',
    icon: PhoneCall,
    description: 'Toggle the EchoFlow Cadence Gate ON and OFF across a 2-party high-stress customer escalation dialogue.',
    expectedResult: 'Erratic and panicked customer utterances are softened into calm, articulate 150 WPM call turns.',
  },
  {
    id: 'roi',
    stepNumber: 7,
    title: '7. Business Value (ROI Engine)',
    badge: 'Step 7 • 1 min',
    priority: 'P0',
    icon: DollarSign,
    description: 'Adjust the seat count slider (e.g., 500 seats) and loaded hourly rate. Print or preview the confidential C-suite memo.',
    expectedResult: 'Single-source mathematical calculation accurately displays hours recovered ($115,317/yr) and net dollar savings.',
  },
];

export const RecommendedTestOrder: React.FC<RecommendedTestOrderProps> = ({
  onNavigateToStep,
}) => {
  const [completed, setCompleted] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('echoflow_recommended_test_progress');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleTest = (id: string) => {
    setCompleted((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('echoflow_recommended_test_progress', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleReset = () => {
    setCompleted({});
    try {
      localStorage.removeItem('echoflow_recommended_test_progress');
    } catch {}
  };

  const completedCount = Object.values(completed).filter(Boolean).length;
  const progressPct = Math.round((completedCount / RECOMMENDED_TESTS.length) * 100);

  return (
    <div className="space-y-6">
      {/* 1. Progress Header Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-emerald-950/40 border border-cyan-500/40 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Compass className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                P0 Evaluation Roadmap
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Recommended Test Order for Presenters & Evaluators
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Follow this 7-step sequence to systematically verify core capabilities within 7 to 9 minutes.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-lg font-black font-mono text-cyan-300">
                {completedCount} of {RECOMMENDED_TESTS.length}
              </div>
              <div className="text-[10px] font-mono text-slate-400">Steps Completed</div>
            </div>

            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
              title="Reset Checklist"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 rounded-full h-2.5 border border-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* 2. Test Step Checklist Cards */}
      <div className="space-y-3">
        {RECOMMENDED_TESTS.map((test) => {
          const isDone = !!completed[test.id];
          const Icon = test.icon;

          return (
            <div
              key={test.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isDone
                  ? 'bg-slate-900/90 border-emerald-500/40'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => toggleTest(test.id)}
                    aria-label={`Mark ${test.title} as ${isDone ? 'incomplete' : 'complete'}`}
                    className="mt-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-md"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-500 hover:text-cyan-400" />
                    )}
                  </button>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                        {test.badge}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                        {test.priority}
                      </span>
                      <h3 className={`font-bold text-sm sm:text-base ${isDone ? 'text-slate-300 line-through' : 'text-white'}`}>
                        {test.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                      {test.description}
                    </p>

                    <div className="text-[11px] font-mono text-emerald-400/90 flex items-start gap-1 pt-0.5">
                      <span className="font-bold shrink-0">Expected Result:</span>
                      <span>{test.expectedResult}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateToStep(test.stepNumber)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 text-xs font-semibold transition-all shrink-0 self-end sm:self-center cursor-pointer"
                >
                  <span>Go to Test</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
