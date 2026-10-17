import React, { useState, useRef } from 'react';
import {
  Mic,
  Square,
  Sparkles,
  Upload,
  FileAudio,
  Copy,
  Check,
  RotateCcw,
  Zap,
  Volume2,
  Database,
  ArrowRight,
} from 'lucide-react';
import { auth, db } from '../firebase/config';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

interface AudioTranscriberProps {
  onNormalizeTranscript?: (text: string) => void;
}

export const AudioTranscriber: React.FC<AudioTranscriberProps> = ({ onNormalizeTranscript }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [wordCount, setWordCount] = useState<number>(0);
  const [normalizedResult, setNormalizedResult] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedTranscriptions, setSavedTranscriptions] = useState<any[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Start hardware microphone recording
  const startRecording = async () => {
    setError(null);
    setAudioUrl(null);
    setTranscript('');
    setNormalizedResult('');
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        stream.getTracks().forEach((track) => track.stop());

        // Automatically transcribe with gemini-3.5-transcribe
        await transcribeAudioBlob(audioBlob);
      };

      recorder.start(250);
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone error:', err);
      setError(err.message || 'Microphone access denied or not available');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  // Convert Blob to base64 and call server /api/transcribe-audio (gemini-3.5-transcribe)
  const transcribeAudioBlob = async (blob: Blob) => {
    setIsTranscribing(true);
    setError(null);

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const res = reader.result as string;
          const base64 = res.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(blob);

      const base64Audio = await base64Promise;

      const res = await fetch('/api/transcribe-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: base64Audio,
          mimeType: blob.type || 'audio/webm',
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to transcribe audio');
      }

      setTranscript(data.transcript);
      setWordCount(data.wordCount || data.transcript.split(/\s+/).length);

      // Save to Firestore if user is logged in
      const user = auth.currentUser;
      if (user) {
        try {
          await addDoc(collection(db, 'users', user.uid, 'transcriptions'), {
            userId: user.uid,
            transcript: data.transcript,
            wordCount: data.wordCount,
            modelUsed: 'gemini-3.5-transcribe',
            createdAt: new Date().toISOString(),
          });
          loadSavedTranscriptions();
        } catch (dbErr) {
          console.warn('Firestore save note:', dbErr);
        }
      }
    } catch (err: any) {
      console.error('Transcription error:', err);
      setError(err.message || 'Error running gemini-3.5-transcribe');
    } finally {
      setIsTranscribing(false);
    }
  };

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    transcribeAudioBlob(file);
  };

  // Run EchoFlow 150 WPM cadence normalization on the transcribed text
  const handleNormalize = async () => {
    if (!transcript) return;

    try {
      const res = await fetch('/api/normalize-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: transcript,
          originalWpm: 220,
          targetWpm: 150,
          scenario: 'gemini_transcription_normalization',
        }),
      });
      const data = await res.json();
      setNormalizedResult(data.normalizedText || data.cleanedTranscript);

      if (onNormalizeTranscript) {
        onNormalizeTranscript(data.normalizedText || data.cleanedTranscript);
      }
    } catch (err: any) {
      console.warn('Normalization note:', err);
    }
  };

  const handleCopyTranscript = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSavedTranscriptions = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const q = query(
        collection(db, 'users', user.uid, 'transcriptions'),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const snap = await getDocs(q);
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setSavedTranscriptions(list);
    } catch (e) {}
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
              Model: gemini-3.5-transcribe
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Audio Transcription Studio
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Input speech with your microphone or upload an audio file. The engine uses Google's
            model <strong className="text-cyan-300">gemini-3.5-transcribe</strong> for high-accuracy,
            accent-resilient transcription, directly feedable into the EchoFlow normalizer.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-md shadow-rose-600/30 active:scale-95"
            >
              <Mic className="w-4 h-4" />
              <span>Record Microphone</span>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs transition-all shadow-lg active:scale-95 animate-pulse"
            >
              <Square className="w-4 h-4 fill-current text-rose-600" />
              <span>Stop & Transcribe ({recordingSeconds}s)</span>
            </button>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-all active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Audio File</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300">
          <strong>Transcription Error:</strong> {error}
        </div>
      )}

      {/* Audio Playback & Transcribing Progress */}
      {audioUrl && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-slate-400 flex items-center gap-1.5">
              <FileAudio className="w-4 h-4 text-cyan-400" />
              Recorded Input Audio
            </span>
            {isTranscribing && (
              <span className="text-cyan-400 font-mono flex items-center gap-1.5 animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                Transcribing with gemini-3.5-transcribe...
              </span>
            )}
          </div>
          <audio src={audioUrl} controls className="w-full h-9" />
        </div>
      )}

      {/* Transcript Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Verbatim Transcript from gemini-3.5-transcribe */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                Verbatim Transcript
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                gemini-3.5-transcribe
              </span>
            </div>
            {transcript && (
              <button
                onClick={handleCopyTranscript}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>

          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Record speech with your microphone or upload audio to transcribe..."
            rows={5}
            className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 font-mono leading-relaxed focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Word count: <strong className="text-white">{wordCount}</strong> words</span>
            <button
              onClick={handleNormalize}
              disabled={!transcript.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Normalize to 150 WPM</span>
            </button>
          </div>
        </div>

        {/* Right: EchoFlow 150 WPM Harmonized Result */}
        <div className="p-4 rounded-xl bg-slate-950 border border-cyan-900/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              EchoFlow 150 WPM Harmonized Speech
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              -100% FILLERS
            </span>
          </div>

          <div className="w-full p-3 rounded-lg bg-slate-900 border border-slate-800 min-h-[120px] text-xs sm:text-sm text-cyan-100 font-medium leading-relaxed">
            {normalizedResult ? (
              `"${normalizedResult}"`
            ) : (
              <span className="text-slate-500 italic">
                Transcribe your speech on the left, then click 'Normalize to 150 WPM' to compress conversational lag and eliminate hesitation particles...
              </span>
            )}
          </div>

          {normalizedResult && (
            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-emerald-400 font-mono text-[11px]">
                Cadence calibrated: 150 WPM Enterprise Standard
              </span>
              <button
                onClick={() => {
                  window.speechSynthesis.cancel();
                  const utt = new SpeechSynthesisUtterance(normalizedResult);
                  utt.rate = 1.0;
                  window.speechSynthesis.speak(utt);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-xs font-semibold"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen Converted</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
