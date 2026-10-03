# NexaFactory — Tab Features & Presentation Reference

> Generated for hackathon presentation. Also serves as the spec for any tabs to be built later.

## Current Navigation Order

1. Command Center
2. Maintenance
3. Asset 360
4. Supply Chain
5. Finance
6. Executive
7. Vision Center
8. Insights
9. What-If Lab

---

## Implemented Tabs

### 1. Command Center
The real-time operations nerve center.
- **AI Operational Briefing** — personalized greeting, AI-generated status summary, listen-to-brief audio
- **KPI Metrics Strip** — OEE, Assets Online, Safety, Energy, Alerts, Hours, Cost, Orders (circular gauges + trend indicators)
- **Plant Network Overview** — 3-factory carousel (Pune, Chennai, Coimbatore) with health scores + map/list toggle
- **AI Recommended Actions** — prioritized action cards with effort estimates and severity badges
- **Production Performance Chart** — 30-day bar chart (actual vs planned) with AI forecast line and annotations
- **Maintenance Readiness** — donut chart (Healthy/Warning/Scheduled/Critical) + technician/work order/readiness metrics
- **Workforce Readiness** — donut chart (Available/On Assignment/Training/Unavailable) + shift risk and certification gaps
- **Supply Chain Risk** — 4 supplier cards with health sparklines, lead time trends, risk badges
- **Order Impact Analysis** — customer order table with status pills, revenue exposure, commitment dates
- **Business Impact** — Recharts area chart (current exposure / AI-recommended / forecast), 4 KPI cards, $4.8M projected financial impact

### 2. Maintenance
AI-powered predictive maintenance hub.
- **Priority Queue** — ranked machine list filterable by severity (Critical/Warning/Info), sortable by risk/timeline/cost
- **Asset Detail View** — full machine diagnostics for the selected asset with health score, failure timeline, financial impact
- **Work Order Creation** — modal with technician assignment (AI-matched), scheduling, spare parts auto-pull, dispatch confirmation

### 3. Asset 360
Deep-dive telemetry for any individual machine.
- **Hero Asset Card** — machine photo, identity, specs, live telemetry badge
- **9 Sub-tabs** — Health, Performance, Sensors, Maintenance History, Components, Spare Parts, Documents, Warranty, Financial Impact
- **Time Range Selectors** — condition monitoring, performance trends, downtime analysis, production metrics, business impact views

### 4. Supply Chain
Inventory and supplier intelligence center.
- **AI Insight Banner** — critical stockout risk alert with revenue impact and "Expedite" action
- **Smart Filters** — warehouse, plant, forecast part, forecast days, what-if scenario
- **Inventory Management** — stock levels, demand forecast, reorder point analysis
- **Supplier Performance** — supplier scoring, lead time tracking, alternate sourcing
- **Purchase Order Modal** — interactive PO creation and approval

### 5. Finance
Financial impact and ROI command center.
- **AI Financial Value Banner** — "$1.2M losses avoided", ROI multiple 3.0x
- **Cost Trend Analysis** — 6-month and 12-month views for maintenance, downtime, avoided costs
- **Budget vs Actual** — variance tracking across plants
- **Financial Forecasting** — 6-month forward projections
- **Scenario Modeling** — what-if financial impact selector

### 6. Executive
Strategic briefing center for leadership.
- **AI Executive Briefing Narrative** — bot-generated strategic summary for C-suite
- **Financial Trends** — 12-month executive-level views
- **Production & Cost Quarters** — quarterly roll-ups
- **Forecast Views** — 6-month strategic planning
- **Action Approval Modal** — executive decision workflow with scenario selection

### 7. Vision Center
AI-powered computer vision and safety intelligence.
- **Plant Safety Score** — 92/100 with trend indicators
- **8 Sub-tabs** — Live View, Safety Analytics, Operational Intelligence, People & PPE, Vehicle & Forklift, Restricted Zones, Incident Management, Search & Investigate
- **Camera Filters** — area, camera, status (live/alerts/offline)
- **Analytics** — PPE compliance, heatmaps, movement tracking, top risk identification

### 8. Insights
Analytics and prediction laboratory.
- **7 Sub-tabs** — Overview, Predictive Intelligence, Anomaly Detection, Correlation Analysis, Root Cause Explorer, What-If Scenarios, Custom Analytics
- **Create Analysis** — custom analysis builder
- **Time-Series Views** — OEE (30d), reliability (6mo), downtime patterns, failure prediction (30d), energy (30d), forecast (4wk)

### 9. What-If Lab
Scenario planning and simulation engine.
- **Scenario Builder** — Machine Failure, Delayed Maintenance, Inventory Shortage, Demand Surge, Supplier Disruption
- **Parameter Sliders** — repair delay, duration, spare part availability, demand change %, alternate machine toggle, technician availability, supplier lead time, overtime
- **Run Simulation** — animated execution with success feedback
- **Results View** — cards vs table toggle for impact analysis
- **Cross-Navigation** — jump to Asset 360, Maintenance, or Finance from results

---

## Removed Tabs (Build Later)

These tabs were removed from the navbar because they had no dedicated hub component. Specs below for future implementation.

### Factory Twin
Digital twin / 3D visualization of the factory floor.
- **Planned features**: interactive 3D plant layout, real-time asset positioning, heatmap overlays (temperature, vibration, throughput), zone-level drill-down, live sensor feeds on hover, alert visualization on the floor map
- **Icon**: `Box` (lucide)
- **Nav ID**: `factory-twin`

### Operations
Day-to-day operational monitoring and control.
- **Planned features**: shift management dashboard, production line status board, real-time throughput monitoring, bottleneck identification, operator task assignment, shift handover reports, live OEE by line
- **Icon**: `Activity` (lucide)
- **Nav ID**: `operations`

### Copilot
AI conversational assistant (currently available as floating button on all pages).
- **Note**: The Nexa Copilot floating agent (`NexaCopilotFloatingAgent`) is already implemented and accessible from every tab via the floating button. A dedicated tab would provide a full-screen chat experience with deeper context.
- **Planned features**: full-screen AI chat, conversation history, contextual suggestions, voice input, export recommendations to work orders, natural language queries over Snowflake data
- **Icon**: `Sparkles` (lucide)
- **Nav ID**: `copilot`

### Admin
System administration and configuration.
- **Planned features**: user management, role-based access control, system health monitoring, integration settings (Snowflake, SCADA, ERP), alert threshold configuration, audit logs, API key management
- **Icon**: `Settings` (lucide)
- **Nav ID**: `admin`

### Workforce
Workforce management and scheduling.
- **Planned features**: technician availability dashboard, skill matrix, certification tracking, shift scheduling, overtime management, training program status, workforce utilization analytics, mobile crew dispatch
- **Icon**: `Users` (lucide)
- **Nav ID**: `workforce`
