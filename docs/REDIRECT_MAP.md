# Redirect map: old consultjct.com → new site

**Approved by Jon, Nov 20, 2026** (by pasting the Session 2b brief). Built in Session 2b.

**Rule: no old URL may ever 404.** Every URL below must either still exist on the new site or answer with a permanent redirect (301/308) to a live page. A missing page must never become a dead end.

- The redirects live in `src/lib/seo/redirects.js`. The build writes them into Vercel's routing (`scripts/vercel-output.js`). All are 301, one hop.
- `npm run test:seo` checks every row of `SEO_INVENTORY.csv` against the build, plus the trailing-slash form of each and extra wildcard paths.

Rows match `docs/SEO_INVENTORY.csv`.

## Host rules (site-wide)

| From | To | Note |
|---|---|---|
| `http://consultjct.com/*` | `https://www.consultjct.com/*` | Vercel always upgrades http → https on the same host first, so this stays two hops (http → https apex → www). Vercel platform behaviour; not settable in code. |
| `https://consultjct.com/*` | `https://www.consultjct.com/*` | www is canonical (Jon, Nov 20). Vercel domain setting |
| `http://www.consultjct.com/*` | `https://www.consultjct.com/*` | Vercel, automatic |
| `/<path>/` (trailing slash) | `/<path>` | 308, in the build's routing. An old URL with a slash goes straight to its final page |

## Page rules

| Old URL | Today | Action | new_url |
|---|---|---|---|
| `/` | 200 | keep | `/` |
| `/about` | 200 | keep | `/about` |
| `/business-consulting` | 200 | 301 | `/services` |
| `/engineering-consulting` | 200 | 301 | `/services` |
| `/pricing` | 200 | 301 | `/services` |
| `/contact` | 200 | 301 | `/free-consult` |
| `/contact/contact-complete` | 200 | 301 | `/free-consult` |
| `/free-consult` | 200 | keep | `/free-consult` |
| `/free-consult/free-consult-complete` | 200 | 301 | `/free-consult` |
| `/blog` | 200 | 301 | `/about` |
| `/blog/the-beginning` | 200 | 301 | `/about` |
| `/privacy` | 200 | keep | `/privacy` |
| `/terms` | 200 | keep | `/terms` |
| `/charts/beeswarmchart` | 200 | 301 | `/` |
| `/charts/globechart` | 200 | 301 | `/` |
| `/charts/linechart` | 200 | 301 | `/` |
| `/charts/scatterplot` | 200 | 301 | `/` |
| `/charts/*` (anything else) | 404 | 301 | `/` |
| `/products` | 200 | 301 | `/` |
| `/company/*` | 200 for any slug | 301 | `/` |
| `/login` | 200 | 301 | `/` |
| `/register` | 200 | 301 | `/` |
| `/register-business` | 200 | 301 | `/` |
| `/reset-password` | 200 | 301 | `/` |
| `/account` | 200 | 301 | `/` |
| `/documents` | 200 | 301 | `/` |
| `/invoices` | 200 | 301 | `/` |
| `/payment-success` | 200 | 301 | `/` |
| `/payment-cancelled` | 200 | 301 | `/` |
| `/services` | **404** (in live top nav) | new page | `/services` |
| `/partners` | **404** (in live footer) | 301 | `/work` |
| `/auth/register` | 404 | 301 | `/` |

## New files the old site never had
- `/robots.txt`: allow all, with a `Sitemap:` line
- `/sitemap.xml`: the new pages only, www URLs
- `/favicon.ico` (404 today) and `/favicon.png` (200 today): keep both working

## Before cut-over
1. ~~Fill `new_url` for every row; no row left *pending* or *decide*.~~ Done in Session 2b.
2. ~~Automated test~~ Done: `npm run test:seo` (also in CI). Automated test: request every `old_url` in `SEO_INVENTORY.csv` against the new build. Each must return 200 or a single 301/308 to a URL that returns 200. Fail the build on any 404 or redirect chain.
3. Re-run after go-live against production.
