import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { BrandImage } from "@/components/brand/BrandImage";
import { PAGE_HEROES, HOME_EDITORIAL, SEASONAL_BANK, byId } from "@/brand/imagery";
import { Button } from "@/components/ui/button";

const PERSONA_SLUGS = ["expat", "ticinese", "corporate", "visitor"] as const;

const Home = () => {
  const { t } = useTranslation();
  const proofPoints = t("home.proof", { returnObjects: true }) as Record<
    string,
    { label: string; value: string }
  >;

  const personaTiles = PERSONA_SLUGS.map((slug) => ({
    slug,
    slot: PAGE_HEROES[slug as keyof typeof PAGE_HEROES],
    kicker: t(`whoWeServe.personas.${slug}.kicker`),
    title: t(`whoWeServe.personas.${slug}.title`),
  }));

  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <BrandImage id={PAGE_HEROES.home} priority className="w-full h-full object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-overlay" />
        </div>

        <div className="relative container min-h-[80vh] flex flex-col justify-end py-24">
          <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-champagne">
            {t("home.eyebrow")}
          </p>
          <h1 className="mt-4 font-serif text-4xl md:text-6xl lg:text-7xl font-light text-background max-w-3xl">
            {t("home.headline")}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-background/90 max-w-2xl">
            {t("home.subheadline")}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary-deep text-primary-foreground">
              <Link to="/contact">{t("cta.speakSpecialist")}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-background/40 text-background bg-transparent hover:bg-background/10"
            >
              <Link to="/services">{t("cta.exploreServices")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Proof points */}
      <section className="bg-background">
        <div className="container py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
          {Object.entries(proofPoints).map(([key, point]) => (
            <div key={key}>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
                {point.label}
              </p>
              <p className="mt-2 font-serif text-2xl font-light text-foreground">
                {point.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial band 1 — services entry */}
      <section className="bg-linen">
        <div className="container py-20 grid md:grid-cols-2 gap-10 items-center">
          <BrandImage id={HOME_EDITORIAL.one} className="w-full rounded-lg overflow-hidden" />
          <div>
            <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              {t("services.eyebrow")}
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl font-normal text-foreground">
              {t("services.headline")}
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">{t("services.intro")}</p>
            <Button asChild variant="link" className="mt-6 px-0 text-primary-deep">
              <Link to="/services">{t("cta.exploreServices")} →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Signature — the concierge note */}
      <section className="bg-background">
        <div className="container py-20 grid md:grid-cols-2 gap-10 items-center">
          <div className="md:order-2">
            <BrandImage image={byId(9)} className="w-full rounded-lg overflow-hidden" />
          </div>
          <div className="md:order-1">
            <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              {t("home.signature.eyebrow")}
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl font-normal text-foreground">
              {t("home.signature.headline")}
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              {t("home.signature.body")}
            </p>
          </div>
        </div>
      </section>

      {/* Who we serve — persona tiles */}
      <section className="bg-linen">
        <div className="container py-20">
          <div className="max-w-3xl">
            <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              {t("home.whoWeServe.eyebrow")}
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl font-normal text-foreground">
              {t("home.whoWeServe.headline")}
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              {t("home.whoWeServe.intro")}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {personaTiles.map((p) => (
              <Link to={`/${p.slug}`} key={p.slug} className="group">
                <div className="overflow-hidden rounded-lg">
                  <BrandImage
                    id={p.slot}
                    className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
                  {p.kicker}
                </p>
                <h3 className="mt-1 font-serif text-lg font-normal text-foreground group-hover:text-primary-deep transition-colors">
                  {p.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial band 2 — about entry */}
      <section className="bg-background">
        <div className="container py-20 grid md:grid-cols-2 gap-10 items-center">
          <BrandImage id={HOME_EDITORIAL.two} className="w-full rounded-lg overflow-hidden" />
          <div>
            <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              {t("about.eyebrow")}
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl font-normal text-foreground">
              {t("about.headline")}
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">{t("about.intro")}</p>
            <Button asChild variant="link" className="mt-6 px-0 text-primary-deep">
              <Link to="/about">{t("cta.readOurStory")} →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Midsummer signature */}
      <section className="bg-linen">
        <div className="container py-20 grid md:grid-cols-2 gap-10 items-center">
          <div className="md:order-2">
            <BrandImage id={SEASONAL_BANK.midsummerTerrace} className="w-full rounded-lg overflow-hidden" />
          </div>
          <div className="md:order-1">
            <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              {t("home.midsummer.eyebrow")}
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl font-normal text-foreground">
              {t("home.midsummer.headline")}
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              {t("home.midsummer.body")}
            </p>
          </div>
        </div>
      </section>

      {/* Winter signature */}
      <section className="bg-background">
        <div className="container py-20 grid md:grid-cols-2 gap-10 items-center">
          <BrandImage id={SEASONAL_BANK.winterHearth} className="w-full rounded-lg overflow-hidden" />
          <div>
            <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              {t("home.winter.eyebrow")}
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl font-normal text-foreground">
              {t("home.winter.headline")}
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              {t("home.winter.body")}
            </p>
            <Button asChild variant="link" className="mt-6 px-0 text-primary-deep">
              <Link to="/cool-calm">{t("cta.readCoolCalm")} →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Cool CALM full-bleed close */}
      <section className="relative h-[60vh] overflow-hidden">
        <BrandImage id={PAGE_HEROES.coolCalm} className="absolute inset-0 w-full h-full object-cover" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/30 to-transparent" />
        <div className="relative container h-full flex flex-col justify-end pb-16">
          <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-champagne">
            {t("home.coolCalmEntry.eyebrow")}
          </p>
          <h2 className="mt-3 font-serif text-3xl md:text-5xl font-light text-background max-w-2xl">
            {t("home.coolCalmEntry.headline")}
          </h2>
          <div className="mt-8">
            <Button asChild variant="outline" size="lg" className="rounded-full border-background/60 text-background bg-transparent hover:bg-background/10">
              <Link to="/cool-calm">{t("cta.enterCoolCalm")} →</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
