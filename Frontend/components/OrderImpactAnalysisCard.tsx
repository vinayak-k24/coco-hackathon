'use client';

import { useState, useEffect } from 'react';
import { LayoutGrid, ChevronRight, AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { SAMPLE_ORDERS, type OrderImpactRow } from '@/lib/sample-data';

interface Props { onSelectOrder?: (orderId: string) => void }

const statusCfg: Record<string, { bg: string; text: string; Icon: React.ComponentType<{ style?: React.CSSProperties }> }> = {
  'At Risk': { bg: '#FFF0F1', text: '#FF4D5A', Icon: AlertCircle },
  'Watch': { bg: '#FFF7E8', text: '#B45309', Icon: AlertTriangle },
  'On Track': { bg: '#EAF9F2', text: '#18B276', Icon: CheckCircle2 },
};

export default function OrderImpactAnalysisCard({ onSelectOrder }: Props) {
  const [orders, setOrders] = useState<OrderImpactRow[]>([]);

  useEffect(() => {
    fetchApi<Record<string, string>[]>('/api/orders', []).then(data => {
      if (data.length > 0) {
        setOrders(data.slice(0, 5).map(d => ({
          customer: d.customer || '',
          logo: (d.customer || 'X')[0],
          orderId: d.orderId || '',
          product: d.product || '',
          commitment: d.commitment || '',
          status: (d.status as OrderImpactRow['status']) || 'On Track',
          revenueExposure: d.revenueExposure || '$0',
        })));
      } else {
        setOrders(SAMPLE_ORDERS);
      }
    });
  }, []);

  const rows = orders.length > 0 ? orders : SAMPLE_ORDERS;

  return (
    <div style={{ height: 278, background: '#FFF', border: '1px solid #E2EBF2', borderRadius: 11, boxShadow: '0 2px 10px rgba(23,43,77,0.05)', padding: '12px 14px', overflow: 'hidden', boxSizing: 'border-box' }}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ height: 30, marginBottom: 8 }}>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center" style={{ width: 30, height: 30, borderRadius: 8, background: '#EEF6FF', border: '1px solid #DCEBFA' }}>
            <LayoutGrid style={{ width: 16, height: 16, color: '#1677E8' }} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#172B4D' }}>Order Impact</span>
        </div>
        <button className="flex items-center gap-0.5 cursor-pointer" style={{ fontSize: 8, fontWeight: 600, color: '#1677E8' }}>View All <ChevronRight style={{ width: 10, height: 10 }} /></button>
      </div>

      {/* Table */}
      <table className="w-full" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Customer / Order', 'Product', 'Commitment', 'Status', 'Revenue Exposure'].map(h => (
              <th key={h} style={{ fontSize: 8, fontWeight: 600, color: '#8495A7', textAlign: 'left', padding: '0 4px 6px', borderBottom: '1px solid #E7EEF4', whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(o => {
            const sc = statusCfg[o.status] || statusCfg['On Track'];
            const StatusIcon = sc.Icon;
            return (
              <tr key={o.orderId} onClick={() => onSelectOrder?.(o.orderId)} className="cursor-pointer hover:bg-[#F8FBFE]" style={{ borderBottom: '1px solid #F0F4F8' }}>
                <td style={{ padding: '6px 4px' }}>
                  <div className="flex items-center gap-2">
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#F0F4F8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#52677D', flexShrink: 0 }}>{o.logo}</div>
                    <div>
                      <span style={{ fontSize: 9, fontWeight: 700, color: '#172B4D', display: 'block', lineHeight: 1.2 }}>{o.customer}</span>
                      <span style={{ fontSize: 7, fontWeight: 500, color: '#8495A7' }}>{o.orderId}</span>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '6px 4px', fontSize: 9, fontWeight: 500, color: '#52677D' }}>{o.product}</td>
                <td style={{ padding: '6px 4px', fontSize: 8, fontWeight: 500, color: '#8495A7' }}>{o.commitment}</td>
                <td style={{ padding: '6px 4px' }}>
                  <span style={{ fontSize: 8, fontWeight: 600, padding: '2px 7px', borderRadius: 10, background: sc.bg, color: sc.text, display: 'inline-flex', alignItems: 'center', gap: 3, whiteSpace: 'nowrap' }}>
                    <StatusIcon style={{ width: 9, height: 9 }} />{o.status}
                  </span>
                </td>
                <td style={{ padding: '6px 4px', fontSize: 10, fontWeight: 700, color: '#172B4D', textAlign: 'right' }}>{o.revenueExposure}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
