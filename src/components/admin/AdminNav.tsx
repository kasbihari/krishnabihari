const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', match: /^\/admin\/?$/ },
  { href: '/admin/portfolio', label: 'Portfolio', match: /^\/admin\/portfolio/ },
  { href: '/admin/projects', label: 'Client work', match: /^\/admin\/projects/ },
  { href: '/admin/clients', label: 'Clients', match: /^\/admin\/clients/ },
];

export default function AdminNav({ currentPath }: { currentPath: string }) {
  return (
    <nav
      aria-label="Admin navigation"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid var(--border-mid)',
        background: 'rgba(21, 15, 10, 0.85)',
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
            color: 'var(--soft-white)',
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
                  color: active ? 'var(--soft-white)' : 'var(--muted-light)',
                  background: active ? 'rgba(255,255,255,0.07)' : 'transparent',
                  border: active ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.label}
              </a>
            );
          })}

          <a
            href="/admin/logout"
            style={{
              marginLeft: '0.5rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.78rem',
              letterSpacing: '0.04em',
              textDecoration: 'none',
              color: 'var(--muted-light)',
              border: '1px solid rgba(255,255,255,0.08)',
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
