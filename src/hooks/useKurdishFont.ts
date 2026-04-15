import { useFontStore } from '@/stores/useFontStore';

/**
 * Returns the currently selected Kurdish font family name.
 * Use this in every screen / game component instead of hardcoding
 * "DINNextRoundedBold" or a specific Rabar font name.
 *
 * Usage:
 *   const font = useKurdishFont();
 *   <Text style={{ fontFamily: font }}>...</Text>
 */
export function useKurdishFont(): string {
  return useFontStore((s) => s.selectedFont);
}
