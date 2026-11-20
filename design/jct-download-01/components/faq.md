# FAQ accordion (Services)

Image: `../screens/services-*.png` (first item open); component sheet section 06.

## Spec
- Layout: 2-up `4fr / 8fr`: "FAQ" (`mk-h2`) left, list right; one column under 1000px.
- List: top border 1px `border`; each item has a bottom border 1px `border`.
- Question: a `<button>` inside an `h3`, full width, flex `space-between`, gap 20px, padding 20px 0, min-height 44px; 17px/600 `fg`, left-aligned; chevron 20px (1.7 stroke) `fg-muted`, rotates 180° when open (150ms). `aria-expanded`, `aria-controls` → answer id.
- Answer: `mk-body` (17/1.65) `fg-muted`, padding 0 48px 22px 0 (0 right padding under 760px).

## States
| State | Look |
|---|---|
| Closed | chevron down |
| Open | chevron up, answer shown |
| Hover | question text `link` colour |
| Active | as hover |
| Focus | 2px `focus` outline, offset 2px, radius 4px, on the button |
| Disabled | none |

## Behaviour
One item open at a time; the first is open on load. Enter/Space toggles. Content is in the HTML for crawlers (no lazy load). Same at 390 and 1440 apart from the layout change.
