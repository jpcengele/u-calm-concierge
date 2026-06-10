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
  /** e.g. "noindex" — omitted on normal pages; any stale tag is removed. */
  robots?: string;
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

    // robots: set when requested (e.g. NotFound noindex), remove otherwise so
    // an SPA navigation away from a noindex page never carries it along.
    const robotsEl = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (meta.robots) {
      setMeta("robots", meta.robots);
    } else if (robotsEl) {
      robotsEl.remove();
    }

    setMeta("og:title", meta.title, true);
    setMeta("og:description", meta.description, true);
    setMeta("og:url", meta.canonical, true);
    setMeta("og:type", ogType, true);
    setMeta("og:site_name", SITE_NAME, true);
    setMeta("og:image", ogImage, true);
    setMeta("og:image:alt", meta.title, true);

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
  }, [meta.title, meta.description, meta.canonical, meta.ogImage, meta.ogType, meta.robots]);
}

export function canonical(path: string): string {
  const trimmed = path.startsWith("/") ? path : `/${path}`;
  return `https://u-calm.com${trimmed === "/" ? "/" : trimmed}`;
}

/** Common JSON-LD blocks shared across multiple Concierge pages. */
export const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://u-calm.com/#org",
  name: "U-CALM Concierge",
  legalName: "U-CALM",
  alternateName: ["U-CALM", "U Calm Concierge"],
  url: "https://u-calm.com",
  logo: "https://u-calm.com/brand/logo.png",
  foundingDate: "2013",
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
  foundingDate: "2013",
  parentOrganization: { "@id": "https://u-calm.com/#org" },
  description:
    "Lifestyle management and concierge services from Lugano, Switzerland. Held in English, Italian, French, German.",
  areaServed: [
    { "@type": "City", name: "Lugano" },
    { "@type": "City", name: "London" },
    { "@type": "City", name: "Milan" },
    { "@type": "Place", name: "Switzerland" },
    { "@type": "Place", name: "Europe" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lugano",
    addressRegion: "Ticino",
    addressCountry: "CH",
  },
  geo: { "@type": "GeoCoordinates", latitude: 46.0037, longitude: 8.9511 },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Inquiries",
    email: "hello@u-calm.com",
    availableLanguage: ["English", "Italian", "French", "German"],
  },
  sameAs: ["https://u-calmaviation.com"],
} as const;

/** The Arrival settlement mandate, as a Service entity (page: /arrival). */
export const ARRIVAL_SERVICE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://u-calm.com/arrival#service",
  name: "U-CALM Arrival",
  serviceType: "Relocation and settlement coordination",
  url: "https://u-calm.com/arrival",
  provider: { "@id": "https://u-calm.com/#desk" },
  areaServed: [
    { "@type": "City", name: "Lugano" },
    { "@type": "Place", name: "Ticino, Switzerland" },
  ],
  availableLanguage: ["English", "Italian", "French", "German"],
  description:
    "A fixed-scope settlement mandate for families moving to Lugano and Ticino: residence permits coordinated, comune registration, home-finding and a prepared first night, health-insurance enrolment, school placement, and the fiscal liaison kept in step with vetted independent advisers. One named specialist holds the whole file. U-CALM does not provide tax, legal or immigration advice.",
} as const;

/** The six service families, as an offer catalogue (page: /services-in-full). */
export const SERVICES_OFFERCATALOG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  "@id": "https://u-calm.com/services-in-full#catalogue",
  name: "U-CALM Concierge — the services, in full",
  url: "https://u-calm.com/services-in-full",
  provider: { "@id": "https://u-calm.com/#desk" },
  itemListElement: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Days and errands", description: "Errands run, queues stood, collections signed for, appointments made and kept, reservations held, information found and checked." } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "House and household", description: "Home management through days and absences: maintenance and trades, household staff, deliveries, wardrobe, the seasonal turn of a house, the paperwork year kept in order." } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Family and care", description: "School liaison through the years, tutors placed, milestones built quietly, care for elders, children's logistics, the pets." } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Arrival and relocations", description: "A fixed-scope settlement mandate for families arriving in Ticino — permits, the comune, home-finding, health insurance, schools, the fiscal liaison, belonging.", url: "https://u-calm.com/arrival" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Business days", description: "Meetings landed with rooms, cars and timing aligned; visiting colleagues hosted; introductions made; key people relocated with the same care as families." } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Travel, tables and the corridor", description: "Journeys planned end-to-end; tables and celebrations held; for families living between Lugano, Milan and London, one continuous file — with private aviation through U-Calm Aviation." } },
  ],
} as const;
