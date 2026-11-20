# Build checklist (yes / no)

Compare each built page with `screens/` at the same width and theme. Every item should be "yes" before launch.

## Tokens
- [ ] `src/app.css` colour values match `tokens/tokens.css` exactly, light and dark (diff against lamp-web shows only primary, primary-hover, primary-soft, link, focus, accent, accent-hover, accent-fg, accent-soft, accent-text).
- [ ] No hex values in components (except the onPrimary button's #FFFFFF / #00557F / #E8F4F8 and the OG images).
- [ ] Geist and Geist Mono load (weights 400, 500, 600); prices, weeks, years, step numbers and the phone number use Geist Mono with tabular figures.
- [ ] Type sizes match `tokens.json` › type at 390 and 1440 (H1 hero 44px at 390, 72px at 1440).
- [ ] Content max width 1200px; gutter 20px at 390 and 40px at 1440; section padding 56px at 390 and 88px at 1440.
- [ ] Radii: pills 999, inputs 8, alerts 14, cards 18, media / quote / CTA 24.
- [ ] Cards use an inset 1px ring, not a CSS border; sections are separated by 1px rules with no alternating fills.
- [ ] No gradients (the striped image slot is preview-only).

## Pages (each at 390 and 1440, light and dark, matching `screens/`)
- [ ] Home · [ ] How I Work · [ ] Services · [ ] Work · [ ] About · [ ] Free Consult · [ ] Privacy · [ ] Terms · [ ] 404
- [ ] Every page has the header CTA and ends on a consult CTA (Home: solid CTA block; Free Consult: the page itself; others: the page-end panel).
- [ ] Section order on each page matches the screens.
- [ ] Copy is word for word from `copy-map.md`; no string differs from Jon's copy doc.
- [ ] No horizontal scroll at 390; no one-word last line in any H1/H2 at 390 or 1440.

## Header, footer, theme
- [ ] Header 64px, sticky; tagline only at ≥1280px; nav links hidden and menu button shown under 900px; CTA reads "Free Consult" under 760px.
- [ ] Current page link is `fg`/600 with `aria-current="page"`.
- [ ] Theme toggle: System / Light / Dark, persisted, set before first paint (no flash).
- [ ] Mobile menu: 52px rows, Light/Dark control, full-width CTA; closes on Esc, outside tap and navigation; traps focus; restores focus to the menu button.
- [ ] Footer links incl. Privacy and Terms; © 2026 JCT Consulting.

## Component states (`components/`)
- [ ] Buttons: rest, hover, active (1px press), focus (2px ring, 2px offset), disabled (40%), sending (spinner) for primary; rest/hover/active/focus/disabled for secondary.
- [ ] Links: hover underline, active `fg`, visible focus ring.
- [ ] Every focusable element shows a visible focus ring in both themes.
- [ ] FAQ: first open on load, one at a time, `aria-expanded`, keyboard works.
- [ ] Stage rail: 6 across at ≥1180, 3 across at 760–1179, vertical under 760.
- [ ] Week track: 5 columns with "Weeks 2–3" spanning two; stacked under 760.

## Free Consult
- [ ] Calendly block loads only on /free-consult, with the light or dark colour set; the skeleton shows while it loads.
- [ ] With no booking URL, a failed load (8s) or no JavaScript, the intake form shows instead.
- [ ] Form states all present and matching the screens: empty, error (field rings + messages + summary, focus to first invalid), sending (disabled + spinner), sent (success card, focus to heading), send error (values kept, alert).
- [ ] Choice pills behave as a radiogroup with arrow keys.
- [ ] Honeypot and minimum time-on-page in place; the submission is stored, then emailed.

## Assets and SEO
- [ ] Wordmark inlined as currentColor SVG; `aria-label="JCT home"`.
- [ ] favicon.ico, favicon.svg, apple-touch-icon.png (180) and the 512 icon are linked.
- [ ] Each page has its own OG image from `assets/og/`, its title and description from the copy doc's SEO table, and a canonical URL.
- [ ] Photos served as WebP with JPG fallback, with the alt text from `assets/ASSETS.md`; FLO wheel on a white plate in both themes.
- [ ] Logo strip logos are single colour and swap with the theme.

## Accessibility
- [ ] All text pairs meet AA (`tokens/contrast.md`); spot-check link, buttons and muted text in dark.
- [ ] Touch targets ≥44px (menu button, menu rows, FAQ rows, pills 40px tall within 44px rows).
- [ ] Skip link to main content.
- [ ] Images have alt text; decorative icons and avatars are `aria-hidden`.

## Launch
- [ ] **No [PLACEHOLDER] chip or striped image slot anywhere in the production build** (the build fails if one is present).
- [ ] Every "Still open" item in `HANDOFF.md` is resolved or its fallback applied.
- [ ] Privacy and Terms match `legal/`, with the contact email filled in and the legal review done.
- [ ] Calendly link set (or the intake form is live as the booking path).
- [ ] Stripe payment links and the LinkedIn URL are real.
- [ ] Jon has signed off the screens.
