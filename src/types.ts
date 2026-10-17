export type LanguageKey = 'English' | 'French' | 'German' | 'Telugu' | 'Tamil' | 'Hindi';

export interface LanguagePacingConfig {
  code: string;
  name: LanguageKey;
  nativeName: string;
  flag: string;
  targetPaceWpm: number;
  pacingStrategy: string;
  systemInstruction: string;
  fillerWords: string[];
  phoneticNotes: string;
}

export interface TelemetryData {
  latencyMs: number;
  targetPaceWpm: number;
  originalPaceWpm: number;
  cadenceVarianceReduction: number;
  pitchPreservationIndex: number;
  phoneticIntelligibilityLift: number;
  bufferHealth: 'optimal' | 'buffering' | 'reconnecting';
  jitterMs: number;
  packetCount: number;
  latencyBreakdown: {
    ingestion: number;
    geminiLiveRelay: number;
    resynthesisDsp: number;
    jitterBuffer: number;
  };
  activeLanguage?: LanguageKey;
  pacingStrategy?: string;
  systemInstructionPreview?: string;
  hasActiveSession?: boolean;
}

export interface AudioScenario {
  id: string;
  title: string;
  language: LanguageKey;
  persona: string;
  accent: string;
  originalWpm: number;
  description: string;
  transcript: string;
  nativeScript?: string;
  prosodyIssues: string[];
  recommendedTargetWpm: number;
  detectedEmotion: string;
}

export interface RoiState {
  seats: number;
  callsPerAgentPerDay: number;
  baselineAhtMinutes: number;
  ahtReductionPercent: number;
  loadedAgentHourlyRate: number;
  workDaysPerYear: number;
}

export interface CallMessage {
  id: string;
  speaker: 'customer' | 'agent';
  speakerName: string;
  role: string;
  rawText: string;
  normalizedText: string;
  originalWpm: number;
  normalizedWpm: number;
  emotion: string;
  timestamp: string;
}
