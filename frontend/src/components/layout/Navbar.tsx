import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useScrolled } from '../../hooks/useScrolled';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { cx } from '../../utils';
import logo from '../../assets/devfolio_icon.png';

const NAV_ITEMS = [
  { label: 'Work',         href: '#projects'       },
  { label: 'Capabilities', href: '#skills'         },
  { label: 'Experience',   href: '#experience'     },
  { label: 'Credentials',  href: '#certifications' },
  { label: 'About',        href: '#about'          },
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
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-200 px-4 sm:px-6 py-3">
      <div
        className={cx(
          'container-narrow mx-auto transition-all duration-200 rounded-md',
          scrolled
            ? 'glass-nav px-4 sm:px-5 py-2.5'
            : 'bg-transparent px-2 sm:px-4 py-2 border border-transparent',
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
            <span className="hidden sm:inline-block font-mono text-[11px] font-semibold text-[var(--color-accent)] bg-[var(--color-accent-subtle)] border border-[var(--color-accent-border)] px-1.5 py-0.5 rounded-xs">
              Full-Stack
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
                        'px-3 py-1.5 text-xs font-semibold tracking-normal transition-all duration-150 rounded-sm',
                        isActive
                          ? 'text-[var(--color-accent)] bg-[var(--color-accent-subtle)]'
                          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]',
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
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white shadow-xs transition-all duration-150 rounded-sm"
            >
              <span>Get in touch</span>
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
            className="container-narrow mx-auto mt-2 glass-nav rounded-md p-4 shadow-lg border border-[var(--color-border)]"
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
                        'block px-3 py-2 text-sm font-semibold transition-colors rounded-sm',
                        isActive
                          ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'
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
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 text-xs font-semibold bg-[var(--color-accent)] text-white rounded-sm shadow-xs"
                >
                  <span>Start a conversation</span>
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
