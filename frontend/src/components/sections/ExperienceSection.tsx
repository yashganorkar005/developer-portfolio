import { AnimatedSection } from '../ui/AnimatedSection';
import { SectionHeader } from '../ui/SectionHeader';
import { formatDate } from '../../utils';
import { useState, useEffect } from 'react';
import { experienceApi, educationApi } from '../../api/portfolio';

export function ExperienceSection() {
  const [experience, setExperience] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      experienceApi.getAll().then(r => Array.isArray(r.data) ? r.data : []),
      educationApi.getAll().then(r => Array.isArray(r.data) ? r.data : [])
    ]).then(([expData, eduData]) => {
      if (!cancelled) {
        setExperience(expData);
        setEducation(eduData);
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) { setExperience([]); setEducation([]); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <section id="experience" className="py-28 bg-[var(--color-bg-subtle)]">
      <div className="container-narrow">
        <div className="grid lg:grid-cols-2 gap-16">
          <AnimatedSection>
            <SectionHeader eyebrow="Experience" title="Work history" />
            {loading ? <div className="py-4 text-[var(--color-text-secondary)]">Loading…</div> : experience.length === 0 ? <div className="py-4 text-[var(--color-text-secondary)]">No experience published yet.</div> : (
              <div className="grid grid-cols-1 gap-6">
                {experience.map((exp) => (
                  <div key={exp.id} className="p-7 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] hover:border-[var(--color-accent)]/40 hover:-translate-y-1 transition duration-300 motion-reduce:transform-none">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{exp.role}</h3>
                      {exp.current && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">Current</span>}
                    </div>
                    <p className="text-sm text-[var(--color-accent)] font-semibold mb-2">{exp.company}</p>
                    <p className="text-xs font-mono text-[var(--color-text-muted)] mb-4">{formatDate(exp.startDate)} — {exp.current ? 'Present' : exp.endDate ? formatDate(exp.endDate) : ''}</p>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">{exp.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(exp.techStack || []).map((t: string) => <span key={t} className="px-2 py-1 rounded-md text-xs bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)]">{t}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <SectionHeader eyebrow="Education" title="Academic background" />
            {loading ? <div className="py-4 text-[var(--color-text-secondary)]">Loading…</div> : education.length === 0 ? <div className="py-4 text-[var(--color-text-secondary)]">No education published yet.</div> : (
              <div className="grid grid-cols-1 gap-6">
                {education.map((edu) => (
                  <div key={edu.id} className="p-7 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] hover:border-[var(--color-accent)]/40 hover:-translate-y-1 transition duration-300 motion-reduce:transform-none">
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)] leading-tight">{edu.degree}</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] font-medium mb-1">{edu.field}</p>
                    <p className="text-xs text-[var(--color-accent)] mb-3">{edu.institution}</p>
                    <p className="text-xs font-mono text-[var(--color-text-muted)]">{formatDate(edu.startDate)} — {edu.endDate ? formatDate(edu.endDate) : 'Present'}</p>
                  </div>
                ))}
              </div>
            )}
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
