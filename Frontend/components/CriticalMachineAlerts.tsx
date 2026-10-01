'use client';

import { AlertTriangle, AlertCircle, Bot, Zap, ArrowRight } from 'lucide-react';

export interface MachineAlert {
  id: string;
  machine: string;
  issue: string;
  location: string;
  severity: 'Critical' | 'Warning';
  time: string;
  temperature?: string;
  vibration?: string;
  pressure?: string;
  recommendedAction: string;
}

export const MACHINE_ALERTS: MachineAlert[] = [
  {
    id: 'cnc-02',
    machine: 'CNC-02',
    issue: 'Spindle overheat (112°C)',
    location: 'Riverside • CNC Line',
    severity: 'Critical',
    time: '12 min ago',
    temperature: '112°C (Threshold: 90°C)',
    recommendedAction: 'Schedule emergency bearing inspection & reduce spindle RPM by 25%.',
  },
  {
    id: 'press-07',
    machine: 'Press-07',
    issue: 'Hydraulic pressure low',
    location: 'Munich • Stamping',
    severity: 'Warning',
    time: '28 min ago',
    pressure: '142 bar (Target: 180 bar)',
    recommendedAction: 'Check auxiliary valve seals and hydraulic fluid replenishment.',
  },
  {
    id: 'robot-12',
    machine: 'Robot-12',
    issue: 'Vibration anomaly detected',
    location: 'Pune • Assembly Line 3',
    severity: 'Warning',
    time: '41 min ago',
    vibration: '4.8 mm/s RMS (Harmonic spike)',
    recommendedAction: 'Recalibrate harmonic drive gear joint 3 during next shift break.',
  },
];

interface CriticalMachineAlertsProps {
  onSelectAlert: (alert: MachineAlert) => void;
  onViewAll: () => void;
}

export default function CriticalMachineAlerts({
  onSelectAlert,
  onViewAll,
}: CriticalMachineAlertsProps) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-sm font-bold text-slate-900 tracking-tight">Critical Machine Alerts</h2>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
        >
          View All (3)
        </button>
      </div>

      {/* Alert Items */}
      <div className="space-y-3">
        {MACHINE_ALERTS.map((alert) => {
          const isCritical = alert.severity === 'Critical';

          return (
            <div
              key={alert.id}
              onClick={() => onSelectAlert(alert)}
              className="group p-3 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:shadow-xs transition-all duration-150 flex items-start gap-3 cursor-pointer bg-slate-50/40 hover:bg-slate-50"
            >
              {/* Icon */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  isCritical ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                }`}
              >
                {isCritical ? <Zap className="w-4 h-4 fill-current" /> : <AlertTriangle className="w-4 h-4" />}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {alert.machine}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isCritical
                        ? 'bg-red-50 text-red-600 border border-red-200/60'
                        : 'bg-amber-50 text-amber-600 border border-amber-200/60'
                    }`}
                  >
                    {alert.severity}
                  </span>
                </div>

                <p className="text-xs font-medium text-slate-700 mt-0.5 truncate">{alert.issue}</p>
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                  <span className="truncate">{alert.location}</span>
                  <span className="shrink-0 font-mono text-[10px]">{alert.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
