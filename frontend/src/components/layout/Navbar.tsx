import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useScrolled } from '../../hooks/useScrolled';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { cx } from '../../utils';
import logo from '../../assets/devfolio_icon.png';

const NAV_ITEMS = [
  { label: 'Home',         href: '#home'           },
  { label: 'About',        href: '#about'          },
  { label: 'Work',         href: '#projects'       },
  { label: 'Capabilities', href: '#skills'         },
  { label: 'Experience',   href: '#experience'     },
  { label: 'Credentials',  href: '#certifications' },
  { label: 'Contact',      href: '#contact'        },
];

export function Navbar() {
  const scrolled = useScrolled(30);
  const isMobile = useMediaQuery(768);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const sections = NAV_ITEMS
      .map((item) => ({ item, element: document.getElementById(item.href.slice(1)) }))
      .filter((entry): entry is { item: (typeof NAV_ITEMS)[number]; element: HTMLElement } => Boolean(entry.element));

    const updateFromHash = () => {
      const hash = window.location.hash;
      if (hash && sections.some(({ item }) => item.href === hash)) {
        setActiveSection(hash);
      } else if (window.scrollY < 120) {
        setActiveSection('#home');
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(`#${visible.target.id}`);
      },
      { rootMargin: '-18% 0px -62% 0px', threshold: [0, 0.25, 0.5, 0.75] },
    );

    sections.forEach(({ element }) => observer.observe(element));
    updateFromHash();
    window.addEventListener('hashchange', updateFromHash);
    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', updateFromHash);
    };
  }, []);

  const handleNavClick = () => setOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-200 px-4 sm:px-6 py-3">
      <div
        className={cx(
          'container-narrow mx-auto transition-all duration-200 rounded-md',
          scrolled
            ? 'bg-[var(--color-bg)] px-4 sm:px-5 py-2.5 border border-[var(--color-border-subtle)] shadow-sm'
            : 'bg-[var(--color-bg)] px-2 sm:px-4 py-2 border border-transparent',
        )}
      >
        <nav className="flex items-center justify-between" aria-label="Main navigation">
          {/* Identity Wordmark */}
          <a
            href="#"
            className="group flex items-center gap-2.5 text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors"
            aria-label="Yash Ganorkar home"
          >
            <img
              src={logo}
              alt=""
              aria-hidden="true"
              className="h-7 w-7 rounded-md object-cover"
            />
            <span className="font-bold text-sm tracking-tight text-[var(--color-text-primary)]">
              devfolio
            </span>
          </a>

          {/* Desktop Nav Items */}
          {!isMobile && (
            <ul className="flex items-center gap-1" role="list">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.href;
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className={cx(
                        'relative px-3 py-1.5 text-xs font-semibold tracking-normal transition-colors duration-150 rounded-sm after:absolute after:left-3 after:right-3 after:-bottom-1 after:h-0.5 after:origin-center after:scale-x-0 after:bg-[var(--color-accent)] after:transition-transform after:duration-200',
                        isActive
                          ? 'text-[var(--color-accent)] after:scale-x-100'
                          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
                      )}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}

          {/* CTA Cluster */}
          <div className="flex items-center gap-2.5">
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white shadow-xs transition-all duration-150 rounded-md"
            >
              <span>Hire Me</span>
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>

            {/* Mobile menu trigger */}
            {isMobile && (
              <button
                onClick={() => setOpen((o) => !o)}
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                aria-controls="mobile-nav"
                className="p-2 border border-[var(--color-border)] rounded-sm bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-colors cursor-pointer"
              >
                {open ? <X size={18} /> : <Menu size={18} />}
              </button>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobile && open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
            className="container-narrow mx-auto mt-2 bg-[var(--color-bg)] rounded-md p-4 shadow-lg border border-[var(--color-border)]"
          >
            <ul className="flex flex-col gap-1" role="list">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.href;
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={handleNavClick}
                      className={cx(
                        'relative block px-3 py-2 text-sm font-semibold transition-colors rounded-sm',
                        isActive
                          ? 'text-[var(--color-accent)] border-l-2 border-[var(--color-accent)]'
                          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
                      )}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
              <li className="pt-3 border-t border-[var(--color-border-subtle)] mt-2">
                <a
                  href="#contact"
                  onClick={handleNavClick}
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 text-xs font-semibold bg-[var(--color-accent)] text-white rounded-md shadow-xs"
                >
                  <span>Hire Me</span>
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
