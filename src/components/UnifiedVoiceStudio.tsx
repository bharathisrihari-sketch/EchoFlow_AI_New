/**
 * EchoFlow AI: Unified Voice Normalization & AI Studio
 * 
 * Groups similar audio and speech AI functions into a clean, intuitive workspace:
 * - Sub-Tab 1: Live Voice Normalizer (150 WPM DSP & Dialect Matrix)
 * - Sub-Tab 2: Audio Transcription Studio (gemini-3.5-transcribe)
 * - Sub-Tab 3: Gemini Cadence AI Chatbot (Multi-Turn Architecture)
 */

import React, { useState } from 'react';
import { Activity, Mic, Bot, Sparkles, Sliders } from 'lucide-react';
import { AudioTestbench } from './AudioTestbench';
import { AudioTranscriber } from './AudioTranscriber';
import { GeminiCadenceChatbot } from './GeminiCadenceChatbot';
import { DualWaveformCanvas } from './DualWaveformCanvas';
import { TelemetryHUD } from './TelemetryHUD';
import { PageEchoFlowToggle } from './PageEchoFlowToggle';
import { TelemetryData, LanguageKey } from '../types';

interface UnifiedVoiceStudioProps {
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
  isPlayingAudio: boolean;
  initialSubTab?: 'normalizer' | 'transcriber' | 'chatbot';
  onSubTabChange?: (tab: 'normalizer' | 'transcriber' | 'chatbot') => void;
}

export const UnifiedVoiceStudio: React.FC<UnifiedVoiceStudioProps> = ({
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
  isPlayingAudio,
  initialSubTab = 'normalizer',
  onSubTabChange,
}) => {
  const [subTab, setSubTab] = useState<'normalizer' | 'transcriber' | 'chatbot'>(initialSubTab);
  const [isEchoFlowActiveOnPage, setIsEchoFlowActiveOnPage] = useState<boolean>(true);

  // Sync sub-tab whenever initialSubTab changes from parent
  React.useEffect(() => {
    if (initialSubTab) {
      setSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const handleSelectSubTab = (t: 'normalizer' | 'transcriber' | 'chatbot') => {
    setSubTab(t);
    onSubTabChange?.(t);
  };

  return (
    <div className="space-y-6">
      {/* 1. Page-Specific EchoFlow ON/OFF Toggle */}
      <PageEchoFlowToggle
        pageId="voice_studio"
        pageTitle="Voice Normalization Studio"
        description="Toggle live cadence normalization, cognitive filler suppression, and pitch preservation on or off for this entire studio."
        onToggleChange={(active) => setIsEchoFlowActiveOnPage(active)}
      />

      {/* 2. Sub-Navigation Tabs */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3 flex-wrap">
        <div className="flex items-center p-1 bg-slate-950/80 border border-slate-800 rounded-xl">
          <button
            onClick={() => handleSelectSubTab('normalizer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              subTab === 'normalizer'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>150 WPM Live Normalizer</span>
          </button>

          <button
            onClick={() => handleSelectSubTab('transcriber')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              subTab === 'transcriber'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Audio Transcription Studio</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 hidden sm:inline">
              gemini-3.5
            </span>
          </button>

          <button
            onClick={() => handleSelectSubTab('chatbot')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              subTab === 'chatbot'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Cadence AI Assistant</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-400 border border-indigo-800 hidden sm:inline">
              Multi-turn
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Active Dialect: <strong>{selectedLanguage}</strong></span>
        </div>
      </div>

      {/* 3. Sub-Tab Content */}
      {subTab === 'normalizer' && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          {/* Dual Waveform & Frequency Canvas */}
          <DualWaveformCanvas
            isStreaming={isStreaming}
            isPlayingAudio={isPlayingAudio}
            targetWpm={isEchoFlowActiveOnPage ? targetWpm : telemetry.originalPaceWpm}
            currentWpm={telemetry.originalPaceWpm}
            latencyMs={telemetry.latencyMs}
          />

          {/* Real-time Telemetry HUD */}
          <TelemetryHUD telemetry={telemetry} />

          {/* Interactive Dialect Scenarios & Mic Testbench */}
          <AudioTestbench
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
            fillerSuppression={isEchoFlowActiveOnPage ? fillerSuppression : false}
            setFillerSuppression={setFillerSuppression}
            onAudioPlayStateChange={onAudioPlayStateChange}
            selectedLanguage={selectedLanguage}
            onLanguageSelect={onLanguageSelect}
          />
        </div>
      )}

      {subTab === 'transcriber' && (
        <div className="animate-in fade-in-50 duration-200">
          <AudioTranscriber onNormalizeTranscript={() => setSubTab('normalizer')} />
        </div>
      )}

      {subTab === 'chatbot' && (
        <div className="animate-in fade-in-50 duration-200">
          <GeminiCadenceChatbot />
        </div>
      )}
    </div>
  );
};
