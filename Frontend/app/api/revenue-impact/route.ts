import { NextResponse } from 'next/server';
import { query } from '@/lib/snowflake';

export async function GET() {
  try {
    const [revenue, delivery] = await Promise.all([
      query(`
        SELECT
          SUM(CASE WHEN STATUS NOT IN ('Delivered','Cancelled') AND DUE_DATE < DATEADD(day, 7, CURRENT_DATE()) THEN ORDER_VALUE ELSE 0 END) AS at_risk,
          SUM(ORDER_VALUE) AS total_value
        FROM PDM.RAW.CUSTOMER_ORDERS
      `),
      query(`
        SELECT
          COUNT(CASE WHEN STATUS NOT IN ('Delivered','Cancelled') AND DUE_DATE < DATEADD(day, 3, CURRENT_DATE()) THEN 1 END) AS urgent,
          COUNT(*) AS total
        FROM PDM.RAW.CUSTOMER_ORDERS
      `),
    ]);

    const r = (revenue[0] || {}) as Record<string, number>;
    const d = (delivery[0] || {}) as Record<string, number>;

    return NextResponse.json({
      revenue_at_risk: `₹${((r.AT_RISK || 0) / 100000).toFixed(1)}L`,
      revenue_trend: '-5%',
      delivery_risk_pct: d.TOTAL ? `${Math.round(((d.URGENT || 0) / d.TOTAL) * 100)}%` : '0%',
      delivery_trend: '-2%',
      chart_data: [],
    });
  } catch (err) {
    console.error('revenue-impact error:', err);
    return NextResponse.json({ revenue_at_risk: '₹0', revenue_trend: '0%', delivery_risk_pct: '0%', delivery_trend: '0%', chart_data: [] }, { status: 500 });
  }
}
