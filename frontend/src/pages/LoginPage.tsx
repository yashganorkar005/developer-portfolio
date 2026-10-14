import { useState, useRef } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Eye, EyeOff, Code2, Mail, Lock } from 'lucide-react';

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const submitAttempted = useRef(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length >= 8;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    submitAttempted.current = true;

    if (!emailValid || !passwordValid) return;

    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--color-bg)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Code2 size={32} className="text-[var(--color-accent)] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Sign in to manage portfolio content
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {error && (
            <div className="p-3 rounded-md border border-[var(--color-error)]/40 bg-[var(--color-error)]/10 text-[var(--color-error)] text-sm" role="alert">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" aria-hidden="true" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                autoComplete="email"
                aria-invalid={submitAttempted.current && !emailValid}
                aria-describedby={submitAttempted.current && !emailValid ? 'email-error' : undefined}
                className={`w-full pl-10 pr-4 py-2.5 text-sm bg-[var(--color-bg)] border rounded-lg text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors ${
                  submitAttempted.current && !emailValid
                    ? 'border-[var(--color-error)]'
                    : 'border-[var(--color-border)]'
                }`}
              />
            </div>
            {submitAttempted.current && !emailValid && (
              <p id="email-error" className="mt-1 text-xs text-[var(--color-error)]">
                Enter a valid email address
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" aria-hidden="true" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                minLength={8}
                aria-invalid={submitAttempted.current && !passwordValid}
                aria-describedby={submitAttempted.current && !passwordValid ? 'password-error' : undefined}
                className={`w-full pl-10 pr-12 py-2.5 text-sm bg-[var(--color-bg)] border rounded-lg text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors ${
                  submitAttempted.current && !passwordValid
                    ? 'border-[var(--color-error)]'
                    : 'border-[var(--color-border)]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {submitAttempted.current && !passwordValid && (
              <p id="password-error" className="mt-1 text-xs text-[var(--color-error)]">
                Password must be at least 8 characters
              </p>
            )}
          </div>

          <Button type="submit" disabled={loading} size="md" className="w-full justify-center">
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  );
}