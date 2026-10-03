import { NextResponse } from 'next/server';
import { query } from '@/lib/snowflake';

export async function GET() {
  try {
    const rows = await query(`
      SELECT
        SHIFT_DATE,
        ROUND(SUM(ACTUAL_QTY), 0) AS actual,
        ROUND(SUM(PLANNED_QTY), 0) AS planned,
        ROUND(AVG(OEE_PCT), 1) AS oee
      FROM PDM.ANALYTICS.DT_OEE_LINE_SHIFT
      WHERE SHIFT_DATE >= DATEADD(day, -8, CURRENT_DATE())
      GROUP BY SHIFT_DATE
      ORDER BY SHIFT_DATE
    `);

    const data = (rows as Record<string, unknown>[]).map((r) => ({
      date: String(r.SHIFT_DATE).replace(/"/g, '').split('T')[0],
      actual: Number(r.ACTUAL) || 0,
      planned: Number(r.PLANNED) || 0,
      oee: Number(r.OEE) || 0,
    }));

    return NextResponse.json(data);
  } catch (err) {
    console.error('production error:', err);
    return NextResponse.json([], { status: 500 });
  }
}
