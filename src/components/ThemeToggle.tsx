import { Moon, Sun } from 'lucide-react';

const iconBase: React.CSSProperties = {
  width: '15px',
  height: '15px',
  strokeWidth: 1.6,
};

export default function ThemeToggle({ ariaLabel }: { ariaLabel: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.classList.add('theme-transition');
    window.setTimeout(() => root.classList.remove('theme-transition'), 560);
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('kb-theme', next);
    } catch {
      /* private mode — theme still applies for this session */
    }
  };

  return (
    <button type="button" onClick={toggle} aria-label={ariaLabel} className="kb-theme-toggle">
      <Sun style={iconBase} className="kb-theme-icon kb-icon-light" />
      <Moon style={iconBase} className="kb-theme-icon kb-icon-dark" />
      <style>{`
        .kb-theme-toggle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 999px;
          border: 1px solid var(--glass-border);
          background: var(--glass-1);
          color: var(--text-faint);
          cursor: pointer;
          transition: color var(--dur-base) var(--ease-out),
                      border-color var(--dur-base) var(--ease-out),
                      background var(--dur-base) var(--ease-out);
        }
        .kb-theme-toggle:hover {
          color: var(--text);
          border-color: var(--glass-border-hover);
          background: var(--glass-2);
        }
        .kb-icon-light { display: none; }
        html[data-theme='light'] .kb-icon-light { display: inline-block; }
        html[data-theme='dark'] .kb-icon-dark { display: inline-block; }
        .kb-icon-dark { display: none; }
      `}</style>
    </button>
  );
}
