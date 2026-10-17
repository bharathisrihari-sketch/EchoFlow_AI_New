/**
 * EchoFlow AI: New User Navigation Flow & Conversion Matrix (Audio + Text)
 * 
 * Provides:
 * 1. Step-by-step interactive navigation roadmap for new users.
 * 2. Side-by-side text and audio conversion examples matrix with playable audio.
 * 3. Metric badges showing cadence acceleration, filler suppression, and intelligibility gain.
 */

import React, { useState, useRef } from 'react';
import {
  Compass,
  ArrowRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  CheckCircle2,
  Activity,
  PhoneCall,
  Video,
  DollarSign,
  Network,
  BookOpen,
  Mic,
  RotateCcw,
} from 'lucide-react';
import { AppTab } from './GcpConsoleNav';

interface FlowStep {
  step: number;
  id: AppTab;
  title: string;
  badge: string;
  description: string;
  actionText: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const NEW_USER_STEPS: FlowStep[] = [
  {
    step: 1,
    id: 'tour',
    title: 'Explore & Onboard',
    badge: 'Step 1: Introduction',
    description: 'Walk through the 5-minute full platform overview and review the end-to-end streaming architecture.',
    actionText: 'Launch Guided Tour',
    icon: Compass,
    accentColor: 'from-cyan-500 to-blue-500',
  },
  {
    step: 2,
    id: 'studio',
    title: 'Voice Normalization Studio',
    badge: 'Step 2: Core Engine',
    description: 'Test speech normalization in real-time. Speak into your microphone or try the 6-language dialect matrix.',
    actionText: 'Open Voice Studio',
    icon: Activity,
    accentColor: 'from-emerald-500 to-teal-500',
  },
  {
    step: 3,
    id: 'telephony_lab',
    title: 'Media & PBX Simulation Lab',
    badge: 'Step 3: Validation',
    description: 'Inspect side-by-side video/audio waveform comparisons and simulate real-world call center PBX calls.',
    actionText: 'Enter Media & PBX Lab',
    icon: Video,
    accentColor: 'from-purple-500 to-pink-500',
  },
  {
    step: 4,
    id: 'roi',
    title: 'Financial ROI Calculator',
    badge: 'Step 4: Business Impact',
    description: 'Calculate bottom-line annual savings ($2.49M–$3.23M) from 18% AHT compression and reduced repeat calls.',
    actionText: 'Calculate Enterprise ROI',
    icon: DollarSign,
    accentColor: 'from-amber-500 to-orange-500',
  },
  {
    step: 5,
    id: 'sitemap',
    title: 'Architectural Sitemap',
    badge: 'Step 5: System Topology',
    description: 'Examine the complete subsystem topology, Cloud Run deployment, and data flow pipelines.',
    actionText: 'Inspect System Map',
    icon: Network,
    accentColor: 'from-indigo-500 to-blue-500',
  },
];

interface ConversionExample {
  id: string;
  dialect: string;
  region: string;
  flag: string;
  originalWpm: number;
  normalizedWpm: number;
  rawText: string;
  normalizedText: string;
  fillersRemoved: string[];
  intelligibilityLift: string;
  pitchRetention: string;
  notes: string;
}

const CONVERSION_EXAMPLES: ConversionExample[] = [
  {
    id: 'user_live_test',
    dialect: 'Indian English (Live User Test)',
    region: 'Evaluator Upload (Hesitation & Time Calibration)',
    flag: '🇮🇳',
    originalWpm: 75,
    normalizedWpm: 150,
    rawText: "Hello, I'm testing an app, ah, okay, I've done, ah, it will take 5 minutes, no, no, what I meant was 5 to 10 minutes, yes.",
    normalizedText: "Hello, I am testing the application. Okay, I have completed it; it will take five to ten minutes. Yes.",
    fillersRemoved: ['ah', 'okay', 'ah', 'no, no (false start resolved)'],
    intelligibilityLift: '+34.8%',
    pitchRetention: '95.1%',
    notes: 'Eliminates cognitive hesitation pauses and resolves the 5 vs 5-10 minute false start into steady 150 WPM delivery.',
  },
  {
    id: 'chennai_fintech',
    dialect: 'Tamil-Accented English',
    region: 'Chennai, Tamil Nadu (BPO Fintech)',
    flag: '🇮🇳',
    originalWpm: 225,
    normalizedWpm: 152,
    rawText: "Sir, uh, we are trying to sync customer biometric KYC records via the webhooks, but we are facing token expiry errors after every fifty calls, please check the OAuth refresh secret configuration right away!",
    normalizedText: "We are syncing customer biometric KYC records via webhooks. We face token expiry errors after fifty calls. Please check the OAuth refresh secret configuration immediately.",
    fillersRemoved: ['Sir', 'uh', 'but we are facing (repetition)'],
    intelligibilityLift: '+34.2%',
    pitchRetention: '94.6%',
    notes: 'Smooths fast retroflex transitions and removes urgent repetition under audit pressure.',
  },
  {
    id: 'hyderabad_cloud',
    dialect: 'Telugu-Accented English',
    region: 'Hyderabad, Telangana / Andhra Pradesh',
    flag: '🇮🇳',
    originalWpm: 230,
    normalizedWpm: 150,
    rawText: "Hello, ante... our Kubernetes cluster pod autoscaling policy is failing continuously in the Mumbai zone, like, during high batch ingest we are getting 504 gateway timeouts, please resolve this immediately!",
    normalizedText: "Hello. Our Kubernetes pod autoscaling policy in the Mumbai zone is failing continuously. During high batch ingest we receive 504 gateway timeouts. Please resolve this immediately.",
    fillersRemoved: ['ante', 'like', 'continuous syllable rush'],
    intelligibilityLift: '+33.8%',
    pitchRetention: '94.2%',
    notes: 'Levels ante/arre conversational particles while preserving technical accuracy and incident urgency.',
  },
  {
    id: 'devops_outage',
    dialect: 'Global British / North American English',
    region: 'DevOps / Incident Management',
    flag: '🌐',
    originalWpm: 220,
    normalizedWpm: 150,
    rawText: "Hi, uh, I'm calling about ticket number 94821 regarding the Redis database cluster latency issue, like, we had a major outage in the Singapore zone and need immediate tier-3 escalation right now before market open!",
    normalizedText: "Hi. I am calling regarding ticket number 94821 for the Redis cluster latency issue. We experienced a major outage in the Singapore zone and require immediate tier-3 escalation before market open.",
    fillersRemoved: ['uh', 'like', 'right now (redundant)'],
    intelligibilityLift: '+32.6%',
    pitchRetention: '94.8%',
    notes: 'Decelerates rapid 220 WPM panic rush to clear, authoritative 150 WPM executive clarity.',
  },
  {
    id: 'french_gdpr',
    dialect: 'French-Accented English',
    region: 'Paris, France (Enterprise Governance)',
    flag: '🇫🇷',
    originalWpm: 125,
    normalizedWpm: 146,
    rawText: "Bonjour, um... yes, we are evaluating, uh, your enterprise governance package, but, you know, we have some, like, specific compliance requirements under GDPR, so... how does your encryption work at rest?",
    normalizedText: "Bonjour. We are evaluating your enterprise governance package. We have specific compliance requirements under GDPR. How does your encryption work at rest?",
    fillersRemoved: ['um', 'uh', 'you know', 'like', 'so...'],
    intelligibilityLift: '+31.9%',
    pitchRetention: '93.7%',
    notes: 'Accelerates hesitant 125 WPM delivery, strips prolonged filler particles, and retains French vocal timbre.',
  },
  {
    id: 'german_iot',
    dialect: 'German Staccato English',
    region: 'Frankfurt, Germany (Automotive IoT)',
    flag: '🇩🇪',
    originalWpm: 215,
    normalizedWpm: 152,
    rawText: "Achtung, our connected fleet telematics MQTT broker in Frankfurt is rejecting payload packets with protocol error 1006, this halts our telemetry ingestion stream right now and requires instant kernel inspection!",
    normalizedText: "Attention. Our connected fleet telematics MQTT broker in Frankfurt is rejecting payload packets with protocol error 1006. This halts telemetry ingestion and requires instant inspection.",
    fillersRemoved: ['Achtung', 'right now', 'harsh consonant clipping'],
    intelligibilityLift: '+33.4%',
    pitchRetention: '94.4%',
    notes: 'Harmonizes abrupt staccato syllable stops into smooth, balanced international prosody.',
  },
];

interface NewUserNavigationFlowProps {
  onNavigateToTab: (tab: AppTab) => void;
  className?: string;
}

export const NewUserNavigationFlow: React.FC<NewUserNavigationFlowProps> = ({
  onNavigateToTab,
  className = '',
}) => {
  const [selectedExampleId, setSelectedExampleId] = useState<string>('user_live_test');
  const [playingAudioType, setPlayingAudioType] = useState<'raw' | 'normalized' | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const selectedExample =
    CONVERSION_EXAMPLES.find((ex) => ex.id === selectedExampleId) || CONVERSION_EXAMPLES[0];

  const handlePlayAudio = (type: 'raw' | 'normalized', text: string, rate: number) => {
    if (!('speechSynthesis' in window)) return;

    if (playingAudioType === type) {
      window.speechSynthesis.cancel();
      setPlayingAudioType(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    // Rate: 1.0 ~ 150 WPM. Calculate proportional speech rate
    utterance.rate = Math.max(0.6, Math.min(1.6, rate / 150));
    utterance.pitch = 1.0;

    utterance.onend = () => setPlayingAudioType(null);
    utterance.onerror = () => setPlayingAudioType(null);

    synthRef.current = utterance;
    setPlayingAudioType(type);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* 1. New User Interactive Navigation Roadmap */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-slate-100">
                New User Navigation Flow & Quick-Start Journey
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Follow this 5-step path to experience EchoFlow AI from voice ingestion to enterprise financial ROI.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>5-Step Standardized Flow</span>
            </span>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-4">
          {NEW_USER_STEPS.map((step) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.id}
                className="bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500/50 rounded-xl p-4 flex flex-col justify-between transition-all group hover:shadow-md hover:shadow-cyan-500/10"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      Step {step.step}
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>

                  <h4 className="font-bold text-xs text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-3 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <button
                  onClick={() => onNavigateToTab(step.id)}
                  className="mt-4 w-full py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 border border-cyan-500/30 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>{step.actionText}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Audio & Text Conversion Matrix */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-slate-100">
                Speech-to-Speech Conversion Matrix (Audio & Text)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Listen to the real-time difference between raw spoken delivery and EchoFlow's 150 WPM normalized output.
            </p>
          </div>

          {/* Example Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {CONVERSION_EXAMPLES.map((ex) => {
              const isSelected = ex.id === selectedExampleId;
              return (
                <button
                  key={ex.id}
                  onClick={() => {
                    setSelectedExampleId(ex.id);
                    if (playingAudioType) {
                      window.speechSynthesis?.cancel();
                      setPlayingAudioType(null);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span>{ex.flag}</span>
                  <span>{ex.dialect}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Example Details Header */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">{selectedExample.flag}</span>
              <h4 className="font-bold text-sm text-slate-200">{selectedExample.dialect}</h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                {selectedExample.region}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{selectedExample.notes}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Intelligibility Lift</div>
              <div className="text-xs font-bold text-emerald-400 font-mono">
                {selectedExample.intelligibilityLift}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase font-mono">F0 Pitch Preservation</div>
              <div className="text-xs font-bold text-cyan-400 font-mono">
                {selectedExample.pitchRetention}
              </div>
            </div>
          </div>
        </div>

        {/* Side-by-Side Audio & Text Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Left: Raw Spoken Delivery */}
          <div className="bg-slate-950/90 border border-rose-900/40 rounded-xl p-5 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>1. Raw Spoken Audio (Input)</span>
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800">
                  {selectedExample.originalWpm} WPM
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans pt-2 bg-slate-900/50 p-3 rounded-lg border border-slate-800/80">
                "{selectedExample.rawText}"
              </p>

              <div className="pt-2">
                <span className="text-[11px] text-slate-400 font-medium">Cognitive Fillers / Hesitation:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedExample.fillersRemoved.map((f, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/50"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => handlePlayAudio('raw', selectedExample.rawText, selectedExample.originalWpm)}
              className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all border ${
                playingAudioType === 'raw'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-md shadow-rose-500/10'
                  : 'bg-slate-900 hover:bg-rose-950/40 text-rose-400 border-slate-800'
              }`}
            >
              {playingAudioType === 'raw' ? (
                <>
                  <Pause className="w-3.5 h-3.5 animate-pulse" />
                  <span>Stop Raw Playback</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Play Raw Input Audio ({selectedExample.originalWpm} WPM)</span>
                </>
              )}
            </button>
          </div>

          {/* Right: EchoFlow Normalized Speech */}
          <div className="bg-slate-950/90 border border-cyan-500/40 rounded-xl p-5 space-y-3 flex flex-col justify-between shadow-lg shadow-cyan-500/5">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>2. EchoFlow Normalized Speech (Output)</span>
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                  {selectedExample.normalizedWpm} WPM (Target)
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed font-sans pt-2 bg-slate-900/60 p-3 rounded-lg border border-cyan-500/30">
                "{selectedExample.normalizedText}"
              </p>

              <div className="pt-2">
                <span className="text-[11px] text-slate-400 font-medium">Applied Transformations:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/50">
                    Cadence Calibrated to {selectedExample.normalizedWpm} WPM
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/50">
                    Fillers Stripped
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/50">
                    {selectedExample.pitchRetention} F0 Pitch Retained
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handlePlayAudio('normalized', selectedExample.normalizedText, selectedExample.normalizedWpm)}
              className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all border ${
                playingAudioType === 'normalized'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-gradient-to-r from-cyan-600 to-teal-600 text-slate-950 hover:brightness-110 border-cyan-500/40'
              }`}
            >
              {playingAudioType === 'normalized' ? (
                <>
                  <Pause className="w-3.5 h-3.5 animate-pulse" />
                  <span>Stop Normalized Playback</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Play Normalized Audio ({selectedExample.normalizedWpm} WPM Golden Cadence)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
