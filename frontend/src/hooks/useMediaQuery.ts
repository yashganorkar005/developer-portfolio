import { useState, useEffect } from 'react';

/**
 * Returns true when the viewport width is below the given breakpoint (px).
 * Defaults to the Tailwind `md` breakpoint (768px).
 */
export function useMediaQuery(breakpoint = 768): boolean {
  const [matches, setMatches] = useState(
    () => window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);

  return matches;
}
