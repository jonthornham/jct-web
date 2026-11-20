# Redirect map: old consultjct.com → new site

**Rule: no old URL may ever 404.** Every URL below must either still exist on the new site or answer with a permanent redirect (301/308) to a live page. A missing page must never become a dead end.

`new_url` stays **pending** until Jon names the 6 new pages. After that, fill this table and `SEO_INVENTORY.csv` together. Actions marked *decide* need Jon's call once Search Console data is in `docs/search-console/`.

Rows match `docs/SEO_INVENTORY.csv`.

## Host rules (site-wide)

| From | To | Note |
|---|---|---|
| `http://consultjct.com/*` | `https://www.consultjct.com/*` | One hop. Today it takes two. |
| `https://consultjct.com/*` | `https://www.consultjct.com/*` | Keep www as canonical (proposed; Jon to confirm) |
| `http://www.consultjct.com/*` | `https://www.consultjct.com/*` | |
| `/<path>/` (trailing slash) | `/<path>` | Matches today's behaviour |

## Page rules

| Old URL | Today | Proposed action | new_url |
|---|---|---|---|
| `/` | 200 | keep | pending |
| `/about` | 200 | keep | pending |
| `/business-consulting` | 200 | decide: keep, or 301 to the services page | pending |
| `/engineering-consulting` | 200 | decide: keep, or 301 to the services page | pending |
| `/pricing` | 200 | decide: keep, or 301 to services/contact | pending |
| `/contact` | 200 | keep | pending |
| `/contact/contact-complete` | 200 | 301 → contact page | pending |
| `/free-consult` | 200 | 301 → contact page (unless booking is one of the 6) | pending |
| `/free-consult/free-consult-complete` | 200 | 301 → contact page | pending |
| `/blog` | 200 | decide: 301 → about (or home) | pending |
| `/blog/the-beginning` | 200 | decide: 301 → about (founder story) | pending |
| `/privacy` | 200 | decide: keep as a footer page outside the 6 | pending |
| `/terms` | 200 | decide: keep as a footer page outside the 6 | pending |
| `/charts/beeswarmchart` | 200 | 301 → home (test page) | pending |
| `/charts/globechart` | 200 | 301 → home (test page) | pending |
| `/charts/linechart` | 200 | 301 → home (test page) | pending |
| `/charts/scatterplot` | 200 | 301 → home (test page) | pending |
| `/charts/*` (anything else) | 404 | 301 → home | pending |
| `/products` | 200 | 301 → home (stub) | pending |
| `/company/*` | 200 for any slug | 301 → home | pending |
| `/login` | 200 | 301 → home | pending |
| `/register` | 200 | 301 → home | pending |
| `/register-business` | 200 | 301 → home | pending |
| `/reset-password` | 200 | 301 → home | pending |
| `/account` | 200 | 301 → home | pending |
| `/documents` | 200 | 301 → home | pending |
| `/invoices` | 200 | 301 → home | pending |
| `/payment-success` | 200 | 301 → home | pending |
| `/payment-cancelled` | 200 | 301 → home | pending |
| `/services` | **404** (in live top nav) | 301 → services page | pending |
| `/partners` | **404** (in live footer) | 301 → home or about | pending |
| `/auth/register` | 404 | 301 → home | pending |

## New files the old site never had
- `/robots.txt`: allow all, with a `Sitemap:` line
- `/sitemap.xml`: the new pages only, www URLs
- `/favicon.ico` (404 today) and `/favicon.png` (200 today): keep both working

## Before cut-over (checklist for Session 2+)
1. Fill `new_url` for every row; no row left *pending* or *decide*.
2. Automated test: request every `old_url` in `SEO_INVENTORY.csv` against the new build. Each must return 200 or a single 301/308 to a URL that returns 200. Fail the build on any 404 or redirect chain.
3. Re-run after go-live against production.
