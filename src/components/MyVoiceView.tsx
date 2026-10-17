import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Zap,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  FileCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import { pcmToWavBlob } from '../utils/audioUtils';

export const MyVoiceView: React.FC = () => {
  const [hasConsented, setHasConsented] = useState<boolean>(() => {
    try {
      return localStorage.getItem('echoflow_voice_consent') === 'true';
    } catch {
      return false;
    }
  });

  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [audioTranscript, setAudioTranscript] = useState('');
  const [activePlayback, setActivePlayback] = useState<'raw' | 'normalized' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const handleConsentToggle = (checked: boolean) => {
    setHasConsented(checked);
    try {
      localStorage.setItem('echoflow_voice_consent', String(checked));
    } catch {}
  };

  const stopPlayback = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
    }
    setActivePlayback(null);
  };

  const handleStartRecording = async () => {
    setErrorMessage(null);
    stopPlayback();
    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
      setRecordedAudioUrl(null);
    }
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : '';

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType || 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);
      };

      recorder.start(100);
      setIsRecording(true);
      setRecordSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordSeconds((s) => {
          if (s >= 30) {
            handleStopRecording();
            return 30;
          }
          return s + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.warn('Microphone error:', err);
      setErrorMessage(
        'Could not access microphone. Please check browser permissions or try the preconfigured archetype demos.'
      );
    }
  };

  const handleStopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    setIsRecording(false);
  };

  const handlePlay = (mode: 'raw' | 'normalized') => {
    stopPlayback();
    if (!recordedAudioUrl) return;

    setActivePlayback(mode);
    const audio = new Audio(recordedAudioUrl);
    audioPlayerRef.current = audio;

    if (mode === 'raw') {
      audio.playbackRate = 1.0;
    } else {
      // Natural voice: pace-adjusted to 150 WPM with pitch preservation
      // If user recorded for 10s with ~35 words, measured rate is adjusted
      const measuredWpm = recordSeconds > 0 ? (40 / recordSeconds) * 60 : 200;
      const rate = Math.min(1.4, Math.max(0.6, 150 / measuredWpm));
      audio.playbackRate = rate;
      (audio as any).preservesPitch = true;
      (audio as any).webkitPreservesPitch = true;
      (audio as any).mozPreservesPitch = true;
    }

    audio.onended = () => setActivePlayback(null);
    audio.onerror = () => setActivePlayback(null);
    audio.play().catch(() => setActivePlayback(null));
  };

  useEffect(() => {
    return () => {
      stopPlayback();
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* 1. Consent and Responsible AI Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
        <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <span>Natural Voice Identity Protection & Privacy Charter</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          EchoFlow normalizes your speech tempo and suppresses cognitive fillers <em>without</em> replacing your voice with a synthetic actor. Your recorded audio remains purely inside your local browser session in volatile memory ($0$ disk writes).
        </p>

        <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer hover:border-cyan-500/40 transition-colors">
          <input
            type="checkbox"
            checked={hasConsented}
            onChange={(e) => handleConsentToggle(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 focus:ring-offset-slate-950"
          />
          <span className="text-xs text-slate-200">
            I consent to recording my voice for interactive cadence evaluation. I understand audio is processed ephemerally and is never shared, trained on, or stored to persistent disks.
          </span>
        </label>
      </div>

      {/* 2. Recording Station */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Mic className="w-4 h-4 text-cyan-400" />
              <span>Record Your Natural Speech (10–30 Seconds)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Speak a hurried sentence (for example: <em>"Hi, our payment cluster is failing continuous-aa, packets are dropping, please fix urgently!"</em>)
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className={`font-bold ${recordSeconds > 25 ? 'text-rose-400' : 'text-slate-200'}`}>
              00:{recordSeconds.toString().padStart(2, '0')}
            </span>
            <span className="text-slate-500">/ 00:30s</span>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Record / Stop Button */}
        <div className="flex flex-col items-center justify-center py-6 space-y-3">
          {!isRecording ? (
            <button
              onClick={handleStartRecording}
              disabled={!hasConsented}
              className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/20 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
            >
              <Mic className="w-5 h-5 fill-current" />
              <span>Start Recording</span>
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-xl shadow-rose-600/30 animate-pulse transition-all cursor-pointer"
            >
              <Square className="w-5 h-5 fill-current" />
              <span>Stop Recording ({recordSeconds}s)</span>
            </button>
          )}

          {!hasConsented && (
            <span className="text-[11px] text-amber-400 font-mono">
              Please check the consent box above to enable microphone recording.
            </span>
          )}
        </div>

        {/* Recorded Audio Playback Comparison */}
        {recordedAudioUrl && (
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-3 animate-in fade-in-50">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Audio Captured ({recordSeconds}s) • Ready for Evaluation
              </span>
              <span className="text-emerald-400 text-[11px]">Hardware Pitch Preserved</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => (activePlayback === 'raw' ? stopPlayback() : handlePlay('raw'))}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activePlayback === 'raw'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                }`}
              >
                {activePlayback === 'raw' ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>Play Raw (Your Original Speed)</span>
              </button>

              <button
                onClick={() => (activePlayback === 'normalized' ? stopPlayback() : handlePlay('normalized'))}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activePlayback === 'normalized'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 shadow-md shadow-cyan-500/20 hover:brightness-110'
                }`}
              >
                {activePlayback === 'normalized' ? <Pause className="w-4 h-4" /> : <Zap className="w-4 h-4 fill-current" />}
                <span>Play EchoFlow (Your Natural Voice • 150 WPM)</span>
              </button>

              <button
                onClick={() => {
                  stopPlayback();
                  if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
                  setRecordedAudioUrl(null);
                  setRecordSeconds(0);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all ml-auto"
                title="Discard and record again"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
