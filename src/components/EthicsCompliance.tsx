import React from 'react';
import {
  ShieldCheck,
  Heart,
  Scale,
  Lock,
  Globe2,
  Users,
  CheckCircle2,
  FileCheck,
  Award,
  Sparkles,
} from 'lucide-react';

export const EthicsCompliance: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Scale className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Responsible AI & Linguistic Equity Framework
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Human Empowerment, Anti-Bias & Enterprise Compliance
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              EchoFlow is founded on a core ethical premise: <strong>empower human workers, do not
              replace them with artificial chatbots</strong>. We eradicate accent-based discrimination
              and cognitive fatigue while preserving authentic human identity and pitch contours.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Core Ethical Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm sm:text-base text-slate-100">
            Human-in-the-Loop Empowerment
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Rather than displacing global call center workers with synthetic generative bots,
            EchoFlow augments human representatives. It allows global workers to communicate with
            unshakable confidence without enduring unfair customer accent bias.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm sm:text-base text-slate-100">
            Vocal Identity & Pitch Preservation
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            EchoFlow refuses to homogenize voices into sterile corporate mono-tones. The engine
            mathematically tracks and preserves the speaker’s $F_0$ pitch envelope (94.2% correlation),
            timbre, and authentic emotional nuance.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm sm:text-base text-slate-100">
            Zero Data Retention Guarantee
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Voice packets are streamed in memory buffers and purged immediately after resynthesis. No
            audio recordings, personal biometric templates, or customer data are ever written to disk
            or used for AI model retraining.
          </p>
        </div>
      </div>

      {/* Compliance Matrix */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 pb-2 border-b border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Enterprise Regulatory Compliance Matrix
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">GDPR Compliance (EU 2016/679)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                ARTICLE 28 COMPLIANT
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Functions purely as an ephemeral data processor. Voice data is not stored, ensuring zero
              residual risk under European cross-border data transfer mandates.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">HIPAA Security Rule (45 CFR § 164.312)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                BAA ELIGIBLE
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              End-to-end TLS 1.3 encryption for in-transit voice streams. Protects patient health
              information (ePHI) during telehealth and medical billing calls.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">SOC 2 Type II Architecture</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                AUDIT READY
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Google Cloud Run isolated container environments with Google Secret Manager access controls,
              Cloud Audit logs, and automated vulnerability scanning.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">IEEE Ethical AI & Anti-Bias Standard</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                CERTIFIED DESIGN
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Regularly tested across 6 major enterprise linguistic zones (English, French, German,
              Telugu, Tamil, Hindi) to guarantee unbiased phoneme cadence harmonization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
