import { NextResponse } from 'next/server';
import { query } from '@/lib/snowflake';

const LOGOS = ['🏭', '⚙️', '🔧', '🚗', '🏗️', '📦', '🔩', '⛽'];

export async function GET() {
  try {
    const rows = await query(`
      SELECT
        ORDER_ID,
        CUSTOMER_NAME,
        PRODUCT_ID,
        ORDER_QUANTITY,
        ORDER_VALUE,
        DUE_DATE,
        STATUS,
        DATEDIFF(day, CURRENT_DATE(), DUE_DATE) AS days_remaining
      FROM PDM.RAW.CUSTOMER_ORDERS
      ORDER BY DUE_DATE ASC
      LIMIT 15
    `);

    const orders = (rows as Record<string, unknown>[]).map((r, i) => {
      const daysLeft = Number(r.DAYS_REMAINING) || 0;
      const rawStatus = String(r.STATUS);

      let status: 'At Risk' | 'On Track' | 'Watch';
      if (rawStatus === 'Delivered' || rawStatus === 'Cancelled') {
        status = 'On Track';
      } else if (daysLeft < 0) {
        status = 'At Risk';
      } else if (daysLeft < 5) {
        status = 'Watch';
      } else {
        status = 'On Track';
      }

      const dueDate = String(r.DUE_DATE).replace(/"/g, '');
      const commitment = new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      return {
        customer: r.CUSTOMER_NAME,
        customerLogo: LOGOS[i % LOGOS.length],
        orderId: r.ORDER_ID,
        product: r.PRODUCT_ID,
        commitment: commitment || dueDate,
        status,
        revenueExposure: `₹${(Number(r.ORDER_VALUE) / 100000).toFixed(1)}L`,
      };
    });

    return NextResponse.json(orders);
  } catch (err) {
    console.error('orders error:', err);
    return NextResponse.json([], { status: 500 });
  }
}
