import { NavLink, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Menu } from "lucide-react";
import { useState } from "react";
import { brand } from "@/brand/config";

const Header = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { to: "/",              label: t("nav.home") },
    { to: "/services",      label: t("nav.services") },
    { to: "/arrival",       label: t("nav.arrival") },
    { to: "/who-we-serve",  label: t("nav.whoWeServe") },
    { to: "/cool-calm",     label: t("nav.coolCalm") },
    { to: "/about",         label: t("nav.about") },
    { to: "/contact",       label: t("nav.contact") },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur">
      <div className="container flex h-40 items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center"
          aria-label={`${brand.shortName} — ${brand.expansion}`}
        >
          <img
            src="/brand/logo-header.png"
            alt={`${brand.shortName} — ${brand.expansion}`}
            className="h-32 w-auto"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `text-sm tracking-wide transition-colors whitespace-nowrap ${
                  isActive ? "text-primary-deep" : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <LanguageSwitcher />
          <Button
            asChild
            variant="default"
            className="rounded-full bg-primary hover:bg-primary-deep text-primary-foreground whitespace-nowrap"
          >
            <Link to="/contact">{t("cta.speakSpecialist")}</Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label={t("nav.home")}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <nav className="mt-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `text-base ${isActive ? "text-primary-deep" : "text-foreground"}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="mt-4">
                <LanguageSwitcher />
              </div>
              <Button asChild className="mt-4 rounded-full">
                <Link to="/contact" onClick={() => setOpen(false)}>
                  {t("cta.speakSpecialist")}
                </Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Strapline strip — the acronym expansion, persistent on every page */}
      <div className="border-t border-border/40 bg-background/60">
        <div className="container py-2 text-center">
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-primary-deep">
            Ultimate · Concierge · And · Lifestyle · Management
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
