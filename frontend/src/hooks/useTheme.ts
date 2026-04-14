import { useThemeContext } from '@/lib/theme/ThemeProvider';

/**
 * Hook para acceder y cambiar el tema actual
 */
export function useTheme() {
  return useThemeContext();
}
