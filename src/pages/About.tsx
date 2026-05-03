import { useTranslation } from "react-i18next";
import { BrandImage } from "@/components/brand/BrandImage";
import { PAGE_HEROES, ABOUT_SCENES, SEASONAL_BANK } from "@/brand/imagery";
import { brand } from "@/brand/config";
import {
  useDocumentMeta,
  canonical,
  ORGANIZATION_JSONLD,
  LOCALBUSINESS_JSONLD,
} from "@/lib/useDocumentMeta";

const About = () => {
  useDocumentMeta({
    title: "About — A house in Lugano | U-CALM Concierge",
    description:
      "U-CALM was founded in Lugano in 2013 around a single proposition: that the membership relationship between a member and their concierge should be the only relationship a member has to think about. The acronym is the architecture: Considered, Anticipated, Looked-after, Mannered.",
    canonical: canonical("/about"),
    jsonLd: [
      ORGANIZATION_JSONLD,
      LOCALBUSINESS_JSONLD,
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        url: "https://u-calm.com/about",
        about: { "@id": "https://u-calm.com/#desk" },
      },
    ],
  });

  const { t } = useTranslation();
  return (
    <>
      <section className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <BrandImage id={PAGE_HEROES.about} priority className="w-full h-full object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-overlay" />
        </div>
        <div className="relative container min-h-[50vh] flex flex-col justify-end py-20">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-champagne">
            {t("about.eyebrow")}
          </p>
          <h1 className="mt-3 font-serif text-4xl md:text-6xl font-light text-background">
            {t("about.headline")}
          </h1>
        </div>
      </section>

      <section className="container py-16 max-w-3xl">
        <p className="text-lg text-foreground/85 leading-relaxed">{t("about.intro")}</p>
      </section>

      {/* New Year first light */}
      <section className="bg-linen">
        <div className="container py-20 grid md:grid-cols-2 gap-10 items-center">
          <BrandImage id={SEASONAL_BANK.newYearFirstLight} className="w-full rounded-lg overflow-hidden" />
          <div>
            <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              {t("about.newYear.eyebrow")}
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl font-normal text-foreground">
              {t("about.newYear.headline")}
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              {t("about.newYear.body")}
            </p>
          </div>
        </div>
      </section>

      {/* Parco Ciani */}
      <section className="bg-background">
        <div className="container py-20 grid md:grid-cols-2 gap-10 items-center">
          <div className="md:order-2">
            <BrandImage id={ABOUT_SCENES.parcoCiani} className="w-full rounded-lg overflow-hidden" />
          </div>
          <div className="md:order-1">
            <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              {t("about.parcoCiani.eyebrow")}
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl font-normal text-foreground">
              {t("about.parcoCiani.headline")}
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              {t("about.parcoCiani.body")}
            </p>
          </div>
        </div>
      </section>

      {/* Founding room */}
      <section className="bg-linen">
        <div className="container py-20 grid md:grid-cols-2 gap-10 items-center">
          <BrandImage id={ABOUT_SCENES.founding2013} className="w-full rounded-lg overflow-hidden" />
          <div>
            <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              {t("about.founding.eyebrow")}
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl font-normal text-foreground">
              {t("about.founding.headline")}
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              {t("about.founding.body")}
            </p>
          </div>
        </div>
      </section>

      {/* U·C·A·L·M acronym */}
      <section className="bg-navy text-background">
        <div className="container py-20 md:py-28 text-center">
          <p className="eyebrow text-xs font-bold uppercase tracking-[0.25em] text-champagne">
            {t("about.acronymSection.eyebrow")}
          </p>

          <div className="mt-12 flex flex-row flex-nowrap items-baseline justify-center gap-x-3 md:gap-x-5 lg:gap-x-8 overflow-x-auto">
            {brand.acronym.map((item) => (
              <div key={item.letter} className="flex items-baseline font-serif font-light whitespace-nowrap">
                <span className="text-primary leading-none text-[2.5rem] sm:text-[3rem] md:text-[4.5rem] lg:text-[6rem]">
                  {item.letter}
                </span>
                <span className="text-champagne leading-none text-sm sm:text-base md:text-xl lg:text-2xl lowercase tracking-tight">
                  {item.word.slice(1)}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-14 font-serif italic text-xl md:text-2xl text-background/90">
            {t("brand.strapline")}
          </p>
        </div>
      </section>

      {/* Christmas */}
      <section className="bg-linen">
        <div className="container py-20 grid md:grid-cols-2 gap-10 items-center">
          <div className="md:order-2">
            <BrandImage id={SEASONAL_BANK.christmasTable} className="w-full rounded-lg overflow-hidden" />
          </div>
          <div className="md:order-1">
            <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              {t("about.christmas.eyebrow")}
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl font-normal text-foreground">
              {t("about.christmas.headline")}
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              {t("about.christmas.body")}
            </p>
          </div>
        </div>
      </section>

      {/* Acronym image echo */}
      <section className="bg-background">
        <div className="container py-20 grid md:grid-cols-2 gap-10 items-center">
          <BrandImage id={ABOUT_SCENES.calmAcronym} className="w-full rounded-lg overflow-hidden" />
          <div>
            <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              {t("about.acronymEcho.eyebrow")}
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl font-normal text-foreground">
              {t("about.acronymEcho.headline")}
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              {t("about.acronymEcho.body")}
            </p>
          </div>
        </div>
      </section>

      {/* Household + team */}
      <section className="bg-linen">
        <div className="container py-20 grid md:grid-cols-2 gap-10">
          <article>
            <BrandImage id={ABOUT_SCENES.household} className="w-full rounded-lg overflow-hidden" />
            <h3 className="mt-5 font-serif text-2xl font-normal text-foreground">
              {t("about.household.title")}
            </h3>
            <p className="mt-2 text-foreground/75 leading-relaxed">
              {t("about.household.body")}
            </p>
          </article>
          <article>
            <BrandImage id={ABOUT_SCENES.team} className="w-full rounded-lg overflow-hidden" />
            <h3 className="mt-5 font-serif text-2xl font-normal text-foreground">
              {t("about.team.title")}
            </h3>
            <p className="mt-2 text-foreground/75 leading-relaxed">
              {t("about.team.body")}
            </p>
          </article>
        </div>
      </section>
    </>
  );
};

export default About;
