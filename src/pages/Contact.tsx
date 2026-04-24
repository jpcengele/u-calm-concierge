import { useTranslation } from "react-i18next";
import { BrandImage } from "@/components/brand/BrandImage";
import { PAGE_HEROES, CONTACT_EDITORIAL, SEASONAL_BANK } from "@/brand/imagery";
import { brand } from "@/brand/config";

const Contact = () => {
  const { t } = useTranslation();
  return (
    <>
      <section className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <BrandImage id={PAGE_HEROES.contact} priority className="w-full h-full object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-overlay" />
        </div>
        <div className="relative container min-h-[50vh] flex flex-col justify-end py-20">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-champagne">
            {t("contact.eyebrow")}
          </p>
          <h1 className="mt-3 font-serif text-4xl md:text-6xl font-light text-background">
            {t("contact.headline")}
          </h1>
        </div>
      </section>

      {/* Opening — spring magnolia */}
      <section className="bg-linen">
        <div className="container py-20 grid md:grid-cols-2 gap-10 items-center">
          <BrandImage id={SEASONAL_BANK.springMagnolia} className="w-full rounded-lg overflow-hidden" />
          <div>
            <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              {t("contact.opening.eyebrow")}
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl font-normal text-foreground">
              {t("contact.opening.headline")}
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              {t("contact.opening.body")}
            </p>
          </div>
        </div>
      </section>

      <section className="container py-20 max-w-2xl">
        <p className="text-lg text-foreground/85 leading-relaxed">{t("contact.intro")}</p>

        <div className="mt-10 rounded-lg border border-border bg-card p-8 shadow-whisper">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
            {t("contact.emailLabel")}
          </p>
          <a
            href={`mailto:${brand.inquiryEmail}`}
            className="mt-2 block font-serif text-2xl text-primary-deep hover:text-primary transition-colors"
          >
            {brand.inquiryEmail}
          </a>
        </div>

        <p className="mt-8 italic text-muted-foreground text-sm">
          {t("contact.placeholder")}
        </p>
      </section>

      {/* First conversation */}
      <section className="bg-background">
        <div className="container py-20 grid md:grid-cols-2 gap-10 items-center">
          <div className="md:order-2">
            <BrandImage id={CONTACT_EDITORIAL.one} className="w-full rounded-lg overflow-hidden" />
          </div>
          <div className="md:order-1">
            <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              {t("contact.firstConversation.eyebrow")}
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl font-normal text-foreground">
              {t("contact.firstConversation.headline")}
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              {t("contact.firstConversation.body")}
            </p>
          </div>
        </div>
      </section>

      {/* Closing — returning home */}
      <section className="bg-linen">
        <div className="container py-20 grid md:grid-cols-2 gap-10 items-center">
          <BrandImage id={SEASONAL_BANK.returningHome} className="w-full rounded-lg overflow-hidden" />
          <div>
            <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              {t("contact.closing.eyebrow")}
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl font-normal text-foreground">
              {t("contact.closing.headline")}
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              {t("contact.closing.body")}
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
