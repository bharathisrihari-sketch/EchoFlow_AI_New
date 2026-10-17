import React, { useState } from 'react';
import {
  Menu,
  X,
  Compass,
  Activity,
  Sparkles,
  PhoneCall,
  Video,
  DollarSign,
  Server,
  Network,
  Scale,
  BookOpen,
  Database,
  FileCode,
  Info,
  Mail,
  Search,
  Terminal,
  ChevronDown,
  Cloud,
  ChevronRight,
  ShieldCheck,
  Zap,
  Mic,
  Bot,
  Download,
  RotateCcw,
} from 'lucide-react';
import { LanguageKey } from '../types';
import { LanguageSelector } from './LanguageSelector';

export type AppTab =
  | 'tour'
  | 'studio'
  | 'telephony_lab'
  | 'roi'
  | 'telephony_gcp'
  | 'sitemap'
  | 'docs'
  | 'ethics'
  | 'about'
  | 'contact'
  | 'demo'
  | 'transcribe'
  | 'chatbot'
  | 'video'
  | 'pbx'
  | 'guide'
  | 'reference_hub'
  | 'code';

interface NavItem {
  id: AppTab;
  title: string;
  badge?: string;
  badgeColor?: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const GCP_NAV_SECTIONS: NavSection[] = [
  {
    title: 'WORKSPACE & TESTING',
    items: [
      { id: 'tour', title: 'Guided Tour & Roadmap', badge: 'Onboarding & Flow', badgeColor: 'bg-cyan-900 text-cyan-300', icon: Compass },
      { id: 'studio', title: 'Voice Normalization Studio', badge: '150 WPM + AI Suite', badgeColor: 'bg-emerald-950 text-emerald-300', icon: Activity },
      { id: 'telephony_lab', title: 'Media & PBX Simulation Lab', badge: 'Video + Call Trunk', badgeColor: 'bg-purple-950 text-purple-300', icon: Video },
    ],
  },
  {
    title: 'ENTERPRISE SOLUTIONS',
    items: [
      { id: 'roi', title: 'Enterprise ROI & Economics', badge: '$2.49M–$3.23M/yr', badgeColor: 'bg-amber-950 text-amber-300', icon: DollarSign },
      { id: 'telephony_gcp', title: 'Cloud Run Topology & Webhooks', badge: '< 550ms SLA', badgeColor: 'bg-blue-950 text-blue-300', icon: Server },
      { id: 'sitemap', title: 'Architectural System Map', badge: 'Optimized Flow', badgeColor: 'bg-slate-800 text-slate-300', icon: Network },
    ],
  },
  {
    title: 'KNOWLEDGE & COMPLIANCE',
    items: [
      { id: 'docs', title: 'Documentation & Reference Hub', badge: '12 Tests + Manual', badgeColor: 'bg-indigo-950 text-indigo-300', icon: BookOpen },
      { id: 'ethics', title: 'Linguistic Equity & Anti-Bias', badge: 'GDPR / HIPAA', badgeColor: 'bg-emerald-950 text-emerald-300', icon: Scale },
    ],
  },
  {
    title: 'SUPPORT & PILOTS',
    items: [
      { id: 'about', title: 'About & Submitter Profile', icon: Info },
      { id: 'contact', title: 'Enterprise Pilot Inquiry', icon: Mail },
    ],
  },
];

interface GcpConsoleNavProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  isStreaming: boolean;
  latencyMs: number;
  selectedLanguage: LanguageKey;
  onLanguageChange: (lang: LanguageKey) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  onOpenTestFeature: () => void;
}

export const GcpConsoleNav: React.FC<GcpConsoleNavProps> = ({
  activeTab,
  setActiveTab,
  isStreaming,
  latencyMs,
  selectedLanguage,
  onLanguageChange,
  isSidebarOpen,
  setIsSidebarOpen,
  onOpenTestFeature,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [cacheStatus, setCacheStatus] = useState<string | null>(null);

  const handleClearCache = async () => {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith('echoflow_') || k.startsWith('cache_'))
        .forEach((k) => localStorage.removeItem(k));
      sessionStorage.clear();
      await fetch('/api/clear-cache', { method: 'POST' });
      setCacheStatus('Cache Reset!');
      setTimeout(() => setCacheStatus(null), 2500);
    } catch (e) {
      console.warn('Cache clear note:', e);
    }
  };

  return (
    <>
      {/* GCP Console Top Bar */}
      <header className="sticky top-0 z-50 h-14 bg-slate-950 border-b border-slate-800 text-slate-200 flex items-center justify-between px-3 sm:px-4 shadow-md backdrop-blur-md">
        {/* Left: Hamburger + GCP Brand + Project Pill */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all focus:outline-none"
            title="Toggle Google Cloud Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => setActiveTab('studio')}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 shadow-md">
              <Cloud className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:flex items-center gap-1.5 font-bold text-sm text-white">
              <span>Google Cloud</span>
              <span className="text-slate-400 font-normal">|</span>
              <span className="text-cyan-400 font-extrabold tracking-tight">EchoFlow AI</span>
            </div>
          </div>

          {/* GCP Project Selector Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:border-slate-700 transition-all cursor-pointer">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-[11px] text-slate-400">Project:</span>
            <span className="font-semibold text-slate-200">echoflow-prod-apac</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products, resources, dialects (/) ..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all font-sans"
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Language Selector + SLA Badge + Cloud Shell & Help */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Primary Action: Test Feature Now Button */}
          <button
            onClick={onOpenTestFeature}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400 hover:from-amber-300 hover:via-rose-400 hover:to-cyan-300 text-slate-950 font-extrabold text-xs shadow-md shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20 shrink-0 animate-pulse"
            title="Open Live 3-Language Feature Testbench (English, Tamil, Telugu)"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span className="font-mono font-bold tracking-tight">Test Feature Now</span>
          </button>

          <LanguageSelector
            currentLanguage={selectedLanguage}
            onLanguageChange={onLanguageChange}
            isStreaming={isStreaming}
          />

          {/* Live Latency Status Badge (Clickable link to Telemetry Studio) */}
          <button
            onClick={() => setActiveTab('studio')}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-xs transition-all cursor-pointer group"
            title="Click to view full Live Telemetry & Waveform Studio"
          >
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
            <span className="font-mono text-[11px] text-slate-300 group-hover:text-cyan-300">
              {isStreaming ? `LIVE ${latencyMs}ms` : 'TELEMETRY 418ms'}
            </span>
          </button>

          {/* Download Code for Claude / ChatGPT */}
          <a
            href="/api/download-bundle"
            download="echoflow_codebase_bundle_for_claude_chatgpt.md"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold transition-all"
            title="Download complete codebase formatted for Claude & ChatGPT (<file path=...> tags)"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>Code for Claude / ChatGPT</span>
          </a>

          {/* Download Code & Bug Checker Button (Opens Inspector) */}
          <button
            onClick={() => setActiveTab('code')}
            className={`p-2 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-900 transition-all ${
              activeTab === 'code' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : ''
            }`}
            title="Inspect Code & Claude/ChatGPT Bundle in-app"
          >
            <Terminal className="w-4 h-4" />
          </button>

          {/* Clear Cache & Reset Button */}
          <button
            onClick={handleClearCache}
            className="p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-900 transition-all relative"
            title="Clear Cache & Reset System State"
          >
            <RotateCcw className="w-4 h-4" />
            {cacheStatus && (
              <span className="absolute -bottom-8 right-0 bg-emerald-950 text-emerald-300 border border-emerald-500 text-[10px] font-mono px-2 py-0.5 rounded shadow-lg whitespace-nowrap animate-fade-in">
                {cacheStatus}
              </span>
            )}
          </button>

          {/* Gemini AI Agent Chatbot Button */}
          <button
            onClick={() => setActiveTab('chatbot')}
            className={`p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-900 transition-all ${
              activeTab === 'chatbot' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : ''
            }`}
            title="Open Gemini AI Chatbot & Agent"
          >
            <Bot className="w-4 h-4" />
          </button>

          {/* Cloud Shell Icon (Links to Code) */}
          <button
            onClick={() => setActiveTab('code')}
            className={`p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-all ${
              activeTab === 'code' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : ''
            }`}
            title="Open Cloud Shell & Codebase Deliverables"
          >
            <Terminal className="w-4 h-4" />
          </button>

          {/* Help & Documentation (Links to Guide) */}
          <button
            onClick={() => setActiveTab('guide')}
            className={`p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-all ${
              activeTab === 'guide' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : ''
            }`}
            title="Master Documentation & Help"
          >
            <BookOpen className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* GCP Left Sidebar Drawer */}
      <aside
        className={`fixed top-14 left-0 bottom-0 z-40 bg-slate-950 border-r border-slate-800/90 transition-all duration-300 flex flex-col shadow-2xl ${
          isSidebarOpen ? 'w-64 sm:w-72' : 'w-0 -translate-x-full lg:w-16 lg:translate-x-0'
        }`}
      >
        {/* Navigation Categories and Items */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-5 scrollbar-thin scrollbar-thumb-slate-800">
          {GCP_NAV_SECTIONS.map((section, sIdx) => {
            const visibleItems = section.items.filter((item) =>
              item.title.toLowerCase().includes(searchFilter.toLowerCase())
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={sIdx} className="space-y-1">
                {isSidebarOpen ? (
                  <div className="px-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                    {section.title}
                  </div>
                ) : (
                  <div className="h-[1px] bg-slate-800 mx-2 my-2" />
                )}

                <div className="space-y-0.5">
                  {visibleItems.map((item) => {
                    const isSelected = activeTab === item.id;
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          if (window.innerWidth < 1024) {
                            setIsSidebarOpen(false);
                          }
                        }}
                        className={`w-full text-left rounded-xl transition-all flex items-center group ${
                          isSidebarOpen ? 'px-3 py-2 justify-between gap-2.5' : 'p-3 justify-center'
                        } ${
                          isSelected
                            ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                        }`}
                        title={item.title}
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-colors ${
                              isSelected
                                ? 'text-cyan-400'
                                : 'text-slate-400 group-hover:text-slate-200'
                            }`}
                          />
                          {isSidebarOpen && (
                            <span className="text-xs truncate font-medium">
                              {item.title}
                            </span>
                          )}
                        </div>

                        {isSidebarOpen && item.badge && (
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.2 rounded shrink-0 font-bold ${
                              item.badgeColor || 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer with Cloud Run Status */}
        {isSidebarOpen ? (
          <div className="p-3 border-t border-slate-800/80 bg-slate-900/60 text-xs">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Cloud Run Host</span>
              </span>
              <span className="text-cyan-400 font-bold">READY</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1 truncate">
              asia-southeast1 • Gemini Live TPU
            </div>
          </div>
        ) : (
          <div className="p-3 border-t border-slate-800/80 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
        )}
      </aside>

      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
        />
      )}
    </>
  );
};
