/*
  Language selector.

  One component for every route: the public shell, the client portal and the
  admin dashboard all render this, and all of them read and write the same
  cookie-backed store (`lib/client/i18n-store`). There is no per-route
  language state to keep in sync.

  Styling comes from the shared `.kb-seg` segmented control in global.css.
*/
import { useI18n } from '../lib/client/i18n-store';
import { LANG_NAMES, LANGUAGES, type Lang } from '../i18n';

type Props = {
  lang?: Lang;
  ariaLabel: string;
  /** `sm` sits inside dense toolbars, `md` inside the navigation surface. */
  size?: 'sm' | 'md';
};

export default function LangSwitcher({
  lang: initialLang = 'en',
  ariaLabel,
  size = 'md',
}: Props) {
  const { lang, setLang } = useI18n(initialLang);

  return (
    <div role="group" aria-label={ariaLabel} className="kb-seg" data-size={size}>
      {LANGUAGES.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          data-active={lang === code ? 'true' : 'false'}
          className="kb-seg__item kb-seg__item--mono"
        >
          {LANG_NAMES[code]}
        </button>
      ))}
    </div>
  );
}
