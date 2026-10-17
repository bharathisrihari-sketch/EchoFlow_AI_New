/**
 * EchoFlow AI: Real-Time Pitch & Emotion-Preserving Voice Normalizer
 * Hack2skill AI Builder Cup Submission
 * Powered by Gemini Live API & Google Cloud Run
 */

import React, { useState, useEffect } from 'react';
import { GcpConsoleNav, AppTab } from './components/GcpConsoleNav';
import { JudgeGuideView } from './components/JudgeGuideView';
import { QuickTestView } from './components/QuickTestView';
import { MyVoiceView } from './components/MyVoiceView';
import { NearLiveView } from './components/NearLiveView';
import { RecommendedTestOrder } from './components/RecommendedTestOrder';
import { SelfTestView } from './components/SelfTestView';
import { UnifiedVoiceStudio } from './components/UnifiedVoiceStudio';
import { VideoComparison } from './components/VideoComparison';
import { PbxCallSimulator } from './components/PbxCallSimulator';
import { RoiCalculator } from './components/RoiCalculator';
import { TelephonyAndGcp } from './components/TelephonyAndGcp';
import { CascadingSitemap } from './components/CascadingSitemap';
import { EthicsCompliance } from './components/EthicsCompliance';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { MasterDocumentation } from './components/MasterDocumentation';
import { OfflineReferenceHub } from './components/OfflineReferenceHub';
import { CodeInspector } from './components/CodeInspector';
import { FirebaseAuthBar } from './components/FirebaseAuthBar';
import { GlobalTelemetryBar } from './components/GlobalTelemetryBar';
import { FloatingGeminiAgent } from './components/FloatingGeminiAgent';
import { HowPageWorksPanel } from './components/HowPageWorksPanel';
import { NavigationStepper, NextStepFooterButton } from './components/NavigationStepper';
import { FirstVisitWelcomeModal } from './components/FirstVisitWelcomeModal';
import { TelemetryData, LanguageKey } from './types';
import { getStoredLanguage, setStoredLanguage, LANGUAGE_CONFIGS } from './config/languages';
import {
  NavState,
  NavSection,
  parseHash,
  serializeHash,
  LEGACY_TAB_MAP,
  PAGE_GUIDES,
} from './config/navigation';
import {
  ChevronRight,
  Server,
  AlertTriangle,
  Play,
  ArrowRight,
  Zap,
} from 'lucide-react';

export default function App() {
  // Navigation state synchronized with URL hash
  const [navState, setNavState] = useState<NavState>(() => {
    if (typeof window !== 'undefined') {
      return parseHash(window.location.hash);
    }
    return { section: 'start', screen: 'judge_guide' };
  });

  const [isStreaming, setIsStreaming] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Persistent Language State
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageKey>(() => getStoredLanguage());

  // DSP & Normalization Tuning State
  const [targetWpm, setTargetWpm] = useState(() => {
    const lang = getStoredLanguage();
    return LANGUAGE_CONFIGS[lang]?.targetPaceWpm || 150;
  });
  const [pitchRetention, setPitchRetention] = useState(94);
  const [voicePersona, setVoicePersona] = useState('Puck');
  const [fillerSuppression, setFillerSuppression] = useState(true);

  // Real-Time Telemetry State: Starts in idle state without fake constants
  const [telemetry, setTelemetry] = useState<TelemetryData>(() => {
    const lang = getStoredLanguage();
    const cfg = LANGUAGE_CONFIGS[lang];
    return {
      latencyMs: 0,
      targetPaceWpm: cfg?.targetPaceWpm || 150,
      originalPaceWpm: 0,
      cadenceVarianceReduction: 0,
      pitchPreservationIndex: 94,
      phoneticIntelligibilityLift: 0,
      bufferHealth: 'optimal',
      jitterMs: 0,
      packetCount: 0,
      activeLanguage: lang,
      pacingStrategy: cfg?.pacingStrategy || 'Syllable Stress Regularization',
      hasActiveSession: false,
      latencyBreakdown: {
        ingestion: 0,
        geminiLiveRelay: 0,
        resynthesisDsp: 0,
        jitterBuffer: 0,
      },
    };
  });

  // Track visited step numbers for JudgeGuideView
  const [visitedStepList, setVisitedStepList] = useState<number[]>([0]);

  // Sync telemetry with /api/stats when available
  useEffect(() => {
    let isMounted = true;
    const fetchBackendStats = async () => {
      try {
        const res = await fetch('/api/stats');
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data.activeStreams > 0 || (data.latency_stats && data.latency_stats.count > 0)) {
            setTelemetry((prev) => ({
              ...prev,
              hasActiveSession: data.activeStreams > 0,
              latencyMs: data.avgLatencyMs || data.latency_stats?.mean_ms || prev.latencyMs,
              packetCount: data.processedPackets || prev.packetCount,
            }));
          }
        }
      } catch {
        // ignore
      }
    };

    fetchBackendStats();
    const timer = setInterval(fetchBackendStats, 5000);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseHash(window.location.hash);
      setNavState(parsed);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when navState changes programmatically
  const handleNavigate = (state: NavState) => {
    setNavState(state);
    const newHash = serializeHash(state);
    if (window.location.hash !== newHash) {
      window.location.hash = newHash;
    }
  };

  // Backwards-compatible navigation handler for child components that pass legacy AppTab
  const handleLegacyNavigate = (tab: AppTab | string) => {
    const mapped = LEGACY_TAB_MAP[tab] || { section: 'start', screen: 'judge_guide' };
    handleNavigate(mapped);
  };

  // Handler for numbered steps (1-9) from JudgeGuideView and RecommendedTestOrder
  const handleStepNavigate = (stepNumber: number) => {
    setVisitedStepList((prev) => (prev.includes(stepNumber) ? prev : [...prev, stepNumber]));
    switch (stepNumber) {
      case 0:
        handleNavigate({ section: 'start', screen: 'judge_guide' });
        break;
      case 1:
        handleNavigate({ section: 'try', sub: 'quick_test', screen: 'quick_test' });
        break;
      case 2:
        handleNavigate({ section: 'try', sub: 'normalizer', screen: 'normalizer' });
        break;
      case 3:
        handleNavigate({ section: 'try', sub: 'my_voice', screen: 'my_voice' });
        break;
      case 4:
        handleNavigate({ section: 'try', sub: 'video', screen: 'video' });
        break;
      case 5:
        handleNavigate({ section: 'try', sub: 'near_live', screen: 'near_live' });
        break;
      case 6:
        handleNavigate({ section: 'call', sub: 'pbx', screen: 'call' });
        break;
      case 7:
        handleNavigate({ section: 'value', sub: 'roi', screen: 'roi' });
        break;
      case 8:
        handleNavigate({ section: 'how', sub: 'architecture', screen: 'how' });
        break;
      case 9:
        handleNavigate({ section: 'how', sub: 'ethics', screen: 'trust' });
        break;
      default:
        handleNavigate({ section: 'start', screen: 'judge_guide' });
    }
  };

  const handleLanguageChange = (newLang: LanguageKey) => {
    setSelectedLanguage(newLang);
    setStoredLanguage(newLang);
    const cfg = LANGUAGE_CONFIGS[newLang];
    if (cfg) {
      setTargetWpm(cfg.targetPaceWpm);
      setTelemetry((prev) => ({
        ...prev,
        targetPaceWpm: cfg.targetPaceWpm,
        activeLanguage: newLang,
        pacingStrategy: cfg.pacingStrategy,
        systemInstructionPreview: cfg.systemInstruction.slice(0, 100) + '...',
      }));
    }
  };

  // Breadcrumbs title helpers
  const getSectionTitle = (sec: NavSection): string => {
    switch (sec) {
      case 'start':
        return '0. Presenter Guide';
      case 'try':
        return 'Voice Normalization';
      case 'call':
        return '6. In a Call';
      case 'value':
        return '7. Business Value';
      case 'how':
        return 'How It Works';
      case 'help':
        return 'Reference & Diagnostics';
      case 'not_found':
        return 'Page Not Found';
      default:
        return 'EchoFlow AI';
    }
  };

  const getSubTitle = (nav: NavState): string => {
    if (!nav.sub) return '';
    const key = `${nav.section}/${nav.sub}`;
    return PAGE_GUIDES[key]?.title || nav.sub;
  };

  // Sync document.title
  useEffect(() => {
    const sub = getSubTitle(navState);
    const sec = getSectionTitle(navState.section);
    document.title = sub ? `${sub} | EchoFlow AI` : `${sec} | EchoFlow AI`;
  }, [navState]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. First-Visit Welcome Modal */}
      <FirstVisitWelcomeModal
        onStartTour={() => handleNavigate({ section: 'start', screen: 'judge_guide' })}
      />

      {/* 2. Left Sidebar (Desktop) + Mobile Drawer */}
      <GcpConsoleNav
        navState={navState}
        onNavigate={handleNavigate}
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
        isStreaming={isStreaming}
        latencyMs={telemetry.latencyMs}
      />

      {/* 3. Main Application Column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Header / Sub-Header: Breadcrumbs & Gateway Service Status */}
        <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px] truncate">
            <span className="text-slate-300">Google Cloud</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-slate-300">EchoFlow AI</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-cyan-400 font-semibold">{getSectionTitle(navState.section)}</span>
            {navState.sub && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-600" />
                <span className="text-emerald-400 font-semibold">{getSubTitle(navState)}</span>
              </>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Server className="w-3 h-3 text-slate-400" />
              <span>Cloud Run Gateway</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className={isStreaming ? "text-cyan-400 font-bold" : "text-slate-500 font-medium"}>
              {isStreaming ? 'Gemini Live Bidi Active' : 'No active session'}
            </span>
          </div>
        </div>

        {/* 4. Firebase Authentication Status Bar */}
        <FirebaseAuthBar />

        {/* 5. Telemetry HUD Bar */}
        <GlobalTelemetryBar
          telemetry={telemetry}
          isStreaming={isStreaming}
          onNavigateToStudio={() => handleNavigate({ section: 'try', sub: 'normalizer' })}
          currentTab={navState.section as any}
        />

        {/* 6. Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Progress Stepper ("Step X of 5") */}
          {navState.section !== 'not_found' && (
            <NavigationStepper
              navState={navState}
              onNavigate={handleNavigate}
            />
          )}

          {/* PAGE NOT FOUND (404) - Requirement 6 */}
          {navState.section === 'not_found' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center space-y-4 max-w-md mx-auto my-12 shadow-2xl animate-in fade-in-50">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-white">Route Not Found (404)</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                The requested URL path <code className="text-cyan-400 bg-slate-950 px-2 py-0.5 rounded font-mono">#{navState.notFoundPath || 'unknown'}</code> does not map to any recognized EchoFlow screen.
              </p>
              <button
                onClick={() => handleNavigate({ section: 'start', screen: 'judge_guide' })}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <span>Return to 0. Presenter Guide</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* SECTION 0: START (Judge Guide & Evaluation Matrix) */}
          {navState.section === 'start' && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              {/* Plain-Language How This Page Works Panel */}
              <HowPageWorksPanel pageKey="start" />

              {/* Orphaned Component Rendered: JudgeGuideView */}
              <JudgeGuideView
                onNavigateToStep={handleStepNavigate}
                visitedSteps={visitedStepList}
              />

              {/* Next Step Footer Button */}
              <NextStepFooterButton currentSection="start" onNavigate={handleNavigate} />
            </div>
          )}

          {/* SECTION 1-5: TRY (Quick test, Normalizer, My Voice, Video, Near-live) */}
          {navState.section === 'try' && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              {navState.sub === 'quick_test' ? (
                <>
                  <HowPageWorksPanel pageKey="try/quick_test" />
                  <QuickTestView />
                </>
              ) : navState.sub === 'my_voice' ? (
                <>
                  <HowPageWorksPanel pageKey="try/my_voice" />
                  <MyVoiceView />
                </>
              ) : navState.sub === 'video' ? (
                <>
                  <HowPageWorksPanel pageKey="try/video" />
                  <VideoComparison />
                </>
              ) : navState.sub === 'near_live' ? (
                <>
                  <HowPageWorksPanel pageKey="try/near_live" />
                  <NearLiveView />
                </>
              ) : (
                <>
                  <HowPageWorksPanel pageKey={`try/${navState.sub || 'normalizer'}`} />
                  <UnifiedVoiceStudio
                    isStreaming={isStreaming}
                    setIsStreaming={setIsStreaming}
                    telemetry={telemetry}
                    setTelemetry={setTelemetry}
                    targetWpm={targetWpm}
                    setTargetWpm={setTargetWpm}
                    pitchRetention={pitchRetention}
                    setPitchRetention={setPitchRetention}
                    voicePersona={voicePersona}
                    setVoicePersona={setVoicePersona}
                    fillerSuppression={fillerSuppression}
                    setFillerSuppression={setFillerSuppression}
                    onAudioPlayStateChange={setIsPlayingAudio}
                    selectedLanguage={selectedLanguage}
                    onLanguageSelect={handleLanguageChange}
                    isPlayingAudio={isPlayingAudio}
                    initialSubTab={
                      navState.sub === 'transcriber'
                        ? 'transcriber'
                        : navState.sub === 'chatbot'
                        ? 'chatbot'
                        : 'normalizer'
                    }
                    onSubTabChange={(sub) => handleNavigate({ section: 'try', sub })}
                  />
                </>
              )}

              {/* Next Step Footer Button */}
              <NextStepFooterButton currentSection="try" onNavigate={handleNavigate} />
            </div>
          )}

          {/* SECTION 6: CALL (PBX Simulator) */}
          {navState.section === 'call' && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <HowPageWorksPanel pageKey="call" />
              <PbxCallSimulator />
              <NextStepFooterButton currentSection="call" onNavigate={handleNavigate} />
            </div>
          )}

          {/* SECTION 7: VALUE (ROI Calculator) */}
          {navState.section === 'value' && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <HowPageWorksPanel pageKey="value" />
              <RoiCalculator />
              <NextStepFooterButton currentSection="value" onNavigate={handleNavigate} />
            </div>
          )}

          {/* SECTION 8 & 9: HOW IT WORKS (Architecture, Cloud Topology, Trust & Ethics) */}
          {navState.section === 'how' && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <HowPageWorksPanel pageKey={`how/${navState.sub || 'architecture'}`} />

              {navState.sub === 'cloud' ? (
                <TelephonyAndGcp />
              ) : navState.sub === 'ethics' ? (
                <EthicsCompliance />
              ) : (
                <CascadingSitemap onNavigateToTab={(t) => handleLegacyNavigate(t)} />
              )}

              <NextStepFooterButton currentSection="how" onNavigate={handleNavigate} />
            </div>
          )}

          {/* REFERENCE SECTIONS: HELP (Manual, Test Order, Benchmarks, Code Inspector, About, Self-test) */}
          {navState.section === 'help' && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <HowPageWorksPanel pageKey={`help/${navState.sub || 'manual'}`} />

              {navState.sub === 'self_test' ? (
                <SelfTestView />
              ) : navState.sub === 'test_order' ? (
                <RecommendedTestOrder onNavigateToStep={handleStepNavigate} />
              ) : navState.sub === 'benchmarks' ? (
                <OfflineReferenceHub />
              ) : navState.sub === 'developer' ? (
                <CodeInspector />
              ) : navState.sub === 'about' ? (
                <AboutPage />
              ) : navState.sub === 'contact' ? (
                <ContactPage />
              ) : (
                <MasterDocumentation />
              )}
            </div>
          )}
        </main>

        {/* Floating Gemini AI Engineering Agent */}
        <FloatingGeminiAgent
          onNavigateToTab={(t) => handleLegacyNavigate(t)}
          onOpenTestFeature={() => handleNavigate({ section: 'try', sub: 'quick_test' })}
        />
      </div>
    </div>
  );
}
