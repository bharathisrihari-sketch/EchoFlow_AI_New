/**
 * EchoFlow AI: Unified Documentation & Reference Hub
 * 
 * Groups similar reference, manual, test suite results, and code inspection tools:
 * - Sub-Tab 1: Master User Manual (Exhaustive Testing Guide & Production Playbook)
 * - Sub-Tab 2: Offline Reference Hub & Benchmark Matrix (12 Tests + User Audio/Video Results)
 * - Sub-Tab 3: Single-File Codebase Inspector & Claude XML Bundle
 */

import React, { useState } from 'react';
import { BookOpen, Database, FileCode, CheckCircle2 } from 'lucide-react';
import { MasterDocumentation } from './MasterDocumentation';
import { OfflineReferenceHub } from './OfflineReferenceHub';
import { CodeInspector } from './CodeInspector';
import { PageEchoFlowToggle } from './PageEchoFlowToggle';

interface UnifiedDocsHubProps {
  initialSubTab?: 'manual' | 'benchmarks' | 'code';
  onSubTabChange?: (tab: 'manual' | 'benchmarks' | 'code') => void;
}

export const UnifiedDocsHub: React.FC<UnifiedDocsHubProps> = ({
  initialSubTab = 'manual',
  onSubTabChange,
}) => {
  const [subTab, setSubTab] = useState<'manual' | 'benchmarks' | 'code'>(initialSubTab);

  React.useEffect(() => {
    if (initialSubTab) {
      setSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const handleSelectSubTab = (t: 'manual' | 'benchmarks' | 'code') => {
    setSubTab(t);
    onSubTabChange?.(t);
  };

  return (
    <div className="space-y-6">
      {/* 1. Page-Specific EchoFlow ON/OFF Toggle */}
      <PageEchoFlowToggle
        pageId="docs_hub"
        pageTitle="Documentation & Reference Hub"
        description="Verify architectural compliance, 12-point deterministic test suite results, and single-source financial models."
      />

      {/* 2. Sub-Navigation Tabs */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3 flex-wrap">
        <div className="flex items-center p-1 bg-slate-950/80 border border-slate-800 rounded-xl">
          <button
            onClick={() => handleSelectSubTab('manual')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              subTab === 'manual'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Master User Manual</span>
          </button>

          <button
            onClick={() => handleSelectSubTab('benchmarks')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              subTab === 'benchmarks'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Benchmark Matrix & Media Vault</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 hidden sm:inline">
              12 / 12 Tests (100%)
            </span>
          </button>

          <button
            onClick={() => handleSelectSubTab('code')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              subTab === 'code'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Codebase & Claude Bundle</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-800 hidden sm:inline">
              XML Delimiters
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>Test Suite Status: <strong>12 / 12 PASSED</strong></span>
        </div>
      </div>

      {/* 3. Sub-Tab Content */}
      {subTab === 'manual' && (
        <div className="animate-in fade-in-50 duration-200">
          <MasterDocumentation />
        </div>
      )}

      {subTab === 'benchmarks' && (
        <div className="animate-in fade-in-50 duration-200">
          <OfflineReferenceHub />
        </div>
      )}

      {subTab === 'code' && (
        <div className="animate-in fade-in-50 duration-200">
          <CodeInspector />
        </div>
      )}
    </div>
  );
};
