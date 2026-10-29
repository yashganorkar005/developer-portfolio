import { cx } from '../../utils';

type ButtonVariant = 'primary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  as?: 'button' | 'a';
  href?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white',
  outline:
    'border border-[var(--color-border)] hover:border-[var(--color-accent)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
  ghost: 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  as = 'button',
  href,
  target,
  rel,
  children,
  className,
  ...props
}: ButtonProps) {
  const classes = cx(
    'inline-flex items-center gap-2 font-medium rounded-md transition-[background-color,border-color,color,transform,box-shadow] duration-150 cursor-pointer hover:-translate-y-px active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] motion-reduce:transform-none',
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  if (as === 'a' && href) {
    return (
      <a href={href} target={target} rel={rel} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
