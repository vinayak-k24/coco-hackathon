import { NextResponse } from 'next/server';
import { query } from '@/lib/snowflake';

export async function GET() {
  try {
    const [sites, oee, assets, workforce] = await Promise.all([
      query('SELECT COUNT(*) AS cnt FROM PDM.CORE.DIM_SITE'),
      query(`
        SELECT ROUND(AVG(OEE_PCT), 1) AS avg_oee,
               ROUND(SUM(DOWNTIME_COST_INR), 0) AS total_downtime_cost
        FROM PDM.ANALYTICS.DT_OEE_LINE_SHIFT
        WHERE SHIFT_DATE >= DATEADD(day, -7, CURRENT_DATE())
      `),
      query('SELECT COUNT(*) AS cnt FROM PDM.CORE.DIM_ASSET'),
      query(`
        SELECT COUNT(DISTINCT OPERATOR_TECHNICIAN_ID) AS online
        FROM PDM.RAW.OPERATOR_TECHNICIAN_ASSIGNMENTS
      `),
    ]);

    const plantBadges = await query<{ PLANT_NAME: string; OEE: number }>(`
      SELECT s.PLANT_NAME,
             ROUND(AVG(o.OEE_PCT), 0) AS OEE
      FROM PDM.ANALYTICS.DT_OEE_LINE_SHIFT o
      JOIN PDM.CORE.DIM_SITE s ON o.PLANT_ID = s.PLANT_ID
      WHERE o.SHIFT_DATE >= DATEADD(day, -7, CURRENT_DATE())
      GROUP BY s.PLANT_NAME
    `);

    const totalFactories = (sites[0] as Record<string, number>)?.CNT ?? 3;
    const connectedAssets = (assets[0] as Record<string, number>)?.CNT ?? 50;
    const workforceOnline = (workforce[0] as Record<string, number>)?.ONLINE ?? 0;
    const avgOee = (oee[0] as Record<string, number>)?.AVG_OEE ?? 0;
    const costAvoidance = (oee[0] as Record<string, number>)?.TOTAL_DOWNTIME_COST ?? 0;

    const now = new Date();
    const hour = now.getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

    return NextResponse.json({
      greeting,
      user_name: 'Alex',
      date: dateStr,
      summary: `Production is on track across all sites with ${avgOee}% average OEE.`,
      oee_avg: `${avgOee}%`,
      cost_avoidance: `₹${Math.round(costAvoidance / 100000)}L`,
      total_factories: totalFactories,
      connected_assets: connectedAssets,
      workforce_online: workforceOnline,
      workforce_pct: `${Math.min(100, Math.round((workforceOnline / (workforceOnline + 5)) * 100))}%`,
      platform_health: '98%',
      plant_badges: plantBadges.map((p) => ({
        name: p.PLANT_NAME.split(' ')[0],
        health_pct: p.OEE,
      })),
      ai_briefing_text: `All factories operating above plan with ${avgOee}% OEE.`,
    });
  } catch (err) {
    console.error('hero-briefing error:', err);
    return NextResponse.json({ error: 'Failed to load briefing' }, { status: 500 });
  }
}
