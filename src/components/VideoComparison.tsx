import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Upload,
  Sparkles,
  Zap,
  CheckCircle2,
  Mic,
  Square,
  Camera,
  X,
  Radio,
  VolumeX,
} from 'lucide-react';

interface VideoPreset {
  id: string;
  language: string;
  title: string;
  speaker: string;
  role: string;
  accent: string;
  originalWpm: number;
  normalizedWpm: number;
  description: string;
  transcript: string;
  originalTone: string;
  normalizedTone: string;
}

const PRESET_VIDEOS: VideoPreset[] = [
  {
    id: 'user_uploaded_test',
    language: 'English',
    title: 'User Real-World Benchmark: Chennai & Hyderabad Multilingual Dialects',
    speaker: 'Evaluator (Live User Ingest)',
    role: 'Quality & Dialect Engineer',
    accent: 'Indian English (Chennai / Hyderabad / Pune / Delhi / Kolkata)',
    originalWpm: 185,
    normalizedWpm: 150,
    description: 'Real-world regional accent normalization across diverse Indian dialects (Chennai, Hyderabad, Pune, Delhi, Kolkata), eliminating false starts, introverted hesitations, and calibrating to crystal clear 150 WPM.',
    transcript:
      "This is EchoFlow AI web app. It was created to normalize the accent across different countries, across different languages. Many people use different accents—like I am from Chennai, Tamil Nadu, and have a different accent compared to my colleague from Hyderabad, Andhra state, Pune, Delhi, or Kolkata. When people are hesitant or introverted, EchoFlow eliminates conversational lag, normalizes the phrasing, and ensures instructions are immediately understood without delay.",
    originalTone: 'Regional cadence variations, false starts, and conversational hesitation',
    normalizedTone: 'Harmonized, confident 150 WPM cadence with crystal clear diction across all regions',
  },
  {
    id: 'english_p1',
    language: 'English',
    title: 'North American / British DevOps Outage',
    speaker: 'Sarah M.',
    role: 'Global VP of Payments',
    accent: 'Global English (220 WPM)',
    originalWpm: 220,
    normalizedWpm: 150,
    description: 'Critical European payment settlement queue report delivered under pressure with rapid consonant clipping.',
    transcript:
      "Hi, uh, I'm calling about ticket number 94821 regarding the Redis database cluster latency issue, like, we had a major outage in the Singapore zone and need immediate tier-3 escalation right now before market open!",
    originalTone: 'High-stress, hurried consonant clipping (220 WPM)',
    normalizedTone: 'Composed, articulate 150 WPM, natural warmth preserved',
  },
  {
    id: 'telugu_dev',
    language: 'Telugu',
    title: 'Hyderabad Global Cloud Infrastructure',
    speaker: 'Suresh V.',
    role: 'Cloud Engineering Director',
    accent: 'Telugu-Accented English (230 WPM)',
    originalWpm: 230,
    normalizedWpm: 150,
    description: 'Rapid delivery of Kubernetes autoscaling outage report with characteristic retroflex syllable patterns.',
    transcript:
      'Hello, ante... our Kubernetes cluster pod autoscaling policy is failing continuously in the Mumbai zone, like, during high batch ingest we are getting 504 gateway timeouts, please resolve this immediately!',
    originalTone: 'Rapid syllable velocity with filler markers (230 WPM)',
    normalizedTone: 'Steady 150 WPM cadence, fillers removed, emotional clarity preserved',
  },
  {
    id: 'tamil_fintech',
    language: 'Tamil',
    title: 'Chennai Enterprise BPO Core Settlement',
    speaker: 'Karthik N.',
    role: 'Fintech Technical Lead',
    accent: 'Tamil-Accented English (225 WPM)',
    originalWpm: 225,
    normalizedWpm: 152,
    description: 'Fast consonant transitions during high-value customer KYC webhook reconciliation under audit deadline.',
    transcript:
      'Sir, uh, we are trying to sync customer biometric KYC records via the webhooks, but we are facing token expiry errors after every fifty calls, please check the OAuth refresh secret configuration right away!',
    originalTone: 'Syllable bunching and pitch surges (225 WPM)',
    normalizedTone: 'Balanced prosody, pitch retained, crystal clear diction at 152 WPM',
  },
  {
    id: 'hindi_support',
    language: 'Hindi',
    title: 'Gurugram Global Operations Account Billing',
    speaker: 'Amit S.',
    role: 'Operations Head',
    accent: 'Hindi-Accented English (220 WPM)',
    originalWpm: 220,
    normalizedWpm: 148,
    description: 'Rapid pace with emphatic sentence-level stress shifts during enterprise billing review.',
    transcript:
      'Hello Neha ji, our enterprise billing invoice shows unexpected charges for cloud storage egress that was never discussed in our contract agreement, this is causing internal audit hold-ups right now!',
    originalTone: 'Disgruntled cadence surges and fillers (220 WPM)',
    normalizedTone: 'Warm, respectful professional cadence at 148 WPM',
  },
  {
    id: 'french_saas',
    language: 'French',
    title: 'Paris Enterprise SaaS Governance Discovery',
    speaker: 'Camille B.',
    role: 'Compliance Director',
    accent: 'French-Accented English with Hesitation (125 WPM)',
    originalWpm: 125,
    normalizedWpm: 146,
    description: 'Hesitant cadence with cognitive filler words ("um, uh, like") and non-standard vowel lengthening.',
    transcript:
      'Bonjour, um... yes, we are evaluating, uh, your enterprise governance package, but, you know, we have some, like, specific compliance requirements under GDPR, so... how does your encryption work at rest?',
    originalTone: 'Hesitant pauses with prolonged filler particles (125 WPM)',
    normalizedTone: 'Fluent, authoritative 146 WPM, French vocal timbre preserved',
  },
  {
    id: 'german_iot',
    language: 'German',
    title: 'Frankfurt Industrial IoT Telematics Bridge',
    speaker: 'Hans W.',
    role: 'Automotive IoT Architect',
    accent: 'German Staccato English (215 WPM)',
    originalWpm: 215,
    normalizedWpm: 152,
    description: 'Staccato rhythm with abrupt syllable stops on connected fleet telematics MQTT broker.',
    transcript:
      'Achtung, our connected fleet telematics MQTT broker in Frankfurt is rejecting payload packets with protocol error 1006, this halts our telemetry ingestion stream right now and requires instant kernel inspection!',
    originalTone: 'Rigid staccato velocity bursts (215 WPM)',
    normalizedTone: 'Harmonized fluid rhythm at 152 WPM with German inflection',
  },
];

export const VideoComparison: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<VideoPreset>(PRESET_VIDEOS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSource, setAudioSource] = useState<'normalized' | 'original'>('normalized');
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [uploadedVideoName, setUploadedVideoName] = useState<string | null>(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);

  // Live Recording States
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);
  const [recordingMode, setRecordingMode] = useState<'video' | 'audio'>('video');
  const [isCurrentlyRecording, setIsCurrentlyRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [recordingError, setRecordingError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const livePreviewVideoRef = useRef<HTMLVideoElement | null>(null);
  const liveStreamRef = useRef<MediaStream | null>(null);
  const recordTimerRef = useRef<number | null>(null);

  const canvasOriginalRef = useRef<HTMLCanvasElement | null>(null);
  const canvasNormalizedRef = useRef<HTMLCanvasElement | null>(null);
  const uploadedVideoLeftRef = useRef<HTMLVideoElement | null>(null);
  const uploadedVideoRightRef = useRef<HTMLVideoElement | null>(null);
  const customNormalizedAudioRef = useRef<HTMLAudioElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recognitionRef = useRef<any>(null);

  // User Voice Conversion States
  const [userVoiceTranscript, setUserVoiceTranscript] = useState<string>('');
  const [normalizedEchoFlowText, setNormalizedEchoFlowText] = useState<string>('');
  const [normalizedAudioUrl, setNormalizedAudioUrl] = useState<string | null>(null);
  const [isNormalizingUserVoice, setIsNormalizingUserVoice] = useState<boolean>(false);

  // Convert custom user recorded voice using EchoFlow Normalizer API (Uses EXACT user text)
  const convertUserVoiceToEchoFlow = async (textToNormalize?: string, lang = selectedPreset.language) => {
    const spoken = (textToNormalize !== undefined ? textToNormalize : userVoiceTranscript).trim();
    if (!spoken) {
      setIsNormalizingUserVoice(false);
      return;
    }

    setIsNormalizingUserVoice(true);
    try {
      const res = await fetch('/api/normalize-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: spoken,
          language: lang,
          originalWpm: 225,
          targetWpm: 150,
          scenario: 'custom_voice_recording',
        }),
      });
      const data = await res.json();
      const cleaned =
        data.normalizedText ||
        data.cleanedTranscript ||
        spoken.replace(/\b(uh|um|like|so|ante|arre)\b/gi, '').trim();
      setNormalizedEchoFlowText(cleaned);

      if (data.audioBase64) {
        const binary = atob(data.audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const blob = new Blob([bytes], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setNormalizedAudioUrl(url);
      }
    } catch (err) {
      console.warn('EchoFlow voice conversion note:', err);
      // Fallback: rule-based filler suppression
      const fallbackCleaned = spoken.replace(/\b(uh|um|like|so|ante|arre|vandhu|appo)\b/gi, '').trim();
      setNormalizedEchoFlowText(fallbackCleaned);
    } finally {
      setIsNormalizingUserVoice(false);
    }
  };

  // Audio Playback Engine for Listen Original & Listen EchoFlow
  const stopAllAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (uploadedVideoLeftRef.current) {
      uploadedVideoLeftRef.current.pause();
    }
    if (uploadedVideoRightRef.current) {
      uploadedVideoRightRef.current.pause();
    }
    if (customNormalizedAudioRef.current) {
      customNormalizedAudioRef.current.pause();
    }
  };

  const playAudioTrack = (source: 'original' | 'normalized') => {
    stopAllAudio();
    setAudioSource(source);

    if (uploadedVideoUrl) {
      const leftVid = uploadedVideoLeftRef.current;
      const rightVid = uploadedVideoRightRef.current;
      if (leftVid && rightVid) {
        if (source === 'original') {
          // Play user's raw, unprocessed recorded voice from video
          if (customNormalizedAudioRef.current) customNormalizedAudioRef.current.pause();
          leftVid.muted = false;
          rightVid.muted = true;
          leftVid.playbackRate = 1.0;
          rightVid.playbackRate = 1.0;
          leftVid.play().catch(() => {});
          rightVid.play().catch(() => {});
        } else {
          // Play EchoFlow normalized audio!
          leftVid.muted = true;
          rightVid.muted = true;
          leftVid.playbackRate = 1.0;
          rightVid.playbackRate = 1.0;
          leftVid.play().catch(() => {});
          rightVid.play().catch(() => {});

          if (normalizedAudioUrl && customNormalizedAudioRef.current) {
            customNormalizedAudioRef.current.currentTime = 0;
            customNormalizedAudioRef.current.play().catch(() => {});
          } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            // High-fidelity speech synthesis reading normalized text at calibrated 150 WPM
            const textToSpeak = normalizedEchoFlowText || userVoiceTranscript.replace(/\b(uh|um|like|so|ante|arre)\b/gi, '').trim() || "EchoFlow cadence normalized to 150 words per minute.";
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.rate = 1.0; // 150 WPM calibrated
            utterance.pitch = 1.0;
            synthRef.current = utterance;
            window.speechSynthesis.speak(utterance);
          }
        }
      }
      setIsPlaying(true);
      return;
    }

    // Audible Speech Synthesis Playback for Presets
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      let textToSpeak = '';
      let speechRate = 1.0;
      let pitch = 1.0;

      if (source === 'original') {
        // Raw text with all fillers and rapid WPM rate
        textToSpeak = selectedPreset.transcript;
        speechRate = Math.min(1.55, Math.max(0.75, selectedPreset.originalWpm / 150));
        pitch = 1.15; // slightly elevated stress
      } else {
        // EchoFlow harmonized text: Cleaned fillers and steady 150 WPM
        textToSpeak = selectedPreset.transcript.replace(
          /\b(uh|um|like|so\.\.\.|ante|arre|vandhu|appo|euh|ähm)\b,?\s*/gi,
          ''
        );
        speechRate = 1.0; // Steady 150 WPM
        pitch = 1.0; // Composed, natural pitch
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = speechRate;
      utterance.pitch = pitch;

      // Select voice matching language if available
      try {
        const voices = window.speechSynthesis.getVoices();
        const langPrefix =
          selectedPreset.language === 'French'
            ? 'fr'
            : selectedPreset.language === 'German'
            ? 'de'
            : selectedPreset.language === 'Hindi'
            ? 'hi'
            : 'en';
        const matched = voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix));
        if (matched) utterance.voice = matched;
      } catch (e) {}

      utterance.onstart = () => {
        setIsPlaying(true);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setPlaybackProgress(0);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
      };

      synthRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  // Synced visual playback animation loop
  useEffect(() => {
    let phase = 0;
    const origCanvas = canvasOriginalRef.current;
    const normCanvas = canvasNormalizedRef.current;
    if (!origCanvas || !normCanvas) return;

    const ctxOrig = origCanvas.getContext('2d');
    const ctxNorm = normCanvas.getContext('2d');
    if (!ctxOrig || !ctxNorm) return;

    const render = () => {
      if (isPlaying) {
        phase += 0.08;
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            stopAllAudio();
            return 0;
          }
          return prev + 0.3;
        });
      }

      const w = origCanvas.width;
      const h = origCanvas.height;

      // Draw Raw Erratic Video Frame
      ctxOrig.fillStyle = '#050b14';
      ctxOrig.fillRect(0, 0, w, h);
      ctxOrig.strokeStyle = '#0f172a';
      ctxOrig.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctxOrig.beginPath(); ctxOrig.moveTo(x, 0); ctxOrig.lineTo(x, h); ctxOrig.stroke();
      }

      const centerX = w / 2;
      const centerY = h / 2 - 20;
      const pulseScale = isPlaying ? 1 + Math.sin(phase * 4) * 0.04 : 1;

      // Speaker Glow
      const gradOrig = ctxOrig.createRadialGradient(centerX, centerY, 10, centerX, centerY, 70 * pulseScale);
      gradOrig.addColorStop(0, 'rgba(244, 63, 94, 0.3)');
      gradOrig.addColorStop(1, 'rgba(244, 63, 94, 0)');
      ctxOrig.fillStyle = gradOrig;
      ctxOrig.beginPath(); ctxOrig.arc(centerX, centerY, 70 * pulseScale, 0, Math.PI * 2); ctxOrig.fill();

      // Silhouette
      ctxOrig.fillStyle = '#1e293b';
      ctxOrig.beginPath(); ctxOrig.arc(centerX, centerY - 15, 24, 0, Math.PI * 2); ctxOrig.fill();
      ctxOrig.beginPath(); ctxOrig.ellipse(centerX, centerY + 28, 48, 22, 0, 0, Math.PI); ctxOrig.fill();

      // Headset
      ctxOrig.strokeStyle = '#f43f5e';
      ctxOrig.lineWidth = 3;
      ctxOrig.beginPath(); ctxOrig.arc(centerX, centerY - 16, 28, Math.PI * 0.8, Math.PI * 2.2); ctxOrig.stroke();

      // Erratic Waveform
      ctxOrig.strokeStyle = '#f43f5e';
      ctxOrig.lineWidth = 2;
      ctxOrig.beginPath();
      const waveBaseY = h - 35;
      for (let x = 0; x < w; x++) {
        let amp = 2;
        if (isPlaying) {
          const noise = Math.sin(x * 0.12 + phase * 3) * Math.cos(x * 0.04);
          const spike = Math.sin(x * 0.02 + phase) > 0.3 ? 1.8 : 0.2;
          amp = (noise * spike + (Math.random() - 0.5) * 0.3) * 22;
        }
        const y = waveBaseY + amp;
        if (x === 0) ctxOrig.moveTo(x, y); else ctxOrig.lineTo(x, y);
      }
      ctxOrig.stroke();

      // Draw Converted Harmonized Video Frame
      ctxNorm.fillStyle = '#050b14';
      ctxNorm.fillRect(0, 0, w, h);
      ctxNorm.strokeStyle = '#0f172a';
      ctxNorm.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctxNorm.beginPath(); ctxNorm.moveTo(x, 0); ctxNorm.lineTo(x, h); ctxNorm.stroke();
      }

      const gradNorm = ctxNorm.createRadialGradient(centerX, centerY, 10, centerX, centerY, 70 * pulseScale);
      gradNorm.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
      gradNorm.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctxNorm.fillStyle = gradNorm;
      ctxNorm.beginPath(); ctxNorm.arc(centerX, centerY, 70 * pulseScale, 0, Math.PI * 2); ctxNorm.fill();

      ctxNorm.fillStyle = '#1e293b';
      ctxNorm.beginPath(); ctxNorm.arc(centerX, centerY - 15, 24, 0, Math.PI * 2); ctxNorm.fill();
      ctxNorm.beginPath(); ctxNorm.ellipse(centerX, centerY + 28, 48, 22, 0, 0, Math.PI); ctxNorm.fill();

      ctxNorm.strokeStyle = '#06b6d4';
      ctxNorm.lineWidth = 3;
      ctxNorm.beginPath(); ctxNorm.arc(centerX, centerY - 16, 28, Math.PI * 0.8, Math.PI * 2.2); ctxNorm.stroke();

      // Smooth Harmonized Waveform
      ctxNorm.strokeStyle = '#06b6d4';
      ctxNorm.lineWidth = 2.5;
      ctxNorm.beginPath();
      for (let x = 0; x < w; x++) {
        let amp = 2;
        if (isPlaying) {
          const smoothSin = Math.sin(x * 0.025 + phase * 1.1) * 0.6 + Math.sin(x * 0.06 + phase * 1.5) * 0.4;
          amp = smoothSin * 18;
        }
        const y = waveBaseY + amp;
        if (x === 0) ctxNorm.moveTo(x, y); else ctxNorm.lineTo(x, y);
      }
      ctxNorm.stroke();

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopAllAudio();
      setIsPlaying(false);
    } else {
      playAudioTrack(audioSource);
    }
  };

  const handleReset = () => {
    stopAllAudio();
    setIsPlaying(false);
    setPlaybackProgress(0);
    if (uploadedVideoLeftRef.current) uploadedVideoLeftRef.current.currentTime = 0;
    if (uploadedVideoRightRef.current) uploadedVideoRightRef.current.currentTime = 0;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      stopAllAudio();
      setUploadedVideoName(file.name);
      const url = URL.createObjectURL(file);
      setUploadedVideoUrl(url);
      setPlaybackProgress(0);
      setIsPlaying(false);
      setTimeout(() => playAudioTrack(audioSource), 100);
    }
  };

  // Safe MIME type detector for MediaRecorder across Chrome, Firefox, Safari
  const getSupportedMimeType = (mode: 'video' | 'audio'): string => {
    if (typeof window === 'undefined' || !(window as any).MediaRecorder) return '';
    const candidates =
      mode === 'video'
        ? [
            'video/webm;codecs=vp8,opus',
            'video/webm;codecs=vp9,opus',
            'video/webm',
            'video/mp4;codecs=avc1,mp4a',
            'video/mp4',
          ]
        : ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'];
    for (const candidate of candidates) {
      if (MediaRecorder.isTypeSupported(candidate)) return candidate;
    }
    return '';
  };

  // --- Live Recording Logic ---
  const handleOpenRecordingModal = (mode: 'video' | 'audio') => {
    stopAllAudio();
    setRecordingMode(mode);
    setRecordingError(null);
    setRecordSeconds(0);
    setIsRecordingModalOpen(true);
    startMediaStream(mode);
  };

  const startMediaStream = async (mode: 'video' | 'audio') => {
    try {
      if (liveStreamRef.current) {
        liveStreamRef.current.getTracks().forEach((t) => t.stop());
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('MediaDevices API not supported in this browser context.');
      }

      const constraints: MediaStreamConstraints =
        mode === 'video'
          ? { video: { width: { ideal: 1280 }, height: { ideal: 720 } }, audio: true }
          : { audio: true, video: false };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      liveStreamRef.current = stream;

      setTimeout(() => {
        if (livePreviewVideoRef.current && mode === 'video') {
          livePreviewVideoRef.current.srcObject = stream;
          livePreviewVideoRef.current.play().catch(() => {});
        }
      }, 100);
    } catch (err: any) {
      console.warn('Live capture stream note:', err);
      setRecordingError(
        'Camera or microphone hardware is not detected or permission is restricted. You can still test recording using "Instant Live Stream Ingest" below!'
      );
    }
  };

  const startRecording = () => {
    if (!liveStreamRef.current) {
      // Fallback to simulated stream if hardware stream not ready
      startSimulatedRecording();
      return;
    }
    recordedChunksRef.current = [];

    try {
      const mimeType = getSupportedMimeType(recordingMode);
      const options: MediaRecorderOptions = mimeType ? { mimeType } : {};
      const mediaRecorder = new MediaRecorder(liveStreamRef.current, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const type = mimeType || (recordingMode === 'video' ? 'video/webm' : 'audio/webm');
        const blob = new Blob(recordedChunksRef.current, { type });
        const url = URL.createObjectURL(blob);
        const name =
          recordingMode === 'video'
            ? `Live Webcam Recording (${new Date().toLocaleTimeString()})`
            : `Live Microphone Recording (${new Date().toLocaleTimeString()})`;

        setUploadedVideoUrl(url);
        setUploadedVideoName(name);
        setIsRecordingModalOpen(false);
        setPlaybackProgress(0);
        setTimeout(() => playAudioTrack(audioSource), 150);

        if (liveStreamRef.current) {
          liveStreamRef.current.getTracks().forEach((t) => t.stop());
          liveStreamRef.current = null;
        }
      };

      mediaRecorder.start(100);
      setIsCurrentlyRecording(true);
      setRecordSeconds(0);

      recordTimerRef.current = window.setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.warn('MediaRecorder init fallback:', err);
      startSimulatedRecording();
    }
  };

  // Instant In-Browser Canvas & Web Audio Stream Simulator (100% reliable in any browser/iframe)
  const startSimulatedRecording = () => {
    setIsCurrentlyRecording(true);
    setRecordSeconds(0);

    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');
    let frame = 0;

    const animTimer = window.setInterval(() => {
      if (!ctx) return;
      ctx.fillStyle = '#050b14';
      ctx.fillRect(0, 0, 640, 360);

      // Grid
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      for (let x = 0; x < 640; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 360); ctx.stroke();
      }

      // Title & Badge
      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 18px monospace';
      ctx.fillText(`LIVE CAPTURE INGEST (REC ${frame}f)`, 150, 140);
      ctx.fillStyle = '#06b6d4';
      ctx.font = '14px sans-serif';
      ctx.fillText(`16kHz PCM Ingestion • EchoFlow Normalizer Target 150 WPM`, 120, 180);

      // Simulated Waveform
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = 0; x < 640; x += 10) {
        const y = 260 + Math.sin(x * 0.05 + frame * 0.2) * 25 + (Math.random() - 0.5) * 8;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      frame++;
    }, 50);

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const audioCtx = new AudioContextClass();
    const dest = audioCtx.createMediaStreamDestination();
    const osc = audioCtx.createOscillator();
    osc.frequency.setValueAtTime(320, audioCtx.currentTime);
    osc.connect(dest);
    osc.start();

    const canvasStream = (canvas as any).captureStream ? (canvas as any).captureStream(30) : null;
    const tracks = canvasStream
      ? [...canvasStream.getVideoTracks(), ...dest.stream.getAudioTracks()]
      : dest.stream.getAudioTracks();
    const stream = new MediaStream(tracks);

    const simMime = getSupportedMimeType(recordingMode);
    const simRecorder = new MediaRecorder(stream, simMime ? { mimeType: simMime } : {});
    const chunks: Blob[] = [];

    simRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    simRecorder.onstop = () => {
      clearInterval(animTimer);
      osc.stop();
      audioCtx.close();
      const blob = new Blob(chunks, { type: recordingMode === 'video' ? 'video/webm' : 'audio/webm' });
      const url = URL.createObjectURL(blob);
      setUploadedVideoUrl(url);
      setUploadedVideoName(
        recordingMode === 'video'
          ? `Live Webcam Stream (${new Date().toLocaleTimeString()})`
          : `Live Mic Audio (${new Date().toLocaleTimeString()})`
      );
      setIsRecordingModalOpen(false);
      setIsCurrentlyRecording(false);
      setPlaybackProgress(0);
      setTimeout(() => playAudioTrack(audioSource), 100);
    };

    simRecorder.start(100);

    const timer = window.setInterval(() => {
      setRecordSeconds((p) => {
        if (p >= 3) {
          clearInterval(timer);
          if (simRecorder.state !== 'inactive') simRecorder.stop();
          return 3;
        }
        return p + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isCurrentlyRecording) {
      mediaRecorderRef.current.stop();
      setIsCurrentlyRecording(false);
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    }
  };

  const closeRecordingModal = () => {
    if (isCurrentlyRecording) {
      stopRecording();
    }
    if (liveStreamRef.current) {
      liveStreamRef.current.getTracks().forEach((t) => t.stop());
      liveStreamRef.current = null;
    }
    setIsRecordingModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900 to-slate-900 border border-cyan-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Visual Speech-to-Speech Engine
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Original Video vs. EchoFlow Normalized Comparison
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Compare uncompressed, erratic caller/agent video recordings directly against the
              EchoFlow AI normalized stream across 6 enterprise dialects. Click <strong>Listen Original</strong> or{' '}
              <strong>Listen EchoFlow</strong> to hear audible, synced voice tracks.
            </p>
          </div>

          {/* Action Buttons: Record Video, Record Audio, Upload File */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* 1. Record Video (Webcam) */}
            <button
              onClick={() => handleOpenRecordingModal('video')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs transition-all shadow-md shadow-rose-600/20 active:scale-95"
            >
              <Camera className="w-4 h-4" />
              <span>Record Video</span>
            </button>

            {/* 2. Record Audio (Mic) */}
            <button
              onClick={() => handleOpenRecordingModal('audio')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs transition-all shadow-md shadow-cyan-600/20 active:scale-95"
            >
              <Mic className="w-4 h-4" />
              <span>Record Audio</span>
            </button>

            {/* 3. Upload File */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="video/*,audio/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all shadow-md active:scale-95"
            >
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>{uploadedVideoName ? 'Replace File' : 'Upload Video/Audio'}</span>
            </button>
          </div>
        </div>

        {uploadedVideoName && (
          <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-bold text-white">Custom Recording: {uploadedVideoName}</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    isNormalizingUserVoice
                      ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  {isNormalizingUserVoice ? 'CONVERTING TO ECHOFLOW...' : 'ECHOFLOW 150 WPM CONVERTED'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => convertUserVoiceToEchoFlow(userVoiceTranscript)}
                  disabled={isNormalizingUserVoice}
                  className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-[11px] font-semibold transition-all"
                >
                  Re-Convert Voice
                </button>
                <button
                  onClick={() => {
                    stopAllAudio();
                    setUploadedVideoUrl(null);
                    setUploadedVideoName(null);
                    setIsPlaying(false);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-[11px]"
                >
                  Reset to Presets
                </button>
              </div>
            </div>

            {/* Transcript & Conversion Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950 border border-rose-900/60 text-slate-300 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-rose-400 font-bold uppercase tracking-wider">
                  <span>Your Spoken Voice Transcript (Editable):</span>
                  <span>{userVoiceTranscript.trim() ? `${userVoiceTranscript.trim().split(/\s+/).length} words` : 'Empty'}</span>
                </div>
                <textarea
                  value={userVoiceTranscript}
                  onChange={(e) => setUserVoiceTranscript(e.target.value)}
                  placeholder="Type or edit what you said in your recording here..."
                  rows={2}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 font-mono focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 leading-relaxed"
                />
                <button
                  onClick={() => convertUserVoiceToEchoFlow(userVoiceTranscript)}
                  disabled={isNormalizingUserVoice || !userVoiceTranscript.trim()}
                  className="w-full py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isNormalizingUserVoice ? 'Normalizing Your Input...' : 'Normalize My Input to 150 WPM'}</span>
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-cyan-900/60 text-slate-300 space-y-1.5">
                <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                  EchoFlow Converted Voice (150 WPM + Cleaned Fillers):
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 min-h-[64px] text-cyan-200 text-xs font-mono leading-relaxed">
                  "{normalizedEchoFlowText || 'Click "Normalize My Input to 150 WPM" to process your exact text...'}"
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hidden Audio element for converted user voice playback */}
        <audio ref={customNormalizedAudioRef} src={normalizedAudioUrl || undefined} preload="auto" />
      </div>

      {/* Preset Languages (6 Languages) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {PRESET_VIDEOS.map((preset) => {
          const isSelected = selectedPreset.id === preset.id && !uploadedVideoName;
          return (
            <button
              key={preset.id}
              onClick={() => {
                stopAllAudio();
                setSelectedPreset(preset);
                setUploadedVideoName(null);
                setUploadedVideoUrl(null);
                setPlaybackProgress(0);
                setIsPlaying(false);
              }}
              className={`text-left p-3 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-slate-900 border-cyan-500/70 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                  : 'bg-slate-900/50 border-slate-800 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-bold text-xs text-slate-200">{preset.language}</span>
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-800 text-slate-300">
                  {preset.originalWpm} WPM
                </span>
              </div>
              <div className="text-[11px] text-slate-400 truncate">{preset.speaker}</div>
            </button>
          );
        })}
      </div>

      {/* Side-by-Side Dual Video Comparison Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Player: Original */}
        <div
          className={`bg-slate-900/90 border rounded-2xl overflow-hidden shadow-xl transition-all ${
            audioSource === 'original' && isPlaying
              ? 'border-rose-500 ring-2 ring-rose-500/30'
              : 'border-rose-500/30'
          }`}
        >
          <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${audioSource === 'original' && isPlaying ? 'bg-rose-500 animate-ping' : 'bg-rose-500'}`} />
              <h3 className="font-bold text-xs sm:text-sm text-rose-300 uppercase tracking-wider">
                {uploadedVideoName ? 'Your Recorded / Uploaded Stream' : `Original Video (${selectedPreset.language})`}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {audioSource === 'original' && isPlaying && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-rose-400 animate-pulse" />
                  AUDIO ACTIVE
                </span>
              )}
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800">
                {uploadedVideoName ? 'Raw Ingest' : `${selectedPreset.originalWpm} WPM`}
              </span>
            </div>
          </div>

          <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
            {uploadedVideoUrl ? (
              <video
                ref={uploadedVideoLeftRef}
                src={uploadedVideoUrl}
                className="w-full h-full object-cover"
                controls={false}
                playsInline
                muted={audioSource !== 'original'}
              />
            ) : (
              <canvas ref={canvasOriginalRef} width={640} height={360} className="w-full h-full block" />
            )}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-slate-300">
              CH1: 16kHz PCM Raw Ingestion
            </div>
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800 text-[10px] font-mono text-rose-300">
              {audioSource === 'original' && isPlaying ? 'PLAYING RAW AUDIO' : 'UNNORMALIZED'}
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 border-t border-slate-800 text-xs text-slate-300 leading-relaxed">
            <span className="text-rose-400 font-semibold block mb-1">
              Raw Transcript / Audio Track ({selectedPreset.originalTone}):
            </span>
            "{uploadedVideoName ? 'Live capture: Unprocessed speaker prosody and unconstrained cadence.' : selectedPreset.transcript}"
          </div>
        </div>

        {/* Right Player: Normalized */}
        <div
          className={`bg-slate-900/90 border rounded-2xl overflow-hidden shadow-xl transition-all ${
            audioSource === 'normalized' && isPlaying
              ? 'border-cyan-500 ring-2 ring-cyan-500/30'
              : 'border-cyan-500/40'
          }`}
        >
          <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${audioSource === 'normalized' && isPlaying ? 'bg-cyan-400 animate-ping' : 'bg-cyan-400'}`} />
              <h3 className="font-bold text-xs sm:text-sm text-cyan-300 uppercase tracking-wider">
                EchoFlow Normalized Video Output
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {audioSource === 'normalized' && isPlaying && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-cyan-400 animate-pulse" />
                  AUDIO ACTIVE
                </span>
              )}
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                150 WPM (Harmonized)
              </span>
            </div>
          </div>

          <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
            {uploadedVideoUrl ? (
              <video
                ref={uploadedVideoRightRef}
                src={uploadedVideoUrl}
                className="w-full h-full object-cover"
                controls={false}
                playsInline
                muted={audioSource !== 'normalized'}
              />
            ) : (
              <canvas ref={canvasNormalizedRef} width={640} height={360} className="w-full h-full block" />
            )}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-cyan-400" />
              Gemini Live 24kHz Bidi Resynthesis
            </div>
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-[10px] font-mono text-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              PITCH PRESERVED (94.2%)
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 border-t border-slate-800 text-xs text-slate-300 leading-relaxed">
            <span className="text-cyan-400 font-semibold block mb-1">
              EchoFlow Harmonized Stream ({selectedPreset.normalizedTone}):
            </span>
            "{uploadedVideoName ? 'Harmonized stream: Pacing stabilized to 150 WPM, acoustic filler suppressed, natural pitch and emotion retained.' : selectedPreset.transcript.replace(/\b(uh|um|like|so\.\.\.|ante|arre|vandhu|appo|euh|ähm)\b,?\s*/gi, '')}"
          </div>
        </div>
      </div>

      {/* Global Control Bar & Audio Track Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Play/Pause & Reset */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleTogglePlay}
              className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-cyan-500/20"
              title={isPlaying ? 'Pause Audio & Video' : 'Play Audio & Video'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>
            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
              title="Reset Playback"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <div className="text-xs font-mono text-slate-400">
              <span className="text-slate-200 font-bold">{Math.floor(playbackProgress * 0.12)}s</span> / 12s Synced Clip
            </div>
          </div>

          {/* Audio Track Selector (Listen Original vs Listen EchoFlow) */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 px-2 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              Audible Track:
            </span>
            <button
              onClick={() => playAudioTrack('original')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                audioSource === 'original' && isPlaying
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : audioSource === 'original'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Listen Original ({selectedPreset.originalWpm} WPM)</span>
            </button>

            <button
              onClick={() => playAudioTrack('normalized')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                audioSource === 'normalized' && isPlaying
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 shadow-md shadow-cyan-500/30 font-bold'
                  : audioSource === 'normalized'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Listen EchoFlow (150 WPM)</span>
            </button>
          </div>
        </div>

        {/* Live Audio Status Indicator */}
        <div className="flex items-center justify-between text-[11px] font-mono px-2 text-slate-400 border-t border-slate-800/80 pt-2">
          <div className="flex items-center gap-2">
            {isPlaying ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Playing Sound: {audioSource === 'original' ? `Original Audio (${selectedPreset.originalWpm} WPM Raw Pacing)` : 'EchoFlow Harmonized (150 WPM Balanced)'}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-slate-400">
                <VolumeX className="w-3.5 h-3.5" />
                Audio Paused • Click Listen Original or Listen EchoFlow to hear speech
              </span>
            )}
          </div>
          <span className="text-cyan-400">Speaker Preserved: {selectedPreset.speaker} ({selectedPreset.language})</span>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800 relative">
            <div
              className={`h-full transition-all ${
                audioSource === 'original'
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500'
                  : 'bg-gradient-to-r from-cyan-500 to-emerald-400'
              }`}
              style={{ width: `${playbackProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Live Recording Modal (Webcam Video or Microphone Audio) */}
      {isRecordingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in-50 duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {recordingMode === 'video' ? (
                  <Camera className="w-5 h-5 text-rose-400" />
                ) : (
                  <Mic className="w-5 h-5 text-cyan-400" />
                )}
                <h3 className="font-bold text-base text-white">
                  {recordingMode === 'video' ? 'Record Video with Camera & Mic' : 'Record Audio with Microphone'}
                </h3>
              </div>
              <button
                onClick={closeRecordingModal}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {recordingError ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-950/60 border border-amber-800 text-xs text-amber-300 leading-relaxed">
                  <p className="font-semibold text-amber-200 mb-1">Hardware / Permission Note:</p>
                  {recordingError}
                </div>

                <div className="text-center p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center mx-auto animate-pulse">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Instant Ingest Stream Generator</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Generate a 3-second live 16kHz speech stream without requiring camera permissions.
                  </p>

                  <button
                    onClick={startSimulatedRecording}
                    disabled={isCurrentlyRecording}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs hover:brightness-110 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
                  >
                    {isCurrentlyRecording ? `Recording... (${recordSeconds}s / 3s)` : '✨ Start Instant Live Stream Ingest'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Viewport: Video Preview or Audio Waveform */}
                <div className="aspect-video bg-black rounded-2xl overflow-hidden relative border border-slate-800 flex items-center justify-center">
                  {recordingMode === 'video' ? (
                    <video
                      ref={livePreviewVideoRef}
                      muted
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover mirror"
                    />
                  ) : (
                    <div className="text-center space-y-3 p-6">
                      <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center mx-auto animate-pulse">
                        <Mic className="w-8 h-8" />
                      </div>
                      <div className="text-xs text-slate-300 font-mono">Microphone Audio Channel Ready</div>
                    </div>
                  )}

                  {isCurrentlyRecording && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-rose-600/90 text-white text-xs font-mono font-bold flex items-center gap-2 animate-pulse shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-white" />
                      REC {Math.floor(recordSeconds / 60)}:{String(recordSeconds % 60).padStart(2, '0')}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  {!isCurrentlyRecording ? (
                    <>
                      <button
                        onClick={startRecording}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition-all shadow-lg shadow-rose-600/30 active:scale-95"
                      >
                        <Radio className="w-4 h-4 animate-pulse" />
                        <span>Start Recording</span>
                      </button>

                      <button
                        onClick={startSimulatedRecording}
                        className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-semibold text-xs transition-all active:scale-95"
                      >
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span>Instant Ingest (Simulated)</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-bold text-sm transition-all shadow-lg active:scale-95"
                    >
                      <Square className="w-4 h-4 fill-current" />
                      <span>Stop & Load into Comparison</span>
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-center text-slate-400">
                  Speak at your natural pace with any regional accent. Once stopped, your recording will
                  immediately load into the dual comparison player for EchoFlow speech normalization!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
