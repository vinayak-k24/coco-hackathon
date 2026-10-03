from fastapi import APIRouter
from db import execute_query
from models.responses import FactoryPlant

router = APIRouter()


def _format_inr(val: float) -> str:
    if val >= 1_00_00_000:
        return f"₹{val / 1_00_00_000:.1f} Cr"
    if val >= 1_00_000:
        return f"₹{val / 1_00_000:.1f}L"
    return f"₹{val / 1_000:.0f}K"


@router.get("/plants", response_model=list[FactoryPlant])
def get_plants():
    rows = execute_query(
        "SELECT * FROM PDM.ANALYTICS.VW_PLANT_HEALTH ORDER BY plant_id")
    if not rows:
        return []
    return [
        FactoryPlant(
            id=r["plant_id"].lower().replace("_", ""),
            name=r["plant_name"].replace(" Plant", ""),
            country="India",
            specialty=r["facility_type"],
            image="",
            health=int(r.get("health_score", 0)),
            change=f"{int(r.get('critical_alerts', 0)) + int(r.get('warning_alerts', 0))} alerts",
            isNegative=int(r.get("critical_alerts", 0)) > 0,
            critical=int(r.get("critical_alerts", 0)),
            warning=int(r.get("warning_alerts", 0)),
            online=int(r.get("total_assets", 0)),
            manager="",
            lines=int(r.get("num_production_lines", 0)),
            oee=float(r.get("oee_pct", 0)),
            workforce=int(r.get("workforce_count", 0)),
            assets=int(r.get("total_assets", 0)),
            readinessRUL="",
            annualRevenue=_format_inr(float(r.get("order_value_inr", 0))),
        )
        for r in rows
    ]
