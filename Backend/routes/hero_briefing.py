from fastapi import APIRouter
from db import execute_query
from models.responses import HeroBriefingData

router = APIRouter()


def _format_inr(val: float) -> str:
    if val >= 1_00_00_000:
        return f"₹{val / 1_00_00_000:.1f} Cr"
    if val >= 1_00_000:
        return f"₹{val / 1_00_000:.1f}L"
    if val >= 1_000:
        return f"₹{val / 1_000:.1f}K"
    return f"₹{val:.0f}"


@router.get("/hero-briefing", response_model=HeroBriefingData)
def get_hero_briefing():
    # Plants
    plants = execute_query(
        "SELECT plant_id, plant_name FROM PDM.RAW.SITE_FACILITY ORDER BY plant_id")

    # Total assets
    assets_total = execute_query(
        "SELECT COUNT(*) AS cnt FROM PDM.RAW.MACHINES_ASSETS")
    total_assets = assets_total[0]["cnt"] if assets_total else 50

    # Assets online
    online = execute_query("""
        WITH latest AS (
            SELECT machine_id, state_code,
                   ROW_NUMBER() OVER (PARTITION BY machine_id ORDER BY timestamp DESC) AS rn
            FROM PDM.RAW.MACHINE_STATE_DOWNTIME
        )
        SELECT COUNT(*) AS cnt FROM latest WHERE rn = 1 AND state_code = 'Running'
    """)
    online_cnt = online[0]["cnt"] if online else 0
    online_pct = round(online_cnt / max(total_assets, 1) * 100)

    # Workforce
    workforce = execute_query("""
        SELECT COUNT(DISTINCT operator_technician_id) AS cnt
        FROM PDM.RAW.OPERATOR_TECHNICIAN_ASSIGNMENTS
        WHERE shift_id IN (SELECT shift_id FROM PDM.RAW.SHIFT_MANAGEMENT
                           WHERE shift_date = (SELECT MAX(shift_date) FROM PDM.RAW.SHIFT_MANAGEMENT))
    """)
    wf_cnt = workforce[0]["cnt"] if workforce else 0

    # Averted cost
    averted = execute_query("""
        SELECT COALESCE(SUM(breakdown_cost_inr), 0) AS cost
        FROM PDM.RAW.GROUND_TRUTH_FAILURE_EVENTS WHERE outcome = 'AVERTED'
    """)
    averted_cost = averted[0]["cost"] if averted else 0

    # Active alerts per plant (for badges)
    alert_counts = execute_query("""
        SELECT ma.plant_id, COUNT(*) AS cnt
        FROM PDM.RAW.GROUND_TRUTH_FAILURE_EVENTS ge
        JOIN PDM.RAW.MACHINES_ASSETS ma ON ma.asset_id = ge.asset_id
        WHERE ge.outcome = 'ACTIVE'
        GROUP BY ma.plant_id
    """)
    alert_map = {r["plant_id"]: r["cnt"] for r in alert_counts}

    # Build plant badges
    badges = []
    for p in plants:
        alerts = alert_map.get(p["plant_id"], 0)
        health = 100 - alerts * 10  # simple: each active alert drops 10 points
        badges.append({"name": p["plant_name"].split(
            " ")[0], "health_pct": max(health, 0)})

    return HeroBriefingData(
        greeting="Good Morning",
        user_name="Operator",
        date="2026-09-30",
        summary=(
            "Your factories are performing well. "
            "Production is on track across all sites "
            "with improving efficiency."
        ),
        oee_avg="0%",  # computed once DT_OEE exists
        cost_avoidance=_format_inr(averted_cost),
        total_factories=len(plants),
        connected_assets=total_assets,
        workforce_online=wf_cnt,
        workforce_pct=f"{round(wf_cnt / max(total_assets, 1) * 100)}%",
        platform_health=f"{online_pct}%",
        plant_badges=badges,
        ai_briefing_text=f"All factories operating with {len(plants)} plants and {total_assets} assets. "
        f"Cost avoidance this period: {_format_inr(averted_cost)}.",
    )
