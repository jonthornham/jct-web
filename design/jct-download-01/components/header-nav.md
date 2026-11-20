# Header, navigation and mobile menu

Images: `header-menu-open-390-light.png`, `header-menu-open-390-dark.png`; the header is at the top of every file in `../screens/`; the component sheet, section 10, shows 390 and 600 px.

## Spec
| Part | Value |
|---|---|
| Bar | height 64px; background `surface`; bottom border 1px `border`; `position: sticky; top: 0; z-index: 30` |
| Inner | max-width 1200px, centred, side padding `--spacing-mk-gutter`; flex row, `align-items: center`, gap 28px |
| Wordmark | `jct-wordmark-currentColor.svg` inlined, height 22px (≈60px wide), colour `fg`; link to `/`, `aria-label="JCT home"` |
| Tagline (≥1280px) | "Fractional product & operations for product startups"; 13px/1.25 Geist 400, `fg-muted`; left padding 14px, left border 1px `border-strong`; max-width 190px (wraps to 2 lines). Hidden under 1280px |
| Nav links | How I Work · Services · Work · About; 15px/500, `fg-muted`, gap 26px. Hover: `fg`, no underline. Current page: `fg`, 600, `aria-current="page"` |
| Theme toggle | Segmented: track `surface-2`, inset 1px `border` ring, padding 2px, gap 2px, radius 999. Three 28×28 buttons (System, Light, Dark), 15px stroke icons (1.4 stroke), `fg-muted`. Pressed: `surface` fill, `fg`, shadow `--shadow-seg`, `aria-pressed="true"`. Each has `aria-label` ("System theme" / "Light theme" / "Dark theme"). Persist to `localStorage['jct-theme']` |
| CTA | Button `primary`, size `sm` (40px tall, 18px side padding, 15px/600): "Book a free 15-minute consult" → `/free-consult` |
| Right group | `margin-left: auto`, gap 12px (6px under 900) |

## Behaviour
| Width | Layout |
|---|---|
| ≥1280 | wordmark + tagline · links · toggle · CTA |
| 900–1279 | tagline hidden; otherwise the same |
| 760–899 | wordmark · CTA (full label) · menu button. Links and toggle move to the menu |
| <760 (390) | wordmark · CTA with the short label **"Free Consult"** · menu button |

**Menu button:** 44×44, radius 999, transparent, `fg`; 22px icon (three 1.8-stroke lines; becomes an X when open). `aria-label` "Open menu" / "Close menu", `aria-expanded`.

**Mobile menu (sheet):** opens directly under the bar, full width, `surface`, bottom border 1px `border`, padding 8px top / 20px bottom; inner column, gap 16px.
- Link rows: 52px tall, 17px/500 `fg`, 1px `border` bottom rule, "→" at the right in `fg-subtle`; current page 600.
- Theme row: label "Theme" (15px `fg-muted`) left, segmented Light | Dark right (38px tall, 16px side padding, 15px/500).
- CTA: `primary`, 48px, full width, "Book a free 15-minute consult".
- Closes on Esc, on navigation and on a tap outside. Focus is trapped while open; focus returns to the menu button on close. Body scroll is locked.

## States
- Links: rest `fg-muted` → hover `fg` → active `fg` → focus 2px `focus` outline, offset 2px, radius 4px.
- Toggle buttons: rest / pressed (above) / focus ring as links. No disabled state.
- CTA: see `buttons.md`.

## Tokens used
`surface`, `surface-2`, `border`, `border-strong`, `fg`, `fg-muted`, `fg-subtle`, `primary`, `primary-hover`, `primary-fg`, `focus`.
