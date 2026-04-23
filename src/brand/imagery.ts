/**
 * U-CALM Concierge — brand imagery manifest (STUB).
 *
 * Stage 2 fills this in with real prompts and generated image paths. Until
 * then every `src` is a TODO placeholder. `BrandImage` will render a
 * transparent placeholder for TODO entries so the layout still lays out
 * correctly and the build passes.
 *
 * Pattern: one typed entry per slot. Components reference slots by id
 * (via PAGE_HEROES constants) — they never import the raw array or the
 * filename. That way Stage 2 can swap assets without touching components.
 */

export type BrandAspect = "4:5" | "16:9" | "1:1" | "3:4";

export type BrandImage = {
  id: number;
  section: string;
  slotKey: string;        // stable key used by code (e.g. "home-hero")
  filename: string;       // Stage 2 — final filename under /public/brand/<section>/
  title: string;
  aspect: BrandAspect;
  src: string;            // "TODO:<slotKey>" until Stage 2 fills it
  alt: string;
  enabled: boolean;
};

/** Stage 2 will replace "TODO:<slotKey>" with "/brand/<section>/<filename>". */
const TODO = (slotKey: string) => `TODO:${slotKey}`;

export const BRAND_IMAGES: readonly BrandImage[] = [
  {
    id: 1,
    section: "00-home",
    slotKey: "home-hero",
    filename: "home-hero.jpg",
    title: "Home — hero",
    aspect: "16:9",
    src: TODO("home-hero"),
    alt: "A quiet London morning, a concierge handing a guest their day's plan over breakfast — diverse, mid-conversation, unposed.",
    enabled: false,
  },
  {
    id: 2,
    section: "00-home",
    slotKey: "home-editorial-1",
    filename: "home-editorial-1.jpg",
    title: "Home — editorial moment 1",
    aspect: "4:5",
    src: TODO("home-editorial-1"),
    alt: "A member reviewing an itinerary with their concierge in a sunlit private room — two people, different ages, unposed.",
    enabled: false,
  },
  {
    id: 3,
    section: "00-home",
    slotKey: "home-editorial-2",
    filename: "home-editorial-2.jpg",
    title: "Home — editorial moment 2",
    aspect: "4:5",
    src: TODO("home-editorial-2"),
    alt: "Champagne-toned still life — a pen, an envelope, a neatly folded linen napkin on a walnut table.",
    enabled: false,
  },
  {
    id: 10,
    section: "10-services",
    slotKey: "services-hero",
    filename: "services-hero.jpg",
    title: "Services — hero",
    aspect: "16:9",
    src: TODO("services-hero"),
    alt: "A concierge moving through a quiet lobby with purpose — candid, mid-stride.",
    enabled: false,
  },
  {
    id: 20,
    section: "20-about",
    slotKey: "about-hero",
    filename: "about-hero.jpg",
    title: "About — hero",
    aspect: "16:9",
    src: TODO("about-hero"),
    alt: "A small team in a bright meeting room, three people, different ethnicities, unposed, mid-discussion.",
    enabled: false,
  },
  {
    id: 30,
    section: "30-contact",
    slotKey: "contact-hero",
    filename: "contact-hero.jpg",
    title: "Contact — hero",
    aspect: "16:9",
    src: TODO("contact-hero"),
    alt: "A handwritten note on linen paper beside a porcelain cup of tea — still, quiet, unstaged.",
    enabled: false,
  },
];

/** Stable keys components import — never reference raw ids. */
export const PAGE_HEROES = {
  home:     1,
  services: 10,
  about:    20,
  contact:  30,
} as const;

export const HOME_EDITORIAL = {
  one: 2,
  two: 3,
} as const;

export function byId(id: number): BrandImage {
  const image = BRAND_IMAGES.find((entry) => entry.id === id);
  if (!image) {
    throw new Error(`No brand image found with id ${id}. Check src/brand/imagery.ts.`);
  }
  return image;
}

export function bySection(section: string): readonly BrandImage[] {
  return BRAND_IMAGES.filter((entry) => entry.section === section);
}

/** True once Stage 2 has filled a real path in. */
export function isPlaceholder(image: BrandImage): boolean {
  return image.src.startsWith("TODO:");
}
