from fastapi import APIRouter
from db import execute_query
from models.responses import TechnicianSummary

router = APIRouter()


@router.get("/technicians", response_model=TechnicianSummary)
def get_technicians():
    rows = execute_query("""
        WITH latest_shift AS (
            SELECT shift_id FROM PDM.RAW.SHIFT_MANAGEMENT
            WHERE shift_date = (
                SELECT MAX(shift_date) FROM PDM.RAW.SHIFT_MANAGEMENT
            )
        ),
        assigned AS (
            SELECT DISTINCT operator_technician_id, role
            FROM PDM.RAW.OPERATOR_TECHNICIAN_ASSIGNMENTS
            WHERE shift_id IN (SELECT shift_id FROM latest_shift)
        )
        SELECT
            COUNT(DISTINCT operator_technician_id) AS total,
            COUNT(
                DISTINCT CASE WHEN role = 'Operator'
                THEN operator_technician_id END
            ) AS available,
            COUNT(
                DISTINCT CASE WHEN role = 'Technician'
                THEN operator_technician_id END
            ) AS in_progress
        FROM assigned
    """)
    r = rows[0] if rows else {}
    total = r.get("total", 0)
    available = r.get("available", 0)
    in_prog = r.get("in_progress", 0)
    return TechnicianSummary(
        available=available,
        in_progress=in_prog,
        in_training=0,
        unavailable=max(total - available - in_prog, 0),
        total=total,
    )
