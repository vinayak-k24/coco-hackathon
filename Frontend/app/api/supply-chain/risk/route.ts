import { NextResponse } from 'next/server';
import { query } from '@/lib/snowflake';

export async function GET() {
  try {
    const rows = await query(`
      SELECT
        p.PO_ID,
        s.SUPPLIER_NAME,
        p.PART_ID,
        p.TOTAL_PRICE,
        p.STATUS,
        p.EXPECTED_DELIVERY_DATE,
        p.ACTUAL_DELIVERY_DATE,
        DATEDIFF(day, p.EXPECTED_DELIVERY_DATE, COALESCE(p.ACTUAL_DELIVERY_DATE, CURRENT_DATE())) AS delay_days
      FROM PDM.RAW.PURCHASE_ORDERS p
      JOIN PDM.RAW.SUPPLIERS_VENDORS s ON p.SUPPLIER_ID = s.SUPPLIER_ID
      WHERE p.STATUS NOT IN ('Invoiced', 'Received')
         OR (p.ACTUAL_DELIVERY_DATE IS NOT NULL AND p.ACTUAL_DELIVERY_DATE > p.EXPECTED_DELIVERY_DATE)
      ORDER BY delay_days DESC
      LIMIT 10
    `);

    const items = (rows as Record<string, unknown>[]).map((r) => ({
      po_id: r.PO_ID,
      supplier: r.SUPPLIER_NAME,
      part: r.PART_ID,
      value: `₹${Math.round(Number(r.TOTAL_PRICE) / 1000)}K`,
      status: r.STATUS,
      delay_days: Number(r.DELAY_DAYS) || 0,
      risk: Number(r.DELAY_DAYS) > 5 ? 'high' : Number(r.DELAY_DAYS) > 0 ? 'medium' : 'low',
    }));

    return NextResponse.json(items);
  } catch (err) {
    console.error('supply-chain/risk error:', err);
    return NextResponse.json([], { status: 500 });
  }
}
