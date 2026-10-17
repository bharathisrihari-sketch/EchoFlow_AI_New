/**
 * Audio utility functions for EchoFlow.
 * Converts raw PCM base64 audio into a valid RIFF/WAVE Blob for browser playback.
 */

/**
 * Converts base64 encoded audio to a WAV Blob.
 * If a RIFF header is already present, wraps directly into an audio/wav Blob.
 * If raw PCM bytes (e.g. 24kHz Gemini output), prepends a 44-byte standard RIFF WAV header (16-bit mono).
 */
export const pcmToWavBlob = (base64: string, sampleRate = 24000): Blob => {
  const bin = atob(base64);
  const pcm = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    pcm[i] = bin.charCodeAt(i);
  }
  if (bin.startsWith('RIFF')) {
    return new Blob([pcm], { type: 'audio/wav' });
  }
  const h = new DataView(new ArrayBuffer(44));
  const w = (o: number, s: string) => [...s].forEach((c, i) => h.setUint8(o + i, c.charCodeAt(0)));
  w(0, 'RIFF');
  h.setUint32(4, 36 + pcm.length, true);
  w(8, 'WAVE');
  w(12, 'fmt ');
  h.setUint32(16, 16, true);
  h.setUint16(20, 1, true); // audioFormat: 1 (PCM)
  h.setUint16(22, 1, true); // numChannels: 1 (mono)
  h.setUint32(24, sampleRate, true); // sampleRate (default 24000)
  h.setUint32(28, sampleRate * 2, true); // byteRate (sampleRate * 1 * 16/8)
  h.setUint16(32, 2, true); // blockAlign (1 * 16/8)
  h.setUint16(34, 16, true); // bitsPerSample: 16
  w(36, 'data');
  h.setUint32(40, pcm.length, true);
  return new Blob([h.buffer, pcm], { type: 'audio/wav' });
};
