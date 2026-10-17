/**
 * Audio utility functions for EchoFlow.
 * Converts raw PCM audio (base64 string, Uint8Array, or Int16Array) into a valid RIFF/WAVE Blob for browser playback.
 */

/**
 * Converts PCM audio to a WAV Blob.
 * If a RIFF header is already present, wraps directly into an audio/wav Blob.
 * If raw PCM bytes (e.g. 16kHz or 24kHz audio), prepends a 44-byte standard RIFF WAV header (16-bit mono).
 */
export const pcmToWavBlob = (
  input: string | Uint8Array | Int16Array,
  sampleRate: number = 24000
): Blob => {
  let pcm: Uint8Array;

  if (typeof input === 'string') {
    const bin = atob(input);
    pcm = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      pcm[i] = bin.charCodeAt(i);
    }
  } else if (input instanceof Int16Array) {
    pcm = new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
  } else {
    pcm = input;
  }

  // Check if RIFF header already present
  if (
    pcm.length >= 4 &&
    pcm[0] === 0x52 && // 'R'
    pcm[1] === 0x49 && // 'I'
    pcm[2] === 0x46 && // 'F'
    pcm[3] === 0x46    // 'F'
  ) {
    return new Blob([pcm as unknown as BlobPart], { type: 'audio/wav' });
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
  h.setUint32(24, sampleRate, true); // sampleRate (e.g. 16000 or 24000)
  h.setUint32(28, sampleRate * 2, true); // byteRate (sampleRate * 1 * 16/8)
  h.setUint16(32, 2, true); // blockAlign (1 * 16/8)
  h.setUint16(34, 16, true); // bitsPerSample: 16
  w(36, 'data');
  h.setUint32(40, pcm.length, true);

  return new Blob([h.buffer, pcm as unknown as BlobPart], { type: 'audio/wav' });
};
