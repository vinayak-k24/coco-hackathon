'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';

interface MaintenanceReadinessCardProps {
  onViewPlan: () => void;
}

interface ReadinessData {
  healthy_pct: number;
  due_today: number;
  this_week: number;
  next_week: number;
  on_track: number;
}

export default function MaintenanceReadinessCard({ onViewPlan }: MaintenanceReadinessCardProps) {
  const [data, setData] = useState<ReadinessData | null>(null);

  useEffect(() => {
    const load = () => fetchApi<ReadinessData>('/api/maintenance/readiness', { healthy_pct: 0, due_today: 0, this_week: 0, next_week: 0, on_track: 0 } as ReadinessData).then(setData);
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  const d = data;
  const healthyPercent = d?.healthy_pct ?? 0;
  const radius = 42;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const healthyDash = (healthyPercent / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
      <div>
        <h2 className="text-sm font-bold text-slate-900 tracking-tight">Maintenance Readiness</h2>
        <p className="text-xs text-slate-500 mt-0.5">Asset health and upcoming work.</p>
      </div>
      <div className="flex items-center justify-between gap-4 my-3">
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#f1f5f9" strokeWidth={strokeWidth} />
            <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#f59e0b" strokeWidth={strokeWidth} strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={circumference * 0.03} strokeLinecap="round" />
            <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#ef4444" strokeWidth={strokeWidth} strokeDasharray={`${circumference * 0.05} ${circumference}`} strokeDashoffset={0} strokeLinecap="round" />
            <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#0d9488" strokeWidth={strokeWidth} strokeDasharray={`${healthyDash} ${circumference}`} strokeDashoffset={circumference * -0.06} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-lg font-extrabold text-slate-900 leading-tight">{d ? `${healthyPercent}%` : '—'}</span>
            <span className="text-[9px] font-medium text-slate-400 leading-tight">Assets healthy</span>
          </div>
        </div>
        <div className="flex-1 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2 h-2 rounded-full bg-red-500 shrink-0" /><strong className="text-slate-900">{d?.due_today ?? '—'}</strong> Due today</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" /><strong className="text-slate-900">{d?.this_week ?? '—'}</strong> This week</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2 h-2 rounded-full bg-yellow-400 shrink-0" /><strong className="text-slate-900">{d?.next_week ?? '—'}</strong> Next week</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" /><strong className="text-slate-900">{d?.on_track ?? '—'}</strong> On track</span>
          </div>
        </div>
      </div>
      <button onClick={onViewPlan} className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-blue-600 transition-colors text-center cursor-pointer shadow-2xs">View maintenance plan</button>
    </div>
  );
}
