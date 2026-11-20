# Old site inventory: consultjct.com (2024 build)

Source: `~/Development/JCT/reference/jctconsulting-web` (SvelteKit 1, Svelte 3, last commit `a7af2f2`, June 2024).
Live checks: public `curl` of https://consultjct.com on 2026-11-20. No consoles, Admin SDK or gcloud were used.

## Hosting and canonical host

| Item | Finding |
|---|---|
| Host | **Vercel** (`server: Vercel`, `adapter-auto`). Firebase Hosting is not used (`firebase.json` has no `hosting` block). |
| Canonical host | **www**: `https://consultjct.com/*` → 308 → `https://www.consultjct.com/*` |
| HTTP | `http://www.` → 308 → `https://www.`; `http://` apex → 308 → `https://` apex → 308 → www (two hops) |
| Trailing slash | `/about/` → 308 → `/about` |
| `<link rel="canonical">` | None on any page |
| robots.txt | **404** (none) |
| sitemap.xml | **404** (none) |
| Robots meta / `X-Robots-Tag` | None, so every 200 page is indexable |
| Rendering | Server-side rendered, **but the server HTML of every route is the same loading spinner** (title "JCT Consulting", no description, no H1). Real content appears only after JavaScript runs and the Firebase Auth check finishes. Google has to render JS to see any content. |
| Unknown paths | Real 404 (e.g. `/this-page-does-not-exist-xyz`) |
| Firebase project | `jctconsulting-a2ed3` (browser config in `src/lib/firebase.js`) |

## Routes (from `src/routes`)

28 page routes (27 static, 1 dynamic). No `+server.js` API endpoints, no `hooks.server.js`, and no form actions. There is one server `load`, in `+layout.server.js` and `account/+layout.server.js`. All 28 return **200** live, including the login-only pages: they render a spinner, then a blank page when logged out.

### Public marketing pages (in nav or footer)
| Route | Notes |
|---|---|
| `/` | Home |
| `/about` | |
| `/business-consulting` | |
| `/engineering-consulting` | |
| `/pricing` | |
| `/blog` | 1 real post plus template placeholder posts |
| `/blog/the-beginning` | Only post. Body is placeholder text |
| `/contact` | Contact form |
| `/free-consult` | "Book Now" form (top-nav CTA) |
| `/privacy`, `/terms` | Footer |

### Form result pages
`/contact/contact-complete`, `/free-consult/free-consult-complete`

### Test / demo pages (look like leftovers)
`/charts/beeswarmchart`, `/charts/globechart`, `/charts/linechart`, `/charts/scatterplot` (D3 demos with sample data), `/products` ("Hello Products" stub), `/company/[slug]` (dynamic; any slug returns 200; marketplace template leftover)

### Login / account pages
`/login`, `/register`, `/register-business`, `/reset-password`, `/account`, `/documents`, `/invoices`, `/payment-success`, `/payment-cancelled`

### Linked but missing (404 today)
- `/services`: in the **live top nav**
- `/partners`: in the live footer
- `/auth/register`: listed in `src/config.js` publicLinks, never built
- Unused nav component `TopNavCompany.svelte` also links `/team`, `/demo`, `/marketplace`, `/web`, `/mobile`, `/sustainability` and globalseafoodexchange.com. It is not rendered, so these links are not live.

## Forms

| Form | Where | What it does | Firestore writes |
|---|---|---|---|
| Contact | `/contact` | Calls callable Cloud Function `email-sendEmail` (template `contact`) → SendGrid emails Jon **and the address typed in**. Then goes to `/contact/contact-complete`. | **none** |
| Free consult | `/free-consult` | Same function, template `freeConsult` | **none** |
| Register | `/register`, `/register-business` | Firebase Auth `createUserWithEmailAndPassword`, then creates `users/{uid}` (firstName, lastName, email, phoneNumber, businessName, logoUrl, website, deleteAccount, accountType). Trigger `users-userOnCreate` sends a SendGrid welcome email. | `users/{uid}` |
| Login / reset | `/login`, `/reset-password` | Firebase Auth only | none |
| Account area (login needed) | `/account`, `/documents`, `/invoices` | Profile edits, bank accounts, business addresses, documents, invoices, reviews, bookings, Stripe checkout | `users/*` and subcollections, `documents`, `invoices`, `reviews`, `bookings`, `users/{uid}/checkout_sessions` |

Lockdown of `jctconsulting-a2ed3` rules: PR https://github.com/jonthornham/JCTConsulting-Web/pull/1 (not deployed).

## Firestore collections named in the old rules
`abuse-reports, blog, conversations(+messages), listings, offers, orders, reviews, documents, bookings, seafoods, timers, users(+businessAddresses, bankAccounts, conversations, checkout_sessions, subscriptions, payments), products(+prices, tax_rates), invoices`. Most are marketplace-template leftovers. `blog` and `timers` were world-writable.

## Cloud Functions (`functions/`, Node 18)
- `email-sendEmail`: callable, SendGrid. No captcha or rate limit, and it emails any address typed into the form.
- `users-userOnCreate`: Firestore trigger, welcome email.
- SendGrid key is read from `functions.config()`. Errors go to Sentry.

## Storage
- Bucket `jctconsulting-a2ed3.appspot.com`. Rules are already deny-all.
- Used by the account area (`uploadAvatar`, `uploadFile`, `deleteFile`) and a hard-coded default avatar token URL.
- Public images are served from `/static` on Vercel (logos, `Jon.jpg`, `favicon.png`, etc.).

## Payments
Stripe.js with a **test** publishable key. The `@invertase/firestore-stripe-payments` client and the `products`/`checkout_sessions` collections point to the "Run Payments with Stripe" extension. Not used by public pages.

## Analytics
**None found.** No GA4/UA/GTM/Ads IDs, Vercel Analytics, Plausible, Hotjar or Clarity, either in source or in the live HTML. So the only traffic data will be the Search Console export.

## Security notes (old site, live today)
1. `+layout.server.js` sends the `PRIVATE_DELETE_ACCOUNT_PASSWORD` env value to the browser. It is in the HTML of every page. Account deletion sets the user's password to that value, so it unlocks any "deleted" account. **Rotate it in Vercel or turn off the old login.** (The value is deliberately not written here; this repo is public.)
2. Firestore rules are open (see PR above).
3. `email-sendEmail` can be used to send JCT-branded email to any address.

## Assets worth keeping for the new site
`static/`: `LogoMaster.svg/.webp`, `Jon.jpg`, `JonBusiness.png`, client logos (`LogoAcuren`, `LogoInternationalPaper`, `LogoWestRock`, `LogoJSCEngineers`, `LogoSeltza`, `LogoCaliandRicky`), `Plant.JPG`, `PaperRoll1.png`, `FEA.png`, `Inventor.png`, `favicon.png`.
