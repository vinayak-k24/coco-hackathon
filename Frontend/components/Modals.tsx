'use client';

import { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  Volume2,
  Calendar,
  Users,
  Search,
  ExternalLink,
  ShieldCheck,
  Zap,
  Wrench,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import Image from 'next/image';
import { FactoryPlant } from './PlantHealthOverview';
import { MachineAlert } from './CriticalMachineAlerts';

interface RecommendedActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RecommendedActionsModal({ isOpen, onClose }: RecommendedActionsModalProps) {
  const [applied, setApplied] = useState<{ [key: string]: boolean }>({});

  if (!isOpen) return null;

  const actions = [
    {
      id: 'act-1',
      title: 'Emergency Thermal Relief: Riverside CNC-02',
      risk: 'Critical Failure in 12h',
      savings: '$284,000 cost avoidance',
      impact: 'Downtime prevented: 8.4 hours',
      recommendation:
        'Throttle spindle RPM by 25% immediately and dispatch on-call technician Marcus Vance with replacement ceramic bearing kit #SKF-7204.',
    },
    {
      id: 'act-2',
      title: 'Shift Assembly Rebalancing to Munich Line 4',
      risk: 'PO-45821 & PO-44732 delivery risk',
      savings: '$420,000 revenue protected',
      impact: '0 delay days on customer orders',
      recommendation:
        'Auto-transfer 420 automotive sensor assemblies from Riverside backlog into Munich spare capacity window starting 14:00 CET.',
    },
    {
      id: 'act-3',
      title: 'Dual-Source Supplier Expedite for Semiconductor ICs',
      risk: 'Austin Plant component stockout in 7 days',
      savings: '$140,000 penalty mitigation',
      impact: 'Guaranteed supply buffer through Q2',
      recommendation:
        'Trigger secondary approved supplier (Kyocera Micro) fast-track logistics contract for 12,000 microcontroller units.',
    },
  ];

  const handleApply = (id: string) => {
    setApplied((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">AI-Recommended Operational Actions</h3>
              <p className="text-xs text-slate-500">Addressing these top 3 recommendations saves an estimated $284K.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 py-4">
          {actions.map((act) => {
            const isDone = applied[act.id];
            return (
              <div
                key={act.id}
                className={`p-4 rounded-xl border transition-all ${
                  isDone
                    ? 'bg-emerald-50/60 border-emerald-200'
                    : 'bg-slate-50/70 border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{act.title}</h4>
                    <span className="text-[11px] font-semibold text-rose-600">{act.risk}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-emerald-600 block">{act.savings}</span>
                    <span className="text-[10px] text-slate-500">{act.impact}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">{act.recommendation}</p>

                <div className="flex items-center justify-end">
                  {isDone ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-3 py-1.5 rounded-lg">
                      <CheckCircle2 className="w-4 h-4" /> Action Dispatched & Executed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApply(act.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Execute Action</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">Autonomous safeguards active across SCADA controllers.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
}

interface FactoryModalProps {
  factory: FactoryPlant | null;
  onClose: () => void;
}

export function FactoryDetailModal({ factory, onClose }: FactoryModalProps) {
  if (!factory) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden border border-slate-200 shadow-2xl">
        <div className="relative h-44 w-full">
          <Image
            src={factory.image}
            alt={factory.name}
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/60 text-white hover:bg-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-4 text-white">
            <span className="text-[10px] uppercase tracking-wider font-semibold bg-blue-600/80 px-2 py-0.5 rounded">
              {factory.country}
            </span>
            <h3 className="text-lg font-bold mt-1">{factory.name}</h3>
            <p className="text-xs text-slate-300">Managed by {factory.manager} • {factory.lines} active production lines</p>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-lg font-bold text-slate-900 block">{factory.health}%</span>
              <span className="text-[10px] text-slate-500">Plant Health</span>
            </div>
            <div className="bg-red-50/80 p-2.5 rounded-xl border border-red-100">
              <span className="text-lg font-bold text-red-600 block">{factory.critical}</span>
              <span className="text-[10px] text-red-700">Critical</span>
            </div>
            <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-100">
              <span className="text-lg font-bold text-amber-600 block">{factory.warning}</span>
              <span className="text-[10px] text-amber-700">Warning</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-lg font-bold text-slate-800 block">{factory.online}</span>
              <span className="text-[10px] text-slate-500">Online</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900">Line Telemetry Snapshot</h4>
            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span>Assembly Line 1</span>
                <span className="font-semibold text-emerald-600">Optimal (98.2%)</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span>CNC Milling Line 2</span>
                <span className={`font-semibold ${factory.id === 'riverside' ? 'text-red-600' : 'text-emerald-600'}`}>
                  {factory.id === 'riverside' ? 'Thermal Alert (112°C)' : 'Nominal (91.4%)'}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span>Packaging & Logistics</span>
                <span className="font-semibold text-emerald-600">On Schedule (100%)</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AlertDetailModalProps {
  alert: MachineAlert | null;
  onClose: () => void;
}

export function AlertDetailModal({ alert, onClose }: AlertDetailModalProps) {
  const [acknowledged, setAcknowledged] = useState(false);

  if (!alert) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 border border-slate-200 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{alert.machine} Alert Details</h3>
              <p className="text-[11px] text-slate-500">{alert.location}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 block text-[11px]">Reported Condition</span>
            <span className="font-bold text-slate-900 text-sm">{alert.issue}</span>
            {alert.temperature && (
              <span className="block text-red-600 font-mono mt-1 font-semibold">
                Sensor: {alert.temperature}
              </span>
            )}
            {alert.pressure && (
              <span className="block text-amber-600 font-mono mt-1 font-semibold">
                Pressure: {alert.pressure}
              </span>
            )}
            {alert.vibration && (
              <span className="block text-amber-600 font-mono mt-1 font-semibold">
                Vibration: {alert.vibration}
              </span>
            )}
          </div>

          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100">
            <span className="text-blue-700 font-bold block mb-1">Recommended Corrective Action:</span>
            <p className="text-slate-700">{alert.recommendedAction}</p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">{alert.time}</span>
          <div className="flex items-center gap-2">
            {acknowledged ? (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Dispatched
              </span>
            ) : (
              <button
                onClick={() => setAcknowledged(true)}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                Dispatch Technician
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ActionPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ActionPlanModal({ isOpen, onClose }: ActionPlanModalProps) {
  const [stepDone, setStepDone] = useState<{ [key: number]: boolean }>({});

  if (!isOpen) return null;

  const planSteps = [
    {
      title: 'Step 1: Balance Line 3 Workload',
      desc: 'Route 15% batch capacity from Riverside assembly onto Pune Line 3 to alleviate bottlenecks.',
    },
    {
      title: 'Step 2: Add Second Technician Shift',
      desc: 'Activate Shift B coverage (4 technicians) from 18:00 to 02:00 to prevent downtime propagation.',
    },
    {
      title: 'Step 3: Expedite Hydraulic Valve Reorder',
      desc: 'Confirm priority freight logistics for Bosch Rexroth valve shipment due tomorrow.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 border border-slate-200 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Capacity Action Plan</h3>
              <p className="text-xs text-slate-500">Preventing Assembly Line 3 capacity bottleneck</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-3">
          {planSteps.map((step, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${
                stepDone[idx] ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <input
                type="checkbox"
                checked={!!stepDone[idx]}
                onChange={() => setStepDone((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                className="mt-1 w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
              <div className="flex-1 text-xs">
                <p className="font-bold text-slate-900">{step.title}</p>
                <p className="text-slate-600 mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFactory: (factory: FactoryPlant) => void;
}

export function CommandSearchModal({ isOpen, onClose, onSelectFactory }: SearchModalProps) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden">
        <div className="p-3.5 border-b border-slate-200 flex items-center gap-2.5">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search factories, machines, POs, alerts, or telemetry..."
            className="flex-1 text-xs text-slate-800 placeholder-slate-400 outline-none"
            autoFocus
          />
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 max-h-80 overflow-y-auto space-y-1 text-xs">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Quick Shortcuts
          </div>
          <div
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 flex items-center justify-between cursor-pointer"
          >
            <span className="font-medium text-slate-800">Riverside Factory • CNC Line Overheat</span>
            <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
              Critical
            </span>
          </div>
          <div
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 flex items-center justify-between cursor-pointer"
          >
            <span className="font-medium text-slate-800">PO-45821 • $420K Order (5 days delay risk)</span>
            <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">
              At Risk
            </span>
          </div>
          <div
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 flex items-center justify-between cursor-pointer"
          >
            <span className="font-medium text-slate-800">Pune Factory • 91% Plant Health</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
              Online
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
