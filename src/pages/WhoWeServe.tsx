import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BrandImage } from "@/components/brand/BrandImage";
import { PAGE_HEROES, byId } from "@/brand/imagery";
import { useDocumentMeta, canonical, ORGANIZATION_JSONLD } from "@/lib/useDocumentMeta";

const PERSONA_SLUGS = ["expat", "ticinese", "corporate", "visitor"] as const;

const WhoWeServe = () => {
  useDocumentMeta({
    title: "Who we serve — Members of the house | U-CALM Concierge",
    description:
      "Four registers of member: the expatriate making Switzerland home; the established Ticinese family; the corporate executive between cities; the visitor staying long. One desk, four working languages, one continuous arrangement.",
    canonical: canonical("/who-we-serve"),
    jsonLd: [ORGANIZATION_JSONLD],
  });

  const { t } = useTranslation();

  const personas = PERSONA_SLUGS.map((slug) => ({
    slug,
    slot: PAGE_HEROES[slug as keyof typeof PAGE_HEROES],
    kicker: t(`whoWeServe.personas.${slug}.kicker`),
    title: t(`whoWeServe.personas.${slug}.title`),
    blurb: t(`whoWeServe.personas.${slug}.blurb`),
  }));

  return (
    <>
      {/* Opening — the Serene Teal door */}
      <section className="relative h-[60vh] overflow-hidden">
        <BrandImage image={byId(3)} className="absolute inset-0 w-full h-full object-cover" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/20 to-transparent" />
        <div className="relative container h-full flex flex-col justify-end pb-16">
          <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-champagne">
            {t("whoWeServe.eyebrow")}
          </p>
          <h1 className="mt-3 font-serif text-4xl md:text-6xl font-light text-background max-w-3xl">
            {t("whoWeServe.headline")}
          </h1>
          <p className="mt-6 text-lg text-background/90 max-w-2xl">
            {t("whoWeServe.intro")}
          </p>
        </div>
      </section>

      <section className="container pb-16 pt-20">
        <div className="grid md:grid-cols-2 gap-10">
          {personas.map((p) => (
            <Link key={p.slug} to={`/${p.slug}`} className="group block">
              <div className="overflow-hidden rounded-lg">
                <BrandImage
                  id={p.slot}
                  className="w-full aspect-[16/9] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
                {p.kicker}
              </p>
              <h3 className="mt-2 font-serif text-2xl font-normal text-foreground group-hover:text-primary-deep transition-colors">
                {p.title}
              </h3>
              <p className="mt-3 text-foreground/75 leading-relaxed">
                {p.blurb}
              </p>
              <p className="mt-4 text-sm text-primary-deep">{t("cta.readMore")} →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Closing */}
      <section className="bg-linen">
        <div className="container py-20 grid md:grid-cols-2 gap-10 items-center">
          <BrandImage image={byId(10)} className="w-full rounded-lg overflow-hidden" />
          <div>
            <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              {t("whoWeServe.closing.eyebrow")}
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl font-normal text-foreground">
              {t("whoWeServe.closing.headline")}
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              {t("whoWeServe.closing.body")}
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default WhoWeServe;
