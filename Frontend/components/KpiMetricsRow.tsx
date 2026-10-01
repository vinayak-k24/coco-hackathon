'use client';

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
  Cpu,
} from 'lucide-react';

interface KpiMetricsRowProps {
  onCardClick: (cardId: string) => void;
}

export const KPI_DATA = [
  {
    id: 'open-alerts',
    icon: AlertOctagon,
    iconBg: 'bg-red-50 text-red-600 border-red-100',
    value: '12',
    label: 'Open Alerts',
    subtext: (
      <div className="flex items-center gap-2 text-[11px] font-medium">
        <span className="flex items-center gap-1 text-red-600">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />3 vs. last week
        </span>
      </div>
    ),
  },
  {
    id: 'plant-oee',
    icon: PieChart,
    iconBg: 'bg-teal-50 text-teal-600 border-teal-100',
    value: '92%',
    label: 'Plant OEE',
    subtext: (
      <span className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600">
        <ArrowUpRight className="w-3.5 h-3.5 shrink-0" /> 2%
      </span>
    ),
  },
  {
    id: 'breakdown-hours',
    icon: Clock,
    iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
    value: '18',
    label: 'Breakdown Hours',
    subtext: (
      <span className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600">
        <ArrowDownRight className="w-3.5 h-3.5 shrink-0" /> 32%
      </span>
    ),
  },
  {
    id: 'breakdown-cost',
    icon: DollarSign,
    iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
    value: '$284K',
    label: 'Breakdown Cost',
    subtext: (
      <span className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600">
        <ArrowDownRight className="w-3.5 h-3.5 shrink-0" /> 41%
      </span>
    ),
  },
  {
    id: 'orders-at-risk',
    icon: FileSpreadsheet,
    iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
    value: '5',
    label: 'Orders at Risk',
    subtext: (
      <span className="text-[11px] font-semibold text-rose-600">
        60%
      </span>
    ),
  },
  {
    id: 'assets-online',
    icon: Activity,
    iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    value: '96%',
    label: 'Assets Online',
    subtext: (
      <span className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600">
        <ArrowUpRight className="w-3.5 h-3.5 shrink-0" /> 1%
      </span>
    ),
  },
  {
    id: 'safety-score',
    icon: ShieldCheck,
    iconBg: 'bg-sky-50 text-sky-600 border-sky-100',
    value: '98%',
    label: 'Safety Score',
    subtext: (
      <span className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600">
        <ArrowUpRight className="w-3.5 h-3.5 shrink-0" /> 0%
      </span>
    ),
  },
  {
    id: 'energy-efficiency',
    icon: Zap,
    iconBg: 'bg-orange-50 text-orange-600 border-orange-100',
    value: '87%',
    label: 'Energy Efficiency',
    subtext: (
      <span className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600">
        <ArrowUpRight className="w-3.5 h-3.5 shrink-0" /> 3%
      </span>
    ),
  },
  {
    id: 'predicted-cost-avoidance',
    icon: TrendingUp,
    iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    value: '$1.2M',
    label: 'Predicted Cost Avoidance',
    subtext: (
      <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
        AI recommendations
      </span>
    ),
  },
];

export default function KpiMetricsRow({ onCardClick }: KpiMetricsRowProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3 mb-6">
      {KPI_DATA.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            onClick={() => onCardClick(item.id)}
            className="group bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-150 flex flex-col justify-between cursor-pointer"
          >
            {/* Top row with icon */}
            <div className="flex items-center justify-between mb-1.5">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center border ${item.iconBg}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
            </div>

            {/* Value & Label */}
            <div>
              <div className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                {item.value}
              </div>
              <div className="text-[10px] font-medium text-slate-500 mt-0.5 mb-1.5 truncate">
                {item.label}
              </div>
            </div>

            {/* Subtext */}
            <div className="pt-1.5 border-t border-slate-100 flex items-center">
              {item.subtext}
            </div>
          </div>
        );
      })}
    </div>
  );
}
