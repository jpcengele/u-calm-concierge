/**
 * U-CALM Concierge — brand facts used across the site.
 * Single source of truth for copy-adjacent identity data.
 */

export const brand = {
  name: "U-CALM Concierge",
  shortName: "U-CALM",
  /** Primary strapline — the acronym expansion (above "Consider it done."). */
  expansion: "Ultimate Concierge and Lifestyle Management",
  /** Supporting tagline — everyday phrase. */
  strapline: "Consider it done.",
  description:
    "U-CALM Concierge is a quiet lifestyle-management house. A named specialist owns your account; nothing is shouted, everything is handled.",
  domain: "u-calm.com",
  canonicalUrl: "https://u-calm.com/",
  inquiryEmail: "hello@u-calm.com",
  privacyEmail: "privacy@u-calm.com",
  transactionalFromEmail: "hello@u-calm.com",

  /** Offices — fill in as the brand launches. */
  offices: [] as Array<{ city: string; country: string }>,

  /** Primary brand colour (hex) — used in meta theme-color and elsewhere. */
  primaryHex: "#3BB5C7",

  /** Supabase project ref — Stage 3 fills this in. */
  supabaseProjectRef: null as string | null,

  /** The acronym spelled out — for surfaces that want the letter-by-letter reveal. */
  acronym: [
    { letter: "U", word: "Ultimate" },
    { letter: "C", word: "Concierge" },
    { letter: "A", word: "And" },
    { letter: "L", word: "Lifestyle" },
    { letter: "M", word: "Management" },
  ] as const,
} as const;

export type BrandConfig = typeof brand;
