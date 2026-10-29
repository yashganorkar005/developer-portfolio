import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { cx } from '../../utils';

interface TimelineItem {
  id: number;
  date: string;
  children: React.ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className = '' }: TimelineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px 0px' });
  const reducedMotion = useReducedMotion();

  return (
    <div
      ref={ref}
      className={cx(
        'relative pl-7 sm:pl-10 [--timeline-line-x:0.4rem] [--timeline-padding:1.75rem] sm:[--timeline-line-x:0.65rem] sm:[--timeline-padding:2.5rem]',
        className,
      )}
    >
      <motion.div
        aria-hidden="true"
        className="absolute bottom-4 left-[var(--timeline-line-x)] top-2 w-px origin-top bg-[var(--color-border)]"
        initial={{ scaleY: reducedMotion ? 1 : 0 }}
        animate={reducedMotion || inView ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'top' }}
      />
      <div className="space-y-8 sm:space-y-10">
        {items.map((item, index) => (
          <motion.article
            key={item.id}
            className="relative"
            initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            animate={reducedMotion || inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: reducedMotion ? 0 : index * 0.08 }}
          >
            <span
              aria-hidden="true"
              className="absolute left-[calc(var(--timeline-line-x)-var(--timeline-padding)-0.375rem)] top-1.5 h-3 w-3 rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-bg-subtle)]"
            />
            <p className="mb-2 font-mono text-xs text-[var(--color-text-muted)]">{item.date}</p>
            {item.children}
          </motion.article>
        ))}
      </div>
    </div>
  );
}
