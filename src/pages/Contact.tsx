import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { BrandImage } from "@/components/brand/BrandImage";
import { PAGE_HEROES, CONTACT_EDITORIAL, SEASONAL_BANK } from "@/brand/imagery";
import { brand } from "@/brand/config";
import { supabase } from "@/integrations/supabase/client";
import {
  useDocumentMeta,
  canonical,
  ORGANIZATION_JSONLD,
  LOCALBUSINESS_JSONLD,
} from "@/lib/useDocumentMeta";

type SubmitState = "idle" | "submitting" | "success" | "error";

const Contact = () => {
  useDocumentMeta({
    title: "Contact — Open a quiet conversation | U-CALM Concierge",
    description:
      "Write to the U-CALM concierge desk in Lugano. A named specialist responds within the working day, in the language you wrote to us in. Twenty-four hours, three-hundred-and-sixty-five days. hello@u-calm.com.",
    canonical: canonical("/contact"),
    jsonLd: [
      ORGANIZATION_JSONLD,
      LOCALBUSINESS_JSONLD,
      {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        url: "https://u-calm.com/contact",
        about: { "@id": "https://u-calm.com/#desk" },
      },
    ],
  });

  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setState("submitting");
    setErrorMsg("");

    const { error } = await supabase.from("contact_inquiries").insert({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    if (error) {
      setState("error");
      setErrorMsg(error.message);
      return;
    }

    setState("success");
    setName("");
    setEmail("");
    setMessage("");
  };

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

        {state === "success" ? (
          <div className="mt-10 rounded-lg border border-border bg-card p-8 shadow-whisper">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-champagne">
              {t("contact.form.success.eyebrow")}
            </p>
            <p className="mt-3 font-serif text-2xl text-primary-deep">
              {t("contact.form.success.headline")}
            </p>
            <p className="mt-3 text-foreground/80 leading-relaxed">
              {t("contact.form.success.body")}
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10 rounded-lg border border-border bg-card p-8 shadow-whisper space-y-6"
          >
            <div>
              <label htmlFor="contact-name" className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground block">
                {t("contact.form.name")}
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={state === "submitting"}
                className="mt-2 w-full rounded border border-border bg-background px-4 py-3 text-foreground focus:border-primary-deep focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground block">
                {t("contact.form.email")}
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={state === "submitting"}
                className="mt-2 w-full rounded border border-border bg-background px-4 py-3 text-foreground focus:border-primary-deep focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground block">
                {t("contact.form.message")}
              </label>
              <textarea
                id="contact-message"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={state === "submitting"}
                className="mt-2 w-full rounded border border-border bg-background px-4 py-3 text-foreground focus:border-primary-deep focus:outline-none"
              />
            </div>

            {state === "error" && (
              <p className="text-sm text-destructive">
                {t("contact.form.error", { errorMsg, email: brand.inquiryEmail })}
              </p>
            )}

            <button
              type="submit"
              disabled={state === "submitting"}
              className="rounded-full bg-primary-deep px-8 py-3 text-background font-medium hover:bg-primary transition-colors disabled:opacity-60"
            >
              {state === "submitting" ? t("contact.form.sending") : t("cta.openConversation")}
            </button>
          </form>
        )}
      </section>

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
