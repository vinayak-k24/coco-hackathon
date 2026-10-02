'use client';

import { Users, ChevronRight } from 'lucide-react';
import { SAMPLE_WORKFORCE_SEGMENTS, SAMPLE_WORKFORCE_BLOCKS } from '@/lib/sample-data';

interface Props { onManageWorkforce: () => void }

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
        <span style={{ fontSize: 7, fontWeight: 500, color: '#8495A7', marginTop: 2, textAlign: 'center', lineHeight: 1.1, maxWidth: 55 }}>{centerLabel}</span>
      </div>
    </div>
  );
}

const AVATAR_COLORS = ['#1677E8', '#18B276', '#7657E8', '#F2A51A', '#FF4D5A'];

export default function WorkforceReadinessCard({ onManageWorkforce }: Props) {
  const segs = SAMPLE_WORKFORCE_SEGMENTS;
  const blocks = SAMPLE_WORKFORCE_BLOCKS;
  return (
    <div style={{ height: 260, background: '#FFF', border: '1px solid #E2EBF2', borderRadius: 11, boxShadow: '0 2px 10px rgba(23,43,77,0.05)', padding: '12px 14px', overflow: 'hidden', boxSizing: 'border-box' }}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ height: 30, marginBottom: 6 }}>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center" style={{ width: 30, height: 30, borderRadius: 8, background: '#EEF6FF', border: '1px solid #DCEBFA' }}>
            <Users style={{ width: 16, height: 16, color: '#1677E8' }} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#172B4D' }}>Workforce Readiness</span>
        </div>
        <button onClick={onManageWorkforce} className="flex items-center gap-0.5 cursor-pointer" style={{ fontSize: 8, fontWeight: 600, color: '#1677E8' }}>View Details <ChevronRight style={{ width: 10, height: 10 }} /></button>
      </div>

      {/* Donut + Legend */}
      <div className="flex items-center gap-3" style={{ height: 118 }}>
        <Donut segments={segs.map(s => ({ pct: s.pct, color: s.color }))} size={110} stroke={12} centerVal="89%" centerLabel="Workforce Readiness" />
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

      {/* Bottom info blocks */}
      <div className="grid grid-cols-4 gap-1.5" style={{ marginTop: 8 }}>
        {blocks.map((b, bi) => (
          <div key={b.title} style={{ border: '1px solid #E2EBF2', borderRadius: 7, padding: '4px 6px' }}>
            <span style={{ fontSize: 7, fontWeight: 600, color: '#8495A7', display: 'block', lineHeight: 1.2 }}>{b.title}</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: b.valueColor || '#172B4D', display: 'block', lineHeight: 1.3, marginTop: 1 }}>{b.value}</span>
            {b.hasAvatars && (
              <div className="flex items-center" style={{ marginTop: 3 }}>
                {AVATAR_COLORS.slice(0, 3).map((c, ai) => (
                  <div key={ai} style={{ width: 18, height: 18, borderRadius: '50%', background: c, border: '2px solid #FFF', marginLeft: ai > 0 ? -5 : 0, fontSize: 7, fontWeight: 600, color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 3 - ai }}>{String.fromCharCode(65 + bi * 3 + ai)}</div>
                ))}
                {b.avatarExtra && <span style={{ fontSize: 7, fontWeight: 600, color: '#8495A7', marginLeft: 2 }}>{b.avatarExtra}</span>}
              </div>
            )}
            {b.hasProgress && (
              <div style={{ height: 4, borderRadius: 999, background: '#E7EEF4', marginTop: 4 }}>
                <div style={{ width: `${b.progressPct || 0}%`, height: '100%', borderRadius: 999, background: '#18B276' }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
