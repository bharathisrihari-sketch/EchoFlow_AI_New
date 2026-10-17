import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Zap,
  Brain,
  RotateCcw,
  User,
  ShieldCheck,
  CheckCircle,
  Clock,
  Layers,
} from 'lucide-react';
import { auth, db } from '../firebase/config';
import { collection, addDoc, query, orderBy, getDocs, limit } from 'firebase/firestore';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  model: string;
  timestamp: string;
}

const CHATBOT_ROLES = [
  {
    id: 'architect',
    title: 'Voice Cadence Architect',
    description: 'Expert in real-time prosody normalization, WPM smoothing, and Live API streaming.',
    systemInstruction:
      'You are the EchoFlow Voice Cadence Architect. You specialize in speech rate normalization (140-160 WPM), low-latency WebSockets, Gemini Live API bidirectional streaming, and conversational lag elimination. Provide clear, technical, concise explanations.',
  },
  {
    id: 'telephony',
    title: 'Contact Center AHT Consultant',
    description: 'Specialist in enterprise PBX, AHT compression, loops reduction, and seat ROI models.',
    systemInstruction:
      'You are the EchoFlow Contact Center Telephony Consultant. You analyze Average Handle Time (AHT), Customer Satisfaction (CSAT), multi-lingual agent fatigue, and single-source ROI calculations ($2.49M-$3.2M enterprise savings).',
  },
  {
    id: 'dsp',
    title: 'Acoustic DSP & Pitch Specialist',
    description: 'Specialist in fundamental frequency (F0) tracking, Pearson correlation, and vocal timbre retention.',
    systemInstruction:
      'You are the EchoFlow Acoustic DSP Specialist. You explain fundamental pitch tracking (F0), Pearson r correlation (0.942), 16kHz linear PCM frame slicing (20ms/640 bytes), and stateless volatile RAM privacy.',
  },
];

const QUICK_PROMPTS = [
  'How does EchoFlow compress cadence to 150 WPM without sounding robotic?',
  'Explain the difference between Gemini Live Bidi and traditional ASR-MT-TTS cascades.',
  'How does the single-source ROI model calculate $2,499,000 net annual savings?',
  'What is the fundamental pitch (F0) retention index and how is 0.942 Pearson r verified?',
];

export const GeminiCadenceChatbot: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState(CHATBOT_ROLES[0]);
  const [taskComplexity, setTaskComplexity] = useState<'fast' | 'general' | 'complex'>('general');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content:
        'Hello! I am your EchoFlow AI Voice Engineering Consultant. Ask me anything about real-time speech cadence normalization, Gemini Live API bidirectional audio relays, enterprise PBX telephony integration, or acoustic pitch retention.',
      model: 'gemini-3.5-flash',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Model name corresponding to task complexity
  const activeModel =
    taskComplexity === 'complex'
      ? 'gemini-3.1-pro-preview'
      : taskComplexity === 'fast'
      ? 'gemini-3.1-flash-lite'
      : 'gemini-3.5-flash';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isSending) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text,
      model: activeModel,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsSending(true);

    try {
      const historyForApi = messages
        .concat(userMsg)
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyForApi,
          taskComplexity,
          modelOverride: activeModel,
          systemInstruction: selectedRole.systemInstruction,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to get chat response');
      }

      const botReply: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'model',
        content: data.reply,
        model: data.model || activeModel,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botReply]);

      // Save to Firestore if user is authenticated
      const user = auth.currentUser;
      if (user) {
        try {
          await addDoc(collection(db, 'users', user.uid, 'chat_messages'), {
            userId: user.uid,
            role: 'user',
            content: text,
            model: activeModel,
            timestamp: new Date().toISOString(),
          });
          await addDoc(collection(db, 'users', user.uid, 'chat_messages'), {
            userId: user.uid,
            role: 'model',
            content: data.reply,
            model: data.model || activeModel,
            timestamp: new Date().toISOString(),
          });
        } catch (dbErr) {
          console.warn('Firestore chat save note:', dbErr);
        }
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'model',
        content: `Error generating response: ${err.message}. Please verify Gemini API key configuration.`,
        model: activeModel,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome_reset',
        role: 'model',
        content: `Conversation reset. Role: ${selectedRole.title}. How can I assist you with voice normalization today?`,
        model: activeModel,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col h-[700px] overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-slate-950 shadow-md">
              <Bot className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <span>EchoFlow Gemini Chatbot</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                  {activeModel}
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Multi-turn conversational reasoning powered by Gemini
              </p>
            </div>
          </div>

          {/* Model / Complexity Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setTaskComplexity('fast')}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all flex items-center gap-1 ${
                taskComplexity === 'fast'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Fast Tasks: gemini-3.1-flash-lite"
            >
              <Zap className="w-3 h-3 fill-current" />
              <span>Fast (Lite)</span>
            </button>
            <button
              onClick={() => setTaskComplexity('general')}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all flex items-center gap-1 ${
                taskComplexity === 'general'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="General Tasks: gemini-3.5-flash"
            >
              <Sparkles className="w-3 h-3 fill-current" />
              <span>General (3.5-Flash)</span>
            </button>
            <button
              onClick={() => setTaskComplexity('complex')}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all flex items-center gap-1 ${
                taskComplexity === 'complex'
                  ? 'bg-indigo-500 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Complex Tasks: gemini-3.1-pro-preview"
            >
              <Brain className="w-3 h-3" />
              <span>Complex (3.1-Pro)</span>
            </button>
          </div>
        </div>

        {/* Chatbot Role Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-900 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-mono">Chatbot Role:</span>
            {CHATBOT_ROLES.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  selectedRole.id === role.id
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {role.title}
              </button>
            ))}
          </div>

          <button
            onClick={handleClearChat}
            className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1 font-mono transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Thread</span>
          </button>
        </div>
      </div>

      {/* Scrollable Conversation Thread */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  isUser
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gradient-to-tr from-cyan-500 to-indigo-600 text-slate-950 font-bold'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 fill-current" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none font-sans'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1 text-[10px] font-mono opacity-70">
                  <span>{isUser ? 'You' : selectedRole.title}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {!isUser && (
                  <div className="mt-2 pt-1 border-t border-slate-800/80 text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Model: {msg.model}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {isSending && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic font-mono pl-10">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Gemini ({activeModel}) is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px]">
        <span className="text-slate-500 font-mono shrink-0">Suggestions:</span>
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="shrink-0 px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors truncate max-w-xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
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
            placeholder={`Ask ${selectedRole.title} (${activeModel})...`}
            className="flex-1 p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-sans"
          />
          <button
            type="submit"
            disabled={isSending || !inputText.trim()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-40 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
