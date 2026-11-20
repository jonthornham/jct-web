# Status

## Session 1 (2026-11-20): SEO inventory + old-site lockdown

Done:
- `docs/OLD_SITE_INVENTORY.md`: routes, forms, collections, functions, storage, analytics, host
- `docs/SEO_INVENTORY.csv`: one row per old URL (38 rows); Search Console columns blank
- `docs/REDIRECT_MAP.md`: proposed action per URL; `new_url` pending
- Old repo PR [JCTConsulting-Web#1](https://github.com/jonthornham/JCTConsulting-Web/pull/1): Firestore deny-all plus `users/{uid}` create-only; emulator tests 43/43. **Not deployed.**
- JCT emulator port block recorded in `CLAUDE.md`

Waiting on Jon:
- The 6 new page names → fill `new_url`
- Search Console export → `docs/search-console/`
- Merge and deploy the rules PR (command in the PR)
- Rotate the leaked delete-account password on Vercel, or turn off the old login (see inventory, Security notes)
- Confirm www as canonical host

Next (Session 2): scaffold the new site from the Lamp template; build the redirect test from `SEO_INVENTORY.csv`.
