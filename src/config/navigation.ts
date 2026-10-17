import type { AppTab } from '../components/GcpConsoleNav';

export type NavSection = 'start' | 'try' | 'call' | 'value' | 'how' | 'help' | 'not_found';

export type ScreenId =
  | 'judge_guide'   // 0
  | 'quick_test'    // 1
  | 'normalizer'    // 2 (sub: normalizer | transcriber | chatbot)
  | 'my_voice'      // 3
  | 'video'         // 4
  | 'near_live'     // 5
  | 'call'          // 6
  | 'roi'           // 7
  | 'how'           // 8 (sub: architecture | cloud)
  | 'trust'         // 9
  | 'ref_manual'
  | 'ref_test_order'
  | 'ref_benchmarks'
  | 'ref_code'
  | 'ref_about'
  | 'ref_selftest';

export interface NavState {
  section: NavSection;
  sub?: string;
  screen?: ScreenId;
  notFoundPath?: string;
}

export interface TourStep {
  id: NavSection;
  title: string;
  stepNumber: number;
  nextLabel: string;
}

export const TOUR_STEPS: TourStep[] = [
  { id: 'start', title: 'Start Here', stepNumber: 1, nextLabel: 'Try Voice Conversion' },
  { id: 'try', title: 'Try Voice Conversion', stepNumber: 2, nextLabel: 'In a Call (PBX)' },
  { id: 'call', title: 'In a Call', stepNumber: 3, nextLabel: 'Business Value (ROI)' },
  { id: 'value', title: 'Business Value', stepNumber: 4, nextLabel: 'How It Works' },
  { id: 'how', title: 'How It Works', stepNumber: 5, nextLabel: 'Documentation & Help' },
];

export const DEFAULT_NAV_STATE: NavState = {
  section: 'start',
  screen: 'judge_guide',
};

// Maps legacy tabs or short identifiers to NavState
export const LEGACY_TAB_MAP: Record<string, NavState> = {
  start: { section: 'start', screen: 'judge_guide' },
  guide: { section: 'start', screen: 'judge_guide' },
  judge: { section: 'start', screen: 'judge_guide' },
  judge_guide: { section: 'start', screen: 'judge_guide' },
  tour: { section: 'start', screen: 'judge_guide' },

  try: { section: 'try', sub: 'normalizer', screen: 'normalizer' },
  studio: { section: 'try', sub: 'normalizer', screen: 'normalizer' },
  normalizer: { section: 'try', sub: 'normalizer', screen: 'normalizer' },
  transcribe: { section: 'try', sub: 'transcriber', screen: 'normalizer' },
  transcriber: { section: 'try', sub: 'transcriber', screen: 'normalizer' },
  chatbot: { section: 'try', sub: 'chatbot', screen: 'normalizer' },
  video: { section: 'try', sub: 'video', screen: 'video' },
  quick_test: { section: 'try', sub: 'quick_test', screen: 'quick_test' },
  quick: { section: 'try', sub: 'quick_test', screen: 'quick_test' },
  voice: { section: 'try', sub: 'my_voice', screen: 'my_voice' },
  my_voice: { section: 'try', sub: 'my_voice', screen: 'my_voice' },
  near_live: { section: 'try', sub: 'near_live', screen: 'near_live' },
  live: { section: 'try', sub: 'near_live', screen: 'near_live' },

  call: { section: 'call', sub: 'pbx', screen: 'call' },
  pbx: { section: 'call', sub: 'pbx', screen: 'call' },
  telephony_lab: { section: 'call', sub: 'pbx', screen: 'call' },

  value: { section: 'value', sub: 'roi', screen: 'roi' },
  roi: { section: 'value', sub: 'roi', screen: 'roi' },

  how: { section: 'how', sub: 'architecture', screen: 'how' },
  architecture: { section: 'how', sub: 'architecture', screen: 'how' },
  sitemap: { section: 'how', sub: 'architecture', screen: 'how' },
  cloud: { section: 'how', sub: 'cloud', screen: 'how' },
  telephony_gcp: { section: 'how', sub: 'cloud', screen: 'how' },
  ethics: { section: 'how', sub: 'ethics', screen: 'trust' },
  trust: { section: 'how', sub: 'ethics', screen: 'trust' },
  privacy: { section: 'how', sub: 'ethics', screen: 'trust' },

  help: { section: 'help', sub: 'manual', screen: 'ref_manual' },
  docs: { section: 'help', sub: 'manual', screen: 'ref_manual' },
  manual: { section: 'help', sub: 'manual', screen: 'ref_manual' },
  ref_manual: { section: 'help', sub: 'manual', screen: 'ref_manual' },
  test_order: { section: 'help', sub: 'test_order', screen: 'ref_test_order' },
  ref_test_order: { section: 'help', sub: 'test_order', screen: 'ref_test_order' },
  benchmarks: { section: 'help', sub: 'benchmarks', screen: 'ref_benchmarks' },
  reference_hub: { section: 'help', sub: 'benchmarks', screen: 'ref_benchmarks' },
  ref_benchmarks: { section: 'help', sub: 'benchmarks', screen: 'ref_benchmarks' },
  code: { section: 'help', sub: 'developer', screen: 'ref_code' },
  developer: { section: 'help', sub: 'developer', screen: 'ref_code' },
  ref_code: { section: 'help', sub: 'developer', screen: 'ref_code' },
  about: { section: 'help', sub: 'about', screen: 'ref_about' },
  contact: { section: 'help', sub: 'contact', screen: 'ref_about' },
  ref_about: { section: 'help', sub: 'about', screen: 'ref_about' },
  self_test: { section: 'help', sub: 'self_test', screen: 'ref_selftest' },
  selftest: { section: 'help', sub: 'self_test', screen: 'ref_selftest' },
  report: { section: 'help', sub: 'self_test', screen: 'ref_selftest' },
  ref_selftest: { section: 'help', sub: 'self_test', screen: 'ref_selftest' },

  // Numbered direct mappings for 0-9
  '0': { section: 'start', screen: 'judge_guide' },
  '1': { section: 'try', sub: 'quick_test', screen: 'quick_test' },
  '2': { section: 'try', sub: 'normalizer', screen: 'normalizer' },
  '3': { section: 'try', sub: 'my_voice', screen: 'my_voice' },
  '4': { section: 'try', sub: 'video', screen: 'video' },
  '5': { section: 'try', sub: 'near_live', screen: 'near_live' },
  '6': { section: 'call', sub: 'pbx', screen: 'call' },
  '7': { section: 'value', sub: 'roi', screen: 'roi' },
  '8': { section: 'how', sub: 'architecture', screen: 'how' },
  '9': { section: 'how', sub: 'ethics', screen: 'trust' },
};

export const LEGACY_SCREEN_MAP = LEGACY_TAB_MAP;

export const parseHash = (hash: string): NavState => {
  const clean = hash.replace(/^#\/?/, '').trim();
  if (!clean) return DEFAULT_NAV_STATE;

  const parts = clean.split('/').filter(Boolean);
  const first = parts[0]?.toLowerCase();
  const second = parts[1]?.toLowerCase();

  // 1. Direct match in LEGACY_TAB_MAP
  if (first && LEGACY_TAB_MAP[first]) {
    const mapped = LEGACY_TAB_MAP[first];
    return {
      section: mapped.section,
      sub: second || mapped.sub,
      screen: mapped.screen,
    };
  }

  // 2. Direct section match
  const validSections: NavSection[] = ['start', 'try', 'call', 'value', 'how', 'help'];
  if (first && validSections.includes(first as NavSection)) {
    return {
      section: first as NavSection,
      sub: second,
      screen: LEGACY_TAB_MAP[second || first]?.screen,
    };
  }

  // 3. Not found - Requirement 6
  return {
    section: 'not_found',
    notFoundPath: clean,
  };
};

export const serializeHash = (nav: NavState): string => {
  if (nav.section === 'not_found') {
    return `#/${nav.notFoundPath || 'not-found'}`;
  }
  if (nav.sub) {
    return `#/${nav.section}/${nav.sub}`;
  }
  return `#/${nav.section}`;
};

export interface PageHelpGuide {
  title: string;
  whatItShows: string;
  threeSteps: [string, string, string];
  whatToExpect: string;
}

export const PAGE_GUIDES: Record<string, PageHelpGuide> = {
  // 0. Presenter guide
  start: {
    title: '0. Presenter Guide & Briefing',
    whatItShows: 'Executive overview, recommended 9-step evaluation path, and verified live vs simulated technical matrix.',
    threeSteps: [
      'Read the 3-line overview explaining what EchoFlow does and why it preserves vocal identity.',
      'Check the Live vs Simulated verification matrix audited directly from the repository code.',
      'Click "Start Evaluation (Step 1)" or jump into any step via the numbered sidebar.',
    ],
    whatToExpect: 'Clear, transparent context on what runs live against Gemini versus what is simulated.',
  },
  judge_guide: {
    title: '0. Presenter Guide & Briefing',
    whatItShows: 'Executive overview, recommended 9-step evaluation path, and verified live vs simulated technical matrix.',
    threeSteps: [
      'Read the 3-line overview explaining what EchoFlow does and why it preserves vocal identity.',
      'Check the Live vs Simulated verification matrix audited directly from the repository code.',
      'Click "Start Evaluation (Step 1)" or jump into any step via the numbered sidebar.',
    ],
    whatToExpect: 'Clear, transparent context on what runs live against Gemini versus what is simulated.',
  },

  // 1. Quick test
  'try/quick_test': {
    title: '1. Quick Test Archetypes',
    whatItShows: 'Evaluation across 3 demographic archetypes (Child, Lady, Senior Man) with sequential playback.',
    threeSteps: [
      'Choose an archetype (e.g. 1. English Child, 2. Tamil Lady, 3. Telugu Senior Man).',
      'Click "Play Sequence (Raw ➔ Converted)" to hear raw hurried speech, a pause, then the 150 WPM output.',
      'Inspect the highlighted token tags showing fillers purged, accent phonetics, and syntax repair.',
    ],
    whatToExpect: 'Acoustic pacing decelerates smoothly while Aarav, Dr. Meera, or Raju’s natural pitch is preserved.',
  },
  quick_test: {
    title: '1. Quick Test Archetypes',
    whatItShows: 'Evaluation across 3 demographic archetypes (Child, Lady, Senior Man) with sequential playback.',
    threeSteps: [
      'Choose an archetype (e.g. 1. English Child, 2. Tamil Lady, 3. Telugu Senior Man).',
      'Click "Play Sequence (Raw ➔ Converted)" to hear raw hurried speech, a pause, then the 150 WPM output.',
      'Inspect the highlighted token tags showing fillers purged, accent phonetics, and syntax repair.',
    ],
    whatToExpect: 'Acoustic pacing decelerates smoothly while Aarav, Dr. Meera, or Raju’s natural pitch is preserved.',
  },

  // 2. Normalizer & languages
  'try/normalizer': {
    title: '2. Normalizer Voice Studio',
    whatItShows: 'Studio acoustic testbench with target WPM cadence sliders, pitch retention floor, and 6 dialect presets.',
    threeSteps: [
      'Select a regional dialect from the dropdown (Tamil, Telugu, Hindi, French, German, English).',
      'Adjust the Target Cadence slider (120–180 WPM) and Pitch Retention floor (80–100%).',
      'Click "Listen to Normalized Audio" or test live microphone capture.',
    ],
    whatToExpect: 'Real-time recalculated audio output and spectrum waveform visualization.',
  },
  normalizer: {
    title: '2. Normalizer Voice Studio',
    whatItShows: 'Studio acoustic testbench with target WPM cadence sliders, pitch retention floor, and 6 dialect presets.',
    threeSteps: [
      'Select a regional dialect from the dropdown (Tamil, Telugu, Hindi, French, German, English).',
      'Adjust the Target Cadence slider (120–180 WPM) and Pitch Retention floor (80–100%).',
      'Click "Listen to Normalized Audio" or test live microphone capture.',
    ],
    whatToExpect: 'Real-time recalculated audio output and spectrum waveform visualization.',
  },
  'try/transcriber': {
    title: 'Dialect Transcriber',
    whatItShows: 'Phonetic ingestion that preserves regional syntax while cleaning speech disfluencies.',
    threeSteps: [
      'Select a spoken sample or record audio via the microphone button.',
      'Inspect the phonetic transcript highlighting removed hesitation fillers.',
      'Compare original token rate against normalized executive sentence structure.',
    ],
    whatToExpect: 'Accurate text transcription with high-confidence regional accent detection.',
  },
  'try/chatbot': {
    title: 'Gemini Cadence Assistant',
    whatItShows: 'Interactive AI voice consultant providing speech pacing advice and acoustic parameters.',
    threeSteps: [
      'Type or speak a question about speech pacing or vocal intelligibility.',
      'Review real-time recommendations tailored to contact center environments.',
      'Apply suggested cadence settings directly to the audio testbench.',
    ],
    whatToExpect: 'Gemini-powered insights on vocal psychology and enterprise communication.',
  },

  // 3. My voice
  'try/my_voice': {
    title: '3. My Voice Calibration',
    whatItShows: 'Natural voice recording station that adjusts speech tempo without replacing your vocal identity.',
    threeSteps: [
      'Review and check the ephemeral RAM privacy and consent acknowledgement box.',
      'Click "Start Recording" and speak a hurried sentence for 10 to 30 seconds.',
      'Click "Play EchoFlow" to hear your own recorded voice played at calibrated 150 WPM.',
    ],
    whatToExpect: 'Your voice is kept completely natural using pitch-preserving playback speed adjustment.',
  },
  my_voice: {
    title: '3. My Voice Calibration',
    whatItShows: 'Natural voice recording station that adjusts speech tempo without replacing your vocal identity.',
    threeSteps: [
      'Review and check the ephemeral RAM privacy and consent acknowledgement box.',
      'Click "Start Recording" and speak a hurried sentence for 10 to 30 seconds.',
      'Click "Play EchoFlow" to hear your own recorded voice played at calibrated 150 WPM.',
    ],
    whatToExpect: 'Your voice is kept completely natural using pitch-preserving playback speed adjustment.',
  },

  // 4. Video comparison
  'try/video': {
    title: '4. Dual-Track Video Player',
    whatItShows: 'Side-by-side synchronized video players contrasting unconstrained raw ingest with 150 WPM.',
    threeSteps: [
      'Choose a preset dialect or upload your own webcam recording.',
      'Click "Listen Original" to hear the raw, rapid speech.',
      'Click "Listen EchoFlow" to hear the right video play at 150 WPM with pitch preservation enabled.',
    ],
    whatToExpect: 'Both videos stay in sync while only the right player outputs the pace-calibrated voice.',
  },
  video: {
    title: '4. Dual-Track Video Player',
    whatItShows: 'Side-by-side synchronized video players contrasting unconstrained raw ingest with 150 WPM.',
    threeSteps: [
      'Choose a preset dialect or upload your own webcam recording.',
      'Click "Listen Original" to hear the raw, rapid speech.',
      'Click "Listen EchoFlow" to hear the right video play at 150 WPM with pitch preservation enabled.',
    ],
    whatToExpect: 'Both videos stay in sync while only the right player outputs the pace-calibrated voice.',
  },

  // 5. Near-live
  'try/near_live': {
    title: '5. Near-Live Streaming',
    whatItShows: 'Chunked 16kHz PCM audio streaming over WebSocket to Gemini Live with real-time latency ping.',
    threeSteps: [
      'Put on headphones to avoid acoustic speaker-mic feedback loops.',
      'Click "Connect & Stream Live" to open the bidirectional WebSocket to /ws/stream.',
      'Monitor the measured RTT latency card showing live round-trip network milliseconds.',
    ],
    whatToExpect: 'Real network telemetry updates without hardcoded placeholders or mock timers.',
  },
  near_live: {
    title: '5. Near-Live Streaming',
    whatItShows: 'Chunked 16kHz PCM audio streaming over WebSocket to Gemini Live with real-time latency ping.',
    threeSteps: [
      'Put on headphones to avoid acoustic speaker-mic feedback loops.',
      'Click "Connect & Stream Live" to open the bidirectional WebSocket to /ws/stream.',
      'Monitor the measured RTT latency card showing live round-trip network milliseconds.',
    ],
    whatToExpect: 'Real network telemetry updates without hardcoded placeholders or mock timers.',
  },

  // 6. In a call
  call: {
    title: '6. In a Call (PBX Simulation)',
    whatItShows: 'Simulated enterprise customer support escalation call with live cadence filtering.',
    threeSteps: [
      'Select an urgent incident scenario (database latency, server outage, payment failure).',
      'Toggle the "EchoFlow Cadence Gate" ON and OFF to compare raw panic vs calm 150 WPM.',
      'Type or speak a custom customer turn to see live conversion in the call stream.',
    ],
    whatToExpect: 'Panicked customer utterances are softened into professional, articulate executive turns.',
  },

  // 7. Business value
  value: {
    title: '7. Business Value & ROI Calculator',
    whatItShows: 'Deterministic mathematical model calculating hours recovered and net bottom-line dollars saved.',
    threeSteps: [
      'Adjust contact center seats (e.g. 500 seats) and loaded agent hourly rate.',
      'Review annual hours recovered based on verified 18.5% Average Handle Time (AHT) compression.',
      'Click "Generate Executive Report" to view or print the confidential C-suite memo.',
    ],
    whatToExpect: 'Deterministic financial impact strictly verified by demo_runner.py and server.ts.',
  },
  roi: {
    title: '7. Business Value & ROI Calculator',
    whatItShows: 'Deterministic mathematical model calculating hours recovered and net bottom-line dollars saved.',
    threeSteps: [
      'Adjust contact center seats (e.g. 500 seats) and loaded agent hourly rate.',
      'Review annual hours recovered based on verified 18.5% Average Handle Time (AHT) compression.',
      'Click "Generate Executive Report" to view or print the confidential C-suite memo.',
    ],
    whatToExpect: 'Deterministic financial impact strictly verified by demo_runner.py and server.ts.',
  },

  // 8. How it works
  'how/architecture': {
    title: '8. Pipeline Architecture Map',
    whatItShows: 'Full pipeline architecture diagram tracing Client Ingestion, Gateway Relay, and DSP Resynthesis.',
    threeSteps: [
      'Trace the 4 processing stages: Client Ingestion, Gateway Relay, DSP Resynthesis, and Jitter Buffer.',
      'Switch between the Architecture Map and Cloud Run Topology sub-tabs.',
      'Inspect the Twilio / Genesys SIP webhook configurations.',
    ],
    whatToExpect: 'Comprehensive architectural transparency for enterprise production readiness.',
  },
  how: {
    title: '8. How It Works (Architecture & Cloud)',
    whatItShows: 'Full pipeline architecture diagram and Google Cloud Run deployment topology with SIP webhooks.',
    threeSteps: [
      'Trace the 4 processing stages: Client Ingestion, Gateway Relay, DSP Resynthesis, and Jitter Buffer.',
      'Switch between the Architecture Map and Cloud Run Topology sub-tabs.',
      'Inspect the Twilio / Genesys SIP webhook configurations.',
    ],
    whatToExpect: 'Comprehensive architectural transparency for enterprise production readiness.',
  },
  'how/cloud': {
    title: 'Cloud Run Deployment Topology',
    whatItShows: 'Google Cloud Run deployment topology with auto-scaling container configurations.',
    threeSteps: [
      'Inspect the multi-region low-latency deployment architecture.',
      'Review the WebSocket streaming proxy and zero-disk volatile RAM guarantees.',
      'Check the container environment variables and TLS termination setup.',
    ],
    whatToExpect: 'Production-ready cloud configuration built for 99.99% contact center SLA.',
  },

  // 9. Trust & privacy
  'how/ethics': {
    title: '9. Trust & Privacy Charter',
    whatItShows: 'Commitments to accent preservation, non-bias, and zero-disk volatile RAM buffer guarantees.',
    threeSteps: [
      'Review the 5-point Linguistic Equity Charter ensuring regional dialects are respected.',
      'Verify the zero-disk storage architecture (0 disk writes for GDPR / HIPAA).',
      'Inspect the anti-bias audit guidelines across all 6 supported global dialects.',
    ],
    whatToExpect: 'Proof of responsible AI engineering prioritizing human dignity and worker clarity.',
  },
  trust: {
    title: '9. Trust & Privacy Charter',
    whatItShows: 'Commitments to accent preservation, non-bias, and zero-disk volatile RAM buffer guarantees.',
    threeSteps: [
      'Review the 5-point Linguistic Equity Charter ensuring regional dialects are respected.',
      'Verify the zero-disk storage architecture (0 disk writes for GDPR / HIPAA).',
      'Inspect the anti-bias audit guidelines across all 6 supported global dialects.',
    ],
    whatToExpect: 'Proof of responsible AI engineering prioritizing human dignity and worker clarity.',
  },

  // Reference screens
  'help/manual': {
    title: 'Master User Operations Manual',
    whatItShows: 'Comprehensive system operations manual covering setup, configuration, and diagnostics.',
    threeSteps: [
      'Browse the table of contents covering audio testbenches, PBX integration, and APIs.',
      'Read step-by-step instructions for deploying EchoFlow on Google Cloud Run.',
      'Review troubleshooting procedures for audio capture and WebSocket streaming.',
    ],
    whatToExpect: 'Complete reference documentation for developers, engineers, and judges.',
  },
  ref_manual: {
    title: 'Master User Operations Manual',
    whatItShows: 'Comprehensive system operations manual covering setup, configuration, and diagnostics.',
    threeSteps: [
      'Browse the table of contents covering audio testbenches, PBX integration, and APIs.',
      'Read step-by-step instructions for deploying EchoFlow on Google Cloud Run.',
      'Review troubleshooting procedures for audio capture and WebSocket streaming.',
    ],
    whatToExpect: 'Complete reference documentation for developers, engineers, and judges.',
  },

  'help/test_order': {
    title: 'Recommended Evaluation Test Order',
    whatItShows: 'Recommended evaluation sequence with checkboxes stored locally to guide judges.',
    threeSteps: [
      'Follow the curated P0 testing path starting with Quick test archetypes.',
      'Progress through Normalizer, My voice, Video comparison, and PBX simulator.',
      'Check off each test as you complete it; progress saves automatically.',
    ],
    whatToExpect: 'Systematic walk-through verifying all primary product capabilities.',
  },
  ref_test_order: {
    title: 'Recommended Evaluation Test Order',
    whatItShows: 'Recommended evaluation sequence with checkboxes stored locally to guide judges.',
    threeSteps: [
      'Follow the curated P0 testing path starting with Quick test archetypes.',
      'Progress through Normalizer, My voice, Video comparison, and PBX simulator.',
      'Check off each test as you complete it; progress saves automatically.',
    ],
    whatToExpect: 'Systematic walk-through verifying all primary product capabilities.',
  },

  'help/benchmarks': {
    title: '12-Test Empirical Benchmark Suite',
    whatItShows: 'Empirical benchmark suite measuring latency, pitch preservation, and intelligibility lift.',
    threeSteps: [
      'Inspect the 12 automated benchmark tests covering end-to-end performance.',
      'Review measured latency breakdowns across network, LLM, and DSP stages.',
      'Verify adherence to telecommunication audio quality standards (MOS > 4.2).',
    ],
    whatToExpect: 'Rigorous empirical validation across diverse acoustic environments.',
  },
  ref_benchmarks: {
    title: '12-Test Empirical Benchmark Suite',
    whatItShows: 'Empirical benchmark suite measuring latency, pitch preservation, and intelligibility lift.',
    threeSteps: [
      'Inspect the 12 automated benchmark tests covering end-to-end performance.',
      'Review measured latency breakdowns across network, LLM, and DSP stages.',
      'Verify adherence to telecommunication audio quality standards (MOS > 4.2).',
    ],
    whatToExpect: 'Rigorous empirical validation across diverse acoustic environments.',
  },

  'help/developer': {
    title: 'Developer Tools & Code Inspector',
    whatItShows: 'Interactive source code viewer, cache management, and offline codebase bundle exporter.',
    threeSteps: [
      'Select any source file to inspect its implementation and architecture comments.',
      'Use the Reset System Cache button to clear local storage and session data.',
      'Download the self-contained Markdown bundle for offline analysis.',
    ],
    whatToExpect: 'Complete code transparency for deep architectural inspection.',
  },
  ref_code: {
    title: 'Developer Tools & Code Inspector',
    whatItShows: 'Interactive source code viewer, cache management, and offline codebase bundle exporter.',
    threeSteps: [
      'Select any source file to inspect its implementation and architecture comments.',
      'Use the Reset System Cache button to clear local storage and session data.',
      'Download the self-contained Markdown bundle for offline analysis.',
    ],
    whatToExpect: 'Complete code transparency for deep architectural inspection.',
  },

  'help/about': {
    title: 'About EchoFlow AI & Submitter',
    whatItShows: 'Project background, mission statement, and hackathon submission details.',
    threeSteps: [
      'Read the origin story and motivation behind pitch-preserving cadence normalization.',
      'Review team credentials and engineering philosophy.',
      'Access links to the GitHub repository, demo video, and documentation.',
    ],
    whatToExpect: 'Inspiring overview of technology built to make spoken communication effortless.',
  },
  ref_about: {
    title: 'About EchoFlow AI & Submitter',
    whatItShows: 'Project background, mission statement, and hackathon submission details.',
    threeSteps: [
      'Read the origin story and motivation behind pitch-preserving cadence normalization.',
      'Review team credentials and engineering philosophy.',
      'Access links to the GitHub repository, demo video, and documentation.',
    ],
    whatToExpect: 'Inspiring overview of technology built to make spoken communication effortless.',
  },

  'help/contact': {
    title: 'Contact & Enterprise Pilots',
    whatItShows: 'Direct contact channels for enterprise pilot inquiries, partnerships, and technical support.',
    threeSteps: [
      'Fill out the pilot inquiry form with organization size and call volume.',
      'Submit questions regarding custom deployment and on-premises requirements.',
      'Connect with the core engineering team for live technical demonstrations.',
    ],
    whatToExpect: 'Prompt response for enterprise pilot evaluations and technology inquiries.',
  },

  'help/self_test': {
    title: 'Self-Test Harness & Evaluation Report',
    whatItShows: 'Automated assertion testbench and manual judge checklist with verifiable report generation.',
    threeSteps: [
      'Click "Run Automated Tests" to execute live assertions against APIs, audio math, routing, and browser storage.',
      'Verify the manual checklist (microphone permissions, audio playback, video sync, telephony toggles).',
      'Download the complete verifiable evaluation report in Markdown and printable HTML format.',
    ],
    whatToExpect: 'Real deterministic assertions without hardcoded pass marks or mock metrics.',
  },
  ref_selftest: {
    title: 'Self-Test Harness & Evaluation Report',
    whatItShows: 'Automated assertion testbench and manual judge checklist with verifiable report generation.',
    threeSteps: [
      'Click "Run Automated Tests" to execute live assertions against APIs, audio math, routing, and browser storage.',
      'Verify the manual checklist (microphone permissions, audio playback, video sync, telephony toggles).',
      'Download the complete verifiable evaluation report in Markdown and printable HTML format.',
    ],
    whatToExpect: 'Real deterministic assertions without hardcoded pass marks or mock metrics.',
  },
};
