# jct-web: JCT Consulting site rebuild (consultjct.com)

Jon is an engineer, not a web developer. Report in plain words.

## Paths
| What | Where | Access |
|---|---|---|
| This repo | `~/Development/JCT/jct-web` = `jonthornham/jct-web` (**public**) | read/write via branches + PRs |
| Old site | `~/Development/JCT/reference/jctconsulting-web` = `jonthornham/JCTConsulting-Web` (private) | read-only reference; PRs only when a session asks |
| Template | `~/Development/Lamp/reference/lamp-web` | read-only |
| Old Firebase project | `jctconsulting-a2ed3` (live, used by old site on Vercel) | never read/write production |
| New Firebase project | `jct-web-d8780` | do not use until a session says so |
| Emulator project | `demo-jct` | the only project used locally |

The old site is SvelteKit on **Vercel**, canonical host **www.consultjct.com**. The new site will have 6 pages; Jon supplies the names. See `docs/`.

**New site on Vercel:** Jon set the new Vercel project's Node.js version to **24.x** (Settings → Build and Deployment, Nov 20). It matches `engines`, `.nvmrc` and the adapter's `runtime: 'nodejs24.x'`. Preview deploys have `PUBLIC_SHOW_PLACEHOLDERS=true` (Preview only, never Production).

## Scripts
| Command | What it does |
|---|---|
| `npm run dev` / `dev:preview` | Dev server on 35173 (`dev:preview` shows placeholders) |
| `npm run build` / `build:preview` | Production build (fails on any placeholder) / preview build |
| `npm run preview` | Serve the last build on 34173 |
| `npm run lint` | Prettier + ESLint |
| `npm run check` | `check:code` (svelte-check, label-config test) + `check:placeholders` (production rule) |
| `npm run test:unit` | Unit tests (`tests/unit`) |
| `npm run test:seo` | Builds, then the SEO registry, built head tags, every old URL in `docs/SEO_INVENTORY.csv` (200 or one permanent redirect), and the link check |
| `npm run check:links` | Internal link check on the last build |
| `npm run lighthouse` | Lighthouse on all 8 pages of the last build: SEO 100, Accessibility 100, Performance ≥ 90 |
| `npm run images` / `screenshots` | Image pipeline / design-vs-build screenshots (`--set shell\|pages`, `--tag before\|after`) |

CI (`.github/workflows/ci.yml`) runs lint, check:code, the placeholder check (a warning on PRs, a failure on `main`), unit, test:seo, the link check and Lighthouse on every PR.

SEO lives in `src/lib/seo/` (`registry.js` for head tags, sitemap and robots.txt; `redirects.js` for old URLs). `scripts/vercel-output.js` writes the redirects and `X-Robots-Tag: noindex` for every host except `www.consultjct.com` into Vercel's routing at build time.

Page copy lives in `src/lib/content/` (one file per page), UI labels in `src/lib/config/labels.js`, links and facts in `src/lib/config/site.js`. A link Jon hasn't sent is a `[PLACEHOLDER: …]` string in `site.js` (rendered by `MissingLink.svelte`; never `href="#"`).

## Safety rules (always)
- Branches and PRs only. Never commit to `main` directly.
- Merge only on Jon's word: `gh pr merge N --merge --match-head-commit <head>`. Never `--force`.
- No deploys. No production reads or writes (Firebase consoles, Admin SDK, gcloud) on any project.
- Never commit secrets: `.env`, service accounts, Mailjet or SendGrid keys. This repo is public; also keep leaked values from the old site out of docs.
- Never `rm` outside this repo or the session scratchpad. List temp files; delete only on Jon's go.
- Never stop another project's emulators (Lamp, Wingbeat, VE). Check only JCT's own ports.
- If a permission prompt shows a command Jon can't read, he answers No. Explain it in plain words.
- SEO rule: **no old URL may ever 404.** See `docs/REDIRECT_MAP.md`.

## Emulator ports (JCT block = 3xxxx)
Picked on 2026-11-20. Nothing was listening on 30000–39999. Lamp uses the 2xxxx block (28180/29399/29299/25101/24410/24510/24010). Another local project is using 1xxxx (14400, 14500, 15001, 18080, 19099, 19150, 19199).

| Service | Port |
|---|---|
| Firestore | 38180 |
| Firestore websocket | 39150 |
| Auth | 39399 |
| Storage | 39299 |
| Functions | 35101 |
| Eventarc | 39499 |
| Cloud Tasks | 39599 |
| Hub | 34410 |
| Logging | 34510 |
| Emulator UI | 34010 |
| Hosting (if used) | 35000 |
| Vite dev / preview | 35173 / 34173 |

The old repo's `firebase.json` (rules tests) already uses this block. This repo's `firebase.json` (Session 2) must use it too, always with `--project demo-jct`.
Check a port before starting: `lsof -nP -iTCP:<port> -sTCP:LISTEN`. Only stop processes on these ports.
