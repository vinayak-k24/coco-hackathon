import { NextResponse } from 'next/server';
import { query } from '@/lib/snowflake';

export async function GET() {
  try {
    const rows = await query(`
      SELECT
        LOG_ID,
        OPERATOR_ID,
        TIMESTAMP,
        ACTION_TYPE,
        OLD_VALUE,
        NEW_VALUE,
        REASON_CODE
      FROM PDM.RAW.OPERATOR_ACTIONS_LOGS
      ORDER BY TIMESTAMP DESC
      LIMIT 10
    `);

    const events = (rows as Record<string, unknown>[]).map((r) => {
      const ts = String(r.TIMESTAMP).replace(/"/g, '');
      return {
        id: r.LOG_ID,
        operator: r.OPERATOR_ID,
        action: r.ACTION_TYPE,
        detail: r.NEW_VALUE || r.OLD_VALUE || r.REASON_CODE,
        reason: r.REASON_CODE,
        timestamp: ts,
        time_ago: getTimeAgo(ts),
      };
    });

    return NextResponse.json(events);
  } catch (err) {
    console.error('activity-stream error:', err);
    return NextResponse.json([], { status: 500 });
  }
}

function getTimeAgo(ts: string): string {
  try {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  } catch {
    return 'recently';
  }
}
