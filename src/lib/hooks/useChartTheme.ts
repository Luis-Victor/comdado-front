import { useMemo } from 'react';
import { ThemeConfig, getThemeConfig } from '../types/chart';

export function useChartTheme(theme: 'light' | 'dark'): ThemeConfig {
  return useMemo(() => getThemeConfig(theme), [theme]);
}