import { useState, useEffect, useMemo } from 'react';
import { AnimatedSection } from '../ui/AnimatedSection';
import { SectionHeader } from '../ui/SectionHeader';
import { skillsApi } from '../../api/portfolio';
import type { Skill } from '../../types';

function SkillPill({ name, proficiency }: { name: string; proficiency: number }) {
  return (
    <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-subtle)] px-4 py-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-[var(--color-text-primary)]">{name}</span>
        <span className="font-mono text-xs text-[var(--color-text-muted)]">{proficiency}%</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-[var(--color-border)]" aria-hidden="true">
        <div className="h-full rounded-full bg-[var(--color-accent)]" style={{ width: `${proficiency}%` }} />
      </div>
      <span className="sr-only">{name} proficiency {proficiency}%</span>
    </div>
  );
}

export function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    skillsApi.getAll()
      .then((res) => { if (!cancelled) setSkills(res.data); })
      .catch(() => { if (!cancelled) setSkills([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const categories = useMemo(() => {
    const map = new Map<string, Skill[]>();
    for (const s of skills) {
      const arr = map.get(s.category) ?? [];
      arr.push(s);
      map.set(s.category, arr);
    }
    return Array.from(map.entries());
  }, [skills]);

  return (
    <section id="skills" className="py-28 bg-[var(--color-bg-subtle)]">
      <div className="container-narrow">
        <AnimatedSection>
          <SectionHeader
            eyebrow="Skills"
            title="Technical toolkit"
            description="The languages, frameworks, and tools I use to build useful software."
          />
        </AnimatedSection>
        {loading ? (
          <div className="py-12 text-center text-[var(--color-text-secondary)]">Loading skills…</div>
        ) : skills.length === 0 ? (
          <div className="py-12 text-center text-[var(--color-text-secondary)]">No skills published yet.</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {categories.map(([cat, arr], index) => (
              <AnimatedSection key={cat} delay={Math.min(index * 0.05, 0.2)}>
                <div className="h-full rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 transition-colors duration-300 hover:border-[var(--color-accent)]/40">
                  <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">{cat}</h3>
                  <div className="space-y-3">
                    {arr.map((s) => <SkillPill key={s.id ?? s.name} name={s.name} proficiency={s.proficiency} />)}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
