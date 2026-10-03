# CLAUDE.md: Plant Sentinel (Snowflake CoCo CLI Hackathon 2026, GCC Edition)

Read this file first in every session. Keep it current: update the **Status log** at the bottom after each work block.

## 1. What we are building

**Plant Sentinel** is a Snowflake-native Predictive Maintenance and OEE Command Center for a discrete-manufacturing plant (CNC, robots, pumps, conveyors). Problem statement 03: correlate OT sensor streams with ERP and maintenance records, predict failures with natural-language root cause, and give a command center for alert triage and action.

One-line pitch: **from alert to approved action to verified recovery**, governed inside Snowflake. We predict a failure, open an incident, compare 2-3 options on safety, cost, production and people, let a human choose, execute the choice, verify recovery, then return to guard mode.

## 2. Hackathon facts and deadlines

- Event: Snowflake CoCo CLI Hackathon 2026, GCC Edition (hack2skill). CoCo = Cortex Code (renamed 2 Jun 2026). It is a dev-time coding agent; CoWork = renamed Snowflake Intelligence.
- Judging: Technical Execution 40%, Real-World Relevance 30%, Solution Completeness 30%.
- **Prototype submission closes 4 Oct 2026. Aim to submit by noon on 4 Oct.** Evaluation 5-22 Oct, shortlist 23 Oct, finale demos 27-30 Oct.
- Today (session start): 1 Oct 2026. About three working days left.
- Open check: event T&Cs on whether non-Snowflake services are allowed. Default to Snowflake-native; keep the backend and UI thin.

### Submission form (all three required)
1. **MVP brief**, max 1024 characters. Draft in section 11.
2. **Demo video link**, 3-5 minutes (target 4:15). Screen recording of an **end-to-end workflow executed via CoCo CLI** showing **Input -> Processing -> Output**, at least one fully working workflow, and **2-3 modular skills/capabilities** demonstrated.
3. **Prototype deck (PDF)** using the organiser's own template. Outline in section 12.

## 3. CoCo CLI skills (the three demo skills)

Skills live in `.cortex/skills/`. Each has a `SKILL.md` with YAML frontmatter (`name`, `description`) then instructions. Invoke with `$skill-name`.

**Reliability rule:** LLMs vary between runs. Each skill must call **fixed, tested SQL files or stored procedures** (`CALL PDM.APP.SP_...`), not free-form SQL. Test every skill at least 5 times before recording.

| Skill | Input | Processing | Output |
|---|---|---|---|
| `pdm-detect` | Scenario trigger (e.g. `S1`) or new sensor batch | Simulator streams readings into `RAW`; Dynamic Tables refresh; scoring runs; rules open an incident | Incident in state DETECTED with severity and time to failure |
| `pdm-assess-options` | Incident ID | Pull evidence; Cortex Search for manuals/SOPs/regulations/contracts/notes; check parts, certified technicians, shift, orders; run `SP_GENERATE_OPTIONS` (2-3 options + do-nothing baseline scored on safety, money, production, people, compliance) | Option cards in `APP.INCIDENT_OPTIONS`; state AWAITING_DECISION |
| `pdm-execute-recover` | Incident ID + chosen option (after human approval) | Execute actions (technician alerted, machine derated/stopped, parts reserved, jobs rerouted, WO created); verify recovery; relax to guard mode | Metrics back to normal, incident RESOLVED, asset back in WATCH |

The human approval step happens **between skills 2 and 3**. The skill must stop and ask; it must never choose for the human.

## 3b. Scenario simulation and incident lifecycle

A **Scenario Player** plays a fault story. The AI behaves like an on-call reliability engineer: watches quietly, raises an incident when needed, explains trade-offs, waits for a human, executes, checks the result, goes back to watching.

### Lifecycle state machine (stored in `APP.INCIDENTS.state`)
`WATCH` -> `DETECTED` -> `ASSESSING` -> `AWAITING_DECISION` -> `EXECUTING` -> `RECOVERING` -> `RESOLVED` -> `WATCH`
Side branches: `ESCALATED` (no decision by deadline), `FALSE_ALARM` (dismissed; feedback logged).
**Safety interlocks are separate from the AI:** a critical-threshold trip (e.g. RMS >= 7.1 mm/s) stops the machine automatically. The AI recommends; interlocks protect; humans decide.

### Options engine (deterministic SQL/Snowpark; the LLM only explains)
`SP_GENERATE_OPTIONS(incident_id)` returns 2-3 options + do-nothing baseline. Every option scored on:
1. **Safety** - hard gate (blocked if safety limit broken; supervisor override only)
2. **Money** - parts, labour/overtime, downtime cost/min, breakdown cost, late penalties, warranty risk
3. **Production/value** - units lost, OEE effect, line throughput, queued jobs rerouted
4. **Customer impact** - orders and ₹ at risk, tier, penalty/day
5. **People/skills** - certified technician on shift, call-out needed, overtime
6. **Parts/supply** - stock, PO ETA, expedite needed
7. **Quality** - defect-rate rise with severity (scrap cost)
8. **Compliance/warranty** - LOTO, documented lubrication, claim eligibility
9. **Confidence** - model confidence and uncertainty

Weights in `APP.CFG_POLICY` (editable). Show per-criterion bars and total; recommend one option but let human choose any non-blocked option.

### "Can we stop the line?" panel
For the faulted asset compare: **run as is**, **derate**, **stop asset only**, **stop whole line**. For each show: throughput loss %, downstream starvation, orders delayed/penalties, scrap, safety exposure, probability and cost of unplanned breakdown.

### Flagship scenario S1: CNC-02 bearing wear
Night shift; no certified spindle technician on shift; grease out of stock; orders due 4-7 Oct.
- **Option A**: stop CNC-02 now, call out TECH_011/TECH_017 (overtime), repair tonight
- **Option B**: derate now (reduced feed/spindle speed), run to Afternoon shift, planned repair with TECH_011
- **Option C**: run normally until grease PO arrives (5 Oct) — **blocked by safety gate**
- **Baseline**: do nothing -> interlock trip and breakdown of 14-30 h

### Execution (what "executed" means)
Each option = plan of actions in `APP.INCIDENT_ACTIONS`: notify technician -> set machine state (derate/stop) -> reserve parts -> reroute jobs -> create WO -> draft supplier expedite email. Risky steps need human approval; notifications do not.

### Recovery and guard mode
Post-repair: simulator switches to post-repair profile, severity falls to 0, KPIs recompute. Exit criteria (with hysteresis): N consecutive readings RMS < warning, bearing temp at baseline + margin, no new alerts, WO closed. Then `RESOLVED` -> `WATCH` with heightened-watch profile (lower thresholds) for 2 shifts, then normal.

### Branching replay
Simulator continues differently depending on choice. After run show **outcome scorecard**: predicted vs actual cost, downtime, safety margin, orders late. Judges can reset and choose differently.

### Scenario library
S1 CNC-02 bearing wear (flagship). S2 CNV-02 overheating (safety). S3 PMP-02 cavitation (cheap fix). S4 ROB-02 misalignment. S5 sensor glitch false alarm. S6 two faults, one technician. **Build S1 fully; S5/S3 reuse same engine; S2/S4/S6 stretch.**

## 4. Architecture

Plant simulator -> Snowpipe Streaming (~5-10s end-to-end) -> `RAW` -> Dynamic Tables (features, OEE, order exposure) -> Snowpark ML scoring Task (every minute) -> `PRED_ASSET_SCORES` -> alert rules -> `APP.ALERTS` (hybrid table). AI: Cortex Analyst (semantic view), Cortex Search (documents), Cortex Agent (tools). Gateway: FastAPI with key-pair auth, REST and SSE, agent stream proxy. UI: Next.js 15 (React 19, Tailwind, shadcn/ui).

Fallbacks: standard tables for hybrid tables; standard warehouse for interactive; Docker Compose for container services.

## 5. Snowflake objects

Database `PDM`; schemas `RAW`, `CORE`, `ANALYTICS`, `ML`, `APP`, `SEARCH`.
- `RAW.*`: 48 CSV tables as loaded
- `CORE.*`: cleaned dimensions and facts
- `ANALYTICS.DT_ASSET_FEATURES`, `DT_OEE_LINE_SHIFT`, `VW_ORDERS_AT_RISK`, `VW_PART_GAP`, `VW_BACKTEST`, `VW_KPI_SUMMARY`, `SV_PDM` (semantic view)
- `ML.PRED_ASSET_SCORES` (asset_id, ts, p_fail_7d, severity, rul_days, top_features), Model Registry `PDM_FAILURE_7D`
- `APP.ALERTS`, `ALERT_EVIDENCE`, `ALERT_FEEDBACK`, `WORK_ORDER_DRAFTS`, `CFG_THRESHOLDS`, `CFG_POLICY`, `AUDIT_LOG`, `COPILOT_THREADS`
- `APP.INCIDENTS`, `INCIDENT_OPTIONS`, `INCIDENT_ACTIONS`, `INCIDENT_EVENTS`, `WATCH_STATE`, `SCENARIOS`
- `APP.PDM_AGENT` (Cortex Agent); `SEARCH.CSS_DOCS` (tables 37, 38, 40, 42) and `SEARCH.CSS_NOTES` (39, 41)
- Stored procedures: `SP_SCORE_ASSETS`, `SP_RAISE_ALERTS`, `SP_EXPLAIN_ALERT`, `WHAT_IF_COST`, `SP_DRAFT_WORK_ORDER`, `SP_GENERATE_OPTIONS`, `SP_EXECUTE_OPTION`
- Scripts in order: `snowflake/00_preflight.sql`, `01_ddl.sql`, `02_load.sql`, `03_dynamic_tables.sql`, `04_ml.sql`, `05_search.sql`, `06_semantic_view.sql`, `07_agent.sql`, `08_app_tables.sql`, `09_views.sql`. All idempotent.

## 6. Data (in `csv_data_v2/`)

48 CSV tables. 45 days, 30-minute sensor cadence, ending **2026-09-30 00:00 IST** ("now" for the demo). 16 monitored assets; 3 plants, 11 lines, 50 assets; currency INR; all names fictional.

### Data Model Overview

**Master Data (Assets & Hierarchy)**
- `01_site_facility.csv` - 3 plants: Pune (PLANT_01, Machining), Chennai (PLANT_02, Assembly), Coimbatore (PLANT_03, Processing)
- `02_production_lines_cells.csv` - Production lines per plant (11 total)
- `03_machines_assets.csv` - 50 assets with criticality (1-5), downtime cost/min (INR), condition monitoring flags
- `04_components_sub_assemblies.csv` - Sub-components per asset
- `05_spare_parts_catalog.csv` - Spare parts with stock qty, reorder point, lead time, compatible asset types
- `06_suppliers_vendors.csv` - Suppliers with rating, delivery time, payment terms
- `07_products_skus.csv` - Products with target cycle time, standard cost, selling price

**OT Sensor Streams (Time Series - 30 min cadence)**
- `08_vibration_dynamics.csv` - Vibration X/Y/Z, RMS velocity (mm/s), peak displacement (um), acceleration (g), kurtosis, crest factor
- `09_temperature_thermal.csv` - Motor winding, bearing outer/inner race, ambient, coolant, exhaust, hydraulic temps (°C)
- `10_rotational_motion.csv` - RPM, torque (Nm), angular velocity, spindle speed, axis positions
- `11_electrical_power.csv` - Voltage, current, power factor, energy consumption
- `12_fluid_hydraulic_pneumatic.csv` - Pressure, flow rates
- `13_acoustic_ultrasonic.csv` - Sound levels, ultrasonic readings
- `14_optical_vision_position.csv` - Vision inspection, position data
- `15_climate_air.csv` - Environmental conditions
- `16_utilities_resources.csv` - Utility consumption
- `17_facility_conditions.csv` - Facility environment

**Production & Quality**
- `18_job_order_execution.csv` - Jobs with planned/actual qty, defective qty, shift, asset, line, order (feeds OEE quality + performance)
- `19_machine_state_downtime.csv` - State codes (Running/Blocked/Down/Setup) with durations (feeds OEE availability)
- `20_process_parameters.csv` - Process parameter readings
- `21_material_consumption.csv` - Material usage per job
- `22_inline_automated_inspection.csv` - Inline quality inspections
- `23_lab_manual_testing.csv` - Lab test results
- `24_surface_dimensional.csv` - Surface/dimensional measurements

**Maintenance & Work Orders (ERP/CMMS)**
- `25_work_orders.csv` - WOs with type (Preventive/Corrective), priority, status, labor hours, parts cost
- `26_maintenance_tasks_steps.csv` - Task steps within WOs
- `27_parts_usage_consumption.csv` - Parts consumed per WO
- `28_meter_readings.csv` - Equipment meter readings
- `29_failure_root_cause_codes.csv` - Failure modes, causes, consequences (ISO 14224)
- `39_historical_maintenance_logs.csv` - Historical maintenance records

**Workforce & Operations**
- `30_shift_management.csv` - Shift schedules (Morning/Afternoon/Night)
- `31_operator_technician_assignments.csv` - Staff assignments to shifts/assets
- `32_operator_actions_logs.csv` - Operator action logs with notes
- `33_skills_certifications.csv` - Technician skills, certification dates, expiry
- `41_shift_handover_notes.csv` - Shift handover documentation

**Energy & Costs**
- `34_electrical_metering.csv` - Electrical metering per asset
- `35_resource_metering.csv` - Resource metering
- `36_tariff_cost_data.csv` - Energy tariffs

**Unstructured / Document Data (for Cortex Search RAG)**
- `37_oem_manuals_documentation.csv` - OEM manuals with text chunks, keywords, per asset/model
- `38_standard_operating_procedures.csv` - SOPs
- `40_safety_compliance_regulations.csv` - Safety/compliance docs
- `42_warranty_sla_contracts.csv` - Warranty/SLA contracts with exclusions, deductibles

**Supply Chain & Logistics**
- `43_inventory_transactions.csv` - Inventory movements (receipt/issue)
- `44_purchase_orders.csv` - Purchase orders with status, ETA
- `45_warehouse_logistics.csv` - Warehouse data
- `46_customer_orders.csv` - Customer orders with due date, order value, penalty/day, tier, assigned line

**ML Ground Truth & Config**
- `47_ground_truth_failure_events.csv` - Labeled failures: degradation onset, earliest detectable, failure timestamp, severity, breakdown hours/cost, linked WO. **Never use as model feature.**
- `48_cfg_asset_thresholds.csv` - Per-asset-type sensor thresholds (warning/critical) with ISO standards basis

Events: 18 failed, 5 averted, 3 false alarms, 4 active. Reactive baseline: 295 breakdown hours, ₹1.28 crore (₹12,843,170).

### Verified demo facts (use these exact numbers)
- **CNC-02 (`ASSET_002`)**: Line L001 Housing Machining, Plant 01, criticality 5, downtime ₹723.12/min (~₹43,387/hr), installed 27 Jul 2025
- Last reading (29 Sep 23:30): RMS 5.79 mm/s (baseline 1.59; warn 4.5; critical 7.1), kurtosis 7.50, crest factor 5.41, bearing outer-race 68.1°C (warn 75). Severity 0.80; projected failure **1 Oct 2026 01:29:43**
- Other active: ASSET_015 CNV-02 overheating (sev 0.22), ASSET_011 PMP-02 cavitation (0.32), ASSET_007 ROB-02 misalignment (0.30)
- **Orders on L001 not delivered: 3 orders, ₹4.44 crore** (₹44,377,985): SO-0012 Malwa Tractors 24,750 pcs due 4 Oct ₹22.3M; SO-0013 Kaveri Engines 10,250 pcs due 5 Oct ₹11.1M; SO-0014 Bharat Drivetrain 12,100 pcs due 7 Oct ₹10.9M. Combined penalty ~₹1.78 lakh/day
- **Parts**: PART_0001 spindle bearing set stock **1** (reorder 2), PO_0058 x4 ETA 9 Oct. PART_0052 spindle grease stock **0**, PO_0068 x10 ETA 5 Oct. 20 of 70 parts below reorder; 8 open POs
- **People**: CNC Spindle cert: TECH_004 **expired 20 Sep** (Morning); TECH_011 valid to Sep 2027, TECH_017 valid to May 2028 (both Afternoon). **No certified spindle tech on Night shift (22:00-06:00)**
- **WOs on ASSET_002**: WO_0004/WO_0049 (preventive, completed), WO_0081 (corrective, misalignment, completed), **WO_0090 lubrication PM On Hold since 18 Sep** (grease out of stock), WO_0124 (vibration route, Open)
- **Warranty** CON_002 to 18 Apr 2027, deductible ₹50K, **excludes inadequate/undocumented lubrication**; AMC CON_052 to 28 May 2027
- Quick model check: ROC-AUC 0.88, PR-AUC 0.81; at threshold 0.80: 7/7 test failures caught, median lead 4.2 days, 4 false-alarm asset-days

### Key Identifiers
- Plants: PLANT_01 (Pune), PLANT_02 (Chennai), PLANT_03 (Coimbatore)
- Assets: ASSET_001 through ASSET_050 (types: CNC, Robot Arm, Conveyor, Press, Furnace, Pump, etc.)
- Work Orders: WO_XXXX
- Failure Events: EVT_XXX
- Technicians: TECH_XXX
- Products: PROD_XXX
- Customer Orders: SO-XXXX

### OEE Calculation Logic
OEE = Availability x Performance x Quality
- **Availability** = (Planned Production Time - Downtime) / Planned Production Time → `19_machine_state_downtime`
- **Performance** = (Ideal Cycle Time x Total Count) / Operating Time → `18_job_order_execution` + `10_rotational_motion`
- **Quality** = Good Count / Total Count → `18_job_order_execution` (actual - defective / actual)

### Join Key Reference
- Asset -> Plant: `03_machines_assets.Plant_ID` -> `01_site_facility.Plant_ID`
- Asset -> Line: `03_machines_assets.Line_ID` -> `02_production_lines_cells.Line_ID`
- Sensor -> Asset: all sensor CSVs have `Asset_ID`
- WO -> Asset: `25_work_orders.Asset_ID`
- Job -> Asset/Line/Order: `18_job_order_execution` has Asset_ID, Line_ID, Order_ID
- Parts -> Supplier: `05_spare_parts_catalog.Supplier_ID`
- Failure -> WO: `29_failure_root_cause_codes.Work_Order_ID`
- Ground Truth -> WO: `47_ground_truth_failure_events.Work_Order_ID`
- Threshold -> Asset Type: `48_cfg_asset_thresholds.Asset_Type` -> `03_machines_assets.Asset_Type`
- Order -> Product: `46_customer_orders.Product_ID`
- Order -> Line: `46_customer_orders.Assigned_Line_ID`

## 7. Frontend Architecture (Next.js 15 — existing, needs backend wiring)

### Overview
- Single-page app (`app/page.tsx`) with tab-based navigation via `activeTab` state
- **100% hardcoded data** — ZERO backend API calls (except Copilot chat to Gemini)
- Only API route: `POST /api/copilot` (Google Gemini 2.5 Flash or keyword fallback)
- All data must be wired to Snowflake backend APIs via FastAPI backend

### CRITICAL: Naming Inconsistency to Fix
- **CSV data** uses: Pune (PLANT_01), Chennai (PLANT_02), Coimbatore (PLANT_03) — Indian plants
- **Frontend PlantHealthOverview** uses: Berlin, Chicago, Monterrey, Singapore
- **Frontend Copilot/Energy/Alerts** use: Riverside, Pune, Munich, Austin
- **Resolution**: Align frontend to CSV reality (Pune, Chennai, Coimbatore). Currency to INR (₹).

### Tab Structure & Components
| Tab ID | Component | Status | Demo Priority |
|--------|-----------|--------|---------------|
| `command-center` | Main dashboard (default) | Built, hardcoded | HIGH - wire to backend |
| `maintenance` | MaintenanceHub -> MaintenanceQueue + AssetDetailView | Built, hardcoded | HIGH - becomes Alert Triage |
| `asset-360` | Asset360View | Built, hardcoded | HIGH - wire sensor data |
| `supply-chain` | SupplyChainHub | Built, hardcoded | MEDIUM |
| `finance` | FinanceHub | Built, hardcoded | MEDIUM - becomes Model & ROI |
| `executive` | ExecutiveBriefingHub | Built, hardcoded | LOW |
| `insights` | InsightsLabHub | Built, hardcoded | MEDIUM - ML metrics |
| `vision-center` | VisionCenterHub | Built, hardcoded | LOW (no CSV data) |
| `what-if-lab` | WhatIfLabHub | Built, hardcoded | HIGH - becomes Option Sandbox |
| **NEW: incident-room** | **IncidentRoom** | **Not built** | **CRITICAL - main demo page** |
| **NEW: scenario-player** | **ScenarioPlayer** | **Not built** | **CRITICAL - demo control** |

### NEW: Incident Room (the main demo page)
- Lifecycle stepper (WATCH -> DETECTED -> ... -> RESOLVED)
- Live KPIs (severity, time to failure, ₹ at risk)
- Option cards with per-criterion bars
- Do-nothing baseline comparison
- Line-stop impact panel
- Approve button (human decision point)
- Execution tracker (technician notified/acknowledged, machine derated, parts reserved, jobs rerouted)
- Recovery panel (risk gauge falling, KPIs normalising)
- Guard-mode banner / mode chip in top bar

### NEW: Scenario Player (demo control)
- Scenario picker (S1-S6)
- Speed control (x1, x10, x60)
- Pause, "follow AI recommendation", reset
- Branch replay

### Existing What-If board -> Option Sandbox
Wire to options engine so changing an assumption re-scores options. Link from Incident Room.

### Frontend-to-Backend Data Mapping

#### Command Center Dashboard

**1. KpiMetricsRow.tsx (9 KPI cards)**
| KPI | Hardcoded | Backend Source |
|-----|-----------|---------------|
| Open Alerts | 12 | `APP.ALERTS` COUNT where status='ACTIVE' |
| Plant OEE | 92% | `ANALYTICS.DT_OEE_LINE_SHIFT` weighted avg |
| Breakdown Hours | 18 | `RAW.GROUND_TRUTH_FAILURE_EVENTS` SUM(Breakdown_Hours) current period |
| Breakdown Cost | $284K | Same table SUM(Breakdown_Cost_INR), convert to ₹ |
| Orders at Risk | 5 | `ANALYTICS.VW_ORDERS_AT_RISK` COUNT |
| Assets Online | 96% | `RAW.MACHINE_STATE_DOWNTIME` % in Running state |
| Safety Score | 98% | Derived from compliance + safety alerts |
| Energy Efficiency | 87% | `RAW.ELECTRICAL_METERING` actual vs optimal |
| Predicted Cost Avoidance | $1.2M | `ML.PRED_ASSET_SCORES` + averted failures |

**2. PlantHealthOverview.tsx (plant cards) → 3 plants not 4**
```
FactoryPlant { id, name, country, specialty, health, critical, warning, online, lines, oee, workforce, assets, readinessRUL, annualRevenue }
```
Source: `01_site_facility` + `ANALYTICS.VW_KPI_SUMMARY` per plant + `APP.ALERTS` counts + `03_machines_assets` counts

**3. ProductionPerformanceChart.tsx (daily production)**
Source: `18_job_order_execution` aggregated daily (Actual_Quantity_Produced vs Planned_Quantity) + OEE

**4. CriticalMachineAlerts.tsx (top 3 alerts) → wire to `APP.ALERTS`**
```
MachineAlert { id, machine, issue, location, severity, time, temperature?, vibration?, pressure?, recommendedAction }
```
Source: `APP.ALERTS` top 3 by severity + latest sensor readings + `48_cfg_asset_thresholds`

**5. OrderImpactAnalysisCard.tsx (orders at risk)**
Source: `46_customer_orders` + `07_products_skus` + line alert status → `ANALYTICS.VW_ORDERS_AT_RISK`

**6. SupplyChainRiskCard.tsx**
Source: `05_spare_parts_catalog` + `06_suppliers_vendors` + `43_inventory_transactions` → `ANALYTICS.VW_PART_GAP`

**7. LiveActivityStream.tsx (SCADA events)**
Source: `32_operator_actions_logs` + `19_machine_state_downtime` recent state changes + `APP.INCIDENT_EVENTS`

**8. EnergyTelemetryCard.tsx (per-plant energy)**
Source: `34_electrical_metering` aggregated per plant

**9-12. Maintenance/Technician/Revenue/Recommendations**
- MaintenanceReadinessCard: `25_work_orders` by status/date bucket
- TechnicianAvailabilityCard: `31_operator_technician_assignments` + `33_skills_certifications`
- BusinessRevenueImpactCard: `46_customer_orders` at-risk ₹ over time
- RecommendedActionsPanel: `APP.INCIDENT_OPTIONS` or `ML.PRED_ASSET_SCORES` top actions

#### Maintenance Hub → Alert Triage
**MaintenanceQueue.tsx (8 machines)**
Source: `03_machines_assets` + `ML.PRED_ASSET_SCORES` + `25_work_orders` (last/next) + `APP.ALERTS`

#### Asset 360 View
Source: Latest sensor readings (08-17) + `ML.PRED_ASSET_SCORES` + `25_work_orders` history + `05_spare_parts_catalog` stock + Cortex Agent recommendations

#### Supply Chain Hub
Source: `05_spare_parts_catalog` + `06_suppliers_vendors` + `44_purchase_orders` + `27_parts_usage_consumption` → `ANALYTICS.VW_PART_GAP`

#### Finance Hub → Model & ROI
Source: Breakdown costs + maintenance spend + revenue at risk + model backtest from `ANALYTICS.VW_BACKTEST`

#### Insights Lab
Source: ML model metrics (ROC-AUC, PR-AUC, lead time distribution) + `APP.ALERTS` anomalies

### Backend Architecture (FastAPI Gateway → Snowflake)

#### Why FastAPI (not Next.js API routes)
- Snowflake Python connector is native and mature; `snowflake-connector-python` with key-pair auth
- SSE (Server-Sent Events) for real-time push to frontend — needed for incident lifecycle, sensor streams, alert updates
- Cortex Agent streaming proxy (agent responses stream token-by-token)
- Simulator control (start/pause/reset scenarios) needs stateful server
- FastAPI async + connection pooling for concurrent dashboard queries

#### Connection & Auth
- Key-pair authentication (no passwords in code)
- Connection pool via `snowflake.connector.connect()` with `private_key` from env var
- All queries go through `PDM` database; role `PDM_APP_ROLE` with read on all schemas, write on `APP`
- `.env` file (gitignored): `SNOWFLAKE_ACCOUNT`, `SNOWFLAKE_USER`, `SNOWFLAKE_PRIVATE_KEY_PATH`, `SNOWFLAKE_DATABASE=PDM`, `SNOWFLAKE_WAREHOUSE`

#### Real-Time Data Flow Architecture
```
Simulator (Python) ──writes──> RAW tables (sensor readings for current scenario)
                                    │
                              Dynamic Tables auto-refresh (target_lag = '1 minute')
                                    │
                         ┌──────────┴──────────┐
                    CORE.FACT_*            ANALYTICS.DT_*
                    (cleaned facts)        (features, OEE)
                         │                      │
                    ML.PRED_ASSET_SCORES ◄──── SP_SCORE_ASSETS (Snowflake Task, every 1 min)
                         │
                    SP_RAISE_ALERTS ──writes──> APP.ALERTS (hybrid table for low-latency reads)
                         │
                    APP.INCIDENTS state machine
                         │
              FastAPI Gateway ◄──polls/pushes──> Frontend via SSE + REST
```

**Continuous flow**: Simulator writes → DTs refresh → scoring task runs → alerts raised → SSE pushes to frontend. End-to-end latency target: ~5-10 seconds.

#### API Routes (full spec)

**Dashboard Data (REST — polled every 10-30s by frontend)**
```
GET /api/kpis
  → SELECT * FROM ANALYTICS.VW_KPI_SUMMARY
  Returns: { alerts_active, oee_avg, breakdown_hours, breakdown_cost_inr,
             orders_at_risk, assets_online_pct, safety_score, energy_efficiency,
             predicted_cost_avoidance_inr }

GET /api/plants
  → SELECT * FROM ANALYTICS.VW_PLANT_HEALTH
  Returns: [{ plant_id, plant_name, facility_type, state, health_score,
              critical_alerts, warning_alerts, assets_online, total_assets,
              lines, oee, workforce_count, order_value_inr }]

GET /api/production?days=8
  → SELECT * FROM ANALYTICS.VW_PRODUCTION_DAILY WHERE date >= DATEADD('day', -:days, CURRENT_DATE())
  Returns: [{ date, actual_qty, planned_qty, oee }]

GET /api/alerts?limit=10&severity=CRITICAL,WARNING
  → SELECT a.*, s.rms_velocity, s.bearing_outer_race_temp_c, t.warning_threshold, t.critical_threshold
    FROM APP.ALERTS a JOIN latest_sensors s JOIN APP.CFG_THRESHOLDS t ...
  Returns: [{ alert_id, asset_id, asset_name, plant_name, line_name, severity,
              issue_description, sensor_values: {}, thresholds: {}, recommended_action,
              created_at, p_fail, rul_days }]

GET /api/orders?status=at_risk
  → SELECT * FROM ANALYTICS.VW_ORDERS_AT_RISK
  Returns: [{ order_id, customer_name, customer_tier, product_name, order_qty,
              due_date, order_value_inr, penalty_per_day_inr, assigned_line,
              status, risk_reason, revenue_exposure_inr }]

GET /api/supply-chain
  → SELECT * FROM ANALYTICS.VW_PART_GAP
  Returns: [{ part_id, part_name, supplier_name, supplier_rating, lead_time_days,
              current_stock, reorder_point, min_stock, compatible_asset_types,
              affected_asset_count, days_to_stockout, po_status, po_eta, risk_level }]

GET /api/energy
  → SELECT plant_id, plant_name, SUM(active_power_kw)/1000 as power_mw, AVG(power_factor) as load_pct ...
    FROM RAW.ELECTRICAL_METERING em JOIN RAW.MACHINES_ASSETS ma ... GROUP BY plant_id
  Returns: [{ plant_id, plant_name, power_mw, load_pct, trend_pct }]

GET /api/maintenance/readiness
  → SELECT status_bucket, count(*) FROM (
      CASE WHEN planned_start <= NOW() THEN 'due_today'
           WHEN planned_start <= NOW() + INTERVAL '7 days' THEN 'this_week' ... END
    ) FROM RAW.WORK_ORDERS WHERE status IN ('Open','In Progress','On Hold') GROUP BY 1
  Returns: { due_today, this_week, next_week, on_track, healthy_pct }

GET /api/maintenance/queue?limit=10
  → SELECT a.*, p.p_fail_7d, p.severity, p.rul_days, wo_last.actual_end_time as last_maintenance,
           wo_next.planned_start_time as next_due, al.alert_count
    FROM CORE.DIM_ASSET a LEFT JOIN ML.PRED_ASSET_SCORES p ...
    ORDER BY p.severity DESC, p.p_fail_7d DESC
  Returns: [{ asset_id, asset_name, model, line_name, plant_name, status,
              issue, failure_timeline, health_score, financial_impact_inr,
              age_years, criticality, last_maintenance, next_due }]

GET /api/assets/:asset_id
  → Multi-query: latest sensors (08-13) + PRED_ASSET_SCORES + WORK_ORDERS history
    + SPARE_PARTS stock + OPERATOR_ACTIONS_LOGS + CFG_THRESHOLDS
  Returns: { identity: {}, health: {}, sensors: { vibration: {}, temperature: {}, rotation: {}, electrical: {} },
             prediction: {}, maintenance_history: [], spare_parts: [], operator_trail: [], thresholds: {} }

GET /api/assets/:asset_id/sensors?hours=24
  → Time-series sensor data for charts
  Returns: [{ timestamp, rms_velocity, bearing_temp, spindle_rpm, power_kw, ... }]

GET /api/technicians
  → SELECT ta.*, sc.certification_type, sc.expiry_date FROM RAW.OPERATOR_TECHNICIAN_ASSIGNMENTS ta
    JOIN RAW.SKILLS_CERTIFICATIONS sc ...
  Returns: { available, in_progress, in_training, unavailable, total,
             details: [{ tech_id, name, shift, certs: [{ type, expiry, valid }] }] }

GET /api/activity-stream?limit=20
  → UNION of APP.INCIDENT_EVENTS + RAW.OPERATOR_ACTIONS_LOGS + RAW.MACHINE_STATE_DOWNTIME recent changes
  Returns: [{ id, timestamp, plant, title, description, event_type, asset_id }]

GET /api/finance/summary
  → Aggregation: breakdown costs, maintenance spend, revenue at risk, cost avoided, model ROI
  Returns: { cost_avoided_inr, revenue_at_risk_inr, maintenance_spend_inr, downtime_cost_inr,
             breakdown_hours, model_roi, backtest: { roc_auc, pr_auc, caught, total, lead_days } }
```

**Incident Lifecycle (REST + SSE)**
```
GET /api/incidents
  → SELECT * FROM APP.INCIDENTS ORDER BY started_ts DESC
  Returns: [{ incident_id, alert_id, asset_id, scenario_id, state, started_ts, resolved_ts,
              chosen_option, severity, p_fail, rul_days }]

GET /api/incidents/:id
  → Full incident detail: incident + options + actions + evidence + timeline
  Returns: { incident: {}, options: [], actions: [], evidence: {}, timeline: [] }

GET /api/incidents/:id/options
  → SELECT * FROM APP.INCIDENT_OPTIONS WHERE incident_id = :id ORDER BY rank
  Returns: [{ option_id, label, plan_json, scores: { safety, money, production, customer,
              people, parts, quality, compliance, confidence }, expected_cost_inr,
              expected_downtime_h, p_fail, safety_status, recommended, rank }]

POST /api/incidents/:id/approve
  Body: { option_id, approved_by }
  → CALL PDM.APP.SP_EXECUTE_OPTION(:incident_id, :option_id, :approved_by)
  Returns: { success, actions_queued: [] }

GET /api/incidents/:id/stream (SSE — Server-Sent Events)
  → Long-lived connection. Pushes events as incident progresses:
    event: state_change    data: { state: "EXECUTING", ts }
    event: action_update   data: { action_id, step, status: "completed", ts }
    event: sensor_update   data: { asset_id, rms_velocity, severity, ts }
    event: kpi_update      data: { oee, risk_inr, assets_online }
    event: recovery        data: { severity: 0, state: "RESOLVED" }
  Frontend subscribes on incident open, closes on RESOLVED.

GET /api/incidents/:id/line-impact
  → SP: compare run-as-is vs derate vs stop-asset vs stop-line
  Returns: [{ scenario, throughput_loss_pct, downstream_starvation, orders_delayed,
              penalty_inr, scrap_cost_inr, safety_exposure, p_breakdown, breakdown_cost_inr }]
```

**Simulator Control**
```
POST /api/sim/start
  Body: { scenario_id: "S1", speed: 10 }
  → Starts scenario: writes sensor readings into RAW at accelerated pace

POST /api/sim/action
  Body: { asset_id, action: "derate"|"stop"|"resume", params: {} }
  → Changes simulator profile for asset (switches to derated/stopped/post-repair profile)

POST /api/sim/reset
  → Resets all simulator state, truncates scenario-injected rows, resets incidents

GET /api/sim/status
  → { running, scenario_id, speed, elapsed_data_minutes, current_data_time }
```

**Copilot / Intelligence (Cortex Agent + Snowflake Intelligence)**
```
POST /api/copilot/chat
  Body: { message, conversation_id?, incident_id? }
  → Streams response from PDM_AGENT (Cortex Agent) via SSE
  The agent has tools:
    - query_oee(plant_id?, line_id?, date_range?) → runs SQL against ANALYTICS views
    - get_asset_health(asset_id) → sensor + prediction + threshold data
    - search_docs(query) → Cortex Search over OEM manuals, SOPs, regulations, warranty
    - search_notes(query) → Cortex Search over maintenance logs, shift handover notes
    - explain_alert(alert_id) → SP_EXPLAIN_ALERT: cited root cause with evidence
    - list_orders_at_risk(line_id?) → VW_ORDERS_AT_RISK query
    - check_parts(part_ids) → stock, PO status, ETA
    - check_technician(cert_type, shift?) → available certified staff
    - what_if_cost(asset_id, scenario_params) → WHAT_IF_COST SP
    - create_work_order(asset_id, description, priority) → SP_DRAFT_WORK_ORDER
  Response format: SSE stream of tokens + tool_call events + final summary

POST /api/copilot/explain-alert
  Body: { alert_id }
  → Dedicated endpoint: calls SP_EXPLAIN_ALERT then Cortex Agent for natural language explanation
  Returns (streamed): { root_cause, evidence: [], citations: [], recommended_actions: [],
                        warranty_impact, compliance_notes }
```

#### Snowflake Intelligence (CoWork) Integration
Snowflake Intelligence (renamed from Snowflake Intelligence, formerly known as CoWork) provides a hosted conversational interface. We integrate it for:

1. **Alert Explanations**: When an alert is raised, the Cortex Agent (PDM_AGENT) is called to generate a natural language explanation with citations from OEM manuals, SOPs, regulations, and warranty contracts via Cortex Search. This powers both the CoCo CLI skill output and the frontend copilot.

2. **Copilot in Command Center**: The floating chat agent (NexaCopilotFloatingAgent.tsx) replaces Gemini with Cortex Agent. The agent has access to all Snowflake data through tools (semantic view queries, Cortex Search, stored procedures). Responses stream via SSE.

3. **Incident Assessment**: `pdm-assess-options` skill uses the agent to generate natural language option descriptions with cited evidence. The deterministic scoring comes from `SP_GENERATE_OPTIONS` (SQL); the explanation comes from the agent.

4. **Root Cause Investigation**: Users can ask "Why is CNC-02 overheating?" and the agent:
   - Queries latest sensor readings + trend
   - Searches OEM manual for operating limits
   - Checks maintenance history (WO_0090 lubrication on hold)
   - Checks operator trail (warning bypassed, feed reduced)
   - Checks warranty exclusions
   - Returns cited explanation with evidence chain

5. **Executive Briefing**: The agent generates the daily briefing narrative from real KPI data, replacing the hardcoded HeroBriefing text.

#### Cortex Agent Definition (PDM_AGENT)
```sql
CREATE OR REPLACE CORTEX AGENT PDM.APP.PDM_AGENT
  COMMENT = 'Plant Sentinel maintenance copilot'
  MODEL = 'claude-3-5-sonnet'  -- or llama-3.1-70b
  TOOLS = (
    PDM.APP.TOOL_QUERY_OEE,
    PDM.APP.TOOL_GET_ASSET_HEALTH,
    PDM.APP.TOOL_EXPLAIN_ALERT,
    PDM.APP.TOOL_LIST_ORDERS_AT_RISK,
    PDM.APP.TOOL_CHECK_PARTS,
    PDM.APP.TOOL_CHECK_TECHNICIAN,
    PDM.APP.TOOL_WHAT_IF_COST,
    PDM.APP.TOOL_DRAFT_WORK_ORDER
  )
  SEARCH_SERVICES = (
    PDM.SEARCH.CSS_DOCS,   -- OEM manuals, SOPs, safety regs, warranty contracts
    PDM.SEARCH.CSS_NOTES   -- maintenance logs, shift handover notes
  )
  SEMANTIC_VIEWS = (
    PDM.ANALYTICS.SV_PDM   -- natural language SQL over OEE, sensors, orders, maintenance
  )
  SYSTEM_PROMPT = $$
    You are Plant Sentinel, an AI reliability engineer for a discrete manufacturing plant.
    You have access to real-time sensor data, maintenance records, inventory, shift schedules,
    customer orders, and technical documentation for 3 plants (Pune, Chennai, Coimbatore)
    with 50 assets (CNC machines, robot arms, pumps, conveyors).
    
    Rules:
    - Never invent numbers. Always query the data or cite a document.
    - When explaining an alert, cite the specific OEM manual section, threshold standard (ISO 20816-3, IEC 60034-1), or regulation.
    - When recommending an action, check: technician certification + shift, parts stock + PO ETA, warranty exclusions, safety LOTO requirements.
    - Currency is INR (₹). Use lakh/crore for large amounts (1 lakh = ₹1,00,000; 1 crore = ₹1,00,00,000).
    - Present options, never decide. The human approves.
    - If asked about camera feeds, vision, or topics outside your data, say so honestly.
  $$;
```

#### Cortex Search Services
```sql
-- Documents: OEM manuals, SOPs, safety regulations, warranty/SLA contracts
CREATE OR REPLACE CORTEX SEARCH SERVICE PDM.SEARCH.CSS_DOCS
  ON PDM.SEARCH.DOCS_CHUNKS
  TARGET_LAG = '1 hour'
  WAREHOUSE = PDM_WH
  EMBEDDING_MODEL = 'e5-base-v2'
  ATTRIBUTES = asset_id, asset_type, document_type, model_number;

-- Notes: historical maintenance logs, shift handover notes
CREATE OR REPLACE CORTEX SEARCH SERVICE PDM.SEARCH.CSS_NOTES
  ON PDM.SEARCH.NOTES_CHUNKS
  TARGET_LAG = '1 hour'
  WAREHOUSE = PDM_WH
  EMBEDDING_MODEL = 'e5-base-v2'
  ATTRIBUTES = asset_id, work_order_id, shift_id, priority_flag;
```

The search tables (`DOCS_CHUNKS`, `NOTES_CHUNKS`) are built from:
- `37_oem_manuals_documentation` → text chunks with asset_id, document_type, keywords
- `38_standard_operating_procedures` → SOP steps with safety warnings
- `40_safety_compliance_regulations` → regulation text with applicability
- `42_warranty_sla_contracts` → coverage terms, exclusions, claim process
- `39_historical_maintenance_logs` → free text notes with extracted entities
- `41_shift_handover_notes` → free text with priority flags

#### Frontend Data Fetching Pattern
Replace all hardcoded constants with React Query (TanStack Query) hooks:
```typescript
// Example: KPI data
const { data: kpis } = useQuery({
  queryKey: ['kpis'],
  queryFn: () => fetch('/api/kpis').then(r => r.json()),
  refetchInterval: 15_000, // poll every 15 seconds
});

// Example: SSE for incident stream
useEffect(() => {
  if (!incidentId) return;
  const es = new EventSource(`/api/incidents/${incidentId}/stream`);
  es.addEventListener('state_change', (e) => setState(JSON.parse(e.data)));
  es.addEventListener('sensor_update', (e) => setSensors(JSON.parse(e.data)));
  es.addEventListener('action_update', (e) => updateAction(JSON.parse(e.data)));
  return () => es.close();
}, [incidentId]);

// Example: Copilot streaming
async function sendMessage(msg: string) {
  const res = await fetch('/api/copilot/chat', {
    method: 'POST',
    body: JSON.stringify({ message: msg, incident_id: currentIncident }),
  });
  const reader = res.body.getReader();
  // stream tokens to chat UI
}
```

**Polling intervals:**
- KPIs, plant health, alerts: every 15s
- Production chart, orders, supply chain: every 30s
- Energy, maintenance, technicians: every 30s
- Asset 360 sensor readings: every 10s (when viewing)
- Activity stream: every 5s or SSE
- Incident lifecycle: SSE (real-time push)

#### Gap Analysis: Data Fixes Required Before Backend Works

**Must fix in frontend (hardcoded → dynamic):**
1. Plants: 4 fictional → 3 real (Pune/Chennai/Coimbatore). Remove 4th plant entirely.
2. Currency: USD ($) → INR (₹) everywhere. Use `Intl.NumberFormat('en-IN')` for lakh/crore.
3. Customers: BMW/CAT/Tesla → Kaveri Engines/Malwa Tractors/Bharat Drivetrain/etc.
4. Products: Brake Assembly → Brake Caliper Housing/Gearbox Cover/etc. (20 real products)
5. Asset types: Remove Press/HVAC/Compressor/Chiller/Packaging. Only CNC/Robot Arm/Pump/Conveyor.
6. Asset count: 1,248 → 50. Line count: 31 → 11. Workforce: 892 → actual from assignments.
7. Dates: Nov 2024 → Aug-Sep 2026.
8. All sensor values: hardcoded → from API (e.g. CNC-02 temp 112°C → actual 68.1°C from data).
9. All KPIs: hardcoded → computed from Snowflake views.
10. Suppliers: Siemens/Bosch/SKF → actual Indian suppliers from CSV.

**Must build in backend:**
1. All API routes listed above
2. Snowflake views/DTs that power each route
3. Cortex Agent with tools + search services
4. Simulator that writes sensor data and controls scenarios
5. SSE infrastructure for real-time push

## 8. Competitive position

Our edge: constraint-aware work-order draft (parts, certified technician, shift, safety step) with human approval; customer-order exposure with ₹ penalties; cited root cause incl. warranty and regulations; backtest + feedback; live fault injection; governance; no data leaves Snowflake.

Do not claim: better accuracy than Augury/Siemens; novelty of financial ranking; real plant data. State clearly that data is synthetic.

## 9. Work plan (priority order)

**Day 1 (1 Oct):** `00_preflight.sql`; DDL + load 48 tables; Dynamic Tables; model training (Snowpark ML) + `SP_SCORE_ASSETS`; `SP_RAISE_ALERTS`; first pass `pdm-detect` skill. Start `COCO_LOG.md`.
**Day 2 (2 Oct):** Cortex Search + semantic view; Cortex Agent; `SP_EXPLAIN_ALERT`, `WHAT_IF_COST`, `SP_GENERATE_OPTIONS`, `SP_EXECUTE_OPTION`; incident tables; skills 2+3; simulator S1 with branching; FastAPI backend.
**Day 3 (3 Oct):** React UI: Incident Room + Scenario Player first; wire Command Center, Alert Triage, Asset 360, Copilot, Work Orders; What-If -> Option Sandbox; record demo.
**4 Oct (morning):** Fixes only; upload video + PDF; submit by noon.

## 10. Demo video script (target 4:15)

- 0:00-0:20 Context: guard mode, all green
- 0:20-1:00 `$pdm-detect S1`: streaming, DTs, scoring → incident DETECTED
- 1:00-2:20 `$pdm-assess-options`: evidence, cited cause, constraints, 3 options + baseline, line-stop panel
- 2:20-2:40 Human decision: skill stops, user approves option B (or A)
- 2:40-3:40 `$pdm-execute-recover`: actions execute, recovery panel, back to WATCH
- 3:40-4:15 Branch replay + outcome scorecard + honest "synthetic data" banner

## 11. MVP brief (draft, 904 chars)

```
Plant Sentinel is a Snowflake-native predictive maintenance and OEE command center for discrete manufacturing. It fuses sensor streams with ERP, CMMS, inventory, shift and contract data to predict failures days ahead and explain root cause with citations. When a fault develops it opens an incident: the AI compares 2-3 options on safety, cost, production, customer-order impact, technician certification and spare parts, including what happens if the line is stopped or not. A human approves one; the system executes it (technician alerted, machine derated or stopped, parts reserved, jobs rerouted), verifies recovery, then returns to guard mode. A scenario simulator replays faults. Built on Snowpipe Streaming, Dynamic Tables, Snowpark ML, Cortex Search and Agents, and driven by three CoCo CLI skills. Synthetic data: 48 tables, 18 injected failures. [UPDATE: backtest X of Y caught, Z days warning]
```

## 12. Prototype deck outline

1. Title + one-line pitch. 2. Problem + who feels it. 3. Solution overview (alert to approved action). 4. Architecture on Snowflake. 5. Incident lifecycle + three CoCo skills. 6. Screens. 7. Market gap. 8. Results + caveats. 9. Production readiness. 10. Business impact + roadmap. 11. Links + team.

## 13. Rules for the coding agent

- Never invent numbers. Every metric must come from data or computed query.
- Use verified facts in section 6; do not change without re-running generator.
- Snowflake scripts idempotent (`CREATE OR REPLACE` or `IF NOT EXISTS`).
- No secrets in repo. Key-pair auth + env vars. `.env` in `.gitignore`.
- Ask before running anything costly or modifying outside database `PDM`.
- Skills call stored procedures or fixed SQL files, not free-form SQL.
- Small commits, update Status log.

## 14. Files & Directories
```
coco-hackathon/
├── csv_data_v2/              # 48 CSV files (the data, 45 days ending 30 Sep 2026)
├── Frontend/                 # Next.js 15 app (React 19, Tailwind CSS v4, Lucide, Motion)
│   ├── app/page.tsx          # Main SPA entry with tab navigation
│   ├── app/api/copilot/      # Gemini copilot → replace with Cortex Agent proxy
│   ├── components/           # 17 dashboard + 5 hub pages + modals (all hardcoded)
│   ├── lib/                  # Utilities (cn, hooks)
│   └── package.json          # Next.js 15, React 19
├── Backend/                  # FastAPI backend
│   ├── main.py               # FastAPI app, CORS, routes
│   ├── db.py                 # Snowflake connection pool (externalbrowser auth)
│   ├── routes/               # Route modules (kpis, plants, alerts, incidents, copilot, sim, etc.)
│   ├── services/             # Business logic (scoring, options engine, simulator)
│   ├── models/               # Pydantic response models
│   └── requirements.txt      # snowflake-connector-python, fastapi, uvicorn, sse-starlette
├── snowflake/                # SQL scripts (to be built)
│   ├── 00_preflight.sql      # Feature availability checks
│   ├── 01_ddl.sql            # Database, schemas, raw tables
│   ├── 02_load.sql           # Stage, PUT, COPY INTO
│   ├── 03_dynamic_tables.sql # CORE dims/facts + ANALYTICS DTs
│   ├── 04_ml.sql             # Feature eng, model training, scoring SP
│   ├── 05_search.sql         # Cortex Search services (CSS_DOCS, CSS_NOTES)
│   ├── 06_semantic_view.sql  # SV_PDM semantic view
│   ├── 07_agent.sql          # Cortex Agent PDM_AGENT + tools
│   ├── 08_app_tables.sql     # APP schema (incidents, options, actions, config)
│   └── 09_views.sql          # ANALYTICS views (VW_KPI_SUMMARY, VW_ORDERS_AT_RISK, etc.)
├── .cortex/                  # CoCo context files
│   ├── claude.md             # This file — project context
│   ├── cortex.md             # Snowflake object reference
│   └── skills/               # CoCo CLI skills
│       ├── pdm-detect/SKILL.md
│       ├── pdm-assess-options/SKILL.md
│       └── pdm-execute-recover/SKILL.md
├── generator/                # Data generation scripts
│   ├── generate_factory_data.py
│   └── validate_data.py
├── docs/                     # Documentation
│   └── COCO_LOG.md           # CoCo usage log for judges
└── .env.example              # Environment template (no secrets)
```

## 15. Status log

- 30 Sep: Dataset generator, validator and 48-table dataset built (27/27 checks). UI specs written. Market research done.
- 1 Oct (session 1): CLAUDE.md created with scenario simulation and incident lifecycle design.
- 1 Oct (session 2): Frontend explored: 100% hardcoded data across 22 components + 5 hub pages. Complete gap analysis done — 10 structural mismatches identified (4 plants vs 3, 1248 assets vs 50, USD vs INR, wrong customer/product/supplier names, fictional asset types, wrong dates, wrong sensor values). Backend architecture designed: FastAPI backend with 25+ API routes, SSE for real-time, Cortex Agent with 10 tools + 2 search services + semantic view for copilot/intelligence. Full API spec with request/response shapes documented. **Not started:** preflight, DDL, model, agent, skills, options engine, backend code, simulator, Incident Room, video, deck.
