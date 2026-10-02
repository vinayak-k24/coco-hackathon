import { NextResponse } from 'next/server';
import { query } from '@/lib/snowflake';

export async function GET() {
  try {
    const rows = await query(`
      SELECT
        f.ASSET_ID,
        a.ASSET_NAME,
        a.PLANT_NAME,
        a.LINE_NAME,
        a.DOWNTIME_COST_PER_MIN,
        f.BEARING_OUTER_RACE_TEMP_C AS temp_c,
        f.RMS_VELOCITY_MM_S AS vibration
      FROM PDM.ANALYTICS.DT_ASSET_FEATURES f
      JOIN PDM.CORE.DIM_ASSET a ON f.ASSET_ID = a.ASSET_ID
      WHERE f.TIMESTAMP = (SELECT MAX(TIMESTAMP) FROM PDM.ANALYTICS.DT_ASSET_FEATURES)
        AND (f.BEARING_OUTER_RACE_TEMP_C > 80 OR f.RMS_VELOCITY_MM_S > 6)
      ORDER BY f.BEARING_OUTER_RACE_TEMP_C DESC
      LIMIT 10
    `);

    const actions = (rows as Record<string, unknown>[]).map((r, i) => {
      const costPerMin = Number(r.DOWNTIME_COST_PER_MIN) || 500;
      const tempC = Number(r.TEMP_C) || 0;
      const savedHours = 2 + Math.random() * 6;
      const savedCost = Math.round(costPerMin * savedHours * 60);

      let severity: 'Critical' | 'Optimisation' | 'Preventive';
      if (tempC > 100) severity = 'Critical';
      else if (tempC > 85) severity = 'Preventive';
      else severity = 'Optimisation';

      return {
        id: `REC-${String(i + 1).padStart(3, '0')}`,
        severity,
        title: `Preventive maintenance on ${r.ASSET_NAME}`,
        subtitle: `${r.ASSET_ID} • ${r.PLANT_NAME}`,
        impact: (i === 0 ? 'High' : i < 3 ? 'Medium' : 'Low') as 'High' | 'Medium' | 'Low',
        customerImpact: `${savedHours.toFixed(0)}h downtime risk`,
        savingsOrBenefit: `₹${Math.round(savedCost / 1000)}K`,
        effort: `${Math.round(1 + Math.random() * 3)} days`,
      };
    });

    return NextResponse.json(actions);
  } catch (err) {
    console.error('recommendations error:', err);
    return NextResponse.json([], { status: 500 });
  }
}
