# Command Center — Living Specification

## Structure

```
Navbar
  ↓
Hero (Section 1)              ← COMPLETE
  ↓
KPI Strip (Section 2a)        ← IN DEVELOPMENT
  ↓
Plant Network + Recommended Actions (Section 2b) ← IN DEVELOPMENT
  ↓
Detailed Dashboard Cards (Section 3) ← EXISTING (production perf, maintenance, supply chain, alerts, energy)
```

---

## Section 1 — Hero

**STATUS: COMPLETE**

Do not modify unless explicitly requested.

Contains:
- NexaFactory navbar (translucent, Inter, underline active state, search box, factory selector, profile)
- Factory background image (`/public/factory-bg.png`) with white atmospheric gradient overlay
- Greeting row: "Good Morning, Alex" + date with vertical separator
- Hero headline: "Your factories are / performing well." (40px/800)
- Description paragraph (13px/500)
- AI Operational Briefing card (right side, translucent, 15px radius)
- Operational Status card (right side, adjacent to AI card)

Completed decisions:
- Factory/location badges: removed.
- "+" button on Operational Status: removed.
- Cards positioned toward right via `margin-left: auto` + CSS grid (`min(740px, 43vw)`).
- Inter font throughout.

---

## Section 2a — KPI Strip

**STATUS: IN DEVELOPMENT**

Sits 24px below the hero.

Rules:
- Percentage KPIs first: Plant OEE, Assets Online, Safety Score, Energy Efficiency.
- Then count/currency KPIs: Open Alerts, Breakdown Hours, Breakdown Cost, Orders at Risk, Cost Avoidance.
- Percentage KPIs use SVG circular gauges (44px, 3px stroke, color-coded).
- Normal KPIs use icon + value layout.
- All values from `/api/kpis` (Snowflake).
- Skeleton loaders while loading.

---

## Section 2b — Plant Network + Recommended Actions

**STATUS: IN DEVELOPMENT**

Desktop layout: `grid-cols-[1fr_400px]` (~65% / ~35%), gap 20px.

### Plant Network Overview (left)

- Header: globe icon + "Plant Network Overview" (15px/700)
- Dynamic summary: `{n} factories • {assets} assets • {workforce} workforce`
- Map/List segmented toggle (32px height)
- Prev/next carousel buttons (30px, advance 1 factory at a time)
- Factory cards: white, 10px radius, 75px image, health circle (48px SVG), 4-column metrics, alert footer
- Data from `/api/plants` (Snowflake → 3 factories)
- Zero alerts shows green "● No active alerts"

### Recommended Actions (right)

- Fixed panel: ~400px width, 330–340px height. Never resizes.
- Header: "Recommended Actions" + count badge when > 0.
- Max 3 cards visible. Internal vertical scroll for overflow.
- Cards: colored left border (Critical=#FF4D5A, Optimisation=#1677E8, Preventive=#F2A51A), severity badge, title, subtitle, savings/impact/effort.
- Empty state: green checkmark + "All caught up" + "No actions require your attention right now."
- Error state: warning icon + "Unable to load" + retry button.
- Loading state: 3 skeleton cards.
- Data from `/api/recommendations` (Snowflake).

---

## Section 3 — Detailed Dashboard

**STATUS: EXISTING**

Below Section 2. 12-col grid: 8-col left (production chart, maintenance, technicians, supply chain, orders, revenue) + 4-col right (alerts, activity stream, energy).

---

## Data Availability Rule

For every new section:
1. Inspect existing DB/schema/API.
2. Identify existing, derivable, and missing data.
3. Build the intended UI regardless.
4. Track missing requirements in `docs/data-backend-requirements.md`.
5. Do not permanently hardcode missing production data.
