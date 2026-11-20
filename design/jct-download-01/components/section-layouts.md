# Section layouts

Every page: header → `main` → footer, all on `canvas`. Sections never alternate background colours; they're separated by a **1px `border` top rule**.

## Container and section
| Token | Value |
|---|---|
| Content width | max 1200px, centred |
| Gutter | `clamp(20px, 4vw, 40px)` each side (20px at 390, 40px at 1440) |
| Section padding | `clamp(56px, 7vw, 88px)` top and bottom (56px at 390, 88px at 1440) |
| Section head | max-width 736px (46rem), column, gap 14px, margin-bottom `clamp(28px, 4vw, 48px)`: optional eyebrow + H2 |

## Page header (non-Home pages)
Padding top `clamp(40px, 6vw, 88px)`; eyebrow (`mk-eyebrow`, the page name), H1 (`mk-h1`, max-width ≈ 800–830px), lead (`mk-lead` `fg-muted`, max-width 736px); gap 20px.

## Home hero
2-up: `minmax(0, 6fr) minmax(0, 5fr)`, gap `clamp(32px, 5vw, 72px)`, `align-items: center`.
- Left column (gap 24px): eyebrow (the tagline), H1 at `mk-hero` (44px at 390 → 72px at 1440, line-height 1, tracking −0.05em), lead (max-width 576px), buttons (primary + ghost, margin-top 8px).
- Right: image frame radius 24px, inset ring, aspect **4:5** (≥1000px), **4:3** (760–999px), **1:1** (<760px), `object-fit: cover`, `object-position: 50% 40%`, with the float card.
- Under 1000px: one column, text first.

## Feature 2-up (How I Work "working together", Work case studies, About, FAQ)
Same 2-up. Variants: `5fr / 6fr` reversed (media left), `4fr / 8fr` (FAQ, About background: heading left, content right), `5fr / 7fr` (About hero, Free Consult). All become one column under 1000px.

## Grids
`repeat(auto-fit, minmax(min(100%, 300px), 1fr))`, gap 20px, for the 3-up card rows. Offers: fixed 4 / 2 / 1 columns at ≥1180 / 760–1179 / <760.

## Stage rail (How I Work)
An `ol` of six stages.
- **≥1180px:** 6 columns, gap 16px. Each stage: a 40px row with the node, then the card (gap 16px). The rail is a 2px `border-strong` line through the node centres, running from each node to the next (16px past the column edge); the last stops at its own column.
- **760–1179px:** 3 columns, row gap 28px; the rail stops at the end of each row.
- **<760px:** one column; each stage is a `40px 1fr` grid, gap 16px, 16px bottom padding; the rail runs vertically from node to node at x = 19px (no rail after the last).
- **Node:** 40px circle, `surface` fill, inset 2px `primary` ring, Geist Mono 14px/600 `accent-text`, "01"–"06".
- **Card:** padding 22px, column, gap 12px: icon tile (36px, radius 10, `primary-soft`, 20px stroke icon at 1.6 in `accent-text`), name (20px/1.25, 600, tracking −0.01em), copy (`mk-ui` `fg-muted`). Icons: target (Validate), pencil (Design), cube (Prototype), factory (Source), three boxes (Produce), trend arrow (Grow). Stroke icons from any 24px set (Lucide equivalents: `target`, `pencil`, `box`, `factory`, `boxes`, `trending-up`).

## Week track (Services, Sprint)
- **≥760px:** 5 columns, gap 8px. Row 1: column heads "Week 1"–"Week 5" (Geist Mono 13px/500 `fg-subtle`, padding 0 4px 8px, bottom border 1px `border`). Row 2: blocks: Week 1 (col 1), Weeks 2–3 (cols 2–3), Week 4, Week 5.
- **Block:** `surface`, radius 14px, inset ring, padding 18px, column, gap 8px: a 6px bar (radius 999, `primary`), label (Geist Mono 13px/600 `accent-text`), copy (`mk-ui` `fg`).
- **<760px:** one column, heads hidden.
- Below the track: the "You leave with…" line (`mk-body` `fg-muted`, max 704px) and "Start a Sprint", `space-between`, wrapping.

## Callout ("Not included", "What I'm not")
- **Not included (Services):** `surface-2`, inset 1px `border-strong` ring, radius 14px, padding 22px 24px, max-width 960px; info icon 20px `fg-muted`; bold lead "Not included:" in `fg`, then `fg-muted` text.
- **What I'm not (How I Work):** a `surface-2` card (radius 18px, padding `clamp(24px, 3.5vw, 40px)`, max-width 896px): title `mk-title`, then `mk-body` `fg-muted`.

## Closing CTA (Home only)
Inside the container: background `primary`, text #FFFFFF, radius 24px, padding `clamp(32px, 5vw, 64px)`; grid `1fr auto`, gap 28px × 48px, `align-items: end`. H2 `mk-h2` white; lead `mk-lead` at 90% white; onPrimary button. Under 1000px: one column. Section padding: 0 top, `mk-section` bottom.

## Page end (How I Work, Services, Work, About, Privacy, Terms, 404 has its own)
A `surface-2` panel inside a section: radius 24px, inset ring, padding `clamp(28px, 4.5vw, 56px)`, flex wrap `space-between`, gap 24px × 48px: H2 at `mk-h3`, line `mk-body` `fg-muted` (max 640px), primary CTA.

## Legal pages (Privacy, Terms)
Page header (eyebrow "Privacy" / "Terms", H1 "Privacy policy" / "Terms of service"), then a single prose column, max-width 704px (44rem): "Last updated November 20, 2026" (`mk-ui` `fg-muted`), H2s at `mk-title` with 16px extra top margin, paragraphs `mk-body`, gap 20px, bold lead-ins in `fg` 600, inline links in `link`. Then the page end and footer. The text is in `legal/`.

## 404
Padding `clamp(64px, 9vw, 128px)` top and bottom; "404" eyebrow in Geist Mono; H1; lead; a row of jump chips (Home, How I Work, Services, Work, About); the primary CTA.
