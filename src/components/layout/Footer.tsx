import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { brand } from "@/brand/config";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24">
      {/* Strapline band — acronym expansion, every page */}
      <section className="bg-navy text-background">
        <div className="container py-20 md:py-28 text-center">
          <p className="eyebrow text-xs font-bold uppercase tracking-[0.25em] text-champagne">
            {brand.shortName}
          </p>

          <div className="mt-10 flex flex-row flex-nowrap items-baseline justify-center gap-x-3 md:gap-x-5 lg:gap-x-8 overflow-x-auto">
            {brand.acronym.map((item) => (
              <div key={item.letter} className="flex items-baseline font-serif font-light whitespace-nowrap">
                <span className="text-primary leading-none text-[2rem] sm:text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem]">
                  {item.letter}
                </span>
                <span className="text-champagne leading-none text-xs sm:text-sm md:text-base lg:text-lg lowercase tracking-tight">
                  {item.word.slice(1)}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-12 font-serif italic text-xl md:text-2xl text-background/90">
            {t("brand.strapline")}
          </p>

          <p className="mt-8 max-w-xl mx-auto text-background/75 leading-relaxed">
            {t("footer.description")}
          </p>

          <div className="mt-10">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-primary hover:bg-primary-deep text-primary-foreground"
            >
              <Link to="/contact">{t("cta.speakSpecialist")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Legal & contact strip */}
      <div className="border-t border-border bg-linen">
        <div className="container py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img src="/brand/logo-header.png" alt={brand.shortName} className="h-12 w-auto" />
            <div>
              <p className="font-serif italic text-foreground">
                {brand.expansion}.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("footer.rights", { year })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a
              href={`mailto:${brand.inquiryEmail}`}
              className="hover:text-foreground transition-colors"
            >
              {brand.inquiryEmail}
            </a>
            <Link to="/services-in-full" className="hover:text-foreground transition-colors">
              {t("footer.servicesInFull")}
            </Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">
              {t("nav.contact")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
