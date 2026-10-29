import { useState, useEffect } from 'react';
import { Github, ArrowUpRight, Code2, ChevronDown, ChevronUp } from 'lucide-react';
import { AnimatedSection } from '../ui/AnimatedSection';
import { SectionHeader } from '../ui/SectionHeader';
import { projectsApi } from '../../api/portfolio';
import type { Project } from '../../types';
import { resolveMediaUrl } from '../../utils';

interface ProjectCardProps {
  project: Project;
}

function FeaturedProjectHero({ project }: { project: Project }) {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="border border-[var(--color-border-subtle)] bg-[var(--color-surface)] rounded-md overflow-hidden p-6 sm:p-9 lg:col-span-12 grid lg:grid-cols-12 gap-8 items-center shadow-lg transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-1 hover:border-[var(--color-accent)]/60 hover:shadow-xl motion-reduce:transform-none">
      {/* Content Column */}
      <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-6">
        <div>
          <div className="flex items-center gap-2.5 mb-3.5">
            <span className="font-mono text-xs font-bold text-[var(--color-accent)] bg-[var(--color-accent-subtle)] px-2.5 py-0.5 rounded-xs">
              {project.category || 'Featured System'}
            </span>
            <span className="font-mono text-[11px] text-[var(--color-text-muted)] border-l border-[var(--color-border-subtle)] pl-2.5">
              Production Architecture
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-extrabold text-[var(--color-text-primary)] leading-tight tracking-tight">
            {project.title}
          </h3>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-[var(--color-text-secondary)] font-normal">
            {project.description}
          </p>
        </div>

        {/* Tech Stack & Direct Actions */}
        <div className="space-y-5 pt-4 border-t border-[var(--color-border-subtle)]">
          <div className="flex flex-wrap gap-1.5" aria-label="Technologies used">
            {(project.techStack || []).map((t) => (
              <span
                key={t}
                className="font-mono text-xs px-2.5 py-1 bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] rounded-xs font-medium"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-1">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white transition-all rounded-sm shadow-xs"
              >
                <span>Live Deployment</span>
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border border-[var(--color-border-subtle)] hover:border-slate-400 bg-transparent text-[var(--color-text-primary)] hover:bg-white/5 transition-all rounded-sm"
              >
                <Github size={14} aria-hidden="true" />
                <span>Source Code</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Visual Preview Column */}
      <div className="lg:col-span-5 w-full aspect-[16/9] flex items-center justify-center bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] rounded-sm overflow-hidden relative">
        {project.imageUrl && !imgError ? (
          <img
            src={resolveMediaUrl(project.imageUrl)}
            alt={`${project.title} interface preview`}
            loading="eager"
            onError={() => setImgError(true)}
            className="block w-full h-full object-cover object-top"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
            <div className="h-12 w-12 rounded-sm bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] flex items-center justify-center text-[var(--color-accent)]">
              <Code2 size={24} aria-hidden="true" />
            </div>
            <div>
              <p className="font-bold text-base text-[var(--color-text-primary)]">{project.title}</p>
              <p className="font-mono text-xs text-[var(--color-text-muted)] mt-1">Full-Stack Enterprise Architecture</p>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function SupportingProjectCard({ project }: ProjectCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="flex flex-col border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 rounded-md shadow-xs transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-1 hover:border-[var(--color-accent)]/60 hover:shadow-lg motion-reduce:transform-none">
      {/* Optional image preview */}
      {project.imageUrl && !imgError && (
        <div className="w-full aspect-[16/9] overflow-hidden bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] mb-5 rounded-sm">
          <img
            src={resolveMediaUrl(project.imageUrl)}
            alt={`${project.title} preview`}
            loading="lazy"
            onError={() => setImgError(true)}
            className="block h-full w-full object-cover object-top"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-4 mb-2.5">
            <div>
              <span className="font-mono text-[11px] font-semibold text-[var(--color-accent)]">
                {project.category}
              </span>
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] leading-snug mt-1">
                {project.title}
              </h3>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} GitHub repository`}
                  title="Source Code"
                  className="p-1.5 border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors rounded-sm"
                >
                  <Github size={14} aria-hidden="true" />
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} live demo`}
                  title="Live Demo"
                  className="p-1.5 border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors rounded-sm"
                >
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>

          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] mb-5">
            {project.description}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="mt-auto flex flex-wrap gap-1.5 pt-3 border-t border-[var(--color-border-subtle)]">
          {(project.techStack || []).map((t) => (
            <span
              key={t}
              className="font-mono text-[11px] px-2 py-0.5 bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] rounded-xs"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    projectsApi.getAll()
      .then((res) => {
        if (!cancelled) {
          const list = Array.isArray(res.data) ? res.data : [];
          setProjects(list);
        }
      })
      .catch(() => { if (!cancelled) { setProjects([]); setError(true); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const featured = projects.filter((p) => p.featured);
  const supportingProjects = projects.filter((p) => !p.featured);

  const visibleSupporting = showAll ? supportingProjects : supportingProjects.slice(0, 4);
  const hiddenCount = Math.max(supportingProjects.length - visibleSupporting.length, 0);

  return (
    <section id="projects" className="py-28 bg-[var(--color-bg)] border-y border-[var(--color-border-subtle)]">
      <div className="container-narrow">
        <AnimatedSection>
          <SectionHeader
            eyebrow="Core Systems & Architecture"
            title="Selected Projects"
            description="A selection of projects, the problems they solve, and the decisions behind them."
          />
        </AnimatedSection>

        {loading ? (
          <div className="py-12 text-sm text-[var(--color-text-secondary)]">Loading projects…</div>
        ) : error ? (
          <div className="py-12 text-sm text-[var(--color-text-secondary)]">Projects are temporarily unavailable. Please try again later.</div>
        ) : projects.length === 0 ? (
          <div className="py-12 text-sm text-[var(--color-text-secondary)]">No projects published yet.</div>
        ) : (
          <div className="space-y-6">
            {/* Dark Contrast Showcase: Featured Bento Hero */}
            {featured.length > 0 && (
              <AnimatedSection delay={0.03}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {featured.map((project) => <FeaturedProjectHero key={project.id} project={project} />)}
                </div>
              </AnimatedSection>
            )}

            {/* Supporting Grid of Projects */}
            {visibleSupporting.length > 0 && (
              <AnimatedSection delay={0.06}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {visibleSupporting.map((p) => (
                    <SupportingProjectCard key={p.id} project={p} />
                  ))}
                </div>
              </AnimatedSection>
            )}

            {/* Expansion toggle */}
            {hiddenCount > 0 && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setShowAll((v) => !v)}
                  className="inline-flex items-center gap-2 border border-[var(--color-border-subtle)] px-4 py-2 text-xs font-semibold text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors rounded-sm cursor-pointer"
                  aria-expanded={showAll}
                >
                  {showAll ? (
                    <>
                      <ChevronUp size={14} aria-hidden="true" />
                      <span>Show fewer projects</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown size={14} aria-hidden="true" />
                      <span>Show {hiddenCount} more {hiddenCount === 1 ? 'project' : 'projects'}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
