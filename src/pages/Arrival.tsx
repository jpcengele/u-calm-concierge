import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BrandImage } from "@/components/brand/BrandImage";
import { byId } from "@/brand/imagery";
import { useDocumentMeta, canonical, ORGANIZATION_JSONLD, ARRIVAL_SERVICE_JSONLD } from "@/lib/useDocumentMeta";

// Hero + closing pull from the shared brand bank; module scenes reuse
// existing enabled slots (no new imagery required to ship the page).
const HERO = 38;       // spring magnolia threshold — arriving
const CLOSING = 49;    // returning home, shoulders settle

const MODULES = [
  { key: "permits", slot: 37 },
  { key: "comune", slot: 14 },
  { key: "home", slot: 16 },
  { key: "health", slot: 26 },
  { key: "school", slot: 44 },
  { key: "fiscal", slot: 5 },
  { key: "belonging", slot: 45 },
] as const;

const PILLARS = ["oneFile", "order", "language", "statement"] as const;

const Arrival = () => {
  useDocumentMeta({
    title: "Arrival — settling in Ticino, quietly | U-CALM Concierge",
    description:
      "U-CALM Arrival is a settlement mandate for families moving to Lugano and Ticino: permits, the comune, home-finding, health insurance, schools and the fiscal liaison — held on one file by one named specialist.",
    canonical: canonical("/arrival"),
    ogImage: "https://u-calm.com/brand/07-seasonal/seasonal-spring-magnolia-threshold.jpg",
    jsonLd: [ORGANIZATION_JSONLD, ARRIVAL_SERVICE_JSONLD],
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
        <div className="relative container min-h-[58vh] flex flex-col justify-end py-20">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-champagne">
            {t("arrival.eyebrow")}
          </p>
          <h1 className="mt-3 font-serif text-4xl md:text-6xl font-light text-background max-w-3xl">
            {t("arrival.headline")}
          </h1>
          <p className="mt-6 text-lg text-background/90 max-w-2xl">{t("arrival.lead")}</p>
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

      {/* What it is */}
      <section className="container py-20 max-w-3xl">
        <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
          {t("arrival.whatItIs.eyebrow")}
        </p>
        <h2 className="mt-4 font-serif text-3xl md:text-4xl font-normal text-foreground">
          {t("arrival.whatItIs.headline")}
        </h2>
        <p className="mt-5 text-lg text-foreground/85 leading-relaxed">
          {t("arrival.whatItIs.body")}
        </p>
      </section>

      {/* How it works — four pillars */}
      <section className="bg-linen">
        <div className="container py-20">
          <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
            {t("arrival.pillars.eyebrow")}
          </p>
          <h2 className="mt-4 font-serif text-3xl md:text-4xl font-normal text-foreground max-w-2xl">
            {t("arrival.pillars.headline")}
          </h2>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PILLARS.map((p) => (
              <div key={p}>
                <h3 className="font-serif text-2xl font-normal text-primary-deep">
                  {t(`arrival.pillars.${p}.title`)}
                </h3>
                <p className="mt-2 text-foreground/75 leading-relaxed">
                  {t(`arrival.pillars.${p}.body`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="container py-20">
        <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
          {t("arrival.modulesIntro.eyebrow")}
        </p>
        <h2 className="mt-4 font-serif text-3xl md:text-4xl font-normal text-foreground">
          {t("arrival.modulesIntro.headline")}
        </h2>
        <div className="mt-12 grid md:grid-cols-2 gap-10">
          {MODULES.map((m) => (
            <article key={m.key} className="group">
              <div className="overflow-hidden rounded-lg">
                <BrandImage
                  image={byId(m.slot)}
                  className="w-full aspect-[16/9] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <h3 className="mt-5 font-serif text-2xl font-normal text-foreground">
                {t(`arrival.modules.${m.key}.title`)}
              </h3>
              <p className="mt-2 font-serif text-lg italic text-primary-deep">
                {t(`arrival.modules.${m.key}.promise`)}
              </p>
              <p className="mt-2 text-foreground/75 leading-relaxed">
                {t(`arrival.modules.${m.key}.body`)}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Where it leads */}
      <section className="relative h-[70vh] overflow-hidden">
        <BrandImage id={CLOSING} className="absolute inset-0 w-full h-full object-cover" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/40 to-navy/10"
        />
        <div className="relative container h-full flex flex-col justify-center max-w-3xl">
          <p className="eyebrow text-xs font-bold uppercase tracking-[0.25em] text-champagne">
            {t("arrival.leads.eyebrow")}
          </p>
          <h2 className="mt-4 font-serif text-4xl md:text-6xl font-light text-background leading-tight">
            {t("arrival.leads.headline")}
          </h2>
          <p className="mt-6 text-lg text-background/90 leading-relaxed">
            {t("arrival.leads.body")}
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

export default Arrival;
