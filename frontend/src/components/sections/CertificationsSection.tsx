import { Award, ExternalLink } from 'lucide-react';
import { AnimatedSection } from '../ui/AnimatedSection';
import { SectionHeader } from '../ui/SectionHeader';
import { formatDate, resolveMediaUrl } from '../../utils';
import { useState, useEffect } from 'react';
import { certificationsApi } from '../../api/portfolio';
import type { Certification } from '../../types';

export function CertificationsSection() {
  const [items, setItems] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    certificationsApi.getAll()
      .then((res) => { if (!cancelled) setItems(Array.isArray(res.data) ? res.data : []); })
      .catch(() => { if (!cancelled) setItems([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <section id="certifications" className="py-28">
      <div className="container-narrow">
        <AnimatedSection>
          <SectionHeader eyebrow="Certifications" title="Credentials" />
        </AnimatedSection>
        {loading ? (
          <div className="py-12 text-center text-[var(--color-text-secondary)]">Loading certifications…</div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-[var(--color-text-secondary)]">No certifications published yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((cert) => (
              <AnimatedSection key={cert.id}>
                <div className="flex flex-col h-full p-7 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] hover:border-[var(--color-accent)]/40 hover:-translate-y-1 transition duration-300 motion-reduce:transform-none">
                  {cert.imageUrl && (
                    <img
                      src={resolveMediaUrl(cert.imageUrl)}
                      alt={`${cert.name} preview`}
                      loading="lazy"
                      className="w-full h-40 object-contain rounded-xl mb-6 bg-[var(--color-bg)]/40 p-2 border border-[var(--color-border-subtle)]"
                    />
                  )}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--color-accent-subtle)]">
                      <Award size={20} className="text-[var(--color-accent)]" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-[var(--color-text-primary)] leading-snug mb-1" title={cert.name}>{cert.name}</h3>
                      <p className="text-sm text-[var(--color-accent)] font-medium mb-3">{cert.issuer}</p>
                      {(cert.issueDate || cert.date) && (
                        <p className="text-xs font-mono text-[var(--color-text-muted)]">{formatDate(cert.issueDate || cert.date)}</p>
                      )}
                    </div>
                  </div>
                  {cert.credentialUrl && (
                    <div className="mt-6 pt-5 border-t border-[var(--color-border-subtle)]">
                      <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-[var(--color-accent)] hover:underline">
                        <ExternalLink size={14} aria-hidden="true" /> Verify credential
                      </a>
                    </div>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
