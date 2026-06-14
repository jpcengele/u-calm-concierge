#!/usr/bin/env node
/**
 * prerender.mjs — post-build static-meta prerender for the U-CALM Concierge SPA.
 *
 * WHAT IT DOES
 *   After `vite build`, for every known route it writes dist/<route>/index.html:
 *   a copy of the built shell with that route's <title>, meta description,
 *   canonical, Open Graph/Twitter tags and JSON-LD baked into static HTML.
 *   The <body> is untouched (still the same #root that hydrates), so humans
 *   are unaffected and there is NO hydration change and NO headless browser.
 *
 * WHY
 *   Non-JS crawlers — every AI assistant's fetcher (GPTBot, ClaudeBot, …),
 *   social unfurlers, and Google's first pass — otherwise see one generic
 *   shell for all routes. This makes each route self-describe in raw HTML:
 *   per-route canonical (no more "every page looks like the homepage"),
 *   per-route social cards, and per-route Schema.org for AI citation.
 *   Full body TEXT still needs JS — that is a separate, browser-based sprint.
 *
 * SAFETY
 *   - Zero dependencies (Node fs + string ops). Cannot fail at runtime in a
 *     way that touches the live site: if this throws, the build fails and
 *     Cloudflare keeps the previous deployment.
 *   - A failed run is loud (process.exit(1)).
 *   - ROUTES below is the single prerender manifest. It is asserted against
 *     src/App.tsx at build time: if a <Route path> exists that is not listed
 *     here (or vice-versa), the build errors — so new routes can never
 *     silently ship without prerendered meta.
 *
 * MAINTENANCE
 *   The JSON-LD blocks here mirror src/lib/useDocumentMeta.ts. If you change
 *   the schema there, update the SCHEMA map below. The assertion only guards
 *   routes, not schema text — keep them in sync by hand (schema changes are
 *   rare). Titles/descriptions likewise mirror the page components; the
 *   client hook overwrites them for human visitors, so a drift is only ever
 *   visible to crawlers and is cosmetic, never broken.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "dist");
const ORIGIN = "https://u-calm.com";

// ---- Schema blocks (mirror src/lib/useDocumentMeta.ts) ----------------------
const ORG = {
  "@context": "https://schema.org", "@type": "Organization", "@id": `${ORIGIN}/#org`,
  name: "U-CALM Concierge", legalName: "U-CALM",
  alternateName: ["U-CALM","U-Calm","Ucalm","UCalm","U Calm","U Calm Concierge","Ucalm Concierge","U-CALM Lugano","Ucalm Lugano"],
  url: ORIGIN, logo: `${ORIGIN}/brand/logo.png`, foundingDate: "2013",
  description: "U-CALM Concierge is a lifestyle-management and concierge house. Considered, thorough, quietly arranged. Sister-brand to U-Calm Aviation; serves members across Europe.",
  email: "hello@u-calm.com",
  areaServed: ["Switzerland","United Kingdom","Italy","Europe","Worldwide"],
  knowsLanguage: ["en","it","fr","de"], sameAs: ["https://u-calmaviation.com"],
};
const DESK = {
  "@context": "https://schema.org", "@type": "ProfessionalService", "@id": `${ORIGIN}/#desk`,
  name: "U-CALM Concierge", url: ORIGIN, image: `${ORIGIN}/brand/logo.png`,
  email: "hello@u-calm.com", foundingDate: "2013",
  parentOrganization: { "@id": `${ORIGIN}/#org` },
  description: "Lifestyle management and concierge services from Lugano, Switzerland. Held in English, Italian, French, German.",
  areaServed: [
    { "@type": "City", name: "Lugano" }, { "@type": "City", name: "London" },
    { "@type": "City", name: "Milan" }, { "@type": "Place", name: "Switzerland" },
    { "@type": "Place", name: "Europe" },
  ],
  address: { "@type": "PostalAddress", addressLocality: "Lugano", addressRegion: "Ticino", addressCountry: "CH" },
  geo: { "@type": "GeoCoordinates", latitude: 46.0037, longitude: 8.9511 },
  contactPoint: { "@type": "ContactPoint", contactType: "Inquiries", email: "hello@u-calm.com", availableLanguage: ["English","Italian","French","German"] },
  sameAs: ["https://u-calmaviation.com"],
};
const ARRIVAL_SERVICE = {
  "@context": "https://schema.org", "@type": "Service", "@id": `${ORIGIN}/arrival#service`,
  name: "U-CALM Arrival", serviceType: "Relocation and settlement coordination",
  url: `${ORIGIN}/arrival`, provider: { "@id": `${ORIGIN}/#desk` },
  areaServed: [{ "@type": "City", name: "Lugano" }, { "@type": "Place", name: "Ticino, Switzerland" }],
  availableLanguage: ["English","Italian","French","German"],
  description: "A fixed-scope settlement mandate for families moving to Lugano and Ticino: residence permits coordinated, comune registration, home-finding and a prepared first night, health-insurance enrolment, school placement, and the fiscal liaison kept in step with vetted independent advisers. One named specialist holds the whole file. U-CALM does not provide tax, legal or immigration advice.",
};
const WEBSITE = {
  "@context": "https://schema.org", "@type": "WebSite", name: "U-CALM Concierge",
  url: ORIGIN, inLanguage: ["en","it","fr","de"], publisher: { "@id": `${ORIGIN}/#org` },
};
const JOURNAL_BLOG = {
  "@context": "https://schema.org", "@type": "Blog", "@id": `${ORIGIN}/journal#blog`,
  name: "The U-CALM Journal", url: `${ORIGIN}/journal`,
  description: "Considered notes on making a life in Ticino — the tax, the comune, the schools, the Lugano–Milan–London corridor.",
  inLanguage: ["en","it","fr","de"], publisher: { "@id": `${ORIGIN}/#org` },
};
// Per-post Article schema (English baseline) so non-JS crawlers see each entry;
// the client hook localises for human readers. Add one per published slug.
const article = (slug, headline, description, date, keywords) => ({
  "@context": "https://schema.org", "@type": "Article", "@id": `${ORIGIN}/journal/${slug}#article`,
  headline, description, datePublished: date, dateModified: date, inLanguage: "en",
  author: { "@id": `${ORIGIN}/#org` }, publisher: { "@id": `${ORIGIN}/#org` },
  mainEntityOfPage: `${ORIGIN}/journal/${slug}`,
  isPartOf: { "@type": "Blog", "@id": `${ORIGIN}/journal#blog` }, keywords,
});

// ---- Route manifest (asserted against src/App.tsx) --------------------------
const ROUTES = [
  { path: "/", title: "U-CALM Concierge — Consider it done. | Lifestyle management, Lugano",
    description: "U-CALM is a quiet concierge and lifestyle-management house in Lugano. One named concierge arranges the household, the table, the travel — in four languages.",
    jsonLd: [ORG, DESK, WEBSITE] },
  { path: "/services", title: "Services — Considered, thorough, quiet | U-CALM Concierge",
    description: "The breadth the desk arranges: phone-line concierge, household, relocations, corporate, travel and events — with aviation through U-Calm Aviation.",
    jsonLd: [ORG] },
  { path: "/services-in-full", title: "The services, in full | U-CALM Concierge",
    description: "The breadth beneath the desk, plainly listed: days and errands, house and household, family and care, arrival and relocations, business days, and the corridor.",
    ogImage: `${ORIGIN}/brand/01-brand-heroes/hero-villa-terrace-dawn.jpg`, jsonLd: [ORG] },
  { path: "/arrival", title: "Arrival — settling in Ticino, quietly | U-CALM Concierge",
    description: "U-CALM Arrival is a settlement mandate for families moving to Lugano and Ticino: permits, the comune, home-finding, health insurance, schools and the fiscal liaison — held on one file by one named specialist.",
    ogImage: `${ORIGIN}/brand/07-seasonal/seasonal-spring-magnolia-threshold.jpg`, jsonLd: [ORG, ARRIVAL_SERVICE] },
  { path: "/who-we-serve", title: "Who we serve — Members of the house | U-CALM Concierge",
    description: "Four lives the house recognises: the expatriate making Switzerland home, the Ticinese family, the executive between cities, the visitor staying long.",
    jsonLd: [ORG] },
  { path: "/expat", title: "For the expatriate making Switzerland home | U-CALM Concierge",
    description: "Relocation, residency, schools, the household, the bilingual everyday. The desk holds the whole of a settled life in Ticino for arriving families.",
    jsonLd: [ORG] },
  { path: "/ticinese", title: "Per la famiglia ticinese | U-CALM Concierge",
    description: "Per famiglie ticinesi affermate — un concierge che parla la lingua locale, conosce le case, le scuole e le stagioni, e tiene il tutto su un unico file.",
    jsonLd: [ORG] },
  { path: "/corporate", title: "For the executive between cities | U-CALM Concierge",
    description: "Diary, travel, household, family and school logistics — held by one named concierge so the working week, in any city, simply runs.",
    jsonLd: [ORG] },
  { path: "/visitor", title: "For the visitor staying long | U-CALM Concierge",
    description: "A concierge for the seasonal resident, the second-home owner, the long-stay visitor. The visit is held with the same care as a life.",
    jsonLd: [ORG] },
  { path: "/cool-calm", title: "Cool CALM — restorative arrangements | U-CALM Concierge",
    description: "Cool CALM is the restorative service line within U-CALM. Quiet retreats, considered downtime, the winter household — arranged without fuss.",
    jsonLd: [ORG] },
  { path: "/about", title: "About — A house in Lugano | U-CALM Concierge",
    description: "U-CALM was founded in Lugano in 2013 on a single proposition: one named concierge should be the only relationship a member has to think about.",
    jsonLd: [ORG, DESK, { "@context": "https://schema.org", "@type": "AboutPage", url: `${ORIGIN}/about`, about: { "@id": `${ORIGIN}/#desk` } }] },
  { path: "/contact", title: "Contact — Open a quiet conversation | U-CALM Concierge",
    description: "Write to the U-CALM concierge desk in Lugano. A named specialist responds within the working day, in the language you wrote to us in. hello@u-calm.com.",
    jsonLd: [ORG, DESK, { "@context": "https://schema.org", "@type": "ContactPage", url: `${ORIGIN}/contact`, about: { "@id": `${ORIGIN}/#desk` } }] },
  { path: "/journal", title: "The Journal — settling in Ticino | U-CALM Concierge",
    description: "Considered notes on making a life in Ticino — lump-sum taxation, the comune, schools, and the Lugano–Milan–London corridor. Fewer pieces, each genuinely useful.",
    ogImage: `${ORIGIN}/brand/01-brand-heroes/hero-villa-terrace-dawn.jpg`, jsonLd: [ORG, JOURNAL_BLOG] },
  { path: "/journal/lugano-milan-london-corridor", title: "Lugano, Milan, London: a life on the corridor | U-CALM Journal",
    description: "For many families, Lugano is not a single home but one point on a corridor. How a life across Lugano, Milan and London is held as one, not three.",
    ogImage: `${ORIGIN}/brand/01-brand-heroes/hero-villa-terrace-dawn.jpg`,
    jsonLd: [ORG, article("lugano-milan-london-corridor", "Lugano, Milan, London: a life on the corridor", "For many families, Lugano is one point on a corridor — a life across Lugano, Milan and London held as one file, with U-Calm Aviation across the line.", "2026-06-12", "living between Lugano and Milan, Lugano Milan London, multi-residence Switzerland, internationally mobile family Ticino")] },
  { path: "/journal/lump-sum-taxation-ticino", title: "Lump-sum taxation in Ticino — the quiet version | U-CALM Journal",
    description: "What lump-sum taxation in Ticino really involves for a family making Lugano home — and the part a concierge holds, so you don't have to.",
    ogImage: `${ORIGIN}/brand/01-brand-heroes/hero-villa-terrace-dawn.jpg`,
    jsonLd: [ORG, article("lump-sum-taxation-ticino", "Lump-sum taxation in Ticino — the quiet version", "What lump-sum taxation (the forfait) in Ticino really involves for a family making Lugano home — and the part a concierge holds. U-CALM does not give tax advice.", "2026-06-09", "lump-sum taxation Ticino, forfait Lugano, moving to Lugano tax, Swiss residence lump-sum")] },
  { path: "/journal/moving-to-lugano-settled-arrival", title: "Moving to Lugano: what a settled arrival looks like | U-CALM Journal",
    description: "Not a checklist for moving to Lugano, but a picture of what it feels like when the arrival is handled — the permits, the home, the first week, quietly.",
    ogImage: `${ORIGIN}/brand/01-brand-heroes/hero-villa-terrace-dawn.jpg`,
    jsonLd: [ORG, article("moving-to-lugano-settled-arrival", "Moving to Lugano: what a settled arrival looks like", "What it feels like when an arrival in Lugano is handled — the permits, the home, the first week — held on one file by U-CALM.", "2026-06-06", "moving to Lugano, relocating to Ticino, settling in Lugano, Lugano relocation")] },
  { path: "/journal/ticino-admin-comune-permit-first-week", title: "The comune, the permit, the first week — the Ticino admin nobody warns you about | U-CALM Journal",
    description: "The small, precise, Italian-language administration of arriving in Ticino — what it really involves, in what order, and how a bilingual desk takes it off your hands.",
    ogImage: `${ORIGIN}/brand/01-brand-heroes/hero-serene-teal-door.jpg`,
    jsonLd: [ORG, article("ticino-admin-comune-permit-first-week", "The comune, the permit, the first week — the Ticino admin nobody warns you about", "The comune registration, the residence permit, the LaMal clock and the phone calls — the Italian-language admin of a first week in Ticino, taken off your hands.", "2026-06-04", "comune registration Ticino, residence permit Lugano, Ticino arrival admin, registering in Switzerland Ticino")] },
  { path: "/journal/choosing-school-ticino", title: "Choosing a school in Ticino without the September scramble | U-CALM Journal",
    description: "How international families choose a school in Lugano and Ticino calmly — the options, the timing, and why the work begins in spring, not August.",
    ogImage: `${ORIGIN}/brand/07-seasonal/seasonal-back-to-school-shoes.jpg`,
    jsonLd: [ORG, article("choosing-school-ticino", "Choosing a school in Ticino without the September scramble", "The Swiss state system, TASIS and The International School of Lugano, and why a September place is decided in spring. How U-CALM keeps it calm.", "2026-06-02", "international schools Lugano, schools in Ticino, TASIS Lugano, choosing a school Switzerland")] },
  { path: "/journal/lamal-health-insurance-ticino", title: "LaMal, calmly: health insurance in your first three months | U-CALM Journal",
    description: "Switzerland gives new arrivals three months to arrange LaMal health insurance. What it is, how families in Ticino choose well, and the deadline not to miss.",
    ogImage: `${ORIGIN}/brand/01-brand-heroes/hero-member-residence-afternoon.jpg`,
    jsonLd: [ORG, article("lamal-health-insurance-ticino", "LaMal, calmly: health insurance in your first three months", "Switzerland's ninety-day window for basic LaMal cover — what it is, where families go wrong, and the part U-CALM holds with a trusted adviser. Not insurance advice.", "2026-05-30", "LaMal Ticino, health insurance Switzerland expat, mandatory health insurance Lugano, KVG LaMal arrival")] },
  { path: "/journal/renting-before-buying-lugano", title: "Renting before buying in Lugano — and when not to | U-CALM Journal",
    description: "Why most families should rent before buying in Lugano — the neighbourhoods, the permit questions, and the few cases where buying first makes sense.",
    ogImage: `${ORIGIN}/brand/01-brand-heroes/hero-villa-terrace-dawn.jpg`,
    jsonLd: [ORG, article("renting-before-buying-lugano", "Renting before buying in Lugano — and when not to", "Why a year of renting usually earns its keep in Lugano — the neighbourhoods, the foreign-buyer rules, and the exceptions. U-CALM takes no property commission.", "2026-05-28", "buying property Lugano, renting in Ticino, Lugano neighbourhoods, property Ticino foreigners")] },
  { path: "/journal/importing-belongings-furniture-car-ticino", title: "Bringing the house with you: furniture, the car, and Swiss customs | U-CALM Journal",
    description: "Moving your household and car to Ticino sounds simple until customs asks the question. What duty-free import really involves, and how it is handled quietly.",
    ogImage: `${ORIGIN}/brand/02-services/services-ground-household.jpg`,
    jsonLd: [ORG, article("importing-belongings-furniture-car-ticino", "Bringing the house with you: furniture, the car, and Swiss customs", "Duty-free import of household goods and the car into Switzerland — the inventory, the declaration, the sequence — handled with a customs-experienced partner.", "2026-05-26", "import household goods Switzerland, moving furniture to Ticino, importing a car to Switzerland, Swiss customs relocation")] },
  { path: "/journal/family-reunification-ticino", title: "Family reunification in Ticino, in plain English | U-CALM Journal",
    description: "Most moves to Lugano are family moves. How family reunification works in Switzerland for spouses and children — the principle, the timing, and what is held for you.",
    ogImage: `${ORIGIN}/brand/07-seasonal/seasonal-returning-home-threshold.jpg`,
    jsonLd: [ORG, article("family-reunification-ticino", "Family reunification in Ticino, in plain English", "How spouses and children join the main applicant in Switzerland — the principle, the time limits, and why U-CALM plans it alongside the main permit, not after.", "2026-05-23", "family reunification Switzerland, moving family to Ticino, spouse children residence permit Switzerland, relocating family Lugano")] },
  { path: "/journal/is-lugano-expensive", title: "Is Lugano expensive? An honest answer | U-CALM Journal",
    description: "Lugano is a Swiss city, so the headline answer is yes. But the honest answer, for a family weighing the move, is more interesting than the number.",
    ogImage: `${ORIGIN}/brand/04-about/about-hero-founding-view.jpg`,
    jsonLd: [ORG, article("is-lugano-expensive", "Is Lugano expensive? An honest answer", "Lugano in context against Switzerland and Europe, where the money actually goes — housing, LaMal, schooling — and the part the number misses.", "2026-06-10", "is Lugano expensive, cost of living Lugano, Lugano cost of living expat, living in Ticino cost")] },
  { path: "/journal/first-winter-ticino-household", title: "A first winter in a Ticino household | U-CALM Journal",
    description: "The move is done by autumn; the first winter is when a house becomes a home. On the quiet season in Ticino, and the household kept through it.",
    ogImage: `${ORIGIN}/brand/07-seasonal/seasonal-winter-hearth-warmth.jpg`,
    jsonLd: [ORG, article("first-winter-ticino-household", "A first winter in a Ticino household", "The quiet season that turns an address into a home — heating, wood, the chalet up the valley — and Cool CALM, the Alpine household kept between visits.", "2026-06-11", "living in Ticino winter, first winter Lugano, Ticino household winter, settling into Ticino")] },
  { path: "/journal/what-a-concierge-does-relocation", title: "What a concierge actually does in a relocation | U-CALM Journal",
    description: "Relocation agent, lawyer, lifestyle manager — what is a concierge actually for in a move to Ticino? A plain account of the part that holds the rest together.",
    ogImage: `${ORIGIN}/brand/01-brand-heroes/hero-concierge-note.jpg`,
    jsonLd: [ORG, article("what-a-concierge-does-relocation", "What a concierge actually does in a relocation", "Not the tasks but the holding — the sequence and handovers no specialist owns. How a concierge differs from a directory, and becomes U-CALM membership.", "2026-06-13", "relocation concierge Switzerland, what does a concierge do, lifestyle management relocation, concierge vs relocation agent")] },
];

const DEFAULT_OG = `${ORIGIN}/og/default.png`;

// ---- helpers ----------------------------------------------------------------
const esc = (s) => String(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

function buildHead(route) {
  const url = ORIGIN + (route.path === "/" ? "/" : route.path);
  const og = route.ogImage || DEFAULT_OG;
  const ld = (route.jsonLd || []).map(
    (b) => `<script type="application/ld+json">${JSON.stringify(b)}</script>`
  ).join("\n    ");
  return { url, og, ld };
}

function rewrite(shell, route) {
  const { url, og, ld } = buildHead(route);
  let html = shell;
  // <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(route.title)}</title>`);
  // description
  html = html.replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${esc(route.description)}" />`);
  // canonical: shell no longer has one (removed during SEO pass) — inject before </head>
  // OG/Twitter: replace existing baseline tags
  const set = (prop, val, byProp = true) => {
    const attr = byProp ? "property" : "name";
    const re = new RegExp(`<meta ${attr}="${prop}"[^>]*>`, "i");
    const tag = `<meta ${attr}="${prop}" content="${esc(val)}" />`;
    html = re.test(html) ? html.replace(re, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
  };
  set("og:title", route.title);
  set("og:description", route.description);
  set("og:url", url);
  set("og:image", og);
  set("og:image:alt", route.title);
  set("twitter:title", route.title, false);
  set("twitter:description", route.description, false);
  set("twitter:image", og, false);
  // inject canonical + JSON-LD just before </head>
  html = html.replace("</head>", `    <link rel="canonical" href="${url}" />\n    ${ld}\n  </head>`);
  return html;
}

// ---- assert ROUTES match src/App.tsx ---------------------------------------
function assertRoutesInSync() {
  const app = readFileSync(join(ROOT, "src", "App.tsx"), "utf8");
  const declared = new Set();
  // index route → "/"
  if (/<Route\s+index\b/.test(app)) declared.add("/");
  for (const m of app.matchAll(/<Route\s+path="([^"*]+)"/g)) {
    if (m[1].includes(":")) continue; // dynamic route (e.g. journal/:slug) — prerendered via enumerated slugs in ROUTES
    declared.add(m[1].startsWith("/") ? m[1] : "/" + m[1]);
  }
  const manifest = new Set(ROUTES.map((r) => r.path));
  const missing = [...declared].filter((p) => !manifest.has(p));
  if (missing.length) {
    console.error(`[prerender] FAIL: routes in App.tsx not in prerender manifest: ${missing.join(", ")}`);
    console.error("[prerender] Add them to ROUTES in scripts/prerender.mjs (or they ship with generic meta).");
    process.exit(1);
  }
}

// ---- run --------------------------------------------------------------------
const shellPath = join(DIST, "index.html");
if (!existsSync(shellPath)) {
  console.error(`[prerender] FAIL: ${shellPath} not found — run after \`vite build\`.`);
  process.exit(1);
}
assertRoutesInSync();
const shell = readFileSync(shellPath, "utf8");
let n = 0;
for (const route of ROUTES) {
  if (route.path === "/") continue; // homepage already lives at dist/index.html — rewrite it in place
  const outDir = join(DIST, route.path.replace(/^\//, ""));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), rewrite(shell, route), "utf8");
  n++;
}
// homepage: rewrite the root shell in place with its own meta + schema
writeFileSync(shellPath, rewrite(shell, ROUTES.find((r) => r.path === "/")), "utf8");
console.log(`[prerender] wrote ${n} route files + homepage — ${ROUTES.length} routes, meta + JSON-LD baked in.`);
