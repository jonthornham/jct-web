# Assets

All images were supplied by Jon Thornham (taken from the current consultjct.com, the same files as the old repo's `static/`). No stock photos, no generated images, no people other than Jon.

## Wordmark (`wordmark/`)
| File | Use |
|---|---|
| `jct-wordmark-currentColor.svg` | **Inline this in code** (`fill="currentColor"`, colour `fg`), so it follows the theme. viewBox 0 0 441 161. Header and footer 22px tall |
| `jct-wordmark-light.svg` | #0B1220: for light backgrounds where CSS colour can't apply (emails, documents) |
| `jct-wordmark-dark.svg` | #EEF2F6: for dark backgrounds (OG images, dark theme where inlining isn't possible) |

Source: JCT's LogoMaster.svg, recoloured to one colour (the original is three blues). Minimum height 16px on screen. Clear space: half its height on every side. Don't stretch, outline or add effects.

## Favicon set (`favicon/`)
| File | Size |
|---|---|
| `favicon.ico` | 16, 32, 48 |
| `favicon.svg` | vector (modern browsers) |
| `favicon-32.png` | 32×32 |
| `apple-touch-icon.png` | 180×180, square (iOS rounds it) |
| `icon-512.png` | 512×512, for the web manifest |

Design: the "J" from the JCT logo in white on an ocean-blue (#006994) tile with rounded corners (radius 14/64). The full wordmark is too wide to read at 16px. Approved by Jon (Nov 20, 2026).

## Open Graph (`og/`), 1200×630 PNG
| File | Page | Alt / description |
|---|---|---|
| `og-home.png` | `/` | "JCT: From prototype to production, without hiring a VP." |
| `og-how-i-work.png` | `/how-i-work` | "How I Work: six stages from idea to growth." |
| `og-services.png` | `/services` | "Services & Pricing: Advisory $250/hr, Factory-Ready Sprint $7,500, Fractional Lead $6,000/mo, Fractional Partner $11,000/mo." |
| `og-work.png` | `/work` | "Case studies: Seltza, FLO Cycling, Global Seafood Exchange." |
| `og-about.png` | `/about` | "I'm Jon. I get physical products made." |
| `og-free-consult.png` | `/free-consult` | "Book a free 15-minute consult." |

Privacy, Terms and 404 use `og-home.png`. Fixed colours (not themed): background #070A0E, text #EEF2F6 / #A1ABB7, eyebrow #7DD3F0, CTA pill #007BA7. Text stays inside 1080×560. Each carries the page's H1 and its SEO description from the copy doc.

## Photos (`images/`): WebP for `<picture>`, JPG fallback
| Files | Size | Where | Crop | Suggested alt text | Source / licence |
|---|---|---|---|---|---|
| `seltza-tap.webp` / `.jpg` | 1040×1414 | Home hero; Work · Seltza | `cover`, `50% 40%`: 4:5 desktop, 4:3 tablet, 1:1 phone (hero); 4:5 (Work) | "The Seltza sparkling-water tap installed at a kitchen sink" | Seltza product photo supplied by Jon from consultjct.com. Use on this site approved by Jon (Nov 20, 2026) |
| `flo-64-as-disc.webp` / `.jpg` | 1000×1500 | Work · FLO | `contain` on a #FFFFFF plate with 6% padding, 4:5, **white in both themes** (studio shot on white) | "FLO 64 AS Disc carbon bicycle wheel" | FLO Cycling product photo (Jon co-founded FLO). Use approved by Jon (Nov 20, 2026) |
| `jon-thornham.webp` / `.jpg` | 1000×1000 | About (4:5, `40% 30%`); Free Consult (56px circle); OG About | | "Jon Thornham" (About); empty alt on Free Consult, where his name is printed beside it | Jon's own headshot, supplied by Jon |

Run lamp-web's image pipeline (`npm run images`) for 1× / 2× WebP at the rendered sizes. The supplied Seltza photo is 1040px wide: sharp at 1×, soft at 2× on the 1440 hero (≈470px column). A larger original would help.

## Logos (`logos/`)
| File | Use | Source |
|---|---|---|
| `seltza-logo-onlight.png` | logo strip and proof panel, light theme (#4E5866, i.e. `fg-muted`) | LogoSeltza.png from Jon, trimmed and recoloured to one colour |
| `seltza-logo-ondark.png` | same, dark theme (#A1ABB7) | as above |

**GSE:** the supplied GSELogo.svg is live text (Avenir Next, white), not outlined, so it isn't included. The screens set "GSE" as text (Avenir Next with Geist fallback, 600, `fg-muted`) until an outlined SVG arrives.
**FLO Cycling logo:** not supplied yet; shown as a [PLACEHOLDER] chip (needs a single-colour SVG).

Seltza logo use approved by Jon (Nov 20, 2026).

## Still needed (placeholders on the screens until they arrive)
| Item | Where | Format |
|---|---|---|
| Prototyping or 3D-print photo | How I Work, "What working together looks like" | 4:3, ≥1600px wide, JPG or PNG |
| Seltza CAD render | Work · Seltza, first small slot | 4:3, ≥1600px wide |
| Seltza sample or factory photo | Work · Seltza, second small slot | 4:3, ≥1600px wide |
| GSE web or iOS marketplace screenshot | Work · GSE | 16:9, ≥1920px wide |
| FLO Cycling logo | Home logo strip | single-colour SVG |
| GSE logo, outlined | Home logo strip, Work · GSE panel | single-colour SVG (the supplied file is live text) |
| Other client logos, with permission | Home logo strip | single-colour SVG |

If any is still missing at launch, remove its slot and let the layout close up (see HANDOFF).

Not used (retired per the copy doc): the paper-mill photos, the FEA plot, and the WestRock, International Paper, Acuren and JSC logos.
