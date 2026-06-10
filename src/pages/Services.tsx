import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";
import { BrandImage } from "@/components/brand/BrandImage";
import { PAGE_HEROES, SERVICES_SCENES, SEASONAL_BANK, byId } from "@/brand/imagery";
import { useDocumentMeta, canonical, ORGANIZATION_JSONLD } from "@/lib/useDocumentMeta";

const TILE_SLUGS = [
  "phone",
  "ground",
  "relocations",
  "corporate",
  "travelEvents",
  "inFull",
  "aviation",
  "coolCalm",
] as const;

const Services = () => {
  useDocumentMeta({
    title: "Services — Considered, thorough, quiet | U-CALM Concierge",
    description:
      "The breadth of work the desk arranges: phone-line concierge, ground and household, relocations and first nights, corporate, travel and events, aviation (through U-Calm Aviation), and Cool CALM. One named concierge, one file, one statement.",
    canonical: canonical("/services"),
    jsonLd: [ORGANIZATION_JSONLD],
  });

  const { t } = useTranslation();

  const tiles = TILE_SLUGS.map((slug) => ({
    slug,
    slot: SERVICES_SCENES[slug as keyof typeof SERVICES_SCENES],
    title: t(`services.tiles.${slug}.title`),
    blurb: t(`services.tiles.${slug}.blurb`),
  }));

  return (
    <>
      <section className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <BrandImage id={PAGE_HEROES.services} priority className="w-full h-full object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-overlay" />
        </div>
        <div className="relative container min-h-[50vh] flex flex-col justify-end py-20">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-champagne">
            {t("services.eyebrow")}
          </p>
          <h1 className="mt-3 font-serif text-4xl md:text-6xl font-light text-background">
            {t("services.headline")}
          </h1>
        </div>
      </section>

      <section className="container py-16 max-w-3xl">
        <p className="text-lg text-foreground/85 leading-relaxed">{t("services.intro")}</p>
      </section>

      <section className="container pb-24">
        <div className="grid md:grid-cols-2 gap-10">
          {tiles.map((tile) => {
            const isAviation = tile.slug === "aviation";
            const isInFull = tile.slug === "inFull";
            const inner = (
              <>
                <div className="overflow-hidden rounded-lg">
                  <BrandImage
                    image={byId(tile.slot)}
                    className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                <h3 className="mt-5 font-serif text-2xl font-normal text-foreground">
                  {tile.title}
                </h3>
                <p className="mt-2 text-foreground/75 leading-relaxed">
                  {tile.blurb}
                </p>
                {isAviation && (
                  <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary-deep px-5 py-2.5 text-xs font-bold uppercase tracking-[0.15em] text-primary-deep group-hover:bg-primary-deep group-hover:text-background transition-colors">
                    Visit U-Calm Aviation
                    <ArrowUpRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </span>
                )}
                {isInFull && (
                  <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary-deep px-5 py-2.5 text-xs font-bold uppercase tracking-[0.15em] text-primary-deep group-hover:bg-primary-deep group-hover:text-background transition-colors">
                    {t("services.tiles.inFull.cta")}
                    <ArrowUpRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </span>
                )}
              </>
            );

            // Aviation is the sister brand and lives at its own site —
            // the whole tile becomes an external link to u-calmaviation.com.
            // The "in full" tile deepens the journey on this site.
            // Other tiles are static descriptions; the concierge handles
            // those requests directly, so no per-tile link is needed.
            if (isAviation) {
              return (
                <a
                  key={tile.slug}
                  href="https://u-calmaviation.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-deep focus-visible:ring-offset-4 rounded-lg"
                  aria-label={`${tile.title} — visit U-Calm Aviation (opens in a new tab)`}
                >
                  {inner}
                </a>
              );
            }
            if (isInFull) {
              return (
                <Link
                  key={tile.slug}
                  to="/services-in-full"
                  className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-deep focus-visible:ring-offset-4 rounded-lg"
                  aria-label={tile.title}
                >
                  {inner}
                </Link>
              );
            }
            return (
              <article key={tile.slug} className="group">
                {inner}
              </article>
            );
          })}
        </div>
      </section>

      {/* When plans shift */}
      <section className="relative h-[70vh] overflow-hidden">
        <BrandImage id={SEASONAL_BANK.disruption} className="absolute inset-0 w-full h-full object-cover" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/40 to-navy/10" />
        <div className="relative container h-full flex flex-col justify-center max-w-3xl">
          <p className="eyebrow text-xs font-bold uppercase tracking-[0.25em] text-champagne">
            {t("services.disruption.eyebrow")}
          </p>
          <h2 className="mt-4 font-serif text-4xl md:text-6xl font-light text-background leading-tight">
            {t("services.disruption.headline")}
          </h2>
          <p className="mt-6 text-lg text-background/90 leading-relaxed">
            {t("services.disruption.body")}
          </p>
        </div>
      </section>

      {/* Dinner laid */}
      <section className="bg-linen">
        <div className="container py-20 grid md:grid-cols-2 gap-10 items-center">
          <BrandImage id={SEASONAL_BANK.springDinner} className="w-full rounded-lg overflow-hidden" />
          <div>
            <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              {t("services.dinnerLaid.eyebrow")}
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl font-normal text-foreground">
              {t("services.dinnerLaid.headline")}
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              {t("services.dinnerLaid.body")}
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
