# UI Decisions Log

Concise record of important UI/product decisions. Do not delete historical entries unless clearly obsolete.

---

### Hero — COMPLETE

- Hero section is complete. Do not modify while building later sections.
- Factory/location floating badges: **removed** (were distracting over the background image).
- Operational Status "+" button: **removed** (non-functional, cluttered header).
- AI Briefing + Operational Status cards: **moved toward right** via `margin-left: auto` + CSS grid `min(740px, 43vw)`.
- Inter font adopted as the sole typeface.
- Hero headline: 40px / weight 800 / letter-spacing -1.3px.
- Background image served from `/public/factory-bg.png` with left-to-right white atmospheric gradient overlay.
- Navbar: translucent (`rgba(255,255,255,0.94)`), underline active state (2px blue), no pill-style active tabs.

### Section 2 — KPI + Plant Network + Recommendations

- Percentage KPIs appear first (OEE, Assets Online, Safety, Energy), followed by count/currency KPIs.
- Percentage KPIs use SVG circular gauge visuals (44px).
- Current database has **3 factories** (Pune, Chennai, Coimbatore). Do not invent a fourth.
- Factory cards are data-driven from `/api/plants`.
- Recommended Actions panel has a **fixed outer size** (330–340px height). Never resizes based on content.
- Maximum **3 recommendation cards** visible at once. Internal scroll for overflow.
- Total recommendation count shown in header (not just visible count).
- Zero recommendations displays healthy "All caught up" state — not an error.
- Loading uses skeleton placeholders. Error state is distinct from empty state.
- Subsystems quick-nav strip: **removed** (redundant with navbar tabs).

### Data Architecture

- All dashboard data comes from Snowflake PDM database via Next.js API routes.
- API routes in `app/api/*/route.ts` use `snowflake-sdk` via `lib/snowflake.ts`.
- Frontend fetches via `lib/api.ts` (`fetchApi`) with `NEXT_PUBLIC_API_URL=""` (same-origin).
- Currency: INR (₹). Plant names: Pune, Chennai, Coimbatore. No Berlin/Chicago/Singapore.
