import asyncio
import json
from datetime import datetime

from fastapi import APIRouter, Path, Query
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse

from db import execute_query
from models.responses import Incident, IncidentOption

router = APIRouter()


@router.get("/incidents", response_model=list[Incident])
def list_incidents():
    rows = execute_query("""
        SELECT * FROM PDM.APP.INCIDENTS ORDER BY started_ts DESC
    """)
    if not rows:
        return []
    return [
        Incident(
            incident_id=r["incident_id"],
            alert_id=r.get("alert_id", ""),
            asset_id=r.get("asset_id", ""),
            scenario_id=r.get("scenario_id", ""),
            state=r.get("state", "WATCH"),
            started_ts=str(r.get("started_ts", "")),
            resolved_ts=str(r.get("resolved_ts", "")),
            chosen_option=r.get("chosen_option", ""),
            severity=float(r.get("severity", 0)),
            p_fail=float(r.get("p_fail", 0)),
            rul_days=float(r.get("rul_days", 0)),
        )
        for r in rows
    ]


@router.get("/incidents/{incident_id}")
def get_incident(incident_id: str = Path(...)):
    inc = execute_query("""
        SELECT * FROM PDM.APP.INCIDENTS WHERE incident_id = %(iid)s
    """, {"iid": incident_id})
    if not inc:
        return {"error": "Incident not found"}

    options = execute_query("""
        SELECT * FROM PDM.APP.INCIDENT_OPTIONS WHERE incident_id = %(iid)s ORDER BY rank
    """, {"iid": incident_id})

    actions = execute_query("""
        SELECT * FROM PDM.APP.INCIDENT_ACTIONS WHERE incident_id = %(iid)s ORDER BY ts
    """, {"iid": incident_id})

    events = execute_query("""
        SELECT * FROM PDM.APP.INCIDENT_EVENTS WHERE incident_id = %(iid)s ORDER BY ts
    """, {"iid": incident_id})

    # Convert datetimes
    for table in [inc, options, actions, events]:
        for row in table:
            for k, v in list(row.items()):
                if hasattr(v, "isoformat"):
                    row[k] = v.isoformat()

    return {
        "incident": inc[0],
        "options": options,
        "actions": actions,
        "timeline": events,
    }


@router.get("/incidents/{incident_id}/options", response_model=list[IncidentOption])
def get_options(incident_id: str = Path(...)):
    rows = execute_query("""
        SELECT * FROM PDM.APP.INCIDENT_OPTIONS WHERE incident_id = %(iid)s ORDER BY rank
    """, {"iid": incident_id})
    results = []
    for r in rows:
        scores = r.get("scores", "{}")
        if isinstance(scores, str):
            try:
                scores = json.loads(scores)
            except json.JSONDecodeError:
                scores = {}
        plan = r.get("plan_json", "{}")
        if isinstance(plan, str):
            try:
                plan = json.loads(plan)
            except json.JSONDecodeError:
                plan = {}
        results.append(IncidentOption(
            option_id=r["option_id"],
            incident_id=r.get("incident_id", incident_id),
            label=r.get("label", ""),
            plan_json=plan,
            scores=scores,
            expected_cost_inr=float(r.get("expected_cost_inr", 0)),
            expected_downtime_h=float(r.get("expected_downtime_h", 0)),
            p_fail=float(r.get("p_fail", 0)),
            safety_status=r.get("safety_status", "OK"),
            recommended=bool(r.get("recommended", False)),
            rank=int(r.get("rank", 0)),
        ))
    return results


class ApproveRequest(BaseModel):
    option_id: str
    approved_by: str = "operator"


@router.post("/incidents/{incident_id}/approve")
def approve_option(incident_id: str, req: ApproveRequest):
    try:
        execute_query("""
            CALL PDM.APP.SP_EXECUTE_OPTION(%(iid)s, %(oid)s, %(by)s)
        """, {"iid": incident_id, "oid": req.option_id, "by": req.approved_by})
        return {"success": True, "incident_id": incident_id, "option_id": req.option_id}
    except Exception as e:
        return {"success": False, "error": str(e)}


@router.get("/incidents/{incident_id}/stream")
async def incident_stream(incident_id: str = Path(...)):
    """SSE stream of incident events. Frontend subscribes with EventSource."""
    last_seen = ""

    async def event_generator():
        nonlocal last_seen
        while True:
            rows = execute_query("""
                SELECT * FROM PDM.APP.INCIDENT_EVENTS
                WHERE incident_id = %(iid)s
                  AND ts > %(last)s::TIMESTAMP_NTZ
                ORDER BY ts ASC
                LIMIT 50
            """, {"iid": incident_id, "last": last_seen or "1970-01-01"})

            for r in rows:
                for k, v in list(r.items()):
                    if hasattr(v, "isoformat"):
                        r[k] = v.isoformat()
                last_seen = r.get("ts", last_seen)
                event_type = r.get("event_type", "update")
                yield {"event": event_type, "data": json.dumps(r)}

            # Check if incident is resolved
            inc = execute_query("""
                SELECT state FROM PDM.APP.INCIDENTS WHERE incident_id = %(iid)s
            """, {"iid": incident_id})
            if inc and inc[0].get("state") in ("RESOLVED", "FALSE_ALARM"):
                yield {"event": "close", "data": json.dumps({"state": inc[0]["state"]})}
                return

            await asyncio.sleep(2)

    return EventSourceResponse(event_generator())


@router.get("/incidents/{incident_id}/line-impact")
def line_impact(incident_id: str = Path(...)):
    """Compare run-as-is vs derate vs stop-asset vs stop-line."""
    inc = execute_query("""
        SELECT asset_id FROM PDM.APP.INCIDENTS WHERE incident_id = %(iid)s
    """, {"iid": incident_id})
    if not inc:
        return []

    asset_id = inc[0]["asset_id"]
    asset = execute_query("""
        SELECT ma.*, pl.line_name, pl.max_throughput
        FROM PDM.RAW.MACHINES_ASSETS ma
        JOIN PDM.RAW.PRODUCTION_LINES_CELLS pl ON pl.line_id = ma.line_id
        WHERE ma.asset_id = %(aid)s
    """, {"aid": asset_id})
    if not asset:
        return []

    a = asset[0]
    cost_min = float(a.get("downtime_cost_per_min", 700))
    throughput = int(a.get("max_throughput", 200))

    # Count sibling assets on the line
    siblings = execute_query("""
        SELECT COUNT(*) AS cnt FROM PDM.RAW.MACHINES_ASSETS WHERE line_id = %(lid)s AND asset_id != %(aid)s
    """, {"lid": a["line_id"], "aid": asset_id})
    sib_count = siblings[0]["cnt"] if siblings else 5
    headroom_pct = min(15, 100 / max(sib_count, 1))

    return [
        {"scenario": "Run as-is", "throughput_loss_pct": 0, "safety_exposure": "HIGH",
         "p_breakdown": 0.8, "breakdown_cost_inr": cost_min * 60 * 16},
        {"scenario": "Derate 50%", "throughput_loss_pct": round(50 / max(sib_count + 1, 1), 1),
         "safety_exposure": "MEDIUM", "p_breakdown": 0.3,
         "breakdown_cost_inr": cost_min * 60 * 16 * 0.3},
        {"scenario": "Stop asset", "throughput_loss_pct": round(100 / max(sib_count + 1, 1) - headroom_pct, 1),
         "safety_exposure": "LOW", "p_breakdown": 0.0, "breakdown_cost_inr": 0},
        {"scenario": "Stop line", "throughput_loss_pct": 100, "safety_exposure": "NONE",
         "p_breakdown": 0.0, "breakdown_cost_inr": 0,
         "note": "Justified only for shared hazard (fire, contamination)"},
    ]
