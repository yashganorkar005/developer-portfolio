import { useState, useEffect } from 'react';
import { AnimatedSection } from '../ui/AnimatedSection';
import { SectionHeader } from '../ui/SectionHeader';
import { Timeline } from '../ui/Timeline';
import { formatDate } from '../../utils';
import { experienceApi, educationApi } from '../../api/portfolio';
import type { Education, Experience } from '../../types';

export function ExperienceSection() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      experienceApi.getAll().then(r => Array.isArray(r.data) ? r.data : []),
      educationApi.getAll().then(r => Array.isArray(r.data) ? r.data : []),
    ]).then(([expData, eduData]) => {
      if (!cancelled) {
        setExperience(expData);
        setEducation(eduData);
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) {
        setExperience([]);
        setEducation([]);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <section id="experience" className="py-28 bg-[var(--color-bg-subtle)]">
      <div className="container-narrow">
        <div className="grid gap-16 lg:grid-cols-2">
          <AnimatedSection>
            <SectionHeader eyebrow="Experience" title="Work history" />
            {loading ? (
              <div className="py-4 text-[var(--color-text-secondary)]">Loading…</div>
            ) : experience.length === 0 ? (
              <div className="py-4 text-[var(--color-text-secondary)]">No experience published yet.</div>
            ) : (
              <Timeline
                items={experience.map((exp) => ({
                  id: exp.id,
                  date: `${formatDate(exp.startDate)} — ${exp.current ? 'Present' : exp.endDate ? formatDate(exp.endDate) : ''}`,
                  children: (
                    <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 transition-[border-color,box-shadow] duration-200 hover:border-[var(--color-accent)]/40 hover:shadow-sm">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold leading-tight text-[var(--color-text-primary)]">{exp.role}</h3>
                        {exp.current && (
                          <span className="rounded-full bg-[var(--color-accent-subtle)] px-2 py-0.5 text-xs font-medium text-[var(--color-accent)]">Current</span>
                        )}
                      </div>
                      <p className="mt-2 text-sm font-medium text-[var(--color-accent)]">{exp.company}</p>
                      <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">{exp.description}</p>
                      {exp.techStack.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-1.5">
                          {exp.techStack.map((tech) => (
                            <span key={tech} className="rounded-md bg-[var(--color-bg-subtle)] px-2 py-1 font-mono text-xs text-[var(--color-text-secondary)]">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ),
                }))}
              />
            )}
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <SectionHeader eyebrow="Education" title="Academic background" />
            {loading ? (
              <div className="py-4 text-[var(--color-text-secondary)]">Loading…</div>
            ) : education.length === 0 ? (
              <div className="py-4 text-[var(--color-text-secondary)]">No education published yet.</div>
            ) : (
              <Timeline
                items={education.map((edu) => ({
                  id: edu.id,
                  date: `${formatDate(edu.startDate)} — ${edu.endDate ? formatDate(edu.endDate) : 'Present'}`,
                  children: (
                    <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 transition-[border-color,box-shadow] duration-200 hover:border-[var(--color-accent)]/40 hover:shadow-sm">
                      <h3 className="text-lg font-semibold leading-tight text-[var(--color-text-primary)]">{edu.degree}</h3>
                      <p className="mt-2 text-base text-[var(--color-text-secondary)]">{edu.field}</p>
                      <p className="mt-3 text-sm font-medium text-[var(--color-accent)]">{edu.institution}</p>
                      {edu.description && (
                        <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">{edu.description}</p>
                      )}
                    </div>
                  ),
                }))}
              />
            )}
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
