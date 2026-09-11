import { useRef, useState } from 'react';

type ImageUploaderProps = {
  scope: 'portfolio' | 'client';
  entityId: string;
  images: string[];
  onChange: (images: string[]) => void;
  disabled?: boolean;
};

const ACCEPT =
  'image/jpeg,image/png,image/webp,image/gif,image/avif';

const thumbStyle: React.CSSProperties = {
  width: '72px',
  height: '72px',
  objectFit: 'contain',
  borderRadius: '10px',
  border: '1px solid var(--line)',
  background: 'var(--glass-1)',
};

const smallButton: React.CSSProperties = {
  padding: '0.35rem 0.6rem',
  borderRadius: '8px',
  border: '1px solid var(--glass-border)',
  background: 'var(--glass-1)',
  color: 'var(--text-soft)',
  cursor: 'pointer',
  fontSize: '0.7rem',
};

export default function ImageUploader({
  scope,
  entityId,
  images,
  onChange,
  disabled = false,
}: ImageUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const upload = async () => {
    const input = fileRef.current;
    const file = input?.files?.[0];
    if (!file) return;

    setBusy(true);
    setError('');
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('scope', scope);
      form.append('entityId', entityId);

      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Upload failed.');
        return;
      }
      onChange([...images, data.url]);
      if (input) input.value = '';
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const removeImage = async (url: string) => {
    setError('');
    try {
      await fetch('/api/admin/delete-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
    } catch {
      // Best-effort: even if the storage delete fails, drop it from the list.
    }
    onChange(images.filter((img) => img !== url));
  };

  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      {images.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
          {images.map((url, i) => (
            <div
              key={`${url}-${i}`}
              style={{
                display: 'grid',
                gap: '0.35rem',
                justifyItems: 'center',
              }}
            >
              <img
                src={url}
                alt=""
                loading="lazy"
                style={thumbStyle}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.opacity = '0.25';
                }}
              />
              <button
                type="button"
                onClick={() => removeImage(url)}
                style={smallButton}
                aria-label="Remove image"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {disabled ? (
        <div style={{ color: 'var(--text-faint)', fontSize: '0.8rem' }}>
          Save the project first to enable image uploads.
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <input
            ref={fileRef}
            type="file"
            accept={ACCEPT}
            onChange={upload}
            disabled={busy}
            aria-label="Upload image"
            style={{ fontSize: '0.8rem', color: 'var(--text-soft)', maxWidth: '260px' }}
          />
          {busy && (
            <span style={{ color: 'var(--text-faint)', fontSize: '0.8rem' }}>Uploading…</span>
          )}
        </div>
      )}

      {error && (
        <div style={{ color: '#e08a8a', fontSize: '0.8rem' }}>{error}</div>
      )}
    </div>
  );
}
