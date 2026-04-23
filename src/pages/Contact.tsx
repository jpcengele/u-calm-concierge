import { useTranslation } from "react-i18next";
import { BrandImage } from "@/components/brand/BrandImage";
import { PAGE_HEROES } from "@/brand/imagery";
import { brand } from "@/brand/config";

/**
 * Contact page — Stage 3 will wire the inquiry form to
 * supabase.functions.invoke("submit-contact"). Until then this page
 * surfaces the inquiry email directly.
 */
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
    </>
  );
};

export default Contact;
