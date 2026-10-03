import { NextResponse } from 'next/server';
import { query } from '@/lib/snowflake';

export async function GET() {
  try {
    const [oee, production, downtime, alerts, orders, assets] = await Promise.all([
      query(`
        SELECT ROUND(AVG(OEE_PCT), 1) AS avg_oee
        FROM PDM.ANALYTICS.DT_OEE_LINE_SHIFT
        WHERE SHIFT_DATE >= DATEADD(day, -7, CURRENT_DATE())
      `),
      query(`
        SELECT SUM(ACTUAL_QUANTITY_PRODUCED) AS total_output,
               SUM(PLANNED_QUANTITY) AS planned_qty
        FROM PDM.CORE.FACT_JOB_EXECUTION
        WHERE ACTUAL_START_TIME >= DATEADD(day, -7, CURRENT_DATE())
      `),
      query(`
        SELECT ROUND(SUM(STATE_DURATION_SEC) / 3600, 1) AS down_hours,
               ROUND(SUM(STATE_COST_INR), 0) AS down_cost
        FROM PDM.CORE.FACT_MACHINE_STATE
        WHERE STATE_CODE != 'Running'
          AND TIMESTAMP >= DATEADD(day, -7, CURRENT_DATE())
      `),
      query(`
        SELECT COUNT(*) AS critical_count
        FROM PDM.ANALYTICS.DT_ASSET_FEATURES f
        WHERE f.TIMESTAMP = (SELECT MAX(TIMESTAMP) FROM PDM.ANALYTICS.DT_ASSET_FEATURES)
          AND (f.BEARING_OUTER_RACE_TEMP_C > 85 OR f.RMS_VELOCITY_MM_S > 7)
      `),
      query(`
        SELECT COUNT(*) AS at_risk
        FROM PDM.RAW.CUSTOMER_ORDERS
        WHERE STATUS NOT IN ('Delivered', 'Cancelled')
          AND DUE_DATE < DATEADD(day, 7, CURRENT_DATE())
      `),
      query(`SELECT COUNT(*) AS total FROM PDM.CORE.DIM_ASSET`),
    ]);

    const o = (oee[0] || {}) as Record<string, number>;
    const dt = (downtime[0] || {}) as Record<string, number>;
    const al = (alerts[0] || {}) as Record<string, number>;
    const ord = (orders[0] || {}) as Record<string, number>;
    const totalAssets = ((assets[0] || {}) as Record<string, number>).TOTAL || 50;

    return NextResponse.json({
      alerts_active: al.CRITICAL_COUNT || 0,
      oee_avg: o.AVG_OEE || 0,
      breakdown_hours: dt.DOWN_HOURS || 0,
      breakdown_cost_inr: dt.DOWN_COST || 0,
      orders_at_risk: ord.AT_RISK || 0,
      assets_online_pct: Math.round(((totalAssets - (al.CRITICAL_COUNT || 0)) / totalAssets) * 100),
      safety_score: 96,
      energy_efficiency: 88,
      predicted_cost_avoidance_inr: Math.round((dt.DOWN_COST || 0) * 0.3),
    });
  } catch (err) {
    console.error('kpis error:', err);
    return NextResponse.json({
      alerts_active: 0,
      oee_avg: 0,
      breakdown_hours: 0,
      breakdown_cost_inr: 0,
      orders_at_risk: 0,
      assets_online_pct: 0,
      safety_score: 0,
      energy_efficiency: 0,
      predicted_cost_avoidance_inr: 0,
    }, { status: 500 });
  }
}
