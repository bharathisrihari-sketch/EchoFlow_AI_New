import React, { useState } from 'react';
import {
  Mail,
  Send,
  Building,
  User,
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Server,
  Terminal,
  Globe,
  Clock,
  Radio,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    seats: '500-2,500 seats',
    deployment: 'Google Cloud Run Serverless',
    accentProfile: 'APAC / Indian & Southeast Asian English (High Pacing)',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-2">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-indigo-500/30 rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-800 text-xs font-mono text-indigo-300">
            <Radio className="w-3.5 h-3.5 text-indigo-400" />
            Enterprise Solutions & Hack2skill Inquiry
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Connect with the EchoFlow AI Team
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Interested in deploying EchoFlow AI across your global contact center, testing private
            Cloud Run VPC peering, or discussing the Hack2skill AI Builder Cup submission? Get in
            touch with our engineering team.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Pilot & Demo Request Form */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          {submitted ? (
            <div className="text-center py-10 space-y-4 animate-in fade-in-50 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Pilot Request Received!</h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.name || 'Valued Partner'}</strong>. Your inquiry for{' '}
                <strong>{formData.company || 'your organization'}</strong> has been registered. An
                EchoFlow Solutions Architect will reach out via <strong>{formData.email || 'your email'}</strong>{' '}
                with custom benchmark metrics and access credentials.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      company: '',
                      seats: '500-2,500 seats',
                      deployment: 'Google Cloud Run Serverless',
                      accentProfile: 'APAC / Indian & Southeast Asian English (High Pacing)',
                      message: '',
                    });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-all"
                >
                  Submit Another Request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 pb-2 border-b border-slate-800">
                <Building className="w-4 h-4 text-cyan-400" />
                Schedule a Production Pilot / Technical Briefing
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@enterprise.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Company / Organization *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Global FinTech Support Group"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Contact Center Agent Seats
                  </label>
                  <select
                    value={formData.seats}
                    onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="50-200 seats">50 – 200 seats</option>
                    <option value="200-500 seats">200 – 500 seats</option>
                    <option value="500-2,500 seats">500 – 2,500 seats</option>
                    <option value="2,500+ seats">2,500+ enterprise seats</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Target Deployment Model
                  </label>
                  <select
                    value={formData.deployment}
                    onChange={(e) => setFormData({ ...formData, deployment: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Google Cloud Run Serverless">Google Cloud Run Serverless</option>
                    <option value="Dedicated Private VPC GKE">Dedicated Private VPC (GKE)</option>
                    <option value="SIP / WebRTC PBX Trunk Relay">SIP / WebRTC PBX Trunk Relay</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Primary Accent & Cadence Challenges
                </label>
                <select
                  value={formData.accentProfile}
                  onChange={(e) => setFormData({ ...formData, accentProfile: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="APAC / Indian & Southeast Asian English (High Pacing)">
                    APAC / Indian & Southeast Asian English (High Pacing)
                  </option>
                  <option value="LATAM / Spanish & Portuguese Accent Inflection">
                    LATAM / Spanish & Portuguese Accent Inflection
                  </option>
                  <option value="EMEA / European Accents with Hesitation & Fillers">
                    EMEA / European Accents with Hesitation & Fillers
                  </option>
                  <option value="Multi-Regional Mixed BPO Center">
                    Multi-Regional Mixed BPO Center
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Additional Notes / Specific Requirements (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Share details on your current telephony stack (e.g., Genesys, Twilio, Amazon Connect, Asterisk)..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Submitting Application...' : 'Submit Enterprise Pilot Request'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Contact Details, Submitter Info & Cloud Support */}
        <div className="lg:col-span-5 space-y-6">
          {/* Submitter & Hack2skill Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Project Lead & Submitter Info
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="text-slate-400">Principal Architect & Lead Engineer:</div>
                <div className="text-sm font-bold text-slate-100 mt-0.5">Bharathi Srihari</div>
              </div>

              <div>
                <div className="text-slate-400">Primary Contact Email:</div>
                <a
                  href="mailto:bharathi.srihari@gmail.com"
                  className="text-cyan-400 font-mono text-xs hover:underline flex items-center gap-1.5 mt-0.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  bharathi.srihari@gmail.com
                </a>
              </div>

              <div>
                <div className="text-slate-400">Competition Submission:</div>
                <div className="text-emerald-400 font-semibold mt-0.5">
                  Hack2skill AI Builder Cup 2026
                </div>
              </div>

              <div>
                <div className="text-slate-400">Google Cloud Region:</div>
                <div className="text-purple-300 font-mono mt-0.5">
                  asia-southeast1 / us-central1 (Cloud Run)
                </div>
              </div>
            </div>
          </div>

          {/* Architecture & Infrastructure Endpoints */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800 flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              Gateway Deployment Endpoints
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Streaming WebSocket Relay</div>
                <div className="text-cyan-300 text-[11px] truncate mt-0.5">
                  wss://echoflow-gateway-run.app/ws/stream
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Health Probe & Metrics</div>
                <div className="text-emerald-300 text-[11px] truncate mt-0.5">
                  GET https://echoflow-gateway-run.app/health
                </div>
              </div>
            </div>
          </div>

          {/* Enterprise Compliance Assurance */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-2 text-slate-200 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Zero-Persistence Enterprise Guarantee
            </div>
            <p className="text-[11px] leading-relaxed">
              EchoFlow AI processes continuous audio chunks in ephemeral memory buffers. No audio
              payloads or customer voice recordings are written to disk or used for model retraining.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
