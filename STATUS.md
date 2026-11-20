# Status

## Decisions (Jon, 2026-11-20)
- **Canonical host: www** (`https://www.consultjct.com`). Apex and http forward to it.
- **`/blog` and `/blog/the-beginning` → 301 to About.**
- **Privacy and Terms stay** as footer pages, outside the 6 main pages.
- **Analytics on the old site: none.** Search Console is the only traffic data.
- Old site: **Email/Password sign-in is OFF** in `jctconsulting-a2ed3` (done by Jon in the console). Nobody can sign in or register on the old site. The new site has no login.

## Session 3a (2026-11-20): the six pages, by-host noindex, PR CI warnings. Branch `feat/pages`

Done:
- **Search engines by host:** only `www.consultjct.com` is indexable. Every other host (previews, `*.vercel.app` including production, the apex) gets `X-Robots-Tag: noindex` from Vercel's routing. Tested per host on the real build.
- **Placeholders in CI:** a warning on PRs and a failure on `main`. Any production build (Vercel's included) still fails while one is left.
- **Pages:** Home, How I Work, Services, Work, About and Free Consult built in full from the screens and specs. Privacy and Terms got the page-end panel.
  - Copy is in `src/lib/content/` and labels in config.
  - Text the copy map names without quoting was transcribed from the screens: the Sprint weeks, the "You leave with…" line, Not included, the three case studies, the three About paragraphs and FAQ answer 1. **Checked word for word against Jon's copy doc by the manager (3a fixes): all match.**
  - FAQ answers 2–5 are from Jon's copy doc (Services & Pricing › FAQ).
- **Fixed-width digits:** the phone number in Privacy and Terms is in Geist Mono.
- **Calendly:** the inline widget on `/free-consult` only, loaded when the block nears the screen, with a skeleton until it shows. It uses `site.calendly` = Jon's account page for now.
- **Missing links:** `site.linkedin`, `site.stripe.advisory` and `site.stripe.sprintDeposit` are placeholders, never `href="#"`.
- **Checks:** Lighthouse SEO 100 and Accessibility 100 on every page, Performance ≥ 90 (enforced in CI).
- **Screenshots:** before/after, design beside build, in `docs/screenshots/pages/`.

Placeholders left (8 lines; production builds fail until each is replaced or its slot removed):
- LinkedIn URL; Stripe payment links for advisory hours and the Sprint deposit.
- FLO Cycling logo (single-colour SVG); other client logos, with permission.
- Photos: prototyping or 3D-print (How I Work); Seltza CAD render and sample or factory photo (Work); GSE marketplace screenshot (Work).

Accepted by Jon (3a review):
- **Calendly fallback:** a plain link to `site.calendly` when the widget fails or JavaScript is off, until 3b's intake form replaces it.
- **Inline links** keep the soft underline (needed for Accessibility 100).
- **Free Consult Best practices = 79** in Lighthouse, from Calendly's third-party cookies. Accepted; no threshold is set for Best practices.

Waiting on Jon:
- The 15-minute Calendly event link: Jon is making the event and sends the link for 3b (the account page shows a "30 Minute Meeting" today).
- The items above, or a decision to drop a slot at launch (HANDOFF "Still open" 4).
- Note: Vercel production deploys fail while placeholders remain (by design).

## Session 2 (2026-11-20): scaffold, shell, SEO, redirects, CI. PR #3 (`feat/scaffold`)

Done (2a):
- SvelteKit site scaffolded from lamp-web: tokens, Geist fonts, header with CTA, phone menu, theme toggle, footer.
- 8 prerendered page stubs (H1 only) and the 404. Privacy and Terms in full.
- Every UI label in `src/lib/config/labels.js`, with a test.
- Placeholder rule: placeholders show only with `PUBLIC_SHOW_PLACEHOLDERS=true`, and a production build with any left fails.

Done (2b preface):
- Contact email `jon@consultjct.com` on Privacy, Terms and the footer. No placeholders are left, so a normal production build passes.
- Vercel project on Node.js 24.x (set by Jon).
- Search Console Domain property verified Nov 20. There is no earlier history.

Done (2b):
- **SEO registry** (`src/lib/seo/registry.js`) for every page: title, description, canonical on www, OG image and JSON-LD.
  - JSON-LD: ProfessionalService on /, Organization and Person on /about, and a WebPage node on every page.
  - `robots.txt` and `sitemap.xml` (8 pages).
- **Redirects** (Jon approved the map Nov 20): `src/lib/seo/redirects.js`, 22 rules, all 301, one hop.
  - A trailing slash goes straight to the final page.
  - `docs/SEO_INVENTORY.csv` is filled for every row, and `docs/REDIRECT_MAP.md` is marked approved.
- **Search engines:** previews and any other non-production deploys send `X-Robots-Tag: noindex`. Production sends no noindex.
- **Tests:**
  - `npm run test:seo`: registry, built head tags, 95 redirect checks, and the link check.
  - `npm run check`: svelte-check, the placeholder check and the label test.
- **CI** on every PR: lint, check, unit tests, test:seo, link check, and Lighthouse (SEO 100 on all 8 pages).

Waiting on Jon (Vercel, new project):
- Environment variable `PUBLIC_SHOW_PLACEHOLDERS=true` for **Preview only**.
- At launch, domains on the new project:
  - `www.consultjct.com` is the primary domain.
  - `consultjct.com` redirects to `www.consultjct.com` (permanent).
  - Vercel does http → https on its own.
  - Both domains move from the old project in one step.
- Merge PR #3 when happy.

## Session 1b (2026-11-20): merge docs, tighten lockdown, stop the contact-form relay

Done:
- Session 1 docs merged: [jct-web#1](https://github.com/jonthornham/jct-web/pull/1)
- Lockdown PR changed to **deny ALL reads and writes**, with no exceptions: [JCTConsulting-Web#1](https://github.com/jonthornham/JCTConsulting-Web/pull/1). Emulator tests 14/14. **Not deployed.**
- Contact-form relay PR opened: [JCTConsulting-Web#2](https://github.com/jonthornham/JCTConsulting-Web/pull/2). The function now emails Jon only, checks every field, and has a hidden honeypot field. Emulator tests 27/27. **Not deployed.**
- Reported (not changed): the old-site files that send server values to the browser. With sign-in off, the leaked delete-account password no longer opens anything.

Waiting on Jon:
- Merge and deploy, in this order:
  1. Rules: `firebase deploy --only firestore:rules --project jctconsulting-a2ed3`
  2. Function: `firebase deploy --only functions:email.sendEmail --project jctconsulting-a2ed3`
- The honeypot field goes live when Vercel redeploys the old repo's `main`. The function deploy alone already stops the relay.
- ~~The 6 new page names → fill `new_url`~~ Done in Session 2b.
- ~~Search Console export~~ No history before Nov 20 (see `docs/search-console/README.md`).

## Session 1 (2026-11-20): SEO inventory + old-site lockdown
- `docs/OLD_SITE_INVENTORY.md`, `docs/SEO_INVENTORY.csv` (38 rows), `docs/REDIRECT_MAP.md`
- JCT emulator port block (3xxxx) recorded in `CLAUDE.md`

Next (Session 2): scaffold the new site from the Lamp template; build the redirect test from `SEO_INVENTORY.csv`.
