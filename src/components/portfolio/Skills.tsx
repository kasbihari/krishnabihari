import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../../lib/client/i18n-store';
import type { Lang } from '../../i18n';

type Skill = { name: string; icon: string };
type Category = { label: string; accent: string; skills: Skill[] };

const categories: Category[] = [
  {
    label: 'frontend',
    accent: 'var(--sand-light)',
    skills: [
      { name: 'React', icon: '⚛' },
      { name: 'Next.js', icon: '▲' },
      { name: 'TypeScript', icon: 'TS' },
      { name: 'Astro', icon: '🚀' },
      { name: 'Tailwind CSS', icon: '💨' },
      { name: 'Framer Motion', icon: '✦' },
    ],
  },
  {
    label: 'backend',
    accent: 'var(--forest-bright)',
    skills: [
      { name: 'Node.js', icon: '⬡' },
      { name: 'Symfony', icon: 'SF' },
      { name: 'PHP', icon: 'PHP' },
      { name: 'REST APIs', icon: '⇄' },
      { name: 'Prisma ORM', icon: '◈' },
      { name: 'Doctrine ORM', icon: 'ORM' },
    ],
  },
  {
    label: 'ai',
    accent: 'var(--brown-soft)',
    skills: [
      { name: 'OpenAI API', icon: '◎' },
      { name: 'ElevenLabs', icon: '🎙' },
      { name: 'Twilio', icon: '📞' },
      { name: 'LangChain', icon: '🔗' },
      { name: 'Webhook Flows', icon: '⇌' },
      { name: 'Prompt Engineering', icon: 'PE' },
    ],
  },
  {
    label: 'cloud',
    accent: 'var(--pine-bright)',
    skills: [
      { name: 'MySQL', icon: '🐬' },
      { name: 'PostgreSQL', icon: '🐘' },
      { name: 'MongoDB', icon: '🍃' },
      { name: 'Supabase', icon: '⚡' },
      { name: 'Vercel', icon: '▲' },
      { name: 'GitHub Actions', icon: '⚙' },
    ],
  },
];

function CategoryCard({ cat, delay, label }: { cat: Category; delay: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        padding: 'clamp(1.5rem, 3vw, 2rem)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '6px',
        background: 'var(--charcoal-2)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Accent top border */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, ${cat.accent}, transparent)`,
        }}
      />

      {/* Category label */}
      <p
        style={{
          fontSize: '0.7rem',
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: cat.accent,
          marginBottom: '1.25rem',
        }}
      >
        {label}
      </p>
      {/* Skills grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.6rem',
        }}
      >
        {cat.skills.map((skill, i) => (
          <div
            key={skill.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.5rem 0.75rem',
              borderRadius: '4px',
              border: '1px solid var(--border-subtle)',
              background: 'transparent',
              transition: 'border-color 0.25s, background 0.25s',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(12px)',
              transitionDelay: `${delay + 80 + i * 40}ms`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-mid)';
              e.currentTarget.style.background = 'var(--surface-2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <span
              style={{
                fontSize: '0.72rem',
                width: '22px',
                textAlign: 'center',
                flexShrink: 0,
                color: cat.accent,
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: 600,
              }}
            >
              {skill.icon}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted-light)' }}>
              {skill.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Skills({ lang: initialLang = 'en' }: { lang?: Lang }) {
  const { t } = useI18n(initialLang);
  const s = t.skills;
  const catLabels: Record<string, string> = {
    frontend: s.frontend,
    backend: s.backend,
    ai: s.ai,
    cloud: s.cloud,
  };

  return (
    <section id="skills" className="section-padding">
      <div className="container-main">

        {/* Header */}
        <div style={{ marginBottom: '4rem' }}>
          <p data-reveal className="section-label">{s.label}</p>
          <h2
            data-reveal
            data-delay="100"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 500,
              letterSpacing: '-0.025em',
              color: 'var(--soft-white)',
              lineHeight: 1.05,
              maxWidth: '560px',
            }}
          >
            {s.headingPart1}{' '}
            <span
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'var(--sand-light)',
              }}
            >
              {s.headingPart2}
            </span>
          </h2>
          <p
            data-reveal
            data-delay="200"
            style={{
              marginTop: '1.25rem',
              fontSize: '0.9rem',
              color: 'var(--muted)',
              lineHeight: 1.75,
              maxWidth: '440px',
            }}
          >
            {s.body}
          </p>
        </div>

        {/* Grid of category cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {categories.map((cat, i) => (
            <CategoryCard key={cat.label} cat={cat} delay={i * 100} label={catLabels[cat.label] ?? cat.label} />
          ))}
        </div>

        {/* Bottom quote */}
        <div
          data-reveal
          style={{
            marginTop: '4rem',
            padding: '1.5rem 2rem',
            border: '1px solid var(--border-subtle)',
            borderLeft: '3px solid var(--sand)',
            borderRadius: '0 4px 4px 0',
            maxWidth: '600px',
          }}
        >
          <p
            style={{
              fontSize: '0.95rem',
              fontStyle: 'italic',
              color: 'var(--muted-light)',
              lineHeight: 1.75,
              fontFamily: 'Playfair Display, Georgia, serif',
            }}
          >
            "{s.quote}"
          </p>
        </div>
      </div>
    </section>
  );
}
