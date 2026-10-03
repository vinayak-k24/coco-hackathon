# NexaFactory Design System

## Font

```css
font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Loaded via Google Fonts in `globals.css`. Do not use Arial, Roboto, Poppins, Montserrat, or decorative fonts.

## Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#1677E8` | CTAs, active states, links, highlights |
| Navy | `#172B4D` | Card headings, important labels |
| Dark navy | `#102A4C` | Hero headline |
| Body | `#52677D` | Default body text |
| Muted | `#8495A7` | Metadata, labels, placeholders |
| Success | `#18B276` | Healthy states, positive metrics |
| Warning | `#F2A51A` | Caution states, amber indicators |
| Critical | `#FF4D5A` | Alerts, errors, critical states |
| Border | `#E2EBF2` | Card borders, input borders |
| Divider | `#E7EEF4` | Section dividers, separators |
| Background | `#F7FBFF` | Page background |
| Card | `#FFFFFF` | Card surfaces |
| Control surface | `#F5F9FC` | Input backgrounds, audio players |

## Typography Hierarchy

| Weight | Size | Usage | Color |
|--------|------|-------|-------|
| 800 | 38–40px | Hero headline | `#102A4C` / `#1677E8` |
| 700 | 15–16px | Card headings, metric values | `#172B4D` / `#203852` |
| 700 | 14px | Section titles | `#172B4D` |
| 600 | 12px | Navigation, controls, buttons | varies |
| 600 | 14px | Greeting | `#40566D` |
| 500 | 10–11px | Metadata, labels, timestamps | `#8495A7` |
| 400 | 13–14px | Body copy | `#52677D` |

Global base: 14px / 400 / 1.5 line-height / `#52677D`.

## Card Treatment

```css
background: #FFFFFF;
border: 1px solid #E2EBF2;
border-radius: 10–12px;      /* standard cards */
border-radius: 15–16px;      /* hero elevated cards */
box-shadow: 0 2px 8px rgba(35,70,105,0.05);  /* standard */
box-shadow: 0 10px 30px rgba(40,80,115,0.11); /* elevated/hero */
```

Hero cards use translucent surface: `rgba(255,255,255,0.94)` with `backdrop-filter: blur(18px)`.

Do not use opaque pure white for hero cards. Do not use heavy shadows.

## Spacing

- Section gap (hero to KPI): 20–28px.
- Card gap: 16–20px.
- Card internal padding: 16–18px.
- Use hierarchical spacing within cards (not uniform).

## Responsive Layout

- Desktop: flex/grid with percentage or `fr` units.
- Tablet: allow wrapping; reduce card widths proportionally.
- Mobile: stack vertically. KPI strip becomes horizontally scrollable.
- Use `margin-left: auto` or grid column sizing for right-aligned groups.
- Never use arbitrary fixed pixel positioning (e.g., `left: 700px`).

## Data Visualization

- Percentage KPIs: SVG circular gauges (44px, 3px stroke).
- Health indicators: SVG circular gauges (48px, 3px stroke).
- Color coding: green ≥90%, blue ≥75%, amber ≥50%, red <50%.
- Progress bars: 5–6px height, pill-shaped (border-radius: 999px).

## States

| State | Treatment |
|-------|-----------|
| Loading | Skeleton placeholders (animated pulse) |
| Error | Warning icon + message + retry button |
| Empty (healthy) | Green checkmark + "All caught up" message |
| Empty (no data) | Muted "No data available" |

Never show "All caught up" while still loading. Error and healthy-empty are distinct states.
