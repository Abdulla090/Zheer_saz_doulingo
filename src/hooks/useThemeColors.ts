import { useColorScheme } from 'react-native';
import { useSettingsStore } from '../stores/useSettingsStore';
import { Colors } from '../constants/theme';

export function useThemeColors() {
  const themeSetting = useSettingsStore((s) => s.theme);
  const systemColorScheme = useColorScheme();
  
  const isDark = 
    themeSetting === 'dark' || 
    (themeSetting === 'system' && systemColorScheme === 'dark');
    
  return {
    colors: isDark ? Colors.dark : Colors.light,
    isDark,
  };
}
