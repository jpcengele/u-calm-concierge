import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { BrandImage } from "@/components/brand/BrandImage";
import { byId } from "@/brand/imagery";
import { useDocumentMeta, canonical, ORGANIZATION_JSONLD } from "@/lib/useDocumentMeta";
import { getJournalEntry, journalLocale } from "@/content/journal";

const JournalPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const entry = getJournalEntry(slug);

  // Unknown slug — keep crawlers off it, offer the way back.
  useDocumentMeta(
    entry
      ? {
          title: `${entry.locales.en.title} | U-CALM Journal`,
          description: entry.locales.en.dek,
          canonical: canonical(`/journal/${entry.slug}`),
          ogType: "article",
          ogImage: "https://u-calm.com/brand/01-brand-heroes/hero-villa-terrace-dawn.jpg",
          jsonLd: [
            ORGANIZATION_JSONLD,
            {
              "@context": "https://schema.org",
              "@type": "Article",
              "@id": `https://u-calm.com/journal/${entry.slug}#article`,
              headline: entry.locales.en.title,
              description: entry.locales.en.dek,
              datePublished: entry.date,
              dateModified: entry.date,
              inLanguage: journalLocale(i18n.language),
              keywords: entry.keywords.join(", "),
              author: { "@id": "https://u-calm.com/#org" },
              publisher: { "@id": "https://u-calm.com/#org" },
              mainEntityOfPage: `https://u-calm.com/journal/${entry.slug}`,
              isPartOf: { "@type": "Blog", "@id": "https://u-calm.com/journal#blog" },
            },
          ],
        }
      : {
          title: "Not found | U-CALM Journal",
          description: "That journal entry does not exist.",
          canonical: canonical("/journal"),
          robots: "noindex, follow",
        }
  );

  if (!entry) {
    return (
      <section className="container py-32 max-w-2xl text-center">
        <h1 className="font-serif text-3xl font-normal text-foreground">
          {t("notFound.title")}
        </h1>
        <p className="mt-4 text-foreground/75">{t("notFound.body")}</p>
        <Link
          to="/journal"
          className="mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] text-primary-deep hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          {t("journal.backToJournal")}
        </Link>
      </section>
    );
  }

  const locale = journalLocale(i18n.language);
  const c = entry.locales[locale];
  const dateLocale = locale === "en" ? "en-GB" : locale;
  const dateLabel = new Date(entry.date).toLocaleDateString(dateLocale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      {/* Article header */}
      <section className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <BrandImage id={entry.image} priority className="w-full h-full object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-overlay" />
        </div>
        <div className="relative container min-h-[44vh] flex flex-col justify-end py-16">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-champagne">
            {t("journal.eyebrow")}
          </p>
          <h1 className="mt-3 font-serif text-3xl md:text-5xl font-light text-background max-w-3xl">
            {c.title}
          </h1>
          <p className="mt-5 text-xs uppercase tracking-[0.12em] text-background/80">
            {dateLabel} · {t("journal.minRead", { min: entry.readingMin })}
          </p>
        </div>
      </section>

      {/* Body */}
      <article className="container py-16 max-w-3xl">
        {c.body.map((b, i) => {
          if (b.t === "h2")
            return (
              <h2
                key={i}
                className="mt-12 font-serif text-2xl md:text-3xl font-normal text-foreground"
              >
                {b.x}
              </h2>
            );
          if (b.t === "sign")
            return (
              <p key={i} className="mt-12 font-serif italic text-xl text-primary-deep">
                {b.x}
              </p>
            );
          if (b.t === "note")
            return (
              <p
                key={i}
                className="mt-10 border-t border-border pt-6 text-sm italic text-muted-foreground leading-relaxed"
              >
                {b.x}
              </p>
            );
          return (
            <p key={i} className="mt-5 text-lg text-foreground/85 leading-relaxed">
              {b.x}
            </p>
          );
        })}

        {/* Close */}
        <div className="mt-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-border pt-8">
          <Link
            to="/journal"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] text-primary-deep hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
            {t("journal.backToJournal")}
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center rounded-full bg-primary px-7 py-3 text-sm font-bold uppercase tracking-[0.12em] text-primary-foreground hover:bg-primary-deep transition-colors"
          >
            {t("cta.openConversation")}
          </Link>
        </div>
      </article>
    </>
  );
};

export default JournalPost;
