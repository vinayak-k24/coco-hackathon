'use client';

import { Cpu, Layers, Disc3, Settings2, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

interface SupplyChainRiskCardProps {
  onViewAll: () => void;
}

export default function SupplyChainRiskCard({ onViewAll }: SupplyChainRiskCardProps) {
  const items = [
    {
      name: 'Servo Motor Controller',
      sub: 'Siemens',
      supplierHealth: 92,
      supplierHealthColor: 'text-emerald-600',
      supplierHealthBg: 'bg-emerald-50',
      leadTime: '6 weeks',
      leadTimeChange: '▲ 2 weeks',
      leadTimeChangeColor: 'text-red-600',
      affectedMachines: 12,
      businessExposure: '$420K',
      risk: 'Medium Risk',
      riskBadgeClass: 'bg-amber-50 text-amber-700 border-amber-200/60',
      icon: Settings2,
      iconClass: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      name: 'Hydraulic Pump',
      sub: 'Bosch Rexroth',
      supplierHealth: 78,
      supplierHealthColor: 'text-amber-600',
      supplierHealthBg: 'bg-amber-50',
      leadTime: '10 weeks',
      leadTimeChange: '▲ 4 weeks',
      leadTimeChangeColor: 'text-red-600',
      affectedMachines: 8,
      businessExposure: '$680K',
      risk: 'High Risk',
      riskBadgeClass: 'bg-rose-50 text-rose-700 border-rose-200/60',
      icon: Disc3,
      iconClass: 'bg-amber-50 text-amber-600 border-amber-100',
    },
    {
      name: 'PLC Module',
      sub: 'Rockwell Automation',
      supplierHealth: 89,
      supplierHealthColor: 'text-emerald-600',
      supplierHealthBg: 'bg-emerald-50',
      leadTime: '4 weeks',
      leadTimeChange: '',
      leadTimeChangeColor: '',
      affectedMachines: 10,
      businessExposure: '$220K',
      risk: 'Low Risk',
      riskBadgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      icon: Cpu,
      iconClass: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      name: 'Ball Bearing 6200',
      sub: 'SKF',
      supplierHealth: 68,
      supplierHealthColor: 'text-red-600',
      supplierHealthBg: 'bg-red-50',
      leadTime: '5 weeks',
      leadTimeChange: '▲ 1 week',
      leadTimeChangeColor: 'text-red-600',
      affectedMachines: 14,
      businessExposure: '$1.1M',
      risk: 'High Risk',
      riskBadgeClass: 'bg-rose-50 text-rose-700 border-rose-200/60',
      icon: Layers,
      iconClass: 'bg-rose-50 text-rose-600 border-rose-100',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Supply Chain Risk</h2>
          </div>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
        >
          View All →
        </button>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="rounded-xl border border-slate-200/90 p-3 hover:shadow-sm transition-all cursor-pointer bg-gradient-to-b from-white to-slate-50/30"
            >
              {/* Icon + Name */}
              <div className="flex items-start gap-2 mb-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${item.iconClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                  <p className="text-[10px] text-slate-500">{item.sub}</p>
                </div>
              </div>

              {/* Supplier Health */}
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-slate-400">Supplier Health</span>
                <span className={`text-xs font-bold ${item.supplierHealthColor}`}>{item.supplierHealth}%</span>
              </div>

              {/* Health bar */}
              <div className="w-full h-1.5 bg-slate-100 rounded-full mb-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    item.supplierHealth >= 85 ? 'bg-emerald-500' :
                    item.supplierHealth >= 70 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${item.supplierHealth}%` }}
                />
              </div>

              {/* Stats */}
              <div className="space-y-1.5 text-[10px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Lead Time</span>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-slate-700">{item.leadTime}</span>
                    {item.leadTimeChange && (
                      <span className={`font-bold ${item.leadTimeChangeColor}`}>{item.leadTimeChange}</span>
                    )}
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

              {/* Risk Badge */}
              <div className="mt-2.5">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border block text-center ${item.riskBadgeClass}`}>
                  {item.risk}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
