# Footer

Image: the bottom of every file in `../screens/`.

## Spec
| Part | Value |
|---|---|
| Container | background `canvas`; top border 1px `border`; padding 48px top, 32px bottom; inner max-width 1200px with the gutter |
| Top row | flex, wrap, `justify-content: space-between`, gap 32px × 64px |
| Brand block | max-width 320px, column, gap 12px: wordmark 22px tall (`fg`), tagline "Fractional product & operations for product startups" 15px/1.5 `fg-muted` |
| Links | How I Work · Services · Work · About · Free Consult · LinkedIn; 15px Geist 400, `fg-muted`, gap 12px × 28px, wrap. Hover: `primary`, no underline |
| Bottom row | margin-top 40px, padding-top 20px, top border 1px `border`; flex `space-between`, wrap, gap 12px; 14px `fg-subtle`. Left: "© 2026 JCT Consulting". Right: "Privacy" · "Terms" (gap 20px, inherit colour; hover `primary`) |

## Behaviour
- **1440:** brand block left, links right on one line; bottom row © left, Privacy · Terms right.
- **390:** everything stacks: brand block, then links wrapping to two lines (4 + 2), then the rule and the bottom row (© left, Privacy · Terms right on the same line).

## States
Links: rest `fg-muted` · hover and active `primary` · focus 2px `focus` outline, offset 2px.
