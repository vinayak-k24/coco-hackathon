'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';

interface TechnicianAvailabilityCardProps {
  onManageWorkforce: () => void;
}

interface TechData {
  available_pct: number;
  available: number;
  in_progress: number;
  in_training: number;
  unavailable: number;
  total: number;
}

export default function TechnicianAvailabilityCard({ onManageWorkforce }: TechnicianAvailabilityCardProps) {
  const [data, setData] = useState<TechData | null>(null);

  useEffect(() => {
    const load = () => fetchApi<TechData>('/api/technicians', { available: 0, in_progress: 0, in_training: 0, unavailable: 0, total: 0 } as TechData).then(setData);
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  const d = data;
  const total = d?.total ?? 0;
  const availablePercent = total > 0 ? Math.round((d?.available ?? 0) / total * 100) : 0;
  const radius = 42;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const availableDash = (availablePercent / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
      <div>
        <h2 className="text-sm font-bold text-slate-900 tracking-tight">Technician Availability</h2>
        <p className="text-xs text-slate-500 mt-0.5">Workforce status across shifts.</p>
      </div>
      <div className="flex items-center justify-between gap-4 my-3">
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#f1f5f9" strokeWidth={strokeWidth} />
            <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#ef4444" strokeWidth={strokeWidth} strokeDasharray={`${circumference * 0.06} ${circumference}`} strokeDashoffset={0} strokeLinecap="round" />
            <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#d97706" strokeWidth={strokeWidth} strokeDasharray={`${circumference * 0.08} ${circumference}`} strokeDashoffset={circumference * -0.06} strokeLinecap="round" />
            <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#0ea5e9" strokeWidth={strokeWidth} strokeDasharray={`${availableDash} ${circumference}`} strokeDashoffset={circumference * -0.15} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-lg font-extrabold text-slate-900 leading-tight">{d ? `${availablePercent}%` : '—'}</span>
            <span className="text-[9px] font-medium text-slate-400 leading-tight">Available</span>
          </div>
        </div>
        <div className="flex-1 space-y-1.5 text-xs">
          <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-slate-600"><span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" /><strong className="text-slate-900">{d?.available ?? '—'}</strong> Available</span></div>
          <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-slate-600"><span className="w-2 h-2 rounded-full bg-yellow-400 shrink-0" /><strong className="text-slate-900">{d?.in_progress ?? '—'}</strong> In progress</span></div>
          <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-slate-600"><span className="w-2 h-2 rounded-full bg-amber-700 shrink-0" /><strong className="text-slate-900">{d?.in_training ?? '—'}</strong> In training</span></div>
          <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-slate-600"><span className="w-2 h-2 rounded-full bg-red-500 shrink-0" /><strong className="text-slate-900">{d?.unavailable ?? '—'}</strong> Unavailable</span></div>
        </div>
      </div>
      <button onClick={onManageWorkforce} className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-blue-600 transition-colors text-center cursor-pointer shadow-2xs">Manage workforce</button>
    </div>
  );
}
