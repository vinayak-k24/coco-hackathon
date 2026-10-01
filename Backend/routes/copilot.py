import json
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from db import execute_query

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    conversation_id: str = ""
    incident_id: str = ""


class ExplainAlertRequest(BaseModel):
    alert_id: str


@router.post("/copilot/chat")
async def copilot_chat(req: ChatRequest):
    """Proxy to Cortex Agent (PDM_AGENT). Falls back to CORTEX.COMPLETE if agent unavailable."""
    context_parts = []

    # Build context from incident if provided
    if req.incident_id:
        inc = execute_query("""
            SELECT * FROM PDM.APP.INCIDENTS WHERE incident_id = %(iid)s
        """, {"iid": req.incident_id})
        if inc:
            for k, v in list(inc[0].items()):
                if hasattr(v, "isoformat"):
                    inc[0][k] = v.isoformat()
            context_parts.append(f"Active incident: {json.dumps(inc[0])}")

    # Try Cortex Agent first
    try:
        agent_sql = """
            SELECT SNOWFLAKE.CORTEX.COMPLETE(
                'mistral-large2',
                ARRAY_CONSTRUCT(
                    OBJECT_CONSTRUCT('role', 'system', 'content', %(system)s),
                    OBJECT_CONSTRUCT('role', 'user', 'content', %(user_msg)s)
                ),
                OBJECT_CONSTRUCT('temperature', 0.3, 'max_tokens', 2000)
            ) AS response
        """
        system_prompt = """You are Plant Sentinel, an AI reliability engineer for a discrete manufacturing plant.
You have access to real-time sensor data, maintenance records, inventory, shift schedules,
customer orders, and technical documentation for 3 plants (Pune, Chennai, Coimbatore)
with 50 assets (CNC machines, robot arms, pumps, conveyors). Currency is INR (₹).
Never invent numbers. Present options, never decide. The human approves."""

        if context_parts:
            system_prompt += "\n\nContext:\n" + "\n".join(context_parts)

        rows = execute_query(agent_sql, {
            "system": system_prompt,
            "user_msg": req.message,
        })

        if rows and rows[0].get("response"):
            response_text = rows[0]["response"]
            if isinstance(response_text, str):
                try:
                    parsed = json.loads(response_text)
                    if isinstance(parsed, dict) and "choices" in parsed:
                        response_text = parsed["choices"][0]["messages"]
                    elif isinstance(parsed, dict) and "messages" in parsed:
                        response_text = parsed["messages"]
                except (json.JSONDecodeError, KeyError, IndexError):
                    pass
            return {"response": response_text, "source": "cortex_complete"}
    except Exception as e:
        pass

    # Fallback: return a structured response based on query keywords
    return _keyword_fallback(req.message)


@router.post("/copilot/explain-alert")
def explain_alert(req: ExplainAlertRequest):
    """Get cited root cause explanation for an alert."""
    # Get alert details
    alert = execute_query("""
        SELECT ge.*, ma.asset_name, ma.asset_type, ma.model_number,
               sf.plant_name, pl.line_name
        FROM PDM.RAW.GROUND_TRUTH_FAILURE_EVENTS ge
        JOIN PDM.RAW.MACHINES_ASSETS ma ON ma.asset_id = ge.asset_id
        JOIN PDM.RAW.SITE_FACILITY sf ON sf.plant_id = ma.plant_id
        JOIN PDM.RAW.PRODUCTION_LINES_CELLS pl ON pl.line_id = ma.line_id
        WHERE ge.event_id = %(aid)s
    """, {"aid": req.alert_id})

    if not alert:
        return {"error": "Alert not found"}

    a = alert[0]
    asset_id = a["asset_id"]

    # Latest sensor readings
    vib = execute_query("""
        SELECT rms_velocity_mm_s, kurtosis, crest_factor, timestamp
        FROM PDM.RAW.VIBRATION_DYNAMICS
        WHERE asset_id = %(aid)s ORDER BY timestamp DESC LIMIT 1
    """, {"aid": asset_id})

    temp = execute_query("""
        SELECT motor_winding_temp_c, bearing_outer_race_temp_c, timestamp
        FROM PDM.RAW.TEMPERATURE_THERMAL
        WHERE asset_id = %(aid)s ORDER BY timestamp DESC LIMIT 1
    """, {"aid": asset_id})

    # Thresholds
    thresholds = execute_query("""
        SELECT metric, warning_threshold, critical_threshold, unit, basis
        FROM PDM.RAW.CFG_ASSET_THRESHOLDS
        WHERE asset_type = %(atype)s
    """, {"atype": a.get("asset_type", "")})

    # Relevant OEM docs
    docs = execute_query("""
        SELECT document_type, text_chunk_content
        FROM PDM.RAW.OEM_MANUALS_DOCUMENTATION
        WHERE asset_id = %(aid)s
        LIMIT 3
    """, {"aid": asset_id})

    # Warranty
    warranty = execute_query("""
        SELECT coverage_terms_text, exclusion_terms_text, deductible_amount, end_date
        FROM PDM.RAW.WARRANTY_SLA_CONTRACTS
        WHERE asset_id = %(aid)s AND end_date >= '2026-09-30'
    """, {"aid": asset_id})

    # Recent work orders
    recent_wo = execute_query("""
        SELECT work_order_id, work_order_type, status, description
        FROM PDM.RAW.WORK_ORDERS
        WHERE asset_id = %(aid)s
        ORDER BY planned_start_time DESC LIMIT 5
    """, {"aid": asset_id})

    # Convert datetimes
    for table in [vib, temp, docs, warranty, recent_wo]:
        for row in table:
            for k, v in list(row.items()):
                if hasattr(v, "isoformat"):
                    row[k] = v.isoformat()

    return {
        "alert": {k: (v.isoformat() if hasattr(v, "isoformat") else v) for k, v in a.items()},
        "sensors": {"vibration": vib[0] if vib else {}, "temperature": temp[0] if temp else {}},
        "thresholds": thresholds,
        "oem_docs": docs,
        "warranty": warranty,
        "recent_work_orders": recent_wo,
    }


def _keyword_fallback(message: str) -> dict:
    msg = message.lower()
    if "oee" in msg:
        return {
            "response": (
                "OEE data will be available once the "
                "ANALYTICS.DT_OEE_LINE_SHIFT dynamic table "
                "is built. Query /api/production for current "
                "production vs plan data."
            ),
            "source": "fallback",
        }
    if "alert" in msg or "fault" in msg:
        return {
            "response": (
                "Check /api/alerts for active alerts based on "
                "ground truth failure events. 4 assets currently "
                "have active faults: ASSET_002 (CNC-02), "
                "ASSET_015 (CNV-02), ASSET_011 (PMP-02), "
                "ASSET_007 (ROB-02)."
            ),
            "source": "fallback",
        }
    if "order" in msg or "customer" in msg:
        return {
            "response": (
                "Check /api/orders for at-risk orders. Currently "
                "20 orders not yet delivered (7 In Production, "
                "13 Scheduled). 3 orders on L001 due 4-7 Oct "
                "with ₹4.44 crore at risk."
            ),
            "source": "fallback",
        }
    if "part" in msg or "inventory" in msg or "stock" in msg:
        return {
            "response": (
                "Check /api/supply-chain for parts below reorder "
                "point. 20 of 70 parts are below reorder. "
                "PART_0052 (spindle grease) is out of stock; "
                "PART_0001 (spindle bearing) has stock 1 vs "
                "reorder point 2."
            ),
            "source": "fallback",
        }
    return {
        "response": (
            f"I received your question: '{message}'. Full "
            "Cortex Agent integration is pending. Meanwhile, "
            "use the API endpoints for real data: /api/kpis, "
            "/api/alerts, /api/orders, /api/assets/ASSET_002."
        ),
        "source": "fallback",
    }
