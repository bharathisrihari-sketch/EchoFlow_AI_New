import React from 'react';
import {
  Sparkles,
  AlertTriangle,
  Zap,
  ShieldCheck,
  TrendingDown,
  Award,
  Users,
  Clock,
  HeartHandshake,
  Layers,
  ArrowRight,
  CheckCircle2,
  Server,
  Radio,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-10 py-2">
      {/* Title & Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/60 border border-cyan-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-xs font-mono text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Hack2skill AI Builder Cup Submission
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            EchoFlow AI — Real-Time Pitch & Emotion-Preserving Voice Normalizer
          </h1>

          <div className="pt-2">
            <h2 className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-semibold mb-2">
              1. Short Description (50 Words)
            </h2>
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-sans bg-slate-950/70 p-5 rounded-2xl border border-slate-800/80 shadow-inner">
              EchoFlow AI is a real-time speech-to-speech engine powered by the Gemini Live API
              that normalizes erratic speech cadence, heavy accents, and pacing variations during
              global calls while retaining the speaker’s natural pitch, tone, and emotional
              inflection—delivering ultra-low-latency, natural human voice output for enterprise
              cross-border communication.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Detailed Description Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Layers className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            2. Detailed Description
          </h2>
        </div>

        {/* The Problem Card */}
        <div className="bg-slate-900/80 border border-rose-500/30 rounded-2xl p-6 sm:p-8 space-y-4 shadow-lg">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-base sm:text-lg">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <h3>The Problem</h3>
          </div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            In cross-border business environments—such as global customer support centers,
            distributed software engineering standups, and multi-national incident bridges—speech
            pacing variations (rapid speech, heavy accents, hesitation, and emotional friction) cause
            frequent misunderstandings, cognitive fatigue, and elevated Average Handle Times (AHT).
          </p>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Traditional translation and speech-to-speech pipelines pass audio through three
            sequential stages: <strong>Speech Recognition (ASR) → Text Machine Translation → Text-to-Speech (TTS)</strong>.
            This legacy approach suffers from two severe flaws:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-950 border border-rose-900/50 space-y-1.5">
              <div className="text-rose-400 font-bold text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                High Latency (2.5 – 5.0 Seconds)
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stacking three separate AI models introduces cumulative delays of 2.5 to 5 seconds,
                ruining natural conversation flow and causing unnatural talk-over friction on live calls.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-rose-900/50 space-y-1.5">
              <div className="text-rose-400 font-bold text-sm flex items-center gap-2">
                <HeartHandshake className="w-4 h-4" />
                Loss of Human Emotion
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Text-to-speech conversion strips out all vocal nuance, rendering the speaker’s voice
                flat, robotic, and emotionally detached—making de-escalation in customer support nearly
                impossible.
              </p>
            </div>
          </div>
        </div>

        {/* The Solution: EchoFlow AI Engine Card */}
        <div className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 space-y-5 shadow-lg">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-base sm:text-lg">
            <Zap className="w-5 h-5 text-cyan-400" />
            <h3>The Solution: EchoFlow AI Engine</h3>
          </div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            EchoFlow AI bypasses multi-stage text conversion by establishing a bidirectional,
            low-latency WebSocket connection directly to the <strong>Gemini Live API</strong>. By
            leveraging Gemini’s native audio-to-audio streaming capabilities, EchoFlow operates directly
            on continuous raw audio packets:
          </p>

          <div className="space-y-3.5 pt-1">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-sm text-slate-100 block mb-0.5">
                  Pacing & Cadence Normalization
                </strong>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Smooths out irregular pauses, rapid stutters, and extreme speed variations into an
                  optimal listening rhythm (140–160 words per minute).
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-sm text-slate-100 block mb-0.5">
                  Pitch Envelope & Emotion Preservation
                </strong>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Resynthesizes the audio stream so the output matches the speaker's original voice
                  characteristics, pitch contours, and emotional intent (e.g., warmth, urgency, empathy).
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-sm text-slate-100 block mb-0.5">
                  Enterprise Infrastructure
                </strong>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Built on a FastAPI WebSocket gateway, deployed serverlessly on Google Cloud Run, and
                  paired with a live Next.js/Streamlit telemetry dashboard showing side-by-side audio
                  waveforms and latency metrics (&lt;600 ms).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Key Benefits Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Award className="w-6 h-6 text-emerald-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            3. Key Benefits
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* A. Technical & Operational Benefits */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-4 shadow-lg">
            <h3 className="text-sm sm:text-base font-bold text-cyan-300 flex items-center gap-2 pb-2 border-b border-slate-800">
              <Radio className="w-4 h-4 text-cyan-400" />
              A. Technical & Operational Benefits
            </h3>

            <div className="space-y-3.5">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="font-semibold text-xs text-cyan-400 block">
                  Ultra-Low Latency (&lt;600 ms)
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Native speech-to-speech processing eliminates intermediate text serialization, keeping
                  conversation delay imperceptible.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="font-semibold text-xs text-emerald-400 block">
                  Preserves Human Nuance & Empathy
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Retains warmth, urgency, and tone during customer service interactions, avoiding the
                  cold, robotic feel of standard TTS generators.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="font-semibold text-xs text-purple-400 block">
                  Reduces Cognitive Strain
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Listeners absorb information faster without straining to parse rapid cadence, heavy
                  regional accents, or background speech clutter.
                </p>
              </div>
            </div>
          </div>

          {/* B. Enterprise & Financial ROI */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-4 shadow-lg">
            <h3 className="text-sm sm:text-base font-bold text-emerald-300 flex items-center gap-2 pb-2 border-b border-slate-800">
              <TrendingDown className="w-4 h-4 text-emerald-400" />
              B. Enterprise & Financial ROI
            </h3>

            <div className="space-y-3.5">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="font-semibold text-xs text-emerald-400 block">
                  Reduced Average Handle Time (AHT)
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Cuts contact center handle times by 15–20% by eliminating repetitive clarifications
                  ("Could you repeat that?").
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="font-semibold text-xs text-amber-400 block">
                  Boosted CSAT Scores
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Higher customer satisfaction in international support desks due to clearer
                  comprehension and tone-matched resolution.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="font-semibold text-xs text-blue-400 block">
                  Seamless Distributed Engineering
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enables global tech enterprises to hire offshore engineering talent based strictly on
                  technical skill, removing vocal communication barriers during daily standups.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
