import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";
import { BrandImage } from "@/components/brand/BrandImage";
import { byId } from "@/brand/imagery";
import { useDocumentMeta, canonical, ORGANIZATION_JSONLD } from "@/lib/useDocumentMeta";

// All slots reuse existing enabled brand imagery (no new assets needed to
// ship). The upgrade visuals are specified in
// UCALM_Portfolio/04_Content/UCALM_ServicesInFull_Visual_Prompts.md —
// when generated, add slots 50–57 to src/brand/imagery.ts and swap here.
const HERO = 6;     // villa terrace, first light — the whole of it
const CLOSING = 10; // member residence, afternoon — the year, held

const FAMILIES = [
  { key: "desk", slot: 9 },       // concierge note on walnut
  { key: "household", slot: 4 },  // kitchen, prepared
  { key: "family", slot: 40 },    // autumn, cat on the reading chair
  { key: "arrival", slot: 3 },    // Serene Teal door, Lugano
  { key: "business", slot: 33 },  // boardroom, off-site handed
  { key: "corridor", slot: 39 },  // summer lake at blue hour
] as const;

const ServicesInFull = () => {
  useDocumentMeta({
    title: "The services, in full | U-CALM Concierge",
    description:
      "The breadth beneath the desk, plainly listed: days and errands, house and household, family and care, arrival and relocations, business days, and the corridor — one named concierge, one file.",
    canonical: canonical("/services-in-full"),
    jsonLd: [ORGANIZATION_JSONLD],
  });

  const { t } = useTranslation();

  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <BrandImage id={HERO} priority className="w-full h-full object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-overlay" />
        </div>
        <div className="relative container min-h-[55vh] flex flex-col justify-end py-20">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-champagne">
            {t("inFull.eyebrow")}
          </p>
          <h1 className="mt-3 font-serif text-4xl md:text-6xl font-light text-background max-w-3xl">
            {t("inFull.headline")}
          </h1>
          <p className="mt-6 text-lg text-background/90 max-w-2xl">{t("inFull.lead")}</p>
        </div>
      </section>

      {/* The shape of it */}
      <section className="container py-20 max-w-3xl">
        <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
          {t("inFull.shape.eyebrow")}
        </p>
        <h2 className="mt-4 font-serif text-3xl md:text-4xl font-normal text-foreground">
          {t("inFull.shape.headline")}
        </h2>
        <p className="mt-5 text-lg text-foreground/85 leading-relaxed">
          {t("inFull.shape.body")}
        </p>
      </section>

      {/* The six families */}
      <section className="container pb-24">
        <div className="grid md:grid-cols-2 gap-10">
          {FAMILIES.map((f) => {
            const isArrival = f.key === "arrival";
            return (
              <article key={f.key} className="group">
                <div className="overflow-hidden rounded-lg">
                  <BrandImage
                    image={byId(f.slot)}
                    className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                <h3 className="mt-5 font-serif text-2xl font-normal text-foreground">
                  {t(`inFull.families.${f.key}.title`)}
                </h3>
                <p className="mt-2 font-serif text-lg italic text-primary-deep">
                  {t(`inFull.families.${f.key}.promise`)}
                </p>
                <p className="mt-2 text-foreground/75 leading-relaxed">
                  {t(`inFull.families.${f.key}.body`)}
                </p>
                {!isArrival && (
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    <span className="font-bold uppercase tracking-[0.1em] text-[0.7rem]">
                      {t("inFull.includingLabel")}
                    </span>{" "}
                    {t(`inFull.families.${f.key}.including`)}
                  </p>
                )}
                {isArrival && (
                  <Link
                    to="/arrival"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] text-primary-deep hover:text-primary transition-colors"
                  >
                    {t("inFull.families.arrival.link")}
                    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* Sister brands */}
      <section className="bg-navy">
        <div className="container py-16">
          <p className="eyebrow text-xs font-bold uppercase tracking-[0.25em] text-champagne">
            {t("inFull.sisters.eyebrow")}
          </p>
          <div className="mt-8 grid md:grid-cols-2 gap-10">
            <a
              href="https://u-calmaviation.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne rounded-lg"
              aria-label="U-Calm Aviation (opens in a new tab)"
            >
              <h3 className="font-serif text-2xl font-normal text-background inline-flex items-center gap-2">
                {t("inFull.sisters.aviation.title")}
                <ArrowUpRight
                  className="h-4 w-4 text-champagne transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </h3>
              <p className="mt-2 text-background/80 leading-relaxed">
                {t("inFull.sisters.aviation.line")}
              </p>
            </a>
            <Link
              to="/cool-calm"
              className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne rounded-lg"
            >
              <h3 className="font-serif text-2xl font-normal text-background inline-flex items-center gap-2">
                {t("inFull.sisters.coolCalm.title")}
                <ArrowUpRight
                  className="h-4 w-4 text-champagne transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </h3>
              <p className="mt-2 text-background/80 leading-relaxed">
                {t("inFull.sisters.coolCalm.line")}
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* How to begin */}
      <section className="relative h-[65vh] overflow-hidden">
        <BrandImage id={CLOSING} className="absolute inset-0 w-full h-full object-cover" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/40 to-navy/10"
        />
        <div className="relative container h-full flex flex-col justify-center max-w-3xl">
          <p className="eyebrow text-xs font-bold uppercase tracking-[0.25em] text-champagne">
            {t("inFull.closing.eyebrow")}
          </p>
          <h2 className="mt-4 font-serif text-4xl md:text-6xl font-light text-background leading-tight">
            {t("inFull.closing.headline")}
          </h2>
          <p className="mt-6 text-lg text-background/90 leading-relaxed">
            {t("inFull.closing.body")}
          </p>
          <div className="mt-8">
            <Link
              to="/contact"
              className="inline-flex items-center rounded-full bg-primary px-7 py-3 text-sm font-bold uppercase tracking-[0.12em] text-primary-foreground hover:bg-primary-deep transition-colors"
            >
              {t("cta.openConversation")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesInFull;
