/** Downmixes interleaved PCM16 audio and resamples it to the requested rate. */
export function normalizePcm16(
  bytes: Uint8Array,
  sourceRate: number,
  targetRate: number,
  channels = 1,
): Uint8Array {
  const channelCount = Math.max(1, Math.floor(channels));
  const sourceFrames = Math.floor(bytes.byteLength / (2 * channelCount));
  if (
    sourceFrames === 0 ||
    !Number.isFinite(sourceRate) ||
    !Number.isFinite(targetRate) ||
    sourceRate <= 0 ||
    targetRate <= 0
  ) {
    return new Uint8Array(0);
  }

  if (sourceRate === targetRate && channelCount === 1) return bytes;

  const source = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const sampleAt = (frame: number) => {
    let sum = 0;
    for (let channel = 0; channel < channelCount; channel += 1) {
      sum += source.getInt16((frame * channelCount + channel) * 2, true);
    }
    return sum / channelCount;
  };

  const targetFrames = Math.max(
    1,
    Math.round((sourceFrames * targetRate) / sourceRate),
  );
  const output = new ArrayBuffer(targetFrames * 2);
  const view = new DataView(output);

  for (let frame = 0; frame < targetFrames; frame += 1) {
    const position = (frame * sourceRate) / targetRate;
    const left = Math.min(Math.floor(position), sourceFrames - 1);
    const right = Math.min(left + 1, sourceFrames - 1);
    const fraction = position - left;
    const sample = sampleAt(left) * (1 - fraction) + sampleAt(right) * fraction;
    view.setInt16(frame * 2, Math.max(-32768, Math.min(32767, Math.round(sample))), true);
  }

  return new Uint8Array(output);
}
