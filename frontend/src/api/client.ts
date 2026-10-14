import axios from 'axios';

// Base URL will be set via environment variable in production.
// During development the Spring Boot API runs on port 8080.
const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10_000,
});

// ── Request interceptor ──────────────────────────────────────
// Reads the admin JWT from sessionStorage (see AuthContext).
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor ─────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_email');
    }
    return Promise.reject(error);
  },
);

export default apiClient;
