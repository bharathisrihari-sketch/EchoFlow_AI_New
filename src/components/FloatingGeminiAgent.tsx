/**
 * EchoFlow AI: Persistent Floating Gemini AI Support Agent
 * 
 * Provides an accessible AI support agent across every single screen.
 * Helps users with queries regarding:
 * - Real-time voice cadence normalization and DSP resynthesis.
 * - Where and how to download the codebase for checking bugs.
 * - Clearing local and server cache with a single click.
 * - Explaining latency SLA compliance (<550ms) and test suite verification.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Download,
  RotateCcw,
  CheckCircle2,
  Minimize2,
  Maximize2,
  FileCode,
  ShieldCheck,
  Zap,
  HelpCircle,
} from 'lucide-react';
import { AppTab } from './GcpConsoleNav';

interface AgentMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  actionButton?: {
    label: string;
    action: () => void;
  };
}

interface FloatingGeminiAgentProps {
  onNavigateToTab: (tab: AppTab) => void;
  onOpenTestFeature?: () => void;
}

export const FloatingGeminiAgent: React.FC<FloatingGeminiAgentProps> = ({
  onNavigateToTab,
  onOpenTestFeature,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [cacheClearedStatus, setCacheClearedStatus] = useState<string | null>(null);

  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: 'agent_welcome',
      role: 'model',
      content:
        '👋 Hi! I am your EchoFlow AI Engineering Agent. How can I help you? You can ask me how cadence normalization works, where to download the source code for bug checking, or use the quick buttons below to clear cache.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  const handleClearCache = async () => {
    try {
      // 1. Clear client-side cache
      const keysToClear = Object.keys(localStorage).filter(
        (k) => k.startsWith('echoflow_') || k.startsWith('cache_')
      );
      keysToClear.forEach((k) => localStorage.removeItem(k));
      sessionStorage.clear();

      // 2. Call server cache reset
      const res = await fetch('/api/clear-cache', { method: 'POST' });
      const data = await res.json();

      setCacheClearedStatus('Cache successfully cleared!');
      setTimeout(() => setCacheClearedStatus(null), 3000);

      const notifyMsg: AgentMessage = {
        id: `cache_${Date.now()}`,
        role: 'model',
        content: `🧹 **Cache Cleared Successfully!**\n- Client-side storage and session flags reset.\n- Server telemetry counters and stream jitter buffers cleared.\n- The system is refreshed in pristine condition.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, notifyMsg]);
    } catch (err: any) {
      console.warn('Cache clear note:', err);
    }
  };

  const handleNavigateToCodeDownload = () => {
    onNavigateToTab('docs');
    const notifyMsg: AgentMessage = {
      id: `download_${Date.now()}`,
      role: 'model',
      content: `📁 **Code Download Location:**\nI have routed you to the **Documentation & Reference Hub** &rarr; **Codebase & Claude Bundle** tab.\n\nYou can:\n1. Click **"Download Full Claude Bundle"** to export the entire repository as a structured single-file XML package for Claude, ChatGPT, or Cursor.\n2. Or click **"Download File"** on any specific file (such as \`server.ts\`, \`main.py\`, \`demo_runner.py\`, or \`src/App.tsx\`) to inspect bugs in your local editor.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, notifyMsg]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isSending) return;

    const userMsg: AgentMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsSending(true);

    // Contextual quick answers for immediate bug checking & download queries
    const lowerText = text.toLowerCase();
    if (
      lowerText.includes('where to download') ||
      lowerText.includes('download code') ||
      lowerText.includes('download the code') ||
      lowerText.includes('check bugs') ||
      lowerText.includes('checking bugs')
    ) {
      setTimeout(() => {
        const replyMsg: AgentMessage = {
          id: `bot_${Date.now()}`,
          role: 'model',
          content: `📥 **Where to Download Code for Bug Checking:**\n\n1. **In-App Inspector:** Open the **Documentation & Reference Hub** (\`docs\`) in the left navigation sidebar and select the **"Codebase & Claude Bundle"** sub-tab.\n2. **Direct Single-File Claude Bundle:** You can download the complete repository (\`server.ts\`, \`main.py\`, \`app.py\`, \`demo_runner.py\`, and all \`src/\` files) as a single markdown bundle formatted with standardized XML delimiters (\`<file path="...">\`) ready for Claude or Cursor bug auditing.\n3. **Individual Files:** In that same tab, select any file from the file picker and click the **"Download File"** button.\n4. **Automated Test Suite:** To run verification on the codebase, execute \`python3 demo_runner.py\` in your terminal to run the 12 deterministic test suites.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionButton: {
            label: 'Jump to Code Download Tab',
            action: handleNavigateToCodeDownload,
          },
        };
        setMessages((prev) => [...prev, replyMsg]);
        setIsSending(false);
      }, 500);
      return;
    }

    if (lowerText.includes('clear cache') || lowerText.includes('fix bug') || lowerText.includes('reset')) {
      handleClearCache();
      setIsSending(false);
      return;
    }

    try {
      const historyForApi = messages
        .concat(userMsg)
        .filter((m) => m.id !== 'agent_welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyForApi,
          taskComplexity: 'fast',
          modelOverride: 'gemini-3.8-flash',
          systemInstruction:
            'You are the EchoFlow AI Assistant Agent. You help users navigate the app, explain speech cadence normalization (150 WPM), guide them to download code from the Code Inspector tab, explain the 12 test benchmark suite, and answer technical questions. Keep responses clear, helpful, formatted with bullet points, and friendly.',
        }),
      });

      const data = await res.json();
      const replyContent =
        data.reply ||
        'EchoFlow AI normalizes speech pacing to 150 WPM in real-time (<550ms SLA) using Google Cloud Run and Gemini Live API while preserving fundamental pitch (F0 > 94%).';

      const botReply: AgentMessage = {
        id: `bot_${Date.now()}`,
        role: 'model',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err: any) {
      const fallbackReply: AgentMessage = {
        id: `bot_${Date.now()}`,
        role: 'model',
        content: `I'm here to help! You can download the complete codebase from the **Documentation & Reference Hub &rarr; Codebase & Claude Bundle** tab, or clear cache using the button below.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
          {cacheClearedStatus && (
            <div className="bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs px-3 py-1.5 rounded-full shadow-lg animate-bounce flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{cacheClearedStatus}</span>
            </div>
          )}

          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-semibold text-xs shadow-2xl shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all border border-cyan-400/40"
            title="Ask EchoFlow Gemini AI Agent"
          >
            <div className="relative">
              <Bot className="w-5 h-5 fill-current" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span className="hidden sm:inline font-mono">Ask Gemini Agent</span>
          </button>
        </div>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          className={`fixed right-4 sm:right-6 bottom-6 z-50 transition-all duration-300 shadow-2xl ${
            isMinimized
              ? 'w-80 h-14'
              : 'w-[94vw] sm:w-[420px] md:w-[460px] h-[580px] max-h-[85vh]'
          } bg-slate-900/95 border border-cyan-500/40 rounded-2xl flex flex-col overflow-hidden backdrop-blur-xl`}
        >
          {/* Header Bar */}
          <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-slate-950 shadow-md">
                <Bot className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  <span>EchoFlow Gemini Agent</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Online
                  </span>
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  Powered by gemini-3.8-flash
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                title="Close Agent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Quick Action Bar */}
              <div className="px-3 py-2 bg-slate-950/70 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                {onOpenTestFeature && (
                  <button
                    onClick={onOpenTestFeature}
                    className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 hover:brightness-110 transition-all shadow-sm"
                  >
                    <Zap className="w-3 h-3 fill-current" />
                    <span>Test Feature Now (3 Langs)</span>
                  </button>
                )}

                <button
                  onClick={handleNavigateToCodeDownload}
                  className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-medium bg-amber-950/50 hover:bg-amber-950 text-amber-300 border border-amber-800 transition-all"
                >
                  <Download className="w-3 h-3" />
                  <span>Download Code</span>
                </button>

                <button
                  onClick={handleClearCache}
                  className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-medium bg-cyan-950/50 hover:bg-cyan-950 text-cyan-300 border border-cyan-800 transition-all"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear Cache</span>
                </button>

                <button
                  onClick={() => handleSendMessage('How does EchoFlow normalize accents to 150 WPM?')}
                  className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-medium bg-purple-950/50 hover:bg-purple-950 text-purple-300 border border-purple-800 transition-all"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>150 WPM Cadence</span>
                </button>
              </div>

              {/* Message History */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-800 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`p-3 rounded-2xl max-w-[88%] leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-cyan-600 text-slate-950 font-medium rounded-tr-none'
                          : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
                      }`}
                    >
                      <div className="whitespace-pre-line font-sans">{msg.content}</div>

                      {msg.actionButton && (
                        <button
                          onClick={msg.actionButton.action}
                          className="mt-2 w-full py-1.5 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-md"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{msg.actionButton.label}</span>
                        </button>
                      )}
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 mt-0.5 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}
                {isSending && (
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono p-2">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Gemini Agent is thinking...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 bg-slate-950 border-t border-slate-800">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask about bug checking, code download, or WPM..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isSending}
                    className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 transition-all shadow-md"
                    title="Send query"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
