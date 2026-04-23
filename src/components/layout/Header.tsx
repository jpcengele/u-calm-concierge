import { NavLink, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Menu } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { to: "/",         label: t("nav.home") },
    { to: "/services", label: t("nav.services") },
    { to: "/about",    label: t("nav.about") },
    { to: "/contact",  label: t("nav.contact") },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-serif text-2xl font-light text-primary-deep tracking-tight">U</span>
          <span className="font-sans text-xs uppercase tracking-[0.2em] text-foreground">
            {t("brand.shortName")} · Concierge
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `text-sm tracking-wide transition-colors ${
                  isActive ? "text-primary-deep" : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-6">
          <LanguageSwitcher />
          <Button
            asChild
            variant="default"
            className="rounded-full bg-primary hover:bg-primary-deep text-primary-foreground"
          >
            <Link to="/contact">{t("cta.speakSpecialist")}</Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation">
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
    </header>
  );
};

export default Header;
