export const CURVE_AMPLITUDE_RATIO = 0.18;
const ARC_FREQUENCY = Math.PI / 4;
const CURVE_TENSION = 1.25;

export function getPathCurveOffset(
  globalIndex: number,
  screenWidth: number,
): number {
  const amplitude = screenWidth * CURVE_AMPLITUDE_RATIO;
  const baseSine = Math.sin(globalIndex * ARC_FREQUENCY);
  const adjustedSine =
    Math.sign(baseSine) * Math.pow(Math.abs(baseSine), CURVE_TENSION);
  return adjustedSine * amplitude * -1;
}
