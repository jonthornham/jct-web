# Launch steps (Free Consult form, email, App Check, Google Analytics)

For Jon, in order. Each step is a click path or a command. Commands run in Terminal from the repo
(`cd ~/Development/JCT/jct-web`) and always name the production project, `jct-web-d8780`.
Nothing here is done by Claude: these steps touch production.

Before step 1, sign in to the Firebase command line once: `firebase login` (it opens the browser).

## 1. Firestore database (check first)
1. Firebase console → project **jct-web-d8780** → **Firestore Database**.
2. If it shows a database, note its location and go to step 2.
3. If not: **Create database** → **Production mode** → location **nam5 (United States)** → **Create**.
4. The email function must run in the database's region. The code uses `us-central1`, which goes
   with `nam5`. If the database is anywhere else, change one line in `functions/index.js`:
   `export const REGION = 'us-central1';` to that location's region (for example `us-east1` for a
   `us-east1` database), in a PR, before step 6.

## 2. Firebase web config on Vercel (done)
The six `VITE_FIREBASE_*` values are on Vercel for **Production and Preview** (Jon, Nov 20).
Nothing to do; check they're there: Vercel → jct-web → Settings → Environment Variables.

## 3. Mailjet: verify consultjct.com (SPF and DKIM)
1. Mailjet → **Account settings** → **Senders & domains** → **Add domain** → `consultjct.com`.
2. Mailjet → Senders & domains → consultjct.com → **Setup SPF/DKIM authentication**. It shows two
   DNS records:
   - **SPF:** a TXT record on `consultjct.com` that includes `include:spf.mailjet.com`.
     A domain may have only **one** SPF record. If consultjct.com already has one (`v=spf1 …`,
     for example for your email provider), add `include:spf.mailjet.com` to it, before the
     `~all` or `-all`; don't add a second record.
   - **DKIM:** a TXT record named `mailjet._domainkey.consultjct.com` with the value Mailjet shows.
3. Add both where consultjct.com's DNS is managed, then Mailjet → **Check now** until both show
   green (DNS can take up to a few hours).
4. Mailjet → Senders & domains: make sure **jon@consultjct.com** is listed as an active sender
   (it is the email's From).

## 4. Mailjet API key → Firebase secrets
1. Mailjet → **Account settings** → **REST API** → **API Key Management** → **Create a sub-account
   API key**, name it `jct-web` (its own key, so it can be revoked without touching anything else).
   Copy the **API key** and the **Secret key**.
2. Set both as Firebase secrets. Each command asks for the value; paste it at the prompt
   (never in a file, an email or a chat):
   ```
   firebase functions:secrets:set MAILJET_API_KEY --project jct-web-d8780
   firebase functions:secrets:set MAILJET_SECRET_KEY --project jct-web-d8780
   ```
   The first time, it asks to turn on Secret Manager: answer **Yes**.

## 5. App Check (reCAPTCHA Enterprise)
1. Google Cloud console, project **jct-web-d8780** → Security → **reCAPTCHA** → enable the
   reCAPTCHA Enterprise API if asked → **Create key**: type *Website*, domains
   `www.consultjct.com` and `consultjct.com` (add the Vercel preview domain only if previews should
   pass App Check) → no "checkbox challenge" → **Create**. Copy the **key ID**.
2. Firebase console → **App Check** → **Apps** → the web app → **reCAPTCHA Enterprise** → paste the
   key ID → keep the token time to live at 1 hour → **Save**.
3. Vercel → jct-web → Settings → Environment Variables → **Add**: `VITE_APPCHECK_SITE_KEY` = the
   key ID, Environment **Production** (and **Preview** if step 1 added the preview domain) → Save.
4. Leave enforcement **off** for now (step 11). Firebase console → App Check → **APIs** →
   **Cloud Firestore** shows the share of verified requests.

## 6. Deploy the rules, then the function (dry run first)
Each dry run checks and builds without changing anything. Run the real deploy only if its dry run
ends without errors.
```
firebase deploy --only firestore:rules --project jct-web-d8780 --dry-run
firebase deploy --only firestore:rules --project jct-web-d8780

firebase deploy --only functions --project jct-web-d8780 --dry-run
firebase deploy --only functions --project jct-web-d8780
```
The first function deploy asks to turn on Cloud Functions, Cloud Build, Artifact Registry, Eventarc
and Secret Manager: answer **Yes**. It may also ask about a clean-up policy for old build images:
answer **Yes** with the default (1 day).

## 7. Google Analytics 4
1. https://analytics.google.com → **Admin** (gear, bottom left) → **Create** → **Property**:
   name `JCT Consulting`, time zone **United States, Los Angeles** (Pacific), currency **US dollar**
   → **Next** → fill in the business details → **Create**.
2. **Choose a platform: Web** → Website URL `https://www.consultjct.com`, stream name
   `www.consultjct.com` → leave **Enhanced measurement on** (its "Page changes based on browser
   history events" counts page views when visitors move between pages) → **Create stream**.
3. Copy the **Measurement ID** (`G-…`) at the top right of the stream.
4. Vercel → jct-web → Settings → Environment Variables → **Add**: `VITE_GA_MEASUREMENT_ID` = the
   `G-…` ID, Environment **Production only** (not Preview, not Development) → **Save**.
   The site loads Analytics only on www.consultjct.com anyway; Production only keeps the ID out
   of preview builds too.
5. Turn off Google signals: Admin → **Data collection and modification** → **Data collection** →
   **Google signals data collection** → off.
6. Turn off ads personalisation: same page → **Advanced settings to allow for ads
   personalization** → turn it **off for all regions**.
7. Don't link Google Ads or any other product.
8. Optional: Admin → **Events** → after the first form request on www (step 10), mark
   `consult_submitted` as a **key event** to see it in the reports.

## 8. Redeploy on Vercel
The new variables reach the site only with a new build: Vercel → jct-web → **Deployments** → the
latest → **⋯** → **Redeploy**. (Production stays blocked by placeholders until launch; the preview
build is the one to test in step 9.)

## 9. End-to-end test on a preview link
1. Open the latest **Preview** deployment of this branch (Vercel → Deployments → Visit; it is
   behind Vercel's login).
2. The form shows only when Calendly can't, so block Calendly for this tab: in Chrome, **View →
   Developer → Developer Tools** → **⋮** (top right of the tools) → **More tools** → **Network
   request blocking** → tick **Enable network request blocking** → **+** → `*calendly.com*` →
   **Add**. Keep the tools open, go to /free-consult and reload: the form appears after about
   8 seconds. (Untick it afterwards.)
3. Send one request with your own details.
4. Check: the email arrives at jon@consultjct.com with your address as Reply-To; Firebase console
   → Firestore → `consults` has the document with **emailedAt** set (not **emailError**).
5. Analytics does **not** load on previews, by design: nothing shows in GA from this test.

## 10. After cutover: the same test on www
1. On **https://www.consultjct.com/free-consult**, block Calendly as in step 9.2, send one request
   again, and check step 9.4 again.
2. GA → **Reports** → **Realtime**: your visit shows, and `consult_submitted` appears under
   events within a minute or two.

## 11. About a week after launch: enforce App Check
Once Firebase console → App Check → APIs → Cloud Firestore shows real traffic as verified (close to
100% for about a week): **Enforce** → **Confirm**. Unverified requests are then refused.
