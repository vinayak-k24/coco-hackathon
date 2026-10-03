from fastapi import APIRouter
from db import execute_query
from models.responses import OrderRow

router = APIRouter()


def _format_inr(val: float) -> str:
    if val >= 1_00_00_000:
        return f"₹{val / 1_00_00_000:.1f} Cr"
    if val >= 1_00_000:
        return f"₹{val / 1_00_000:.1f}L"
    return f"₹{val / 1_000:.0f}K"


TIER_EMOJI = {"Platinum": "💎", "Gold": "🥇", "Standard": "🏭"}


@router.get("/orders", response_model=list[OrderRow])
def get_orders():
    rows = execute_query("SELECT * FROM PDM.ANALYTICS.VW_ORDERS_AT_RISK")
    results = []
    for r in rows:
        exposure = float(r.get("revenue_exposure_inr", 0))
        ui_status = "At Risk" if exposure > 0 and r.get("risk_reason", "").startswith("Line") else \
                    "Watch" if exposure > 0 else "On Track"
        due = r.get("due_date")
        if hasattr(due, "strftime"):
            due_str = due.strftime("%b %d, %Y")
        else:
            due_str = str(due).strip('"')

        results.append(OrderRow(
            customer=r["customer_name"],
            customerLogo=TIER_EMOJI.get(r.get("customer_tier", ""), "🏭"),
            orderId=r["order_id"],
            product=r.get("product_name", ""),
            commitment=due_str,
            status=ui_status,
            revenueExposure=_format_inr(exposure) if exposure > 0 else "₹0",
        ))
    return results
