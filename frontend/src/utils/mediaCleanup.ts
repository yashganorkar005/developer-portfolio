const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/** Schedules an app-owned asset for delayed deletion. The backend checks all DB string fields first. */
export async function scheduleMediaCleanupCandidate(url?: string | null): Promise<void> {
  if (!url || url.startsWith('blob:') || url.startsWith('data:')) return;
  const token = sessionStorage.getItem('auth_token');
  if (!token) return;
  try {
    await fetch(`${API_BASE}/admin/media/cleanup-candidates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ urls: [url] }),
    });
  } catch {
    // A failed cleanup request must not prevent the user from editing their profile.
  }
}