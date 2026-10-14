import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthState {
  token: string | null;
  email: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(() => {
    // on initial load, check sessionStorage for token (persists across tab reloads, but not browser close)
    // we use sessionStorage to avoid persistent localStorage; token lives only for the session
    return sessionStorage.getItem('auth_token');
  });
  const [email, setEmail] = useState<string | null>(() =>
    sessionStorage.getItem('auth_email')
  );

  useEffect(() => {
    if (token) {
      sessionStorage.setItem('auth_token', token);
    } else {
      sessionStorage.removeItem('auth_token');
    }
  }, [token]);

  useEffect(() => {
    if (email) {
      sessionStorage.setItem('auth_email', email);
    } else {
      sessionStorage.removeItem('auth_email');
    }
  }, [email]);

  const login = async (email: string, password: string) => {
    const base = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';
    const response = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message ?? 'Invalid credentials');
    }
    const data: { token: string; expiresInMs: number; email: string } = await response.json();
    setToken(data.token);
    setEmail(data.email);
    navigate('/admin');
  };

  const logout = () => {
    setToken(null);
    setEmail(null);
    navigate('/admin/login');
  };

  // check if token expired by decoding payload (no verification needed for exp claim)
  const isTokenExpired = (t: string) => {
    try {
      const payload = JSON.parse(atob(t.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  };

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      logout();
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        email,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// ── Protected route wrapper ────────────────────────────────────
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" replace />;
}