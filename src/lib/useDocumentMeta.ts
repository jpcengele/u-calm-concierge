import { useEffect } from "react";

/**
 * Per-page SEO meta — lightweight, no helmet-async dependency.
 * Mirrors the U-Calm Aviation pattern, tailored for U-CALM Concierge.
 *
 * Mutates the document <head> on mount. Sufficient for an SPA on
 * Cloudflare Pages where Googlebot evaluates JS before indexing.
 *
 * Usage:
 *   useDocumentMeta({
 *     title: "Services — U-CALM Concierge",
 *     description: "Six channels of considered concierge work…",
 *     canonical: "https://u-calm.com/services",
 *   });
 */
export interface DocumentMeta {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  ogType?: "website" | "article" | "profile";
  jsonLd?: object | readonly object[];
}

const DEFAULT_OG_IMAGE = "https://u-calm.com/og/default.png";
const SITE_NAME = "U-CALM Concierge";

const JSONLD_ATTR = "data-ucalm-jsonld";
const META_ATTR = "data-ucalm-meta";

function setMeta(name: string, content: string, byProperty = false) {
  const selector = byProperty
    ? `meta[property="${name}"]`
    : `meta[name="${name}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    if (byProperty) el.setAttribute("property", name);
    else el.setAttribute("name", name);
    el.setAttribute(META_ATTR, "true");
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    el.setAttribute(META_ATTR, "true");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function useDocumentMeta(meta: DocumentMeta): void {
  useEffect(() => {
    const ogImage = meta.ogImage ?? DEFAULT_OG_IMAGE;
    const ogType = meta.ogType ?? "website";

    document.title = meta.title;
    setMeta("description", meta.description);
    setLink("canonical", meta.canonical);

    setMeta("og:title", meta.title, true);
    setMeta("og:description", meta.description, true);
    setMeta("og:url", meta.canonical, true);
    setMeta("og:type", ogType, true);
    setMeta("og:site_name", SITE_NAME, true);
    setMeta("og:image", ogImage, true);
    setMeta("og:image:alt", `${SITE_NAME} — ${meta.title}`, true);

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", meta.title);
    setMeta("twitter:description", meta.description);
    setMeta("twitter:image", ogImage);

    const previous = document.head.querySelectorAll(`script[${JSONLD_ATTR}]`);
    previous.forEach((node) => node.remove());

    if (meta.jsonLd) {
      const blocks = Array.isArray(meta.jsonLd) ? meta.jsonLd : [meta.jsonLd];
      blocks.forEach((block) => {
        const script = document.createElement("script");
        script.setAttribute("type", "application/ld+json");
        script.setAttribute(JSONLD_ATTR, "true");
        script.textContent = JSON.stringify(block);
        document.head.appendChild(script);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.title, meta.description, meta.canonical, meta.ogImage, meta.ogType]);
}

export function canonical(path: string): string {
  const trimmed = path.startsWith("/") ? path : `/${path}`;
  return `https://u-calm.com${trimmed === "/" ? "/" : trimmed}`;
}

/** Common JSON-LD blocks shared across multiple Concierge pages. */
export const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "U-CALM Concierge",
  legalName: "U-CALM",
  alternateName: ["U-CALM", "U Calm Concierge"],
  url: "https://u-calm.com",
  logo: "https://u-calm.com/brand/logo.png",
  description:
    "U-CALM Concierge is a lifestyle-management and concierge house. Considered, thorough, quietly arranged. Sister-brand to U-Calm Aviation; serves members across Europe.",
  email: "hello@u-calm.com",
  areaServed: ["Switzerland", "United Kingdom", "Italy", "Europe", "Worldwide"],
  knowsLanguage: ["en", "it", "fr", "de"],
  sameAs: ["https://u-calmaviation.com"],
} as const;

export const LOCALBUSINESS_JSONLD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://u-calm.com/#desk",
  name: "U-CALM Concierge",
  url: "https://u-calm.com",
  image: "https://u-calm.com/brand/logo.png",
  email: "hello@u-calm.com",
  description:
    "Lifestyle management and concierge services from Lugano, Switzerland. Held in English, Italian, French, German.",
  areaServed: [
    { "@type": "City", name: "Lugano" },
    { "@type": "City", name: "London" },
    { "@type": "Place", name: "Switzerland" },
    { "@type": "Place", name: "Europe" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lugano",
    addressCountry: "CH",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Inquiries",
    email: "hello@u-calm.com",
    availableLanguage: ["English", "Italian", "French", "German"],
  },
} as const;
