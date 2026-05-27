import { useFontStore } from '@/stores/useFontStore';

/**
 * Returns the currently selected Kurdish font family name.
 * Use this in every screen / game component instead of hardcoding
 * User-selected Rabar font (supports Sorani Kurdish). Use with AppText for mixed EN/KU.
 *
 * Usage:
 *   const font = useKurdishFont();
 *   <Text style={{ fontFamily: font }}>...</Text>
 */
export function useKurdishFont(): string {
  return useFontStore((s) => s.selectedFont);
}
