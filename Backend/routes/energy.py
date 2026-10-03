from fastapi import APIRouter
from db import execute_query
from models.responses import EnergyPlantUI

router = APIRouter()


@router.get("/energy", response_model=list[EnergyPlantUI])
def get_energy():
    rows = execute_query("""
        WITH latest_day AS (
            SELECT MAX(timestamp::date) AS d FROM PDM.RAW.ELECTRICAL_METERING
        ),
        prev_day AS (
            SELECT DATEADD('day', -1, d) AS d FROM latest_day
        )
        SELECT
            sf.plant_id, sf.plant_name,
            AVG(CASE WHEN em.timestamp::date = ld.d THEN em.peak_demand_kw END) AS today_kw,
            AVG(CASE WHEN em.timestamp::date = pd.d THEN em.peak_demand_kw END) AS yest_kw,
            AVG(CASE WHEN em.timestamp::date = ld.d THEN em.power_factor_average END) AS today_pf
        FROM PDM.RAW.ELECTRICAL_METERING em
        CROSS JOIN latest_day ld
        CROSS JOIN prev_day pd
        JOIN PDM.RAW.MACHINES_ASSETS ma ON ma.asset_id = REPLACE(em.meter_id, 'MTR_', 'ASSET_')
        JOIN PDM.RAW.SITE_FACILITY sf ON sf.plant_id = ma.plant_id
        WHERE em.timestamp::date >= pd.d
        GROUP BY sf.plant_id, sf.plant_name
        ORDER BY sf.plant_id
    """)
    results = []
    for r in rows:
        today = float(r.get("today_kw", 0))
        yest = float(r.get("yest_kw", 0) or today)
        trend = round((today - yest) / max(yest, 1)
                      * 100, 1) if yest > 0 else 0
        name = r["plant_name"].split(" ")[0] + " " + r["plant_name"].split(
            " ")[1] if len(r["plant_name"].split(" ")) > 1 else r["plant_name"]
        power_mw = today / 1000
        results.append(EnergyPlantUI(
            name=name,
            power=f"{power_mw:.1f} MW" if power_mw >= 1 else f"{today:.0f} kW",
            load=f"{round(float(r.get('today_pf', 0)) * 100)}%",
            trend=f"{'+' if trend > 0 else ''}{trend}%",
            isDown=trend < 0,
        ))
    return results
