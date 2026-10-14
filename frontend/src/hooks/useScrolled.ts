import { useState, useEffect } from 'react';

/**
 * Tracks whether the user has scrolled past a given pixel threshold.
 * Useful for changing navbar styles on scroll.
 */
export function useScrolled(threshold = 60): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    handler(); // set initial state
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [threshold]);

  return scrolled;
}
