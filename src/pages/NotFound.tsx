import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <section className="container py-24 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">404</p>
      <h1 className="mt-4 font-serif text-4xl font-light text-foreground">{t("notFound.title")}</h1>
      <p className="mt-4 text-foreground/80">{t("notFound.body")}</p>
      <Button asChild className="mt-8 rounded-full">
        <Link to="/">{t("notFound.back")}</Link>
      </Button>
    </section>
  );
};

export default NotFound;
