import { Trophy } from 'lucide-react';
import { AnimatedSection } from '../ui/AnimatedSection';
import { SectionHeader } from '../ui/SectionHeader';
import { useState, useEffect } from 'react';
import { achievementsApi } from '../../api/portfolio';
import type { Achievement } from '../../types';
import { formatDate, resolveMediaUrl } from '../../utils';

export function AchievementsSection() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    achievementsApi.getAll()
      .then((response) => {
        if (cancelled) return;
        const achievements = Array.isArray(response.data) ? response.data : [];
        setItems(achievements.filter((item) => item.published !== false));
      })
      .catch(() => { if (!cancelled) setItems([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);
  return (
    <section id="achievements" className="py-28">
      <div className="container-narrow">
        <AnimatedSection>
          <SectionHeader eyebrow="Achievements" title="Notable wins" />
        </AnimatedSection>
        {loading ? <div className="py-12 text-center">Loading…</div> : items.length === 0 ? <div className="py-12 text-center text-[var(--color-text-secondary)]">No achievements published yet.</div> : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((a) => (
              <AnimatedSection key={a.id}>
                <div className="group h-full p-7 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] hover:border-[var(--color-accent)]/40 hover:-translate-y-1 transition duration-300 motion-reduce:transform-none">
                  {a.imageUrl && (
                    <img src={resolveMediaUrl(a.imageUrl)} alt="" loading="lazy" className="w-full h-40 object-cover rounded-xl mb-6" />
                  )}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--color-accent-subtle)] text-[var(--color-accent)] shrink-0"><Trophy size={18} aria-hidden="true" /></div>
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)] leading-tight">{a.title}</h3>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{a.description}</p>
                  <p className="text-xs font-mono text-[var(--color-text-muted)] mt-5">{formatDate(a.date)}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
