import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Play,
  Square,
  Sparkles,
  Zap,
  CheckCircle,
  FileAudio,
  Activity,
  Flame,
  Globe,
  ShieldCheck,
} from 'lucide-react';
import { AudioScenario, TelemetryData, LanguageKey } from '../types';
import { LANGUAGE_CONFIGS } from '../config/languages';
import { PitchContourVisualizer } from './PitchContourVisualizer';
import { PhoneticAccentHeatmap } from './PhoneticAccentHeatmap';
import { validateAudioStructure } from '../hooks/useAudioIngestion';

interface AudioTestbenchProps {
  isStreaming: boolean;
  setIsStreaming: (val: boolean) => void;
  telemetry: TelemetryData;
  setTelemetry: React.Dispatch<React.SetStateAction<TelemetryData>>;
  targetWpm: number;
  setTargetWpm: (val: number) => void;
  pitchRetention: number;
  setPitchRetention: (val: number) => void;
  voicePersona: string;
  setVoicePersona: (val: string) => void;
  fillerSuppression: boolean;
  setFillerSuppression: (val: boolean) => void;
  onAudioPlayStateChange: (isPlaying: boolean) => void;
  selectedLanguage: LanguageKey;
  onLanguageSelect: (lang: LanguageKey) => void;
}

// Enterprise Language & Dialect Scenarios
const PRESET_SCENARIOS: AudioScenario[] = [
  {
    id: 'user_audio_test',
    title: 'User Live Test: Hesitation & Time Normalization',
    language: 'English',
    persona: 'Puck',
    accent: 'Conversational Indian English (Live Ingest)',
    originalWpm: 75,
    description: 'Real user test audio containing cognitive hesitations ("ah, okay"), false start ("5 minutes, no, no... 5 to 10 minutes"), and pacing variance.',
    transcript:
      "Hello, I'm testing an app, ah, okay, I've done, ah, it will take 5 minutes, no, no, what I meant was 5 to 10 minutes, yes.",
    prosodyIssues: ['Cognitive Fillers (ah, okay)', 'False Start (5 mins -> 5-10 mins)', 'Conversational Hesitation'],
    recommendedTargetWpm: 150,
    detectedEmotion: 'Tentative / Testing',
  },
  {
    id: 'english_cloud',
    title: 'North American / British English P1 Incident',
    language: 'English',
    persona: 'Puck',
    accent: 'Global English (Rapid Delivery, 220 WPM)',
    originalWpm: 220,
    description: 'High-speed technical escalation regarding payment gateway rate limiters and database locks.',
    transcript:
      "Hi, uh, I'm calling about ticket number 94821 regarding the Redis database cluster latency issue, like, we had a major outage in the Singapore zone and need immediate tier-3 escalation right now before market open!",
    prosodyIssues: ['220 WPM erratic rush', 'Consonant clipping', 'Acoustic filler bursts'],
    recommendedTargetWpm: 150,
    detectedEmotion: 'High Urgency',
  },
  {
    id: 'french_discovery',
    title: 'Paris Enterprise SaaS Governance',
    language: 'French',
    persona: 'Kore',
    accent: 'French-Accented English with Hesitation (125 WPM)',
    originalWpm: 125,
    description: 'Discussion of enterprise data sovereignty and GDPR compliance with heavy cognitive fillers ("um, uh, like").',
    transcript:
      "Bonjour, um... yes, we are evaluating, uh, your enterprise governance package, but, you know, we have some, like, specific compliance requirements under GDPR, so... how does your encryption work at rest?",
    prosodyIssues: ['Hesitant 125 WPM pacing', 'Heavy filler particles (um, uh, like)', 'Prolonged pause duration'],
    recommendedTargetWpm: 146,
    detectedEmotion: 'Cautious Inquiry',
  },
  {
    id: 'german_iot',
    title: 'Frankfurt Industrial IoT Telematics Bridge',
    language: 'German',
    persona: 'Zephyr',
    accent: 'German Staccato English (215 WPM)',
    originalWpm: 215,
    description: 'Fast staccato rhythm with rigid consonant clusters on critical automotive fleet telemetry.',
    transcript:
      "Achtung, our connected fleet telematics MQTT broker in Frankfurt is rejecting payload packets with protocol error 1006, this halts our telemetry ingestion stream right now and requires instant kernel inspection!",
    prosodyIssues: ['215 WPM staccato rush', 'Abrupt syllable stops', 'High-stress frequency peaks'],
    recommendedTargetWpm: 152,
    detectedEmotion: 'Stern Urgency',
  },
  {
    id: 'telugu_tech',
    title: 'Hyderabad Global Cloud Operations',
    language: 'Telugu',
    persona: 'Puck',
    accent: 'Telugu-Accented English (230 WPM)',
    originalWpm: 230,
    description: 'High syllable velocity with characteristic retroflex consonant rhythms and rapid sentence endings.',
    transcript:
      "Hello, ante... our Kubernetes cluster pod autoscaling policy is failing continuously in the Mumbai zone, like, during high batch ingest we are getting 504 gateway timeouts, please resolve this immediately!",
    prosodyIssues: ['230 WPM high syllable velocity', 'Retroflex timing compression', 'Filler markers (ante, like)'],
    recommendedTargetWpm: 150,
    detectedEmotion: 'Pressured Urgency',
  },
  {
    id: 'tamil_fintech',
    title: 'Chennai Enterprise BPO Core Settlement',
    language: 'Tamil',
    persona: 'Fenrir',
    accent: 'Tamil-Accented English (225 WPM)',
    originalWpm: 225,
    description: 'Fast consonant transitions and rhythmic cadence bursts during complex financial reconciliation.',
    transcript:
      "Sir, uh, we are trying to sync customer biometric KYC records via the webhooks, but we are facing token expiry errors after every fifty calls, please check the OAuth refresh secret configuration right away!",
    prosodyIssues: ['225 WPM rapid transit', 'Syllable bunching', 'Intermittent pitch spikes'],
    recommendedTargetWpm: 152,
    detectedEmotion: 'Focused Escalation',
  },
  {
    id: 'hindi_support',
    title: 'Gurugram Global Operations Account Billing',
    language: 'Hindi',
    persona: 'Kore',
    accent: 'Hindi-Accented English (220 WPM)',
    originalWpm: 220,
    description: 'Rapid pace with emphatic sentence-level stress shifts during high-stakes corporate billing resolution.',
    transcript:
      "Hello Neha ji, our enterprise billing invoice shows unexpected charges for cloud storage egress that was never discussed in our contract agreement, this is causing internal audit hold-ups right now!",
    prosodyIssues: ['220 WPM hurried pacing', 'Emphatic stress swings', 'Conversational filler pauses'],
    recommendedTargetWpm: 148,
    detectedEmotion: 'Disgruntled Urgency',
  },
];

export const AudioTestbench: React.FC<AudioTestbenchProps> = ({
  isStreaming,
  setIsStreaming,
  telemetry,
  setTelemetry,
  targetWpm,
  setTargetWpm,
  pitchRetention,
  setPitchRetention,
  voicePersona,
  setVoicePersona,
  fillerSuppression,
  setFillerSuppression,
  onAudioPlayStateChange,
  selectedLanguage,
  onLanguageSelect,
}) => {
  const [inputMode, setInputMode] = useState<'scenario' | 'microphone'>('scenario');
  const [selectedScenario, setSelectedScenario] = useState<AudioScenario>(() => {
    return (
      PRESET_SCENARIOS.find((sc) => sc.language === selectedLanguage) ||
      PRESET_SCENARIOS[0]
    );
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [normalizedResult, setNormalizedResult] = useState<any>(null);
  const [micAudioError, setMicAudioError] = useState<string | null>(null);
  const [customInputText, setCustomInputText] = useState<string>('');

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const packetAuditCounterRef = useRef<number>(0);

  const activeLangConfig = LANGUAGE_CONFIGS[selectedLanguage] || LANGUAGE_CONFIGS.English;

  // Sync scenario when selectedLanguage changes from Header
  useEffect(() => {
    const matching = PRESET_SCENARIOS.find((sc) => sc.language === selectedLanguage);
    if (matching) {
      setSelectedScenario(matching);
      setNormalizedResult(null);
      setTelemetry((prev) => ({
        ...prev,
        originalPaceWpm: matching.originalWpm,
        targetPaceWpm: matching.recommendedTargetWpm,
        activeLanguage: selectedLanguage,
        pacingStrategy: activeLangConfig.pacingStrategy,
      }));
    }
  }, [selectedLanguage]);

  // Synchronize WebSocket relay if language changes during active stream
  useEffect(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'set_language',
          language: selectedLanguage,
          systemInstruction: activeLangConfig.systemInstruction,
          targetPaceWpm: activeLangConfig.targetPaceWpm,
          pacingStrategy: activeLangConfig.pacingStrategy,
        })
      );
    }
  }, [selectedLanguage, activeLangConfig]);

  // Sync canvas playing state
  useEffect(() => {
    onAudioPlayStateChange(isPlayingAudio || isStreaming);
  }, [isPlayingAudio, isStreaming, onAudioPlayStateChange]);

  const handleSelectScenario = (scenario: AudioScenario) => {
    setSelectedScenario(scenario);
    onLanguageSelect(scenario.language);
    setNormalizedResult(null);
    setTelemetry((prev) => ({
      ...prev,
      originalPaceWpm: scenario.originalWpm,
      targetPaceWpm: scenario.recommendedTargetWpm,
      activeLanguage: scenario.language,
    }));
  };

  const handleNormalizeScenario = async () => {
    setIsProcessing(true);
    const textToSend = customInputText.trim() || selectedScenario.transcript;

    console.log('[AudioTestbench:ScenarioPipeline] Ingestion payload audit:', {
      isCustomText: !!customInputText.trim(),
      charCount: textToSend.length,
      wordCount: textToSend.split(/\s+/).filter(Boolean).length,
      samplePreview: textToSend.slice(0, 60) + '...',
      originalWpm: selectedScenario.originalWpm,
      targetWpm: targetWpm,
      selectedLanguage,
      scenarioId: selectedScenario.id,
      timestamp: new Date().toISOString(),
    });

    try {
      const response = await fetch('/api/normalize-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSend,
          language: selectedLanguage,
          originalWpm: selectedScenario.originalWpm,
          targetWpm: targetWpm,
          scenario: selectedScenario.id,
          persona: voicePersona,
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('[AudioTestbench:ScenarioPipeline] Normalization successful:', {
          cleanedLength: data.normalizedText?.length,
          originalCadenceWpm: data.originalCadenceWpm,
          normalizedCadenceWpm: data.normalizedCadenceWpm,
          varianceReduction: data.cadenceVarianceReductionPct,
          hasAudioBase64: !!data.audioBase64,
        });
        setNormalizedResult(data);
        setTelemetry((prev) => ({
          ...prev,
          latencyMs: data.latencyBreakdownMs.totalEndToEnd,
          cadenceVarianceReduction: data.cadenceVarianceReductionPct,
          pitchPreservationIndex: data.pitchPreservationIndex,
          phoneticIntelligibilityLift: data.intelligibilityLiftPct,
          latencyBreakdown: data.latencyBreakdownMs,
          activeLanguage: selectedLanguage,
          pacingStrategy: data.pacingStrategy || activeLangConfig.pacingStrategy,
        }));
      }
    } catch (err: any) {
      console.error('[AudioTestbench:ScenarioPipeline] Normalization error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlayNormalizedAudio = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const textToPlay =
      normalizedResult?.normalizedText ||
      selectedScenario.transcript.replace(
        /\b(uh|um|like|you know|ante|arre|vandhu|appo|euh|ähm)\b,?\s*/gi,
        ''
      );

    if (normalizedResult?.audioBase64) {
      try {
        const audio = new Audio(`data:audio/wav;base64,${normalizedResult.audioBase64}`);
        setIsPlayingAudio(true);
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => fallbackSpeechSynthesis(textToPlay);
        audio.play();
        return;
      } catch (e) {
        console.warn('WAV playback fallback:', e);
      }
    }

    fallbackSpeechSynthesis(textToPlay);
  };

  const fallbackSpeechSynthesis = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const targetRate = Math.min(1.4, Math.max(0.7, targetWpm / 150));
    utterance.rate = targetRate;
    utterance.pitch = pitchRetention / 100;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleToggleMicStream = async () => {
    if (isStreaming) {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
        micStreamRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsStreaming(false);
      return;
    }

    setMicAudioError(null);
    try {
      console.log('[AudioTestbench:MicInput] Requesting user media stream: 16000Hz, mono, echoCancellation=true');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, sampleRate: 16000, echoCancellation: true },
      });
      micStreamRef.current = stream;

      const track = stream.getAudioTracks()[0];
      console.log('[AudioTestbench:MicInput] Microphone hardware track acquired:', {
        trackLabel: track?.label,
        enabled: track?.enabled,
        readyState: track?.readyState,
        settings: track?.getSettings ? track.getSettings() : {},
      });

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
      });
      audioContextRef.current = audioCtx;
      console.log('[AudioTestbench:AudioContext] Web AudioContext initialized:', {
        sampleRate: audioCtx.sampleRate,
        state: audioCtx.state,
        baseLatency: audioCtx.baseLatency,
      });

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/stream`;
      console.log(`[AudioTestbench:WebSocket] Opening stream relay socket: ${wsUrl}`);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsStreaming(true);
        console.log('[AudioTestbench:WebSocket] Stream connected. Sending language configuration handshake.');

        // Send active language and system instruction upon connection
        ws.send(
          JSON.stringify({
            type: 'set_language',
            language: selectedLanguage,
            systemInstruction: activeLangConfig.systemInstruction,
            targetPaceWpm: activeLangConfig.targetPaceWpm,
            pacingStrategy: activeLangConfig.pacingStrategy,
          })
        );

        const source = audioCtx.createMediaStreamSource(stream);
        const processor = audioCtx.createScriptProcessor(512, 1, 1);
        source.connect(processor);
        processor.connect(audioCtx.destination);
        console.log('[AudioTestbench:Pipeline] ScriptProcessorNode configured (bufferSize=512, channels=1).');

        processor.onaudioprocess = (e) => {
          if (ws.readyState === WebSocket.OPEN) {
            const inputData = e.inputBuffer.getChannelData(0);
            const sampleCount = inputData.length;

            // Audit Step 1: Raw Float32 capture analysis & sanity check
            let minVal = 0;
            let maxVal = 0;
            let sumSq = 0;
            let nanCount = 0;
            let zeroCount = 0;

            for (let i = 0; i < sampleCount; i++) {
              const val = inputData[i];
              if (isNaN(val)) nanCount++;
              if (val === 0) zeroCount++;
              if (val < minVal) minVal = val;
              if (val > maxVal) maxVal = val;
              sumSq += val * val;
            }

            const rms = Math.sqrt(sumSq / sampleCount);

            // Audit Step 2: Linear 16-bit PCM quantization & clipping audit
            const pcm16 = new Int16Array(sampleCount);
            let clippedSamples = 0;

            for (let i = 0; i < sampleCount; i++) {
              const s = Math.max(-1, Math.min(1, inputData[i]));
              if (s <= -1 || s >= 1) clippedSamples++;
              pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
            }

            // Audit Step 3: Strict Data Validation Layer Check before Gemini Live Client Dispatch
            const validation = validateAudioStructure(pcm16.buffer, 'audio/pcm;rate=16000;channels=1');

            packetAuditCounterRef.current += 1;
            const seq = packetAuditCounterRef.current;

            if (!validation.isValid) {
              console.warn(
                `[AudioTestbench:Pipeline:Seq#${seq}][CORRUPT_PAYLOAD_DETECTED_AND_DROPPED]`,
                {
                  reason: validation.rejectionReason,
                  bytes: pcm16.buffer.byteLength,
                  nanCount,
                  zeroRatio: (zeroCount / sampleCount).toFixed(2),
                }
              );
              return; // Guard: drop corrupted frame to prevent erratic Gemini Live processing
            }

            // Periodic pipeline health log (every 60 frames ~ 1.9s)
            if (seq % 60 === 1) {
              console.log(
                `[AudioTestbench:Pipeline:Seq#${seq}][CLEAN_STREAM_VERIFIED]`,
                {
                  samples: sampleCount,
                  byteLength: validation.byteLength,
                  mimeType: validation.mimeType,
                  rmsEnergy: (rms * 100).toFixed(2) + '%',
                  peakDb: (20 * Math.log10(Math.max(0.0001, Math.max(Math.abs(minVal), Math.abs(maxVal))))).toFixed(1) + ' dB',
                  clippingCount: clippedSamples,
                  zeroPaddingRatio: (zeroCount / sampleCount).toFixed(2),
                  injectionAudit: 'NO_ROGUE_DATA_INJECTED (Verbatim 16-bit PCM Audio)',
                }
              );
            }

            ws.send(pcm16.buffer);
          }
        };
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'validation_error') {
            console.error('[AudioTestbench:WebSocket] Server ingestion validation error reported:', data);
          } else if (data.type === 'telemetry_frame') {
            setTelemetry((prev) => ({
              ...prev,
              latencyMs: data.latencyMs,
              cadenceVarianceReduction: data.cadenceVarianceReduction,
              pitchPreservationIndex: data.pitchPreservationIndex,
              packetCount: data.packetIndex,
              activeLanguage: data.activeLanguage || selectedLanguage,
              pacingStrategy: data.pacingStrategy || activeLangConfig.pacingStrategy,
              systemInstructionPreview: data.systemInstructionPreview,
            }));
          } else if (data.type === 'language_config_ack') {
            console.log('[AudioTestbench:WebSocket] Relay acknowledged language update:', data);
          }
        } catch (e) {}
      };

      ws.onerror = () => {
        console.error('[AudioTestbench:WebSocket] Socket error observed.');
        setMicAudioError('WebSocket relay connection issue.');
        setIsStreaming(false);
      };
      ws.onclose = (ev) => {
        console.log('[AudioTestbench:WebSocket] Socket closed:', ev.code, ev.reason);
        setIsStreaming(false);
      };
    } catch (err: any) {
      console.error('[AudioTestbench:MicInput] Error acquiring audio input stream:', err);
      setMicAudioError('Microphone access denied or unavailable in this environment.');
      setIsStreaming(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Switcher & DSP Tuning Row */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                Interactive Voice Cadence Normalizer
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center gap-1">
                <span>{activeLangConfig.flag}</span>
                <span>{selectedLanguage} RELAY ACTIVE</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Calibrated pacing: <strong>{activeLangConfig.pacingStrategy}</strong> (Target: {activeLangConfig.targetPaceWpm} WPM)
            </p>
          </div>

          <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-xl">
            <button
              onClick={() => setInputMode('scenario')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                inputMode === 'scenario'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileAudio className="w-3.5 h-3.5" />
              <span>Language Matrix (6)</span>
            </button>

            <button
              onClick={() => setInputMode('microphone')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                inputMode === 'microphone'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Live Mic Stream</span>
            </button>
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-4">
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Target Pace (WPM)</span>
              <span className="font-mono text-cyan-400 font-semibold">{targetWpm} WPM</span>
            </div>
            <input
              type="range"
              min="130"
              max="175"
              step="1"
              value={targetWpm}
              onChange={(e) => setTargetWpm(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>130 (Calm)</span>
              <span className="text-emerald-400 font-semibold">140-160 (Optimal)</span>
              <span>175 (Fast)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Pitch Retention</span>
              <span className="font-mono text-emerald-400 font-semibold">{pitchRetention}%</span>
            </div>
            <input
              type="range"
              min="75"
              max="100"
              step="1"
              value={pitchRetention}
              onChange={(e) => setPitchRetention(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>75%</span>
              <span className="text-emerald-400 font-semibold">94% (Natural)</span>
              <span>100%</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Voice Persona
            </label>
            <select
              value={voicePersona}
              onChange={(e) => setVoicePersona(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="Puck">Puck (Adaptive Male / Tech Support)</option>
              <option value="Kore">Kore (Articulate Female / Enterprise)</option>
              <option value="Zephyr">Zephyr (Balanced / Fintech)</option>
              <option value="Fenrir">Fenrir (Authoritative / Crisis Bridge)</option>
            </select>
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-xs font-medium text-slate-300 mb-1.5">Filler Suppression</span>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={fillerSuppression}
                onChange={(e) => setFillerSuppression(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-cyan-500"
              />
              <span className="text-slate-300 text-[11px]">
                Filter '{activeLangConfig.fillerWords.slice(0, 3).join(', ')}'
              </span>
            </label>
          </div>
        </div>
      </div>

      {inputMode === 'scenario' ? (
        <div className="space-y-6">
          {/* Language Selector Grid (6 Languages) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {PRESET_SCENARIOS.map((sc) => {
              const isSelected = selectedScenario.id === sc.id;
              const cfg = LANGUAGE_CONFIGS[sc.language];
              return (
                <button
                  key={sc.id}
                  onClick={() => handleSelectScenario(sc)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/70 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                      : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-xs text-slate-100 flex items-center gap-1">
                      <span>{cfg?.flag}</span>
                      <span>{sc.language}</span>
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-950/80 text-rose-300 border border-rose-800">
                      {sc.originalWpm} WPM
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{sc.title}</p>
                </button>
              );
            })}
          </div>

          {/* Active System Instruction & Pacing Logic Banner */}
          <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-4 shadow-lg space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-base">{activeLangConfig.flag}</span>
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                  Active WebSocket System Instruction: {activeLangConfig.name} ({activeLangConfig.nativeName})
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                Strategy: {activeLangConfig.pacingStrategy}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono leading-relaxed bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
              "{activeLangConfig.systemInstruction}"
            </p>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Phonetic tuning: {activeLangConfig.phoneticNotes}</span>
              <span className="text-emerald-400 font-mono">Relay State: Synced (16kHz PCM $\rightarrow$ 24kHz Bidi)</span>
            </div>
          </div>

          {/* Transcript & Normalization Box */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Raw Incoming Audio ({selectedScenario.language} • {selectedScenario.originalWpm} WPM)
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Dialect: {selectedScenario.accent}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Incoming Speech / Custom Script Input (Verbatim):</span>
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  {(customInputText || selectedScenario.transcript).split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                value={customInputText || selectedScenario.transcript}
                onChange={(e) => setCustomInputText(e.target.value)}
                rows={3}
                className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 font-sans leading-relaxed focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-500"
                placeholder="Type or paste any custom speech transcript to test normalization..."
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-slate-400 font-medium">Prosody Friction:</span>
                {selectedScenario.prosodyIssues.map((issue, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-rose-950/50 text-rose-300 border border-rose-800/60"
                  >
                    {issue}
                  </span>
                ))}
              </div>

              <button
                onClick={handleNormalizeScenario}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-500 text-slate-950 hover:brightness-110 active:scale-[0.99] transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50 flex items-center gap-2 shrink-0"
              >
                <Zap className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                <span>
                  {isProcessing
                    ? `Relaying via Gemini Live (${selectedLanguage})...`
                    : `Normalize Cadence to ${targetWpm} WPM`}
                </span>
              </button>
            </div>

            {/* Normalized Result Box */}
            {normalizedResult && (
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-900/60 space-y-3 animate-in fade-in-50 duration-300">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    EchoFlow Harmonized Output ({normalizedResult.normalizedCadenceWpm} WPM) • {selectedLanguage}
                  </span>
                  <button
                    onClick={handlePlayNormalizedAudio}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isPlayingAudio
                        ? 'bg-rose-600 text-white'
                        : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                    }`}
                  >
                    {isPlayingAudio ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isPlayingAudio ? 'Stop Speech' : 'Play Harmonized Speech'}</span>
                  </button>
                </div>

                <p className="text-sm text-slate-100 leading-relaxed">
                  "{normalizedResult.normalizedText}"
                </p>
              </div>
            )}
          </div>

          {/* Feature #2: Phonetic Accent & Syllable Velocity Heatmap */}
          <PhoneticAccentHeatmap
            transcript={selectedScenario.transcript}
            originalWpm={selectedScenario.originalWpm}
            targetWpm={targetWpm}
            language={selectedScenario.language}
          />

          {/* Feature #4: Acoustic Pitch Contour Tracking ($F_0$ Fundamental Frequency) */}
          <PitchContourVisualizer
            isPlaying={isPlayingAudio || isStreaming}
            pitchPreservation={pitchRetention}
            emotion={selectedScenario.detectedEmotion}
          />
        </div>
      ) : (
        /* Live Mic Mode */
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center shadow-lg">
          <div className="max-w-md mx-auto space-y-4">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all ${
                isStreaming
                  ? 'bg-rose-500/20 text-rose-400 ring-4 ring-rose-500/40 animate-pulse'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <Mic className="w-10 h-10" />
            </div>

            <h3 className="text-lg font-bold text-slate-100">
              {isStreaming
                ? `Streaming Live Audio (${selectedLanguage} Pacing)`
                : `Speak into Microphone (${selectedLanguage})`}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Capture your voice in 16kHz Linear PCM. The WebSocket streaming relay normalizes cadence to {targetWpm} WPM
              using the <strong>{activeLangConfig.pacingStrategy}</strong> system instruction.
            </p>

            {micAudioError && (
              <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-xs text-rose-300">
                {micAudioError}
              </div>
            )}

            <button
              onClick={handleToggleMicStream}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
                isStreaming
                  ? 'bg-rose-600 text-white hover:bg-rose-700'
                  : 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:brightness-110'
              }`}
            >
              {isStreaming ? 'Stop Audio Relay Stream' : 'Start Live Microphone Relay'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
