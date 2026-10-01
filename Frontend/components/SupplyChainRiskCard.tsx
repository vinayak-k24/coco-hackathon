'use client';

import { useState, useEffect } from 'react';
import { Cpu, Layers, Disc3, Settings2, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface SupplyChainRiskItem {
  name: string;
  sub: string;
  supplierHealth: number;
  leadTime: string;
  leadTimeChange: string;
  affectedMachines: number;
  businessExposure: string;
  risk: string;
}

interface SupplyChainRiskCardProps {
  onViewAll: () => void;
}

export default function SupplyChainRiskCard({ onViewAll }: SupplyChainRiskCardProps) {
  const [items, setItems] = useState<SupplyChainRiskItem[]>([]);

  useEffect(() => {
    const load = () => fetchApi<SupplyChainRiskItem[]>('/api/supply-chain/risk', []).then(setItems);
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  const iconForIndex = [Settings2, Disc3, Cpu, Layers];
  const iconClassForRisk: Record<string, string> = {
    'High Risk': 'bg-rose-50 text-rose-600 border-rose-100',
    'Medium Risk': 'bg-amber-50 text-amber-600 border-amber-100',
    'Low Risk': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'Critical': 'bg-red-50 text-red-600 border-red-100',
  };
  const badgeClassForRisk: Record<string, string> = {
    'High Risk': 'bg-rose-50 text-rose-700 border-rose-200/60',
    'Medium Risk': 'bg-amber-50 text-amber-700 border-amber-200/60',
    'Low Risk': 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    'Critical': 'bg-red-50 text-red-700 border-red-200/60',
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">Supply Chain Risk</h2>
        </div>
        <button onClick={onViewAll} className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">View All →</button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((item, idx) => {
          const Icon = iconForIndex[idx % iconForIndex.length];
          const healthColor = item.supplierHealth >= 85 ? 'text-emerald-600' : item.supplierHealth >= 70 ? 'text-amber-600' : 'text-red-600';
          const barColor = item.supplierHealth >= 85 ? 'bg-emerald-500' : item.supplierHealth >= 70 ? 'bg-amber-500' : 'bg-red-500';
          return (
            <div key={idx} className="rounded-xl border border-slate-200/90 p-3 hover:shadow-sm transition-all cursor-pointer bg-gradient-to-b from-white to-slate-50/30">
              <div className="flex items-start gap-2 mb-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${iconClassForRisk[item.risk] || 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                  <p className="text-[10px] text-slate-500">{item.sub}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-slate-400">Supplier Health</span>
                <span className={`text-xs font-bold ${healthColor}`}>{item.supplierHealth}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mb-2.5 overflow-hidden">
                <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${item.supplierHealth}%` }} />
              </div>
              <div className="space-y-1.5 text-[10px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Lead Time</span>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-slate-700">{item.leadTime}</span>
                    {item.leadTimeChange && <span className="font-bold text-red-600">{item.leadTimeChange}</span>}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Affected Machines</span>
                  <span className="font-semibold text-slate-700">{item.affectedMachines}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Business Exposure</span>
                  <span className="font-bold text-slate-900">{item.businessExposure}</span>
                </div>
              </div>
              <div className="mt-2.5">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border block text-center ${badgeClassForRisk[item.risk] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>{item.risk}</span>
              </div>
            </div>
          );
        })}
        {items.length === 0 && <p className="text-xs text-slate-400 col-span-4 text-center py-4">Loading supply chain data...</p>}
      </div>
    </div>
  );
}
