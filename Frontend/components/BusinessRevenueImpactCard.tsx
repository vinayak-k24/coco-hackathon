'use client';

import { useState, useEffect } from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface RevenueData {
  revenue_at_risk: string;
  revenue_trend: string;
  delivery_risk_pct: string;
  delivery_trend: string;
  chart_data: { date: string; value: number }[];
}

interface BusinessRevenueImpactCardProps {
  onViewFinance?: () => void;
}

export default function BusinessRevenueImpactCard({ onViewFinance }: BusinessRevenueImpactCardProps = {}) {
  const [range, setRange] = useState('This Month');
  const [data, setData] = useState<RevenueData | null>(null);

  useEffect(() => {
    const load = () => fetchApi<RevenueData>('/api/revenue-impact', { revenue_at_risk: '₹0', revenue_trend: '0%', delivery_risk_pct: '0%', delivery_trend: '0%', chart_data: [] }).then(setData);
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  const d = data;
  const chartPoints = d?.chart_data ?? [];

  // Build SVG path from chart data
  const buildPath = () => {
    if (chartPoints.length < 2) return { pathD: '', areaD: '' };
    const maxVal = Math.max(...chartPoints.map(c => c.value), 1);
    const pts = chartPoints.map((c, i) => {
      const x = 10 + (i / (chartPoints.length - 1)) * 280;
      const y = 90 - (c.value / maxVal) * 70;
      return { x, y };
    });
    const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaD = pathD + ` L ${pts[pts.length - 1].x} 95 L ${pts[0].x} 95 Z`;
    return { pathD, areaD };
  };
  const { pathD, areaD } = buildPath();

  const formatDate = (s: string) => {
    try { return new Date(s).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }); } catch { return s; }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {onViewFinance && <button onClick={onViewFinance} className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer">ROI Center →</button>}
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">Business & Revenue Impact</h2>
        </div>
        <div className="relative">
          <select value={range} onChange={(e) => setRange(e.target.value)} className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 rounded-lg pl-2.5 pr-6 py-1 cursor-pointer focus:outline-none">
            <option value="This Month">This Month</option>
            <option value="Last Quarter">Last Quarter</option>
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 py-1 mb-2">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-extrabold text-slate-900 tracking-tight">{d?.revenue_at_risk ?? '—'}</span>
          </div>
          <span className="text-[11px] text-slate-400">Revenue (at risk)</span>
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-extrabold text-slate-900 tracking-tight">{d?.delivery_risk_pct ?? '—'}</span>
          </div>
          <span className="text-[11px] text-slate-400">On-time delivery risk</span>
        </div>
      </div>
      <div className="relative w-full h-[105px]">
        <div className="ml-8 h-[80px] relative">
          {pathD && (
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
              <defs><linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" /><stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" /></linearGradient></defs>
              <path d={areaD} fill="url(#revenueGradient)" />
              <path d={pathD} fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          )}
        </div>
        <div className="ml-8 flex justify-between text-[9px] font-medium text-slate-400 pt-1">
          {chartPoints.length > 0 ? (
            <>
              <span>{formatDate(chartPoints[0].date)}</span>
              {chartPoints.length > 2 && <span>{formatDate(chartPoints[Math.floor(chartPoints.length / 2)].date)}</span>}
              <span>{formatDate(chartPoints[chartPoints.length - 1].date)}</span>
            </>
          ) : <span>Loading...</span>}
        </div>
      </div>
    </div>
  );
}
