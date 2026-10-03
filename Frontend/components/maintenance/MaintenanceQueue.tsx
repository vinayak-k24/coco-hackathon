'use client';

import { useState, useEffect } from 'react';
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
import { fetchApi } from '@/lib/api';

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

export let QUEUE_MACHINES: MachineQueueItem[] = [];

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
  const [machines, setMachines] = useState<MachineQueueItem[]>([]);

  useEffect(() => {
    const load = () => fetchApi<MachineQueueItem[]>('/api/maintenance/queue?limit=10', []).then((data) => {
      setMachines(data);
      QUEUE_MACHINES = data;
    });
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  const displayMachines = machines.length > 0 ? machines : QUEUE_MACHINES;

  const filtered = displayMachines.filter((m) => {
    if (severityFilter === 'critical') return m.status === 'critical';
    if (severityFilter === 'warning') return m.status === 'warning';
    if (severityFilter === 'info') return m.status === 'medium' || m.status === 'low';
    return true;
  });

  const totalCount = displayMachines.length;
  const critCount = displayMachines.filter(m => m.status === 'critical').length;
  const warnCount = displayMachines.filter(m => m.status === 'warning').length;
  const infoCount = displayMachines.filter(m => m.status === 'medium' || m.status === 'low').length;

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
            All ({totalCount})
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
            <span>Critical ({critCount})</span>
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
            <span>Warning ({warnCount})</span>
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
            <span>Info ({infoCount})</span>
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
