'use client';

import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { SAMPLE_PRODUCTION, SAMPLE_PRODUCTION_EVENTS } from '@/lib/sample-data';

const TIME_RANGES = ['7D', '30D', '90D', '12M'] as const;
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function ProductionPerformanceChart() {
  const [range, setRange] = useState<string>('30D');
  const data = SAMPLE_PRODUCTION;
  const events = SAMPLE_PRODUCTION_EVENTS;

  const todayIdx = data.findIndex(d => d.actual === 0) - 1;
  const maxVal = Math.max(...data.map(d => Math.max(d.actual, d.planned, d.forecast ?? 0)), 1);

  // Chart geometry
  const chartW = 580;
  const chartH = 150;
  const yAxisW = 36;
  const xAxisH = 16;
  const plotX = yAxisW;
  const plotY = 4;
  const plotW = chartW - yAxisW - 4;
  const plotH = chartH - xAxisH - plotY;
  const n = data.length;
  const step = plotW / n;
  const barW = Math.max(4, step * 0.38);
  const yTicks = [0, 50000, 100000, 150000];

  const forecastPts = data.map((d, i) => {
    if (!d.forecast) return null;
    const x = plotX + i * step + step / 2;
    const y = plotY + plotH - (d.forecast / maxVal) * plotH;
    return { x, y };
  }).filter(Boolean) as { x: number; y: number }[];

  const fmtY = (v: number) => v === 0 ? '0' : `${v / 1000}K`;
  const fmtDate = (ds: string) => {
    const d = new Date(ds);
    return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
  };

  return (
    <div style={{ height: 260, background: '#FFF', border: '1px solid #E2EBF2', borderRadius: 11, boxShadow: '0 2px 10px rgba(23,43,77,0.05)', padding: '12px 14px', overflow: 'hidden', boxSizing: 'border-box' }}>
      {/* Header 30px */}
      <div className="flex items-center justify-between" style={{ height: 30, marginBottom: 6 }}>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center" style={{ width: 30, height: 30, borderRadius: 8, background: '#EEF6FF', border: '1px solid #DCEBFA' }}>
            <BarChart3 style={{ width: 16, height: 16, color: '#1677E8' }} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#172B4D' }}>Production Performance</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span style={{ fontSize: 9, fontWeight: 600, color: '#52677D', padding: '4px 8px', border: '1px solid #E2EBF2', borderRadius: 7, height: 28, display: 'inline-flex', alignItems: 'center' }}>All Factories ▾</span>
          <div className="flex" style={{ border: '1px solid #E2EBF2', borderRadius: 7, overflow: 'hidden', height: 28 }}>
            {TIME_RANGES.map(t => (
              <button key={t} onClick={() => setRange(t)} className="cursor-pointer" style={{ fontSize: 8, fontWeight: 600, padding: '0 7px', background: range === t ? '#EEF6FF' : '#FFF', color: range === t ? '#1677E8' : '#8495A7', border: 'none', height: 28 }}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Legend 14px */}
      <div className="flex items-center gap-4" style={{ height: 14, marginBottom: 4 }}>
        {[{ l: 'Actual Production', c: '#1677E8' }, { l: 'Planned Production', c: '#C8D4E0' }, { l: 'AI Forecast', c: '#7657E8' }].map(i => (
          <div key={i.l} className="flex items-center gap-1">
            <span style={{ width: 7, height: 7, borderRadius: 2, background: i.c, display: 'inline-block' }} />
            <span style={{ fontSize: 8, fontWeight: 500, color: '#52677D' }}>{i.l}</span>
          </div>
        ))}
      </div>

      {/* Chart 150px */}
      <div style={{ height: 150, overflow: 'hidden' }}>
        <svg viewBox={`0 0 ${chartW} ${chartH}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
          {/* Grid lines */}
          {yTicks.map(v => {
            const y = plotY + plotH - (v / maxVal) * plotH;
            return <line key={v} x1={plotX} y1={y} x2={chartW - 4} y2={y} stroke="#E7EEF4" strokeWidth={0.5} />;
          })}
          {/* Y labels */}
          {yTicks.map(v => {
            const y = plotY + plotH - (v / maxVal) * plotH;
            return <text key={`y${v}`} x={yAxisW - 4} y={y + 3} textAnchor="end" style={{ fontSize: 8, fill: '#8495A7', fontWeight: 500 }}>{fmtY(v)}</text>;
          })}

          {/* Planned bars */}
          {data.map((d, i) => {
            const x = plotX + i * step + (step - barW * 2.2) / 2;
            const h = (d.planned / maxVal) * plotH;
            return <rect key={`pl${i}`} x={x} y={plotY + plotH - h} width={barW} height={h} rx={2} fill="#D5DFE9" />;
          })}

          {/* Actual bars */}
          {data.map((d, i) => {
            if (!d.actual) return null;
            const x = plotX + i * step + (step - barW * 2.2) / 2 + barW + 1;
            const h = (d.actual / maxVal) * plotH;
            return <rect key={`ac${i}`} x={x} y={plotY + plotH - h} width={barW} height={h} rx={2} fill="#1677E8" />;
          })}

          {/* Forecast line */}
          {forecastPts.length > 1 && (
            <polyline points={forecastPts.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#7657E8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          )}
          {forecastPts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={3} fill="#7657E8" />)}

          {/* Today marker */}
          {todayIdx >= 0 && (() => {
            const x = plotX + todayIdx * step + step;
            return (
              <>
                <line x1={x} y1={plotY} x2={x} y2={plotY + plotH} stroke="#1677E8" strokeWidth={1} strokeDasharray="4,4" />
                <text x={x} y={plotY - 2} textAnchor="middle" style={{ fontSize: 9, fill: '#1677E8', fontWeight: 600 }}>Today</text>
              </>
            );
          })()}

          {/* X labels */}
          {data.map((d, i) => {
            if (i % 5 !== 0) return null;
            const x = plotX + i * step + step / 2;
            return <text key={`xl${i}`} x={x} y={chartH - 2} textAnchor="middle" style={{ fontSize: 8, fill: '#8495A7', fontWeight: 500 }}>{fmtDate(d.date)}</text>;
          })}

          {/* Annotations */}
          {events.map((ev, idx) => {
            if (ev.dateIndex >= data.length) return null;
            const x = plotX + ev.dateIndex * step + step / 2;
            const baseY = plotY + plotH - (data[ev.dateIndex]?.actual || data[ev.dateIndex]?.planned || 70000) / maxVal * plotH;
            const y = Math.max(plotY + 14, baseY - 28);
            const bgColor = ev.type === 'maintenance' ? '#FFF0F1' : ev.type === 'demand' ? '#EAF9F2' : '#F3EEFF';
            const dotColor = ev.type === 'maintenance' ? '#FF4D5A' : ev.type === 'demand' ? '#18B276' : '#7657E8';
            return (
              <g key={idx}>
                <line x1={x} y1={baseY} x2={x} y2={y + 14} stroke={dotColor} strokeWidth={0.5} strokeDasharray="2,2" />
                <circle cx={x} cy={baseY} r={3} fill={dotColor} />
                <rect x={x - 36} y={y - 6} width={72} height={ev.value ? 28 : 20} rx={5} fill={bgColor} stroke="#E2EBF2" strokeWidth={0.5} />
                <text x={x} y={y + 5} textAnchor="middle" style={{ fontSize: 7, fill: '#172B4D', fontWeight: 600 }}>{ev.title.replace('\n', ' ')}</text>
                {ev.value && <text x={x} y={y + 15} textAnchor="middle" style={{ fontSize: 8, fill: dotColor, fontWeight: 700 }}>{ev.value}</text>}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
