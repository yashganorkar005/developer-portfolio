import { useState, useEffect } from 'react';
import { Github, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { AnimatedSection } from '../ui/AnimatedSection';
import { SectionHeader } from '../ui/SectionHeader';
import { projectsApi } from '../../api/portfolio';
import type { Project } from '../../types';
import { resolveMediaUrl } from '../../utils';

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const featured = index === 0;

  return (
    <AnimatedSection delay={Math.min(index * 0.06, 0.24)}>
      <article className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[var(--color-accent)]/40 motion-reduce:transform-none ${featured ? 'lg:col-span-2' : ''}`}>
        {project.imageUrl && (
          <div className={`overflow-hidden bg-[var(--color-bg-subtle)] ${featured ? 'h-72' : 'h-48'}`}>
            <img
              src={resolveMediaUrl(project.imageUrl)}
              alt={`${project.title} preview`}
              loading={index === 0 ? 'eager' : 'lazy'}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
        )}

        <div className="flex flex-1 flex-col p-7">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">{project.category}</p>
              <h3 className={`${featured ? 'text-2xl' : 'text-xl'} font-semibold tracking-tight text-[var(--color-text-primary)] leading-tight`}>
                {project.title}
              </h3>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} GitHub`} className="rounded-full border border-[var(--color-border-subtle)] p-2 text-[var(--color-text-muted)] transition hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)]">
                  <Github size={16} aria-hidden="true" />
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} live demo`} className="rounded-full border border-[var(--color-border-subtle)] p-2 text-[var(--color-text-muted)] transition hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)]">
                  <ExternalLink size={16} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>

          <p className={`text-sm leading-relaxed text-[var(--color-text-secondary)] ${featured ? 'max-w-2xl' : ''}`}>{project.description}</p>

          <div className="mt-7 flex flex-wrap gap-2">
            {(project.techStack || []).map((t) => (
              <span key={t} className="rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-bg-subtle)] px-3 py-1 text-xs text-[var(--color-text-secondary)]">
                {t}
              </span>
            ))}
          </div>
        </div>
      </article>
    </AnimatedSection>
  );
}

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    projectsApi.getAll()
      .then((res) => { if (!cancelled) setProjects(res.data); })
      .catch(() => { if (!cancelled) setProjects([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  const visible = showAll ? projects : featured.length > 0 ? featured : projects.slice(0, 3);
  const hiddenCount = Math.max(projects.length - visible.length, 0);

  return (
    <section id="projects" className="py-28">
      <div className="container-narrow">
        <AnimatedSection>
          <SectionHeader
            eyebrow="Projects"
            title="Selected engineering work"
            description="A selection of projects, the problems they solve, and the decisions behind them."
          />
        </AnimatedSection>
        {loading ? (
          <div className="py-12 text-center text-[var(--color-text-secondary)]">Loading projects…</div>
        ) : projects.length === 0 ? (
          <div className="py-12 text-center text-[var(--color-text-secondary)]">No projects published yet.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {visible.map((project, i) => (
                <ProjectCard key={project.id ?? i} project={project} index={i} />
              ))}
            </div>
            {(rest.length > 0 || hiddenCount > 0) && (
              <div className="mt-10 flex justify-center">
                <button onClick={() => setShowAll((v) => !v)} className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-5 py-2.5 text-sm text-[var(--color-text-secondary)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)]" aria-expanded={showAll}>
                  {showAll ? <><ChevronUp size={15} aria-hidden="true" /> Show fewer</> : <><ChevronDown size={15} aria-hidden="true" /> Show {rest.length || hiddenCount} more</>}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
