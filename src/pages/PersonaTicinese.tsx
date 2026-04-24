import { useTranslation } from "react-i18next";
import { BrandImage } from "@/components/brand/BrandImage";
import { PAGE_HEROES, PERSONA_EDITORIAL, SEASONAL_BANK } from "@/brand/imagery";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PersonaTicinese = () => {
  const { t } = useTranslation();
  return (
    <>
      <section className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <BrandImage id={PAGE_HEROES.ticinese} priority className="w-full h-full object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-overlay" />
        </div>
        <div className="relative container min-h-[60vh] flex flex-col justify-end py-20">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-champagne">
            {t("personas.ticinese.kicker")}
          </p>
          <h1 className="mt-3 font-serif text-4xl md:text-6xl font-light text-background max-w-3xl">
            {t("personas.ticinese.headline")}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-background/90 max-w-2xl">
            {t("personas.ticinese.subhead")}
          </p>
        </div>
      </section>

      <section className="container py-20 max-w-3xl">
        <p className="text-lg text-foreground/85 leading-relaxed">
          {t("personas.ticinese.intro1")}
        </p>
        <p className="mt-6 text-lg text-foreground/85 leading-relaxed">
          {t("personas.ticinese.intro2")}
        </p>
      </section>

      <section className="bg-linen">
        <div className="container py-20 grid md:grid-cols-2 gap-10 items-center">
          <div className="md:order-2">
            <BrandImage id={PERSONA_EDITORIAL.ticinese} className="w-full rounded-lg overflow-hidden" />
          </div>
          <div className="md:order-1">
            <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              {t("personas.ticinese.gandria.eyebrow")}
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl font-normal text-foreground">
              {t("personas.ticinese.gandria.headline")}
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              {t("personas.ticinese.gandria.body")}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="container py-20 grid md:grid-cols-2 gap-10 items-center">
          <BrandImage id={SEASONAL_BANK.autumnCatChair} className="w-full rounded-lg overflow-hidden" />
          <div>
            <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              {t("personas.ticinese.nonnaRoom.eyebrow")}
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl font-normal text-foreground">
              {t("personas.ticinese.nonnaRoom.headline")}
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              {t("personas.ticinese.nonnaRoom.body")}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-linen">
        <div className="container py-20 grid md:grid-cols-2 gap-10 items-center">
          <div className="md:order-2">
            <BrandImage id={SEASONAL_BANK.autumnLurcherWalk} className="w-full rounded-lg overflow-hidden" />
          </div>
          <div className="md:order-1">
            <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              {t("personas.ticinese.cobbles.eyebrow")}
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl font-normal text-foreground">
              {t("personas.ticinese.cobbles.headline")}
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              {t("personas.ticinese.cobbles.body")}
            </p>
            <Button asChild className="mt-8 rounded-full bg-primary hover:bg-primary-deep text-primary-foreground">
              <Link to="/contact">{t("cta.openConversation")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default PersonaTicinese;
