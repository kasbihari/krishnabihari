import ThemeSwitcher from '../ThemeSwitcher';
import type { ThemeMode } from '../../lib/client/theme';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', match: /^\/admin\/?$/ },
  { href: '/admin/portfolio', label: 'Portfolio', match: /^\/admin\/portfolio/ },
  { href: '/admin/projects', label: 'Client work', match: /^\/admin\/projects/ },
  { href: '/admin/clients', label: 'Clients', match: /^\/admin\/clients/ },
];

type Props = {
  currentPath: string;
  themeLabels: Record<ThemeMode, string>;
  themeAriaLabel: string;
};

export default function AdminNav({
  currentPath,
  themeLabels,
  themeAriaLabel,
}: Props) {
  return (
    <nav
      aria-label="Admin navigation"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid var(--line)',
        background: 'var(--glass-2)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0.8rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <a
          href="/admin"
          style={{
            fontFamily: 'var(--font-name)',
            fontSize: '1.25rem',
            color: 'var(--text)',
            textDecoration: 'none',
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
          }}
        >
          Krishna Bihari
        </a>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            flexWrap: 'wrap',
          }}
        >
          {NAV_ITEMS.map((item) => {
            const active = item.match.test(currentPath);
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  letterSpacing: '0.04em',
                  textDecoration: 'none',
                  color: active ? 'var(--text)' : 'var(--text-soft)',
                  background: active ? 'var(--glass-3)' : 'transparent',
                  border: active ? '1px solid var(--glass-border)' : '1px solid transparent',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.label}
              </a>
            );
          })}

          {/* Same theme control as the public site — one store, one source
              of truth, so the choice carries across every route. */}
          <ThemeSwitcher
            size="sm"
            ariaLabel={themeAriaLabel}
            labels={themeLabels}
          />

          <a
            href="/admin/logout"
            style={{
              marginLeft: '0.5rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.78rem',
              letterSpacing: '0.04em',
              textDecoration: 'none',
              color: 'var(--text-soft)',
              border: '1px solid var(--glass-border)',
              whiteSpace: 'nowrap',
            }}
          >
            Log out
          </a>
        </div>
      </div>
    </nav>
  );
}
