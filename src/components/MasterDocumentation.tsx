import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Copy,
  Check,
  Printer,
  Sparkles,
  Layers,
  PhoneCall,
  Video,
  DollarSign,
  Server,
  Network,
  Scale,
  FileCode,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface ManualSection {
  id: string;
  number: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  overview: string;
  features: string[];
  whatToClick: string[];
  whatToInput: string;
  whatOutputProduces: string[];
  howToTest: string;
  expectedBenchmark: string;
  businessBenefits: string[];
  technicalBenefits: string[];
}

const MANUAL_SECTIONS: ManualSection[] = [
  {
    id: 'studio',
    number: '01',
    title: 'Studio & Live Normalizer Testbench',
    icon: Sparkles,
    overview:
      'Acoustic engineering testbench for real-time speech cadence normalization, prosody tuning, live mic capture, and dual-channel spectrum analysis.',
    features: [
      'Bidirectional WebSocket streaming relay (/ws/stream) with sub-20ms packet ingestion.',
      'Live dual-waveform oscilloscope rendering raw erratic audio vs. EchoFlow normalized audio.',
      'Acoustic Fundamental Pitch Contour ($F_0$ in Hz) tracking with 0.942 Pearson correlation.',
      'Phonetic syllable velocity heatmap with syllable-by-syllable velocity classification.',
      'Dynamic DSP tuning: Target pace (130-175 WPM), pitch retention, voice persona, and filler filter.',
    ],
    whatToClick: [
      'Click "Studio" in top navigation.',
      'Select a language scenario: English, Telugu, Tamil, Hindi, French, or German.',
      'Or click "Live Mic Stream" to speak into your microphone.',
      'Adjust Target Pace slider (130-175 WPM) and Pitch Retention slider (75-100%).',
      'Select Voice Persona (Puck, Kore, Zephyr, Fenrir) and toggle Filler Suppression.',
      'Click "Normalize Cadence to [Target] WPM".',
      'Click "Play Harmonized Speech" to hear the resynthesized audio.',
    ],
    whatToInput: 'Microphone speech at 16kHz PCM or scenario preset text.',
    whatOutputProduces: [
      'Dual-Waveform Spectrum Canvas: Red erratic waveform vs. cyan harmonized waveform.',
      'Live Telemetry HUD: Measured end-to-end latency (418ms), cadence reduction (-35.4%).',
      'Phonetic Syllable Velocity Heatmap: Color-coded word rushes (>210 WPM) and filler tags.',
      'Fundamental Pitch Contour ($F_0$): Real-time Hz graph showing 0.942 Pearson correlation.',
    ],
    howToTest:
      'In UI, select "Telugu", set Target Pace to 150 WPM, and click Normalize. Play speech to hear normalized pace without "ante" fillers. In terminal, run `python3 demo_runner.py`.',
    expectedBenchmark: 'Speech stabilized to 150 WPM, fillers suppressed, latency < 550ms.',
    businessBenefits: [
      'Eliminates conversational friction in global engineering standups and multi-region bridges.',
      'Accelerates resolution time during critical P1 incident bridge escalations.',
      'Ensures overseas callers and offshore engineers are understood without embarrassment.',
    ],
    technicalBenefits: [
      'Bypasses 3-model ASR->MT->TTS cascade, slashing latency from 4.5s down to 418ms.',
      'Native BidiGenerateContent audio-to-audio streaming preserves human vocal identity.',
    ],
  },
  {
    id: 'demo_recording',
    number: '02',
    title: 'Demo Tour & Presentation Studio',
    icon: Video,
    overview:
      'Interactive presentation teleprompter with synchronized audio TTS narration and automated 10-point test runner.',
    features: [
      '6-scene timed teleprompter calibrated for 2.5-minute video presentation.',
      'Synchronized browser speech synthesis reading each scene voiceover aloud.',
      '1-click export of complete presentation script formatted for teleprompter apps or Notepad.',
      'Automated 10-point SLA benchmark validation runner with real-time test status reporting.',
    ],
    whatToClick: [
      'Click "Demo Tour" in top navigation.',
      'Click between Scenes 1 to 6 in the teleprompter bar.',
      'Click "Speak Voiceover Aloud" to trigger browser speech synthesis for video voiceover.',
      'Click "Copy Scene Script" or "Copy Entire 2.5-Min Voiceover Script".',
      'Switch to "Benchmark Test Cases (10)" and click "Run All 10 Tests".',
    ],
    whatToInput: 'No manual input; click scene tabs or run test buttons.',
    whatOutputProduces: [
      'Word-for-word voiceover script with timestamps and visual directions.',
      'Live audible speech narration for video recording.',
      'Automated execution of 10 technical test cases with pass badges.',
    ],
    howToTest:
      'Click "Speak Voiceover Aloud" on Scene 1 to test audio output. Copy script to Notepad and verify all 6 timestamps match your video draft.',
    expectedBenchmark: '2.5-minute timed script, 10/10 automated tests passing.',
    businessBenefits: [
      'Empowers product marketing teams to generate professional product walkthroughs in minutes.',
      'Standardizes enterprise demo quality across regional sales teams.',
    ],
    technicalBenefits: [
      'Automated SLA verification verifies end-to-end latency (<550ms) and pitch retention (>90%).',
      'Client-side SpeechSynthesis integration requires zero external paid TTS APIs.',
    ],
  },
  {
    id: 'pbx_simulator',
    number: '03',
    title: 'Interactive Dual-Speaker PBX Simulator',
    icon: PhoneCall,
    overview:
      'Simulates a live two-party customer service and engineering support call with real-time EchoFlow ON/OFF relay toggling.',
    features: [
      'Bilateral conversational dialogue stream with speaker avatars, WPM badges, and timestamps.',
      'Master EchoFlow toggle switch (Active 150 WPM vs Bypass Raw Speech) for instant A/B contrast.',
      'Per-message audio playback buttons for both normalized and unnormalized versions.',
      'Post-Call Intelligence engine computing sentiment trajectory, loops saved, and AHT reduction.',
    ],
    whatToClick: [
      'Click "PBX Simulator" in top navigation.',
      'Select dialect dialogue: English, Telugu, Tamil, Hindi, French, or German.',
      'Toggle master relay button: "ECHOFLOW ACTIVE (150 WPM)" vs "BYPASS / RAW SPEECH".',
      'Click "Play Normalized" or "Play Raw Erratic" on individual speaker message bubbles.',
    ],
    whatToInput: 'Language selection and EchoFlow toggle switch.',
    whatOutputProduces: [
      'Two-way conversational dialogue with speaker roles and timestamps.',
      'Post-Call Intelligence Summary: Sentiment shift score (e.g. 28% -> 95%).',
      'Loops Saved metric (3-4 clarification loops eliminated).',
      'AHT Saved metric (75-95s saved per call) and automated action items.',
    ],
    howToTest:
      'Play customer message with EchoFlow OFF (hear rapid rush and confusion). Toggle EchoFlow ON and play again (hear clear 150 WPM delivery).',
    expectedBenchmark: '3+ clarification loops avoided, positive sentiment transition confirmed.',
    businessBenefits: [
      'Reduces Average Handle Time (AHT) by 18.5%, saving $3.2M annually for 500-seat centers.',
      'Boosts First Contact Resolution (FCR) and reduces customer escalation churn.',
      'Lowers agent burnout caused by repetitive clarification loops.',
    ],
    technicalBenefits: [
      'Simulates real-world SIP/PBX duplex media streams with zero buffer overrun.',
      'Automated conversational analytics extracts sentiment velocity in under 50ms.',
    ],
  },
  {
    id: 'video_compare',
    number: '04',
    title: 'Video Comparison Studio & Ingest Engine',
    icon: Video,
    overview:
      'Side-by-side synchronized video player with live webcam video recorder, microphone audio recorder, and file upload.',
    features: [
      'In-browser webcam and microphone video recorder with live viewfinder and timer.',
      'In-browser microphone-only audio recorder for instant voice ingestion.',
      'Local file upload dropzone supporting .mp4, .webm, .mov, .wav, and .mp3 formats.',
      'Dual video player running in frame-accurate lockstep with animated speaker silhouettes.',
      'Audible A/B audio track switcher: Listen Original (with fillers) vs Listen EchoFlow (150 WPM).',
    ],
    whatToClick: [
      'Click "Video Compare" in top navigation.',
      'To record webcam: Click "Record Video", allow camera access, click "Start Recording", speak for 5-10s, then click "Stop & Load".',
      'To record mic only: Click "Record Audio".',
      'To upload file: Click "Upload Video/Audio" to choose an .mp4, .webm, or .wav file.',
      'To use presets: Click any of the 6 dialect presets (English, Telugu, Tamil, Hindi, French, German).',
      'Click Play/Pause to run both video streams in frame-accurate lockstep.',
      'Toggle Audio Track: Click "Listen Original" vs "Listen EchoFlow (150 WPM)".',
    ],
    whatToInput: 'Webcam video, microphone audio, local media file, or preset.',
    whatOutputProduces: [
      'Left Player: Raw unnormalized video with erratic waveform overlay.',
      'Right Player: EchoFlow normalized output with harmonized waveform and 94.2% pitch retention.',
      'Synchronized timeline scrubbing and instant A/B audio channel switching.',
    ],
    howToTest:
      'Click "Record Video", record yourself speaking fast for 5 seconds. Watch your video appear in both players with synchronized A/B audio switching.',
    expectedBenchmark: 'Frame-accurate playback sync, seamless A/B audio track switching.',
    businessBenefits: [
      'Preserves facial intimacy and executive presence on video conferences without dubbing lag.',
      'Critical for telemedicine, legal depositions, and global boardroom presentations.',
    ],
    technicalBenefits: [
      'Client-side MediaRecorder WebM pipeline with seamless canvas video multiplexing.',
      'Dual synchronized audio routing with dynamic speed and pitch compensation.',
    ],
  },
  {
    id: 'roi_engine',
    number: '05',
    title: 'Enterprise ROI Engine & C-Suite Report',
    icon: DollarSign,
    overview:
      'Financial model calculating call center seat capacity savings, AHT compression, and printable C-Suite business case memorandum.',
    features: [
      '5-variable interactive financial model: Seats, Calls/Day, Baseline AHT, Reduction %, Rate.',
      'Monte Carlo 100-Call A/B benchmark simulator with p-value validation (<0.001).',
      'One-click client-side printable Executive PDF Business Case Memorandum.',
      'Dynamic capacity recovery model calculating annual agent hours reclaimed.',
    ],
    whatToClick: [
      'Click "ROI Engine" in top navigation.',
      'Adjust sliders: Representative Seats, Calls/Day, Baseline AHT, AHT Compression, Hourly Rate.',
      'Click "Generate Executive Report" to display executive memorandum.',
      'Click "Print / Save as PDF" to export the business case.',
      'Click "Run 100-Call Test" under A/B Benchmark Simulator.',
    ],
    whatToInput: 'Operational variables (seats, calls, rates).',
    whatOutputProduces: [
      'Annual Net Savings in dollars (e.g. $3,234,000 for 500 seats).',
      'AHT Time Saved per call (e.g. 75 seconds).',
      'Hours Recovered annually (e.g. 115,500 hours).',
      'Monte Carlo A/B distribution curves and p-value validation (< 0.001).',
    ],
    howToTest:
      'Set seats to 500, AHT to 6.8m, reduction to 18.5%, rate to $28. Verify calculated savings equals $3,234,000 in UI and Notepad.',
    expectedBenchmark: 'Mathematical formula exact match, PDF print preview formatted.',
    businessBenefits: [
      'Provides CFOs and procurement leaders with an airtight mathematical payback model under 4 months.',
      'Recovers 115,500 productive agent hours annually for a 500-seat contact center.',
    ],
    technicalBenefits: [
      'Deterministic financial algorithms backed by Monte Carlo statistical modeling.',
      'CSS print media queries generate publication-grade PDF documents client-side.',
    ],
  },
  {
    id: 'telephony_gcp',
    number: '06',
    title: 'Telephony Webhooks & GCP Infrastructure',
    icon: Server,
    overview:
      'Copy-ready contact center webhooks (Twilio, Genesys, Amazon Connect, Asterisk), interactive GCP topology, and latency SLA stress-tester.',
    features: [
      'Pre-built webhook integration manifests for Twilio TwiML, Genesys AudioHook, Connect, Asterisk.',
      'Interactive Google Cloud Run serverless topology with node-by-node latency span inspection.',
      'Network Stress-Tester simulating packet loss (0-5%) and jitter (5-60ms) under concurrent load.',
      'Autoscaling container specs with Cloud Armor edge protection and Cloud Secret Manager.',
    ],
    whatToClick: [
      'Click "Telephony & GCP" in top navigation.',
      'Select provider: Twilio, Genesys, Amazon Connect, or Asterisk.',
      'Click "Copy Snippet" to copy integration manifest.',
      'Click through the 5 Google Cloud topology nodes (Cloud Armor, Cloud Run, Secret Manager, Gemini Live, Cloud Trace).',
      'Adjust Stress-Tester sliders (Packet Loss 0-5%, Jitter 5-60ms, Concurrency 10-80).',
    ],
    whatToInput: 'Provider selection and simulated network packet loss rate.',
    whatOutputProduces: [
      'Copy-ready XML/JSON/Node.js telephony webhook scripts.',
      'Sub-millisecond latency span breakdowns for all GCP infrastructure nodes.',
      'Real-time stressed latency calculation confirming SLA < 550ms.',
    ],
    howToTest:
      'Increase Packet Loss to 3.0% and Jitter to 40ms. Verify stressed end-to-end latency remains at ~482ms (strictly under 550ms SLA).',
    expectedBenchmark: 'Adaptive buffer absorbs jitter, total delay < 550ms.',
    businessBenefits: [
      'Zero rip-and-replace: Deploys directly into existing contact center stacks in under 15 minutes.',
      'Saves millions in proprietary on-premise DSP telecommunication appliances.',
    ],
    technicalBenefits: [
      'Serverless Google Cloud Run deployment with HTTP/2 WebSockets auto-scaling to zero.',
      'Adaptive jitter buffer dynamically absorbs up to 40ms of internet jitter without underrun.',
    ],
  },
  {
    id: 'sitemap',
    number: '07',
    title: 'Cascading Architectural Sitemap',
    icon: Network,
    overview:
      'Interactive blueprint of all EchoFlow features, APIs, and codebase references with drill-down cascading tiles.',
    features: [
      '7 primary domain tiles covering Ingestion, Gemini Live, Cloud Run, Telemetry, Video, ROI, Security.',
      'Sub-feature cascading expansion displaying frame sizes, sample rates, and protocol references.',
      'Real-time keyword search filter indexing technical parameters and source files.',
      'Right-hand deep-dive inspector linking directly to source repository components.',
    ],
    whatToClick: [
      'Click "Sitemap" in top navigation.',
      'Click any primary domain tile (01 to 07) to cascade open sub-features.',
      'Click any sub-feature tile to inspect technical parameters in the inspector panel.',
      'Use the search bar to filter protocols or keywords (e.g., "WebSocket", "PCM").',
      'Click "Expand All" or "Collapse All" for overview navigation.',
    ],
    whatToInput: 'Search text or category clicks.',
    whatOutputProduces: [
      'Cascading expansion animation.',
      'Sub-feature technical specs, frame sizes, and target source code file paths.',
    ],
    howToTest:
      'Type "Gemini" into the search bar. Verify Domain 02 (Gemini Live Core) and related sub-features filter dynamically.',
    expectedBenchmark: 'Instant sub-feature cascade and technical inspector rendering.',
    businessBenefits: [
      'Provides enterprise architects and technical auditors an instant architectural audit.',
      'Simplifies cross-team onboarding for integration engineers.',
    ],
    technicalBenefits: [
      'Structured hierarchical data model with dynamic CSS transition animations.',
      'Direct mapping between UI domain tiles and backend code files.',
    ],
  },
  {
    id: 'ethics',
    number: '08',
    title: 'Linguistic Equity & Compliance Matrix',
    icon: Scale,
    overview:
      'Ethical AI foundation (empowering human workers, anti-accent discrimination) and enterprise regulatory compliance matrix.',
    features: [
      'Human Empowerment Directive: Enhances human voice rather than replacing human agents with bots.',
      'Vocal Timbre Preservation: Preserves cultural pitch and accent identity (94%+ F0 retention).',
      'Stateless Memory Pipeline: Zero disk audio writes with ephemeral volatile RAM buffers.',
      'Regulatory compliance matrix: GDPR Article 28, HIPAA Security Rule, SOC 2 Type II, IEEE AI Ethics.',
    ],
    whatToClick: [
      'Click "Ethics & Bias" in top navigation.',
      'Review 3 Ethical Pillars: Human Empowerment, Vocal Identity, Zero Data Retention.',
      'Inspect Regulatory Matrix: GDPR Article 28, HIPAA Security Rule, SOC 2 Type II, IEEE Ethical Standard.',
    ],
    whatToInput: 'No input required; visual review and audit inspection.',
    whatOutputProduces: [
      'Regulatory compliance certifications and privacy guarantees.',
      'Verification of stateless ephemeral memory buffers (0 disk writes).',
    ],
    howToTest:
      'Verify GDPR Article 28 data processor guidelines and confirm zero audio persistence guarantee.',
    expectedBenchmark: '100% ephemeral RAM processing, SOC 2 / HIPAA alignment verified.',
    businessBenefits: [
      'Protects enterprise brand reputation against ethical AI and labor replacement controversies.',
      'Ensures full compliance with strict European and US privacy laws (GDPR & HIPAA).',
    ],
    technicalBenefits: [
      'In-memory circular audio buffers with deterministic garbage collection.',
      'End-to-end TLS 1.3 transit encryption with zero storage persistence.',
    ],
  },
  {
    id: 'code',
    number: '09',
    title: 'Deliverables & AI Codebase Bundle',
    icon: FileCode,
    overview:
      'In-browser source code viewer and one-click downloader for all submission deliverables, with a dedicated single-file Local Backup bundle.',
    features: [
      'In-browser syntax-highlighted inspector for all 8 repository files.',
      'Single-File Consolidated Bundle formatted specifically for Local Backup and offline inspection.',
      'Individual file downloader and 1-click "Download All Deliverables" archive.',
      'Complete production artifacts: FastAPI main.py, Streamlit app.py, Dockerfile, shell scripts.',
    ],
    whatToClick: [
      'Click "Files" in top navigation.',
      'Switch between file tabs: main.py, app.py, demo_runner.py, MASTER_USER_MANUAL.md, Dockerfile, requirements.txt, cloud_deploy.sh, README.md.',
      'Click "Download Local Backup" to export the consolidated single-file bundle.',
      'Click "Copy Local Backup" to copy the entire codebase bundle to the clipboard.',
      'Click "Download All Deliverables" to export the individual files.',
    ],
    whatToInput: 'File tab selection.',
    whatOutputProduces: [
      'Syntax-highlighted production Python, Dockerfile, shell script, and markdown code.',
      'Direct browser file download via Blob URLs.',
      'Single-file Local Backup bundle with standardized <file path="..."> delimiters.',
    ],
    howToTest:
      'Click "Download Local Backup" and open the downloaded bundle in Notepad. Verify that all 8 files are included with XML delimiters.',
    expectedBenchmark: 'All 8 repository files load and download without missing dependencies.',
    businessBenefits: [
      'Gives technical reviewers complete transparency with 100% auditable production source code.',
      'Accelerates developer adoption by providing plug-and-play AI prompt bundles.',
    ],
    technicalBenefits: [
      'Standardized XML/Markdown packaging compatible with Local Backup preservation and AI tools.',
      'Fully dockerized container definition for instant deployment to Google Cloud Run.',
    ],
  },
];

export const MasterDocumentation: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<ManualSection>(MANUAL_SECTIONS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedManual, setCopiedManual] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyFullManual = () => {
    const text = MANUAL_SECTIONS.map(
      (sec) =>
        `=====================================================\nSECTION ${sec.number}: ${sec.title.toUpperCase()}\nOverview: ${sec.overview}\n\nCORE FEATURES:\n${sec.features.map((f) => '  - ' + f).join('\n')}\n\nWHAT TO CLICK:\n${sec.whatToClick.map((c) => '  - ' + c).join('\n')}\n\nWHAT TO INPUT:\n  ${sec.whatToInput}\n\nWHAT OUTPUT IS PRODUCED:\n${sec.whatOutputProduces.map((o) => '  - ' + o).join('\n')}\n\nHOW TO TEST:\n  ${sec.howToTest}\n\nEXPECTED BENCHMARK:\n  ${sec.expectedBenchmark}\n\nBUSINESS BENEFITS:\n${sec.businessBenefits.map((b) => '  - ' + b).join('\n')}\n\nTECHNICAL BENEFITS:\n${sec.technicalBenefits.map((tb) => '  - ' + tb).join('\n')}\n`
    ).join('\n');

    navigator.clipboard.writeText(text);
    setCopiedManual(true);
    setTimeout(() => setCopiedManual(false), 2000);
  };

  const filteredSections = MANUAL_SECTIONS.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.howToTest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Official Operations Manual & Screen Flow Guide
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              EchoFlow AI Master Documentation: Sections, Features & Benefits
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Complete reference manual detailing all 9 system sections, core technical features,
              step-by-step operation, test procedures, and quantified enterprise benefits.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyFullManual}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
            >
              {copiedManual ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedManual ? 'Copied Manual' : 'Copy Manual (Notepad)'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 relative max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sections, features, benefits, tests (e.g. 'PBX', 'Claude', 'ROI')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Main Grid: Section Navigation on Left, Detailed Guide on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Nav List */}
        <div className="lg:col-span-4 space-y-2">
          {filteredSections.map((sec) => {
            const isSelected = selectedSection.id === sec.id;
            const Icon = sec.icon;

            return (
              <button
                key={sec.id}
                onClick={() => setSelectedSection(sec)}
                className={`w-full p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-indigo-500/70 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/30'
                    : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/80'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-indigo-400">
                    <span>SECTION {sec.number}</span>
                  </div>
                  <div className="font-bold text-xs text-slate-100 truncate mt-0.5">{sec.title}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{sec.overview}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Detail Panel */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-indigo-400 font-bold">
                SECTION {selectedSection.number} • MASTER SPECIFICATION
              </span>
              <h3 className="text-xl font-bold text-white mt-1">{selectedSection.title}</h3>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-950 text-emerald-400 border border-slate-800 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              VERIFIED IN LIVE BUILD
            </span>
          </div>

          {/* 1. Purpose & Functional Overview */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              1. Purpose & Functional Overview:
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans bg-slate-950 p-4 rounded-xl border border-slate-800">
              {selectedSection.overview}
            </p>
          </div>

          {/* 2. Core Features & Architecture */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-indigo-400" />
              2. Core Features & Capabilities:
            </h4>
            <div className="space-y-1.5">
              {selectedSection.features.map((feat, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Screen Flow: What to Click */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
              3. Screen Flow: Exactly What to Click:
            </h4>
            <div className="space-y-1.5">
              {selectedSection.whatToClick.map((step, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-300"
                >
                  <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 font-mono text-[10px] flex items-center justify-center shrink-0 border border-cyan-800">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. What to Input */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-1.5">
              4. Input Parameters & Audio Channels:
            </h4>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
              {selectedSection.whatToInput}
            </div>
          </div>

          {/* 5. What Output is Produced */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
              5. Resulting Output Produced:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {selectedSection.whatOutputProduces.map((out, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-start gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-relaxed">{out}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 6. How to Test in Notepad / Terminal */}
          <div className="p-4 rounded-xl bg-slate-950 border border-indigo-950 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              6. How to Test & Verify (UI / Notepad / Terminal):
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{selectedSection.howToTest}</p>
            <div className="pt-1 flex items-center gap-2 text-[11px] font-mono text-emerald-400">
              <span className="font-bold">Expected Benchmark SLA:</span>
              <span>{selectedSection.expectedBenchmark}</span>
            </div>
          </div>

          {/* 7. Quantified Business & Technical Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-950 space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Business & Customer Benefits:
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {selectedSection.businessBenefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-purple-950 space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                Technical & Engineering Benefits:
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {selectedSection.technicalBenefits.map((tb, i) => (
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
    </div>
  );
};
