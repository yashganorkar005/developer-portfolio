import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        className="flex flex-col items-center text-center gap-6 max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AlertCircle
          size={48}
          className="text-[var(--color-accent)]"
          aria-hidden="true"
        />

        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-[var(--color-accent)]">404</h1>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Page not found
          </h2>
          <p className="text-[var(--color-text-secondary)]">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-md transition-colors"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to home
        </Link>
      </motion.div>
    </div>
  );
}
