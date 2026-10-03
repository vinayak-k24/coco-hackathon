# Data & Backend Requirements

Living backlog of data/backend work required to support the finalized UI.
Updated as UI development reveals new needs.

---

## Status Legend

| Status | Meaning |
|--------|---------|
| EXISTING | Available now in Snowflake |
| DERIVABLE | Can be calculated from existing data |
| MISSING | Needs new DB/backend work |
| TEMPORARY_UI_DATA | Using mock/fallback in UI during development |
| READY_FOR_BACKEND | UI finalized, backend can be implemented |
| IMPLEMENTED | Backend work completed |

---

## KPI Dashboard

| Field | Status | Source | Notes |
|-------|--------|--------|-------|
| `alerts_active` | EXISTING | `ANALYTICS.VW_KPI_SUMMARY` | Current API uses ad-hoc query; should switch to view |
| `oee_avg` | EXISTING | `ANALYTICS.VW_KPI_SUMMARY` | |
| `breakdown_hours` | EXISTING | `ANALYTICS.VW_KPI_SUMMARY` | |
| `breakdown_cost_inr` | EXISTING | `ANALYTICS.VW_KPI_SUMMARY` | |
| `orders_at_risk` | EXISTING | `ANALYTICS.VW_KPI_SUMMARY` | |
| `assets_online_pct` | EXISTING | `ANALYTICS.VW_KPI_SUMMARY` | |
| `safety_score` | EXISTING | `ANALYTICS.VW_KPI_SUMMARY` | Currently returns 98 — confirm calculation |
| `energy_efficiency` | EXISTING | `ANALYTICS.VW_KPI_SUMMARY` | |
| `predicted_cost_avoidance_inr` | EXISTING | `ANALYTICS.VW_KPI_SUMMARY` | Currently returns 0 — needs ML scoring pipeline |

**Action**: Refactor `/api/kpis` route to query `VW_KPI_SUMMARY` directly instead of multiple ad-hoc queries.

---

## Plant Network

| Field | Status | Source | Notes |
|-------|--------|--------|-------|
| `plant_id`, `plant_name`, `facility_type` | EXISTING | `ANALYTICS.VW_PLANT_HEALTH` | |
| `num_production_lines` | EXISTING | `ANALYTICS.VW_PLANT_HEALTH` | |
| `total_assets` | EXISTING | `ANALYTICS.VW_PLANT_HEALTH` | |
| `critical_alerts` | EXISTING | `ANALYTICS.VW_PLANT_HEALTH` | |
| `warning_alerts` | EXISTING | `ANALYTICS.VW_PLANT_HEALTH` | |
| `oee_pct` | EXISTING | `ANALYTICS.VW_PLANT_HEALTH` | Chennai/Coimbatore return 0 — only Pune has OEE data |
| `workforce_count` | EXISTING | `ANALYTICS.VW_PLANT_HEALTH` | Chennai/Coimbatore return 0 |
| `order_value_inr` | EXISTING | `ANALYTICS.VW_PLANT_HEALTH` | Can derive annual revenue |
| `health_score` | EXISTING | `ANALYTICS.VW_PLANT_HEALTH` | Composite score |
| `city`, `country` | DERIVABLE | Parse from `DIM_SITE.PHYSICAL_ADDRESS` | Not a separate column |
| `factory_image` | TEMPORARY_UI_DATA | Hardcoded picsum URLs | Need real factory images or a default |
| `manager_name` | TEMPORARY_UI_DATA | Hardcoded in API route | Not in current DB |
| `change_trend` | TEMPORARY_UI_DATA | Hardcoded "+2.1%" | Need historical comparison |

**Action**: Refactor `/api/plants` route to query `VW_PLANT_HEALTH` instead of ad-hoc multi-join. Add `city` extraction. Manager name needs APP.PLANT_CONFIG or similar.

---

## Alerts

| Field | Status | Source | Notes |
|-------|--------|--------|-------|
| Full alert record | EXISTING | `ANALYTICS.VW_ACTIVE_ALERTS` | Rich: asset, plant, line, fault_mode, severity, sensors |
| `failure_probability` | EXISTING | `VW_ACTIVE_ALERTS.PEAK_SEVERITY` | |
| `projected_failure_ts` | EXISTING | `VW_ACTIVE_ALERTS` | |
| Severity labels | EXISTING | `VW_ACTIVE_ALERTS.SEVERITY_LABEL` | CRITICAL/WARNING/NORMAL |

**Action**: Refactor `/api/alerts` to use `VW_ACTIVE_ALERTS` instead of ad-hoc sensor threshold query.

---

## Recommendations

| Field | Status | Source | Notes |
|-------|--------|--------|-------|
| Recommendation records | MISSING | Designed as `APP.INCIDENTS` + `APP.INCIDENT_OPTIONS` | APP schema not created yet |
| `severity` | DERIVABLE | From alert severity + ML prediction | Currently derived in API route |
| `title` | DERIVABLE | Generated from asset name + fault mode | |
| `savings` | DERIVABLE | `downtime_cost_per_min * estimated_hours * 60` | Currently uses random hours |
| `impact` | TEMPORARY_UI_DATA | Assigned by index position | Should come from options engine |
| `effort` | TEMPORARY_UI_DATA | Random 1–4 days | Should come from work order estimation |
| `category` (Critical/Optimisation/Preventive) | DERIVABLE | From alert severity threshold | |

**Action**: Once `APP` schema is created (via `snowflake/08_app_tables.sql`), recommendations should come from `APP.INCIDENT_OPTIONS` via the options engine (`SP_GENERATE_OPTIONS`). Until then, the current derivation from sensor alerts is a reasonable temporary approach.

---

## APP Schema (Not Yet Created)

The following tables are designed in `.cortex/cortex.md` but **do not exist** in Snowflake yet:

| Table | Purpose | Blocking UI? |
|-------|---------|-------------|
| `APP.ALERTS` | Active alerts from ML + thresholds | No — using `VW_ACTIVE_ALERTS` |
| `APP.INCIDENTS` | Incident lifecycle state machine | No — not needed for Command Center |
| `APP.INCIDENT_OPTIONS` | Recommendation options with scores | Partially — recommendations use sensor derivation |
| `APP.INCIDENT_ACTIONS` | Action plan steps | No |
| `APP.INCIDENT_EVENTS` | Timeline events | No — using `OPERATOR_ACTIONS_LOGS` |
| `APP.WATCH_STATE` | Per-asset monitoring state | No |
| `APP.CFG_THRESHOLDS` | Editable thresholds | No — using `RAW.CFG_ASSET_THRESHOLDS` |
| `APP.COPILOT_THREADS` | Chat history | No |

**Action**: Run `snowflake/08_app_tables.sql` when ready to activate the incident lifecycle. Not blocking current UI work.

---

## API Route Improvements

| Route | Current | Should Use | Priority |
|-------|---------|-----------|----------|
| `/api/kpis` | Multiple ad-hoc queries | `VW_KPI_SUMMARY` (single query) | High |
| `/api/plants` | Ad-hoc multi-join + hardcoded metadata | `VW_PLANT_HEALTH` + image/manager config | High |
| `/api/alerts` | Ad-hoc sensor threshold query | `VW_ACTIVE_ALERTS` | Medium |
| `/api/recommendations` | Derived from sensor features | `APP.INCIDENT_OPTIONS` (when created) | Low (blocked) |
| `/api/hero-briefing` | Multiple ad-hoc queries | `VW_KPI_SUMMARY` + `VW_PLANT_HEALTH` | Medium |

---

## Data Gaps Summary

### Missing from DB (needs backend work)
- Factory manager names
- Factory images/thumbnails
- Recommendation effort estimates (from work order estimation)
- Historical trend comparisons (week-over-week change)
- Predicted cost avoidance calculation (needs ML scoring pipeline active)

### Section 3 — Sample Data In Use (NEW)

All five Section 3 cards currently use sample data from `lib/sample-data.ts`. These need real backend endpoints.

#### Production Performance
| Field | Status | Notes |
|-------|--------|-------|
| `date` | EXISTING | From `DT_OEE_LINE_SHIFT.SHIFT_DATE` |
| `actual` (daily units) | EXISTING | `SUM(ACTUAL_QTY)` from `DT_OEE_LINE_SHIFT` |
| `planned` (daily units) | EXISTING | `SUM(PLANNED_QTY)` from `DT_OEE_LINE_SHIFT` |
| `forecast` (AI predicted) | MISSING | Needs ML forecast model output |
| Production events (maintenance shutdowns, demand spikes) | MISSING | Need `APP.INCIDENT_EVENTS` or similar |
| 30D/90D/12M time ranges | DERIVABLE | Different date ranges on same query |

**API needed**: Extend `/api/production` to return 30-day data with planned values, add forecast field.

#### Maintenance Readiness
| Field | Status | Notes |
|-------|--------|-------|
| Asset readiness % | DERIVABLE | From `FACT_WORK_ORDER` status distribution |
| Healthy/Warning/Scheduled/Critical counts | DERIVABLE | From asset health scores + work order status |
| Technician count + capacity | EXISTING | `OPERATOR_TECHNICIAN_ASSIGNMENTS` |
| Active work orders | EXISTING | `FACT_WORK_ORDER` where status != Completed |
| Readiness score | DERIVABLE | Composite of above |
| Spare parts coverage % | DERIVABLE | Parts above reorder / total parts |
| Trend values (↑ 3%, ↓ 29%) | MISSING | Need historical comparison |

#### Workforce Readiness
| Field | Status | Notes |
|-------|--------|-------|
| Available/Assignment/Training/Unavailable | DERIVABLE | From `OPERATOR_TECHNICIAN_ASSIGNMENTS` + `SKILLS_CERTIFICATIONS` |
| Shift coverage gaps | MISSING | Need shift planning analysis |
| Certification expiring soon | EXISTING | `SKILLS_CERTIFICATIONS.EXPIRY_DATE` |
| Overtime trend | MISSING | No overtime tracking in current DB |
| Utilization rate | DERIVABLE | Assigned / total technicians |

#### Supply Chain Risk
| Field | Status | Notes |
|-------|--------|-------|
| Supplier name | EXISTING | `SUPPLIERS_VENDORS` |
| Part/product name | EXISTING | `SPARE_PARTS_CATALOG` |
| Supplier health % | MISSING | Need supplier scoring model |
| Supplier health history (sparkline) | MISSING | Need historical supplier health |
| Lead time | DERIVABLE | From `PURCHASE_ORDERS` avg delivery time |
| Affected machines | DERIVABLE | Assets linked to parts from supplier |
| Business exposure | DERIVABLE | Downtime cost * affected machine hours |
| Risk category | MISSING | Need risk scoring algorithm |

#### Order Impact
| Field | Status | Notes |
|-------|--------|-------|
| Customer name | EXISTING | `CUSTOMER_ORDERS.CUSTOMER_NAME` |
| Order/PO ID | EXISTING | `CUSTOMER_ORDERS.ORDER_ID` |
| Product | EXISTING | `CUSTOMER_ORDERS.PRODUCT_ID` → `PRODUCTS_SKUS` |
| Commitment date | EXISTING | `CUSTOMER_ORDERS.DUE_DATE` |
| Status (At Risk/Watch/On Track) | DERIVABLE | Based on days remaining + alert overlap |
| Revenue exposure | EXISTING | `CUSTOMER_ORDERS.ORDER_VALUE` |

**Note**: Order Impact already has a working API route (`/api/orders`) that returns real Snowflake data. The sample data is used as fallback only when the API returns empty.

### KPI Trend/Comparison Data (NEW)
All 9 KPI cards have a trend row placeholder (`—`). The UI is ready to display `↑ X%` / `↓ X%` once comparison data is available.

| KPI | Trend source needed | increaseIsGood |
|-----|-------------------|----------------|
| Plant OEE | Week-over-week OEE avg from `DT_OEE_LINE_SHIFT` | true |
| Assets Online | Previous period asset online % | true |
| Safety Score | Previous period safety score | true |
| Energy Efficiency | Previous period energy efficiency | true |
| Open Alerts | Previous period alert count | false |
| Breakdown Hours | Previous period breakdown hours | false |
| Breakdown Cost | Previous period breakdown cost INR | false |
| Orders at Risk | Previous period at-risk count | false |
| Cost Avoidance | Previous period avoidance INR | true |

**Required API change**: `/api/kpis` should return a `trends` object alongside the values, e.g. `{ oee_avg: 86.6, oee_avg_trend: 2.3 }`. The view `VW_KPI_SUMMARY` would need a companion `VW_KPI_TRENDS` or the view itself could include prior-period columns.

**Status**: MISSING — UI structure ready, backend not implemented.

### Factory Trend Data (EXISTING GAP — documented earlier)
Factory cards show hardcoded `+2.1%` trend. Need historical plant health comparison.

**Status**: TEMPORARY_UI_DATA

### Temporary UI data in use
- Factory images: picsum placeholder URLs
- Factory manager: hardcoded names
- Factory change trend: hardcoded "+2.1%"
- Recommendation effort: random 1–4 days
- Safety score: static 98 from view (confirm calculation)
- KPI trends: placeholder dash (—) — awaiting backend comparison data

### Quick wins (existing views not yet used)
- `VW_KPI_SUMMARY` — single query replaces 5 separate queries in `/api/kpis`
- `VW_PLANT_HEALTH` — replaces complex multi-join in `/api/plants`
- `VW_ACTIVE_ALERTS` — replaces ad-hoc sensor threshold query in `/api/alerts`

---

## Section 4: Business Impact

### Revenue Exposure Data (NEW — `/api/revenue-impact`)

Currently using generated sample data (`SAMPLE_REVENUE_EXPOSURE`). The API route `/api/revenue-impact` exists but returns sample data.

**Required Snowflake source**: A new view or table tracking daily revenue exposure, AI-optimized exposure, and forecast values.

| Field | Description | Currently Available |
|---|---|---|
| `date` | Calendar date | false — needs time-series source |
| `current` | Current revenue exposure amount (INR) | false |
| `aiRecommended` | AI-optimized exposure after recommendations | false |
| `forecast` | Forward-looking projected exposure (null for past dates) | false |

**Suggested implementation**: Create `ANALYTICS.VW_REVENUE_EXPOSURE` joining order risk, supply chain delays, and maintenance cost projections over a rolling 30-day window.

### Business KPI Cards (NEW)

| KPI | Description | Source |
|---|---|---|
| Predicted Savings | Total savings from AI recommendations | ML model output — needs `APP.AI_SAVINGS_SUMMARY` |
| Customer Satisfaction Risk | % of customers at risk of SLA breach | Derivable from `ANALYTICS.VW_ORDERS_AT_RISK` |
| On-Time Delivery | Delivery rate vs commitment dates | Derivable from `RAW.PRODUCTION_ORDERS` |
| Operational Efficiency | Overall efficiency score | Derivable from `ANALYTICS.VW_KPI_SUMMARY` OEE |

### Projected Financial Impact (NEW)

| Field | Description | Source |
|---|---|---|
| Total ($4.8M) | Aggregate projected savings | Sum of breakdown items |
| Maintenance Savings | Predicted maintenance cost avoidance | ML predictions on `RAW.MAINTENANCE_RECORDS` |
| Downtime Prevention | Revenue preserved by preventing unplanned stops | Derivable from asset health + order pipeline |
| Supply Chain Optimization | Savings from alternate sourcing/timing | Needs supply chain optimization model |
| Energy Efficiency | Energy cost savings from AI scheduling | Needs `RAW.ENERGY_CONSUMPTION` analysis |

**Status**: SAMPLE_DATA — all values are static sample data, awaiting ML pipeline and aggregation views.
