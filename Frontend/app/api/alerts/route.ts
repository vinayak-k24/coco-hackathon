import { NextResponse } from 'next/server';
import { query } from '@/lib/snowflake';

export async function GET() {
  try {
    const rows = await query(`
      SELECT
        f.ASSET_ID,
        a.ASSET_NAME,
        a.ASSET_TYPE,
        a.PLANT_NAME,
        a.LINE_NAME,
        f.BEARING_OUTER_RACE_TEMP_C AS temp_c,
        f.RMS_VELOCITY_MM_S AS vibration,
        f.ACTIVE_POWER_KW AS power_kw,
        CASE
          WHEN f.BEARING_OUTER_RACE_TEMP_C > 100 THEN 'Critical'
          WHEN f.BEARING_OUTER_RACE_TEMP_C > 85 OR f.RMS_VELOCITY_MM_S > 7 THEN 'Warning'
          ELSE 'Normal'
        END AS severity
      FROM PDM.ANALYTICS.DT_ASSET_FEATURES f
      JOIN PDM.CORE.DIM_ASSET a ON f.ASSET_ID = a.ASSET_ID
      WHERE f.TIMESTAMP = (SELECT MAX(TIMESTAMP) FROM PDM.ANALYTICS.DT_ASSET_FEATURES)
        AND (f.BEARING_OUTER_RACE_TEMP_C > 85 OR f.RMS_VELOCITY_MM_S > 7)
      ORDER BY f.BEARING_OUTER_RACE_TEMP_C DESC
      LIMIT 10
    `);

    const alerts = (rows as Record<string, unknown>[]).map((r, i) => {
      const tempC = Number(r.TEMP_C) || 0;
      const vib = Number(r.VIBRATION) || 0;
      const isTemp = tempC > 85;

      return {
        id: `ALERT-${String(i + 1).padStart(3, '0')}`,
        machine: String(r.ASSET_ID),
        issue: isTemp
          ? `Bearing temperature at ${tempC.toFixed(1)}°C (threshold: 85°C)`
          : `Vibration at ${vib.toFixed(1)} mm/s (threshold: 7.0 mm/s)`,
        location: `${r.PLANT_NAME} — ${r.LINE_NAME}`,
        severity: String(r.SEVERITY) as 'Critical' | 'Warning',
        time: '12 min ago',
        temperature: isTemp ? `${tempC.toFixed(1)}°C` : undefined,
        vibration: !isTemp ? `${vib.toFixed(1)} mm/s` : undefined,
        recommendedAction: tempC > 100
          ? 'Immediate preventive shutdown recommended'
          : 'Schedule inspection within 24 hours',
      };
    });

    return NextResponse.json(alerts);
  } catch (err) {
    console.error('alerts error:', err);
    return NextResponse.json([], { status: 500 });
  }
}
