import { AnimatedSection } from '../ui/AnimatedSection';
import { SectionHeader } from '../ui/SectionHeader';
import { Button } from '../ui/Button';
import { Mail, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Profile } from '../../types';
import { profileApi } from '../../api/portfolio';
import { resolveMediaUrl } from '../../utils';

export function AboutSection() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    let cancelled = false;
    profileApi.get()
      .then((response) => { if (!cancelled) setProfile(response.data); })
      .catch(() => { if (!cancelled) setProfile(null); });
    return () => { cancelled = true; };
  }, []);

  return (
    <section id="about" className="py-28">
      <div className="container-narrow">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <AnimatedSection>
            <SectionHeader eyebrow="Profile" title={profile?.name ?? 'Developer profile'} />
            <div className="relative mb-6 aspect-square w-full max-w-sm overflow-hidden rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] shadow-sm">
              {profile?.avatarUrl ? (
                <img
                  src={resolveMediaUrl(profile.avatarUrl)}
                  alt={`${profile?.name ?? 'Developer'} portrait`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                    const fallback = e.currentTarget.parentElement?.querySelector('.avatar-portrait-fallback');
                    if (fallback) fallback.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div
                className={`avatar-portrait-fallback flex h-full w-full flex-col items-center justify-center bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] ${
                  profile?.avatarUrl ? 'hidden' : ''
                }`}
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--color-surface-hover)] font-serif text-3xl font-bold text-[var(--color-accent)] shadow-xs">
                  {(profile?.name ?? 'D').charAt(0).toUpperCase()}
                </div>
                <span className="mt-3 text-xs font-medium tracking-wide uppercase text-[var(--color-text-secondary)]">
                  {profile?.name ?? 'Developer'}
                </span>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.08}>
            <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-8 md:p-10">
              <p className="text-xl leading-9 text-[var(--color-text-primary)]">
                {profile?.bio ?? 'Full-stack developer specialising in Java Spring Boot and React / TypeScript.'}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-subtle)] p-5">
                  <div className="mb-3 flex items-center gap-2 text-[var(--color-accent)]">
                    <MapPin size={16} aria-hidden="true" />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em]">Location</span>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)]">{profile?.location ?? 'Location available on request'}</p>
                </div>

                <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-subtle)] p-5">
                  <div className="mb-3 flex items-center gap-2 text-[var(--color-accent)]">
                    <Mail size={16} aria-hidden="true" />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em]">Email</span>
                  </div>
                  {profile?.email ? (
                    <a href={`mailto:${profile.email}`} className="text-sm text-[var(--color-text-secondary)] transition hover:text-[var(--color-accent)]">{profile.email}</a>
                  ) : (
                    <p className="text-sm text-[var(--color-text-muted)]">Email unavailable</p>
                  )}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button as="a" href="#projects" variant="outline" className="rounded-full">Review work</Button>
                <Button as="a" href="#contact" className="rounded-full">Contact</Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
