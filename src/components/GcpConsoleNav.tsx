import React, { useState, useEffect } from 'react';
import {
  Compass,
  Zap,
  Sliders,
  Mic,
  Video,
  Radio,
  PhoneCall,
  DollarSign,
  Layers,
  Scale,
  BookOpen,
  ListOrdered,
  Database,
  Terminal,
  Info,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  RotateCcw,
  Download,
  Cloud,
  CheckSquare,
  Bot,
  Server,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { LanguageKey } from '../types';
import { LanguageSelector } from './LanguageSelector';
import { NavSection, NavState, ScreenId } from '../config/navigation';

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

export interface SidebarNumberedItem {
  index: number;
  id: string;
  label: string;
  estTime: string;
  section: NavSection;
  sub?: string;
  screen: ScreenId;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  subTabs?: { id: string; label: string; icon: React.ComponentType<{ className?: string }> }[];
}

export const SIDEBAR_ITEMS: SidebarNumberedItem[] = [
  {
    index: 0,
    id: 'judge_guide',
    label: 'Presenter guide',
    estTime: '1 min',
    section: 'start',
    screen: 'judge_guide',
    icon: Compass,
    highlight: true,
  },
  {
    index: 1,
    id: 'quick_test',
    label: 'Quick test',
    estTime: '1 min',
    section: 'try',
    sub: 'quick_test',
    screen: 'quick_test',
    icon: Zap,
  },
  {
    index: 2,
    id: 'normalizer',
    label: 'Normalizer & languages',
    estTime: '1 min',
    section: 'try',
    sub: 'normalizer',
    screen: 'normalizer',
    icon: Sliders,
    subTabs: [
      { id: 'normalizer', label: 'Normalizer', icon: Sliders },
      { id: 'transcriber', label: 'Transcriber', icon: Mic },
      { id: 'chatbot', label: 'Chatbot', icon: Bot },
    ],
  },
  {
    index: 3,
    id: 'my_voice',
    label: 'My voice',
    estTime: '1 min',
    section: 'try',
    sub: 'my_voice',
    screen: 'my_voice',
    icon: Mic,
  },
  {
    index: 4,
    id: 'video',
    label: 'Video comparison',
    estTime: '1 min',
    section: 'try',
    sub: 'video',
    screen: 'video',
    icon: Video,
  },
  {
    index: 5,
    id: 'near_live',
    label: 'Near-live',
    estTime: '1 min',
    section: 'try',
    sub: 'near_live',
    screen: 'near_live',
    icon: Radio,
  },
  {
    index: 6,
    id: 'call',
    label: 'In a call',
    estTime: '1 min',
    section: 'call',
    sub: 'pbx',
    screen: 'call',
    icon: PhoneCall,
  },
  {
    index: 7,
    id: 'roi',
    label: 'Business value',
    estTime: '1 min',
    section: 'value',
    sub: 'roi',
    screen: 'roi',
    icon: DollarSign,
  },
  {
    index: 8,
    id: 'how',
    label: 'How it works',
    estTime: '1 min',
    section: 'how',
    sub: 'architecture',
    screen: 'how',
    icon: Layers,
    subTabs: [
      { id: 'architecture', label: 'Architecture map', icon: Layers },
      { id: 'cloud', label: 'Cloud topology', icon: Server },
    ],
  },
  {
    index: 9,
    id: 'trust',
    label: 'Trust & privacy',
    estTime: '1 min',
    section: 'how',
    sub: 'ethics',
    screen: 'trust',
    icon: Scale,
  },
];

export interface ReferenceItem {
  id: string;
  label: string;
  section: NavSection;
  sub: string;
  screen: ScreenId;
  icon: React.ComponentType<{ className?: string }>;
}

export const REFERENCE_ITEMS: ReferenceItem[] = [
  { id: 'manual', label: 'Manual', section: 'help', sub: 'manual', screen: 'ref_manual', icon: BookOpen },
  { id: 'test_order', label: 'Recommended test order', section: 'help', sub: 'test_order', screen: 'ref_test_order', icon: ListOrdered },
  { id: 'benchmarks', label: '12-test benchmarks', section: 'help', sub: 'benchmarks', screen: 'ref_benchmarks', icon: Database },
  { id: 'developer', label: 'Code inspector', section: 'help', sub: 'developer', screen: 'ref_code', icon: Terminal },
  { id: 'about', label: 'About & contact', section: 'help', sub: 'about', screen: 'ref_about', icon: Info },
  { id: 'self_test', label: 'Self-test & Report', section: 'help', sub: 'self_test', screen: 'ref_selftest', icon: CheckSquare },
];

interface GcpConsoleNavProps {
  navState: NavState;
  onNavigate: (state: NavState) => void;
  selectedLanguage: LanguageKey;
  onLanguageChange: (lang: LanguageKey) => void;
  isStreaming: boolean;
  latencyMs: number;
  onOpenTestFeature?: () => void;
  // Legacy optional props
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
}) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('echoflow_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });
  const [isRefExpanded, setIsRefExpanded] = useState<boolean>(() => {
    try {
      return localStorage.getItem('echoflow_ref_expanded') === 'true';
    } catch {
      return false;
    }
  });

  // Visited screens tracking (0-9)
  const [visitedScreens, setVisitedScreens] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem('echoflow_visited_screens');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return { 0: true };
  });

  const [cacheStatus, setCacheStatus] = useState<string | null>(null);

  // Automatically mark current screen as visited
  useEffect(() => {
    const currentItem = SIDEBAR_ITEMS.find((item) => {
      if (item.sub) {
        return item.section === navState.section && item.sub === navState.sub;
      }
      return item.section === navState.section;
    });

    if (currentItem !== undefined) {
      setVisitedScreens((prev) => {
        if (prev[currentItem.index]) return prev;
        const next = { ...prev, [currentItem.index]: true };
        try {
          localStorage.setItem('echoflow_visited_screens', JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    }
  }, [navState]);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('echoflow_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  const toggleRefExpanded = () => {
    setIsRefExpanded((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('echoflow_ref_expanded', String(next));
      } catch {}
      return next;
    });
  };

  const handleResetProgress = () => {
    const reset = { 0: true };
    setVisitedScreens(reset);
    try {
      localStorage.setItem('echoflow_visited_screens', JSON.stringify(reset));
    } catch {}
  };

  const handleClearCache = async () => {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith('echoflow_') || k.startsWith('cache_'))
        .forEach((k) => localStorage.removeItem(k));
      sessionStorage.clear();
      await fetch('/api/clear-cache', { method: 'POST' });
      setCacheStatus('Reset!');
      setTimeout(() => setCacheStatus(null), 2500);
    } catch (e) {
      console.warn('Cache clear:', e);
    }
  };

  // Calculate viewed count (0-9: 10 items)
  const viewedCount = Object.keys(visitedScreens).filter((k) => visitedScreens[Number(k)]).length;
  const progressPercent = Math.round((viewedCount / 10) * 100);

  const isItemActive = (item: SidebarNumberedItem) => {
    if (item.sub) {
      return navState.section === item.section && navState.sub === item.sub;
    }
    return navState.section === item.section;
  };

  const isRefItemActive = (item: ReferenceItem) => {
    return navState.section === item.section && navState.sub === item.sub;
  };

  const renderSidebarContent = (inDrawer: boolean = false) => (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-slate-800 shrink-0">
        <a
          href="#/start"
          onClick={(e) => {
            e.preventDefault();
            onNavigate({ section: 'start', screen: 'judge_guide' });
            if (inDrawer) setIsMobileDrawerOpen(false);
          }}
          className="flex items-center gap-2.5 focus:outline-none group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Cloud className="w-4 h-4" />
          </div>
          {(!isCollapsed || inDrawer) && (
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                EchoFlow
              </span>
              <span className="text-[10px] font-mono text-cyan-400 font-bold px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-800">
                AI
              </span>
            </div>
          )}
        </a>

        {!inDrawer ? (
          <button
            onClick={toggleCollapsed}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors cursor-pointer"
          >
            {isCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        ) : (
          <button
            onClick={() => setIsMobileDrawerOpen(false)}
            aria-label="Close menu drawer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Presenter Progress Indicator */}
      {(!isCollapsed || inDrawer) && (
        <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800/80 text-xs shrink-0 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Presenter Evaluation:</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-cyan-300">{viewedCount} of 10 viewed</span>
              <button
                onClick={handleResetProgress}
                title="Reset progress checks"
                className="text-[10px] text-slate-500 hover:text-rose-400 cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Nav List (Scrollable) */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
        {/* Section Header */}
        {(!isCollapsed || inDrawer) && (
          <div className="px-2 pb-1 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
            Presenter Evaluation Path
          </div>
        )}

        {/* Numbered Items 0-9 */}
        {SIDEBAR_ITEMS.map((item) => {
          const active = isItemActive(item);
          const visited = !!visitedScreens[item.index];
          const Icon = item.icon;

          return (
            <div key={item.id} className="space-y-0.5">
              <a
                href={`#/${item.section}${item.sub ? `/${item.sub}` : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate({ section: item.section, sub: item.sub, screen: item.screen });
                  if (inDrawer) setIsMobileDrawerOpen(false);
                }}
                title={isCollapsed && !inDrawer ? `${item.index}. ${item.label} (${item.estTime})` : undefined}
                className={`group flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  active
                    ? item.highlight
                      ? 'bg-gradient-to-r from-amber-500/25 via-cyan-500/20 to-indigo-500/20 text-cyan-200 border border-cyan-400/50 shadow-md shadow-cyan-500/10'
                      : 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 shadow-sm'
                    : item.highlight
                    ? 'text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 hover:text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center font-mono font-bold text-[11px] shrink-0 ${
                      active
                        ? 'bg-cyan-400 text-slate-950'
                        : item.highlight
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                    }`}
                  >
                    {item.index}
                  </span>

                  {(!isCollapsed || inDrawer) && (
                    <span className="truncate font-sans">{item.label}</span>
                  )}
                </div>

                {(!isCollapsed || inDrawer) && (
                  <div className="flex items-center gap-1.5 shrink-0 ml-1">
                    <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-400">
                      {item.estTime}
                    </span>
                    {visited && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-950/50" />
                    )}
                  </div>
                )}
              </a>

              {/* Sub-tabs if active */}
              {active && item.subTabs && (!isCollapsed || inDrawer) && (
                <div className="ml-7 pl-2 border-l border-slate-800 space-y-1 py-1">
                  {item.subTabs.map((subTab) => {
                    const isSubActive = navState.sub === subTab.id;
                    const SubIcon = subTab.icon;
                    return (
                      <button
                        key={subTab.id}
                        onClick={() => {
                          onNavigate({ section: item.section, sub: subTab.id });
                          if (inDrawer) setIsMobileDrawerOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                          isSubActive
                            ? 'text-cyan-300 bg-cyan-950/60 font-semibold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                        }`}
                      >
                        <SubIcon className="w-3 h-3 text-cyan-400" />
                        <span>{subTab.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Collapsible Reference Group */}
        <div className="pt-2">
          {(!isCollapsed || inDrawer) ? (
            <button
              onClick={toggleRefExpanded}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isRefExpanded ? 'rotate-90' : ''}`} />
                <span>Reference</span>
              </div>
              <span className="text-[10px] text-slate-500 lowercase">({REFERENCE_ITEMS.length})</span>
            </button>
          ) : (
            <div className="border-t border-slate-800 my-2" />
          )}

          {(isRefExpanded || (isCollapsed && !inDrawer)) && (
            <div className={`space-y-0.5 mt-1 ${!isCollapsed || inDrawer ? 'pl-2' : ''}`}>
              {REFERENCE_ITEMS.map((refItem) => {
                const active = isRefItemActive(refItem);
                const RefIcon = refItem.icon;
                return (
                  <a
                    key={refItem.id}
                    href={`#/${refItem.section}/${refItem.sub}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate({ section: refItem.section, sub: refItem.sub, screen: refItem.screen });
                      if (inDrawer) setIsMobileDrawerOpen(false);
                    }}
                    title={isCollapsed && !inDrawer ? refItem.label : undefined}
                    className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      active
                        ? 'bg-slate-800 text-cyan-300 font-semibold border border-slate-700'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <RefIcon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-cyan-400' : 'text-slate-500'}`} />
                    {(!isCollapsed || inDrawer) && (
                      <span className="truncate">{refItem.label}</span>
                    )}
                  </a>
                );
              })}

              {/* Local Backup Codebase Bundle Download Link */}
              <a
                href="/api/download-bundle"
                download
                title="Download complete codebase bundle as single Markdown file"
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-cyan-300 hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                {(!isCollapsed || inDrawer) && (
                  <span className="truncate">Local Backup (.md)</span>
                )}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Footer Controls */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 shrink-0 space-y-2">
        {(!isCollapsed || inDrawer) ? (
          <>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-mono text-slate-400">Language:</span>
              <LanguageSelector
                currentLanguage={selectedLanguage}
                onLanguageChange={onLanguageChange}
                isStreaming={isStreaming}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
              <button
                onClick={handleClearCache}
                className="hover:text-cyan-400 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{cacheStatus || 'Reset Cache'}</span>
              </button>
              <span>v2.4 Hackathon</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleClearCache}
              title="Reset Cache"
              className="p-1.5 rounded text-slate-400 hover:text-cyan-300 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Left Sidebar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 border-r border-slate-800 sticky top-0 h-screen transition-all duration-200 z-30 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {renderSidebarContent(false)}
      </aside>

      {/* 2. Mobile Sticky Header Bar */}
      <header className="md:hidden sticky top-0 z-40 bg-slate-950/95 border-b border-slate-800 px-4 h-14 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            aria-label="Open navigation menu drawer"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <a
            href="#/start"
            onClick={(e) => {
              e.preventDefault();
              onNavigate({ section: 'start', screen: 'judge_guide' });
            }}
            className="flex items-center gap-2"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white">
              <Cloud className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-sm text-white">EchoFlow AI</span>
          </a>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSelector
            currentLanguage={selectedLanguage}
            onLanguageChange={onLanguageChange}
            isStreaming={isStreaming}
          />
        </div>
      </header>

      {/* 3. Mobile Slide-out Drawer with Backdrop Overlay */}
      {isMobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileDrawerOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Pane */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10">
            {renderSidebarContent(true)}
          </div>
        </div>
      )}
    </>
  );
};
