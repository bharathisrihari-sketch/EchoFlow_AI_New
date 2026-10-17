import React from 'react';
import {
  Activity,
  Radio,
  Video,
  DollarSign,
  Network,
  Info,
  Mail,
  Code,
  PhoneCall,
  Server,
  Scale,
  Sparkles,
  BookOpen,
  Compass,
} from 'lucide-react';
import { LanguageKey } from '../types';
import { LanguageSelector } from './LanguageSelector';

export type AppTab =
  | 'tour'
  | 'studio'
  | 'demo'
  | 'guide'
  | 'pbx'
  | 'video'
  | 'roi'
  | 'telephony_gcp'
  | 'sitemap'
  | 'ethics'
  | 'about'
  | 'contact'
  | 'code';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  isStreaming: boolean;
  latencyMs: number;
  selectedLanguage: LanguageKey;
  onLanguageChange: (lang: LanguageKey) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isStreaming,
  latencyMs,
  selectedLanguage,
  onLanguageChange,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand Logo & Title */}
          <div
            onClick={() => setActiveTab('studio')}
            className="flex items-center gap-3 cursor-pointer shrink-0"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 p-[1px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Radio
                  className={`w-5 h-5 ${
                    isStreaming ? 'text-cyan-400 animate-pulse' : 'text-slate-300'
                  }`}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  EchoFlow AI
                </span>
                <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                  <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                  Gemini Live Bidi
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Voice Cadence & Accent Normalizer
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 overflow-x-auto py-1 scrollbar-none">
            <button
              onClick={() => setActiveTab('tour')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'tour'
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-md shadow-cyan-500/25 ring-1 ring-white/20'
                  : 'bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800/80'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-cyan-300 animate-spin-slow" />
              <span>✨ Show Features</span>
            </button>

            <button
              onClick={() => setActiveTab('studio')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === 'studio'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('demo')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'demo'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/50 shadow-md shadow-cyan-500/10'
                  : 'text-cyan-400/80 hover:text-cyan-300 hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Demo Tour</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'guide'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/50 shadow-md shadow-indigo-500/10'
                  : 'text-indigo-400/80 hover:text-indigo-300 hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Master Guide</span>
            </button>

            <button
              onClick={() => setActiveTab('pbx')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === 'pbx'
                  ? 'bg-blue-500/15 text-blue-300 border border-blue-500/40 shadow-sm shadow-blue-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>PBX Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('video')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === 'video'
                  ? 'bg-pink-500/15 text-pink-300 border border-pink-500/40 shadow-sm shadow-pink-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video Compare</span>
            </button>

            <button
              onClick={() => setActiveTab('roi')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === 'roi'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>ROI Engine</span>
            </button>

            <button
              onClick={() => setActiveTab('telephony_gcp')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === 'telephony_gcp'
                  ? 'bg-teal-500/15 text-teal-300 border border-teal-500/40 shadow-sm shadow-teal-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Telephony & GCP</span>
              <span className="sm:hidden">GCP</span>
            </button>

            <button
              onClick={() => setActiveTab('sitemap')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === 'sitemap'
                  ? 'bg-purple-500/15 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Sitemap</span>
            </button>

            <button
              onClick={() => setActiveTab('ethics')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === 'ethics'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ethics & Bias</span>
              <span className="sm:hidden">Ethics</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === 'about'
                  ? 'bg-blue-500/15 text-blue-300 border border-blue-500/40 shadow-sm shadow-blue-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>About</span>
            </button>

            <button
              onClick={() => setActiveTab('contact')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === 'contact'
                  ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === 'code'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Files</span>
            </button>
          </nav>

          {/* Persistent Language Selector & Live Telemetry Pill */}
          <div className="flex items-center gap-2.5 shrink-0">
            <LanguageSelector
              currentLanguage={selectedLanguage}
              onLanguageChange={onLanguageChange}
              isStreaming={isStreaming}
            />

            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                    isStreaming ? 'bg-cyan-400 opacity-75' : 'bg-emerald-400 opacity-75'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isStreaming ? 'bg-cyan-500' : 'bg-emerald-500'
                  }`}
                />
              </span>
              <span className="text-slate-300 font-mono text-[11px]">
                {isStreaming ? `LIVE ${latencyMs}ms` : 'GATEWAY READY'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
