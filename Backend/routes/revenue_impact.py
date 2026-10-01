from fastapi import APIRouter
from db import execute_query
from models.responses import RevenueImpact

router = APIRouter()


def _format_inr(val: float) -> str:
    if val >= 1_00_00_000:
        return f"₹{val / 1_00_00_000:.1f} Cr"
    if val >= 1_00_000:
        return f"₹{val / 1_00_000:.1f}L"
    return f"₹{val / 1_000:.1f}K"


@router.get("/revenue-impact", response_model=RevenueImpact)
def get_revenue_impact():
    # Total at-risk order value
    risk = execute_query("""
        SELECT COALESCE(SUM(order_value), 0) AS total_risk
        FROM PDM.RAW.CUSTOMER_ORDERS
        WHERE status IN ('In Production', 'Scheduled')
    """)
    total_risk = risk[0]["total_risk"] if risk else 0

    # Orders past due
    late = execute_query("""
        SELECT COUNT(*) AS cnt FROM PDM.RAW.CUSTOMER_ORDERS
        WHERE status IN ('In Production', 'Scheduled')
          AND due_date < '2026-10-01'
    """)
    total_orders = execute_query("""
        SELECT COUNT(*) AS cnt FROM PDM.RAW.CUSTOMER_ORDERS
        WHERE status != 'Delivered'
    """)
    late_cnt = late[0]["cnt"] if late else 0
    total_cnt = total_orders[0]["cnt"] if total_orders else 1
    delivery_risk = round(late_cnt / max(total_cnt, 1) * 100, 1)

    # Chart data: at-risk order value by due date
    chart = execute_query("""
        SELECT due_date, SUM(order_value) AS value
        FROM PDM.RAW.CUSTOMER_ORDERS
        WHERE status IN ('In Production', 'Scheduled')
        GROUP BY due_date
        ORDER BY due_date
    """)
    chart_data = [
        {"date": str(r["due_date"]), "value": float(r["value"])} for r in chart]

    return RevenueImpact(
        revenue_at_risk=_format_inr(total_risk),
        revenue_trend="",
        delivery_risk_pct=f"{delivery_risk}%",
        delivery_trend="",
        chart_data=chart_data,
    )
