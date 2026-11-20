# JCT download 01: start here

**Design 01 for consultjct.com**, the site for JCT Consulting (Jon Thornham's fractional product and operations practice for physical-product startups). Nov 20, 2026.

- **Target:** `jonthornham/jct-web`: SvelteKit 2 + Svelte 5 runes + Tailwind 3, every page pre-rendered, built on lamp-web's foundations.
- **Pages:** 6 (Home, How I Work, Services & Pricing, Work, About, Free Consult) plus Privacy and Terms as footer pages, and the 404.
- **Look:** the Lamp Hockey / Wingbeat family. lamp-web's tokens, type, spacing, radii, shadows and components are reused; the differences are listed below.
- **Copy:** from Jon's "JCT site rebuild: positioning and full copy", plus the few lines Jon approved on Nov 20 (form messages, 404, FLO result, Privacy and Terms). What's still missing is marked [PLACEHOLDER] with a note of what's needed (see `copy-map.md`).

## What's in the zip
| Path | What |
|---|---|
| `HANDOFF.md` | this file |
| `tokens/tokens.css` | CSS variables: colours (light and dark, lamp-web names and RGB-channel format), type, layout, radii, shadows, breakpoints |
| `tokens/tokens.json` | the same values in JSON, plus the Lamp values for each changed token and the contrast results |
| `tokens/contrast.md` | WCAG AA contrast for the accent (text and buttons) and the main text pairs, light and dark |
| `screens/` | 56 full-page PNGs: 9 pages + 5 Free Consult form states, each at 390 and 1440, light and dark. Named `page-width-theme.png` (states: `free-consult-{state}-width-theme.png`) |
| `components/*.md` | one spec per component: sizes, spacing, tokens, states, behaviour at 390 / 1440 |
| `components/*.png` | the component sheet (every state side by side) in light and dark, and the open mobile menu at 390 |
| `assets/` | wordmark SVGs, favicon set, 6 OG images, photos (WebP + JPG), single-colour logos; `assets/ASSETS.md` has alt text, sources and licences |
| `copy-map.md` | every text block per screen → its place in Jon's copy doc (or Jon's Nov 20 approval, or [PLACEHOLDER]); then every UI label for config |
| `legal/privacy.md`, `legal/terms.md` | the Privacy and Terms page text, ready for mdsvex |
| `checklist.md` | yes/no checks for comparing the build with the screens |

## Build order
1. **Tokens:** replace the colour block in `src/app.css` with `tokens/tokens.css` (same names as lamp-web, so `tailwind.config.js` needs no colour changes). Add the `screens` breakpoints (760 / 900 / 1000 / 1180 / 1280) and the `mk-hero` size to Tailwind. Load Geist + Geist Mono as lamp-web does.
2. **Assets:** wordmark, favicons and OG images into `static/`; photos through `npm run images`.
3. **Shell:** header + mobile menu + theme toggle, footer (`components/header-nav.md`, `footer.md`).
4. **Primitives:** buttons, links, cards, placeholder chip and image slot (`buttons.md`, `links.md`, `cards.md`, `placeholders.md`).
5. **Section layouts:** container, section, hero 2-up, grids, stage rail, week track, callouts, closing CTA, page end (`section-layouts.md`).
6. **Pages**, in this order: Home → Services (FAQ: `faq.md`) → How I Work → Work → About → Free Consult (`calendly-block.md`, `intake-form.md`) → Privacy / Terms (`legal/`) → 404.
7. **SEO and OG** per page from the copy doc's SEO table and `assets/og/`.
8. **Check** against `screens/` with `checklist.md` (lamp-web's screenshot script at 390 and 1440, light and dark).

## Screens
All in `screens/`, each as `-390-light`, `-390-dark`, `-1440-light`, `-1440-dark`.
| Screen | Route | Files |
|---|---|---|
| Home | `/` | `home-*.png` |
| How I Work | `/how-i-work` | `how-i-work-*.png` |
| Services & Pricing | `/services` | `services-*.png` (first FAQ item open) |
| Work | `/work` | `work-*.png` |
| About | `/about` | `about-*.png` |
| Free Consult: Calendly block (default) | `/free-consult` | `free-consult-*.png` |
| Free Consult: form, empty | | `free-consult-form-*.png` |
| Free Consult: form, errors | | `free-consult-form-errors-*.png` |
| Free Consult: form, sending | | `free-consult-sending-*.png` |
| Free Consult: form, send error | | `free-consult-send-error-*.png` |
| Free Consult: sent | | `free-consult-success-*.png` |
| Privacy | `/privacy` | `privacy-*.png` |
| Terms | `/terms` | `terms-*.png` |
| 404 | (error page) | `404-*.png` |

Between 390 and 1440 the layouts change at 760, 900, 1000, 1180 and 1280px, as each component spec describes.

## Components
| Component | Spec | Shown in |
|---|---|---|
| Header, nav, theme toggle, mobile menu | `components/header-nav.md` | every screen; `header-menu-open-390-{light,dark}.png`; sheet §10 |
| Footer | `components/footer.md` | every screen |
| Buttons (primary, secondary, ghost, onPrimary; mk / sm) | `components/buttons.md` | sheet §01 |
| Links (arrow, inline, jump chips) | `components/links.md` | sheet §01; Work |
| Problem card, offer cards (compact, full), Free Consult band, step card, case-study block, quote panel, Home proof panel, logo strip, hero float card | `components/cards.md` | sheet §02–05; Home, Services, Work |
| Container, section, page header, hero, feature 2-up, grids, stage rail, week track, callouts, closing CTA, page end, legal prose, 404 | `components/section-layouts.md` | sheet §03; all pages |
| FAQ accordion | `components/faq.md` | sheet §06; Services |
| Intake form: fields, choice pills, alerts, all form states | `components/intake-form.md` | sheet §07; Free Consult states |
| Calendly booking block | `components/calendly-block.md` | sheet §08; Free Consult |
| [PLACEHOLDER] chip and image slot (preview only) | `components/placeholders.md` | sheet §09 |

The component sheet is `components/component-sheet-1440-light.png` and `-dark.png`.

## Differences from Lamp
Everything not listed is lamp-web's value or pattern.
1. **Accent colour.** Lamp's sky blue becomes **ocean blue**: `primary` #006994 (light) / #007BA7 (dark), with `primary-hover`, `primary-soft`, `link`, `focus` and the `accent-*` set (10 tokens per theme; old and new values in `tokens.json` › meta). Lamp keeps `primary` the same in both themes; JCT lifts it one step in dark so the button stays visible on the dark canvas, and dark hover goes darker to keep white text above 4.5:1.
2. **Imagery.** Real products and Jon only: the Seltza tap, the FLO 64 AS Disc (on a white plate in both themes, because it's a studio shot on white), Jon's headshot. No stock, no illustrations.
3. **Wordmark.** The JCT logo in one colour (`fg`), 22px tall, with the tagline beside it from 1280px. The favicon is a new mark: the logo's "J" in white on an ocean tile.
4. **New components** for JCT content, built from lamp-web parts: the stage rail, the week track, the Calendly booking block, the Free Consult band (Lamp's selected-pill treatment on an offer card) and the page-end panel (a `surface-2` version of the CTA block, so the solid blue block appears on Home only).
5. **Active (pressed) state.** lamp-web defines none; JCT buttons press 1px down and take the hover colour.
6. **Lamp-only colour tokens are left out** (plot, trace, shot, fund, phase, rank, medal). JCT has no charts or scores.
7. **Borrowed from Wingbeat rather than Lamp:** the closing CTA's white button on the solid block, check bullets and the FAQ layout.

## Decisions (Jon, Nov 20, 2026)
1. **Name:** JCT.
2. **Accent:** ocean blue #006994.
3. **Favicon:** the "J" mark, approved.
4. **Form, success and 404 copy:** approved as written (now final in `copy-map.md`).
5. **Page endings:** the shared panel stays.
6. **Seltza result:** "profitable by 2021" confirmed.
7. **FLO result:** "Shipped to 75+ countries" and "7-figure annual revenue", plus "Ran 2009–2025".
8. **"Other products" grid:** left out. Not in the screens; don't build it.
9. **Missing photos and logos:** stay as placeholders for now, each labelled with what's needed (list in `assets/ASSETS.md` › Still needed).
10. **Image and logo rights** (Seltza photo and logo, FLO wheel photo): approved.
11. **Privacy and Terms:** written; text in `legal/`.
12. **Sprint card week list:** kept (design's call). The card is scanned for price and scope, and the week track below explains the timing.
13. **The new site has no accounts or logins.** Build none.

## Still open (each with a recommendation)
1. **Calendly.** Jon needs a Calendly account and one 15-minute event type, and then gives Code its link. **Recommend the free plan to start:** it allows one event type and website embedding. It shows Calendly branding and ignores the colour parameters; the JCT frame around it still matches. Upgrade later if branded colours matter. Until the link exists, /free-consult shows the intake form, which is already the designed fallback.
2. **Contact email** for Privacy and Terms (and optionally the footer). **Recommend an address on consultjct.com**, so it survives any change of email provider. It's a [PLACEHOLDER] in both legal pages.
3. **LinkedIn URL and Stripe payment links** (advisory hours; Sprint deposit). Jon is sending them. Config values `site.linkedin`, `site.stripe.advisory` and `site.stripe.sprintDeposit`; `href="#"` until then.
4. **Photos and logos still needed** (`assets/ASSETS.md` › Still needed). **Recommend:** whatever hasn't arrived by launch is removed and its layout closes up. How I Work's "working together" becomes one column; Work · Seltza shows the main photo only; Work · GSE shows the logo panel only; the logo strip shows the logos that exist.
5. **Legal review.** Privacy and Terms are plain-language drafts built from the facts above; they aren't legal advice. **Recommend a quick review by a lawyer** before launch, especially the liability, confidentiality and governing-law sections.
