# Status

## Decisions (Jon, 2026-11-20)
- **Canonical host: www** (`https://www.consultjct.com`). Apex and http forward to it.
- **`/blog` and `/blog/the-beginning` → 301 to About.**
- **Privacy and Terms stay** as footer pages, outside the 6 main pages.
- **Analytics on the old site: none.** Search Console is the only traffic data.
- Old site: **Email/Password sign-in is OFF** in `jctconsulting-a2ed3` (done by Jon in the console). Nobody can sign in or register on the old site. The new site has no login.

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
- The 6 new page names → fill `new_url` in `docs/SEO_INVENTORY.csv` and `docs/REDIRECT_MAP.md`
- Search Console export → `docs/search-console/`

## Session 1 (2026-11-20): SEO inventory + old-site lockdown
- `docs/OLD_SITE_INVENTORY.md`, `docs/SEO_INVENTORY.csv` (38 rows), `docs/REDIRECT_MAP.md`
- JCT emulator port block (3xxxx) recorded in `CLAUDE.md`

Next (Session 2): scaffold the new site from the Lamp template; build the redirect test from `SEO_INVENTORY.csv`.
