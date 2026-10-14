import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Code2 } from 'lucide-react';
import { useScrolled } from '../../hooks/useScrolled';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { cx } from '../../utils';

const NAV_ITEMS = [
  { label: 'About',          href: '#about'          },
  { label: 'Projects',       href: '#projects'       },
  { label: 'Skills',         href: '#skills'         },
  { label: 'Experience',     href: '#experience'     },
  { label: 'Achievements',   href: '#achievements'   },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Resume',         href: '#resume'         },
];

export function Navbar() {
  const scrolled = useScrolled(60);
  const isMobile = useMediaQuery(768);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const item of [...NAV_ITEMS].reverse()) {
        const id = item.href.replace('#', '');
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(item.href);
          return;
        }
      }
      if (window.scrollY < 200) setActiveSection('');
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = () => setOpen(false);

  return (
    <header
      className={cx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[var(--color-bg)]/90 backdrop-blur-md border-b border-[var(--color-border-subtle)] shadow-xs'
          : 'bg-transparent',
      )}
    >
      <nav
        className="container-narrow flex items-center justify-between h-16"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <a
          href="#"
          className="group flex items-center gap-2 font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors"
          aria-label="Go to top"
        >
          <Code2 size={22} className="text-[var(--color-accent)] transition-transform duration-300 group-hover:rotate-12 motion-reduce:transform-none" aria-hidden="true" />
          <span className="tracking-tight">devfolio</span>
        </a>

        {/* Desktop nav */}
        {!isMobile && (
          <ul className="flex items-center gap-1" role="list">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href;
              return (
                <li key={item.href} className="relative">
                  <a
                    href={item.href}
                    className={cx(
                      'relative px-3 py-2 text-sm transition-colors duration-200 rounded-md',
                      isActive
                        ? 'text-[var(--color-accent)] font-medium'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]',
                    )}
                  >
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-indicator"
                        className="absolute bottom-0 left-3 right-3 h-0.5 bg-[var(--color-accent)] rounded-full motion-reduce:hidden"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                </li>
              );
            })}
            <li>
              <a
                href="#contact"
                className="ml-3 px-4 py-2 text-sm font-medium bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-full transition-all duration-200 shadow-xs hover:shadow-sm"
              >
                Hire me
              </a>
            </li>
          </ul>
        )}

        {/* Mobile toggle */}
        {isMobile && (
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors rounded-lg"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        )}
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobile && open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="bg-[var(--color-bg)]/98 backdrop-blur-xl border-b border-[var(--color-border-subtle)] shadow-xl"
          >
            <ul className="container-narrow py-4 flex flex-col gap-1" role="list">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.href;
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={handleNavClick}
                      className={cx(
                        'block px-3.5 py-3 rounded-xl text-sm transition-colors',
                        isActive
                          ? 'bg-[var(--color-surface)] text-[var(--color-accent)] font-medium'
                          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]',
                      )}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
              <li className="pt-2">
                <a
                  href="#contact"
                  onClick={handleNavClick}
                  className="block text-center px-4 py-3 text-sm font-medium bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-full transition-colors shadow-xs"
                >
                  Hire me
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
