from fastapi import APIRouter, Query
from db import execute_query
from models.responses import EventItem

router = APIRouter()


@router.get("/activity-stream", response_model=list[EventItem])
def get_activity_stream(limit: int = Query(20)):
    # Recent machine state changes
    state_rows = execute_query("""
        SELECT
            ms.machine_id || '_' || ms.timestamp AS id,
            ms.timestamp,
            ms.machine_id AS asset_id,
            ms.state_code,
            ms.downtime_reason_code,
            sf.plant_name
        FROM PDM.RAW.MACHINE_STATE_DOWNTIME ms
        JOIN PDM.RAW.MACHINES_ASSETS ma ON ma.asset_id = ms.machine_id
        JOIN PDM.RAW.SITE_FACILITY sf ON sf.plant_id = ma.plant_id
        ORDER BY ms.timestamp DESC
        LIMIT %(lim)s
    """, {"lim": limit})

    # Recent operator actions
    op_rows = execute_query("""
        SELECT
            oal.log_id AS id,
            oal.timestamp,
            oal.operator_id,
            oal.action_type,
            oal.reason_code,
            oal.new_value
        FROM PDM.RAW.OPERATOR_ACTIONS_LOGS oal
        ORDER BY oal.timestamp DESC
        LIMIT %(lim)s
    """, {"lim": limit})

    # Combine and sort
    events = []
    for r in state_rows:
        state = r.get("state_code", "")
        etype = "success" if state == "Running" else "warning" if state == "Down" else "info"
        reason = r.get("downtime_reason_code", "NONE")
        title = f"{state}" + (f" — {reason}" if reason != "NONE" else "")
        asset_name = r.get("asset_id", "")
        ts = r["timestamp"]
        time_str = _format_time_ago(ts)
        plant_name = r.get("plant_name", "")

        events.append(EventItem(
            id=str(r["id"]),
            time=time_str,
            plant=plant_name.split(" ")[0] if plant_name else "",
            title=f"{asset_name}: {title}",
            description=f"Machine state changed to {state}",
            type=etype,
        ))

    for r in op_rows:
        action = r.get("action_type", "")
        reason = r.get("reason_code", "")
        ts = r["timestamp"]
        events.append(EventItem(
            id=str(r["id"]),
            time=_format_time_ago(ts),
            plant="",
            title=f"Operator {r.get('operator_id', '')}: {action}",
            description=f"Reason: {reason}" if reason else f"New value: {r.get('new_value', '')}",
            type="maintenance",
        ))

    # Sort by timestamp descending and limit
    events.sort(key=lambda e: e.time, reverse=False)
    return events[:limit]


def _format_time_ago(ts) -> str:
    from datetime import datetime
    if ts is None:
        return ""
    ref = datetime(2026, 9, 30, 0, 0, 0)
    if hasattr(ts, "timestamp"):
        diff = (ref - ts).total_seconds()
    else:
        return str(ts)
    if diff < 0:
        return "just now"
    if diff < 3600:
        return f"{int(diff / 60)} min ago"
    if diff < 86400:
        return f"{int(diff / 3600)}h ago"
    return f"{int(diff / 86400)}d ago"
