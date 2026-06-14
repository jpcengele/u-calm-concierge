import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";
import { BrandImage } from "@/components/brand/BrandImage";
import { byId } from "@/brand/imagery";
import {
  useDocumentMeta,
  canonical,
  ORGANIZATION_JSONLD,
} from "@/lib/useDocumentMeta";
import { journalIndex, journalLocale } from "@/content/journal";

const HERO = 6; // villa terrace, first light

const BLOG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": "https://u-calm.com/journal#blog",
  name: "The U-CALM Journal",
  description:
    "Considered notes on making a life in Ticino — the tax, the comune, the schools, the Lugano–Milan–London corridor.",
  url: "https://u-calm.com/journal",
  inLanguage: ["en", "de", "fr", "it"],
  publisher: { "@id": "https://u-calm.com/#org" },
  blogPost: journalIndex().map((e) => ({
    "@type": "BlogPosting",
    headline: e.locales.en.title,
    url: `https://u-calm.com/journal/${e.slug}`,
    datePublished: e.date,
  })),
} as const;

const Journal = () => {
  useDocumentMeta({
    title: "The Journal — settling in Ticino | U-CALM Concierge",
    description:
      "Considered notes on making a life in Ticino — lump-sum taxation, the comune, schools, and the Lugano–Milan–London corridor. Fewer pieces, each genuinely useful.",
    canonical: canonical("/journal"),
    ogImage:
      "https://u-calm.com/brand/01-brand-heroes/hero-villa-terrace-dawn.jpg",
    jsonLd: [ORGANIZATION_JSONLD, BLOG_JSONLD],
  });

  const { t, i18n } = useTranslation();
  const locale = journalLocale(i18n.language);
  const dateLocale = locale === "en" ? "en-GB" : locale;
  const entries = journalIndex();

  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <BrandImage id={HERO} priority className="w-full h-full object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-overlay" />
        </div>
        <div className="relative container min-h-[48vh] flex flex-col justify-end py-20">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-champagne">
            {t("journal.eyebrow")}
          </p>
          <h1 className="mt-3 font-serif text-4xl md:text-6xl font-light text-background max-w-3xl">
            {t("journal.title")}
          </h1>
          <p className="mt-6 text-lg text-background/90 max-w-2xl">{t("journal.lead")}</p>
        </div>
      </section>

      {/* Entries */}
      <section className="container py-20">
        <div className="grid md:grid-cols-2 gap-x-10 gap-y-14">
          {entries.map((e) => {
            const c = e.locales[locale];
            const dateLabel = new Date(e.date).toLocaleDateString(dateLocale, {
              day: "numeric",
              month: "long",
              year: "numeric",
            });
            return (
              <article key={e.slug} className="group">
                <Link to={`/journal/${e.slug}`} className="block">
                  <div className="overflow-hidden rounded-lg">
                    <BrandImage
                      image={byId(e.image)}
                      className="w-full aspect-[16/10] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                  <p className="mt-5 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    {dateLabel} · {t("journal.minRead", { min: e.readingMin })}
                  </p>
                  <h2 className="mt-2 font-serif text-2xl font-normal text-foreground group-hover:text-primary-deep transition-colors">
                    {c.title}
                  </h2>
                  <p className="mt-3 text-foreground/75 leading-relaxed">{c.dek}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] text-primary-deep">
                    {t("cta.readMore")}
                    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                </Link>
              </article>
            );
          })}
        </div>

        <p className="mt-16 text-center text-sm italic text-muted-foreground">
          {t("journal.more")}
        </p>
      </section>
    </>
  );
};

export default Journal;
