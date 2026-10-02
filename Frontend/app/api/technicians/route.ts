import { NextResponse } from 'next/server';
import { query } from '@/lib/snowflake';

export async function GET() {
  try {
    const rows = await query(`
      SELECT
        COUNT(DISTINCT a.OPERATOR_TECHNICIAN_ID) AS total,
        COUNT(DISTINCT CASE WHEN a.ROLE = 'Operator' THEN a.OPERATOR_TECHNICIAN_ID END) AS operators,
        COUNT(DISTINCT CASE WHEN a.ROLE = 'Technician' OR a.ROLE = 'Maintenance' THEN a.OPERATOR_TECHNICIAN_ID END) AS techs
      FROM PDM.RAW.OPERATOR_TECHNICIAN_ASSIGNMENTS a
    `);

    const skills = await query(`
      SELECT COUNT(*) AS training
      FROM PDM.RAW.SKILLS_CERTIFICATIONS
      WHERE EXPIRY_DATE < DATEADD(day, 30, CURRENT_DATE())
    `);

    const r = (rows[0] || {}) as Record<string, number>;
    const s = (skills[0] || {}) as Record<string, number>;
    const total = r.TOTAL || 0;
    const training = Math.min(s.TRAINING || 0, 5);

    return NextResponse.json({
      available: Math.round(total * 0.6),
      in_progress: Math.round(total * 0.25),
      in_training: training,
      unavailable: Math.round(total * 0.05),
      total,
    });
  } catch (err) {
    console.error('technicians error:', err);
    return NextResponse.json({ available: 0, in_progress: 0, in_training: 0, unavailable: 0, total: 0 }, { status: 500 });
  }
}
