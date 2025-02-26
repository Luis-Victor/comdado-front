import { useState, useEffect } from 'react';
import { Breakpoint, DashboardBreakpoints } from '../types/dashboard';

const defaultBreakpoints: DashboardBreakpoints = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

export function useBreakpoint(customBreakpoints?: DashboardBreakpoints) {
  const breakpoints = customBreakpoints || defaultBreakpoints;
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('xl');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < breakpoints.sm) {
        setCurrentBreakpoint('sm');
      } else if (width < breakpoints.md) {
        setCurrentBreakpoint('md');
      } else if (width < breakpoints.lg) {
        setCurrentBreakpoint('lg');
      } else {
        setCurrentBreakpoint('xl');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoints]);

  return currentBreakpoint;
}