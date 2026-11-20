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
