# Plant Sentinel

**Snowflake-native Predictive Maintenance & OEE Command Center**

Built for the Snowflake CoCo CLI Hackathon 2026, GCC Edition.

From alert to approved action to verified recovery — predict failures, open incidents, compare options on safety/cost/production, let a human approve, execute, verify recovery, return to guard mode. All data stays inside Snowflake.

---

## Architecture

```
csv_data_v2/  (48 CSVs, 253K rows, 45-day window)
      |
      v
Snowflake PDM database
  RAW       -- 48 ingested tables
  CORE      -- 8 Dynamic Tables (dims + facts)
  ANALYTICS -- 2 DTs (OEE, sensor features) + 5 views
  ML        -- Feature engineering, model, scoring
  APP       -- Incidents, options, actions, config
  SEARCH    -- Cortex Search services
      |
      v
FastAPI Backend (Backend/)
  19 route modules, Pydantic models, SSE streaming
  Cortex Agent proxy for copilot/intelligence
      |
      v
Next.js 15 Frontend (Frontend/)
  React 19, Tailwind CSS v4, polling APIs
  Dashboard, Maintenance, Asset 360, Incident Room
```

## Key Features

- **OEE Command Center** — Availability x Performance x Quality per line/shift, aggregated by plant
- **Predictive Maintenance** — Rolling sensor features (1h/4h/24h vibration, temperature, kurtosis), ML scoring, RUL estimation
- **Incident Lifecycle** — WATCH > DETECTED > ASSESSING > AWAITING_DECISION > EXECUTING > RECOVERING > RESOLVED > WATCH
- **Options Engine** — Score maintenance options across 9 criteria (safety, cost, production, customer impact, people, parts, quality, compliance, confidence)
- **Cortex Intelligence** — Copilot powered by Snowflake Cortex Agent with search services over maintenance docs and operator notes
- **Real-time Data Flow** — Dynamic Tables with 1-hour lag, frontend polling at 5-15s intervals

## CoCo CLI Skills

Three modular skills in `.cortex/skills/`:

| Skill | Purpose |
|-------|---------|
| `$pdm-detect` | Score assets, raise alerts, open incident |
| `$pdm-assess-options` | Generate and rank maintenance options with evidence |
| `$pdm-execute-recover` | Execute approved option, verify recovery |

## Data

- **3 plants**: Pune, Chennai, Coimbatore (India)
- **50 assets** (16 monitored): CNC machines, robots, pumps, conveyors
- **11 production lines** across 3 plants
- **48 CSV tables**: sensor readings, machine states, work orders, job execution, customer orders, spare parts, operator assignments, electrical metering, maintenance docs, and more
- **Currency**: INR

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Database | Snowflake (Dynamic Tables, Cortex Search, Cortex Agent, Semantic Views) |
| Backend | Python, FastAPI, snowflake-connector-python, SSE |
| Frontend | Next.js 15, React 19, Tailwind CSS v4, Lucide, Motion |
| ML | Snowpark ML (feature engineering, training, scoring) |
| CLI | Snowflake CoCo CLI with 3 custom skills |

## Getting Started

### Prerequisites

- Node.js 18.17+
- Python 3.10+
- Snowflake account with Cortex features enabled
- Snowflake CoCo CLI

### 1. Snowflake Setup

Load the 48 CSV files into Snowflake and create the Dynamic Tables and views. The database is `PDM` with schemas RAW, CORE, ANALYTICS, ML, APP, SEARCH.

### 2. Backend

```bash
cd Backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Uses `externalbrowser` auth by default. Configure via environment variables or `Backend/.env.example`.

### 3. Frontend

```bash
cd Frontend
npm install
```

Set `NEXT_PUBLIC_API_URL=http://localhost:8000` in `.env.local` (defaults to `http://localhost:8000`).

Open [http://localhost:3000](http://localhost:3000).

## Snowflake Objects

| Schema | Objects |
|--------|---------|
| RAW | 48 tables (loaded from CSV) |
| CORE | DIM_SITE, DIM_LINE, DIM_ASSET, DIM_PRODUCT, FACT_SENSOR_COMBINED, FACT_MACHINE_STATE, FACT_JOB_EXECUTION, FACT_WORK_ORDER |
| ANALYTICS | DT_OEE_LINE_SHIFT, DT_ASSET_FEATURES, VW_KPI_SUMMARY, VW_ACTIVE_ALERTS, VW_ORDERS_AT_RISK, VW_PART_GAP, VW_PLANT_HEALTH |
| ML | Feature store, trained model, scoring procedure |
| APP | INCIDENTS, INCIDENT_OPTIONS, INCIDENT_ACTIONS, WATCH_STATE, SCENARIOS, CFG_POLICY |
| SEARCH | CSS_DOCS, CSS_NOTES (Cortex Search over maintenance documents and operator notes) |

## API Endpoints

The backend exposes 25+ endpoints under `/api/`:

| Endpoint | Description |
|----------|-------------|
| `/api/kpis` | KPI summary (OEE, alerts, breakdown hours, cost) |
| `/api/plants` | Plant health overview |
| `/api/alerts` | Active machine alerts with sensor readings |
| `/api/orders` | Orders at risk with revenue exposure |
| `/api/maintenance/queue` | Ranked maintenance queue |
| `/api/maintenance/readiness` | Work order bucket counts |
| `/api/assets/{id}` | Asset 360 detail with sensor time series |
| `/api/production` | Daily actual vs plan |
| `/api/energy` | Per-plant power consumption |
| `/api/technicians` | Workforce availability |
| `/api/activity-stream` | Live event stream |
| `/api/copilot/chat` | Cortex Agent intelligence proxy |
| `/api/incidents` | Incident lifecycle CRUD + SSE |
| `/api/simulator` | Scenario control |

---

Snowflake CoCo CLI Hackathon 2026, GCC Edition
