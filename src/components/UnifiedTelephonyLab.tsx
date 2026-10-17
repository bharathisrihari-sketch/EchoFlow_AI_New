/**
 * EchoFlow AI: Unified Telephony & Media Simulation Lab
 * 
 * Groups similar media comparison and contact center telephony features:
 * - Sub-Tab 1: Side-by-Side Video & Audio Stream Comparison (with real user uploads & regional matrix)
 * - Sub-Tab 2: Interactive PBX Call Simulator (Twilio/Genesys SIP Trunking & AHT Compression)
 */

import React, { useState } from 'react';
import { Video, PhoneCall, Sparkles, Sliders } from 'lucide-react';
import { VideoComparison } from './VideoComparison';
import { PbxCallSimulator } from './PbxCallSimulator';
import { PageEchoFlowToggle } from './PageEchoFlowToggle';

interface UnifiedTelephonyLabProps {
  initialSubTab?: 'video' | 'pbx';
}

export const UnifiedTelephonyLab: React.FC<UnifiedTelephonyLabProps> = ({
  initialSubTab = 'video',
}) => {
  const [subTab, setSubTab] = useState<'video' | 'pbx'>(initialSubTab);
  const [isEchoFlowActiveOnPage, setIsEchoFlowActiveOnPage] = useState<boolean>(true);

  return (
    <div className="space-y-6">
      {/* 1. Page-Specific EchoFlow ON/OFF Toggle */}
      <PageEchoFlowToggle
        pageId="telephony_lab"
        pageTitle="Telephony & Media Simulation Lab"
        description="Toggle EchoFlow cadence normalization on or off across both video comparisons and PBX call center simulations."
        onToggleChange={(active) => setIsEchoFlowActiveOnPage(active)}
      />

      {/* 2. Sub-Navigation Tabs */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3 flex-wrap">
        <div className="flex items-center p-1 bg-slate-950/80 border border-slate-800 rounded-xl">
          <button
            onClick={() => setSubTab('video')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              subTab === 'video'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Side-by-Side Video & Audio Comparison</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-950 text-purple-400 border border-purple-800 hidden sm:inline">
              Audible Sync
            </span>
          </button>

          <button
            onClick={() => setSubTab('pbx')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              subTab === 'pbx'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Interactive PBX Call Simulator</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 hidden sm:inline">
              AHT -18.5%
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Telephony Bridge: <strong>Twilio / Genesys G.711 & PCM16</strong></span>
        </div>
      </div>

      {/* 3. Sub-Tab Content */}
      {subTab === 'video' && (
        <div className="animate-in fade-in-50 duration-200">
          <VideoComparison />
        </div>
      )}

      {subTab === 'pbx' && (
        <div className="animate-in fade-in-50 duration-200">
          <PbxCallSimulator />
        </div>
      )}
    </div>
  );
};
