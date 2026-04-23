import { useEffect } from "react";
import { useTranslation } from "react-i18next";

/**
 * Text-only language toggle. Pill separators, localStorage-persisted via
 * i18next-browser-languagedetector. No flags — flags are politically
 * ambiguous (Swiss German? Austrian German?) and age poorly in brand UI.
 */

const LOCALES = ["en", "de", "fr", "it"] as const;

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const active = (LOCALES as readonly string[]).includes(i18n.language)
    ? i18n.language
    : i18n.resolvedLanguage ?? "en";

  // Keep <html lang> in sync with the active locale for screen readers + SEO.
  useEffect(() => {
    document.documentElement.lang = active;
  }, [active]);

  return (
    <div
      role="group"
      aria-label="Language"
      className="flex items-center gap-1 text-xs uppercase tracking-[0.12em]"
    >
      {LOCALES.map((lng, i) => (
        <span key={lng} className="flex items-center">
          {i > 0 && <span className="px-1 text-muted-foreground/60">·</span>}
          <button
            type="button"
            onClick={() => i18n.changeLanguage(lng)}
            className={
              lng === active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground transition-colors"
            }
            aria-current={lng === active ? "true" : undefined}
          >
            {lng}
          </button>
        </span>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
