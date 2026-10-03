from fastapi import APIRouter
from db import execute_query
from models.responses import MachineAlert

router = APIRouter()


@router.get("/alerts", response_model=list[MachineAlert])
def get_alerts(limit: int = 10):
    rows = execute_query("""
        SELECT * FROM PDM.ANALYTICS.VW_ACTIVE_ALERTS
        ORDER BY peak_severity DESC
        LIMIT %(limit)s
    """, {"limit": limit})

    thresholds = execute_query("SELECT * FROM PDM.RAW.CFG_ASSET_THRESHOLDS")
    thresh_map = {}
    for th in thresholds:
        key = (th.get("asset_type", ""), th.get("sensor_table_column", ""))
        thresh_map[key] = th

    results = []
    for r in rows:
        sev = float(r.get("peak_severity", 0))
        short_name = r.get("asset_name", "").split(" ")[0]
        plant_short = r.get("plant_name", "").split(" ")[0]
        at = r.get("asset_type", "")

        temp_str = None
        if r.get("bearing_outer_race_temp_c") is not None:
            val = round(float(r["bearing_outer_race_temp_c"]), 1)
            th = thresh_map.get((at, "Bearing_Outer_Race_Temp_C"), {})
            warn = th.get("warning_threshold", "")
            temp_str = f"{val}°C (Threshold: {warn}°C)"

        vib_str = None
        if r.get("rms_velocity_mm_s") is not None:
            val = round(float(r["rms_velocity_mm_s"]), 2)
            th = thresh_map.get((at, "RMS_Velocity_mm_s"), {})
            warn = th.get("warning_threshold", "")
            vib_str = f"{val} mm/s RMS (Warn: {warn})"

        fault = r.get("fault_mode", "")
        rec_map = {
            "bearing_wear": "Schedule bearing inspection and replacement. Reduce speed until serviced.",
            "overheating": "Check cooling system and load. Derate if temperature rising.",
            "lube_starvation": "Check lubrication system. Replenish grease/oil.",
            "cavitation": "Check inlet pressure and suction line. Reduce flow rate.",
            "misalignment": "Schedule alignment check at next shift change.",
        }

        results.append(MachineAlert(
            id=short_name.lower().replace("-", "_"),
            machine=short_name,
            issue=f"{fault.replace('_', ' ').title()} (RMS {round(float(r.get('rms_velocity_mm_s', 0)), 2)} mm/s)"
            if r.get("rms_velocity_mm_s") else fault.replace("_", " ").title(),
            location=f"{plant_short} • {r.get('line_name', '')}",
            severity=r.get("severity_label", "Warning"),
            time=str(r.get("projected_failure_ts", "")),
            temperature=temp_str,
            vibration=vib_str,
            pressure=None,
            recommendedAction=rec_map.get(fault, f"Investigate {fault}."),
        ))
    return results
