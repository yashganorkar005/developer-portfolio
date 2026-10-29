import { AnimatedSection } from '../ui/AnimatedSection';
import { SectionHeader } from '../ui/SectionHeader';
import { useState, useEffect } from 'react';
import { educationApi } from '../../api/portfolio';
import { formatDate } from '../../utils';

export function EducationSection() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    educationApi.getAll()
      .then(res => { if (!cancelled) setItems(Array.isArray(res.data) ? res.data : []); })
      .catch(() => { if (!cancelled) setItems([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);
  return (
    <section id="education" className="py-28 bg-[var(--color-bg-subtle)]">
      <div className="container-narrow">
        <AnimatedSection>
          <SectionHeader eyebrow="Education" title="Academic background" />
        </AnimatedSection>
        {loading ? <div className="py-12 text-center">Loading…</div> : items.length === 0 ? <div className="py-12 text-center text-[var(--color-text-secondary)]">No education published yet.</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((edu) => (
              <AnimatedSection key={edu.id}>
                <div className="h-full p-7 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] hover:border-[var(--color-accent)]/40 hover:-translate-y-1 hover:shadow-sm transition-[border-color,transform,box-shadow] duration-200 motion-reduce:transform-none">
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)] leading-tight">{edu.degree}</h3>
                  <p className="text-base text-[var(--color-text-secondary)] font-medium mb-1">{edu.field}</p>
                  <p className="text-sm text-[var(--color-accent)] mb-4">{edu.institution}</p>
                  <p className="text-xs font-mono text-[var(--color-text-muted)] mb-4">{formatDate(edu.startDate)} — {edu.endDate ? formatDate(edu.endDate) : 'Present'}</p>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{edu.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
