'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  DollarSign,
  ChevronRight,
  Filter,
  ArrowUpDown,
  Search,
} from 'lucide-react';

export interface MachineQueueItem {
  id: string;
  name: string;
  model: string;
  line: string;
  plant: string;
  status: 'critical' | 'warning' | 'medium' | 'low';
  issue: string;
  failureTimeline: string;
  healthScore: number;
  financialImpact: string;
  image: string;
  age: string;
  criticality: 'High' | 'Medium' | 'Low';
  lastMaintenance: string;
  nextDue: string;
}

export const QUEUE_MACHINES: MachineQueueItem[] = [
  {
    id: 'CNC-02',
    name: 'CNC-02',
    model: 'DMG Mori NHX 5000',
    line: 'CNC Line 1',
    plant: 'Riverside Factory',
    status: 'critical',
    issue: 'Spindle Overheat',
    failureTimeline: 'Failure in 12 hours',
    healthScore: 96,
    financialImpact: '$72K impact',
    image: 'https://picsum.photos/seed/cnc-milling-machine/300/200',
    age: '4.2 years',
    criticality: 'High',
    lastMaintenance: 'Jan 12, 2025',
    nextDue: 'Apr 30, 2025',
  },
  {
    id: 'Press-07',
    name: 'Press-07',
    model: 'Schuler Servo Press 800T',
    line: 'Stamping Line 2',
    plant: 'Munich Plant',
    status: 'warning',
    issue: 'Hydraulic Pressure Low',
    failureTimeline: 'Failure in 3 days',
    healthScore: 87,
    financialImpact: '$28K impact',
    image: 'https://picsum.photos/seed/stamping-press-machine/300/200',
    age: '5.8 years',
    criticality: 'High',
    lastMaintenance: 'Nov 04, 2024',
    nextDue: 'May 15, 2025',
  },
  {
    id: 'Robot-12',
    name: 'Robot-12',
    model: 'KUKA KR Quantec 210',
    line: 'Assembly Line 3',
    plant: 'Pune Factory',
    status: 'warning',
    issue: 'Vibration Anomaly',
    failureTimeline: 'Failure in 4 days',
    healthScore: 82,
    financialImpact: '$18K impact',
    image: 'https://picsum.photos/seed/kuka-robot-arm/300/200',
    age: '2.1 years',
    criticality: 'Medium',
    lastMaintenance: 'Feb 18, 2025',
    nextDue: 'May 02, 2025',
  },
  {
    id: 'Conveyor-B3',
    name: 'Conveyor-B3',
    model: 'Dorner 3200 Series',
    line: 'Packaging Transit',
    plant: 'Riverside Factory',
    status: 'critical',
    issue: 'Belt Misalignment',
    failureTimeline: 'Failure in 5 days',
    healthScore: 78,
    financialImpact: '$12K impact',
    image: 'https://picsum.photos/seed/conveyor-system/300/200',
    age: '3.4 years',
    criticality: 'High',
    lastMaintenance: 'Dec 10, 2024',
    nextDue: 'May 20, 2025',
  },
  {
    id: 'HVAC-01',
    name: 'HVAC-01',
    model: 'Carrier AquaForce 30XW',
    line: 'Central Utilities',
    plant: 'Austin Factory',
    status: 'medium',
    issue: 'Bearing Wear',
    failureTimeline: 'Failure in 8 days',
    healthScore: 71,
    financialImpact: '$8K impact',
    image: 'https://picsum.photos/seed/hvac-industrial-chiller/300/200',
    age: '6.5 years',
    criticality: 'Medium',
    lastMaintenance: 'Oct 14, 2024',
    nextDue: 'Jun 01, 2025',
  },
  {
    id: 'Compressor-04',
    name: 'Compressor-04',
    model: 'Atlas Copco GA 90 VSD',
    line: 'Pneumatics Grid',
    plant: 'Pune Factory',
    status: 'medium',
    issue: 'Temperature Drift',
    failureTimeline: 'Failure in 9 days',
    healthScore: 68,
    financialImpact: '$6K impact',
    image: 'https://picsum.photos/seed/air-compressor-plant/300/200',
    age: '3.9 years',
    criticality: 'Medium',
    lastMaintenance: 'Jan 28, 2025',
    nextDue: 'Jun 10, 2025',
  },
  {
    id: 'Chiller-01',
    name: 'Chiller-01',
    model: 'Trane Series R Helical',
    line: 'Cleanroom Cooling',
    plant: 'Munich Plant',
    status: 'low',
    issue: 'Efficiency Drop',
    failureTimeline: 'Failure in 14 days',
    healthScore: 64,
    financialImpact: '$4K impact',
    image: 'https://picsum.photos/seed/industrial-water-chiller/300/200',
    age: '7.0 years',
    criticality: 'Low',
    lastMaintenance: 'Aug 22, 2024',
    nextDue: 'Jul 15, 2025',
  },
  {
    id: 'Packaging-03',
    name: 'Packaging-03',
    model: 'Bosch Sigpack TTM',
    line: 'Carton Assembly',
    plant: 'Austin Factory',
    status: 'low',
    issue: 'Motor Current High',
    failureTimeline: 'Failure in 16 days',
    healthScore: 62,
    financialImpact: '$3K impact',
    image: 'https://picsum.photos/seed/packaging-line-machine/300/200',
    age: '4.8 years',
    criticality: 'Low',
    lastMaintenance: 'Sep 05, 2024',
    nextDue: 'Jul 28, 2025',
  },
];

interface MaintenanceQueueProps {
  selectedMachineId: string;
  onSelectMachine: (machine: MachineQueueItem) => void;
}

export default function MaintenanceQueue({
  selectedMachineId,
  onSelectMachine,
}: MaintenanceQueueProps) {
  const [activeTab, setActiveTab] = useState<'priority' | 'upcoming' | 'completed'>('priority');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [sortBy, setSortBy] = useState<'risk' | 'timeline' | 'cost'>('risk');

  const filtered = QUEUE_MACHINES.filter((m) => {
    if (severityFilter === 'critical') return m.status === 'critical';
    if (severityFilter === 'warning') return m.status === 'warning';
    if (severityFilter === 'info') return m.status === 'medium' || m.status === 'low';
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col h-full overflow-hidden">
      {/* Top Queue Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 px-3 pt-3">
        <div className="flex gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('priority')}
            className={`pb-2.5 px-2 flex items-center gap-1.5 transition-colors border-b-2 cursor-pointer ${
              activeTab === 'priority'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Priority Queue</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'priority'
                  ? 'bg-rose-500 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              12
            </span>
          </button>

          <button
            onClick={() => setActiveTab('upcoming')}
            className={`pb-2.5 px-2 flex items-center gap-1.5 transition-colors border-b-2 cursor-pointer ${
              activeTab === 'upcoming'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Upcoming</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
              5
            </span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`pb-2.5 px-2 transition-colors border-b-2 cursor-pointer ${
              activeTab === 'completed'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Completed</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="p-3 border-b border-slate-100 space-y-2.5 bg-slate-50/50">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          <button
            onClick={() => setSeverityFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer ${
              severityFilter === 'all'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            All (12)
          </button>

          <button
            onClick={() => setSeverityFilter('critical')}
            className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors flex items-center gap-1.5 cursor-pointer ${
              severityFilter === 'critical'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-rose-700 hover:bg-rose-50/50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
            <span>Critical (3)</span>
          </button>

          <button
            onClick={() => setSeverityFilter('warning')}
            className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors flex items-center gap-1.5 cursor-pointer ${
              severityFilter === 'warning'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-amber-700 hover:bg-amber-50/50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
            <span>Warning (6)</span>
          </button>

          <button
            onClick={() => setSeverityFilter('info')}
            className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors flex items-center gap-1.5 cursor-pointer ${
              severityFilter === 'info'
                ? 'bg-slate-800 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span>Info (3)</span>
          </button>
        </div>

        {/* Sort selector */}
        <div className="flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-slate-200 text-[11px] font-medium">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="font-semibold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="risk">Risk Score</option>
              <option value="timeline">Failure Timeline</option>
              <option value="cost">Financial Impact</option>
            </select>
          </div>

          <button className="p-1.5 rounded-md hover:bg-slate-200/70 text-slate-500 transition-colors cursor-pointer border border-slate-200 bg-white">
            <Filter className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Machine Queue List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2 no-scrollbar max-h-[820px]">
        {filtered.map((machine) => {
          const isSelected = machine.id === selectedMachineId;

          // Status Badge styling
          let badgeText = '● Critical';
          let badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
          if (machine.status === 'warning') {
            badgeText = '● Warning';
            badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
          } else if (machine.status === 'medium') {
            badgeText = '● Medium';
            badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
          } else if (machine.status === 'low') {
            badgeText = 'Low';
            badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
          }

          return (
            <div
              key={machine.id}
              onClick={() => onSelectMachine(machine)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 group relative ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/40 shadow-sm ring-1 ring-blue-500/30'
                  : 'border-slate-200/90 bg-white hover:border-blue-300 hover:bg-slate-50/70'
              }`}
            >
              {/* Machine thumbnail */}
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                <Image
                  src={machine.image}
                  alt={machine.name}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Machine Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-xs truncate">{machine.name}</span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${badgeClass} shrink-0`}
                  >
                    {badgeText}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 truncate mt-0.5">{machine.issue}</p>
                <div className="flex items-center justify-between text-[10px] mt-1">
                  <span className="text-teal-600 font-semibold font-mono">
                    {machine.failureTimeline}
                  </span>
                  <span className="text-slate-500 font-medium">{machine.financialImpact}</span>
                </div>
              </div>

              {/* Confidence / Health Circle */}
              <div className="flex items-center gap-1 shrink-0">
                <div className="relative w-9 h-9 rounded-full flex items-center justify-center border-2 border-emerald-500 bg-emerald-50/50">
                  <span className="text-[11px] font-bold text-slate-900">{machine.healthScore}%</span>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors ${
                    isSelected ? 'text-blue-600 translate-x-0.5' : ''
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
