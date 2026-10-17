import React, { useState, useRef } from 'react';
import {
  Phone,
  PhoneOff,
  PhoneCall,
  Volume2,
  VolumeX,
  Play,
  Square,
  Sparkles,
  Zap,
  Clock,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  User,
  Headphones,
  Mic,
  Radio,
} from 'lucide-react';
import { CallMessage } from '../types';

interface CallDialogue {
  language: string;
  customerName: string;
  customerAccent: string;
  agentName: string;
  messages: CallMessage[];
  sentimentShift: { before: string; after: string; beforeScore: number; afterScore: number };
  loopsAvoided: number;
  secondsSaved: number;
}

const CALL_DIALOGUES: Record<string, CallDialogue> = {
  English: {
    language: 'English',
    customerName: 'Sarah M. (London)',
    customerAccent: 'Fast British English (215 WPM)',
    agentName: 'Arjun R. (Enterprise Lead)',
    sentimentShift: { before: 'Agitated & Pressured', after: 'Delighted & Reassured', beforeScore: 28, afterScore: 95 },
    loopsAvoided: 3,
    secondsSaved: 84,
    messages: [
      {
        id: '1',
        speaker: 'customer',
        speakerName: 'Sarah M.',
        role: 'Global VP of Payments',
        rawText: "Look, uh, I'm calling because our EU cross-border merchant gateway is rejecting 30 percent of SEPA transactions, like, our settlement cut-off is in 45 minutes and we cannot afford transaction failures right now!",
        normalizedText: "I'm calling because our European cross-border merchant gateway is rejecting thirty percent of SEPA transactions. Our settlement cut-off is in forty-five minutes, and we cannot afford transaction failures right now.",
        originalWpm: 228,
        normalizedWpm: 150,
        emotion: 'Urgent Panic',
        timestamp: '00:04',
      },
      {
        id: '2',
        speaker: 'agent',
        speakerName: 'Arjun R.',
        role: 'Tier-3 Technical Account Manager',
        rawText: "Hi Sarah, um, don't worry, let me, uh, immediately check the latency queue on the Frankfurt cluster and bypass the rate limit threshold for your account right away.",
        normalizedText: "Hi Sarah, please rest assured. Let me immediately inspect the latency queue on the Frankfurt cluster and bypass the rate limit threshold for your account right away.",
        originalWpm: 210,
        normalizedWpm: 148,
        emotion: 'Empathic Calm',
        timestamp: '00:18',
      },
      {
        id: '3',
        speaker: 'customer',
        speakerName: 'Sarah M.',
        role: 'Global VP of Payments',
        rawText: "Thank goodness, please confirm as soon as the bypass rule propagates so I can notify our treasury operations team immediately.",
        normalizedText: "Thank goodness, please confirm as soon as the bypass rule propagates so I can notify our treasury operations team immediately.",
        originalWpm: 185,
        normalizedWpm: 150,
        emotion: 'Relieved',
        timestamp: '00:32',
      },
    ],
  },
  Telugu: {
    language: 'Telugu',
    customerName: 'Suresh V. (Hyderabad)',
    customerAccent: 'Telugu-Accented English (230 WPM)',
    agentName: 'Priya K. (Support Specialist)',
    sentimentShift: { before: 'Frustrated / Urgent', after: 'Fully Satisfied', beforeScore: 32, afterScore: 96 },
    loopsAvoided: 4,
    secondsSaved: 95,
    messages: [
      {
        id: '1',
        speaker: 'customer',
        speakerName: 'Suresh V.',
        role: 'Cloud Engineering Director',
        rawText: "Hello, ante... our Kubernetes cluster pod autoscaling policy is failing continuously in the Mumbai zone, like, during high batch ingest we are getting 504 gateway timeouts, please resolve fast!",
        normalizedText: "Hello, our Kubernetes cluster pod autoscaling policy is failing continuously in the Mumbai zone. During high batch ingest we are getting 504 gateway timeouts, please resolve promptly.",
        originalWpm: 232,
        normalizedWpm: 150,
        emotion: 'Frustrated Urgency',
        timestamp: '00:05',
      },
      {
        id: '2',
        speaker: 'agent',
        speakerName: 'Priya K.',
        role: 'Support Specialist',
        rawText: "Suresh garu, I see the CPU throttling alert on your worker nodes. I am reallocating capacity from the standby pool right now so pod creation succeeds immediately.",
        normalizedText: "Suresh garu, I see the CPU throttling alert on your worker nodes. I am reallocating capacity from the standby pool right now so pod creation succeeds immediately.",
        originalWpm: 190,
        normalizedWpm: 148,
        emotion: 'Composed Assurance',
        timestamp: '00:20',
      },
    ],
  },
  Tamil: {
    language: 'Tamil',
    customerName: 'Karthik N. (Chennai)',
    customerAccent: 'Tamil-Accented English (225 WPM)',
    agentName: 'Deepak S. (Lead Architect)',
    sentimentShift: { before: 'Confused & Stressed', after: 'Confident & Appreciative', beforeScore: 35, afterScore: 94 },
    loopsAvoided: 3,
    secondsSaved: 80,
    messages: [
      {
        id: '1',
        speaker: 'customer',
        speakerName: 'Karthik N.',
        role: 'Fintech Technical Lead',
        rawText: "Sir, uh, we are trying to sync customer biometric KYC records via the webhooks, but we are facing token expiry errors after every fifty calls, please guide us immediately.",
        normalizedText: "We are trying to synchronize customer biometric KYC records via the webhooks, but we are facing token expiry errors after every fifty calls. Please guide us.",
        originalWpm: 226,
        normalizedWpm: 152,
        emotion: 'Confused Stress',
        timestamp: '00:04',
      },
      {
        id: '2',
        speaker: 'agent',
        speakerName: 'Deepak S.',
        role: 'Lead Architect',
        rawText: "Karthik, your OAuth refresh token TTL was configured for sixty seconds instead of one hour. I have updated the client secret profile, please retry the batch now.",
        normalizedText: "Karthik, your OAuth refresh token TTL was configured for sixty seconds instead of one hour. I have updated the client secret profile, please retry the batch now.",
        originalWpm: 200,
        normalizedWpm: 150,
        emotion: 'Professional Empathy',
        timestamp: '00:22',
      },
    ],
  },
  Hindi: {
    language: 'Hindi',
    customerName: 'Amit S. (Gurugram)',
    customerAccent: 'Hindi-Accented English (220 WPM)',
    agentName: 'Neha J. (Account Manager)',
    sentimentShift: { before: 'Disgruntled', after: 'Delighted', beforeScore: 30, afterScore: 97 },
    loopsAvoided: 3,
    secondsSaved: 88,
    messages: [
      {
        id: '1',
        speaker: 'customer',
        speakerName: 'Amit S.',
        role: 'Operations Head',
        rawText: "Arre Neha ji, our enterprise billing invoice shows extra charges for cloud storage egress that was never discussed in our contract agreement, this is causing audit delays!",
        normalizedText: "Neha ji, our enterprise billing invoice shows unexpected charges for cloud storage egress that was not in our agreement. This is causing audit delays.",
        originalWpm: 220,
        normalizedWpm: 148,
        emotion: 'Disgruntled Urgency',
        timestamp: '00:06',
      },
      {
        id: '2',
        speaker: 'agent',
        speakerName: 'Neha J.',
        role: 'Account Manager',
        rawText: "Amit ji, I completely understand your concern. That was an automated billing tier misclassification. I have issued an instant credit note of 4,200 dollars and locked your contracted discount rate.",
        normalizedText: "Amit ji, I completely understand your concern. That was an automated billing tier misclassification. I have issued an instant credit note of 4,200 dollars and locked your contracted discount rate.",
        originalWpm: 195,
        normalizedWpm: 150,
        emotion: 'Warm Reassurance',
        timestamp: '00:24',
      },
    ],
  },
  French: {
    language: 'French',
    customerName: 'Camille B. (Paris)',
    customerAccent: 'French English with Hesitation (125 WPM)',
    agentName: 'Marc V. (Solutions Lead)',
    sentimentShift: { before: 'Apprehensive', after: 'Fully Confident', beforeScore: 40, afterScore: 93 },
    loopsAvoided: 2,
    secondsSaved: 62,
    messages: [
      {
        id: '1',
        speaker: 'customer',
        speakerName: 'Camille B.',
        role: 'Enterprise Compliance Officer',
        rawText: "Bonjour Marc, um... we are reviewing your Cloud Run architecture, but, uh, you know, our French data protection auditor requires strict local telemetry isolation, so... how is this guaranteed?",
        normalizedText: "Bonjour Marc. We are reviewing your Cloud Run architecture, but our French data protection auditor requires strict local telemetry isolation. How is this guaranteed?",
        originalWpm: 125,
        normalizedWpm: 146,
        emotion: 'Cautious Hesitation',
        timestamp: '00:08',
      },
      {
        id: '2',
        speaker: 'agent',
        speakerName: 'Marc V.',
        role: 'Solutions Lead',
        rawText: "Bonjour Camille. All audio packets remain in ephemeral memory within the europe-west9 Paris cloud region, ensuring full GDPR Article 28 compliance.",
        normalizedText: "Bonjour Camille. All audio packets remain in ephemeral memory within the europe-west9 Paris cloud region, ensuring full GDPR Article 28 compliance.",
        originalWpm: 160,
        normalizedWpm: 150,
        emotion: 'Authoritative Clarity',
        timestamp: '00:25',
      },
    ],
  },
  German: {
    language: 'German',
    customerName: 'Hans W. (Munich)',
    customerAccent: 'German Staccato English (210 WPM)',
    agentName: 'Klara S. (SRE Lead)',
    sentimentShift: { before: 'Stern & Critical', after: 'Reassured & Positive', beforeScore: 34, afterScore: 95 },
    loopsAvoided: 3,
    secondsSaved: 75,
    messages: [
      {
        id: '1',
        speaker: 'customer',
        speakerName: 'Hans W.',
        role: 'Automotive IoT Architect',
        rawText: "Achtung, our connected fleet telematics MQTT broker in Frankfurt is rejecting payload packets with protocol error 1006, this halts our telemetry ingestion stream right now!",
        normalizedText: "Attention, our connected fleet telematics MQTT broker in Frankfurt is rejecting payload packets with protocol error 1006. This halts our telemetry ingestion stream.",
        originalWpm: 215,
        normalizedWpm: 152,
        emotion: 'Stern Urgency',
        timestamp: '00:05',
      },
      {
        id: '2',
        speaker: 'agent',
        speakerName: 'Klara S.',
        role: 'SRE Lead',
        rawText: "Hans, the keep-alive timeout on the ingress load balancer was reset during maintenance. I have patched the ingress manifest to thirty seconds and broker sessions have stabilized.",
        normalizedText: "Hans, the keep-alive timeout on the ingress load balancer was reset during maintenance. I have patched the ingress manifest to thirty seconds and broker sessions have stabilized.",
        originalWpm: 190,
        normalizedWpm: 150,
        emotion: 'Engineered Precision',
        timestamp: '00:22',
      },
    ],
  },
};

export const PbxCallSimulator: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<string>('English');
  const [echoFlowEnabled, setEchoFlowEnabled] = useState<boolean>(true);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Live Voice Recording State in PBX Simulator
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordSeconds, setRecordSeconds] = useState<number>(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordedRawText, setRecordedRawText] = useState<string>('');
  const [convertedText, setConvertedText] = useState<string>('');
  const [convertedAudioUrl, setConvertedAudioUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [injectedCustomerTurn, setInjectedCustomerTurn] = useState<CallMessage | null>(null);
  const [simultaneousPlaying, setSimultaneousPlaying] = useState<boolean>(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<number | null>(null);
  const liveStreamRef = useRef<MediaStream | null>(null);
  const rawAudioRef = useRef<HTMLAudioElement | null>(null);
  const convertedAudioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const dialogue = CALL_DIALOGUES[selectedLang] || CALL_DIALOGUES['English'];

  const playSpeech = (text: string, wpm: number) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = Math.min(1.4, Math.max(0.75, wpm / 150));
    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  const handlePlayMessage = (msg: CallMessage) => {
    setActiveMessageId(msg.id);
    const textToSpeak = echoFlowEnabled ? msg.normalizedText : msg.rawText;
    const wpm = echoFlowEnabled ? msg.normalizedWpm : msg.originalWpm;
    playSpeech(textToSpeak, wpm);
  };

  const handleStopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsPlayingAudio(false);
    setActiveMessageId(null);
  };

  // Convert raw recorded text into 150 WPM normalized speech (Uses EXACT user text)
  const convertRecordedSpeech = async (rawText: string) => {
    const text = rawText.trim();
    if (!text) return;

    setIsConverting(true);
    try {
      const res = await fetch('/api/normalize-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text,
          language: selectedLang,
          originalWpm: 228,
          targetWpm: 150,
          scenario: 'pbx_customer_call',
        }),
      });
      const data = await res.json();
      const cleaned =
        data.normalizedText ||
        data.cleanedTranscript ||
        text.replace(/\b(uh|um|like|so|ante|arre|vandhu|appo)\b/gi, '').trim();

      setConvertedText(cleaned);

      if (data.audioBase64) {
        const binary = atob(data.audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const blob = new Blob([bytes], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setConvertedAudioUrl(url);
      }

      // Prepare custom call turn with EXACT user input
      const customMsg: CallMessage = {
        id: `custom_turn_${Date.now()}`,
        speaker: 'customer',
        speakerName: 'You (Live Speech Input)',
        role: 'Enterprise Incident Caller',
        rawText: text,
        normalizedText: cleaned,
        originalWpm: 228,
        normalizedWpm: 150,
        emotion: 'Urgent Problem Escalation',
        timestamp: '00:02',
      };
      setInjectedCustomerTurn(customMsg);
    } catch (err) {
      console.warn('Error normalizing recorded speech:', err);
      const fallbackCleaned = text.replace(/\b(uh|um|like|so|ante|arre)\b/gi, '').trim();
      setConvertedText(fallbackCleaned);
    } finally {
      setIsConverting(false);
    }
  };

  // 1. Hardware Mic Recording
  const handleStartRecording = async () => {
    handleStopSpeech();
    setRecordedAudioUrl(null);
    setConvertedAudioUrl(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      liveStreamRef.current = stream;

      // Start Speech Recognition if supported
      const SpeechRec = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      if (SpeechRec) {
        try {
          const rec = new SpeechRec();
          rec.continuous = true;
          rec.interimResults = true;
          rec.lang =
            selectedLang === 'French'
              ? 'fr-FR'
              : selectedLang === 'German'
              ? 'de-DE'
              : selectedLang === 'Hindi'
              ? 'hi-IN'
              : 'en-US';
          rec.onresult = (e: any) => {
            let chunk = '';
            for (let i = e.resultIndex; i < e.results.length; ++i) {
              chunk += e.results[i][0].transcript + ' ';
            }
            if (chunk.trim()) {
              setRecordedRawText((prev) => (prev ? `${prev} ${chunk.trim()}` : chunk.trim()));
            }
          };
          rec.start();
          recognitionRef.current = rec;
        } catch (e) {}
      }

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);

        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch (e) {}
        }

        const raw = recordedRawText.trim();
        if (raw) {
          convertRecordedSpeech(raw);
        }

        if (liveStreamRef.current) {
          liveStreamRef.current.getTracks().forEach((t) => t.stop());
        }
      };

      recorder.start(100);
      setIsRecording(true);
      setRecordSeconds(0);
      recordTimerRef.current = window.setInterval(() => {
        setRecordSeconds((p) => p + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone error, falling back to simulated recording:', err);
      handleStartSimulatedRecording();
    }
  };

  // 2. Simulated Instant Recording Fallback (No Mic Needed)
  const handleStartSimulatedRecording = () => {
    handleStopSpeech();
    setIsRecording(true);
    setRecordSeconds(0);
    setRecordedAudioUrl(null);
    setConvertedAudioUrl(null);

    // If user already typed custom text, use it! Only set default if completely empty.
    const textToUse =
      recordedRawText.trim() ||
      "Look, um, our team is seeing sudden latency spikes during batch ingestion, like, we need an urgent escalation right now!";
    setRecordedRawText(textToUse);

    // Create synthetic oscillator audio
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const audioCtx = new AudioContextClass();
    const dest = audioCtx.createMediaStreamDestination();
    const osc = audioCtx.createOscillator();
    osc.frequency.setValueAtTime(260, audioCtx.currentTime);
    osc.connect(dest);
    osc.start();

    const recorder = new MediaRecorder(dest.stream);
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      osc.stop();
      audioCtx.close();
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      setRecordedAudioUrl(url);
      convertRecordedSpeech(textToUse);
    };

    recorder.start(100);

    const timer = window.setInterval(() => {
      setRecordSeconds((p) => {
        if (p >= 3) {
          clearInterval(timer);
          if (recorder.state !== 'inactive') recorder.stop();
          setIsRecording(false);
          return 3;
        }
        return p + 1;
      });
    }, 1000);
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    }
  };

  const handlePlayRawAudio = () => {
    handleStopSpeech();
    if (rawAudioRef.current) {
      rawAudioRef.current.currentTime = 0;
      rawAudioRef.current.play().catch(() => {});
    } else {
      playSpeech(recordedRawText, 228);
    }
  };

  const handlePlayConvertedAudio = () => {
    handleStopSpeech();
    if (convertedAudioUrl && convertedAudioRef.current) {
      convertedAudioRef.current.currentTime = 0;
      convertedAudioRef.current.play().catch(() => {});
    } else {
      playSpeech(convertedText || recordedRawText.replace(/\b(uh|um|like|so|ante|arre)\b/gi, ''), 150);
    }
  };

  // Simultaneous A/B Channel Test: Plays Raw Audio in left channel / sequence, then Converted Audio
  const handleSimultaneousA_BTest = () => {
    handleStopSpeech();
    setSimultaneousPlaying(true);
    handlePlayRawAudio();

    // After 2.5s, switch to converted audio to demonstrate instant real-time normalization
    setTimeout(() => {
      handlePlayConvertedAudio();
      setTimeout(() => setSimultaneousPlaying(false), 3500);
    }, 2500);
  };

  const highlightFillers = (text: string) => {
    if (!text) return text;
    const fillers = ['uh', 'um', 'like', 'so', 'ante', 'arre', 'vandhu', 'appo', 'euh', 'ähm'];
    const parts = text.split(new RegExp(`\\b(${fillers.join('|')})\\b`, 'gi'));
    return parts.map((part, i) => {
      if (fillers.includes(part.toLowerCase())) {
        return (
          <span
            key={i}
            className="bg-rose-950 text-rose-300 font-bold px-1 py-0.5 rounded border border-rose-800"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <PhoneCall className="w-5 h-5 text-blue-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Interactive Dual-Speaker PBX Simulator
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Live Enterprise Call Pacing & Sentiment Relay
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Experience how EchoFlow eliminates conversational friction between global enterprise
              callers and support engineers. Toggle EchoFlow ON/OFF in real time on either speaker's channel!
            </p>
          </div>

          {/* Master EchoFlow Toggle */}
          <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-300 pl-2">EchoFlow Relay:</span>
            <button
              onClick={() => {
                setEchoFlowEnabled(!echoFlowEnabled);
                handleStopSpeech();
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-md ${
                echoFlowEnabled
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-cyan-500/20'
                  : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{echoFlowEnabled ? 'ECHOFLOW ACTIVE (150 WPM)' : 'BYPASS / RAW SPEECH'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Language Switcher Bar (The 6 requested languages) */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-slate-400 mr-1">Select Language Dialogue:</span>
        {['English', 'French', 'German', 'Telugu', 'Tamil', 'Hindi'].map((lang) => {
          const isSelected = selectedLang === lang;
          return (
            <button
              key={lang}
              onClick={() => {
                setSelectedLang(lang);
                handleStopSpeech();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <span>{lang}</span>
            </button>
          );
        })}
      </div>

      {/* Live Voice Recording in PBX Simulator */}
      <div className="bg-slate-900/90 border border-indigo-500/40 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-rose-400" />
                Record Live Customer Speech & Test EchoFlow Conversion
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Speak into your microphone with natural pacing and filler words. EchoFlow will show your raw audio, transcribed text, convert it to 150 WPM, and let you test simultaneously in the call!
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isRecording ? (
              <>
                <button
                  onClick={handleStartRecording}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-md shadow-rose-600/30 active:scale-95"
                >
                  <Mic className="w-4 h-4" />
                  <span>Record Live Speech</span>
                </button>
                <button
                  onClick={handleStartSimulatedRecording}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-all active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Simulate Quick Voice Clip</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleStopRecording}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs transition-all shadow-lg active:scale-95 animate-pulse"
              >
                <Square className="w-3.5 h-3.5 fill-current text-rose-600" />
                <span>Stop & Convert ({recordSeconds}s)</span>
              </button>
            )}
          </div>
        </div>

        {/* User Interactive Speech Input Box */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <span>Your Speech Input / Transcript (Speak via Mic OR Type Below):</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {recordedRawText.trim()
                ? `${recordedRawText.trim().split(/\s+/).length} words`
                : 'Type or speak to input'}
            </span>
          </div>

          <textarea
            value={recordedRawText}
            onChange={(e) => setRecordedRawText(e.target.value)}
            placeholder="Type or paste your exact customer message here, or click 'Record Live Speech' above to speak..."
            rows={2}
            className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs text-white placeholder:text-slate-500 font-mono leading-relaxed"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="text-[11px] text-slate-400">
              ✍️ Whatever you type or say is processed verbatim—EchoFlow normalizes YOUR exact words.
            </div>

            <button
              onClick={() => convertRecordedSpeech(recordedRawText)}
              disabled={isConverting || !recordedRawText.trim()}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition-all shadow-md flex items-center gap-1.5 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>{isConverting ? 'Normalizing Your Input...' : 'Normalize My Input to 150 WPM'}</span>
            </button>
          </div>
        </div>

        {/* Show Live Recording & Conversion Results */}
        {recordedAudioUrl && (
          <div className="space-y-4 pt-1 animate-in fade-in-50 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. Raw Audio & Text */}
              <div className="p-4 rounded-xl bg-slate-950 border border-rose-900/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    1. Raw Caller Audio (Erratic 225 WPM)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                    UNPROCESSED SPEECH
                  </span>
                </div>

                <audio ref={rawAudioRef} src={recordedAudioUrl} controls className="w-full h-8" />

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="text-[10px] font-mono text-slate-500">RAW TRANSCRIBED TEXT:</div>
                  <div className="text-slate-100 italic leading-relaxed">
                    "{highlightFillers(recordedRawText)}"
                  </div>
                </div>

                <button
                  onClick={handlePlayRawAudio}
                  className="w-full py-1.5 rounded-lg bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen Raw Audio</span>
                </button>
              </div>

              {/* 2. EchoFlow Converted Audio & Text */}
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-900/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    2. EchoFlow Converted (150 WPM Pacing)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                    {isConverting ? 'CONVERTING...' : 'NORMALIZED CALIBRATED'}
                  </span>
                </div>

                <audio ref={convertedAudioRef} src={convertedAudioUrl || undefined} controls className="w-full h-8" />

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="text-[10px] font-mono text-slate-500">ECHOFLOW NORMALIZED TEXT:</div>
                  <div className="text-cyan-200 font-medium leading-relaxed">
                    "{convertedText || 'Harmonized 150 WPM cadence with filler words suppressed.'}"
                  </div>
                </div>

                <button
                  onClick={handlePlayConvertedAudio}
                  className="w-full py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Listen EchoFlow (150 WPM)</span>
                </button>
              </div>
            </div>

            {/* Test Simultaneously & Injection Action Controls */}
            <div className="p-3 bg-slate-950 rounded-xl border border-indigo-900/50 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSimultaneousA_BTest}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>
                    {simultaneousPlaying ? 'Playing A/B Channel Test...' : 'Simultaneous A/B Channel Test (Raw ↔ Converted)'}
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">
                  {injectedCustomerTurn ? '✓ Injected as Turn #1 in PBX Call' : 'Inject this voice turn into Call Dialogue:'}
                </span>
                <button
                  onClick={() => {
                    if (injectedCustomerTurn) return;
                    const customMsg: CallMessage = {
                      id: `custom_turn_${Date.now()}`,
                      speaker: 'customer',
                      speakerName: 'You (Live Recording)',
                      role: 'Enterprise Incident Caller',
                      rawText: recordedRawText,
                      normalizedText: convertedText || recordedRawText,
                      originalWpm: 228,
                      normalizedWpm: 150,
                      emotion: 'Live Recorded Urgency',
                      timestamp: '00:02',
                    };
                    setInjectedCustomerTurn(customMsg);
                  }}
                  disabled={!!injectedCustomerTurn}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-md active:scale-95"
                >
                  {injectedCustomerTurn ? 'Turn Injected' : '📥 Inject into Dialogue'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Live Phone Call Conversation Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Call Dialogue Stream */}
        <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-slate-200 font-bold">LIVE PBX CALL SESSION</span>
              <span className="text-slate-500 font-mono">ID: call_live_7942</span>
            </div>
            <div className="text-slate-400 font-mono text-[11px]">
              Customer: <strong className="text-rose-400">{injectedCustomerTurn ? 'You (Live Voice)' : dialogue.customerName}</strong> ↔ Agent:{' '}
              <strong className="text-cyan-400">{dialogue.agentName}</strong>
            </div>
          </div>

          {/* Conversation Turns (Includes Injected Live User Recording if present) */}
          <div className="space-y-4">
            {injectedCustomerTurn && (
              <div className="p-4 rounded-2xl border bg-slate-950/90 border-indigo-500/60 mr-6 sm:mr-12 animate-in fade-in-50 duration-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-700">
                      <Mic className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <span className="text-xs font-bold text-indigo-300">
                      {injectedCustomerTurn.speakerName}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                      LIVE RECORDED CALL TURN
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500">{injectedCustomerTurn.timestamp}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        echoFlowEnabled
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}
                    >
                      {echoFlowEnabled
                        ? `${injectedCustomerTurn.normalizedWpm} WPM (EchoFlow)`
                        : `${injectedCustomerTurn.originalWpm} WPM (Raw)`}
                    </span>
                  </div>
                </div>

                <div className="text-xs sm:text-sm leading-relaxed mb-3">
                  {echoFlowEnabled ? (
                    <div className="text-cyan-100 font-medium">
                      "{injectedCustomerTurn.normalizedText}"
                    </div>
                  ) : (
                    <div className="text-slate-300 italic">
                      "{highlightFillers(injectedCustomerTurn.rawText)}"
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Emotion: <strong className="text-rose-400">{injectedCustomerTurn.emotion}</strong>
                  </span>

                  <button
                    onClick={() => {
                      if (echoFlowEnabled) handlePlayConvertedAudio();
                      else handlePlayRawAudio();
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      echoFlowEnabled
                        ? 'bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800'
                        : 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{echoFlowEnabled ? 'Play EchoFlow (150 WPM)' : 'Play Raw Erratic'}</span>
                  </button>
                </div>
              </div>
            )}
            {dialogue.messages.map((msg) => {
              const isCustomer = msg.speaker === 'customer';
              const isPlayingThis = isPlayingAudio && activeMessageId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCustomer
                      ? 'bg-slate-950/70 border-rose-950/80 mr-6 sm:mr-12'
                      : 'bg-cyan-950/20 border-cyan-950/80 ml-6 sm:ml-12'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isCustomer
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-800'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-800'
                        }`}
                      >
                        {isCustomer ? <User className="w-3.5 h-3.5" /> : <Headphones className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-xs font-bold text-slate-200">
                        {msg.speakerName} ({msg.role})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        {msg.timestamp}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          echoFlowEnabled
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {echoFlowEnabled
                          ? `${msg.normalizedWpm} WPM (Normalized)`
                          : `${msg.originalWpm} WPM (Raw Pacing)`}
                      </span>
                    </div>
                  </div>

                  {/* Message Body */}
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                    "{echoFlowEnabled ? msg.normalizedText : msg.rawText}"
                  </p>

                  {/* Play Speech Audio Action */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <button
                      onClick={() =>
                        isPlayingThis ? handleStopSpeech() : handlePlayMessage(msg)
                      }
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-[11px] transition-all ${
                        isPlayingThis
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      {isPlayingThis ? (
                        <>
                          <Square className="w-3 h-3 fill-current" />
                          <span>Stop Audio</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 fill-current" />
                          <span>
                            {echoFlowEnabled ? 'Play Normalized (150 WPM)' : 'Play Raw Erratic'}
                          </span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                      <span>Valence: <strong className="text-emerald-400">{msg.emotion}</strong></span>
                      <span className="text-slate-600">•</span>
                      <span>Pitch: <strong className="text-cyan-400">94.2% Preserved</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Automated Post-Call Intelligence Card (Feature #6) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Post-Call Intelligence Summary
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                REAL-TIME ASR
              </span>
            </div>

            {/* Sentiment Shift */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-[11px] text-slate-400 font-mono">CALL SENTIMENT TRAJECTORY</div>
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-rose-400 font-bold block">{dialogue.sentimentShift.before}</span>
                  <span className="text-[10px] text-slate-500 font-mono">Score: {dialogue.sentimentShift.beforeScore}%</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500" />
                <div className="text-right">
                  <span className="text-emerald-400 font-bold block">{dialogue.sentimentShift.after}</span>
                  <span className="text-[10px] text-slate-500 font-mono">Score: {dialogue.sentimentShift.afterScore}%</span>
                </div>
              </div>
            </div>

            {/* AHT & Friction Reduction */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-mono">LOOPS SAVED</span>
                <span className="text-emerald-400 font-bold font-mono text-base">
                  {echoFlowEnabled ? `${dialogue.loopsAvoided} Loops` : '0 Loops'}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Zero "repeat that" stalls</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-mono">AHT SAVED</span>
                <span className="text-cyan-400 font-bold font-mono text-base">
                  {echoFlowEnabled ? `${dialogue.secondsSaved}s` : '0s'}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Per-call time saved</span>
              </div>
            </div>

            {/* Key Action Items */}
            <div className="space-y-1.5 text-xs">
              <span className="text-[11px] font-mono text-slate-400 uppercase">
                Generated Action Items:
              </span>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Configuration patch deployed to client cluster in {dialogue.language} region.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Call recording archived with 100% intelligibility score.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
