from fastapi import APIRouter
from db import execute_query
from models.responses import KpiSummary

router = APIRouter()


@router.get("/kpis", response_model=KpiSummary)
def get_kpis():
    rows = execute_query("SELECT * FROM PDM.ANALYTICS.VW_KPI_SUMMARY")
    if not rows:
        return KpiSummary()
    r = rows[0]
    return KpiSummary(
        alerts_active=int(r.get("alerts_active", 0)),
        oee_avg=float(r.get("oee_avg", 0)),
        breakdown_hours=float(r.get("breakdown_hours", 0)),
        breakdown_cost_inr=float(r.get("breakdown_cost_inr", 0)),
        orders_at_risk=int(r.get("orders_at_risk", 0)),
        assets_online_pct=float(r.get("assets_online_pct", 0)),
        safety_score=float(r.get("safety_score", 0)),
        energy_efficiency=float(r.get("energy_efficiency", 0)),
        predicted_cost_avoidance_inr=float(
            r.get("predicted_cost_avoidance_inr", 0)),
    )
