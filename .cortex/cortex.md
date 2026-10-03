# Snowflake Environment Context for Plant Sentinel

## Connection
- **Connection Name**: hackathon
- **Database**: PDM
- **Schemas**: RAW, CORE, ANALYTICS, ML, APP, SEARCH
- **Warehouse**: (use default or COMPUTE_WH, auto-suspend on all)
- **Currency**: INR (₹). All costs in Indian Rupees.

## SQL Script Execution Order (all idempotent)
```
snowflake/00_preflight.sql   -- Check feature availability (hybrid tables, interactive WH, Cortex Agents, SPCS)
snowflake/01_ddl.sql         -- CREATE DATABASE PDM; CREATE SCHEMA RAW/CORE/ANALYTICS/ML/APP/SEARCH; raw tables
snowflake/02_load.sql        -- CREATE STAGE; PUT files; COPY INTO raw tables from csv_data_v2/
snowflake/03_dynamic_tables.sql -- CORE dimensions/facts + ANALYTICS dynamic tables
snowflake/04_ml.sql          -- Feature engineering, model training (Snowpark ML), SP_SCORE_ASSETS, SP_RAISE_ALERTS
snowflake/05_search.sql      -- Cortex Search services (CSS_DOCS, CSS_NOTES)
snowflake/06_semantic_view.sql -- Semantic view SV_PDM for Cortex Analyst
snowflake/07_agent.sql       -- Cortex Agent PDM_AGENT with tools
snowflake/08_app_tables.sql  -- APP schema: incidents, options, actions, events, watch_state, scenarios, alerts, config
snowflake/09_views.sql       -- Analytics views (VW_KPI_SUMMARY, VW_ORDERS_AT_RISK, VW_PART_GAP, VW_BACKTEST, etc.)
```

## RAW Schema — Table Names (match CSV without number prefix)
| CSV File | RAW Table Name |
|----------|---------------|
| 01_site_facility.csv | RAW.SITE_FACILITY |
| 02_production_lines_cells.csv | RAW.PRODUCTION_LINES_CELLS |
| 03_machines_assets.csv | RAW.MACHINES_ASSETS |
| 04_components_sub_assemblies.csv | RAW.COMPONENTS_SUB_ASSEMBLIES |
| 05_spare_parts_catalog.csv | RAW.SPARE_PARTS_CATALOG |
| 06_suppliers_vendors.csv | RAW.SUPPLIERS_VENDORS |
| 07_products_skus.csv | RAW.PRODUCTS_SKUS |
| 08_vibration_dynamics.csv | RAW.VIBRATION_DYNAMICS |
| 09_temperature_thermal.csv | RAW.TEMPERATURE_THERMAL |
| 10_rotational_motion.csv | RAW.ROTATIONAL_MOTION |
| 11_electrical_power.csv | RAW.ELECTRICAL_POWER |
| 12_fluid_hydraulic_pneumatic.csv | RAW.FLUID_HYDRAULIC_PNEUMATIC |
| 13_acoustic_ultrasonic.csv | RAW.ACOUSTIC_ULTRASONIC |
| 14_optical_vision_position.csv | RAW.OPTICAL_VISION_POSITION |
| 15_climate_air.csv | RAW.CLIMATE_AIR |
| 16_utilities_resources.csv | RAW.UTILITIES_RESOURCES |
| 17_facility_conditions.csv | RAW.FACILITY_CONDITIONS |
| 18_job_order_execution.csv | RAW.JOB_ORDER_EXECUTION |
| 19_machine_state_downtime.csv | RAW.MACHINE_STATE_DOWNTIME |
| 20_process_parameters.csv | RAW.PROCESS_PARAMETERS |
| 21_material_consumption.csv | RAW.MATERIAL_CONSUMPTION |
| 22_inline_automated_inspection.csv | RAW.INLINE_AUTOMATED_INSPECTION |
| 23_lab_manual_testing.csv | RAW.LAB_MANUAL_TESTING |
| 24_surface_dimensional.csv | RAW.SURFACE_DIMENSIONAL |
| 25_work_orders.csv | RAW.WORK_ORDERS |
| 26_maintenance_tasks_steps.csv | RAW.MAINTENANCE_TASKS_STEPS |
| 27_parts_usage_consumption.csv | RAW.PARTS_USAGE_CONSUMPTION |
| 28_meter_readings.csv | RAW.METER_READINGS |
| 29_failure_root_cause_codes.csv | RAW.FAILURE_ROOT_CAUSE_CODES |
| 30_shift_management.csv | RAW.SHIFT_MANAGEMENT |
| 31_operator_technician_assignments.csv | RAW.OPERATOR_TECHNICIAN_ASSIGNMENTS |
| 32_operator_actions_logs.csv | RAW.OPERATOR_ACTIONS_LOGS |
| 33_skills_certifications.csv | RAW.SKILLS_CERTIFICATIONS |
| 34_electrical_metering.csv | RAW.ELECTRICAL_METERING |
| 35_resource_metering.csv | RAW.RESOURCE_METERING |
| 36_tariff_cost_data.csv | RAW.TARIFF_COST_DATA |
| 37_oem_manuals_documentation.csv | RAW.OEM_MANUALS_DOCUMENTATION |
| 38_standard_operating_procedures.csv | RAW.STANDARD_OPERATING_PROCEDURES |
| 39_historical_maintenance_logs.csv | RAW.HISTORICAL_MAINTENANCE_LOGS |
| 40_safety_compliance_regulations.csv | RAW.SAFETY_COMPLIANCE_REGULATIONS |
| 41_shift_handover_notes.csv | RAW.SHIFT_HANDOVER_NOTES |
| 42_warranty_sla_contracts.csv | RAW.WARRANTY_SLA_CONTRACTS |
| 43_inventory_transactions.csv | RAW.INVENTORY_TRANSACTIONS |
| 44_purchase_orders.csv | RAW.PURCHASE_ORDERS |
| 45_warehouse_logistics.csv | RAW.WAREHOUSE_LOGISTICS |
| 46_customer_orders.csv | RAW.CUSTOMER_ORDERS |
| 47_ground_truth_failure_events.csv | RAW.GROUND_TRUTH_FAILURE_EVENTS |
| 48_cfg_asset_thresholds.csv | RAW.CFG_ASSET_THRESHOLDS |

## CORE Schema — Dynamic Tables (cleaned, typed, joined)
| Table | Source | Purpose |
|-------|--------|---------|
| CORE.DIM_SITE | RAW.SITE_FACILITY | Plant dimension |
| CORE.DIM_LINE | RAW.PRODUCTION_LINES_CELLS | Production line dimension |
| CORE.DIM_ASSET | RAW.MACHINES_ASSETS | Asset dimension with criticality, cost/min |
| CORE.DIM_PRODUCT | RAW.PRODUCTS_SKUS | Product dimension with cycle time, cost |
| CORE.DIM_SPARE_PART | RAW.SPARE_PARTS_CATALOG | Spare parts with stock, reorder |
| CORE.DIM_SUPPLIER | RAW.SUPPLIERS_VENDORS | Supplier dimension |
| CORE.DIM_TECHNICIAN | RAW.SKILLS_CERTIFICATIONS | Technician skills/certs |
| CORE.FACT_SENSOR_VIBRATION | RAW.VIBRATION_DYNAMICS | Typed vibration readings |
| CORE.FACT_SENSOR_TEMPERATURE | RAW.TEMPERATURE_THERMAL | Typed temperature readings |
| CORE.FACT_SENSOR_ROTATION | RAW.ROTATIONAL_MOTION | Typed RPM/motion readings |
| CORE.FACT_SENSOR_ELECTRICAL | RAW.ELECTRICAL_POWER | Typed electrical readings |
| CORE.FACT_MACHINE_STATE | RAW.MACHINE_STATE_DOWNTIME | State/downtime events |
| CORE.FACT_JOB_EXECUTION | RAW.JOB_ORDER_EXECUTION | Jobs with OEE components |
| CORE.FACT_WORK_ORDER | RAW.WORK_ORDERS + FAILURE_ROOT_CAUSE_CODES | WOs with failure info |
| CORE.FACT_FAILURE_EVENT | RAW.GROUND_TRUTH_FAILURE_EVENTS | Ground truth (training only) |

## ANALYTICS Schema — Dynamic Tables & Views
| Object | Type | Purpose |
|--------|------|---------|
| DT_ASSET_FEATURES | Dynamic Table | Rolling sensor stats (1h, 4h, 24h) for ML |
| DT_OEE_LINE_SHIFT | Dynamic Table | OEE per line per shift (Availability x Performance x Quality) |
| VW_ORDERS_AT_RISK | View | Customer orders at risk due to alerts/downtime on assigned line |
| VW_PART_GAP | View | Parts below reorder + supplier lead time + affected assets |
| VW_BACKTEST | View | Model backtest: predicted vs actual failures |
| VW_KPI_SUMMARY | View | Aggregated KPIs for dashboard (alert count, OEE, breakdown cost, etc.) |
| VW_PLANT_HEALTH | View | Per-plant health composite (OEE + alerts + maintenance backlog) |
| SV_PDM | Semantic View | Natural language interface for Cortex Analyst |

## ML Schema
| Object | Purpose |
|--------|---------|
| PRED_ASSET_SCORES | Scoring output: asset_id, ts, p_fail_7d, severity, rul_days, top_features |
| PDM_FAILURE_7D | Model Registry: gradient-boosting failure prediction model |

## APP Schema — Application State
| Table | Purpose |
|-------|---------|
| ALERTS | Active alerts from threshold violations + ML predictions |
| ALERT_EVIDENCE | Supporting evidence per alert (sensor readings, history) |
| ALERT_FEEDBACK | Human feedback on alerts (true positive, false alarm, etc.) |
| INCIDENTS | Incident lifecycle: state machine (WATCH -> DETECTED -> ... -> RESOLVED) |
| INCIDENT_OPTIONS | 2-3 options + baseline per incident, with per-criterion scores |
| INCIDENT_ACTIONS | Action plan steps per option (notify, derate, reserve parts, reroute, WO) |
| INCIDENT_EVENTS | Timeline of incident events for the activity stream |
| WATCH_STATE | Per-asset watch mode (GUARD/HEIGHTENED/INCIDENT) with threshold profile |
| SCENARIOS | Scenario scripts for the simulator (S1-S6) |
| CFG_THRESHOLDS | Editable sensor thresholds (seeded from RAW.CFG_ASSET_THRESHOLDS) |
| CFG_POLICY | Option scoring weights (safety, money, production, people, etc.) |
| WORK_ORDER_DRAFTS | Generated work order drafts pending approval |
| AUDIT_LOG | All actions audited |
| COPILOT_THREADS | Chat history for Cortex Agent |

## SEARCH Schema — Cortex Search Services
| Service | Source Tables | Purpose |
|---------|--------------|---------|
| CSS_DOCS | 37 (OEM manuals), 38 (SOPs), 40 (safety/compliance), 42 (warranty/SLA) | Document RAG for root cause, maintenance procedures, warranty checks |
| CSS_NOTES | 39 (historical maintenance logs), 41 (shift handover notes) | Operational notes RAG for context |

## Stored Procedures
| Procedure | Purpose |
|-----------|---------|
| SP_SCORE_ASSETS | Run ML model scoring on latest sensor features |
| SP_RAISE_ALERTS | Check PRED_ASSET_SCORES + thresholds, create/update alerts |
| SP_EXPLAIN_ALERT | Cortex Search + Agent: cited root cause explanation |
| WHAT_IF_COST | Cost/impact simulation for what-if scenarios |
| SP_GENERATE_OPTIONS | Build 2-3 options + baseline for an incident with per-criterion scores |
| SP_EXECUTE_OPTION | Execute chosen option's action plan |
| SP_DRAFT_WORK_ORDER | Generate work order from incident + option |

## Key SQL Patterns

### OEE Calculation (in DT_OEE_LINE_SHIFT)
```sql
-- Per line per shift:
-- availability = SUM(running_seconds) / SUM(planned_seconds)
-- performance = SUM(actual_qty * target_cycle_time) / SUM(running_seconds)
-- quality = SUM(actual_qty - defective_qty) / SUM(actual_qty)
-- oee = availability * performance * quality
```

### Sensor Feature Engineering (in DT_ASSET_FEATURES)
```sql
-- Rolling stats over time windows (30-min cadence, so 2 rows/hr)
AVG(rms_velocity) OVER (PARTITION BY asset_id ORDER BY timestamp ROWS BETWEEN 1 PRECEDING AND CURRENT ROW) as vibration_1h_avg
AVG(rms_velocity) OVER (... ROWS BETWEEN 7 PRECEDING AND CURRENT ROW) as vibration_4h_avg
AVG(rms_velocity) OVER (... ROWS BETWEEN 47 PRECEDING AND CURRENT ROW) as vibration_24h_avg
-- Plus STDDEV, MAX, slope (REGR_SLOPE) for each window
```

### Threshold Alert Detection
```sql
-- Join latest sensor reading against CFG_THRESHOLDS
-- severity = CASE WHEN reading >= critical THEN 'CRITICAL'
--                 WHEN reading >= warning THEN 'WARNING' ELSE 'NORMAL' END
-- Direction-aware: most are HIGH (reading > threshold), some may be LOW
```

### Options Engine Scoring (in SP_GENERATE_OPTIONS)
```sql
-- Each option scored on 9 criteria (section 3b of claude.md)
-- Safety is a hard gate: IF p_fail_during_option * severity_consequence > limit THEN 'BLOCKED'
-- Money = parts_cost + labour_cost + downtime_cost + breakdown_risk + penalty_risk - warranty_recovery
-- Production = units_lost * selling_price + oee_impact
-- Total = weighted sum using CFG_POLICY weights
```

## Gateway API -> Snowflake View Mapping
Each FastAPI endpoint queries one or more Snowflake objects. See claude.md section 7 for full request/response specs.

### Dashboard Data (REST, polled by frontend)
| Endpoint | Snowflake Object | Poll Interval |
|----------|-----------------|---------------|
| `GET /api/kpis` | `ANALYTICS.VW_KPI_SUMMARY` | 15s |
| `GET /api/plants` | `ANALYTICS.VW_PLANT_HEALTH` | 15s |
| `GET /api/production` | `ANALYTICS.VW_PRODUCTION_DAILY` | 30s |
| `GET /api/alerts` | `APP.ALERTS` + latest sensors + `APP.CFG_THRESHOLDS` | 15s |
| `GET /api/orders` | `ANALYTICS.VW_ORDERS_AT_RISK` | 30s |
| `GET /api/supply-chain` | `ANALYTICS.VW_PART_GAP` | 30s |
| `GET /api/energy` | `RAW.ELECTRICAL_METERING` aggregated per plant | 30s |
| `GET /api/maintenance/readiness` | `RAW.WORK_ORDERS` bucketed by date | 30s |
| `GET /api/maintenance/queue` | `CORE.DIM_ASSET` + `ML.PRED_ASSET_SCORES` + `APP.ALERTS` | 15s |
| `GET /api/assets/:id` | Multi-join: sensors + predictions + WOs + parts + operator logs | 10s |
| `GET /api/assets/:id/sensors` | Time-series from `RAW.VIBRATION_DYNAMICS` + `TEMPERATURE_THERMAL` + etc. | 10s |
| `GET /api/technicians` | `RAW.OPERATOR_TECHNICIAN_ASSIGNMENTS` + `SKILLS_CERTIFICATIONS` | 30s |
| `GET /api/activity-stream` | `APP.INCIDENT_EVENTS` UNION `OPERATOR_ACTIONS_LOGS` UNION `MACHINE_STATE_DOWNTIME` | 5s |
| `GET /api/finance/summary` | Aggregation across failure events, WOs, orders, model backtest | 30s |

### Incident Lifecycle (REST + SSE)
| Endpoint | Snowflake Object | Type |
|----------|-----------------|------|
| `GET /api/incidents` | `APP.INCIDENTS` | REST |
| `GET /api/incidents/:id` | `INCIDENTS` + `OPTIONS` + `ACTIONS` + `EVENTS` | REST |
| `GET /api/incidents/:id/options` | `APP.INCIDENT_OPTIONS` | REST |
| `POST /api/incidents/:id/approve` | `SP_EXECUTE_OPTION` | REST (write) |
| `GET /api/incidents/:id/stream` | `APP.INCIDENT_EVENTS` (live) | **SSE** |
| `GET /api/incidents/:id/line-impact` | SP: line-stop comparison | REST |

### Simulator Control
| Endpoint | Action |
|----------|--------|
| `POST /api/sim/start` | Write sensor readings into RAW at accelerated pace |
| `POST /api/sim/action` | Change simulator profile (derate/stop/resume) |
| `POST /api/sim/reset` | Truncate scenario data, reset incidents |
| `GET /api/sim/status` | Current scenario state |

### Copilot / Intelligence (Cortex Agent)
| Endpoint | Backend |
|----------|---------|
| `POST /api/copilot/chat` | `PDM.APP.PDM_AGENT` via Cortex Agent API → SSE stream |
| `POST /api/copilot/explain-alert` | `SP_EXPLAIN_ALERT` + Agent for NL explanation |

## Cortex Agent (PDM_AGENT) — Tools & Search

### Agent Tools (SQL functions called by the agent)
| Tool | Purpose | Snowflake Object |
|------|---------|-----------------|
| `TOOL_QUERY_OEE` | Query OEE by plant/line/date | `ANALYTICS.SV_PDM` (semantic view) |
| `TOOL_GET_ASSET_HEALTH` | Sensor + prediction + threshold for an asset | Multi-table query |
| `TOOL_EXPLAIN_ALERT` | Cited root cause explanation | `SP_EXPLAIN_ALERT` + `CSS_DOCS` |
| `TOOL_LIST_ORDERS_AT_RISK` | Orders impacted by alerts/downtime | `ANALYTICS.VW_ORDERS_AT_RISK` |
| `TOOL_CHECK_PARTS` | Stock, PO status, ETA for parts | `SPARE_PARTS_CATALOG` + `PURCHASE_ORDERS` |
| `TOOL_CHECK_TECHNICIAN` | Available certified staff for shift | `SKILLS_CERTIFICATIONS` + `ASSIGNMENTS` |
| `TOOL_WHAT_IF_COST` | Cost/impact simulation | `SP_WHAT_IF_COST` |
| `TOOL_DRAFT_WORK_ORDER` | Generate work order | `SP_DRAFT_WORK_ORDER` |

### Cortex Search Services
| Service | Source Tables | Content |
|---------|-------------|---------|
| `SEARCH.CSS_DOCS` | 37 (OEM manuals), 38 (SOPs), 40 (safety regs), 42 (warranty/SLA) | Technical documentation: operating limits, maintenance procedures, safety LOTO, warranty exclusions |
| `SEARCH.CSS_NOTES` | 39 (maintenance logs), 41 (shift handover notes) | Operational context: technician observations, anomaly reports, handover items |

### Semantic View (SV_PDM)
Covers: OEE metrics, sensor readings, asset health, work orders, customer orders, maintenance readiness. Enables natural language SQL via Cortex Analyst (e.g. "What's the OEE for Pune plant this week?").

## Real-Time Data Flow
```
Simulator ──writes──> RAW.VIBRATION_DYNAMICS, TEMPERATURE_THERMAL, etc.
     │
     ▼
Dynamic Tables (target_lag = '1 minute')
     ├── CORE.FACT_SENSOR_* (cleaned, typed)
     ├── ANALYTICS.DT_ASSET_FEATURES (rolling stats)
     └── ANALYTICS.DT_OEE_LINE_SHIFT (OEE calculation)
     │
     ▼
Snowflake Task (every 1 min): CALL SP_SCORE_ASSETS
     │
     ▼
ML.PRED_ASSET_SCORES (p_fail_7d, severity, rul_days)
     │
     ▼
Snowflake Task: CALL SP_RAISE_ALERTS
     │
     ▼
APP.ALERTS (hybrid table → low-latency reads)
     ├── Creates/updates alerts with severity, sensor evidence
     └── Opens APP.INCIDENTS when severity exceeds threshold
     │
     ▼
FastAPI Gateway (polls APP tables, pushes via SSE)
     │
     ▼
Frontend (React Query polling + EventSource SSE)
```

End-to-end latency: simulator write → frontend update ≈ 5-10 seconds.

## Plant Name Mapping (CSV -> Frontend)
- PLANT_01 = "Pune Precision Components" (Machining) — 6 lines, 30 assets
- PLANT_02 = "Chennai Drivetrain Assembly" (Assembly) — 3 lines, 12 assets
- PLANT_03 = "Coimbatore Surface Treatment" (Processing) — 2 lines, 8 assets

Frontend must use these names. Currency INR (₹). No Berlin/Chicago/Singapore.

## Verified Data Counts (from CSV)
| Entity | Count | Notes |
|--------|-------|-------|
| Plants | 3 | Pune, Chennai, Coimbatore |
| Lines | 11 | 6 + 3 + 2 |
| Assets | 50 | 30 + 12 + 8 (types: 15 CNC, 10 Robot, 12 Pump, 13 Conveyor) |
| Products | 20 | Housings, Shafts, Precision, Brackets, Hubs, Gears |
| Customers | 8 | All Indian companies |
| Suppliers | 20 | All Indian |
| Spare Parts | 70 | 20 below reorder point |
| Work Orders | 141 | 117 Completed, 18 Open, 1 In Progress, 1 On Hold, 4 Cancelled |
| Customer Orders | 90 | 70 Delivered, 7 In Production, 13 Scheduled |
| Failure Events | 30 | 18 Failed, 5 Averted, 3 False Alarm, 4 Active |
| Sensor Readings | 34,560/type | 16 monitored assets × 2,160 timestamps (45 days × 48/day) |
| Technician Certs | 58 | Various certification types with expiry dates |
| OEM Doc Chunks | 64 | Per asset/model, with keywords |
| Safety Regulations | 23 | With penalties |
| Warranty Contracts | 60 | With exclusions and deductibles |

## Preflight Checks (00_preflight.sql)
Before building, verify:
- [ ] Hybrid tables available (fallback: standard tables for APP schema)
- [ ] Interactive warehouse available (fallback: standard warehouse)
- [ ] Cortex Agents available (required — no fallback)
- [ ] Cortex Search available (required — no fallback)
- [ ] Cortex Analyst / Semantic Views available
- [ ] Snowpark ML available (required for model training)
- [ ] Model Registry available
- [ ] Container services available (for backend, fallback: run locally / Docker Compose)
