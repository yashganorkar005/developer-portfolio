import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Send,
  Github,
  Linkedin,
  Mail,
  Twitter,
  Instagram,
  Youtube,
  Globe,
  type LucideIcon,
} from 'lucide-react';
import { AnimatedSection } from '../ui/AnimatedSection';
import { SectionHeader } from '../ui/SectionHeader';
import { Button } from '../ui/Button';
import { contactApi, profileApi, socialLinksApi } from '../../api/portfolio';
import { cx } from '../../utils';
import type { ContactFormData, SocialLink } from '../../types';
import type { ProfileDto } from '../../types/admin';

const schema = z.object({
  name:    z.string().min(2, 'Name must be at least 2 characters'),
  email:   z.string().email('Please enter a valid email address'),
  subject: z.string().min(4, 'Subject must be at least 4 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

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

function Field({
  label, error, children,
}: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-[var(--color-error)]">{error}</p>}
    </div>
  );
}

const inputClass =
  'w-full px-4 py-2.5 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors';

export function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [linksStatus, setLinksStatus] = useState<'loading' | 'ready' | 'empty' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    profileApi.get()
      .then((response) => { if (!cancelled) setProfile(response.data as ProfileDto); })
      .catch(() => { if (!cancelled) setProfile(null); });

    setLinksStatus('loading');
    socialLinksApi.getAll()
      .then((response) => {
        if (cancelled) return;
        const links = Array.isArray(response.data) ? response.data : [];
        setSocialLinks(links.filter(l => l.published).sort((a, b) => a.sortOrder - b.sortOrder));
        setLinksStatus(links.length > 0 ? 'ready' : 'empty');
      })
      .catch(() => {
        if (cancelled) return;
        setSocialLinks([]);
        setLinksStatus('error');
      });

    return () => { cancelled = true; };
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: ContactFormData) => {
    setStatus('sending');
    try {
      await contactApi.send(data);
      setStatus('sent');
      reset();
      setTimeout(() => setStatus('idle'), 4000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const contactEmail = profile?.email;

  return (
    <section id="contact" className="py-28 bg-[var(--color-bg-subtle)]">
      <div className="container-narrow">
        <AnimatedSection>
          <SectionHeader
            eyebrow="Contact"
            title="Let's work together"
            description="Have a project in mind or just want to chat? Send a message and I'll get back to you within 24 hours."
            center
          />
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-12 items-start max-w-3xl mx-auto">
          {/* Form */}
          <AnimatedSection delay={0.05}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4" aria-label="Contact form">
              <Field label="Name" error={errors.name?.message}>
                <input
                  {...register('name')}
                  className={cx(inputClass, errors.name && 'border-[var(--color-error)]')}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </Field>

              <Field label="Email" error={errors.email?.message}>
                <input
                  {...register('email')}
                  type="email"
                  className={cx(inputClass, errors.email && 'border-[var(--color-error)]')}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </Field>

              <Field label="Subject" error={errors.subject?.message}>
                <input
                  {...register('subject')}
                  className={cx(inputClass, errors.subject && 'border-[var(--color-error)]')}
                  placeholder="Project enquiry"
                />
              </Field>

              <Field label="Message" error={errors.message?.message}>
                <textarea
                  {...register('message')}
                  rows={5}
                  className={cx(inputClass, 'resize-none', errors.message && 'border-[var(--color-error)]')}
                  placeholder="Tell me about your project…"
                />
              </Field>

              {status === 'sent' && (
                <p className="text-sm text-[var(--color-success)]">
                  Message sent! I'll be in touch soon.
                </p>
              )}
              {status === 'error' && (
                <p className="text-sm text-[var(--color-error)]">
                  Something went wrong. Please try again.
                </p>
              )}

              <Button type="submit" disabled={status === 'sending'} size="md" className="w-full justify-center">
                <Send size={14} aria-hidden="true" />
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </Button>
            </form>
          </AnimatedSection>

          {/* Contact info */}
          <AnimatedSection delay={0.12}>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-[var(--color-text-primary)] mb-1">Email</p>
                {contactEmail ? (
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                  >
                    {contactEmail}
                  </a>
                ) : (
                  <p className="text-sm text-[var(--color-text-muted)]">Contact email unavailable</p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-[var(--color-text-primary)] mb-3">Find me online</p>
                <div className="flex flex-col gap-2" aria-live="polite">
                  {linksStatus === 'loading' && (
                    <p className="text-sm text-[var(--color-text-muted)]">Loading social links…</p>
                  )}
                  {linksStatus === 'error' && (
                    <p className="text-sm text-[var(--color-error)]">Social links are unavailable right now.</p>
                  )}
                  {linksStatus === 'empty' && (
                    <p className="text-sm text-[var(--color-text-muted)]">No social links published yet.</p>
                  )}
                  {linksStatus === 'ready' && socialLinks.map((link) => {
                    const Icon = getSocialIcon(link);
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                      >
                        <Icon size={16} aria-hidden="true" />
                        {link.platform}
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--color-border-subtle)]">
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  I typically respond within one business day. For urgent enquiries, email is the fastest route.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
