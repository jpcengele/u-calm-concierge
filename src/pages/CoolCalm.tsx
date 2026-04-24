import { useTranslation } from "react-i18next";
import { BrandImage } from "@/components/brand/BrandImage";
import { byId, PAGE_HEROES, SERVICES_SCENES, SEASONAL_BANK } from "@/brand/imagery";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CoolCalm = () => {
  const { t } = useTranslation();
  return (
    <>
      <section className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <BrandImage id={PAGE_HEROES.coolCalm} priority className="w-full h-full object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-overlay" />
        </div>
        <div className="relative container min-h-[60vh] flex flex-col justify-end py-20">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-champagne">
            {t("coolCalm.eyebrow")}
          </p>
          <h1 className="mt-3 font-serif text-4xl md:text-6xl font-light text-background max-w-3xl">
            {t("coolCalm.headline")}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-background/90 max-w-2xl">
            {t("coolCalm.subheadline")}
          </p>
        </div>
      </section>

      <section className="container py-20 max-w-3xl">
        <p className="text-lg text-foreground/85 leading-relaxed">
          {t("coolCalm.intro")}
        </p>
      </section>

      {/* Chalet kept */}
      <section className="bg-linen">
        <div className="container py-20 grid md:grid-cols-2 gap-10 items-center">
          <BrandImage image={byId(7)} className="w-full rounded-lg overflow-hidden" />
          <div>
            <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              {t("coolCalm.chaletKept.eyebrow")}
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl font-normal text-foreground">
              {t("coolCalm.chaletKept.headline")}
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              {t("coolCalm.chaletKept.body")}
            </p>
          </div>
        </div>
      </section>

      {/* Mountain habit */}
      <section className="bg-background">
        <div className="container py-20 grid md:grid-cols-2 gap-10 items-center">
          <div className="md:order-2">
            <BrandImage id={SERVICES_SCENES.coolCalm} className="w-full rounded-lg overflow-hidden" />
          </div>
          <div className="md:order-1">
            <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              {t("coolCalm.mountainHabit.eyebrow")}
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl font-normal text-foreground">
              {t("coolCalm.mountainHabit.headline")}
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              {t("coolCalm.mountainHabit.body")}
            </p>
          </div>
        </div>
      </section>

      {/* Off-season */}
      <section className="bg-linen">
        <div className="container py-20 grid md:grid-cols-2 gap-10 items-center">
          <BrandImage id={SEASONAL_BANK.summerBlueHour} className="w-full rounded-lg overflow-hidden" />
          <div>
            <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              {t("coolCalm.offSeason.eyebrow")}
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl font-normal text-foreground">
              {t("coolCalm.offSeason.headline")}
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              {t("coolCalm.offSeason.body")}
            </p>
          </div>
        </div>
      </section>

      {/* Closing full-bleed */}
      <section className="relative h-[70vh] overflow-hidden">
        <BrandImage id={SEASONAL_BANK.winterHearth} className="absolute inset-0 w-full h-full object-cover" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/30 to-transparent" />
        <div className="relative container h-full flex flex-col justify-end pb-16">
          <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-champagne">
            {t("coolCalm.closing.eyebrow")}
          </p>
          <h2 className="mt-3 font-serif text-3xl md:text-5xl font-light text-background max-w-2xl">
            {t("coolCalm.closing.headline")}
          </h2>
          <div className="mt-8">
            <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary-deep text-primary-foreground">
              <Link to="/contact">{t("cta.openCoolCalm")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default CoolCalm;
