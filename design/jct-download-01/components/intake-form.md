# Intake form (Free Consult fallback)

Images: `../screens/free-consult-form-*`, `free-consult-form-errors-*`, `free-consult-sending-*`, `free-consult-send-error-*`, `free-consult-success-*` (each at 390 and 1440, light and dark). Component sheet section 07.

The form shows **instead of** the Calendly block when there's no booking URL, the embed hasn't loaded after 8s, or JavaScript is off. It sits in the right column of the Free Consult page (one column under 1000px).

## Container
Card: `surface`, radius 18px, inset 1px `border` ring, padding `clamp(24px, 3.5vw, 40px)`; column, gap 20px. `novalidate`; the site validates.

## Fields (copy doc order)
| Field | Control | Required | Notes |
|---|---|---|---|
| Name | text, `autocomplete="name"` | yes | 2-up with Email at ≥ ~500px column width |
| Email | email, `autocomplete="email"` | yes | |
| Company | text, `autocomplete="organization"` | yes | |
| Where's your product today? | choice pills, radiogroup: Idea / Prototype / Sampling / In production / Launched | yes | `fieldset` + `legend` |
| What's the biggest thing in the way? | textarea, 120px tall, vertical resize | yes | |
| Link | url, placeholder "https://" | no | label shows "Optional" right-aligned, 14px `fg-subtle` |
| Honeypot + time-on-page | hidden | n/a | per the rebuild plan; never visible |

Below: submit "Book your free consult" (primary, 48px; full width under 760px), and "Jon Thornham · Las Vegas, NV · 702-518-2998 · LinkedIn" (14px `fg-subtle`).

## Field spec
- Label: 15px/600 `fg`, gap 8px to the control.
- Input: height 46px, radius 8px, padding 0 14px, 16px text, bg `surface`, text `fg`, placeholder `fg-subtle`, inset 1px `border-strong` ring.
- Focus: inset 2px `focus` ring (no outline).
- Error: inset 2px `danger` ring, `aria-invalid="true"`, `aria-describedby` → message.
- Error message: 14px/1.45 `danger`, 16px alert-circle icon, gap 6px, under the field.
- Disabled (while sending): opacity .6, not editable.
- Choice pill: 40px tall, padding 0 16px, radius 999, 15px; rest `surface-2`, `fg-muted`, inset 1px `border` ring. Selected: `primary-soft`, `accent-text`, 600, inset 1.5px `primary` ring, `aria-checked="true"`. Hover: `surface-3`. Focus: 2px `focus` outline. Error: every pill gets an inset 1px `danger` ring. Arrow keys move the selection (radiogroup).

## Form states
| State | What shows |
|---|---|
| **Empty** | all fields at rest, no pill selected, submit enabled |
| **Error** (on blur per field; on submit for all) | error rings and messages on each invalid field; summary alert at the top of the form (`role="alert"`); focus moves to the first invalid field. Summary: "Check the 2 fields marked below." (the count matches the number of invalid fields); messages in `copy-map.md` |
| **Sending** | submit disabled, with a 16px spinner and the label "Sending…"; fields disabled; `aria-busy="true"` on the form |
| **Sent** | the form is replaced by a success card: 48px circle (`success-soft`, check icon `success`), heading (`mk-h3`), line (`mk-body` `fg-muted`), arrow link "See how I work →". `role="status"`; focus moves to the heading. Copy: "Thanks, it's in." / "I'll email you to set a time for the call." |
| **Send error** | the inputs keep their values; a danger alert at the top: "That didn't send. Your answers are still here. Try again, or call 702-518-2998." (the number is a `tel:` link); submit re-enabled |

## Alerts
Radius 14px, padding 16px 18px, 15px/1.5, 20px icon, gap 12px.
- Danger: bg `danger-soft`, inset 1px ring `danger` at 35% alpha, icon `danger`, text `fg`.
- Success: bg `success-soft`, ring `success` at 35%, icon `success`.
- Neutral: bg `surface-2`, ring `border-strong`, icon `fg-muted`.

## Behaviour at 390 / 1440
- **1440:** the form is the right column (≈ 7/12 of 1200px); Name and Email side by side.
- **390:** one column under the page copy; Name and Email stack; pills wrap to two rows; submit full width.

Submission: write to the `consults` collection first, then email (per the rebuild plan). Firebase loads only on this page.
