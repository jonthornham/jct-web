# Cards and content blocks

Image: `component-sheet-1440-*.png`, sections 02–05.

Every card: background `surface`, radius 18px, **inset 1px `border` ring** (`box-shadow: inset 0 0 0 1px`, not a CSS border), padding 28px unless stated. Cards are not clickable unless stated. No hover lift.

## Problem card (Home, "Sounds familiar?")
Padding 28px, column, gap 12px. Title `mk-title` (22/1.3, 600, `fg`); body `mk-body` (17/1.65) `fg-muted`. Grid: `repeat(auto-fit, minmax(min(100%, 300px), 1fr))`, gap 20px → 3-up at 1440, 1-up at 390.

## Offer card, compact (Home, "What I do")
The whole card is a link to `/services`. Padding 26px, column, gap 18px. Name `mk-title`; price Geist Mono 600, 28px, `letter-spacing: -0.02em`, tabular; unit ("/hr", "/mo") and "from " in Geist 15px/500 `fg-muted`. Line `mk-body` `fg-muted`. Bottom: arrow link "Services & Pricing →" (pinned with `margin-top: auto`). Hover: ring becomes `border-strong`; focus: 2px `focus` outline on the card. Same grid as the problem cards.

## Offer card, full (Services)
Padding 26px, column, gap 18px, stretch to equal height.
- Name `mk-title`; price Geist Mono 600, **36px**, line-height 1.1; unit in Geist 15px/500 `fg-muted`; time line ("5 weeks", "about 4 days a month") Geist Mono 14px `fg-muted`.
- "For …" line: `mk-ui` (15px) `fg-muted`.
- Check list: gap 10px; rows are a 20px icon column + text 16px/1.5 `fg`; check icon 20px, 1.8 stroke, `primary`, offset 2px down.
- Button pinned to the bottom, full width: secondary, except "Start a Sprint" (primary).
- Grid: 4 columns ≥1180px, 2 columns 760–1179px, 1 column <760px; gap 16px.

## Free Consult band (Services, step one)
The offer card laid out in a row: `grid-template-columns: auto 1fr auto`, gap 16px × 28px, centred. Background `primary-soft`, **inset 1.5px `primary` ring**. Left: "Free Consult" (`mk-title`) over "Free · 15 minutes" (Geist Mono 14px `fg-muted`), min-width 180px. Middle: line (`mk-body` `fg-muted`). Right: primary button. Under 760px it stacks into one column and the button stays its natural width.

## Step card (Home, "How it works")
Card, column, gap 16px: step number (28×28 square, radius 8, `primary-soft` fill, Geist Mono 14px/600 `accent-text`), title `mk-title`, body `mk-body` `fg-muted`. Same 3-up grid. It's an `ol`.

## Stage card + rail (How I Work) — see `section-layouts.md` "Stage rail"

## Case-study block (Work)
- Eyebrow "Case study · {name}" (`mk-eyebrow`), H2 (`mk-h2`), then a `dl`:
  - each row: grid `160px 1fr`, gap 10px × 28px, padding 18px 0, top border 1px `border` (the last row also has a bottom border);
  - `dt`: 13px/600, `letter-spacing: .12em`, uppercase, `fg-muted`, padding-top 4px;
  - `dd`: `mk-body` `fg`; lists use the check list above.
- Result chips: min-height 30px, padding 4px 12px, radius 999, `surface-2`, inset 1px `border` ring, 14px/500 `fg`; wrap with gap 8px.
- Media column: main image at 4:5, radius 24, inset 1px `border` ring, `object-fit: cover`; under it two 4:3 image slots (gap 16px, side by side down to 336px); a slot with no photo at launch is removed and the main image stands alone.
- Layout: 2-up (6fr text / 5fr media, gap `clamp(32px, 5vw, 72px)`), alternating text-left (Seltza, GSE) and media-left (FLO). Under 1000px: one column, text first, media second.
- At 390 the `dl` rows stack (label above value, gap 6px).

## Quote panel (Home proof, Work · Seltza)
Background `surface-2`, radius 24px, inset 1px `border` ring, padding `clamp(28px, 4.5vw, 56px)`; column, gap 20px.
- Quote mark: Geist Mono 48px, `accent`, line-height .6, `aria-hidden`.
- Quote: `blockquote`, `clamp(20px, 16.8px + .6vw, 24px)`, line-height 1.45, 500, `letter-spacing: -0.01em`, `fg`.
- Attribution: 44px initials avatar ("DW"; `surface-3`, `fg-muted`, 15px/600, `aria-hidden`), name 15px/600 `fg`, role 14px `fg-muted`. No client photo.

## Home proof panel (Seltza)
A `surface-2` panel (radius 24px, inset ring, padding `clamp(28px, 4.5vw, 56px)`) with two equal columns (gap `clamp(32px, 5vw, 72px)`), stacking under 1000px: left = Seltza logo (24px tall), H2, body, arrow link; right = the quote (as above, without the panel).

## Logo strip (Home)
Proof line (`mk-ui` `fg-muted`), then logos in a wrapping row: gap 20px × 48px (20px × 32px under 760), each **30px tall** (24px under 760), single colour `fg-muted`: `seltza-logo-onlight.png` on light, `seltza-logo-ondark.png` on dark. Text logos (GSE) are 22px/600 (18px under 760) in `fg-muted`. Section padding `clamp(40px, 5vw, 56px)` top and bottom.

## Hero float card (Home hero image)
Positioned 20px in from the left, right and bottom of the hero image: `surface`, radius 18px, padding 16px 18px, ring + `--shadow-raised`; row: Seltza logo 18px tall, then a 1px `border-strong` divider and "From a simple idea to a profitable business" (14px `fg`).
