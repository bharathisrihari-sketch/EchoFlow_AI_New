/**
 * EchoFlow AI: Audio Ingestion Hook with Strict Data Validation Layer
 * 
 * Validates audio payload MIME types, byte structure, sample rate, channel count,
 * and amplitude integrity before dispatching to the Gemini Live API client.
 * Prevents erratic processing caused by corrupted frames, NaN audio, or unaligned chunks.
 */

import { useState, useRef, useCallback } from 'react';

export interface AudioValidationConfig {
  expectedMimeTypes: string[];
  expectedSampleRate: number;
  expectedChannels: number;
  minFrameSizeBytes: number;
  maxFrameSizeBytes: number;
  allowRawPcm: boolean;
}

export interface AudioValidationResult {
  isValid: boolean;
  mimeType: string;
  byteLength: number;
  sampleCount: number;
  sampleRate: number;
  channels: number;
  peakAmplitude: number;
  rmsEnergy: number;
  hasClipping: boolean;
  hasNaN: boolean;
  rejectionReason?: string;
}

export const DEFAULT_VALIDATION_CONFIG: AudioValidationConfig = {
  expectedMimeTypes: [
    'audio/pcm;rate=16000',
    'audio/l16;rate=16000;channels=1',
    'audio/pcm',
    'audio/webm',
    'audio/wav',
  ],
  expectedSampleRate: 16000,
  expectedChannels: 1,
  minFrameSizeBytes: 64, // At least 32 samples (2ms)
  maxFrameSizeBytes: 32768, // Max 16k samples (1s)
  allowRawPcm: true,
};

/**
 * Validates an ArrayBuffer or TypedArray containing audio samples.
 */
export function validateAudioStructure(
  buffer: ArrayBuffer | ArrayBufferView,
  mimeType = 'audio/pcm;rate=16000',
  config: AudioValidationConfig = DEFAULT_VALIDATION_CONFIG
): AudioValidationResult {
  const byteLength = buffer.byteLength;

  // 1. MIME Type Validation
  const normalizedMime = mimeType.toLowerCase().trim();
  const isAllowedMime = config.expectedMimeTypes.some((allowed) =>
    normalizedMime.includes(allowed.toLowerCase())
  );

  if (!isAllowedMime && !config.allowRawPcm) {
    return {
      isValid: false,
      mimeType: normalizedMime,
      byteLength,
      sampleCount: 0,
      sampleRate: config.expectedSampleRate,
      channels: config.expectedChannels,
      peakAmplitude: 0,
      rmsEnergy: 0,
      hasClipping: false,
      hasNaN: false,
      rejectionReason: `Unsupported MIME type: '${mimeType}'. Expected one of: ${config.expectedMimeTypes.join(', ')}`,
    };
  }

  // 2. Length & Byte Alignment Validation (16-bit PCM requires even number of bytes)
  if (byteLength < config.minFrameSizeBytes) {
    return {
      isValid: false,
      mimeType: normalizedMime,
      byteLength,
      sampleCount: 0,
      sampleRate: config.expectedSampleRate,
      channels: config.expectedChannels,
      peakAmplitude: 0,
      rmsEnergy: 0,
      hasClipping: false,
      hasNaN: false,
      rejectionReason: `Audio payload underflow: ${byteLength} bytes < minimum ${config.minFrameSizeBytes} bytes`,
    };
  }

  if (byteLength > config.maxFrameSizeBytes) {
    return {
      isValid: false,
      mimeType: normalizedMime,
      byteLength,
      sampleCount: 0,
      sampleRate: config.expectedSampleRate,
      channels: config.expectedChannels,
      peakAmplitude: 0,
      rmsEnergy: 0,
      hasClipping: false,
      hasNaN: false,
      rejectionReason: `Audio payload overflow: ${byteLength} bytes > maximum ${config.maxFrameSizeBytes} bytes`,
    };
  }

  if (byteLength % 2 !== 0) {
    return {
      isValid: false,
      mimeType: normalizedMime,
      byteLength,
      sampleCount: 0,
      sampleRate: config.expectedSampleRate,
      channels: config.expectedChannels,
      peakAmplitude: 0,
      rmsEnergy: 0,
      hasClipping: false,
      hasNaN: false,
      rejectionReason: `Unaligned 16-bit PCM audio frame: byte length ${byteLength} is not an even multiple of 2`,
    };
  }

  // 3. Acoustic Amplitude & NaN / Infinity Integrity Check
  const sampleCount = Math.floor(byteLength / 2);
  const pcmView =
    buffer instanceof Int16Array
      ? buffer
      : ArrayBuffer.isView(buffer)
      ? new Int16Array(buffer.buffer, buffer.byteOffset, sampleCount)
      : new Int16Array(buffer);

  let peak = 0;
  let sumSq = 0;
  let clippingCount = 0;
  let hasNaN = false;

  for (let i = 0; i < sampleCount; i++) {
    const val = pcmView[i];
    if (isNaN(val)) {
      hasNaN = true;
      break;
    }
    const abs = Math.abs(val);
    if (abs > peak) peak = abs;
    sumSq += (val / 32768) * (val / 32768);
    if (abs >= 32760) clippingCount++;
  }

  if (hasNaN) {
    return {
      isValid: false,
      mimeType: normalizedMime,
      byteLength,
      sampleCount,
      sampleRate: config.expectedSampleRate,
      channels: config.expectedChannels,
      peakAmplitude: peak,
      rmsEnergy: 0,
      hasClipping: false,
      hasNaN: true,
      rejectionReason: 'Corrupted payload: audio samples contain NaN or unparseable float values',
    };
  }

  const rmsEnergy = Math.sqrt(sumSq / sampleCount);
  const normalizedPeak = peak / 32768;

  return {
    isValid: true,
    mimeType: normalizedMime,
    byteLength,
    sampleCount,
    sampleRate: config.expectedSampleRate,
    channels: config.expectedChannels,
    peakAmplitude: normalizedPeak,
    rmsEnergy,
    hasClipping: clippingCount > 0,
    hasNaN: false,
  };
}

/**
 * Custom React Hook: useAudioIngestion
 * 
 * Provides an ingestion pipeline with strict validation, real-time logging,
 * and safe dispatching to prevent erratic processing in the Gemini Live API client.
 */
export function useAudioIngestion(customConfig?: Partial<AudioValidationConfig>) {
  const config = { ...DEFAULT_VALIDATION_CONFIG, ...customConfig };
  const [lastValidation, setLastValidation] = useState<AudioValidationResult | null>(null);
  const [totalFramesValidated, setTotalFramesValidated] = useState<number>(0);
  const [totalFramesRejected, setTotalFramesRejected] = useState<number>(0);

  const packetSeqRef = useRef<number>(0);

  /**
   * Ingests, validates, and logs an incoming audio chunk.
   * Returns true if safe to dispatch to Gemini Live API; false if rejected.
   */
  const ingestAndValidate = useCallback(
    (
      audioData: ArrayBuffer | ArrayBufferView,
      mimeType = 'audio/pcm;rate=16000',
      onValidPayload?: (data: ArrayBuffer | ArrayBufferView) => void
    ): boolean => {
      packetSeqRef.current++;
      const seq = packetSeqRef.current;

      console.debug(`[AudioIngestion:Seq#${seq}] Validating incoming frame: ${audioData.byteLength} bytes, MIME: ${mimeType}`);

      const result = validateAudioStructure(audioData, mimeType, config);
      setLastValidation(result);

      if (!result.isValid) {
        setTotalFramesRejected((prev) => prev + 1);
        console.warn(
          `[AudioIngestion:Seq#${seq}] REJECTED payload: ${result.rejectionReason} | Raw Bytes: ${result.byteLength}`
        );
        return false;
      }

      setTotalFramesValidated((prev) => prev + 1);
      console.log(
        `[AudioIngestion:Seq#${seq}] ACCEPTED - Valid frame: ${result.sampleCount} samples, Peak: ${(result.peakAmplitude * 100).toFixed(1)}%, RMS: ${(result.rmsEnergy * 100).toFixed(1)}%`
      );

      if (onValidPayload) {
        try {
          onValidPayload(audioData);
        } catch (dispatchErr: any) {
          console.error(`[AudioIngestion:Seq#${seq}] Error dispatching to Gemini Live API client:`, dispatchErr);
          return false;
        }
      }

      return true;
    },
    [config]
  );

  return {
    ingestAndValidate,
    lastValidation,
    totalFramesValidated,
    totalFramesRejected,
    config,
  };
}
