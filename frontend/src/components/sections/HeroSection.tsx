import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDown,
  Github,
  Linkedin,
  Mail,
  FileText,
  Twitter,
  Instagram,
  Youtube,
  Globe,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { profileApi, socialLinksApi } from '../../api/portfolio';
import type { Profile, SocialLink } from '../../types';
import { resolveMediaUrl } from '../../utils';

const ICONS: Record<string, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  email: Mail,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  globe: Globe,
  website: Globe,
  portfolio: Globe,
};

function getSocialIcon(link: SocialLink): LucideIcon {
  const key = (link.iconName || link.platform || '').toLowerCase().trim();
  return ICONS[key] ?? Globe;
}

const fadeUp = (delay = 0) => ({
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay } },
});

export function HeroSection() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [socialStatus, setSocialStatus] = useState<'loading' | 'ready' | 'empty' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;

    profileApi.get()
      .then((response) => { if (!cancelled) setProfile(response.data); })
      .catch(() => { if (!cancelled) setProfile(null); });

    setSocialStatus('loading');
    socialLinksApi.getAll()
      .then((response) => {
        if (cancelled) return;
        const links = Array.isArray(response.data) ? response.data : [];
        const visibleLinks = links
          .filter((link) => link.published !== false)
          .sort((a, b) => a.sortOrder - b.sortOrder);
        setSocialLinks(visibleLinks);
        setSocialStatus(visibleLinks.length > 0 ? 'ready' : 'empty');
      })
      .catch(() => {
        if (cancelled) return;
        setSocialLinks([]);
        setSocialStatus('error');
      });
    return () => { cancelled = true; };
  }, []);

  const name = profile?.name ?? 'Full-stack developer';
  const tagline = profile?.tagline ?? 'Full-stack developer specialising in React, TypeScript, and Java Spring Boot.';
  const available = profile?.available ?? true;

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden"
      aria-label="Hero"
    >
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,var(--color-accent-subtle),transparent_32%),linear-gradient(180deg,transparent,rgba(255,255,255,0.02))]" />
      <div aria-hidden="true" className="absolute inset-x-6 top-24 h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />

      <div className="container-narrow relative z-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div className="max-w-3xl">
          <motion.div variants={fadeUp(0)} initial="hidden" animate="visible">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/80 px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)] backdrop-blur-sm">
              <span className={`h-1.5 w-1.5 rounded-full ${available ? 'bg-[var(--color-success)]' : 'bg-[var(--color-warning)]'}`} aria-hidden="true" />
              {available ? 'Open to new opportunities' : 'Currently engaged'}
            </span>
          </motion.div>

          <motion.h1
            className="mt-7 text-5xl font-serif font-semibold tracking-[-0.06em] leading-[0.96] text-[var(--color-text-primary)] sm:text-6xl md:text-[5.5rem]"
            variants={fadeUp(0.08)}
            initial="hidden"
            animate="visible"
          >
            {profile?.heroHeadline || 'Building calm, capable digital products.'}
          </motion.h1>
          <motion.p
            className="mt-4 text-xl font-medium text-[var(--color-accent)]"
            variants={fadeUp(0.12)}
            initial="hidden"
            animate="visible"
          >
            {name}
          </motion.p>

          <motion.p
            className="mt-7 max-w-2xl text-lg leading-8 text-[var(--color-text-secondary)] sm:text-xl"
            variants={fadeUp(0.16)}
            initial="hidden"
            animate="visible"
          >
            {tagline}
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap gap-3"
            variants={fadeUp(0.24)}
            initial="hidden"
            animate="visible"
          >
            <Button as="a" href="#projects" size="lg" className="rounded-full">
              View selected work
            </Button>
            <Button as="a" href="#contact" variant="outline" size="lg" className="rounded-full">
              Start a conversation
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/70 p-6 backdrop-blur-sm"
          variants={fadeUp(0.32)}
          initial="hidden"
          animate="visible"
        >
          <div className="mb-6 flex items-center gap-4 border-b border-[var(--color-border-subtle)] pb-5">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] shadow-xs">
              {profile?.avatarUrl ? (
                <img
                  src={resolveMediaUrl(profile.avatarUrl)}
                  alt={`${name} avatar`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                    const fallback = e.currentTarget.parentElement?.querySelector('.hero-avatar-fallback');
                    if (fallback) fallback.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div
                className={`hero-avatar-fallback flex h-full w-full items-center justify-center bg-[var(--color-surface-hover)] font-serif text-lg font-bold text-[var(--color-accent)] ${
                  profile?.avatarUrl ? 'hidden' : ''
                }`}
                aria-hidden="true"
              >
                {name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[var(--color-text-primary)]">{name}</p>
              <p className="truncate text-xs text-[var(--color-text-muted)]">{profile?.location ?? 'Full-Stack Developer'}</p>
            </div>
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">Connect</p>
          <div className="mt-5 flex flex-wrap items-center gap-2" aria-live="polite">
            {socialStatus === 'loading' && (
              <span className="px-2 py-1 text-xs text-[var(--color-text-muted)]">Loading links…</span>
            )}
            {socialStatus === 'error' && (
              <span className="px-2 py-1 text-xs text-[var(--color-error)]">Social links unavailable</span>
            )}
            {socialStatus === 'empty' && (
              <span className="px-2 py-1 text-xs text-[var(--color-text-muted)]">No social links published</span>
            )}
            {socialStatus === 'ready' && socialLinks.map((link) => {
              const Icon = getSocialIcon(link);
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.platform}
                  title={link.platform}
                  className="rounded-full border border-[var(--color-border-subtle)] p-2.5 text-[var(--color-text-muted)] transition hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)]"
                >
                  <Icon size={18} aria-hidden="true" />
                </a>
              );
            })}
          </div>
          <a
            href="/api/public/resume"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)]"
          >
            <FileText size={15} aria-hidden="true" />
            Download résumé (PDF)
          </a>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--color-text-muted)] motion-reduce:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        aria-hidden="true"
      >
        <ArrowDown size={19} />
      </motion.div>
    </section>
  );
}
