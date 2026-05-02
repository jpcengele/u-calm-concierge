import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { BrandImage } from "@/components/brand/BrandImage";
import { PAGE_HEROES, CONTACT_EDITORIAL, SEASONAL_BANK } from "@/brand/imagery";
import { brand } from "@/brand/config";
import { supabase } from "@/integrations/supabase/client";

type SubmitState = "idle" | "submitting" | "success" | "error";

const Contact = () => {
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
              08:40, mid-March
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl font-normal text-foreground">
              The door just opens. The conversation begins.
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              A pale magnolia bud on a bare branch, the Serene Teal threshold catching first light. Members come to U-CALM at the moment their list feels heaviest, and leave the first call with it already shorter.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-20 max-w-2xl">
        <p className="text-lg text-foreground/85 leading-relaxed">{t("contact.intro")}</p>

        {/* Deploy verification stamp — remove after staging cycle proven. */}
        <p className="mt-2 text-xs text-muted-foreground font-mono">
          build: 2026-05-02 · state: {state}
        </p>

        {state === "success" ? (
          <div className="mt-10 rounded-lg border border-border bg-card p-8 shadow-whisper">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-champagne">
              Thank you
            </p>
            <p className="mt-3 font-serif text-2xl text-primary-deep">
              We will be in touch.
            </p>
            <p className="mt-3 text-foreground/80 leading-relaxed">
              Your note has been received. A specialist will respond within one working day.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10 rounded-lg border border-border bg-card p-8 shadow-whisper space-y-6"
          >
            <div>
              <label htmlFor="contact-name" className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground block">
                Name
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
                Email
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
                What can we close on your list?
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
                Something did not go through: {errorMsg}. Please try again, or email {brand.inquiryEmail} directly.
              </p>
            )}

            <button
              type="submit"
              disabled={state === "submitting"}
              className="rounded-full bg-primary-deep px-8 py-3 text-background font-medium hover:bg-primary transition-colors disabled:opacity-60"
            >
              {state === "submitting" ? "Sending..." : "Open a conversation"}
            </button>
          </form>
        )}

        <p className="mt-8 italic text-muted-foreground text-sm">
          {t("contact.placeholder")}
        </p>
      </section>

      <section className="bg-background">
        <div className="container py-20 grid md:grid-cols-2 gap-10 items-center">
          <div className="md:order-2">
            <BrandImage id={CONTACT_EDITORIAL.one} className="w-full rounded-lg overflow-hidden" />
          </div>
          <div className="md:order-1">
            <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              How we start
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl font-normal text-foreground">
              One door, one notebook, one quiet conversation.
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              We start with a 30-minute call. You tell us what has been on your list for too long. We tell you how we would close it. Nothing is rushed; nothing is promised we cannot keep.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-linen">
        <div className="container py-20 grid md:grid-cols-2 gap-10 items-center">
          <BrandImage id={SEASONAL_BANK.returningHome} className="w-full rounded-lg overflow-hidden" />
          <div>
            <p className="eyebrow text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              18:30, early November
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl font-normal text-foreground">
              Shoulders, a millimetre.
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              The test of this whole house: when a member steps through the door at dusk and sees the apartment already warm, the lamps lit, the quiet note on the console; do their shoulders lower a millimetre? If they do, we have done our job.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
