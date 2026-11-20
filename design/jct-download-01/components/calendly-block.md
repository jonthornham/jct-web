# Calendly booking block (Free Consult)

Images: `../screens/free-consult-390-*.png`, `free-consult-1440-*.png`; component sheet section 08.

The default on /free-consult: Calendly's inline widget inside a JCT card. The intake form is the fallback (see `intake-form.md`).

## Spec
| Part | Value |
|---|---|
| Card | `surface`, radius 18px, inset 1px `border` ring, `overflow: hidden` |
| Header row | height 56px, padding 0 24px, bottom border 1px `border`; left "Free Consult" (15px/600 `fg`); right "15 min" (Geist Mono 14px `fg-muted`) |
| Embed area | min-height **660px** at ≥760px, **700px** under 760px; padding 24px (16px under 760); Calendly inline widget fills it (`width: 100%`) |
| Loading skeleton (shown until Calendly's `calendly.event_type_viewed` message, at most 8s) | a 14px bar (40% width, radius 6, `surface-3`); a 7-column month grid of 1:1 circles (gap 8px; `surface-2`, weekdays `primary-soft` with a 1px `border` ring); three 44px time-slot outlines (radius 8, inset 1px `border-strong`). Desktop: calendar 3fr, slots 2fr, gap 28px; phone: stacked. `aria-hidden`, no animation |
| Account | Needs a Calendly account and one 15-minute event type (the free plan allows one event type and website embedding; it shows Calendly branding and ignores the colour parameters below). Until the URL exists the page shows the intake form |
| Embed URL | `site.scheduler.url` (Jon's 15-minute event) with `?hide_gdpr_banner=1&hide_event_type_details=1` and colours per theme: light `background_color=ffffff&text_color=0b1220&primary_color=006994`; dark `background_color=0e1319&text_color=eef2f6&primary_color=5bc0de` (colour parameters take effect on paid plans only) |
| Script | load Calendly's widget script only on /free-consult, after the page is interactive |

## States
| State | Look |
|---|---|
| Loading | skeleton (above) |
| Loaded | Calendly's own UI in the embed area |
| Failed / no URL / no JS | the card is replaced by the intake form |
| Theme change | reload the embed with the other colour set |

Hover, focus and active inside the widget are Calendly's. The block itself has none.

## Behaviour
- **1440:** right column of the Free Consult 2-up (`5fr / 7fr`), top-aligned with the eyebrow.
- **390:** under the page copy and Jon's contact line, full width.
