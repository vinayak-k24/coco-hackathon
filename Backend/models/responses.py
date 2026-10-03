from pydantic import BaseModel, Field


# ===== Matches frontend: PlantHealthOverview.tsx -> FactoryPlant =====
class FactoryPlant(BaseModel):
    id: str
    name: str                       # e.g. "Pune, Maharashtra"
    country: str                    # e.g. "India"
    specialty: str                  # e.g. "Machining"
    image: str = ""                 # URL
    health: int = 0                 # 0-100
    change: str = "0%"              # trend string
    isNegative: bool = False
    critical: int = 0               # critical alert count
    warning: int = 0                # warning alert count
    online: int = 0                 # assets online count
    manager: str = ""
    lines: int = 0
    oee: float = 0.0
    workforce: int = 0
    assets: int = 0
    readinessRUL: str = "₹0"       # formatted string
    annualRevenue: str = "₹0"      # formatted string


# ===== Matches frontend: CriticalMachineAlerts.tsx -> MachineAlert =====
class MachineAlert(BaseModel):
    id: str
    machine: str                    # e.g. "CNC-02"
    issue: str                      # e.g. "Bearing wear (RMS 5.79 mm/s)"
    location: str                   # e.g. "Pune • Housing Machining Line"
    severity: str = "Warning"       # "Critical" | "Warning"
    time: str = ""                  # e.g. "12 min ago"
    temperature: str | None = None  # e.g. "68.1°C (Threshold: 75°C)"
    vibration: str | None = None    # e.g. "5.79 mm/s RMS (Warn: 4.5)"
    pressure: str | None = None
    recommendedAction: str = ""


# ===== Matches frontend: OrderImpactAnalysisCard.tsx -> OrderRow =====
class OrderRow(BaseModel):
    customer: str                   # e.g. "Malwa Tractors Ltd"
    customerLogo: str = "🏭"       # emoji
    orderId: str                    # e.g. "SO-0012"
    product: str                    # e.g. "Gearbox Cover"
    commitment: str                 # e.g. "Oct 4, 2026"
    status: str = "On Track"        # "At Risk" | "On Track" | "Watch"
    revenueExposure: str = "₹0"    # formatted string e.g. "₹22.3M"


# ===== Matches frontend: RecommendedActionsPanel.tsx -> RecommendedAction =====
class RecommendedAction(BaseModel):
    id: str
    severity: str = "Preventive"    # "Critical" | "Optimisation" | "Preventive"
    title: str
    subtitle: str                   # e.g. "CNC-02 • Pune"
    impact: str = "Medium"          # "High" | "Medium" | "Low"
    customerImpact: str = ""
    savingsOrBenefit: str = ""      # e.g. "₹12.3L potential savings"
    effort: str = ""                # e.g. "2 days Effort"


# ===== Matches frontend: LiveActivityStream.tsx -> EventItem =====
class EventItem(BaseModel):
    id: str
    time: str                       # e.g. "2 min ago"
    plant: str                      # e.g. "Pune Precision Components"
    title: str
    description: str = ""
    type: str = "info"              # "success" | "warning" | "info" | "maintenance"


# ===== Matches frontend: EnergyTelemetryCard.tsx -> inline plants =====
class EnergyPlantUI(BaseModel):
    name: str                       # e.g. "Pune Precision"
    power: str                      # e.g. "0.9 MW"
    load: str = ""                  # e.g. "68%"
    trend: str = ""                 # e.g. "+2%"
    isDown: bool = False


# ===== Matches frontend: SupplyChainRiskCard.tsx -> inline items =====
class SupplyChainRiskItem(BaseModel):
    name: str                       # part name
    sub: str                        # supplier name
    supplierHealth: int = 0         # 0-100
    leadTime: str = ""              # e.g. "21 days"
    leadTimeChange: str = ""        # e.g. "▲ 5 days"
    affectedMachines: int = 0
    businessExposure: str = ""      # e.g. "₹38.5L"
    risk: str = "Low Risk"          # "High Risk" | "Medium Risk" | "Low Risk"


# ===== Matches frontend: MaintenanceQueue.tsx -> MachineQueueItem =====
class MachineQueueItem(BaseModel):
    id: str                         # asset_id
    name: str                       # e.g. "CNC-02 Vertical Machining Center"
    model: str = ""                 # e.g. "VMC-1100"
    line: str = ""                  # e.g. "Housing Machining Line"
    plant: str = ""                 # e.g. "Pune Precision Components Plant"
    status: str = "low"             # "critical" | "warning" | "medium" | "low"
    issue: str = ""
    failureTimeline: str = ""       # e.g. "Failure in 12 hours"
    healthScore: int = 0            # 0-100
    financialImpact: str = "₹0"    # formatted string
    image: str = ""                 # URL
    age: str = ""                   # e.g. "1.2 years"
    criticality: str = "Low"        # "High" | "Medium" | "Low"
    lastMaintenance: str = ""       # e.g. "Sep 15, 2026"
    nextDue: str = ""               # e.g. "Oct 10, 2026"


# ===== Matches frontend: HeroBriefing.tsx -> inline sidebar =====
class HeroBriefingData(BaseModel):
    greeting: str = "Good Morning"
    user_name: str = "Operator"
    date: str = ""
    summary: str = ""
    oee_avg: str = "0%"
    cost_avoidance: str = "₹0"
    total_factories: int = 3
    connected_assets: int = 50
    workforce_online: int = 0
    workforce_pct: str = "0%"
    platform_health: str = "0%"
    plant_badges: list[dict] = []   # [{name, health_pct}]
    ai_briefing_text: str = ""


# ===== Matches frontend: MaintenanceReadinessCard.tsx -> inline =====
class MaintenanceReadiness(BaseModel):
    healthy_pct: int = 0            # donut center
    due_today: int = 0
    this_week: int = 0
    next_week: int = 0
    on_track: int = 0


# ===== Matches frontend: TechnicianAvailabilityCard.tsx -> inline =====
class TechnicianSummary(BaseModel):
    available_pct: int = 0          # donut center
    available: int = 0
    in_progress: int = 0
    in_training: int = 0
    unavailable: int = 0
    total: int = 0


# ===== Matches frontend: BusinessRevenueImpactCard.tsx -> inline =====
class RevenueImpact(BaseModel):
    revenue_at_risk: str = "₹0"     # formatted
    revenue_trend: str = ""
    delivery_risk_pct: str = "0%"
    delivery_trend: str = ""
    chart_data: list[dict] = []     # [{date, value}]


# ===== KPI Summary (powers KpiMetricsRow.tsx) =====
class KpiSummary(BaseModel):
    alerts_active: int = 0
    oee_avg: float = 0.0
    breakdown_hours: float = 0.0
    breakdown_cost_inr: float = 0.0
    orders_at_risk: int = 0
    assets_online_pct: float = 0.0
    safety_score: float = 0.0
    energy_efficiency: float = 0.0
    predicted_cost_avoidance_inr: float = 0.0


# ===== Production chart (powers ProductionPerformanceChart.tsx) =====
class ProductionDay(BaseModel):
    date: str
    actual: int = 0                 # matches frontend field name "actual"
    plan: int = 0                   # matches frontend field name "plan"
    oee: float = 0.0


# ===== Asset 360 detail =====
class AssetSummary(BaseModel):
    asset_id: str
    asset_name: str
    asset_type: str
    model_number: str = ""
    serial_number: str = ""
    plant_id: str = ""
    plant_name: str = ""
    line_id: str = ""
    line_name: str = ""
    criticality_level: int = 0
    downtime_cost_per_min: float = 0.0
    installation_date: str = ""
    condition_monitored: bool = False


class SensorReading(BaseModel):
    timestamp: str
    asset_id: str
    rms_velocity: float | None = None
    bearing_outer_race_temp_c: float | None = None
    motor_winding_temp_c: float | None = None
    spindle_speed_rpm: float | None = None
    active_power_kw: float | None = None
    kurtosis: float | None = None
    crest_factor: float | None = None


class AssetDetail(BaseModel):
    identity: AssetSummary
    health_score: int = 0           # 0-100
    predicted_failure: str = ""     # e.g. "in 12 hours"
    failure_confidence: float = 0.0
    remaining_life: str = ""
    oee: float = 0.0
    availability: float = 0.0
    quality: float = 0.0
    throughput: float = 0.0
    sensors: dict = {}
    prediction: dict = {}
    maintenance_history: list = []
    spare_parts: list = []
    operator_trail: list = []
    thresholds: list = []
    recent_events: list = []


# ===== Supply Chain Hub KPIs =====
class SupplyChainKpis(BaseModel):
    critical_shortages: int = 0
    inventory_health_pct: float = 0.0
    parts_at_risk: int = 0
    purchase_orders: int = 0
    po_delayed: int = 0
    supplier_performance_pct: float = 0.0
    predicted_risk_inr: float = 0.0
    total_items: int = 0
    in_stock: int = 0
    below_reorder: int = 0
    out_of_stock: int = 0


# ===== Supply Chain detail item (for supply chain hub table) =====
class SupplyChainItem(BaseModel):
    part_id: str
    part_name: str = ""
    supplier_name: str = ""
    supplier_rating: float = 0.0
    lead_time_days: float = 0.0
    current_stock: int = 0
    reorder_point: int = 0
    min_stock: int = 0
    compatible_asset_types: str = ""
    affected_asset_count: int = 0
    days_to_stockout: float | None = None
    po_status: str = ""
    po_eta: str = ""
    risk_level: str = "Low"


# ===== Finance Hub KPIs =====
class FinanceKpis(BaseModel):
    cost_avoided_inr: float = 0.0
    revenue_at_risk_inr: float = 0.0
    maintenance_spend_inr: float = 0.0
    downtime_cost_inr: float = 0.0
    asset_roi_pct: float = 0.0
    warranty_recovery_inr: float = 0.0
    production_losses_inr: float = 0.0
    predicted_savings_inr: float = 0.0
    total_impact_inr: float = 0.0
    roi_multiple: float = 0.0
    breakdown_hours: float = 0.0
    backtest: dict = {}


# ===== Insights Hub =====
class InsightCard(BaseModel):
    id: str
    # "Critical Insight", "Cost Opportunity", etc.
    category: str
    title: str
    detail: str = ""
    badge: str = ""                 # "High Impact", "Validated by AI", etc.
    severity: str = "info"          # "critical", "warning", "info", "success"


class InsightsData(BaseModel):
    cards: list[InsightCard] = []
    mtbf_hours: float = 0.0
    mttr_hours: float = 0.0
    reliability_pct: float = 0.0
    failure_rate_pct: float = 0.0
    downtime_hours: float = 0.0
    # [{asset_id, asset_name, component, probability, severity}]
    failure_predictions: list[dict] = []


# ===== Incident models =====
class Incident(BaseModel):
    incident_id: str
    alert_id: str = ""
    asset_id: str = ""
    scenario_id: str = ""
    state: str = "WATCH"
    started_ts: str = ""
    resolved_ts: str = ""
    chosen_option: str = ""
    severity: float = 0.0
    p_fail: float = 0.0
    rul_days: float = 0.0


class IncidentOption(BaseModel):
    option_id: str
    incident_id: str = ""
    label: str = ""
    plan_json: dict = {}
    scores: dict = {}
    expected_cost_inr: float = 0.0
    expected_downtime_h: float = 0.0
    p_fail: float = 0.0
    safety_status: str = "OK"
    recommended: bool = False
    rank: int = 0


class SimulatorStatus(BaseModel):
    running: bool = False
    scenario_id: str = ""
    speed: int = 1
    elapsed_data_minutes: int = 0
    current_data_time: str = ""
