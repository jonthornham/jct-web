# Links

Image: `component-sheet-1440-*.png`, section 01, "Text link" row.

| Kind | Rest | Hover | Active | Focus |
|---|---|---|---|---|
| **Arrow link** ("See how I work →", "Read the Seltza story →", "Services & Pricing →") | 15px/600 `link`, no underline | underline, offset 4px | `fg` | 2px `focus` outline, offset 2px, radius 4px |
| **Inline link** (in body text, e.g. "Book a free 15-minute consult." in the Services intro; phone and LinkedIn on Free Consult) | inherits size, `link` | underline, offset 4px | `fg` | as above |
| **Nav and footer links** | see `header-nav.md`, `footer.md` | | | |
| **Jump chips** (Work page: Seltza · FLO Cycling · Global Seafood Exchange) | min-height 30px, padding 4px 12px, radius 999, bg `surface-2`, inset 1px `border` ring, 14px/500 `fg` | bg `surface-3`, no underline | as hover | as above |

Disabled links don't exist; remove the link instead.

`link` is #006994 on light (6.09:1 on canvas) and #67C3E3 on dark (9.91:1).
