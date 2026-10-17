import { LanguageKey, LanguagePacingConfig } from '../types';

export const LANGUAGE_CONFIGS: Record<LanguageKey, LanguagePacingConfig> = {
  English: {
    code: 'en-US',
    name: 'English',
    nativeName: 'English (Global)',
    flag: '🌐',
    targetPaceWpm: 150,
    pacingStrategy: 'Syllable Stress Regularization',
    systemInstruction:
      'You are EchoFlow Voice Cadence Engine for English. Ingest raw 16kHz speech and normalize rapid delivery (220+ WPM) into steady 150 WPM enterprise cadence. Regularize syllable stress, eliminate consonant clipping on word boundaries (especially terminal t, d, k), suppress acoustic filler particles (um, uh, like, you know), and preserve natural pitch inflection (94%+ F0 envelope retention).',
    fillerWords: ['um', 'uh', 'like', 'you know', 'basically', 'actually', 'sort of'],
    phoneticNotes: 'Mitigates rapid consonant clipping & syllable bunching on technical acronyms.',
  },
  French: {
    code: 'fr-FR',
    name: 'French',
    nativeName: 'Français (Paris)',
    flag: '🇫🇷',
    targetPaceWpm: 146,
    pacingStrategy: 'Nasal Vowel & Prosodic Group Harmonization',
    systemInstruction:
      'You are EchoFlow Voice Cadence Engine for French. Ingest speech and normalize hesitation-heavy, elongated pacing (125 WPM) into articulate 146 WPM. Harmonize vowel elongation, suppress cognitive fillers (euh, ben, genre, voilà, um), eliminate abrupt pauses between syntactic groups, and retain authentic French melodic intonational contour.',
    fillerWords: ['euh', 'ben', 'genre', 'voilà', 'bon', 'quoi', 'um'],
    phoneticNotes: 'Harmonizes extended nasal vowel hesitations and balances rhythmic group stress.',
  },
  German: {
    code: 'de-DE',
    name: 'German',
    nativeName: 'Deutsch (Frankfurt)',
    flag: '🇩🇪',
    targetPaceWpm: 152,
    pacingStrategy: 'Staccato Consonant Cluster Smoothing',
    systemInstruction:
      'You are EchoFlow Voice Cadence Engine for German. Ingest speech and harmonize rapid staccato bursts (215+ WPM) into steady 152 WPM cadence. Smooth compound-noun syllable rushes and rigid consonant cluster transitions (pf, ts, sch, cht), soften harsh glottal stops, remove filler particles (ähm, halt, also, quasi), and maintain authoritative tonal precision.',
    fillerWords: ['ähm', 'halt', 'also', 'quasi', 'sozusagen', 'na ja'],
    phoneticNotes: 'Buffers abrupt glottal attacks and regularizes multi-syllabic compound noun pacing.',
  },
  Telugu: {
    code: 'te-IN',
    name: 'Telugu',
    nativeName: 'తెలుగు (Hyderabad)',
    flag: '🇮🇳',
    targetPaceWpm: 150,
    pacingStrategy: 'Retroflex Velocity & Syllable Smoothing',
    systemInstruction:
      'You are EchoFlow Voice Cadence Engine for Telugu. Ingest speech and normalize high-syllable-velocity bursts (230+ WPM) into smooth 150 WPM cadence. Smooth rapid retroflex transitions (ట, ఠ, డ, ఢ, ణ) and syllable bunching, eliminate colloquial filler markers (ante, mari, adi, kadha, like), buffer clause pause durations, and preserve authentic speaker vocal resonance and emotional urgency.',
    fillerWords: ['ante', 'mari', 'adi', 'kadha', 'chudandi', 'like', 'um'],
    phoneticNotes: 'Stabilizes high syllable velocity (7.8 syl/sec) and balances retroflex vowel junctions.',
  },
  Tamil: {
    code: 'ta-IN',
    name: 'Tamil',
    nativeName: 'தமிழ் (Chennai)',
    flag: '🇮🇳',
    targetPaceWpm: 152,
    pacingStrategy: 'Agglutinative Burst & Geminate Regularization',
    systemInstruction:
      'You are EchoFlow Voice Cadence Engine for Tamil. Ingest speech and harmonize rapid agglutinative consonant rushes (225+ WPM) into articulate 152 WPM pacing. Smooth geminate consonant transitions (ட்ட, த்த, ப்ப), eliminate filler particles (vandhu, appo, seri, paatha, like), prevent terminal syllable drop-off, and preserve natural vocal pitch envelope.',
    fillerWords: ['vandhu', 'appo', 'seri', 'paatha', 'romba', 'like', 'um'],
    phoneticNotes: 'Prevents terminal syllable truncation and smooths rapid geminate consonant bursts.',
  },
  Hindi: {
    code: 'hi-IN',
    name: 'Hindi',
    nativeName: 'हिन्दी (Gurugram / Delhi)',
    flag: '🇮🇳',
    targetPaceWpm: 148,
    pacingStrategy: 'Aspiration Balancing & Cadence Stabilization',
    systemInstruction:
      'You are EchoFlow Voice Cadence Engine for Hindi. Ingest speech and normalize hurried sentence-level cadence (220+ WPM) into steady 148 WPM. Balance aspirated phoneme transitions (kh, gh, th, dh), suppress colloquial filler interjections (arre, matlab, dekho, toh, bhaiya, yaani), smooth erratic stress swings, and preserve natural emotional urgency and warmth.',
    fillerWords: ['arre', 'matlab', 'dekho', 'toh', 'bhaiya', 'yaani', 'like', 'um'],
    phoneticNotes: 'Softens sudden sentence-final emphatic pitch swings and regulates breath aspiration pacing.',
  },
};

export const DEFAULT_LANGUAGE: LanguageKey = 'English';
export const STORAGE_KEY_LANGUAGE = 'echoflow_selected_language';

export function getStoredLanguage(): LanguageKey {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  try {
    const stored = localStorage.getItem(STORAGE_KEY_LANGUAGE);
    if (stored && stored in LANGUAGE_CONFIGS) {
      return stored as LanguageKey;
    }
  } catch (e) {
    console.warn('Storage read fallback:', e);
  }
  return DEFAULT_LANGUAGE;
}

export function setStoredLanguage(lang: LanguageKey): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_LANGUAGE, lang);
  } catch (e) {
    console.warn('Storage write error:', e);
  }
}
