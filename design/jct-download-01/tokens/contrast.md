# Contrast (WCAG 2.1 AA)

AA minimums: 4.5:1 for text (including button labels at 15–16px/600, which are not "large text"), 3:1 for non-text UI (button edges, focus rings, graphics).

| Pair | Light | Ratio | Dark | Ratio | Kind | AA |
|---|---|---|---|---|---|---|
| Link / accent text on canvas | #006994 on #FFFFFF | **6.09:1** | #67C3E3 on #070A0E | **9.91:1** | text | pass |
| Link on surface-2 | #006994 on #F7F9FB | **5.77:1** | #67C3E3 on #141A22 | **8.74:1** | text | pass |
| accent-text on primary-soft (step numbers, selected pills) | #006994 on #E8F4F8 | **5.43:1** | #7DD3F0 on #0A1D26 | **10.23:1** | text | pass |
| Button: primary-fg (white) on primary | #FFFFFF on #006994 | **6.09:1** | #FFFFFF on #007BA7 | **4.78:1** | button text | pass |
| Button hover: white on primary-hover | #FFFFFF on #00557F | **8.06:1** | #FFFFFF on #006994 | **6.09:1** | button text | pass |
| Primary button fill against canvas | #006994 on #FFFFFF | **6.09:1** | #007BA7 on #070A0E | **4.15:1** | non-text (3:1 min) | pass |
| Focus ring against canvas | #007BA7 on #FFFFFF | **4.78:1** | #5BC0DE on #070A0E | **9.48:1** | non-text (3:1 min) | pass |
| Accent graphic (stage node ring) against surface | #007BA7 on #FFFFFF | **4.78:1** | #5BC0DE on #0E1319 | **8.92:1** | non-text (3:1 min) | pass |
| Body: fg on canvas | #0B1220 on #FFFFFF | **18.72:1** | #EEF2F6 on #070A0E | **17.63:1** | text | pass |
| Muted: fg-muted on surface | #4E5866 on #FFFFFF | **7.21:1** | #A1ABB7 on #0E1319 | **8.02:1** | text | pass |
| Subtle: fg-subtle on surface-2 | #646E7B on #F7F9FB | **4.9:1** | #85909D on #141A22 | **5.39:1** | text | pass |
| On-primary CTA button: #00557F text on #FFFFFF (Home closing CTA, both themes) | | **8.06:1** | | **8.06:1** | button text | pass |
| White text on the primary CTA block (#006994 light / #007BA7 dark) | | **6.09:1** | | **4.78:1** | text | pass |

Ratios computed from the hex values in tokens.json with the WCAG relative-luminance formula.
