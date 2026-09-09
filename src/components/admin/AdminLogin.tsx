import { useState } from 'react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json().catch(() => ({ success: false, message: 'Unable to sign in.' }));

    if (!response.ok || !result?.success) {
      setIsSubmitting(false);
      setError(result?.message || 'Invalid credentials.');
      return;
    }

    window.location.href = '/admin';
  };

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '2rem 1.25rem' }}>
      <div style={{ width: '100%', maxWidth: '560px', border: '1px solid var(--border-mid)', borderRadius: '24px', background: 'rgba(21, 15, 10, 0.82)', padding: '2rem', boxShadow: '0 24px 65px rgba(0,0,0,0.25)' }}>
        <div style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--sand)', marginBottom: '0.8rem' }}>Developer access</div>
        <h1 style={{ margin: '0 0 0.75rem', fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--soft-white)' }}>Admin workspace</h1>
        <p style={{ margin: '0 0 1.75rem', color: 'var(--muted)', lineHeight: 1.7 }}>Sign in with your configured admin credentials to access the client and project workspace.</p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <label style={{ display: 'grid', gap: '0.5rem', color: 'var(--off-white)' }}>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--border-mid)', background: 'rgba(255,255,255,0.03)', color: 'var(--soft-white)', padding: '0.9rem 1rem' }}
            />
          </label>

          <label style={{ display: 'grid', gap: '0.5rem', color: 'var(--off-white)' }}>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--border-mid)', background: 'rgba(255,255,255,0.03)', color: 'var(--soft-white)', padding: '0.9rem 1rem' }}
            />
          </label>

          {error ? (
            <div style={{ color: '#f5b8b8', background: 'rgba(120, 30, 30, 0.2)', border: '1px solid rgba(245, 184, 184, 0.25)', borderRadius: '10px', padding: '0.75rem 0.9rem' }}>
              {error}
            </div>
          ) : null}

          <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
}
