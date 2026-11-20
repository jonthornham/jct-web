# Placeholders and image slots (preview builds only)

Image: component sheet section 09; amber chips and striped slots on the screens.

## [PLACEHOLDER] chip
Marks a missing fact, proposed copy, or a logo still to come.
- Inline; Geist Mono, 0.8125em, 500; text `warning`; bg `warning-soft`; 1px dashed `warning-solid` outline (offset −1px); radius 4px; padding 1px 6px; `box-decoration-break: clone`.
- Text always starts "[PLACEHOLDER: …]".
- **Rule:** render only when `PUBLIC_SHOW_PLACEHOLDERS=true` (preview). A production build with any placeholder left must fail (`npm run check`).

## Image slot
A photo that hasn't arrived, at its final size and crop.
- Stripes: `repeating-linear-gradient(135deg, surface-2 0 12px, surface-3 12px 24px)`; radius 18px; inset 1px `border` ring; min-height 120px; content at bottom-left, 14px padding.
- Label: Geist Mono 12px/1.4 `fg-muted` on `surface` with an inset 1px `border` ring, radius 6px, padding 4px 8px: "[PLACEHOLDER] …".
- Same production rule as the chip. At launch, each slot either has its photo or the layout drops it (see HANDOFF open questions).

The stripes are the only pattern on the site. They're not a gradient fill and never ship.
