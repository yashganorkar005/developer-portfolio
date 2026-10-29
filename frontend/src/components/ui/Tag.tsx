import { cx } from '../../utils';

interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'subtle';
  className?: string;
}

export function Tag({ children, variant = 'default', className }: TagProps) {
  return (
    <span
      className={cx(
        'inline-block px-2.5 py-0.5 text-xs font-medium rounded-full transition-colors duration-150',
        variant === 'default' &&
          'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)]',
        variant === 'accent' &&
          'bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent)]/20',
        variant === 'subtle' &&
          'bg-transparent text-[var(--color-text-muted)] border border-[var(--color-border-subtle)]',
        className,
      )}
    >
      {children}
    </span>
  );
}
