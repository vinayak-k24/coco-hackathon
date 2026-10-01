'use client';

import { useState, useEffect } from 'react';
import {
  AlertOctagon,
  PieChart,
  Clock,
  DollarSign,
  FileSpreadsheet,
  Activity,
  TrendingUp,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { fetchApi, formatINR } from '@/lib/api';

interface KpiMetricsRowProps {
  onCardClick: (cardId: string) => void;
}

interface KpiData {
  alerts_active: number;
  oee_avg: number;
  breakdown_hours: number;
  breakdown_cost_inr: number;
  orders_at_risk: number;
  assets_online_pct: number;
  safety_score: number;
  energy_efficiency: number;
  predicted_cost_avoidance_inr: number;
}

const ICON_CONFIG = [
  { id: 'open-alerts', icon: AlertOctagon, iconBg: 'bg-red-50 text-red-600 border-red-100', label: 'Open Alerts', key: 'alerts_active' as const },
  { id: 'plant-oee', icon: PieChart, iconBg: 'bg-teal-50 text-teal-600 border-teal-100', label: 'Plant OEE', key: 'oee_avg' as const, suffix: '%' },
  { id: 'breakdown-hours', icon: Clock, iconBg: 'bg-blue-50 text-blue-600 border-blue-100', label: 'Breakdown Hours', key: 'breakdown_hours' as const },
  { id: 'breakdown-cost', icon: DollarSign, iconBg: 'bg-purple-50 text-purple-600 border-purple-100', label: 'Breakdown Cost', key: 'breakdown_cost_inr' as const, isINR: true },
  { id: 'orders-at-risk', icon: FileSpreadsheet, iconBg: 'bg-amber-50 text-amber-600 border-amber-100', label: 'Orders at Risk', key: 'orders_at_risk' as const },
  { id: 'assets-online', icon: Activity, iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100', label: 'Assets Online', key: 'assets_online_pct' as const, suffix: '%' },
  { id: 'safety-score', icon: ShieldCheck, iconBg: 'bg-sky-50 text-sky-600 border-sky-100', label: 'Safety Score', key: 'safety_score' as const, suffix: '%' },
  { id: 'energy-efficiency', icon: Zap, iconBg: 'bg-orange-50 text-orange-600 border-orange-100', label: 'Energy Efficiency', key: 'energy_efficiency' as const, suffix: '%' },
  { id: 'predicted-cost-avoidance', icon: TrendingUp, iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100', label: 'Predicted Cost Avoidance', key: 'predicted_cost_avoidance_inr' as const, isINR: true },
];

export default function KpiMetricsRow({ onCardClick }: KpiMetricsRowProps) {
  const [kpis, setKpis] = useState<KpiData | null>(null);

  useEffect(() => {
    const fallback: KpiData = { alerts_active: 0, oee_avg: 0, breakdown_hours: 0, breakdown_cost_inr: 0, orders_at_risk: 0, assets_online_pct: 0, safety_score: 0, energy_efficiency: 0, predicted_cost_avoidance_inr: 0 };
    const load = () => fetchApi<KpiData>('/api/kpis', fallback).then(setKpis);
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3 mb-6">
      {ICON_CONFIG.map((item) => {
        const Icon = item.icon;
        const raw = kpis ? kpis[item.key] : 0;
        const value = item.isINR ? formatINR(raw) : item.suffix ? `${raw}${item.suffix}` : `${raw}`;

        return (
          <div
            key={item.id}
            onClick={() => onCardClick(item.id)}
            className="group bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-150 flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${item.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <div className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                {kpis ? value : '—'}
              </div>
              <div className="text-[10px] font-medium text-slate-500 mt-0.5 mb-1.5 truncate">
                {item.label}
              </div>
            </div>
            <div className="pt-1.5 border-t border-slate-100 flex items-center">
              <span className="flex items-center gap-0.5 text-[11px] font-semibold text-slate-400">
                {kpis ? 'Live' : 'Loading...'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
