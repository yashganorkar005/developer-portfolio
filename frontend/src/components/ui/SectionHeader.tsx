import { cx } from '../../utils';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  center?: boolean;
}

export function SectionHeader({ eyebrow, title, description, center = false }: SectionHeaderProps) {
  return (
    <div className={cx('mb-12', center && 'text-center')}>
      <span className="inline-block mb-3 text-xs font-semibold tracking-widest uppercase text-[var(--color-accent)]">
        {eyebrow}
      </span>
      <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-[var(--color-text-primary)] leading-tight">
        {title}
      </h2>
      {description && (
        <p className={cx(
          'mt-4 text-[var(--color-text-secondary)] leading-relaxed',
          center ? 'max-w-xl mx-auto' : 'max-w-2xl',
        )}>
          {description}
        </p>
      )}
    </div>
  );
}
