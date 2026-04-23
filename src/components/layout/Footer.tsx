import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { brand } from "@/brand/config";

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-linen mt-16">
      <div className="container py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <p className="font-serif italic text-lg text-foreground">{t("footer.tagline")}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("footer.rights", { year })}
          </p>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href={`mailto:${brand.inquiryEmail}`} className="hover:text-foreground transition-colors">
            {brand.inquiryEmail}
          </a>
          <Link to="/contact" className="hover:text-foreground transition-colors">
            {t("nav.contact")}
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
