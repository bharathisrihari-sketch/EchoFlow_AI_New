import React, { useState, useRef, useEffect } from 'react';
import {
  Compass,
  Activity,
  PhoneCall,
  DollarSign,
  Network,
  BookOpen,
  Zap,
  HelpCircle,
  ChevronDown,
  Terminal,
  RotateCcw,
  Download,
  Info,
  Mail,
  Scale,
  Video,
  Database,
  Cloud,
  FileCode,
  Mic,
  Bot,
  Sliders,
  Server,
  Layers,
} from 'lucide-react';
import { LanguageKey } from '../types';
import { LanguageSelector } from './LanguageSelector';
import { NavSection, NavState, serializeHash } from '../config/navigation';

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

export interface TopNavItem {
  id: NavSection;
  label: string;
  sublabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultSub?: string;
}

export const TOP_NAV_ITEMS: TopNavItem[] = [
  { id: 'start', label: 'Start', icon: Compass },
  { id: 'try', label: 'Try', defaultSub: 'normalizer', icon: Activity },
  { id: 'call', label: 'Call', defaultSub: 'pbx', icon: PhoneCall },
  { id: 'value', label: 'Value', defaultSub: 'roi', icon: DollarSign },
  { id: 'how', label: 'How it works', defaultSub: 'architecture', icon: Network },
  { id: 'help', label: 'Help', defaultSub: 'manual', icon: HelpCircle },
];

export interface SubNavItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  isAction?: boolean; // e.g. Quick test modal trigger
}

export const SECTION_SUB_ITEMS: Partial<Record<NavSection, SubNavItem[]>> = {
  try: [
    { id: 'quick_test', label: 'Quick test', icon: Zap, isAction: true },
    { id: 'normalizer', label: 'Normalizer', icon: Sliders },
    { id: 'transcriber', label: 'Transcriber', icon: Mic },
    { id: 'chatbot', label: 'Chatbot', icon: Bot },
    { id: 'video', label: 'Video comparison', icon: Video },
  ],
  how: [
    { id: 'architecture', label: 'Architecture map', icon: Layers },
    { id: 'cloud', label: 'Cloud topology', icon: Server },
    { id: 'ethics', label: 'Ethics & privacy', icon: Scale },
  ],
  help: [
    { id: 'manual', label: 'User manual', icon: BookOpen },
    { id: 'benchmarks', label: '12-test benchmarks', icon: Database },
    { id: 'about', label: 'About', icon: Info },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'developer', label: 'Developer tools', icon: Terminal },
  ],
};

interface GcpConsoleNavProps {
  navState: NavState;
  onNavigate: (state: NavState) => void;
  selectedLanguage: LanguageKey;
  onLanguageChange: (lang: LanguageKey) => void;
  isStreaming: boolean;
  latencyMs: number;
  onOpenTestFeature: () => void;
  // Legacy optional props for backward compatibility
  activeTab?: AppTab;
  setActiveTab?: (tab: AppTab) => void;
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: (open: boolean) => void;
}

export const GcpConsoleNav: React.FC<GcpConsoleNavProps> = ({
  navState,
  onNavigate,
  selectedLanguage,
  onLanguageChange,
  isStreaming,
  latencyMs,
  onOpenTestFeature,
}) => {
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);
  const helpMenuRef = useRef<HTMLDivElement>(null);
  const [cacheStatus, setCacheStatus] = useState<string | null>(null);

  // Close help menu on outside click or Esc
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (helpMenuRef.current && !helpMenuRef.current.contains(e.target as Node)) {
        setIsHelpMenuOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsHelpMenuOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

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

  const currentSubItems = SECTION_SUB_ITEMS[navState.section];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 border-b border-slate-800 text-slate-200 backdrop-blur-md shadow-md">
      {/* 1. Main Top Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 gap-3">
        {/* Left: Brand Logo + Text */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#/start"
            onClick={(e) => {
              e.preventDefault();
              onNavigate({ section: 'start' });
            }}
            aria-label="EchoFlow AI Home (Start page)"
            className="flex items-center gap-2.5 rounded-lg py-1 px-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 group"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-md shadow-cyan-600/20 group-hover:scale-105 transition-all">
              <Cloud className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                EchoFlow
              </span>
              <span className="text-[11px] font-mono text-cyan-400 font-bold px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-800 hidden sm:inline">
                AI
              </span>
            </div>
          </a>
        </div>

        {/* Center: Top Navigation Items (Start | Try | Call | Value | How it works | Help) */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800"
        >
          {TOP_NAV_ITEMS.map((item) => {
            const isActive = navState.section === item.id;
            const Icon = item.icon;
            return (
              <a
                key={item.id}
                href={`#/${item.id}${item.defaultSub ? `/${item.defaultSub}` : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate({ section: item.id, sub: item.defaultSub });
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Right: Language Selector + Primary "Try it now" Button + Help Menu */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <LanguageSelector
            currentLanguage={selectedLanguage}
            onLanguageChange={onLanguageChange}
            isStreaming={isStreaming}
          />

          {/* Primary Action Button: "Try it now" */}
          <button
            onClick={onOpenTestFeature}
            aria-label="Try voice conversion now with live examples"
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400 hover:from-amber-300 hover:via-rose-400 hover:to-cyan-300 text-slate-950 font-extrabold text-xs shadow-md shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer border border-white/20 shrink-0"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Try it now</span>
          </button>

          {/* Help Menu Dropdown */}
          <div className="relative" ref={helpMenuRef}>
            <button
              onClick={() => setIsHelpMenuOpen(!isHelpMenuOpen)}
              aria-haspopup="true"
              aria-expanded={isHelpMenuOpen}
              aria-label="Help and resources menu"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Help</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isHelpMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isHelpMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1.5 z-50 text-xs text-slate-300 animate-in fade-in-50 duration-150"
              >
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 border-b border-slate-800 font-semibold">
                  DOCUMENTATION & REVIEWS
                </div>

                <a
                  href="#/help/manual"
                  role="menuitem"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsHelpMenuOpen(false);
                    onNavigate({ section: 'help', sub: 'manual' });
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-800 hover:text-cyan-300 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>User Manual</span>
                </a>

                <a
                  href="#/help/benchmarks"
                  role="menuitem"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsHelpMenuOpen(false);
                    onNavigate({ section: 'help', sub: 'benchmarks' });
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-800 hover:text-cyan-300 transition-colors"
                >
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>12-Test Benchmark Suite</span>
                </a>

                <a
                  href="#/help/about"
                  role="menuitem"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsHelpMenuOpen(false);
                    onNavigate({ section: 'help', sub: 'about' });
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-800 hover:text-cyan-300 transition-colors"
                >
                  <Info className="w-3.5 h-3.5 text-blue-400" />
                  <span>About & Submitter</span>
                </a>

                <a
                  href="#/help/contact"
                  role="menuitem"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsHelpMenuOpen(false);
                    onNavigate({ section: 'help', sub: 'contact' });
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-800 hover:text-cyan-300 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Contact & Pilots</span>
                </a>

                <div className="my-1 border-t border-slate-800" />

                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                  DEVELOPER TOOLS
                </div>

                <a
                  href="#/help/developer"
                  role="menuitem"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsHelpMenuOpen(false);
                    onNavigate({ section: 'help', sub: 'developer' });
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-800 hover:text-amber-300 transition-colors"
                >
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  <span>Code Inspector & Bundle</span>
                </a>

                <button
                  role="menuitem"
                  onClick={() => {
                    handleClearCache();
                    setIsHelpMenuOpen(false);
                  }}
                  className="w-full text-left flex items-center justify-between px-3 py-2 hover:bg-slate-800 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                    <span>Reset System Cache</span>
                  </div>
                  {cacheStatus && <span className="text-[10px] text-emerald-400 font-mono">Reset!</span>}
                </button>

                <a
                  href="/api/download-bundle"
                  download="echoflow_codebase_bundle_for_claude_chatgpt.md"
                  role="menuitem"
                  className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-800 hover:text-purple-300 transition-colors border-t border-slate-800"
                >
                  <Download className="w-3.5 h-3.5 text-purple-400" />
                  <span>Download Bundle for Claude</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Secondary Sub-Tab Bar for Sections that have sub-views (Try, How it works, Help) */}
      {currentSubItems && currentSubItems.length > 0 && (
        <div className="bg-slate-900/60 border-t border-slate-800/80 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 scrollbar-none">
            {currentSubItems.map((sub) => {
              if (sub.isAction) {
                const Icon = sub.icon || Zap;
                return (
                  <button
                    key={sub.id}
                    onClick={onOpenTestFeature}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 shrink-0 cursor-pointer"
                  >
                    <Icon className="w-3.5 h-3.5 text-amber-400" />
                    <span>{sub.label}</span>
                  </button>
                );
              }

              const isActive = (navState.sub || currentSubItems[1]?.id) === sub.id;
              const Icon = sub.icon;
              return (
                <a
                  key={sub.id}
                  href={`#/${navState.section}/${sub.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate({ section: navState.section, sub: sub.id });
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />}
                  <span>{sub.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Mobile Bottom Tab Bar (Fixed to Bottom on mobile screens) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 border-t border-slate-800 backdrop-blur-lg flex items-center justify-around py-1.5 px-2 shadow-2xl"
      >
        {TOP_NAV_ITEMS.map((item) => {
          const isActive = navState.section === item.id;
          const Icon = item.icon;
          return (
            <a
              key={item.id}
              href={`#/${item.id}${item.defaultSub ? `/${item.defaultSub}` : ''}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate({ section: item.id, sub: item.defaultSub });
              }}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>
    </header>
  );
};
