'use client';

import { Zap, Leaf, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export default function EnergyTelemetryCard() {
  const plants = [
    { name: 'Riverside', power: '1.4 MW', load: '82%', trend: '-4%', isDown: true },
    { name: 'Pune', power: '0.9 MW', load: '68%', trend: '+2%', isDown: false },
    { name: 'Munich', power: '1.1 MW', load: '74%', trend: '-6%', isDown: true },
    { name: 'Austin', power: '1.2 MW', load: '79%', trend: '-1%', isDown: true },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
            <Leaf className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 tracking-tight block">
              Energy & Sustainability
            </span>
            <span className="text-[10px] text-slate-500 font-medium">4.6 MW Total Load</span>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
          <ArrowDownRight className="w-3 h-3" /> -5.2% vs peak
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
        {plants.map((p) => (
          <div key={p.name} className="p-2 rounded-xl bg-slate-50 border border-slate-100/90 text-center">
            <span className="text-[10px] font-semibold text-slate-500 block truncate">{p.name}</span>
            <span className="font-bold text-slate-900 block text-xs mt-0.5">{p.power}</span>
            <span
              className={`text-[10px] font-semibold inline-flex items-center gap-0.5 mt-0.5 ${
                p.isDown ? 'text-emerald-600' : 'text-slate-500'
              }`}
            >
              {p.isDown ? <ArrowDownRight className="w-2.5 h-2.5" /> : <ArrowUpRight className="w-2.5 h-2.5" />}
              {p.trend}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
