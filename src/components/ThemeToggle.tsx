import { Moon, Sun } from 'lucide-react';

const iconBase: React.CSSProperties = {
  width: '16px',
  height: '16px',
  strokeWidth: 1.75,
};

export default function ThemeToggle({ ariaLabel }: { ariaLabel: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.classList.add('theme-transition');
    window.setTimeout(() => root.classList.remove('theme-transition'), 500);
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('kb-theme', next);
    } catch {
      /* private mode — theme still applies for this session */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={ariaLabel}
      className="kb-theme-toggle"
    >
      <Sun style={iconBase} className="kb-theme-icon kb-icon-light" />
      <Moon style={iconBase} className="kb-theme-icon kb-icon-dark" />
      <style>{`
        .kb-theme-toggle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 999px;
          border: 1px solid var(--line);
          background: var(--surface);
          color: var(--text-soft);
          cursor: pointer;
          transition: color 0.3s, border-color 0.3s, background 0.3s, transform 0.2s;
        }
        .kb-theme-toggle:hover {
          color: var(--text);
          border-color: var(--line-strong);
          transform: translateY(-1px);
        }
        .kb-icon-light { display: none; }
        html[data-theme='light'] .kb-icon-light { display: inline-block; }
        html[data-theme='dark'] .kb-icon-dark { display: inline-block; }
        .kb-icon-dark { display: none; }
      `}</style>
    </button>
  );
}
