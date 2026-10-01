from fastapi import APIRouter
from db import execute_query
from models.responses import RecommendedAction

router = APIRouter()


def _format_inr(val: float) -> str:
    if val >= 1_00_00_000:
        return f"₹{val / 1_00_00_000:.1f} Cr"
    if val >= 1_00_000:
        return f"₹{val / 1_00_000:.1f}L"
    if val >= 1_000:
        return f"₹{val / 1_000:.1f}K"
    return f"₹{val:.0f}"


@router.get("/recommendations", response_model=list[RecommendedAction])
def get_recommendations():
    rows = execute_query("""
        SELECT
            ge.event_id, ge.asset_id, ge.fault_mode, ge.peak_severity,
            ge.projected_failure_ts, ge.breakdown_cost_inr,
            ma.asset_name, ma.downtime_cost_per_min,
            sf.plant_name, pl.line_name
        FROM PDM.RAW.GROUND_TRUTH_FAILURE_EVENTS ge
        JOIN PDM.RAW.MACHINES_ASSETS ma ON ma.asset_id = ge.asset_id
        JOIN PDM.RAW.SITE_FACILITY sf ON sf.plant_id = ma.plant_id
        JOIN PDM.RAW.PRODUCTION_LINES_CELLS pl ON pl.line_id = ma.line_id
        WHERE ge.outcome = 'ACTIVE'
        ORDER BY ge.peak_severity DESC
        LIMIT 3
    """)

    results = []
    for i, r in enumerate(rows):
        sev = r.get("peak_severity", 0)
        cost_min = float(r.get("downtime_cost_per_min", 700))
        # Estimate avoided cost: 8 hours of downtime
        savings = cost_min * 60 * 8
        asset_name = r.get("asset_name", "").split(" ")[
            0]  # short name e.g. "CNC-02"
        plant_short = r.get("plant_name", "").split(" ")[0]  # e.g. "Pune"

        severity_label = "Critical" if sev >= 0.7 else "Optimisation" if sev >= 0.4 else "Preventive"
        impact = "High" if sev >= 0.7 else "Medium" if sev >= 0.4 else "Low"
        fault = r.get("fault_mode", "Unknown fault")

        results.append(RecommendedAction(
            id=f"action-{i+1}",
            severity=severity_label,
            title=f"Prevent {_format_inr(savings)} downtime: {fault}",
            subtitle=f"{asset_name} • {plant_short} • {r.get('line_name', '')}",
            impact=impact,
            customerImpact="Customer Impact" if sev >= 0.5 else "",
            savingsOrBenefit=f"{_format_inr(savings)} potential savings",
            effort="2 days Effort" if sev >= 0.7 else "1 week Effort",
        ))
    return results
