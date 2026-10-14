/** Clamp a number between min and max. */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/** Linearly interpolate between a and b by t (0–1). */
export const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * t;

/** Format a date string to a human-readable month + year. */
export const formatDate = (iso?: string | null): string => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

/** Truncate a string to maxLength and append an ellipsis if needed. */
export const truncate = (str: string, maxLength: number): string =>
  str.length <= maxLength ? str : `${str.slice(0, maxLength - 1)}…`;

/** Build a class string from a list, filtering out falsy values. */
export const cx = (...classes: (string | false | null | undefined)[]): string =>
  classes.filter(Boolean).join(' ');

/**
 * Safely resolves relative media and asset URLs (e.g. /api/media/uuid.jpg)
 * against the backend API origin so they load properly across both
 * local development and production deployments.
 */
export const resolveMediaUrl = (path?: string | null): string => {
  if (!path) return '';
  if (/^(https?:|blob:|data:)/i.test(path)) return path;

  const rawBase = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';
  if (/^https?:\/\//i.test(rawBase)) {
    try {
      const url = new URL(rawBase);
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      return `${url.origin}${cleanPath}`;
    } catch {
      // fallback to relative path below
    }
  }

  return path.startsWith('/') ? path : `/${path}`;
};

