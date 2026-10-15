import { FileDown } from 'lucide-react';
import { AnimatedSection } from '../ui/AnimatedSection';
import { Button } from '../ui/Button';

export function ResumeSection() {
  return (
    <section id="resume" className="py-20">
      <div className="container-narrow">
        <AnimatedSection>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] shadow-xs transition hover:border-[var(--color-accent)]/30">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-[var(--color-accent)] mb-2">
                Resume
              </p>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                View my full résumé
              </h2>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Available in portable document format for review and printing.
              </p>
            </div>
            <Button as="a" href={(import.meta.env.VITE_API_URL || "http://localhost:8080/api") + "/public/resume"} variant="outline" size="md" target="_blank" rel="noopener noreferrer">
              <FileDown size={15} aria-hidden="true" />
              Download résumé (PDF)
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
