import { useTranslation } from "react-i18next";
import { BrandImage } from "@/components/brand/BrandImage";
import { PAGE_HEROES, SERVICES_SCENES, SEASONAL_BANK, byId } from "@/brand/imagery";

const TILE_SLUGS = [
  "phone",
  "ground",
  "relocations",
  "corporate",
  "travelEvents",
  "aviation",
  "coolCalm",
] as const;

const Services = () => {
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
          {tiles.map((tile) => (
            <article key={tile.slug} className="group">
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
            </article>
          ))}
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
