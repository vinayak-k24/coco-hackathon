import { NextResponse } from 'next/server';
import { query } from '@/lib/snowflake';

export async function GET() {
  try {
    const rows = await query(`
      SELECT
        STATUS,
        COUNT(*) AS cnt,
        ROUND(SUM(TOTAL_LABOR_HOURS), 1) AS labor_hours
      FROM PDM.CORE.FACT_WORK_ORDER
      GROUP BY STATUS
    `);

    let completed = 0, inProgress = 0, pending = 0, total = 0;
    for (const r of rows as Record<string, unknown>[]) {
      const s = String(r.STATUS).toLowerCase();
      const c = Number(r.CNT) || 0;
      total += c;
      if (s.includes('completed') || s.includes('closed')) completed += c;
      else if (s.includes('progress') || s.includes('open')) inProgress += c;
      else pending += c;
    }

    const healthyPct = total > 0 ? Math.round((completed / total) * 100) : 0;

    return NextResponse.json({
      healthy_pct: healthyPct,
      due_today: inProgress,
      this_week: pending,
      next_week: Math.round(pending * 0.6),
      on_track: completed,
      total,
    });
  } catch (err) {
    console.error('maintenance/readiness error:', err);
    return NextResponse.json({ healthy_pct: 0, due_today: 0, this_week: 0, next_week: 0, on_track: 0 }, { status: 500 });
  }
}
