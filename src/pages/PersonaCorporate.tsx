import { useTranslation } from "react-i18next";
import { BrandImage } from "@/components/brand/BrandImage";
import { PAGE_HEROES, PERSONA_EDITORIAL, byId } from "@/brand/imagery";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PersonaCorporate = () => {
  const { t } = useTranslation();
  return (
    <>
      <section className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <BrandImage id={PAGE_HEROES.corporate} priority className="w-full h-full object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-overlay" />
        </div>
        <div className="relative container min-h-[60vh] flex flex-col justify-end py-20">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-champagne">
            {t("personas.corporate.kicker")}
          </p>
          <h1 className="mt-3 font-serif text-4xl md:text-6xl font-light text-background max-w-3xl">
            {t("personas.corporate.headline")}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-background/90 max-w-2xl">
            {t("personas.corporate.subhead")}
          </p>
        </div>
      </section>

      <section className="container py-20 max-w-3xl">
        <p className="text-lg text-foreground/85 leading-relaxed">
          {t("personas.corporate.intro1")}
        </p>
        <p className="mt-6 text-lg text-foreground/85 leading-relaxed">
          {t("personas.corporate.intro2")}
        </p>
      </section>

      <section className="bg-linen">
        <div className="container py-20 grid md:grid-cols-2 gap-10 items-center">
          <BrandImage id={PERSONA_EDITORIAL.corporate} className="w-full rounded-lg overflow-hidden" />
          <div>
            <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              {t("personas.corporate.boardroom.eyebrow")}
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl font-normal text-foreground">
              {t("personas.corporate.boardroom.headline")}
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              {t("personas.corporate.boardroom.body")}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="container py-20 grid md:grid-cols-2 gap-10 items-center">
          <div className="md:order-2">
            <BrandImage image={byId(2)} className="w-full rounded-lg overflow-hidden" />
          </div>
          <div className="md:order-1">
            <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              {t("personas.corporate.kerb.eyebrow")}
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl font-normal text-foreground">
              {t("personas.corporate.kerb.headline")}
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              {t("personas.corporate.kerb.body")}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-linen">
        <div className="container py-20 grid md:grid-cols-2 gap-10 items-center">
          <BrandImage image={byId(4)} className="w-full rounded-lg overflow-hidden" />
          <div>
            <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              {t("personas.corporate.breakfast.eyebrow")}
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl font-normal text-foreground">
              {t("personas.corporate.breakfast.headline")}
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              {t("personas.corporate.breakfast.body")}
            </p>
            <Button asChild className="mt-8 rounded-full bg-primary hover:bg-primary-deep text-primary-foreground">
              <Link to="/contact">{t("cta.briefOnArrival")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default PersonaCorporate;
