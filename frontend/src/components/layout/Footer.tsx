import { useEffect, useState } from 'react';
import { Github, Linkedin, Twitter, Mail, Code2, Instagram, Youtube, Globe, type LucideIcon } from 'lucide-react';
import { profileApi, socialLinksApi } from '../../api/portfolio';
import type { SocialLink } from '../../types';
import type { ProfileDto } from '../../types/admin';

const ICONS: Record<string, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  mail: Mail,
  email: Mail,
  instagram: Instagram,
  youtube: Youtube,
  globe: Globe,
  website: Globe,
  portfolio: Globe,
};

const FOOTER_LINKS = [
  { label: 'About',          href: '#about'          },
  { label: 'Projects',       href: '#projects'       },
  { label: 'Skills',         href: '#skills'         },
  { label: 'Experience',     href: '#experience'     },
  { label: 'Achievements',   href: '#achievements'   },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Contact',        href: '#contact'        },
];

function getSocialIcon(link: SocialLink): LucideIcon {
  const key = (link.iconName || link.platform || '').toLowerCase().trim();
  return ICONS[key] ?? Globe;
}

export function Footer() {
  const year = new Date().getFullYear();
  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    let cancelled = false;
    profileApi.get()
      .then((response) => { if (!cancelled) setProfile(response.data as ProfileDto); })
      .catch(() => { if (!cancelled) setProfile(null); });

    socialLinksApi.getAll()
      .then((response) => {
        if (cancelled) return;
        const links = Array.isArray(response.data) ? response.data : [];
        setSocialLinks(links.filter(l => l.published).sort((a, b) => a.sortOrder - b.sortOrder));
      })
      .catch(() => { if (!cancelled) setSocialLinks([]); });

    return () => { cancelled = true; };
  }, []);

  return (
    <footer className="border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-subtle)]">
      <div className="container-narrow py-12">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10">
          <div className="flex flex-col gap-3 max-w-xs">
            <div className="flex items-center gap-2 font-semibold text-[var(--color-text-primary)]">
              <Code2 size={20} className="text-[var(--color-accent)]" aria-hidden="true" />
              <span>{profile?.name ?? 'Portfolio'}</span>
            </div>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              {profile?.tagline ?? 'Full-stack developer building reliable software for the modern web.'}
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2" aria-label="Social links">
            {socialLinks.map((link) => {
              const Icon = getSocialIcon(link);
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.platform}
                  className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)] rounded-md transition-colors"
                >
                  <Icon size={17} aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--color-border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--color-text-muted)]">
            &copy; {year} {profile?.name ?? 'Portfolio'}. Built with React, TypeScript &amp; Spring Boot.
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            A closer look at the work, skills, and experience I bring to software development.
          </p>
        </div>
      </div>
    </footer>
  );
}
