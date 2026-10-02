'use client';

import { Wrench, ChevronRight, Users as UsersIcon, ClipboardList, Target, Package } from 'lucide-react';
import { SAMPLE_MAINTENANCE_SEGMENTS, SAMPLE_MAINTENANCE_MINIS } from '@/lib/sample-data';

interface Props { onViewPlan: () => void }

function Donut({ segments, size, stroke, centerVal, centerLabel }: { segments: { pct: number; color: string }[]; size: number; stroke: number; centerVal: string; centerLabel: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const gap = 2;
  let offset = 0;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EDF1F5" strokeWidth={stroke} />
        {segments.map((s, i) => {
          const dash = Math.max(0, (s.pct / 100) * c - gap);
          const el = <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${dash} ${c - dash}`} strokeDashoffset={-offset} />;
          offset += (s.pct / 100) * c;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span style={{ fontSize: 21, fontWeight: 700, color: '#172B4D', lineHeight: 1 }}>{centerVal}</span>
        <span style={{ fontSize: 8, fontWeight: 500, color: '#8495A7', marginTop: 2, textAlign: 'center' }}>{centerLabel}</span>
      </div>
    </div>
  );
}

const ICONS: Record<string, React.ComponentType<{ style?: React.CSSProperties }>> = {
  users: UsersIcon, clipboard: ClipboardList, target: Target, package: Package,
};

export default function MaintenanceReadinessCard({ onViewPlan }: Props) {
  const segs = SAMPLE_MAINTENANCE_SEGMENTS;
  const minis = SAMPLE_MAINTENANCE_MINIS;
  return (
    <div style={{ height: 260, background: '#FFF', border: '1px solid #E2EBF2', borderRadius: 11, boxShadow: '0 2px 10px rgba(23,43,77,0.05)', padding: '12px 14px', overflow: 'hidden', boxSizing: 'border-box' }}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ height: 30, marginBottom: 6 }}>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center" style={{ width: 30, height: 30, borderRadius: 8, background: '#EEF6FF', border: '1px solid #DCEBFA' }}>
            <Wrench style={{ width: 16, height: 16, color: '#1677E8' }} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#172B4D' }}>Maintenance Readiness</span>
        </div>
        <button onClick={onViewPlan} className="flex items-center gap-0.5 cursor-pointer" style={{ fontSize: 8, fontWeight: 600, color: '#1677E8' }}>View Details <ChevronRight style={{ width: 10, height: 10 }} /></button>
      </div>

      {/* Donut + Legend */}
      <div className="flex items-center gap-3" style={{ height: 118 }}>
        <Donut segments={segs.map(s => ({ pct: s.pct, color: s.color }))} size={110} stroke={12} centerVal="94%" centerLabel="Asset Readiness" />
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          {segs.map(s => (
            <div key={s.label} className="flex items-center gap-1.5" style={{ height: 18 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
              <span style={{ fontSize: 9, fontWeight: 500, color: '#52677D', flex: 1, minWidth: 0 }}>{s.label}</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: '#203852', width: 32, textAlign: 'right' }}>{s.pct}%</span>
              <span style={{ fontSize: 8, fontWeight: 500, color: '#8495A7', width: 28, textAlign: 'right' }}>{s.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mini metrics */}
      <div className="grid grid-cols-4 gap-1.5" style={{ marginTop: 8 }}>
        {minis.map(m => {
          const Ic = ICONS[m.icon] || Package;
          return (
            <div key={m.label} style={{ border: '1px solid #E2EBF2', borderRadius: 7, padding: '5px 6px' }}>
              <div className="flex items-center gap-1 mb-0.5">
                <Ic style={{ width: 13, height: 13, color: '#8495A7' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#172B4D' }}>{m.value}</span>
              </div>
              <span style={{ fontSize: 7, fontWeight: 500, color: '#8495A7', display: 'block' }}>{m.label}</span>
              <span style={{ fontSize: 7, fontWeight: 600, color: m.subColor || '#8495A7' }}>{m.sub}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
