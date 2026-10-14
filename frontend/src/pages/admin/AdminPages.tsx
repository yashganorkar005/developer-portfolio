import { useState, useEffect, useCallback, useRef } from 'react';
import UploadImage from '../../components/UploadImage';
import type {
  ProjectDto, SkillDto, CertificationDto, EducationDto,
  ExperienceDto, AchievementDto, SocialLinkDto, ProfileDto,
  ContactMessageDto, ContactMessageUpdateRequest,
} from '../../types/admin';
import {
  projectsApi, skillsApi, certificationsApi, educationApi,
  experienceApi, achievementsApi, socialLinksApi, profileApi, contactMessagesApi, reorderApi, resumeApi, skillCategoryOrdersApi,
} from '../../api/admin';

// ── useFetch hook ─────────────────────────────────────────────
function useFetch<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true); setError(null);
    try { setData(await fetcher()); } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Failed'); }
    setLoading(false);
  }, deps);

  useEffect(() => { reload(); }, [reload]);

  return { data, loading, error, reload };
}

// ── Reorder helpers (Task 2) ───────────────────────────
async function reorderItem(
  entityType: 'projects' | 'certifications' | 'achievements' | 'education' | 'experience' | 'skills' | 'social-links',
  items: { id: number; sortOrder?: number | null }[],
  index: number,
  direction: 'up' | 'down',
  reload: () => void,
  setMsg: (m: { type: 'success' | 'error'; text: string } | null) => void,
  setBusy?: (busy: boolean) => void,
) {
  const current = [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const target = direction === 'up' ? index - 1 : index + 1;
  if (target < 0 || target >= current.length) return;
  const moving = current[index];
  const other = current[target];
  setBusy?.(true);
  try {
    await reorderApi.update(entityType, moving.id, other.sortOrder ?? 0);
    await reorderApi.update(entityType, other.id, moving.sortOrder ?? 0);
    setMsg({ type: 'success', text: 'Order saved' });
    reload();
  } catch (err) {
    setMsg({ type: 'error', text: formatApiError(err) });
  } finally {
    setBusy?.(false);
  }
}

async function reorderCategory(
  categories: { category: string; sortOrder: number }[],
  index: number,
  direction: 'up' | 'down',
  reload: () => void,
  setMsg: (m: { type: 'success' | 'error'; text: string } | null) => void,
) {
  const current = [...categories].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const target = direction === 'up' ? index - 1 : index + 1;
  if (target < 0 || target >= current.length) return;
  const moving = current[index];
  const other = current[target];
  try {
    await skillCategoryOrdersApi.update(moving.category, other.sortOrder ?? 0);
    await skillCategoryOrdersApi.update(other.category, moving.sortOrder ?? 0);
    setMsg({ type: 'success', text: 'Category order saved' });
    reload();
  } catch (err) {
    setMsg({ type: 'error', text: formatApiError(err) });
  }
}

function formatApiError(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const res = (err as any).response;
    if (res?.data) {
      if (res.data.details && typeof res.data.details === 'object') {
        return Object.entries(res.data.details).map(([k, v]) => `${k}: ${v}`).join(', ');
      }
      if (res.data.message) return res.data.message;
      if (res.data.error) return res.data.error;
    }
  }
  return err instanceof Error ? err.message : 'Failed';
}

// ── Overview ─────────────────────────────────────────────────
export function OverviewPage() {
  const { data: projects } = useFetch(() => projectsApi.getAll(), []);
  const { data: skills } = useFetch(() => skillsApi.getAll(), []);
  const { data: messages } = useFetch(() => contactMessagesApi.getAll(), []);
  const { data: profile } = useFetch(() => profileApi.get(), []);

  const count = (arr: unknown[] | null) => (arr ?? []).length;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Overview</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
          <p className="text-xs text-[var(--color-text-muted)]">Projects</p>
          <p className="text-3xl font-bold text-[var(--color-text-primary)]">{count(projects)}</p>
        </div>
        <div className="p-5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
          <p className="text-xs text-[var(--color-text-muted)]">Skills</p>
          <p className="text-3xl font-bold text-[var(--color-text-primary)]">{count(skills)}</p>
        </div>
        <div className="p-5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
          <p className="text-xs text-[var(--color-text-muted)]">Contact messages</p>
          <p className="text-3xl font-bold text-[var(--color-text-primary)]">{count(messages)}</p>
        </div>
        <div className="p-5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
          <p className="text-xs text-[var(--color-text-muted)]">Available</p>
          <p className="text-3xl font-bold text-[var(--color-text-primary)]">{profile?.available ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  );
}

// ── Projects ─────────────────────────────────────────────────
export function ProjectsPage() {
  const { data, loading, error, reload } = useFetch(() => projectsApi.getAll(), []);
  const [form, setForm] = useState<Partial<ProjectDto>>({ title: '', description: '', category: '', techStack: [], featured: false, sortOrder: 0, published: false });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false); const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setMsg(null);
    try {
      if (editingId) await projectsApi.update(editingId, form); else await projectsApi.create(form);
      setForm({ title: '', description: '', category: '', techStack: [], featured: false, sortOrder: 0, published: false });
      setEditingId(null); reload(); setMsg({ type: 'success', text: 'Project saved' });
    } catch (err) { setMsg({ type: 'error', text: formatApiError(err) }); }
    finally { setSaving(false); }
  };
  const handleDelete = async (id: number) => { if (!window.confirm('Delete this project?')) return; await projectsApi.delete(id); reload(); };

  if (loading) return <div className="text-sm text-[var(--color-text-muted)]">Loading…</div>;
  if (error) return <div className="text-sm text-[var(--color-error)]">{error}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Projects</h2>
      {msg && <div className={`p-3 rounded-md text-sm ${msg.type === 'success' ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' : 'bg-[var(--color-error)]/10 text-[var(--color-error)]'}`}>{msg.text}</div>}

      <form onSubmit={handleSubmit} className="p-5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{editingId ? 'Edit project' : 'New project'}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label htmlFor="pu-title" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Title</label><input id="pu-title" required value={form.title ?? ''} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
          <div><label htmlFor="pu-category" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Category</label><input id="pu-category" required value={form.category ?? ''} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
          <div><label htmlFor="pu-tech" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Tech stack (comma-separated)</label><input id="pu-tech" value={(form.techStack ?? []).join(',')} onChange={(e) => setForm({ ...form, techStack: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
          <div><label htmlFor="pu-sort" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Sort order</label><input id="pu-sort" type="number" value={form.sortOrder ?? 0} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
        </div>
        <div>
          <label htmlFor="pu-desc" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Description</label>
          <textarea id="pu-desc" rows={3} value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div><label htmlFor="pu-gh" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">GitHub URL</label><input id="pu-gh" value={form.githubUrl ?? ''} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
          <div><label htmlFor="pu-live" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Live URL</label><input id="pu-live" value={form.liveUrl ?? ''} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
          <div className="col-span-2 md:col-span-1"><label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Image</label><UploadImage currentUrl={form.imageUrl} onUpload={(url) => setForm({ ...form, imageUrl: url })} onClear={() => setForm({ ...form, imageUrl: '' })} /></div>
        </div>
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]"><input type="checkbox" checked={form.featured ?? false} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded" /> Featured</label>
          <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]"><input type="checkbox" checked={form.published ?? false} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded" /> Published</label>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-md disabled:opacity-50">{saving ? 'Saving…' : editingId ? 'Update' : 'Create'}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ title: '', description: '', category: '', techStack: [], featured: false, sortOrder: 0, published: false }); }} className="px-4 py-2 text-sm text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-md">Cancel</button>}
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-sm"><thead><tr className="text-left text-xs text-[var(--color-text-muted)] border-b border-[var(--color-border-subtle)]"><th className="pb-2 font-medium">Title</th><th className="pb-2 font-medium">Category</th><th className="pb-2 font-medium">Order</th><th className="pb-2 font-medium">Published</th><th className="pb-2 font-medium">Actions</th></tr></thead>
        <tbody>
          {([...data ?? []].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))).map((p, idx, arr) => (
            <tr key={p.id} className="border-b border-[var(--color-border-subtle)]"><td className="py-3 text-[var(--color-text-primary)]">{p.title}</td><td className="py-3 text-[var(--color-text-secondary)]">{p.category}</td><td className="py-3 text-[var(--color-text-secondary)]">{p.sortOrder ?? 0}</td><td className="py-3 text-[var(--color-text-secondary)]">{p.published ? 'Yes' : 'No'}</td><td className="py-3"><div className="flex gap-2"><button onClick={() => { setEditingId(p.id); setForm({ ...p }); }} className="text-xs px-2 py-1 text-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)] rounded">Edit</button><button onClick={() => handleDelete(p.id)} className="text-xs px-2 py-1 text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded">Delete</button><button onClick={() => reorderItem('projects', arr, idx, 'up', reload, setMsg)} disabled={idx === 0} className="text-xs px-1 py-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded" aria-label="Move up">↑</button><button onClick={() => reorderItem('projects', arr, idx, 'down', reload, setMsg)} disabled={idx === arr.length - 1} className="text-xs px-1 py-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded" aria-label="Move down">↓</button></div></td></tr>
          ))}
        </tbody></table>
        {(data ?? []).length === 0 && <p className="py-8 text-sm text-[var(--color-text-muted)] text-center">No projects yet. Add your first one above.</p>}
      </div>
    </div>
  );
}

// ── Skills ──────────────────────────────────────────────────
export function SkillsPage() {
  const { data, loading, error, reload } = useFetch(() => skillsApi.getAll(), []);
  const { data: categoryOrders, reload: reloadCategoryOrders } = useFetch(() => skillCategoryOrdersApi.getAll(), []);
  const [form, setForm] = useState<Partial<SkillDto>>({ name: '', category: '', proficiency: 50, sortOrder: 0, published: false });
  const [editingId, setEditingId] = useState<number | null>(null); const [saving, setSaving] = useState(false); const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); setMsg(null); try { if (editingId) await skillsApi.update(editingId, form); else await skillsApi.create(form); setForm({ name: '', category: '', proficiency: 50, sortOrder: 0, published: false }); setEditingId(null); reload(); reloadCategoryOrders(); setMsg({ type: 'success', text: 'Skill saved' }); } catch (err) { setMsg({ type: 'error', text: formatApiError(err) }); } finally { setSaving(false); } };
  const handleDelete = async (id: number) => { if (!window.confirm('Delete this skill?')) return; await skillsApi.delete(id); reload(); reloadCategoryOrders(); };
  if (loading) return <div className="text-sm text-[var(--color-text-muted)]">Loading…</div>;
  if (error) return <div className="text-sm text-[var(--color-error)]">{error}</div>;
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Skills</h2>
      {msg && <div className={`p-3 rounded-md text-sm ${msg.type === 'success' ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' : 'bg-[var(--color-error)]/10 text-[var(--color-error)]'}`}>{msg.text}</div>}
      <form onSubmit={handleSubmit} className="p-5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{editingId ? 'Edit skill' : 'New skill'}</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div><label htmlFor="sk-name" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Name</label><input id="sk-name" required value={form.name ?? ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
          <div><label htmlFor="sk-cat" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Category</label><input id="sk-cat" required value={form.category ?? ''} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
          <div><label htmlFor="sk-pro" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Proficiency (0-100)</label><input id="sk-pro" type="number" min={0} max={100} value={form.proficiency ?? 0} onChange={(e) => setForm({ ...form, proficiency: Number(e.target.value) })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label htmlFor="sk-sort" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Sort order</label><input id="sk-sort" type="number" value={form.sortOrder ?? 0} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
          <div className="flex items-center gap-2 pt-4"><input type="checkbox" checked={form.published ?? false} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded" /> <span className="text-sm text-[var(--color-text-secondary)]">Published</span></div>
        </div>
        <div className="flex gap-3"><button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-md disabled:opacity-50">{saving ? 'Saving…' : editingId ? 'Update' : 'Create'}</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', category: '', proficiency: 50, sortOrder: 0, published: false }); }} className="px-4 py-2 text-sm text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-md">Cancel</button>}</div>
      </form>
      <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-xs text-[var(--color-text-muted)] border-b border-[var(--color-border-subtle)]"><th className="pb-2 font-medium">Name</th><th className="pb-2 font-medium">Category</th><th className="pb-2 font-medium">Proficiency</th><th className="pb-2 font-medium">Published</th><th className="pb-2 font-medium">Actions</th></tr></thead><tbody>
        {(data ?? []).map((s, idx, arr) => (<tr key={s.id} className="border-b border-[var(--color-border-subtle)]"><td className="py-3 text-[var(--color-text-primary)]">{s.name}</td><td className="py-3 text-[var(--color-text-secondary)]">{s.category}</td><td className="py-3 text-[var(--color-text-secondary)]">{s.proficiency}</td><td className="py-3 text-[var(--color-text-secondary)]">{s.published ? 'Yes' : 'No'}</td><td className="py-3"><div className="flex gap-2"><button onClick={() => { setEditingId(s.id); setForm({ ...s }); }} className="text-xs px-2 py-1 text-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)] rounded">Edit</button><button onClick={() => handleDelete(s.id)} className="text-xs px-2 py-1 text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded">Delete</button><button onClick={() => reorderItem('skills', arr, idx, 'up', reload, setMsg)} disabled={idx === 0} className="text-xs px-1 py-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded" aria-label="Move up">↑</button><button onClick={() => reorderItem('skills', arr, idx, 'down', reload, setMsg)} disabled={idx === arr.length - 1} className="text-xs px-1 py-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded" aria-label="Move down">↓</button></div></td></tr>))}
      </tbody></table>{(data ?? []).length === 0 && <p className="py-8 text-sm text-[var(--color-text-muted)] text-center">No skills yet. Add your first one above.</p>}</div>

      <div className="mt-8 pt-8 border-t border-[var(--color-border-subtle)] space-y-4">
        <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Skill Categories Order</h3>
        <p className="text-xs text-[var(--color-text-muted)]">Reorder skill categories as they appear publicly on the website.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-[var(--color-text-muted)] border-b border-[var(--color-border-subtle)]">
                <th className="pb-2 font-medium">Category</th>
                <th className="pb-2 font-medium">Sort Order</th>
                <th className="pb-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(categoryOrders ?? []).map((c, idx, arr) => (
                <tr key={c.category} className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-3 text-[var(--color-text-primary)]">{c.category}</td>
                  <td className="py-3 text-[var(--color-text-secondary)]">{c.sortOrder}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button onClick={() => reorderCategory(arr, idx, 'up', reloadCategoryOrders, setMsg)} disabled={idx === 0} className="text-xs px-2 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded disabled:opacity-40" aria-label="Move up">↑ Up</button>
                      <button onClick={() => reorderCategory(arr, idx, 'down', reloadCategoryOrders, setMsg)} disabled={idx === arr.length - 1} className="text-xs px-2 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded disabled:opacity-40" aria-label="Move down">↓ Down</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(categoryOrders ?? []).length === 0 && <p className="py-4 text-sm text-[var(--color-text-muted)] text-center">No categories found.</p>}
        </div>
      </div>
    </div>
  );
}

// ── Certifications ─────────────────────────────────────────
export function CertificationsPage() {
  const { data, loading, error, reload } = useFetch(() => certificationsApi.getAll(), []);
  const [form, setForm] = useState<Partial<CertificationDto>>({ name: '', issuer: '', issueDate: '', expiryDate: '', credentialUrl: '', imageUrl: '', sortOrder: 0, published: false });
  const [editingId, setEditingId] = useState<number | null>(null); const [saving, setSaving] = useState(false); const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); setMsg(null); try { if (editingId) await certificationsApi.update(editingId, form); else await certificationsApi.create(form); setForm({ name: '', issuer: '', issueDate: '', expiryDate: '', credentialUrl: '', imageUrl: '', sortOrder: 0, published: false }); setEditingId(null); reload(); setMsg({ type: 'success', text: 'Certification saved' }); } catch (err) { setMsg({ type: 'error', text: formatApiError(err) }); } finally { setSaving(false); } };
  const handleDelete = async (id: number) => { if (!window.confirm('Delete this certification?')) return; await certificationsApi.delete(id); reload(); };
  if (loading) return <div className="text-sm text-[var(--color-text-muted)]">Loading…</div>;
  if (error) return <div className="text-sm text-[var(--color-error)]">{error}</div>;
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Certifications</h2>
      {msg && <div className={`p-3 rounded-md text-sm ${msg.type === 'success' ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' : 'bg-[var(--color-error)]/10 text-[var(--color-error)]'}`}>{msg.text}</div>}
      <form onSubmit={handleSubmit} className="p-5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{editingId ? 'Edit certification' : 'New certification'}</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div><label htmlFor="c-name" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Name</label><input id="c-name" required value={form.name ?? ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
          <div><label htmlFor="c-issuer" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Issuer</label><input id="c-issuer" required value={form.issuer ?? ''} onChange={(e) => setForm({ ...form, issuer: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
          <div><label htmlFor="c-issued" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Issue date</label><input id="c-issued" type="date" value={form.issueDate ?? ''} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
          <div><label htmlFor="c-expires" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Expiry date</label><input id="c-expires" type="date" value={form.expiryDate ?? ''} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label htmlFor="c-cred" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Credential / Verification URL</label><input id="c-cred" value={form.credentialUrl ?? ''} onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
          <div><label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Certificate Image</label><UploadImage currentUrl={form.imageUrl ?? ''} onUpload={(url) => setForm({ ...form, imageUrl: url })} onClear={() => setForm({ ...form, imageUrl: '' })} /></div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label htmlFor="c-sort" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Sort order</label><input id="c-sort" type="number" value={form.sortOrder ?? 0} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
          <div className="flex items-center gap-2 pt-4"><input type="checkbox" checked={form.published ?? false} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded" /> <span className="text-sm text-[var(--color-text-secondary)]">Published</span></div>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-md disabled:opacity-50">{saving ? 'Saving…' : editingId ? 'Update' : 'Create'}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', issuer: '', issueDate: '', expiryDate: '', credentialUrl: '', imageUrl: '', sortOrder: 0, published: false }); }} className="px-4 py-2 text-sm text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-md">Cancel</button>}
        </div>
      </form>
      <div className="overflow-x-auto">
        <table className="w-full text-sm"><thead><tr className="text-left text-xs text-[var(--color-text-muted)] border-b border-[var(--color-border-subtle)]"><th className="pb-2 font-medium">Name</th><th className="pb-2 font-medium">Issuer</th><th className="pb-2 font-medium">Issue date</th><th className="pb-2 font-medium">Expiry date</th><th className="pb-2 font-medium">Published</th><th className="pb-2 font-medium">Actions</th></tr></thead>
        <tbody>
          {(data ?? []).map((c, idx, arr) => (
            <tr key={c.id} className="border-b border-[var(--color-border-subtle)]"><td className="py-3 text-[var(--color-text-primary)]">{c.name}</td><td className="py-3 text-[var(--color-text-secondary)]">{c.issuer}</td><td className="py-3 text-[var(--color-text-secondary)]">{c.issueDate ?? '-'}</td><td className="py-3 text-[var(--color-text-secondary)]">{c.expiryDate ?? '-'}</td><td className="py-3 text-[var(--color-text-secondary)]">{c.published ? 'Yes' : 'No'}</td><td className="py-3"><div className="flex gap-2"><button onClick={() => { setEditingId(c.id); setForm({ ...c }); }} className="text-xs px-2 py-1 text-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)] rounded">Edit</button><button onClick={() => handleDelete(c.id)} className="text-xs px-2 py-1 text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded">Delete</button><button onClick={() => reorderItem('certifications', arr, idx, 'up', reload, setMsg)} disabled={idx === 0} className="text-xs px-1 py-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded" aria-label="Move up">↑</button><button onClick={() => reorderItem('certifications', arr, idx, 'down', reload, setMsg)} disabled={idx === arr.length - 1} className="text-xs px-1 py-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded" aria-label="Move down">↓</button></div></td></tr>
          ))}
        </tbody></table>
        {(data ?? []).length === 0 && <p className="py-8 text-sm text-[var(--color-text-muted)] text-center">No certifications yet. Add your first one above.</p>}
      </div>
    </div>
  );
}

// ── Education ─────────────────────────────────────────────
export function EducationPage() {
  const { data, loading, error, reload } = useFetch(() => educationApi.getAll(), []);
  const [form, setForm] = useState<Partial<EducationDto>>({ institution: '', degree: '', field: '', startDate: '', endDate: '', currentlyEnrolled: false, description: '', sortOrder: 0, published: false });
  const [editingId, setEditingId] = useState<number | null>(null); const [saving, setSaving] = useState(false); const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); setMsg(null); try { if (editingId) await educationApi.update(editingId, form); else await educationApi.create(form); setForm({ institution: '', degree: '', field: '', startDate: '', endDate: '', currentlyEnrolled: false, description: '', sortOrder: 0, published: false }); setEditingId(null); reload(); setMsg({ type: 'success', text: 'Education saved' }); } catch (err) { setMsg({ type: 'error', text: formatApiError(err) }); } finally { setSaving(false); } };
  const handleDelete = async (id: number) => { if (!window.confirm('Delete this education entry?')) return; await educationApi.delete(id); reload(); };
  if (loading) return <div className="text-sm text-[var(--color-text-muted)]">Loading…</div>;
  if (error) return <div className="text-sm text-[var(--color-error)]">{error}</div>;
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Education</h2>
      {msg && <div className={`p-3 rounded-md text-sm ${msg.type === 'success' ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' : 'bg-[var(--color-error)]/10 text-[var(--color-error)]'}`}>{msg.text}</div>}
      <form onSubmit={handleSubmit} className="p-5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{editingId ? 'Edit education' : 'New education'}</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div><label htmlFor="e-inst" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Institution</label><input id="e-inst" required value={form.institution ?? ''} onChange={(e) => setForm({ ...form, institution: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
          <div><label htmlFor="e-degree" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Degree</label><input id="e-degree" required value={form.degree ?? ''} onChange={(e) => setForm({ ...form, degree: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
          <div><label htmlFor="e-field" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Field of study</label><input id="e-field" required value={form.field ?? ''} onChange={(e) => setForm({ ...form, field: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div><label htmlFor="e-start" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Start date</label><input id="e-start" type="date" value={form.startDate ?? ''} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
          <div><label htmlFor="e-end" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">End date</label><input id="e-end" type="date" value={form.endDate ?? ''} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
          <div className="flex items-center gap-2 pt-4"><input type="checkbox" checked={form.currentlyEnrolled ?? false} onChange={(e) => setForm({ ...form, currentlyEnrolled: e.target.checked })} className="rounded" /> <span className="text-sm text-[var(--color-text-secondary)]">Currently enrolled</span></div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label htmlFor="e-desc" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Description</label><textarea id="e-desc" rows={3} value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
          <div className="flex flex-col gap-4"><div><label htmlFor="e-sort" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Sort order</label><input id="e-sort" type="number" value={form.sortOrder ?? 0} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div><div className="flex items-center gap-2"><input type="checkbox" checked={form.published ?? false} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded" /> <span className="text-sm text-[var(--color-text-secondary)]">Published</span></div></div>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-md disabled:opacity-50">{saving ? 'Saving…' : editingId ? 'Update' : 'Create'}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ institution: '', degree: '', field: '', startDate: '', endDate: '', currentlyEnrolled: false, description: '', sortOrder: 0, published: false }); }} className="px-4 py-2 text-sm text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-md">Cancel</button>}
        </div>
      </form>
      <div className="overflow-x-auto">
        <table className="w-full text-sm"><thead><tr className="text-left text-xs text-[var(--color-text-muted)] border-b border-[var(--color-border-subtle)]"><th className="pb-2 font-medium">Institution</th><th className="pb-2 font-medium">Degree</th><th className="pb-2 font-medium">Field</th><th className="pb-2 font-medium">Start</th><th className="pb-2 font-medium">End</th><th className="pb-2 font-medium">Published</th><th className="pb-2 font-medium">Actions</th></tr></thead>
        <tbody>
          {(data ?? []).map((e, idx, arr) => (
            <tr key={e.id} className="border-b border-[var(--color-border-subtle)]"><td className="py-3 text-[var(--color-text-primary)]">{e.institution}</td><td className="py-3 text-[var(--color-text-secondary)]">{e.degree}</td><td className="py-3 text-[var(--color-text-secondary)]">{e.field}</td><td className="py-3 text-[var(--color-text-secondary)]">{e.startDate ?? '-'}</td><td className="py-3 text-[var(--color-text-secondary)]">{e.endDate ?? '-'}</td><td className="py-3 text-[var(--color-text-secondary)]">{e.published ? 'Yes' : 'No'}</td><td className="py-3"><div className="flex gap-2"><button onClick={() => { setEditingId(e.id); setForm({ ...e }); }} className="text-xs px-2 py-1 text-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)] rounded">Edit</button><button onClick={() => handleDelete(e.id)} className="text-xs px-2 py-1 text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded">Delete</button><button onClick={() => reorderItem('education', arr, idx, 'up', reload, setMsg)} disabled={idx === 0} className="text-xs px-1 py-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded" aria-label="Move up">↑</button><button onClick={() => reorderItem('education', arr, idx, 'down', reload, setMsg)} disabled={idx === arr.length - 1} className="text-xs px-1 py-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded" aria-label="Move down">↓</button></div></td></tr>
          ))}
        </tbody></table>
        {(data ?? []).length === 0 && <p className="py-8 text-sm text-[var(--color-text-muted)] text-center">No education entries yet. Add your first one above.</p>}
      </div>
    </div>
  );
}

// ── Experience ───────────────────────────────────────────
export function ExperiencePage() {
  const { data, loading, error, reload } = useFetch(() => experienceApi.getAll(), []);
  const [form, setForm] = useState<Partial<ExperienceDto>>({ company: '', role: '', startDate: '', endDate: '', currentRole: false, description: '', techStack: [], sortOrder: 0, published: false });
  const [editingId, setEditingId] = useState<number | null>(null); const [saving, setSaving] = useState(false); const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); setMsg(null); try { if (editingId) await experienceApi.update(editingId, form); else await experienceApi.create(form); setForm({ company: '', role: '', startDate: '', endDate: '', currentRole: false, description: '', techStack: [], sortOrder: 0, published: false }); setEditingId(null); reload(); setMsg({ type: 'success', text: 'Experience saved' }); } catch (err) { setMsg({ type: 'error', text: formatApiError(err) }); } finally { setSaving(false); } };
  const handleDelete = async (id: number) => { if (!window.confirm('Delete this experience entry?')) return; await experienceApi.delete(id); reload(); };
  if (loading) return <div className="text-sm text-[var(--color-text-muted)]">Loading…</div>;
  if (error) return <div className="text-sm text-[var(--color-error)]">{error}</div>;
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Experience</h2>
      {msg && <div className={`p-3 rounded-md text-sm ${msg.type === 'success' ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' : 'bg-[var(--color-error)]/10 text-[var(--color-error)]'}`}>{msg.text}</div>}
      <form onSubmit={handleSubmit} className="p-5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{editingId ? 'Edit experience' : 'New experience'}</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div><label htmlFor="exp-company" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Company</label><input id="exp-company" required value={form.company ?? ''} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
          <div><label htmlFor="exp-role" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Role</label><input id="exp-role" required value={form.role ?? ''} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
          <div><label htmlFor="exp-tech" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Tech stack (comma-separated)</label><input id="exp-tech" value={(form.techStack ?? []).join(',')} onChange={(e) => setForm({ ...form, techStack: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          <div><label htmlFor="exp-start" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Start date</label><input id="exp-start" type="date" value={form.startDate ?? ''} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
          <div><label htmlFor="exp-end" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">End date</label><input id="exp-end" type="date" value={form.endDate ?? ''} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
          <div className="flex items-center gap-2 pt-4"><input type="checkbox" checked={form.currentRole ?? false} onChange={(e) => setForm({ ...form, currentRole: e.target.checked })} className="rounded" /> <span className="text-sm text-[var(--color-text-secondary)]">Current role</span></div>
          <div className="flex items-center gap-2 pt-4"><input type="checkbox" checked={form.published ?? false} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded" /> <span className="text-sm text-[var(--color-text-secondary)]">Published</span></div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label htmlFor="exp-desc" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Description</label><textarea id="exp-desc" rows={3} value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
          <div><label htmlFor="exp-sort" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Sort order</label><input id="exp-sort" type="number" value={form.sortOrder ?? 0} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-md disabled:opacity-50">{saving ? 'Saving…' : editingId ? 'Update' : 'Create'}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ company: '', role: '', startDate: '', endDate: '', currentRole: false, description: '', techStack: [], sortOrder: 0, published: false }); }} className="px-4 py-2 text-sm text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-md">Cancel</button>}
        </div>
      </form>
      <div className="overflow-x-auto">
        <table className="w-full text-sm"><thead><tr className="text-left text-xs text-[var(--color-text-muted)] border-b border-[var(--color-border-subtle)]"><th className="pb-2 font-medium">Company</th><th className="pb-2 font-medium">Role</th><th className="pb-2 font-medium">Start</th><th className="pb-2 font-medium">End</th><th className="pb-2 font-medium">Published</th><th className="pb-2 font-medium">Actions</th></tr></thead>
        <tbody>
          {(data ?? []).map((e, idx, arr) => (
            <tr key={e.id} className="border-b border-[var(--color-border-subtle)]"><td className="py-3 text-[var(--color-text-primary)]">{e.company}</td><td className="py-3 text-[var(--color-text-secondary)]">{e.role}</td><td className="py-3 text-[var(--color-text-secondary)]">{e.startDate ?? '-'}</td><td className="py-3 text-[var(--color-text-secondary)]">{e.endDate ?? '-'}</td><td className="py-3 text-[var(--color-text-secondary)]">{e.published ? 'Yes' : 'No'}</td><td className="py-3"><div className="flex gap-2"><button onClick={() => { setEditingId(e.id); setForm({ ...e }); }} className="text-xs px-2 py-1 text-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)] rounded">Edit</button><button onClick={() => handleDelete(e.id)} className="text-xs px-2 py-1 text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded">Delete</button><button onClick={() => reorderItem('experience', arr, idx, 'up', reload, setMsg)} disabled={idx === 0} className="text-xs px-1 py-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded" aria-label="Move up">↑</button><button onClick={() => reorderItem('experience', arr, idx, 'down', reload, setMsg)} disabled={idx === arr.length - 1} className="text-xs px-1 py-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded" aria-label="Move down">↓</button></div></td></tr>
          ))}
        </tbody></table>
        {(data ?? []).length === 0 && <p className="py-8 text-sm text-[var(--color-text-muted)] text-center">No experience entries yet. Add your first one above.</p>}
      </div>
    </div>
  );
}

// ── Achievements ────────────────────────────────────────
export function AchievementsPage() {
  const { data, loading, error, reload } = useFetch(() => achievementsApi.getAll(), []);
  const [form, setForm] = useState<Partial<AchievementDto>>({ title: '', description: '', date: '', imageUrl: '', sortOrder: 0, published: false });
  const [editingId, setEditingId] = useState<number | null>(null); const [saving, setSaving] = useState(false); const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); setMsg(null); try { if (editingId) await achievementsApi.update(editingId, form); else await achievementsApi.create(form); setForm({ title: '', description: '', date: '', imageUrl: '', sortOrder: 0, published: false }); setEditingId(null); reload(); setMsg({ type: 'success', text: 'Achievement saved' }); } catch (err) { setMsg({ type: 'error', text: formatApiError(err) }); } finally { setSaving(false); } };
  const handleDelete = async (id: number) => { if (!window.confirm('Delete this achievement?')) return; await achievementsApi.delete(id); reload(); };
  if (loading) return <div className="text-sm text-[var(--color-text-muted)]">Loading…</div>;
  if (error) return <div className="text-sm text-[var(--color-error)]">{error}</div>;
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Achievements</h2>
      {msg && <div className={`p-3 rounded-md text-sm ${msg.type === 'success' ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' : 'bg-[var(--color-error)]/10 text-[var(--color-error)]'}`}>{msg.text}</div>}
      <form onSubmit={handleSubmit} className="p-5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{editingId ? 'Edit achievement' : 'New achievement'}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label htmlFor="ach-title" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Title</label><input id="ach-title" required value={form.title ?? ''} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
          <div><label htmlFor="ach-date" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Date</label><input id="ach-date" type="date" value={form.date ?? ''} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
        </div>
        <div><label htmlFor="ach-desc" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Description</label><textarea id="ach-desc" rows={3} value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
        <div><label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Image</label><UploadImage currentUrl={form.imageUrl ?? ''} onUpload={(url) => setForm({ ...form, imageUrl: url })} onClear={() => setForm({ ...form, imageUrl: '' })} /></div>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label htmlFor="ach-sort" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Sort order</label><input id="ach-sort" type="number" value={form.sortOrder ?? 0} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
          <div className="flex items-center gap-2 pt-4"><input type="checkbox" checked={form.published ?? false} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded" /> <span className="text-sm text-[var(--color-text-secondary)]">Published</span></div>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-md disabled:opacity-50">{saving ? 'Saving…' : editingId ? 'Update' : 'Create'}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ title: '', description: '', date: '', imageUrl: '', sortOrder: 0, published: false }); }} className="px-4 py-2 text-sm text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-md">Cancel</button>}
        </div>
      </form>
      <div className="overflow-x-auto">
        <table className="w-full text-sm"><thead><tr className="text-left text-xs text-[var(--color-text-muted)] border-b border-[var(--color-border-subtle)]"><th className="pb-2 font-medium">Title</th><th className="pb-2 font-medium">Date</th><th className="pb-2 font-medium">Description</th><th className="pb-2 font-medium">Published</th><th className="pb-2 font-medium">Actions</th></tr></thead>
        <tbody>
          {(data ?? []).map((a, idx, arr) => (
            <tr key={a.id} className="border-b border-[var(--color-border-subtle)]"><td className="py-3 text-[var(--color-text-primary)]">{a.title}</td><td className="py-3 text-[var(--color-text-secondary)]">{a.date ?? '-'}</td><td className="py-3 text-[var(--color-text-secondary)] line-clamp-2">{a.description}</td><td className="py-3 text-[var(--color-text-secondary)]">{a.published ? 'Yes' : 'No'}</td><td className="py-3"><div className="flex gap-2"><button onClick={() => { setEditingId(a.id); setForm({ ...a }); }} className="text-xs px-2 py-1 text-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)] rounded">Edit</button><button onClick={() => handleDelete(a.id)} className="text-xs px-2 py-1 text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded">Delete</button><button onClick={() => reorderItem('achievements', arr, idx, 'up', reload, setMsg)} disabled={idx === 0} className="text-xs px-1 py-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded" aria-label="Move up">↑</button><button onClick={() => reorderItem('achievements', arr, idx, 'down', reload, setMsg)} disabled={idx === arr.length - 1} className="text-xs px-1 py-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded" aria-label="Move down">↓</button></div></td></tr>
          ))}
        </tbody></table>
        {(data ?? []).length === 0 && <p className="py-8 text-sm text-[var(--color-text-muted)] text-center">No achievements yet. Add your first one above.</p>}
      </div>
    </div>
  );
}

// ── Social Links ────────────────────────────────────────
export function SocialLinksPage() {
  const { data, loading, error, reload } = useFetch(() => socialLinksApi.getAll(), []);
  const [form, setForm] = useState<Partial<SocialLinkDto>>({ platform: '', url: '', iconName: '', sortOrder: 0, published: false });
  const [editingId, setEditingId] = useState<number | null>(null); const [saving, setSaving] = useState(false); const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); setMsg(null); try { if (editingId) await socialLinksApi.update(editingId, form); else await socialLinksApi.create(form); setForm({ platform: '', url: '', iconName: '', sortOrder: 0, published: false }); setEditingId(null); reload(); setMsg({ type: 'success', text: 'Social link saved' }); } catch (err) { setMsg({ type: 'error', text: formatApiError(err) }); } finally { setSaving(false); } };
  const handleDelete = async (id: number) => { if (!window.confirm('Delete this social link?')) return; await socialLinksApi.delete(id); reload(); };
  if (loading) return <div className="text-sm text-[var(--color-text-muted)]">Loading…</div>;
  if (error) return <div className="text-sm text-[var(--color-error)]">{error}</div>;
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Social Links</h2>
      {msg && <div className={`p-3 rounded-md text-sm ${msg.type === 'success' ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' : 'bg-[var(--color-error)]/10 text-[var(--color-error)]'}`}>{msg.text}</div>}
      <form onSubmit={handleSubmit} className="p-5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{editingId ? 'Edit social link' : 'New social link'}</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div><label htmlFor="sl-platform" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Platform</label><input id="sl-platform" required value={form.platform ?? ''} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
          <div><label htmlFor="sl-url" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">URL</label><input id="sl-url" type="url" required value={form.url ?? ''} onChange={(e) => setForm({ ...form, url: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
          <div><label htmlFor="sl-icon" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Icon name</label><input id="sl-icon" value={form.iconName ?? ''} onChange={(e) => setForm({ ...form, iconName: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
          <div><label htmlFor="sl-sort" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Sort order</label><input id="sl-sort" type="number" value={form.sortOrder ?? 0} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
        </div>
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]"><input type="checkbox" checked={form.published ?? false} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded" /> Published</label>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-md disabled:opacity-50">{saving ? 'Saving…' : editingId ? 'Update' : 'Create'}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ platform: '', url: '', iconName: '', sortOrder: 0, published: false }); }} className="px-4 py-2 text-sm text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-md">Cancel</button>}
        </div>
      </form>
      <div className="overflow-x-auto">
        <table className="w-full text-sm"><thead><tr className="text-left text-xs text-[var(--color-text-muted)] border-b border-[var(--color-border-subtle)]"><th className="pb-2 font-medium">Platform</th><th className="pb-2 font-medium">URL</th><th className="pb-2 font-medium">Icon</th><th className="pb-2 font-medium">Published</th><th className="pb-2 font-medium">Actions</th></tr></thead>
        <tbody>
          {(data ?? []).map((s, idx, arr) => (
            <tr key={s.id} className="border-b border-[var(--color-border-subtle)]"><td className="py-3 text-[var(--color-text-primary)]">{s.platform}</td><td className="py-3 text-[var(--color-text-secondary)] truncate max-w-xs">{s.url}</td><td className="py-3 text-[var(--color-text-secondary)]">{s.iconName ?? '-'}</td><td className="py-3 text-[var(--color-text-secondary)]">{s.published ? 'Yes' : 'No'}</td><td className="py-3"><div className="flex gap-2"><button onClick={() => { setEditingId(s.id); setForm({ ...s }); }} className="text-xs px-2 py-1 text-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)] rounded">Edit</button><button onClick={() => handleDelete(s.id)} className="text-xs px-2 py-1 text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded">Delete</button><button onClick={() => reorderItem('social-links', arr, idx, 'up', reload, setMsg)} disabled={idx === 0} className="text-xs px-1 py-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded" aria-label="Move up">↑</button><button onClick={() => reorderItem('social-links', arr, idx, 'down', reload, setMsg)} disabled={idx === arr.length - 1} className="text-xs px-1 py-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded" aria-label="Move down">↓</button></div></td></tr>
          ))}
        </tbody></table>
        {(data ?? []).length === 0 && <p className="py-8 text-sm text-[var(--color-text-muted)] text-center">No social links yet. Add your first one above.</p>}
      </div>
    </div>
  );
}

// ── Profile ─────────────────────────────────────────────
export function ProfilePage() {
  const { data: profile, loading, error, reload } = useFetch<ProfileDto>(() => profileApi.get(), []);
  const [form, setForm] = useState<Partial<ProfileDto>>({});
  const [saving, setSaving] = useState(false); const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => { if (profile) setForm(profile); }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); setMsg(null); try { await profileApi.update(form); reload(); setMsg({ type: 'success', text: 'Profile updated' }); } catch (err) { setMsg({ type: 'error', text: formatApiError(err) }); } finally { setSaving(false); } };

  if (loading) return <div className="text-sm text-[var(--color-text-muted)]">Loading…</div>;
  if (error) return <div className="text-sm text-[var(--color-error)]">{error}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Profile / Site Settings</h2>
      {msg && <div className={`p-3 rounded-md text-sm ${msg.type === 'success' ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' : 'bg-[var(--color-error)]/10 text-[var(--color-error)]'}`}>{msg.text}</div>}

      <form onSubmit={handleSubmit} className="p-5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Site configuration</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label htmlFor="pr-name" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Full name</label><input id="pr-name" required value={form.name ?? ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
          <div><label htmlFor="pr-tagline" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Tagline</label><input id="pr-tagline" required value={form.tagline ?? ''} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
          <div><label htmlFor="pr-email" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Contact email</label><input id="pr-email" type="email" required value={form.email ?? ''} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
          <div><label htmlFor="pr-location" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Location</label><input id="pr-location" value={form.location ?? ''} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
          <div className="md:col-span-2">
            <label htmlFor="pr-headline" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
              Hero Headline <span className="text-[10px] text-[var(--color-text-muted)]">(Displayed prominently on the landing page hero, max 160 chars)</span>
            </label>
            <input
              id="pr-headline"
              maxLength={160}
              placeholder="Building calm, capable digital products."
              value={form.heroHeadline ?? ''}
              onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]"
            />
            <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
              {(form.heroHeadline ?? '').length}/160 characters
            </p>
          </div>
          <div><label htmlFor="pr-resume" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Resume URL</label><input id="pr-resume" type="url" value={form.resumeUrl ?? ''} onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" /></div>
          <div><label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Avatar</label><UploadImage currentUrl={form.avatarUrl ?? ''} onUpload={(url) => setForm((prev) => ({ ...prev, avatarUrl: url }))} onClear={() => setForm((prev) => ({ ...prev, avatarUrl: '' }))} /></div>
        </div>
        <div>
          <label htmlFor="pr-bio" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Bio</label>
          <textarea id="pr-bio" rows={4} value={form.bio ?? ''} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="w-full px-3 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)]" />
        </div>
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]"><input type="checkbox" checked={form.available ?? false} onChange={(e) => setForm({ ...form, available: e.target.checked })} className="rounded" /> Available for hire</label>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-md disabled:opacity-50">{saving ? 'Saving…' : 'Update profile'}</button>
        </div>
      </form>
    </div>
  );
}

// ── Contact Messages ────────────────────────────────────
export function ContactMessagesPage() {
  const { data, loading, error, reload } = useFetch(() => contactMessagesApi.getAll(), []);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this message? This cannot be undone.')) return;
    try { await contactMessagesApi.delete(id); reload(); setMsg({ type: 'success', text: 'Message deleted' }); } catch (err) { setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Failed' }); }
  };

  const handleToggleRead = async (m: ContactMessageDto) => {
    const update: ContactMessageUpdateRequest = { read: !m.read };
    try { await contactMessagesApi.update(m.id, update); reload(); setMsg({ type: 'success', text: `Marked as ${m.read ? 'unread' : 'read'}` }); } catch (err) { setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Failed' }); }
  };

  if (loading) return <div className="text-sm text-[var(--color-text-muted)]">Loading…</div>;
  if (error) return <div className="text-sm text-[var(--color-error)]">{error}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Contact Messages</h2>
      {msg && <div className={`p-3 rounded-md text-sm ${msg.type === 'success' ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' : 'bg-[var(--color-error)]/10 text-[var(--color-error)]'}`}>{msg.text}</div>}

      <div className="overflow-x-auto">
        <table className="w-full text-sm"><thead><tr className="text-left text-xs text-[var(--color-text-muted)] border-b border-[var(--color-border-subtle)]"><th className="pb-2 font-medium">Name</th><th className="pb-2 font-medium">Email</th><th className="pb-2 font-medium">Subject</th><th className="pb-2 font-medium">Message</th><th className="pb-2 font-medium">Status</th><th className="pb-2 font-medium">Date</th><th className="pb-2 font-medium">Actions</th></tr></thead>
        <tbody>
          {(data ?? []).map((m) => (
            <tr key={m.id} className="border-b border-[var(--color-border-subtle)]">
              <td className="py-3 text-[var(--color-text-primary)]">{m.name}</td>
              <td className="py-3 text-[var(--color-text-secondary)]">{m.email}</td>
              <td className="py-3 text-[var(--color-text-secondary)]">{m.subject}</td>
              <td className="py-3 text-[var(--color-text-secondary)] whitespace-pre-wrap">{m.message}</td>
              <td className="py-3">
                <button onClick={() => handleToggleRead(m)} className={`text-xs px-2 py-1 rounded ${m.read ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' : 'bg-[var(--color-error)]/10 text-[var(--color-error)]'}`}>
                  {m.read ? 'Read' : 'Unread'}
                </button>
              </td>
              <td className="py-3 text-[var(--color-text-secondary)]">{m.createdAt ?? '-'}</td>
              <td className="py-3"><button onClick={() => handleDelete(m.id)} className="text-xs px-2 py-1 text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded">Delete</button></td>
            </tr>
          ))}
        </tbody></table>
        {(data ?? []).length === 0 && <p className="py-8 text-sm text-[var(--color-text-muted)] text-center">No messages yet.</p>}
      </div>
    </div>
  );
}

// ── Resume Management (Issue 1) ────────────────────
export function ResumePage() {
  const [meta, setMeta] = useState<{ filename: string; size: number; url: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      const d = await resumeApi.get();
      setMeta(d?.filename ? d : null);
    } catch {
      setMeta(null);
    }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setMsg(null);
    const form = new FormData();
    form.append('file', f);
    try {
      const body = await resumeApi.upload(form);
      setMsg({ type: 'success', text: body || 'Uploaded' });
      load();
    } catch (err) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Failed' });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete resume?')) return;
    try {
      await resumeApi.delete();
      setMsg({ type: 'success', text: 'Deleted' });
      load();
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed' });
    }
  };

  if (loading && !meta) return <div className="text-sm text-[var(--color-text-muted)]">Loading…</div>;
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Resume Management</h2>
      {msg && <div className={`p-3 rounded-md text-sm ${msg.type === 'success' ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' : 'bg-[var(--color-error)]/10 text-[var(--color-error)]'}`}>{msg.text}</div>}
      {!meta ? (
        <div className="p-6 rounded-xl border border-dashed border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-center space-y-3">
          <p className="text-sm text-[var(--color-text-secondary)]">No resume uploaded yet.</p>
          <button onClick={() => inputRef.current?.click()} className="px-4 py-2 text-sm font-medium bg-[var(--color-accent)] text-white rounded-md">Upload Resume</button>
          <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={handleUpload} />
        </div>
      ) : (
        <div className="p-5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] space-y-3">
          <div><p className="text-xs text-[var(--color-text-muted)]">Filename</p><p className="text-sm font-medium">{meta.filename}</p></div>
          <div><p className="text-xs text-[var(--color-text-muted)]">Size</p><p className="text-sm">{(meta.size / 1024).toFixed(1)} KB</p></div>
          <div className="flex gap-2"><a href={meta.url} target="_blank" rel="noopener noreferrer" className="text-xs px-2 py-1 text-[var(--color-accent)] border border-[var(--color-border)] rounded">View / Download</a><button onClick={() => inputRef.current?.click()} className="text-xs px-2 py-1 text-[var(--color-accent)] border border-[var(--color-border)] rounded">Replace</button><button onClick={handleDelete} className="text-xs px-2 py-1 text-[var(--color-error)] border border-[var(--color-error)]/30 rounded">Delete</button><input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={handleUpload} /></div>
        </div>
      )}
    </div>
  );
}