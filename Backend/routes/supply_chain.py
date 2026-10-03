from fastapi import APIRouter
from db import execute_query
from models.responses import SupplyChainRiskItem, SupplyChainKpis, SupplyChainItem

router = APIRouter()


def _format_inr(val: float) -> str:
    if val >= 1_00_00_000:
        return f"₹{val / 1_00_00_000:.1f} Cr"
    if val >= 1_00_000:
        return f"₹{val / 1_00_000:.1f}L"
    if val >= 1_000:
        return f"₹{val / 1_000:.0f}K"
    return f"₹{val:.0f}"


@router.get("/supply-chain/kpis", response_model=SupplyChainKpis)
def get_supply_chain_kpis():
    parts = execute_query("""
        SELECT
            COUNT(*) AS total,
            SUM(current_stock_qty) AS total_stock,
            SUM(CASE WHEN current_stock_qty = 0 THEN 1 ELSE 0 END) AS out_of_stock,
            SUM(CASE WHEN current_stock_qty < min_stock_level AND current_stock_qty > 0 THEN 1 ELSE 0 END) AS below_min,
            SUM(CASE WHEN current_stock_qty <= reorder_point THEN 1 ELSE 0 END) AS below_reorder
        FROM PDM.RAW.SPARE_PARTS_CATALOG
    """)
    p = parts[0] if parts else {}

    po = execute_query("""
        SELECT
            COUNT(*) AS total_po,
            SUM(CASE WHEN status = 'Approved' AND expected_delivery_date < '2026-10-01' THEN 1 ELSE 0 END) AS delayed
        FROM PDM.RAW.PURCHASE_ORDERS
        WHERE status NOT IN ('Delivered', 'Cancelled')
    """)
    po_data = po[0] if po else {}

    avg_rating = execute_query(
        "SELECT AVG(supplier_rating) AS r FROM PDM.RAW.SUPPLIERS_VENDORS")
    rating = float(avg_rating[0]["r"]) if avg_rating else 0

    return SupplyChainKpis(
        critical_shortages=int(p.get("out_of_stock", 0)),
        inventory_health_pct=round(
            (1 - int(p.get("below_reorder", 0)) / max(int(p.get("total", 1)), 1)) * 100, 1),
        parts_at_risk=int(p.get("below_reorder", 0)),
        purchase_orders=int(po_data.get("total_po", 0)),
        po_delayed=int(po_data.get("delayed", 0)),
        supplier_performance_pct=round(rating / 5 * 100, 1),
        predicted_risk_inr=0,
        total_items=int(p.get("total", 0)),
        in_stock=int(p.get("total", 0)) - int(p.get("below_reorder", 0)),
        below_reorder=int(p.get("below_reorder", 0)),
        out_of_stock=int(p.get("out_of_stock", 0)),
    )


@router.get("/supply-chain/risk", response_model=list[SupplyChainRiskItem])
def get_supply_chain_risk():
    rows = execute_query("""
        SELECT sp.part_name, sv.supplier_name, sv.supplier_rating,
               sv.avg_delivery_time_days, sp.current_stock_qty,
               sp.reorder_point, sp.min_stock_level, sp.compatible_asset_types
        FROM PDM.RAW.SPARE_PARTS_CATALOG sp
        JOIN PDM.RAW.SUPPLIERS_VENDORS sv ON sv.supplier_id = sp.supplier_id
        WHERE sp.current_stock_qty <= sp.reorder_point
        ORDER BY sp.current_stock_qty ASC, sv.avg_delivery_time_days DESC
        LIMIT 4
    """)

    results = []
    for r in rows:
        stock = int(r.get("current_stock_qty", 0))
        rating = float(r.get("supplier_rating", 0))
        lead = float(r.get("avg_delivery_time_days", 0))

        # Count affected machines
        asset_types = r.get("compatible_asset_types", "")
        affected = execute_query("""
            SELECT COUNT(*) AS cnt FROM PDM.RAW.MACHINES_ASSETS
            WHERE asset_type IN (SELECT TRIM(value) FROM TABLE(SPLIT_TO_TABLE(%(types)s, ',')))
        """, {"types": asset_types})
        aff_cnt = affected[0]["cnt"] if affected else 0

        # Estimate business exposure (affected machines * avg downtime cost * 8h)
        exposure = aff_cnt * 700 * 60 * 8  # rough

        risk = "High Risk" if stock == 0 else "Medium Risk" if stock < int(
            r.get("min_stock_level", 2)) else "Low Risk"

        results.append(SupplyChainRiskItem(
            name=r["part_name"],
            sub=r["supplier_name"],
            supplierHealth=round(rating / 5 * 100),
            leadTime=f"{int(lead)} days",
            leadTimeChange="",
            affectedMachines=aff_cnt,
            businessExposure=_format_inr(exposure),
            risk=risk,
        ))
    return results


@router.get("/supply-chain/items", response_model=list[SupplyChainItem])
def get_supply_chain_items():
    rows = execute_query("""
        WITH latest_po AS (
            SELECT part_id, status, expected_delivery_date,
                   ROW_NUMBER() OVER (PARTITION BY part_id ORDER BY order_date DESC) AS rn
            FROM PDM.RAW.PURCHASE_ORDERS
        )
        SELECT
            sp.part_id, sp.part_name, sv.supplier_name, sv.supplier_rating,
            sv.avg_delivery_time_days, sp.current_stock_qty,
            sp.reorder_point, sp.min_stock_level, sp.compatible_asset_types,
            lp.status AS po_status, lp.expected_delivery_date AS po_eta,
            CASE
                WHEN sp.current_stock_qty = 0 THEN 'Critical'
                WHEN sp.current_stock_qty < sp.min_stock_level THEN 'High'
                WHEN sp.current_stock_qty < sp.reorder_point THEN 'Medium'
                ELSE 'Low'
            END AS risk_level
        FROM PDM.RAW.SPARE_PARTS_CATALOG sp
        JOIN PDM.RAW.SUPPLIERS_VENDORS sv ON sv.supplier_id = sp.supplier_id
        LEFT JOIN latest_po lp ON lp.part_id = sp.part_id AND lp.rn = 1
        WHERE sp.current_stock_qty <= sp.reorder_point
        ORDER BY sp.current_stock_qty ASC
    """)
    return [
        SupplyChainItem(
            part_id=r["part_id"],
            part_name=r["part_name"],
            supplier_name=r.get("supplier_name", ""),
            supplier_rating=float(r.get("supplier_rating", 0)),
            lead_time_days=float(r.get("avg_delivery_time_days", 0)),
            current_stock=int(r.get("current_stock_qty", 0)),
            reorder_point=int(r.get("reorder_point", 0)),
            min_stock=int(r.get("min_stock_level", 0)),
            compatible_asset_types=r.get("compatible_asset_types", ""),
            po_status=str(r.get("po_status", "")),
            po_eta=str(r.get("po_eta", "")),
            risk_level=r.get("risk_level", "Low"),
        )
        for r in rows
    ]
