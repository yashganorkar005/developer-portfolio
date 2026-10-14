import { useState, useRef, useEffect } from 'react';
import { resolveMediaUrl } from '../utils';

export default function UploadImage({
  currentUrl,
  onUpload,
  onClear,
}: {
  currentUrl?: string;
  onUpload: (url: string) => void;
  onClear?: () => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const shownUrl = preview ?? currentUrl;
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImageError(false);
  }, [shownUrl]);

  useEffect(() => () => { if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview); }, [preview]);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { setStatus('error'); return; }
    const url = URL.createObjectURL(f);
    setPreview(url);
    setImageError(false);
    setStatus('uploading');
    const form = new FormData();
    form.append('file', f);
    try {
      const resp = await fetch(`${API_BASE}/admin/upload/image`, {
        method: 'POST',
        body: form,
        headers: { Authorization: `Bearer ${sessionStorage.getItem('auth_token') ?? ''}` },
      });
      if (!resp.ok) throw new Error('Upload failed');
      const imageUrl = await resp.text();
      onUpload(imageUrl);
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  const handleClear = () => {
    setPreview(null);
    setImageError(false);
    if (inputRef.current) inputRef.current.value = '';
    onClear?.();
  };

  const resolved = resolveMediaUrl(shownUrl);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="px-3 py-1.5 text-xs font-medium bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-md transition-colors cursor-pointer"
        >
          Choose Image
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleFile}
        />
        {shownUrl && !imageError && (
          <img
            src={resolved}
            alt="preview"
            onError={() => setImageError(true)}
            className="h-10 w-10 object-cover rounded-lg border border-[var(--color-border-subtle)] shadow-xs"
          />
        )}
        {shownUrl && imageError && (
          <div className="h-10 w-10 rounded-lg border border-dashed border-[var(--color-border)] flex items-center justify-center text-[10px] text-[var(--color-text-muted)]">
            !
          </div>
        )}
        {onClear && (currentUrl || preview) && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-red-500 hover:text-red-600 transition-colors cursor-pointer"
          >
            Remove
          </button>
        )}
      </div>
      {status === 'uploading' && <p className="text-xs text-[var(--color-text-muted)]">Uploading…</p>}
      {status === 'done' && <p className="text-xs text-[var(--color-success)]">Image uploaded</p>}
      {status === 'error' && <p className="text-xs text-[var(--color-error)]">Failed (max 5MB, JPEG/PNG/WebP)</p>}
    </div>
  );
}
