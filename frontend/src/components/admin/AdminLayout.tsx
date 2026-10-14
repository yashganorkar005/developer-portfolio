import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, type ElementType } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  GraduationCap,
  Briefcase,
  Award,
  Share2,
  User,
  Mail,
  FileText,
  LogOut,
  Menu,
  X,
  Code2,
} from 'lucide-react';
import { cx } from '../../utils';

interface NavItem {
  label: string;
  to: string;
  icon: ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Overview',    to: '/admin',                 icon: LayoutDashboard },
  { label: 'Projects',    to: '/admin/projects',        icon: FolderKanban  },
  { label: 'Skills',      to: '/admin/skills',          icon: GraduationCap },
  { label: 'Certifications', to: '/admin/certifications', icon: Award      },
  { label: 'Education',   to: '/admin/education',       icon: GraduationCap },
  { label: 'Experience',  to: '/admin/experience',      icon: Briefcase     },
  { label: 'Achievements', to: '/admin/achievements',   icon: Award         },
  { label: 'Social Links', to: '/admin/social-links',   icon: Share2        },
  { label: 'Profile',     to: '/admin/profile',         icon: User          },
  { label: 'Contact',     to: '/admin/contact',         icon: Mail          },
  { label: 'Resume',      to: '/admin/resume',          icon: FileText       },
];

export function AdminLayout() {
  const { email, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cx(
          'fixed md:sticky top-0 z-40 h-screen w-64 bg-[var(--color-bg-subtle)] border-r border-[var(--color-border-subtle)] flex flex-col transition-transform duration-200',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-2 font-semibold text-[var(--color-text-primary)]">
            <Code2 size={20} className="text-[var(--color-accent)]" />
            <span>Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1" aria-label="Admin navigation">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors',
                  isActive
                    ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]',
                )
              }
            >
              {(() => { const Icon = item.icon as React.ComponentType<{ size?: number; 'aria-hidden'?: string | boolean }>; return <Icon size={17} aria-hidden="true" />; })()}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-[var(--color-border-subtle)]">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-[var(--color-text-primary)] truncate">
                {email}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">Administrator</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-error)] transition-colors"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg)] flex items-center gap-4 px-4 md:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-sm font-medium text-[var(--color-text-primary)]">
            Portfolio Administration
          </h1>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
