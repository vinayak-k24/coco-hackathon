import { NextResponse } from 'next/server';
import { query } from '@/lib/snowflake';

export async function GET() {
  try {
    const rows = await query(`
      SELECT
        w.WORK_ORDER_ID,
        w.ASSET_ID,
        w.ASSET_NAME,
        w.ASSET_TYPE,
        w.PLANT_NAME,
        w.WORK_ORDER_TYPE,
        w.PRIORITY,
        w.DESCRIPTION,
        w.STATUS,
        w.PLANNED_START_TIME,
        w.FAILURE_MODE
      FROM PDM.CORE.FACT_WORK_ORDER w
      WHERE w.STATUS NOT IN ('Completed', 'Cancelled')
      ORDER BY w.PRIORITY DESC
      LIMIT 10
    `);

    const queue = (rows as Record<string, unknown>[]).map((r) => ({
      id: r.WORK_ORDER_ID,
      asset_id: r.ASSET_ID,
      machine: r.ASSET_NAME,
      type: r.ASSET_TYPE,
      plant: r.PLANT_NAME,
      wo_type: r.WORK_ORDER_TYPE,
      priority: r.PRIORITY,
      description: r.DESCRIPTION,
      status: r.STATUS,
      planned_start: r.PLANNED_START_TIME,
      failure_mode: r.FAILURE_MODE,
    }));

    return NextResponse.json(queue);
  } catch (err) {
    console.error('maintenance/queue error:', err);
    return NextResponse.json([], { status: 500 });
  }
}
