import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { BrandImage } from "@/components/brand/BrandImage";
import { PAGE_HEROES, HOME_EDITORIAL } from "@/brand/imagery";
import { Button } from "@/components/ui/button";

const Home = () => {
  const { t } = useTranslation();
  const proofPoints = t("home.proof", { returnObjects: true }) as Record<
    string,
    { label: string; value: string }
  >;

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

      {/* Editorial band */}
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
    </>
  );
};

export default Home;
