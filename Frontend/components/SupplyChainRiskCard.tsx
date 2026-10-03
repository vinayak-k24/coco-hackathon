'use client';

import { Package, ChevronRight } from 'lucide-react';
import { SAMPLE_SUPPLIERS, type SupplierRisk } from '@/lib/sample-data';

interface Props { onViewAll: () => void }

const riskCfg = {
  Low: { bg: '#EAF9F2', text: '#18B276' },
  Medium: { bg: '#FFF7E8', text: '#F2A51A' },
  High: { bg: '#FFF0F1', text: '#FF4D5A' },
};

function Spark({ data, color, w = 55, h = 22 }: { data: number[]; color: string; w?: number; h?: number }) {
  if (data.length < 2) return null;
  const mn = Math.min(...data), mx = Math.max(...data), rng = mx - mn || 1;
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => `${i * step},${h - ((v - mn) / rng) * (h - 4) - 2}`).join(' ');
  return <svg width={w} height={h}><polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function SupplierCard({ s }: { s: SupplierRisk }) {
  const rc = riskCfg[s.risk];
  const sparkColor = s.risk === 'High' ? '#FF4D5A' : s.risk === 'Medium' ? '#F2A51A' : '#18B276';
  return (
    <div className="flex flex-col shrink-0" style={{ flex: '1 1 0', minWidth: 140, maxWidth: 200, border: '1px solid #E2EBF2', borderRadius: 9, padding: '8px 9px', background: '#FFF' }}>
      <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: 6, background: '#F4F8FC', border: '1px solid #E2EBF2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Package style={{ width: 14, height: 14, color: '#8495A7' }} />
        </div>
        <div className="min-w-0">
          <span style={{ fontSize: 9, fontWeight: 700, color: '#172B4D', display: 'block', lineHeight: 1.2 }} className="truncate">{s.product}</span>
          <span style={{ fontSize: 8, fontWeight: 500, color: '#8495A7' }}>{s.supplier}</span>
        </div>
      </div>
      <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
        <div>
          <span style={{ fontSize: 8, fontWeight: 500, color: '#8495A7', display: 'block' }}>Supplier Health</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#203852' }}>{s.healthPct}%</span>
        </div>
        <Spark data={s.healthHistory} color={sparkColor} />
      </div>
      <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
        <div>
          <span style={{ fontSize: 8, fontWeight: 500, color: '#8495A7', display: 'block' }}>Lead Time</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#344B63' }}>{s.leadTime}</span>
        </div>
        {s.leadTimeTrend && <span style={{ fontSize: 8, fontWeight: 600, color: '#FF4D5A' }}>{s.leadTimeTrend}</span>}
      </div>
      <div className="flex gap-3" style={{ marginBottom: 4 }}>
        <div>
          <span style={{ fontSize: 8, fontWeight: 500, color: '#8495A7', display: 'block' }}>Affected Machines</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#344B63' }}>{s.affectedMachines}</span>
        </div>
      </div>
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 8, fontWeight: 500, color: '#8495A7', display: 'block' }}>Business Exposure</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#344B63' }}>{s.businessExposure}</span>
      </div>
      <div className="mt-auto">
        <span style={{ fontSize: 8, fontWeight: 600, padding: '3px 8px', borderRadius: 8, background: rc.bg, color: rc.text, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: rc.text }} />
          {s.risk} Risk
        </span>
      </div>
    </div>
  );
}

export default function SupplyChainRiskCard({ onViewAll }: Props) {
  return (
    <div style={{ height: 278, background: '#FFF', border: '1px solid #E2EBF2', borderRadius: 11, boxShadow: '0 2px 10px rgba(23,43,77,0.05)', padding: '12px 14px', overflow: 'hidden', boxSizing: 'border-box' }}>
      <div className="flex items-center justify-between" style={{ height: 30, marginBottom: 8 }}>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center" style={{ width: 30, height: 30, borderRadius: 8, background: '#EEF6FF', border: '1px solid #DCEBFA' }}>
            <Package style={{ width: 16, height: 16, color: '#1677E8' }} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#172B4D' }}>Supply Chain Risk</span>
        </div>
        <button onClick={onViewAll} className="flex items-center gap-0.5 cursor-pointer" style={{ fontSize: 8, fontWeight: 600, color: '#1677E8' }}>View All <ChevronRight style={{ width: 10, height: 10 }} /></button>
      </div>
      <div className="flex gap-2.5" style={{ height: 218, overflow: 'hidden' }}>
        {SAMPLE_SUPPLIERS.map(s => <SupplierCard key={s.id} s={s} />)}
      </div>
    </div>
  );
}
