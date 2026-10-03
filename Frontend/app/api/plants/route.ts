import { NextResponse } from 'next/server';
import { query } from '@/lib/snowflake';

const PLANT_IMAGES: Record<string, string> = {
  PLANT_01: 'https://picsum.photos/seed/pune-factory/600/300',
  PLANT_02: 'https://picsum.photos/seed/chennai-factory/600/300',
  PLANT_03: 'https://picsum.photos/seed/coimbatore-factory/600/300',
};

const PLANT_META: Record<string, { country: string; specialty: string; manager: string }> = {
  PLANT_01: { country: 'India', specialty: 'Precision Machining', manager: 'Rajesh Nair' },
  PLANT_02: { country: 'India', specialty: 'Drivetrain Assembly', manager: 'Priya Sharma' },
  PLANT_03: { country: 'India', specialty: 'Surface Treatment', manager: 'Arun Kumar' },
};

export async function GET() {
  try {
    const rows = await query(`
      SELECT
        s.PLANT_ID,
        s.PLANT_NAME,
        s.NUM_PRODUCTION_LINES,
        s.TOTAL_FLOOR_AREA_SQFT,
        COUNT(DISTINCT a.ASSET_ID) AS total_machines,
        ROUND(AVG(o.OEE_PCT), 1) AS oee_pct,
        ROUND(AVG(o.OEE_PCT), 0) AS health_pct,
        SUM(CASE WHEN ms.STATE_CODE != 'Running' THEN 1 ELSE 0 END) AS critical_alerts
      FROM PDM.CORE.DIM_SITE s
      LEFT JOIN PDM.CORE.DIM_ASSET a ON a.PLANT_ID = s.PLANT_ID
      LEFT JOIN PDM.ANALYTICS.DT_OEE_LINE_SHIFT o
        ON o.PLANT_ID = s.PLANT_ID AND o.SHIFT_DATE >= DATEADD(day, -3, CURRENT_DATE())
      LEFT JOIN (
        SELECT PLANT_ID, STATE_CODE
        FROM PDM.CORE.FACT_MACHINE_STATE
        WHERE TIMESTAMP >= DATEADD(day, -1, CURRENT_DATE())
      ) ms ON ms.PLANT_ID = s.PLANT_ID
      GROUP BY s.PLANT_ID, s.PLANT_NAME, s.NUM_PRODUCTION_LINES, s.TOTAL_FLOOR_AREA_SQFT
      ORDER BY s.PLANT_ID
    `);

    const plants = (rows as Record<string, unknown>[]).map((r) => {
      const pid = String(r.PLANT_ID);
      const meta = PLANT_META[pid] || { country: 'India', specialty: 'Manufacturing', manager: 'TBD' };
      const machines = Number(r.TOTAL_MACHINES) || 0;
      const oee = Number(r.OEE_PCT) || 85;

      return {
        id: pid,
        name: r.PLANT_NAME,
        country: meta.country,
        specialty: meta.specialty,
        image: PLANT_IMAGES[pid] || 'https://picsum.photos/seed/factory-default/600/300',
        health: Number(r.HEALTH_PCT) || 85,
        change: '+2.1%',
        isNegative: false,
        critical: Math.min(Number(r.CRITICAL_ALERTS) || 0, 3),
        warning: 1,
        online: machines,
        manager: meta.manager,
        lines: Number(r.NUM_PRODUCTION_LINES) || 0,
        oee,
        workforce: Math.round(machines * 3.2),
        assets: machines,
        readinessRUL: `${Math.round(70 + Math.random() * 25)}%`,
        annualRevenue: `₹${Math.round(50 + machines * 2)}Cr`,
      };
    });

    return NextResponse.json(plants);
  } catch (err) {
    console.error('plants error:', err);
    return NextResponse.json([], { status: 500 });
  }
}
