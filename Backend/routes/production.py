from fastapi import APIRouter, Query
from db import execute_query
from models.responses import ProductionDay

router = APIRouter()


@router.get("/production", response_model=list[ProductionDay])
def get_production(days: int = Query(8)):
    rows = execute_query("""
        SELECT
            actual_start_time::date AS prod_date,
            SUM(actual_quantity_produced) AS actual_qty,
            SUM(planned_quantity) AS planned_qty
        FROM PDM.RAW.JOB_ORDER_EXECUTION
        WHERE job_status = 'Completed'
        GROUP BY prod_date
        ORDER BY prod_date DESC
        LIMIT %(days)s
    """, {"days": days})
    results = []
    for r in rows:
        actual = int(r.get("actual_qty", 0))
        planned = int(r.get("planned_qty", 1))
        results.append(ProductionDay(
            date=str(r["prod_date"]),
            actual=actual,
            plan=planned,
            oee=round(actual / max(planned, 1) * 100, 1),
        ))
    results.reverse()
    return results
