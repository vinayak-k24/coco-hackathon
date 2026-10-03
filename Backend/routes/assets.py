from fastapi import APIRouter, Path, Query
from db import execute_query
from models.responses import AssetDetail, AssetSummary, SensorReading

router = APIRouter()


@router.get("/assets/{asset_id}", response_model=AssetDetail)
def get_asset(asset_id: str = Path(...)):
    # Identity
    identity_rows = execute_query("""
        SELECT ma.*, sf.plant_name, pl.line_name
        FROM PDM.RAW.MACHINES_ASSETS ma
        JOIN PDM.RAW.SITE_FACILITY sf ON sf.plant_id = ma.plant_id
        JOIN PDM.RAW.PRODUCTION_LINES_CELLS pl ON pl.line_id = ma.line_id
        WHERE ma.asset_id = %(aid)s
    """, {"aid": asset_id})
    if not identity_rows:
        return AssetDetail(identity=AssetSummary(asset_id=asset_id, asset_name="Unknown", asset_type="Unknown"))
    r = identity_rows[0]
    identity = AssetSummary(
        asset_id=r["asset_id"], asset_name=r["asset_name"], asset_type=r["asset_type"],
        model_number=r.get("model_number", ""), serial_number=r.get("serial_number", ""),
        plant_id=r["plant_id"], plant_name=r.get("plant_name", ""),
        line_id=r["line_id"], line_name=r.get("line_name", ""),
        criticality_level=r.get("criticality_level", 0),
        downtime_cost_per_min=float(r.get("downtime_cost_per_min", 0)),
        installation_date=str(r.get("installation_date", "")),
        condition_monitored=str(
            r.get("condition_monitored", "")).lower() == "true",
    )

    # Latest sensors
    vib = execute_query("""
        SELECT * FROM PDM.RAW.VIBRATION_DYNAMICS
        WHERE asset_id = %(aid)s ORDER BY timestamp DESC LIMIT 1
    """, {"aid": asset_id})
    temp = execute_query("""
        SELECT * FROM PDM.RAW.TEMPERATURE_THERMAL
        WHERE asset_id = %(aid)s ORDER BY timestamp DESC LIMIT 1
    """, {"aid": asset_id})
    rot = execute_query("""
        SELECT * FROM PDM.RAW.ROTATIONAL_MOTION
        WHERE asset_id = %(aid)s ORDER BY timestamp DESC LIMIT 1
    """, {"aid": asset_id})
    elec = execute_query("""
        SELECT * FROM PDM.RAW.ELECTRICAL_POWER
        WHERE asset_id = %(aid)s ORDER BY timestamp DESC LIMIT 1
    """, {"aid": asset_id})

    sensors = {
        "vibration": vib[0] if vib else {},
        "temperature": temp[0] if temp else {},
        "rotation": rot[0] if rot else {},
        "electrical": elec[0] if elec else {},
    }
    # Convert datetimes to strings
    for cat in sensors.values():
        for k, v in list(cat.items()):
            if hasattr(v, "isoformat"):
                cat[k] = v.isoformat()

    # Maintenance history
    wo = execute_query("""
        SELECT work_order_id, work_order_type, priority, description, status,
               planned_start_time, actual_end_time, total_labor_hours, total_parts_cost
        FROM PDM.RAW.WORK_ORDERS
        WHERE asset_id = %(aid)s
        ORDER BY planned_start_time DESC
    """, {"aid": asset_id})
    for row in wo:
        for k, v in list(row.items()):
            if hasattr(v, "isoformat"):
                row[k] = v.isoformat()

    # Spare parts
    parts = execute_query("""
        SELECT part_id, part_name, part_category, unit_cost, current_stock_qty,
               reorder_point, min_stock_level, compatible_asset_types
        FROM PDM.RAW.SPARE_PARTS_CATALOG
        WHERE compatible_asset_types LIKE %(atype)s
    """, {"atype": f"%{identity.asset_type}%"})

    # Operator trail
    trail = execute_query("""
        SELECT log_id, operator_id, timestamp, action_type, old_value, new_value, reason_code
        FROM PDM.RAW.OPERATOR_ACTIONS_LOGS
        WHERE operator_id IN (
            SELECT operator_technician_id FROM PDM.RAW.OPERATOR_TECHNICIAN_ASSIGNMENTS
            WHERE assigned_machine_id = %(aid)s
        )
        ORDER BY timestamp DESC LIMIT 10
    """, {"aid": asset_id})
    for row in trail:
        for k, v in list(row.items()):
            if hasattr(v, "isoformat"):
                row[k] = v.isoformat()

    # Thresholds
    thresholds = execute_query("""
        SELECT * FROM PDM.RAW.CFG_ASSET_THRESHOLDS
        WHERE asset_type = %(atype)s
    """, {"atype": identity.asset_type})

    return AssetDetail(
        identity=identity,
        sensors=sensors,
        maintenance_history=wo,
        spare_parts=parts,
        operator_trail=trail,
        thresholds=thresholds,
    )


@router.get("/assets/{asset_id}/sensors", response_model=list[SensorReading])
def get_asset_sensors(asset_id: str = Path(...), hours: int = Query(24)):
    rows = execute_query("""
        SELECT
            v.timestamp, v.asset_id,
            v.rms_velocity_mm_s AS rms_velocity,
            t.bearing_outer_race_temp_c,
            t.motor_winding_temp_c,
            r.spindle_speed_rpm,
            e.active_power_kw,
            v.kurtosis,
            v.crest_factor
        FROM PDM.RAW.VIBRATION_DYNAMICS v
        LEFT JOIN PDM.RAW.TEMPERATURE_THERMAL t
            ON t.asset_id = v.asset_id AND t.timestamp = v.timestamp
        LEFT JOIN PDM.RAW.ROTATIONAL_MOTION r
            ON r.asset_id = v.asset_id AND r.timestamp = v.timestamp
        LEFT JOIN PDM.RAW.ELECTRICAL_POWER e
            ON e.asset_id = v.asset_id AND e.timestamp = v.timestamp
        WHERE v.asset_id = %(aid)s
          AND v.timestamp >= DATEADD('hour', -%(hours)s,
            (SELECT MAX(timestamp)
             FROM PDM.RAW.VIBRATION_DYNAMICS
             WHERE asset_id = %(aid)s))
        ORDER BY v.timestamp ASC
    """, {"aid": asset_id, "hours": hours})
    return [
        SensorReading(
            timestamp=str(r["timestamp"]),
            asset_id=r["asset_id"],
            rms_velocity=r.get("rms_velocity"),
            bearing_outer_race_temp_c=r.get("bearing_outer_race_temp_c"),
            motor_winding_temp_c=r.get("motor_winding_temp_c"),
            spindle_speed_rpm=r.get("spindle_speed_rpm"),
            active_power_kw=r.get("active_power_kw"),
            kurtosis=r.get("kurtosis"),
            crest_factor=r.get("crest_factor"),
        )
        for r in rows
    ]
