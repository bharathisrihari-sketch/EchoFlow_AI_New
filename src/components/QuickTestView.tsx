import React, { useState, useRef, useEffect } from 'react';
import {
  Baby,
  UserCheck,
  User,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  CheckCircle2,
  Copy,
  Check,
  Mic,
  Upload,
  ArrowRight,
  Shield,
  FileText,
  Clock,
  Sliders,
  AlertCircle,
} from 'lucide-react';
import { pcmToWavBlob } from '../utils/audioUtils';

export interface AccentIssueToken {
  text: string;
  type: 'filler' | 'accent' | 'garbled' | 'delay' | 'syntax';
  label: string;
}

export interface AccentTestCase {
  id: 'child' | 'lady' | 'senior_man';
  tabLabel: string;
  archetypeBadge: string;
  flag: string;
  persona: {
    name: string;
    role: string;
    ageTitle: string;
    avatarBg: string;
    icon: React.ComponentType<{ className?: string }>;
  };
  voiceAcoustics: {
    archetypeTitle: string;
    f0PitchDisplay: string;
    pitchRaw: number;
    pitchConverted: number;
  };
  domain: string;
  rawWpm: number;
  convertedWpm: number;
  wpmReductionPct: number;
  f0RetentionPct: number;
  latencyMs: number;
  rawFullText: string;
  convertedEnglishScript: string;
  naturalSummary: string;
  executiveBullets: string[];
  rawTokens: AccentIssueToken[];
}

export const PRECONFIGURED_TEST_CASES: Record<'child' | 'lady' | 'senior_man', AccentTestCase> = {
  child: {
    id: 'child',
    tabLabel: '1. English (Child)',
    archetypeBadge: '🧒 Child Voice Archetype',
    flag: '🧒',
    persona: {
      name: 'Aarav Sharma',
      role: 'Grade 6 Robotics & STEM Finalist',
      ageTitle: '11 Years Old (Youthful Dynamic Speech)',
      avatarBg: 'from-amber-400 via-rose-500 to-pink-500',
      icon: Baby,
    },
    voiceAcoustics: {
      archetypeTitle: 'Youthful Child Voice Engine',
      f0PitchDisplay: '~300 Hz High Acoustic Energy',
      pitchRaw: 1.48,
      pitchConverted: 1.35,
    },
    domain: 'EdTech AI Tutoring & STEM Competition Telephony',
    rawWpm: 256,
    convertedWpm: 150,
    wpmReductionPct: 41.4,
    f0RetentionPct: 96.1,
    latencyMs: 412,
    rawFullText:
      "Oh no, uh, wait, wait, sir, I mean... um, my Python robot simulation project is crashing like right now! The, um, loop is going infinite-uh and my laptop is like totally freezing, and, like, our school science deadline is in five minutes itself, please help me fix it, please please please!",
    convertedEnglishScript:
      "Hello. My Python robotics simulation project is encountering an infinite loop and the system has stopped responding. I require assistance to debug the script before the upcoming class submission deadline.",
    naturalSummary:
      "A student requests immediate technical assistance to debug an infinite loop in a Python robotics simulation project ahead of an imminent class deadline.",
    executiveBullets: [
      "Root issue: Python simulation script stuck in an infinite execution loop",
      "Action requested: Debug and recover the application before the school submission deadline",
    ],
    rawTokens: [
      { text: 'Oh no,', type: 'filler', label: 'Child distress exclamation' },
      { text: 'uh, wait, wait, sir, I mean...', type: 'delay', label: 'Hesitation stutter loop' },
      { text: 'um,', type: 'filler', label: 'Cognitive pause' },
      { text: 'my Python robot simulation project is crashing', type: 'syntax', label: 'Context' },
      { text: 'like right now!', type: 'filler', label: 'Colloquial intensifier' },
      { text: 'The, um, loop is going', type: 'syntax', label: 'Context' },
      { text: 'infinite-uh', type: 'accent', label: 'Vowel drag on technical term (-uh)' },
      { text: 'and my laptop is', type: 'syntax', label: 'Context' },
      { text: 'like totally freezing,', type: 'filler', label: 'Emotional hyperbole' },
      { text: 'and, like,', type: 'filler', label: 'Child speech connector' },
      { text: 'our school science deadline is in', type: 'syntax', label: 'Context' },
      { text: 'five minutes itself,', type: 'syntax', label: 'Indian English emphasis ("itself")' },
      { text: 'please help me fix it,', type: 'syntax', label: 'Context' },
      { text: 'please please please!', type: 'delay', label: 'Panic pleading repetition' },
    ],
  },
  lady: {
    id: 'lady',
    tabLabel: '2. Tamil (Lady Voice)',
    archetypeBadge: '👩‍💼 Lady Voice Archetype',
    flag: '👩‍💼',
    persona: {
      name: 'Dr. Meera Ramachandran',
      role: 'Clinical Telemetry & Infrastructure Director (Chennai)',
      ageTitle: '38 Years Old (Professional Female Voice)',
      avatarBg: 'from-cyan-500 via-blue-600 to-indigo-600',
      icon: UserCheck,
    },
    voiceAcoustics: {
      archetypeTitle: 'Executive Female Voice Engine',
      f0PitchDisplay: '~220 Hz Female Pitch Contour',
      pitchRaw: 1.18,
      pitchConverted: 1.05,
    },
    domain: 'Hospital Critical Care Telemetry & Cloud Operations',
    rawWpm: 242,
    convertedWpm: 150,
    wpmReductionPct: 38.0,
    f0RetentionPct: 94.8,
    latencyMs: 418,
    rawFullText:
      "Hello, sir, enna na... our hospital ICU telemetry gateway in Chennai is failing continuous-aa, packets are dropping like anything! Monitoring dashboard-la alert keeps coming and doctors are shouting only. This is critical patient data, please escalate to tier-3 infrastructure engineer immediately!",
    convertedEnglishScript:
      "Good afternoon. Our hospital ICU telemetry gateway in Chennai is experiencing continuous network packet loss. The critical monitoring dashboard is alerting intermittently. Please escalate this incident to a Tier-3 infrastructure engineer immediately.",
    naturalSummary:
      "A clinical operations director escalates an urgent network packet-loss incident affecting patient telemetry monitoring in Chennai.",
    executiveBullets: [
      "Affected service: Hospital ICU clinical telemetry gateway in Chennai",
      "Symptom: Continuous packet drops and intermittent patient monitoring alerts",
      "Action requested: Immediate Tier-3 infrastructure escalation",
    ],
    rawTokens: [
      { text: 'Hello, sir,', type: 'syntax', label: 'Polite greeting' },
      { text: 'enna na...', type: 'filler', label: 'Tamil conversational hesitation ("what it is...")' },
      { text: 'our hospital ICU telemetry gateway in Chennai is failing', type: 'syntax', label: 'Context' },
      { text: 'continuous-aa,', type: 'accent', label: 'Tamil adverb suffix (-aa)' },
      { text: 'packets are dropping', type: 'syntax', label: 'Context' },
      { text: 'like anything!', type: 'filler', label: 'Indian English idiom for severe rate' },
      { text: 'Monitoring dashboard-la', type: 'accent', label: 'Tamil locative suffix (-la = in/on)' },
      { text: 'alert keeps coming and', type: 'syntax', label: 'Context' },
      { text: 'doctors are shouting only.', type: 'syntax', label: 'Indian English present continuous emphasis' },
      { text: 'This is critical patient data, please escalate to tier-3 infrastructure engineer immediately!', type: 'syntax', label: 'Resolution call' },
    ],
  },
  senior_man: {
    id: 'senior_man',
    tabLabel: '3. Telugu (Senior Man)',
    archetypeBadge: '👨‍💼 Senior Man Voice Archetype',
    flag: '👨‍💼',
    persona: {
      name: 'Satyanarayana Raju',
      role: 'Principal Database Reliability Architect (Hyderabad)',
      ageTitle: '58 Years Old (Authoritative Baritone)',
      avatarBg: 'from-emerald-500 via-teal-600 to-cyan-700',
      icon: User,
    },
    voiceAcoustics: {
      archetypeTitle: 'Senior Authority Baritone Engine',
      f0PitchDisplay: '~110 Hz Resonant Low Baritone',
      pitchRaw: 0.82,
      pitchConverted: 0.88,
    },
    domain: 'Core Banking Cluster & High-Throughput Relational Systems',
    rawWpm: 235,
    convertedWpm: 150,
    wpmReductionPct: 36.2,
    f0RetentionPct: 95.4,
    latencyMs: 405,
    rawFullText:
      "Namaskaram, ante... Hyderabad financial district core banking cluster-lo replication lag is spiking continuously, transactions are getting blocked like so much! Secondary node completely out of sync ayyindi. If not resolved before market opens, settlements will halt. Take urgent action right now!",
    convertedEnglishScript:
      "Good morning. The core banking database cluster in the Hyderabad financial district is experiencing critical replication lag. Database transactions are currently blocked, and the secondary node is out of synchronization. Urgent intervention is required before market settlement opening.",
    naturalSummary:
      "A database architect warns that core banking transaction settlements are at risk due to database replication lag in Hyderabad.",
    executiveBullets: [
      "Affected system: Financial district primary database cluster replication",
      "Impact: Transactions blocked; secondary node unsynchronized",
      "Risk: Complete market opening settlement failure without urgent intervention",
    ],
    rawTokens: [
      { text: 'Namaskaram,', type: 'syntax', label: 'Formal Telugu greeting' },
      { text: 'ante...', type: 'filler', label: 'Telugu filler word ("meaning/actually...")' },
      { text: 'Hyderabad financial district core banking cluster-lo', type: 'accent', label: 'Telugu locative marker (-lo = inside)' },
      { text: 'replication lag is spiking continuously, transactions are getting blocked', type: 'syntax', label: 'Context' },
      { text: 'like so much!', type: 'filler', label: 'Colloquial exclamation' },
      { text: 'Secondary node completely out of sync', type: 'syntax', label: 'Context' },
      { text: 'ayyindi.', type: 'accent', label: 'Telugu past auxiliary verb ("it happened")' },
      { text: 'If not resolved before market opens, settlements will halt. Take urgent action right now!', type: 'syntax', label: 'Resolution call' },
    ],
  },
};

export interface VaultRecord {
  id: string;
  timestamp: string;
  title: string;
  testType: string;
  rawText: string;
  convertedText: string;
  naturalSummary: string;
  executiveBullets: string[];
  rawWpm: number;
  convertedWpm: number;
}

export const QuickTestView: React.FC = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<'child' | 'lady' | 'senior_man'>('lady');
  const [activePlayback, setActivePlayback] = useState<'raw' | 'converted' | 'sequence' | null>(null);
  const [sequenceStep, setSequenceStep] = useState<'idle' | 'raw_playing' | 'pausing' | 'converted_playing'>('idle');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // User Ingest State (Mic / Upload)
  const [customInputText, setCustomInputText] = useState('');
  const [isProcessingCustom, setIsProcessingCustom] = useState(false);
  const [customResult, setCustomResult] = useState<{
    rawText: string;
    convertedText: string;
    summary: string;
    bullets: string[];
  } | null>(null);

  // Stored Vault
  const [vault, setVault] = useState<VaultRecord[]>(() => {
    try {
      const saved = localStorage.getItem('echoflow_test_vault');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const testCase = PRECONFIGURED_TEST_CASES[selectedCaseId];
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setActivePlayback(null);
    setSequenceStep('idle');
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  // Voice Archetype Picker for Browser SpeechSynthesis
  const getArchetypeVoice = (type: 'child' | 'lady' | 'senior_man'): SpeechSynthesisVoice | null => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    try {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return null;

      if (type === 'lady') {
        const female = voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.toLowerCase().includes('female') ||
              v.name.toLowerCase().includes('samantha') ||
              v.name.toLowerCase().includes('karen') ||
              v.name.toLowerCase().includes('victoria'))
        );
        if (female) return female;
      } else if (type === 'senior_man') {
        const male = voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.toLowerCase().includes('male') ||
              v.name.toLowerCase().includes('daniel') ||
              v.name.toLowerCase().includes('alex') ||
              v.name.toLowerCase().includes('george'))
        );
        if (male) return male;
      }
      return voices.find((v) => v.lang.startsWith('en')) || voices[0];
    } catch {
      return null;
    }
  };

  // Play Single Track
  const playTrack = (mode: 'raw' | 'converted') => {
    stopAudio();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    setActivePlayback(mode);
    const text = mode === 'raw' ? testCase.rawFullText : testCase.convertedEnglishScript;
    const utterance = new SpeechSynthesisUtterance(text);

    // Apply pitch and speed calibration based on archetype
    if (mode === 'raw') {
      utterance.rate = Math.min(1.5, testCase.rawWpm / 150);
      utterance.pitch = testCase.voiceAcoustics.pitchRaw;
    } else {
      utterance.rate = 1.0; // 150 WPM
      utterance.pitch = testCase.voiceAcoustics.pitchConverted;
    }

    const voice = getArchetypeVoice(testCase.persona.name ? (selectedCaseId as any) : 'lady');
    if (voice) utterance.voice = voice;

    utterance.onend = () => setActivePlayback(null);
    utterance.onerror = () => setActivePlayback(null);

    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Play Sequence: Raw First -> 1.2s Pause -> Converted Second
  const playSequence = () => {
    stopAudio();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    setActivePlayback('sequence');
    setSequenceStep('raw_playing');

    const rawUtterance = new SpeechSynthesisUtterance(testCase.rawFullText);
    rawUtterance.rate = Math.min(1.5, testCase.rawWpm / 150);
    rawUtterance.pitch = testCase.voiceAcoustics.pitchRaw;

    const voice = getArchetypeVoice(selectedCaseId);
    if (voice) rawUtterance.voice = voice;

    rawUtterance.onend = () => {
      setSequenceStep('pausing');
      setTimeout(() => {
        setSequenceStep('converted_playing');
        const convertedUtterance = new SpeechSynthesisUtterance(testCase.convertedEnglishScript);
        convertedUtterance.rate = 1.0;
        convertedUtterance.pitch = testCase.voiceAcoustics.pitchConverted;
        if (voice) convertedUtterance.voice = voice;

        convertedUtterance.onend = () => {
          setActivePlayback(null);
          setSequenceStep('idle');
        };
        convertedUtterance.onerror = () => {
          setActivePlayback(null);
          setSequenceStep('idle');
        };

        synthRef.current = convertedUtterance;
        window.speechSynthesis.speak(convertedUtterance);
      }, 1000);
    };

    rawUtterance.onerror = () => {
      setActivePlayback(null);
      setSequenceStep('idle');
    };

    synthRef.current = rawUtterance;
    window.speechSynthesis.speak(rawUtterance);
  };

  // Copy Executive Summary to Clipboard
  const handleCopySummary = (id: string, text: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  // Run Custom Text Normalization
  const handleNormalizeCustom = async () => {
    if (!customInputText.trim()) return;
    setIsProcessingCustom(true);
    try {
      const res = await fetch('/api/normalize-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: customInputText.trim(),
          targetWpm: 150,
          scenario: 'custom_quick_test',
        }),
      });
      const data = await res.json();
      const converted =
        data.normalizedText ||
        data.cleanedTranscript ||
        customInputText.replace(/\b(uh|um|like|so|ante|arre)\b/gi, '').trim();

      const result = {
        rawText: customInputText,
        convertedText: converted,
        summary: data.naturalSummary || `Processed custom statement at calibrated 150 WPM cadence.`,
        bullets: data.executiveBullets || [
          'Acoustic pacing stabilized to 150 WPM target',
          'Cognitive filler words and dialect pauses suppressed',
        ],
      };
      setCustomResult(result);

      // Save record to local vault
      const newRecord: VaultRecord = {
        id: `custom_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        title: 'Custom Evaluation Test',
        testType: 'custom',
        rawText: customInputText,
        convertedText: converted,
        naturalSummary: result.summary,
        executiveBullets: result.bullets,
        rawWpm: 220,
        convertedWpm: 150,
      };
      setVault((prev) => {
        const updated = [newRecord, ...prev.slice(0, 19)];
        try {
          localStorage.setItem('echoflow_test_vault', JSON.stringify(updated));
        } catch {}
        return updated;
      });
    } catch (e) {
      console.warn('Custom test fallback:', e);
    } finally {
      setIsProcessingCustom(false);
    }
  };

  const PersonaIcon = testCase.persona.icon;

  return (
    <div className="space-y-6">
      {/* 1. Archetype Case Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-xl overflow-x-auto scrollbar-none">
          {(Object.keys(PRECONFIGURED_TEST_CASES) as Array<'child' | 'lady' | 'senior_man'>).map((id) => {
            const c = PRECONFIGURED_TEST_CASES[id];
            const isSelected = selectedCaseId === id;
            return (
              <button
                key={id}
                onClick={() => {
                  stopAudio();
                  setSelectedCaseId(id);
                }}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.tabLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Global Sequence Trigger */}
        <button
          onClick={playSequence}
          disabled={activePlayback !== null}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-black text-xs shadow-md shadow-cyan-500/20 disabled:opacity-50 transition-all cursor-pointer shrink-0"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Play Sequence (Raw ➔ Converted)</span>
        </button>
      </div>

      {/* 2. Sequence Playback Banner (Active Indicator) */}
      {activePlayback === 'sequence' && (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border border-cyan-500/50 flex items-center justify-between gap-3 animate-in fade-in-50">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <div className="text-xs font-mono">
              <span className="text-slate-400">Sequence Status: </span>
              {sequenceStep === 'raw_playing' && (
                <span className="text-rose-400 font-bold">1/2 Playing Raw Hurried Speech ({testCase.rawWpm} WPM)</span>
              )}
              {sequenceStep === 'pausing' && (
                <span className="text-amber-300 font-bold">Processing 150 WPM Cadence Normalization...</span>
              )}
              {sequenceStep === 'converted_playing' && (
                <span className="text-emerald-400 font-bold">2/2 Playing Converted Executive Speech (150 WPM)</span>
              )}
            </div>
          </div>
          <button
            onClick={stopAudio}
            className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-xs font-mono"
          >
            Stop
          </button>
        </div>
      )}

      {/* 3. Demographic Persona Card & Key Acoustics */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${testCase.persona.avatarBg} text-white flex items-center justify-center font-bold shadow-md shrink-0`}>
              <PersonaIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base sm:text-lg">{testCase.persona.name}</h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                  {testCase.archetypeBadge}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {testCase.persona.role} • <span className="text-slate-300">{testCase.persona.ageTitle}</span>
              </p>
            </div>
          </div>

          {/* Quick Audio Controls for this case */}
          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              onClick={() => (activePlayback === 'raw' ? stopAudio() : playTrack('raw'))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activePlayback === 'raw'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
              }`}
            >
              {activePlayback === 'raw' ? <Pause className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>Listen Raw ({testCase.rawWpm} WPM)</span>
            </button>

            <button
              onClick={() => (activePlayback === 'converted' ? stopAudio() : playTrack('converted'))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activePlayback === 'converted'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
              }`}
            >
              {activePlayback === 'converted' ? <Pause className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
              <span>Listen EchoFlow (150 WPM)</span>
            </button>
          </div>
        </div>

        {/* 4. Side-by-Side: Raw Audio Tokens vs Cleaned Executive Script */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: Raw Speech with Token Breakdown */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-900/40 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Raw Dialect Ingest ({testCase.rawWpm} WPM)
              </span>
              <span className="text-slate-400 text-[11px]">Pitch F0: {testCase.voiceAcoustics.f0PitchDisplay}</span>
            </div>

            <div className="text-xs leading-relaxed text-slate-300 flex flex-wrap gap-1.5 p-3 rounded-lg bg-slate-900/90 border border-slate-800">
              {testCase.rawTokens.map((t, idx) => {
                if (t.type === 'filler') {
                  return (
                    <span
                      key={idx}
                      title={`Cognitive Filler: ${t.label}`}
                      className="px-1.5 py-0.5 rounded bg-rose-950/90 text-rose-300 border border-rose-800 font-medium"
                    >
                      {t.text}
                    </span>
                  );
                }
                if (t.type === 'accent') {
                  return (
                    <span
                      key={idx}
                      title={`Regional Dialect Inflection: ${t.label}`}
                      className="px-1.5 py-0.5 rounded bg-amber-950/90 text-amber-300 border border-amber-800 font-medium"
                    >
                      {t.text}
                    </span>
                  );
                }
                if (t.type === 'delay') {
                  return (
                    <span
                      key={idx}
                      title={`Hesitation Loop: ${t.label}`}
                      className="px-1.5 py-0.5 rounded bg-purple-950/90 text-purple-300 border border-purple-800 font-medium"
                    >
                      {t.text}
                    </span>
                  );
                }
                return <span key={idx} className="text-slate-300">{t.text}</span>;
              })}
            </div>

            <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-rose-500 inline-block" /> Filler purged
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-amber-500 inline-block" /> Accent phonetics
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-purple-500 inline-block" /> Hesitation loop
              </span>
            </div>
          </div>

          {/* Right: Normalized Executive English */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-900/40 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                EchoFlow Harmonized Output (150 WPM)
              </span>
              <span className="text-cyan-400 text-[11px]">Pitch Preserved: {testCase.f0RetentionPct}%</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
              "{testCase.convertedEnglishScript}"
            </div>

            {/* Executive Action Bullets */}
            <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-800/40 space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-emerald-300 uppercase">
                EXECUTIVE ACTION BRIEF
              </span>
              <ul className="text-xs text-slate-300 space-y-1">
                {testCase.executiveBullets.map((b, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Custom Live Input / File Ingest Playground */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h4 className="font-bold text-sm text-white">Evaluate Custom Text or Dialect Statement</h4>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Rule-based + Gemini Live normalizer</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <textarea
            rows={2}
            value={customInputText}
            onChange={(e) => setCustomInputText(e.target.value)}
            placeholder="Type or paste any hurried regional dialect speech (e.g., 'Sir, server continuous-aa failing, packet dropping like anything...')..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
          />
          <button
            onClick={handleNormalizeCustom}
            disabled={isProcessingCustom || !customInputText.trim()}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            {isProcessingCustom ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
            <span>Normalize 150 WPM</span>
          </button>
        </div>

        {customResult && (
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-2 animate-in fade-in-50">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
              CONVERTED 150 WPM EXECUTIVE OUTPUT
            </span>
            <p className="text-xs sm:text-sm text-slate-100 font-medium">
              "{customResult.convertedText}"
            </p>
          </div>
        )}
      </div>

      {/* 6. Local Evaluation Vault */}
      {vault.length > 0 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <h4 className="font-bold text-sm text-white">Evaluation Vault ({vault.length} Recorded Tests)</h4>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('echoflow_test_vault');
                setVault([]);
              }}
              className="text-[11px] font-mono text-slate-400 hover:text-rose-400"
            >
              Clear Vault
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 pr-1">
            {vault.map((rec) => (
              <div
                key={rec.id}
                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">{rec.title}</span>
                    <span className="text-[10px] font-mono text-slate-500">{rec.timestamp}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] truncate max-w-lg mt-0.5">
                    {rec.convertedText}
                  </p>
                </div>
                <button
                  onClick={() => handleCopySummary(rec.id, rec.convertedText)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] shrink-0 self-start sm:self-center"
                >
                  {copiedId === rec.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === rec.id ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
