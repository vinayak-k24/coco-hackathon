'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle2,
  FileText,
  DollarSign,
  Users,
  ChevronRight,
  ChevronDown,
  Layers,
  Wrench,
  ShieldCheck,
  TrendingUp,
  MoreHorizontal,
  Plus,
  Box,
  ExternalLink,
  Activity,
} from 'lucide-react';
import { MachineQueueItem } from './MaintenanceQueue';

interface AssetDetailViewProps {
  machine: MachineQueueItem;
  onBackToList?: () => void;
  onCreateWorkOrder: () => void;
  onScheduleMaintenance: () => void;
  onSelectTechnician?: (name: string) => void;
  onInspectAsset?: (assetId: string) => void;
}

export default function AssetDetailView({
  machine,
  onBackToList,
  onCreateWorkOrder,
  onScheduleMaintenance,
  onSelectTechnician,
  onInspectAsset,
}: AssetDetailViewProps) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [timeRange, setTimeRange] = useState('Last 7 days');
  const [analysisSubTab, setAnalysisSubTab] = useState<'analysis' | 'evidence' | 'work-orders' | 'similar'>('analysis');
  const [selectedScenario, setSelectedScenario] = useState<'12hrs' | '3days' | 'failure'>('12hrs');

  const tabs = [
    'Overview',
    'Sensor Analysis',
    'AI Diagnosis',
    'Maintenance History',
    'Documents',
    'Parts & BOM',
    'Related Assets',
  ];

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-4">
        {/* Back and Action strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {onBackToList && (
              <button
                onClick={onBackToList}
                className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to list</span>
              </button>
            )}

            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                <Image
                  src={machine.image}
                  alt={machine.name}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">{machine.name}</h1>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    ● Critical
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {machine.model} • {machine.line} • {machine.plant}
                </p>
              </div>
            </div>
          </div>

          {/* Quick status badges and action button */}
          <div className="flex items-center gap-3">
            {/* Predicted Failure indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200/80">
              <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-rose-600 font-bold block uppercase tracking-wider">
                  Predicted Failure
                </span>
                <span className="text-xs font-bold text-rose-900 leading-tight">in 12 hours</span>
              </div>
            </div>

            {/* AI Confidence Ring */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="relative w-8 h-8 rounded-full border-2 border-emerald-500 flex items-center justify-center font-bold text-xs text-slate-900 bg-white">
                96%
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block font-medium">AI Confidence</span>
                <span className="text-xs font-bold text-slate-800">96%</span>
              </div>
            </div>

            {/* Options button */}
            <button className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {/* Asset 360 Full Diagnostics button */}
            {onInspectAsset && (
              <button
                onClick={() => onInspectAsset(machine.id)}
                className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5 text-blue-400" />
                <span>Asset 360</span>
              </button>
            )}

            {/* Create Work Order Button */}
            <button
              onClick={onCreateWorkOrder}
              className="py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Work Order</span>
            </button>
          </div>
        </div>

        {/* Machine Metadata Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs pt-1">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">Asset ID</span>
            <span className="font-bold text-slate-900 text-xs mt-0.5 block">{machine.id}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">Category</span>
            <span className="font-semibold text-slate-800 text-xs mt-0.5 block">CNC Machine</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">Age</span>
            <span className="font-semibold text-slate-800 text-xs mt-0.5 block">{machine.age}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">Criticality</span>
            <span className="font-bold text-rose-600 text-xs mt-0.5 block">High</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">Last Maintenance</span>
            <span className="font-semibold text-slate-800 text-xs mt-0.5 block">{machine.lastMaintenance}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">Next Due</span>
            <span className="font-semibold text-slate-800 text-xs mt-0.5 block">{machine.nextDue}</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar text-xs">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-xs text-slate-600">
          <span>Range:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="Last 24 hours">Last 24 hours</option>
            <option value="Last 7 days">Last 7 days</option>
            <option value="Last 30 days">Last 30 days</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Left Column (Sensor Trends + Root Cause + Business Impact) + Right Column (Recommendations + Scenarios + Techs + Parts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Section (7 of 12 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* SENSOR TRENDS & ANOMALIES (4 Charts) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">Sensor Trends & Anomalies</h2>
              <span className="text-[10px] text-slate-400 font-mono">Live SCADA stream</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* 1. Vibration */}
              <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    <span>Vibration (mm/s)</span>
                  </div>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                    Anomaly detected
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-slate-900">7.8</span>
                  <span className="text-xs text-slate-500 font-medium">mm/s</span>
                  <span className="text-xs font-bold text-rose-600 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> +240%
                  </span>
                </div>

                {/* SVG Area Line Chart */}
                <div className="h-20 w-full pt-1">
                  <svg className="w-full h-full" viewBox="0 0 240 70" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="vibGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 54 Q 30 52 60 50 T 120 42 T 160 30 T 200 18 L 240 12 L 240 70 L 0 70 Z"
                      fill="url(#vibGrad)"
                    />
                    <path
                      d="M 0 54 Q 30 52 60 50 T 120 42 T 160 30 T 200 18 L 240 12"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2.5"
                    />
                    <circle cx="240" cy="12" r="3.5" fill="#ef4444" />
                  </svg>
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
                    <span>Apr 22</span>
                    <span>Apr 24</span>
                    <span>Apr 26</span>
                    <span>Apr 28</span>
                  </div>
                </div>
              </div>

              {/* 2. Spindle Temperature */}
              <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
                    <span>Spindle Temperature (°C)</span>
                  </div>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                    Anomaly detected
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-slate-900">112°c</span>
                  <span className="text-xs font-bold text-rose-600 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> +46%
                  </span>
                </div>

                {/* SVG Area Line Chart */}
                <div className="h-20 w-full pt-1">
                  <svg className="w-full h-full" viewBox="0 0 240 70" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 50 Q 40 48 80 44 T 140 38 T 190 24 L 240 14 L 240 70 L 0 70 Z"
                      fill="url(#tempGrad)"
                    />
                    <path
                      d="M 0 50 Q 40 48 80 44 T 140 38 T 190 24 L 240 14"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                    />
                    <circle cx="240" cy="14" r="3.5" fill="#f59e0b" />
                  </svg>
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
                    <span>Apr 22</span>
                    <span>Apr 24</span>
                    <span>Apr 26</span>
                    <span>Apr 28</span>
                  </div>
                </div>
              </div>

              {/* 3. Crest Factor */}
              <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    <span>Crest Factor</span>
                  </div>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                    Anomaly detected
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-slate-900">6.2</span>
                  <span className="text-xs font-bold text-rose-600 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> +180%
                  </span>
                </div>

                <div className="h-20 w-full pt-1">
                  <svg className="w-full h-full" viewBox="0 0 240 70" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="crestGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 56 Q 30 52 70 48 T 130 38 T 180 26 L 240 16 L 240 70 L 0 70 Z"
                      fill="url(#crestGrad)"
                    />
                    <path
                      d="M 0 56 Q 30 52 70 48 T 130 38 T 180 26 L 240 16"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="2.5"
                    />
                    <circle cx="240" cy="16" r="3.5" fill="#a855f7" />
                  </svg>
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
                    <span>Apr 22</span>
                    <span>Apr 24</span>
                    <span>Apr 26</span>
                    <span>Apr 28</span>
                  </div>
                </div>
              </div>

              {/* 4. Kurtosis */}
              <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
                    <span>Kurtosis</span>
                  </div>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                    Anomaly detected
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-slate-900">8.4</span>
                  <span className="text-xs font-bold text-rose-600 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> +210%
                  </span>
                </div>

                <div className="h-20 w-full pt-1">
                  <svg className="w-full h-full" viewBox="0 0 240 70" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="kurtGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 58 Q 40 54 80 50 T 150 36 T 195 24 L 240 15 L 240 70 L 0 70 Z"
                      fill="url(#kurtGrad)"
                    />
                    <path
                      d="M 0 58 Q 40 54 80 50 T 150 36 T 195 24 L 240 15"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                    />
                    <circle cx="240" cy="15" r="3.5" fill="#3b82f6" />
                  </svg>
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
                    <span>Apr 22</span>
                    <span>Apr 24</span>
                    <span>Apr 26</span>
                    <span>Apr 28</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI ROOT CAUSE ANALYSIS */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">AI Root Cause Analysis</h2>

              <div className="flex items-center gap-1 text-[11px] font-semibold bg-slate-100 p-0.5 rounded-lg">
                <button
                  onClick={() => setAnalysisSubTab('analysis')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    analysisSubTab === 'analysis'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  AI Analysis
                </button>
                <button
                  onClick={() => setAnalysisSubTab('evidence')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    analysisSubTab === 'evidence'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Evidence
                </button>
                <button
                  onClick={() => setAnalysisSubTab('work-orders')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    analysisSubTab === 'work-orders'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Related Work Orders
                </button>
                <button
                  onClick={() => setAnalysisSubTab('similar')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    analysisSubTab === 'similar'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Similar Failures
                </button>
              </div>
            </div>

            {/* Primary Cause Banner */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-sky-50/60 border border-blue-200/80 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                    Primary cause: Spindle bearing degradation due to coolant contamination
                  </h3>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                    96% Confidence
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  AI analysis indicates early-stage spindle bearing failure caused by coolant contamination, aligned with vibration, temperature and kurtosis patterns.
                </p>
              </div>
            </div>

            {/* Two columns: Contributing Factors & Supporting Evidence */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Contributing Factors */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900">Contributing Factors</h4>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">Coolant contamination</span>
                      <span className="font-bold text-slate-900">82%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: '82%' }} />
                    </div>
                    <span className="text-[10px] text-slate-500">Detected in oil analysis report (Apr 20)</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">Increased vibration harmonics</span>
                      <span className="font-bold text-slate-900">76%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: '76%' }} />
                    </div>
                    <span className="text-[10px] text-slate-500">Match with historical bearing failures</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">Temperature rise during high-load cycles</span>
                      <span className="font-bold text-slate-900">68%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '68%' }} />
                    </div>
                    <span className="text-[10px] text-slate-500">Correlates with recent production increase</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">Similar failure pattern in 3 previous assets</span>
                      <span className="font-bold text-slate-900">64%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-full rounded-full" style={{ width: '64%' }} />
                    </div>
                    <span className="text-[10px] text-slate-500">CNC-05, CNC-07, CNC-11</span>
                  </div>
                </div>
              </div>

              {/* Supporting Evidence */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900">Supporting Evidence</h4>

                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate text-slate-700 font-medium">Vibration spectrum shows bearing fault</span>
                    </div>
                    <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 shrink-0 cursor-pointer">
                      View data
                    </button>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate text-slate-700 font-medium">Coolant particle count 3.2x higher</span>
                    </div>
                    <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 shrink-0 cursor-pointer">
                      Lab report
                    </button>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate text-slate-700 font-medium">Similar failure in CNC-05 (2023)</span>
                    </div>
                    <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 shrink-0 cursor-pointer">
                      View record
                    </button>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate text-slate-700 font-medium">Operator noted unusual noise on Apr 25</span>
                    </div>
                    <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 shrink-0 cursor-pointer">
                      View note
                    </button>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate text-slate-700 font-medium">Manufacturer bulletin on bearing sensitivity</span>
                    </div>
                    <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 shrink-0 cursor-pointer">
                      View doc
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BUSINESS IMPACT CARD */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">Business Impact</h2>
              <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
                View details
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="text-lg font-bold text-slate-900 block leading-tight">2</span>
                <span className="text-[11px] text-slate-500 font-medium">Production Lines Affected</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-1.5">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-lg font-bold text-slate-900 block leading-tight">3</span>
                <span className="text-[11px] text-slate-500 font-medium">Customer Orders at Risk</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-1.5">
                  <DollarSign className="w-4 h-4" />
                </div>
                <span className="text-lg font-bold text-rose-600 block leading-tight">$72K</span>
                <span className="text-[11px] text-slate-500 font-medium">Projected Loss (3 days)</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-1.5">
                  <Box className="w-4 h-4" />
                </div>
                <span className="text-lg font-bold text-slate-900 block leading-tight">8,400 units</span>
                <span className="text-[11px] text-slate-500 font-medium">Potential Output Loss</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section (5 of 12 cols): Recommended Actions + What-If + Techs + Parts */}
        <div className="lg:col-span-5 space-y-4">
          {/* AI RECOMMENDED ACTIONS */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">AI Recommended Actions</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                High Priority
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Action 1 */}
              <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/30 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Schedule maintenance within 12–24 hours
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Prevent unplanned breakdown and $72K potential loss
                    </p>
                  </div>
                </div>
                <button
                  onClick={onScheduleMaintenance}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shrink-0 transition-colors shadow-2xs cursor-pointer"
                >
                  Schedule
                </button>
              </div>

              {/* Action 2 */}
              <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-start justify-between gap-3 hover:border-slate-300 transition-colors">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Replace spindle bearings and inspect coolant system
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Estimated duration: 4 hours | Cost: $2.8K
                    </p>
                  </div>
                </div>
                <span className="px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-[10px] shrink-0">
                  $69K Potential savings
                </span>
              </div>

              {/* Action 3 */}
              <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-start justify-between gap-3 hover:border-slate-300 transition-colors">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Flush coolant system and install fine filter
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Prevent recurrence, improves bearing life
                    </p>
                  </div>
                </div>
                <button
                  onClick={onCreateWorkOrder}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold shrink-0 transition-colors cursor-pointer"
                >
                  Add to WO
                </button>
              </div>

              {/* Action 4 */}
              <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 hover:border-slate-300 transition-colors cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                    4
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Inspect spindle motor and alignment
                    </h4>
                    <p className="text-[11px] text-slate-500">Check for secondary damage</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          {/* WHAT-IF SCENARIO ANALYSIS */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">What-If Scenario Analysis</h2>
              <div className="flex items-center gap-1 text-[11px] text-slate-600 font-semibold cursor-pointer">
                <span>Compare Scenarios</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              {/* Scenario 1: Recommended */}
              <div
                onClick={() => setSelectedScenario('12hrs')}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedScenario === '12hrs'
                    ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-400/50 shadow-2xs'
                    : 'border-slate-200 bg-slate-50 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-emerald-800 text-[11px] mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Repair in 12 hours (Recommended)</span>
                </div>
                <div className="space-y-1.5 pt-1 border-t border-emerald-100">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Repair cost:</span>
                    <strong className="text-slate-900 font-bold">$2.8K</strong>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Breakdown risk:</span>
                    <strong className="text-emerald-600 font-bold">3%</strong>
                  </div>
                </div>
              </div>

              {/* Scenario 2: In 3 days */}
              <div
                onClick={() => setSelectedScenario('3days')}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedScenario === '3days'
                    ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-400/50 shadow-2xs'
                    : 'border-slate-200 bg-slate-50 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-amber-800 text-[11px] mb-2">
                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Repair in 3 days</span>
                </div>
                <div className="space-y-1.5 pt-1 border-t border-amber-100">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Repair cost:</span>
                    <strong className="text-slate-900 font-bold">$3.2K</strong>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Breakdown risk:</span>
                    <strong className="text-amber-600 font-bold">18%</strong>
                  </div>
                </div>
              </div>

              {/* Scenario 3: Wait for failure */}
              <div
                onClick={() => setSelectedScenario('failure')}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedScenario === 'failure'
                    ? 'border-rose-500 bg-rose-50/40 ring-1 ring-rose-400/50 shadow-2xs'
                    : 'border-slate-200 bg-slate-50 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-rose-800 text-[11px] mb-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>Wait for failure</span>
                </div>
                <div className="space-y-1.5 pt-1 border-t border-rose-100">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Repair cost:</span>
                    <strong className="text-slate-900 font-bold">$8.5K</strong>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Revenue impact:</span>
                    <strong className="text-rose-600 font-bold">$72K</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TECHNICIAN AVAILABILITY & SKILLS MATCH */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Technician Availability & Skills Match
              </h2>
              <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
                View all (8)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Tech 1 */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-200">
                    <Image
                      src="https://picsum.photos/seed/tech-mike-reynolds/100/100"
                      alt="Mike Reynolds"
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs leading-tight">Mike Reynolds</h4>
                    <span className="text-[10px] text-emerald-600 font-bold">98% skill match</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Available now</span>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="px-1.5 py-0.5 rounded bg-white text-[9px] font-medium text-slate-600 border border-slate-200">
                    CNC
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-white text-[9px] font-medium text-slate-600 border border-slate-200">
                    Spindle
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-white text-[9px] font-medium text-slate-600 border border-slate-200">
                    4+ yrs
                  </span>
                </div>
              </div>

              {/* Tech 2 */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-200">
                    <Image
                      src="https://picsum.photos/seed/tech-sarah-kim/100/100"
                      alt="Sarah Kim"
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs leading-tight">Sarah Kim</h4>
                    <span className="text-[10px] text-emerald-600 font-bold">88% skill match</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-semibold text-amber-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Available in 2 hrs</span>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="px-1.5 py-0.5 rounded bg-white text-[9px] font-medium text-slate-600 border border-slate-200">
                    CNC
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-white text-[9px] font-medium text-slate-600 border border-slate-200">
                    Mechanical
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-white text-[9px] font-medium text-slate-600 border border-slate-200">
                    3+ yrs
                  </span>
                </div>
              </div>

              {/* Tech 3 */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-200">
                    <Image
                      src="https://picsum.photos/seed/tech-james-patel/100/100"
                      alt="James Patel"
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs leading-tight">James Patel</h4>
                    <span className="text-[10px] text-emerald-600 font-bold">72% skill match</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Available today</span>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="px-1.5 py-0.5 rounded bg-white text-[9px] font-medium text-slate-600 border border-slate-200">
                    Mechanical
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-white text-[9px] font-medium text-slate-600 border border-slate-200">
                    Electrical
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-white text-[9px] font-medium text-slate-600 border border-slate-200">
                    5+ yrs
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SPARE PARTS READINESS */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">Spare Parts Readiness</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  All parts available
                </span>
              </div>
              <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
                View BOM
              </button>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-mono text-[10px] text-slate-500">
                    ⚙️
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Spindle Bearing (SKM-6208)</span>
                    <span className="text-[10px] text-slate-500">Riverside Central Warehouse</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    In stock (4)
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-mono text-[10px] text-slate-500">
                    🛢️
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Coolant Filter (CF-100)</span>
                    <span className="text-[10px] text-slate-500">Line 1 Tool Crib</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    In stock (12)
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-mono text-[10px] text-slate-500">
                    ⭕
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Spindle Seal Kit (SSK-02)</span>
                    <span className="text-[10px] text-slate-500">Main Maintenance Depot</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-600 font-bold text-[11px] flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                    Low stock (2)
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
