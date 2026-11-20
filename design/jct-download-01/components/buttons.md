# Buttons

Image: `component-sheet-1440-light.png` / `-dark.png`, section 01 (every state, side by side).

All buttons are pills (radius 999), Geist 600, `white-space: nowrap`, icon gap 8px, transition on background/box-shadow/colour 150ms. Links styled as buttons (`<a>`) for navigation; `<button>` for form submit.

## Sizes
| Size | Height | Side padding | Text |
|---|---|---|---|
| `mk` (default) | 48px | 24px | 16px/600 |
| `sm` (header, compact) | 40px | 18px | 15px/600 |
| Full width | `width: 100%` (offer cards; mobile menu; ≤759px the page CTAs stack full width) | | |

## Variants and states
| Variant | Rest | Hover | Active (pressed) | Focus | Disabled | Sending |
|---|---|---|---|---|---|---|
| **primary** | bg `primary`, text `primary-fg` | bg `primary-hover` | bg `primary-hover` + `translateY(1px)` | 2px `focus` outline, offset 2px | opacity .4, `cursor: not-allowed` | disabled + 16px ring spinner (2px `currentColor`, right side transparent) + label |
| **secondary** | bg `surface`, text `fg`, inset 1px `border-strong` ring | bg `surface-3` | bg `surface-3` + `translateY(1px)` | as primary | opacity .4 | n/a |
| **ghost** (text + →) | transparent, text `fg`, 8px side padding | text `link` | text `fg` | as primary | n/a | n/a |
| **onPrimary** (inside the solid CTA block only) | bg #FFFFFF, text #00557F | bg #E8F4F8 | bg #E8F4F8 + `translateY(1px)` | as primary | n/a | n/a |

The onPrimary colours are fixed (not themed) because the CTA block is `primary` in both themes. #00557F on #FFFFFF is 8.06:1.

Buttons are never green, amber or red. There's no destructive button on this site.

## Where each is used
- primary: header CTA, hero CTA, "Start a Sprint", page-end CTA, Free Consult band, form submit, 404 CTA.
- secondary: "Book advisory hours", "Talk about a retainer" (×2), About "LinkedIn".
- ghost: Home hero "See how I work →".
- onPrimary: Home closing CTA "Book your free consult".

## Behaviour at 390 / 1440
- 1440: buttons sit inline (gap 12px).
- 390: the hero and About CTA rows stack and each button is full width; offer-card buttons are always full width. The header CTA uses `sm` at all widths.
