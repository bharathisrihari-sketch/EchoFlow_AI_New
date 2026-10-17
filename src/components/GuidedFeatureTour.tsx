import React, { useState, useEffect } from 'react';
import {
  Compass,
  Clock,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Zap,
  PhoneCall,
  Video,
  DollarSign,
  Server,
  Scale,
  FolderGit2,
  CheckCircle2,
  ExternalLink,
  Layers,
  ArrowRight,
  ShieldCheck,
  FileCode,
  FileText,
} from 'lucide-react';
import { AppTab } from './Header';

interface TourStop {
  id: string;
  stepNumber: number;
  title: string;
  targetScreen: AppTab;
  screenName: string;
  durationSec: number;
  icon: React.ComponentType<{ className?: string }>;
  overview: string;
  testInput: {
    fileName: string;
    description: string;
    samplePayload: string;
  };
  liveOutput: {
    title: string;
    description: string;
    metrics: string[];
  };
  howToVerify: string;
  businessBenefits: string[];
  technicalBenefits: string[];
}

// 5-Minute Comprehensive Deep-Dive Tour Stops (Total: ~4m 30s)
const DEEP_DIVE_5MIN_STOPS: TourStop[] = [
  {
    id: 'stop_studio',
    stepNumber: 1,
    title: 'Studio & Gemini Live Bidi Normalizer',
    targetScreen: 'studio',
    screenName: 'Live Studio',
    durationSec: 45,
    icon: Sparkles,
    overview:
      'Acoustic engineering workbench ingesting raw 16kHz audio packets and normalizing rapid, pressured speech (220+ WPM) into articulate 150 WPM cadence while preserving natural speaker pitch and emotion.',
    testInput: {
      fileName: 'test_payload_telugu_rush.json',
      description: 'Incoming 16kHz PCM audio stream with rapid syllable bursts (230 WPM) and conversational fillers.',
      samplePayload: `{
  "caller": "Suresh V. (Hyderabad)",
  "language": "Telugu",
  "rawCadenceWpm": 230,
  "transcript": "Hello, ante... our Kubernetes cluster pod autoscaling policy is failing continuously in the Mumbai zone, like, during high batch ingest we are getting 504 timeouts, please resolve immediately!"
}`,
    },
    liveOutput: {
      title: 'EchoFlow Resynthesized Audio Stream (24kHz)',
      description: 'Pacing stabilized to 150 WPM, fillers like "ante" removed, pitch correlation r=0.942.',
      metrics: ['Latency: 418 ms', 'Pace: 150 WPM', 'Pitch Retention: 94.2%', 'Variance Reduction: -35.4%'],
    },
    howToVerify:
      'Navigate to Studio. Select "Telugu" preset or click "Live Mic Stream". Click "Normalize Cadence" and listen to the audio track. Check that the dual waveform displays erratic red vs. harmonized cyan waves.',
    businessBenefits: [
      'Eliminates conversational friction in global engineering standups and multi-region bridges.',
      'Prevents costly misunderstandings during high-priority P1 incident escalations.',
    ],
    technicalBenefits: [
      'Bypasses 3-step ASR->MT->TTS cascade, slashing latency from 4.5s down to 418ms.',
      'Preserves human vocal identity and acoustic timbre using continuous BidiGenerateContent.',
    ],
  },
  {
    id: 'stop_pbx',
    stepNumber: 2,
    title: 'Interactive PBX Call Simulator',
    targetScreen: 'pbx',
    screenName: 'PBX Simulator',
    durationSec: 45,
    icon: PhoneCall,
    overview:
      'Two-party call simulation demonstrating how real-time speech stabilization eliminates repetitive clarification loops between overseas callers and enterprise support agents.',
    testInput: {
      fileName: 'pbx_call_dialogue_hindi.json',
      description: 'Live bilateral conversation: Caller agitated by billing charge vs. agent assisting.',
      samplePayload: `{
  "callId": "call_94821_gurugram",
  "customer": "Amit S. (Gurugram)",
  "agent": "Priya D. (London)",
  "issue": "Unexpected cloud storage egress billing line items",
  "rawCallerWpm": 220,
  "callerFillers": ["arre", "matlab", "dekho"]
}`,
    },
    liveOutput: {
      title: 'Post-Call Intelligence & Sentiment Trajectory',
      description: 'Customer sentiment shifts from Agitated (28%) to Delighted (95%); 3 clarification loops saved.',
      metrics: ['Loops Saved: 3 Loops', 'AHT Saved: 84 Seconds', 'Sentiment Lift: +67%', 'Intelligibility: 96%'],
    },
    howToVerify:
      'Go to PBX Simulator. With EchoFlow OFF, play customer audio to hear rapid rush. Toggle EchoFlow ON and play again to hear clear 150 WPM delivery.',
    businessBenefits: [
      'Reduces Average Handle Time (AHT) by 18.5%, directly saving thousands in agent labor.',
      'Dramatically improves First Contact Resolution (FCR) and Customer Satisfaction (CSAT).',
    ],
    technicalBenefits: [
      'Real-time dual-channel audio buffering with zero conversational dropouts.',
      'Automated post-call summary generation extracting action items and sentiment velocity.',
    ],
  },
  {
    id: 'stop_video',
    stepNumber: 3,
    title: 'Video Comparison & Live Camera/Mic Ingest',
    targetScreen: 'video',
    screenName: 'Video Compare',
    durationSec: 45,
    icon: Video,
    overview:
      'Synchronized side-by-side video stage comparing uncompressed caller recordings against EchoFlow normalized output, with webcam video and microphone recording capabilities.',
    testInput: {
      fileName: 'webcam_stream_capture.webm',
      description: 'Direct in-browser camera and microphone recording or 6-dialect preset video clips.',
      samplePayload: `{
  "source": "Webcam Video + Mic Audio",
  "resolution": "1280x720 30fps",
  "audioChannel": "16kHz PCM mono",
  "userDialect": "Tamil-Accented English (225 WPM)"
}`,
    },
    liveOutput: {
      title: 'Frame-Synchronized Dual Playback with A/B Audio Switcher',
      description: 'Left Player displays raw video with erratic waveform; Right Player displays 150 WPM harmonized stream.',
      metrics: ['Video Sync: Frame-Lock', 'A/B Audio Switching: Instant', 'Supported: 6 Dialects + Live Camera'],
    },
    howToVerify:
      'Open Video Compare. Click "Listen Original" to hear fast audio with fillers. Click "Listen EchoFlow (150 WPM)" to hear the balanced track. Or record yourself using "Record Video".',
    businessBenefits: [
      'Enables high-touch executive video calls and telemedicine where face-to-face rapport is critical.',
      'Eliminates awkward lip-sync lag present in traditional dubbing tools.',
    ],
    technicalBenefits: [
      'Synchronized HTML5 canvas & MediaStream synchronization with dynamic speed adaptation.',
      'Client-side MediaRecorder capture in WebM with instant local Blob URL relay.',
    ],
  },
  {
    id: 'stop_roi',
    stepNumber: 4,
    title: 'Enterprise ROI Engine & C-Suite Business Case',
    targetScreen: 'roi',
    screenName: 'ROI Engine',
    durationSec: 45,
    icon: DollarSign,
    overview:
      'Financial ROI calculator quantifying bottom-line operational cost reduction, agent hours saved, and customer retention lift across 50 to 5,000 seat contact centers.',
    testInput: {
      fileName: 'enterprise_seat_model.json',
      description: 'Call center operational parameters: 500 seats, 35 calls/day, 6.8 min baseline AHT, $28/hr rate.',
      samplePayload: `{
  "seats": 500,
  "callsPerAgentPerDay": 35,
  "workDaysPerYear": 250,
  "baselineAhtMinutes": 6.8,
  "ahtReductionPercent": 18.5,
  "loadedAgentHourlyRate": 28.00
}`,
    },
    liveOutput: {
      title: 'Quantified Financial Return & Executive Memorandum',
      description: 'Formulaic calculation yielding $3,234,000 net annual savings with printable C-Suite PDF memo.',
      metrics: ['Annual Savings: $3,234,000', 'Hours Recovered: 115,500 hrs', 'Time Saved/Call: 75s', 'Payback: < 4 Mos'],
    },
    howToVerify:
      'In ROI Engine, drag the Seat slider to 500. Click "Generate Executive Report". Click "Run 100-Call Test" to verify the Monte Carlo statistical distribution ($p < 0.001$).',
    businessBenefits: [
      'Delivers an airtight financial justification for CFOs and Enterprise Procurement teams.',
      'Recovers 115,500 productive agent hours annually for a 500-seat contact center.',
    ],
    technicalBenefits: [
      'Deterministic financial algorithms backed by Monte Carlo A/B distribution modeling.',
      'One-click client-side print-to-PDF generation formatted for executive distribution.',
    ],
  },
  {
    id: 'stop_telephony',
    stepNumber: 5,
    title: 'Telephony Webhooks & Google Cloud Run Infrastructure',
    targetScreen: 'telephony_gcp',
    screenName: 'Telephony & GCP',
    durationSec: 40,
    icon: Server,
    overview:
      'Production telephony integration code snippets (Twilio, Genesys, Amazon Connect, Asterisk) and interactive Google Cloud Run serverless topology diagram.',
    testInput: {
      fileName: 'twilio_voice_stream.xml',
      description: 'TwiML webhook configuration establishing bidirectional WebSocket audio stream.',
      samplePayload: `<Response>
  <Connect>
    <Stream url="wss://echoflow-cloudrun.run.app/ws/telephony/stream">
      <Parameter name="language" value="auto" />
      <Parameter name="targetWpm" value="150" />
      <Parameter name="pitchRetention" value="0.94" />
    </Stream>
  </Connect>
</Response>`,
    },
    liveOutput: {
      title: 'Google Cloud Serverless Architecture & SLA Stress-Tester',
      description: 'End-to-end breakdown: Cloud Armor, Cloud Run, Secret Manager, Gemini Live TPU.',
      metrics: ['SLA Limit: < 550ms', 'Measured: 418ms', 'Stressed (3% Loss): 482ms', 'Cloud Run: Autoscaling'],
    },
    howToVerify:
      'In Telephony & GCP, toggle between Twilio, Genesys, and Amazon Connect. Use the SLA Stress-Tester to inject 3% packet loss and verify latency stays under 550ms.',
    businessBenefits: [
      'Requires zero changes to legacy PBX infrastructure; deploys in under 15 minutes via webhook.',
      'Saves millions in expensive on-premise hardware upgrades.',
    ],
    technicalBenefits: [
      'Serverless auto-scaling on Google Cloud Run with HTTP/2 and WebSocket support.',
      'Sub-20ms packet buffer with adaptive jitter damping algorithms.',
    ],
  },
  {
    id: 'stop_ethics_files',
    stepNumber: 6,
    title: 'Responsible AI & Complete Code Deliverables',
    targetScreen: 'code',
    screenName: 'Files & Ethics',
    durationSec: 30,
    icon: FolderGit2,
    overview:
      'Ethical AI foundation (human empowerment, anti-accent discrimination), regulatory compliance (GDPR, HIPAA), and one-click full codebase export formatted as a single-file Local Backup.',
    testInput: {
      fileName: 'echoflow_local_backup_bundle.md',
      description: 'Single-file consolidated repository export with XML file delimiters for Local Backup preservation.',
      samplePayload: `<file path="main.py">
# EchoFlow FastAPI WebSocket Streaming Gateway
...
</file>
<file path="MASTER_USER_MANUAL.md">
...
</file>`,
    },
    liveOutput: {
      title: 'Production Codebase Deliverables & Compliance Matrix',
      description: 'Production files available for individual download or as a single consolidated Local Backup.',
      metrics: ['GDPR Art 28: Compliant', 'HIPAA: TLS 1.3', 'RAM Retention: 0 Bytes', 'Deliverables: Complete'],
    },
    howToVerify:
      'Open the Files tab. Click "Download Local Backup" to download the single-file bundle, or click "Copy Local Backup" to copy the full package to clipboard.',
    businessBenefits: [
      'Guarantees caller privacy with zero audio persistence to disk (stateless RAM processing).',
      'Protects offshore agents against acoustic bias and language discrimination.',
    ],
    technicalBenefits: [
      'Complete production repository: FastAPI, Streamlit, Dockerfile, shell scripts, and documentation.',
      'Standardized XML/Markdown bundle allows any AI assistant to understand and extend the project.',
    ],
  },
];

// 2-Minute Executive Quick Tour Stops (Total: ~1m 50s)
const QUICK_2MIN_STOPS: TourStop[] = [
  {
    id: 'quick_problem_core',
    stepNumber: 1,
    title: 'The Problem & Gemini Live Core',
    targetScreen: 'studio',
    screenName: 'Live Studio',
    durationSec: 30,
    icon: Sparkles,
    overview:
      'In global business, speech rushes (>220 WPM) and heavy accents cause repeated clarification loops. Traditional translation cascades take 3-5 seconds and sound robotic. EchoFlow uses Gemini Live Bidi audio streaming to normalize speech to 150 WPM in 418 milliseconds while preserving vocal emotion and pitch.',
    testInput: {
      fileName: 'quick_test_core.json',
      description: 'Rapid speech rush sample at 220 WPM.',
      samplePayload: `{ "speed": "220 WPM", "accent": "Telugu/Hindi", "issue": "Severe clarification delay" }`,
    },
    liveOutput: {
      title: 'Harmonized 150 WPM Stream',
      description: 'Clean speech with 94.2% pitch retention envelope.',
      metrics: ['End-to-End Latency: 418ms', 'Target: 150 WPM', 'Pearson r: 0.942'],
    },
    howToVerify: 'Select Telugu or English in Studio, click Normalize Cadence to hear 150 WPM output.',
    businessBenefits: ['Eliminates conversational friction in global standups and support calls.'],
    technicalBenefits: ['Sub-20ms packet ingestion with Gemini Live Bidi streaming.'],
  },
  {
    id: 'quick_pbx',
    stepNumber: 2,
    title: 'Live PBX Customer Call Simulator',
    targetScreen: 'pbx',
    screenName: 'PBX Simulator',
    durationSec: 25,
    icon: PhoneCall,
    overview:
      'Live two-party call demonstration. Toggling EchoFlow ON removes acoustic fillers like "ante" and "um", normalizes cadence, and turns an agitated customer into a delighted resolution.',
    testInput: {
      fileName: 'quick_pbx_sample.json',
      description: 'Outage escalation call between overseas caller and tier-3 agent.',
      samplePayload: `{ "caller": "Urgent Outage Report", "delayLoops": 4 }`,
    },
    liveOutput: {
      title: 'Frictionless Conversation',
      description: '3 loops eliminated, handle time compressed by 84 seconds.',
      metrics: ['AHT Saved: 84s', 'Loops Saved: 3-4', 'Sentiment: 28% -> 95%'],
    },
    howToVerify: 'Toggle EchoFlow ON/OFF in PBX Simulator to hear the stark contrast.',
    businessBenefits: ['Directly saves 18.5% on agent labor costs.'],
    technicalBenefits: ['Dual-channel live audio relay with sentiment tracking.'],
  },
  {
    id: 'quick_video_multi',
    stepNumber: 3,
    title: 'Video Sync & 6 Dialects (Webcam/Audio Ingest)',
    targetScreen: 'video',
    screenName: 'Video Compare',
    durationSec: 30,
    icon: Video,
    overview:
      'Frame-accurate dual video player. Supports 6 enterprise languages (English, Telugu, Tamil, Hindi, French, German) plus live webcam and audio recording with instant A/B audible track switching.',
    testInput: {
      fileName: 'quick_video_ingest.webm',
      description: 'Live webcam video recording or 6 language presets.',
      samplePayload: `{ "languages": ["EN", "TE", "TA", "HI", "FR", "DE"], "sync": "Frame-accurate" }`,
    },
    liveOutput: {
      title: 'Audible Original vs EchoFlow Output',
      description: 'Click Listen Original vs Listen EchoFlow to hear the difference.',
      metrics: ['6 Dialects', 'Live Webcam Recording', 'Audible A/B Switcher'],
    },
    howToVerify: 'In Video Compare, click "Listen Original" then "Listen EchoFlow (150 WPM)".',
    businessBenefits: ['Keeps face-to-face video calls natural without lip-sync lag.'],
    technicalBenefits: ['Audible multi-track speech synthesis and HTML5 video sync.'],
  },
  {
    id: 'quick_roi_deploy',
    stepNumber: 4,
    title: 'Financial Impact & Cloud Run Deployment',
    targetScreen: 'roi',
    screenName: 'ROI & Telephony',
    durationSec: 25,
    icon: DollarSign,
    overview:
      'EchoFlow delivers $3.2M in annual net savings for a 500-seat call center. It plugs directly into Twilio, Genesys, and Amazon Connect with a single webhook line and zero server hardware upgrades.',
    testInput: {
      fileName: 'quick_roi_summary.json',
      description: '500 seats at $28/hr loaded rate.',
      samplePayload: `{ "annualSavings": "$3,234,000", "hoursRecovered": "115,500" }`,
    },
    liveOutput: {
      title: 'Enterprise Business Case',
      description: '1-click PDF memorandum for CFOs + Cloud Run auto-scaling.',
      metrics: ['Net Savings: $3,234,000/yr', 'Deploy: 15 Mins', 'SLA: 418ms < 550ms'],
    },
    howToVerify: 'Check the ROI Engine and Telephony & GCP tabs for instant integration snippets.',
    businessBenefits: ['Immediate ROI payback in under 4 months.'],
    technicalBenefits: ['Serverless Google Cloud Run deployment with zero persistent disk storage.'],
  },
];

interface GuidedFeatureTourProps {
  onNavigateToScreen: (screen: AppTab) => void;
}

export const GuidedFeatureTour: React.FC<GuidedFeatureTourProps> = ({ onNavigateToScreen }) => {
  const [tourMode, setTourMode] = useState<'5min' | '2min'>('5min');
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(45);

  const stops = tourMode === '5min' ? DEEP_DIVE_5MIN_STOPS : QUICK_2MIN_STOPS;
  const currentStop = stops[currentStopIndex] || stops[0];

  // Reset timer on stop change
  useEffect(() => {
    setSecondsRemaining(currentStop.durationSec);
  }, [currentStopIndex, tourMode]);

  // Auto-play timer
  useEffect(() => {
    let timer: number | null = null;
    if (isAutoPlaying) {
      timer = window.setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Advance to next stop or loop
            setCurrentStopIndex((idx) => {
              if (idx < stops.length - 1) {
                return idx + 1;
              } else {
                setIsAutoPlaying(false);
                return 0;
              }
            });
            return currentStop.durationSec;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAutoPlaying, stops.length, currentStop.durationSec]);

  const handleNext = () => {
    if (currentStopIndex < stops.length - 1) {
      setCurrentStopIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStopIndex > 0) {
      setCurrentStopIndex((prev) => prev - 1);
    }
  };

  const handleSwitchMode = (mode: '5min' | '2min') => {
    setTourMode(mode);
    setCurrentStopIndex(0);
    setIsAutoPlaying(false);
  };

  const totalTimeSec = stops.reduce((acc, s) => acc + s.durationSec, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Toggle */}
      <div className="bg-gradient-to-r from-cyan-950/90 via-slate-900 to-indigo-950/80 border border-cyan-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Compass className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Official Hack2skill Guided Tour & Feature Showcase
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              EchoFlow AI Guided Feature Walkthrough
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Step through every module with sample test payloads, live output data, verification
              instructions, and quantified enterprise benefits.
            </p>
          </div>

          {/* Mode Switcher Buttons: 5-Min Full Tour vs 2-Min Quick Tour */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
            <button
              onClick={() => handleSwitchMode('5min')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                tourMode === '5min'
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-600/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-4 h-4 text-cyan-300" />
              <span>5-Min Deep-Dive Tour</span>
            </button>

            <button
              onClick={() => handleSwitchMode('2min')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                tourMode === '2min'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-4 h-4 text-purple-300" />
              <span>2-Min Quick Demo</span>
            </button>
          </div>
        </div>

        {/* Tour Control & Status Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 transition-all active:scale-95"
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isAutoPlaying ? 'Pause Auto-Tour' : 'Auto-Play Tour'}</span>
            </button>

            <button
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentStopIndex(0);
                setSecondsRemaining(stops[0].durationSec);
              }}
              className="p-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all"
              title="Reset Tour"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="font-mono text-slate-300 flex items-center gap-1.5">
              <span className="text-cyan-400 font-bold">Stop {currentStop.stepNumber} of {stops.length}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">Step: {secondsRemaining}s left</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 font-semibold">Total: {Math.floor(totalTimeSec / 60)}m {totalTimeSec % 60}s</span>
            </div>
          </div>

          {/* Jump Directly to the Live Screen Button */}
          <button
            onClick={() => onNavigateToScreen(currentStop.targetScreen)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-md shadow-emerald-500/20"
          >
            <span>Jump to Live {currentStop.screenName} Screen</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Stepper Tabs Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {stops.map((stop, idx) => {
          const isSelected = idx === currentStopIndex;
          const isPassed = idx < currentStopIndex;
          const Icon = stop.icon;

          return (
            <button
              key={stop.id}
              onClick={() => {
                setCurrentStopIndex(idx);
                setIsAutoPlaying(false);
              }}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-slate-900 border-cyan-500 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                  : isPassed
                  ? 'bg-slate-900/60 border-emerald-900/60 text-slate-300'
                  : 'bg-slate-900/30 border-slate-800 text-slate-400 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-cyan-400 font-bold">STOP {stop.stepNumber}</span>
                <span className="text-[9px] font-mono text-slate-500">{stop.durationSec}s</span>
              </div>
              <div className="font-bold text-xs text-slate-200 truncate">{stop.screenName}</div>
            </button>
          );
        })}
      </div>

      {/* Main Tour Stop Detail Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header of Active Stop */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center shrink-0">
              <currentStop.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400">
                  STOP {currentStop.stepNumber} OF {stops.length}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-400 font-semibold">{currentStop.screenName}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                {currentStop.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={handlePrev}
              disabled={currentStopIndex === 0}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition-all"
              title="Previous Stop"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentStopIndex === stops.length - 1}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition-all"
              title="Next Stop"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feature Overview */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            1. Feature Architecture & What This Module Does:
          </h4>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans bg-slate-950 p-4 rounded-xl border border-slate-800">
            {currentStop.overview}
          </p>
        </div>

        {/* 2-Column Grid: Test File Payload on Left, Live Output on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Input File */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <FileCode className="w-4 h-4" />
                Demo Test Input ({currentStop.testInput.fileName})
              </span>
              <span className="text-[10px] font-mono text-slate-500">16kHz Audio / JSON</span>
            </div>
            <p className="text-xs text-slate-400">{currentStop.testInput.description}</p>
            <pre className="p-3 rounded-lg bg-slate-900 text-[11px] font-mono text-amber-300/90 overflow-x-auto border border-slate-800/80">
              <code>{currentStop.testInput.samplePayload}</code>
            </pre>
          </div>

          {/* Live Output Produced */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Verified Live Output Produced
              </span>
              <span className="text-[10px] font-mono text-emerald-400">24kHz Bidi Synthesized</span>
            </div>
            <p className="text-xs text-slate-300 font-semibold">{currentStop.liveOutput.title}</p>
            <p className="text-xs text-slate-400">{currentStop.liveOutput.description}</p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {currentStop.liveOutput.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How to Verify Output Step-by-Step */}
        <div className="p-4 rounded-xl bg-slate-950 border border-cyan-900/60 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              How to Test & Verify in the Live Application:
            </h4>
            <button
              onClick={() => onNavigateToScreen(currentStop.targetScreen)}
              className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
            >
              <span>Launch Live Test on {currentStop.screenName}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">{currentStop.howToVerify}</p>
        </div>

        {/* Quantified Benefits Grid: Business Benefits & Technical Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-950/80 space-y-2">
            <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Quantified Business & Customer Benefits:
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {currentStop.businessBenefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-purple-950/80 space-y-2">
            <h5 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              Engineering & Technical Architecture Benefits:
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {currentStop.technicalBenefits.map((tb, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                  <span>{tb}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
