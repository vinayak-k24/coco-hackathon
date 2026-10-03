from datetime import date as dt_date
from fastapi import APIRouter
from db import execute_query
from models.responses import MaintenanceReadiness, MachineQueueItem

router = APIRouter()


def _format_inr(val: float) -> str:
    if val >= 1_00_00_000:
        return f"₹{val / 1_00_00_000:.1f} Cr"
    if val >= 1_00_000:
        return f"₹{val / 1_00_000:.1f}L"
    if val >= 1_000:
        return f"₹{val / 1_000:.1f}K"
    return f"₹{val:.0f}"


@router.get("/maintenance/readiness", response_model=MaintenanceReadiness)
def get_readiness():
    rows = execute_query("""
        WITH open_wo AS (
            SELECT
                CASE
                    WHEN planned_start_time::date <= '2026-09-30' THEN 'due_today'
                    WHEN planned_start_time::date <= DATEADD('day', 7, '2026-09-30'::date) THEN 'this_week'
                    WHEN planned_start_time::date <= DATEADD('day', 14, '2026-09-30'::date) THEN 'next_week'
                    ELSE 'on_track'
                END AS bucket
            FROM PDM.RAW.WORK_ORDERS
            WHERE status IN ('Open', 'In Progress', 'On Hold')
        )
        SELECT bucket, COUNT(*) AS cnt FROM open_wo GROUP BY bucket
    """)
    buckets = {r["bucket"]: r["cnt"] for r in rows}
    total = execute_query(
        "SELECT COUNT(*) AS cnt FROM PDM.RAW.MACHINES_ASSETS")
    total_a = total[0]["cnt"] if total else 50
    corrective = execute_query("""
        SELECT COUNT(DISTINCT asset_id) AS cnt FROM PDM.RAW.WORK_ORDERS
        WHERE status IN ('Open', 'In Progress', 'On Hold') AND work_order_type = 'Corrective'
    """)
    unhealthy = corrective[0]["cnt"] if corrective else 0
    healthy_pct = round((total_a - unhealthy) / max(total_a, 1) * 100)
    return MaintenanceReadiness(
        healthy_pct=healthy_pct,
        due_today=buckets.get("due_today", 0),
        this_week=buckets.get("this_week", 0),
        next_week=buckets.get("next_week", 0),
        on_track=buckets.get("on_track", 0),
    )


@router.get("/maintenance/queue", response_model=list[MachineQueueItem])
def get_queue(limit: int = 10):
    rows = execute_query("""
        WITH last_wo AS (
            SELECT asset_id, MAX(actual_end_time) AS last_maint
            FROM PDM.RAW.WORK_ORDERS WHERE status = 'Completed' GROUP BY asset_id
        ),
        next_wo AS (
            SELECT asset_id, MIN(planned_start_time) AS next_due
            FROM PDM.RAW.WORK_ORDERS WHERE status IN ('Open', 'Scheduled') GROUP BY asset_id
        ),
        active_faults AS (
            SELECT asset_id, peak_severity, fault_mode, projected_failure_ts
            FROM PDM.RAW.GROUND_TRUTH_FAILURE_EVENTS WHERE outcome = 'ACTIVE'
        )
        SELECT
            ma.asset_id, ma.asset_name, ma.model_number,
            pl.line_name, sf.plant_name,
            COALESCE(af.fault_mode, '') AS fault_mode,
            COALESCE(af.peak_severity, 0) AS severity,
            af.projected_failure_ts,
            ma.criticality_level, ma.downtime_cost_per_min, ma.installation_date,
            lw.last_maint, nw.next_due
        FROM PDM.RAW.MACHINES_ASSETS ma
        JOIN PDM.RAW.SITE_FACILITY sf ON sf.plant_id = ma.plant_id
        JOIN PDM.RAW.PRODUCTION_LINES_CELLS pl ON pl.line_id = ma.line_id
        LEFT JOIN active_faults af ON af.asset_id = ma.asset_id
        LEFT JOIN last_wo lw ON lw.asset_id = ma.asset_id
        LEFT JOIN next_wo nw ON nw.asset_id = ma.asset_id
        ORDER BY COALESCE(af.peak_severity, 0) DESC, ma.criticality_level DESC
        LIMIT %(limit)s
    """, {"limit": limit})

    from datetime import datetime
    ref = datetime(2026, 9, 30, 0, 0, 0)
    results = []

    for r in rows:
        sev = float(r.get("severity", 0))
        status = "critical" if sev >= 0.7 else "warning" if sev >= 0.4 else "medium" if sev >= 0.2 else "low"
        crit = int(r.get("criticality_level", 0))
        crit_label = "High" if crit >= 4 else "Medium" if crit >= 2 else "Low"

        # Age
        inst = r.get("installation_date")
        age_str = ""
        if inst:
            if isinstance(inst, str):
                inst = dt_date.fromisoformat(inst)
            age_years = round((dt_date(2026, 9, 30) - inst).days / 365.25, 1)
            age_str = f"{age_years} years"

        # Failure timeline
        projected = r.get("projected_failure_ts")
        timeline = ""
        if projected and hasattr(projected, "timestamp"):
            diff_h = (projected - ref).total_seconds() / 3600
            if diff_h > 48:
                timeline = f"Failure in {int(diff_h / 24)} days"
            elif diff_h > 0:
                timeline = f"Failure in {int(diff_h)} hours"
            else:
                timeline = "Overdue"

        # Financial impact
        cost_min = float(r.get("downtime_cost_per_min", 700))
        impact = cost_min * 60 * max(sev * 12, 1)

        # Format dates
        def fmt_dt(v):
            if v is None:
                return ""
            if hasattr(v, "strftime"):
                return v.strftime("%b %d, %Y")
            return str(v)

        fault = r.get("fault_mode", "")
        issue = fault.replace("_", " ").title() if fault else ""

        results.append(MachineQueueItem(
            id=r["asset_id"],
            name=r["asset_name"],
            model=r.get("model_number", ""),
            line=r.get("line_name", ""),
            plant=r.get("plant_name", ""),
            status=status,
            issue=issue,
            failureTimeline=timeline,
            healthScore=round((1 - sev) * 100),
            financialImpact=_format_inr(impact),
            image="",
            age=age_str,
            criticality=crit_label,
            lastMaintenance=fmt_dt(r.get("last_maint")),
            nextDue=fmt_dt(r.get("next_due")),
        ))
    return results
