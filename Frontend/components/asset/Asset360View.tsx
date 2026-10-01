'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Layers,
  Wrench,
  ShieldAlert,
  Activity,
  Zap,
  Gauge,
  RotateCw,
  Box,
  FileText,
  DollarSign,
  ChevronRight,
  ChevronDown,
  HeartPulse,
  BarChart2,
  Radio,
  FileCheck,
  ShieldCheck,
  Calendar,
  Hourglass,
  Sliders,
} from 'lucide-react';

interface Asset360ViewProps {
  assetId?: string;
  onBack: () => void;
  onOpenCopilot?: () => void;
  onCreateWorkOrder?: () => void;
}

export default function Asset360View({
  assetId = 'CNC-02',
  onBack,
  onOpenCopilot,
  onCreateWorkOrder,
}: Asset360ViewProps) {
  const [activeTab, setActiveTab] = useState('Health');
  const [conditionTimeRange, setConditionTimeRange] = useState('Last 30 days');
  const [perfTimeRange, setPerfTimeRange] = useState('Last 30 days');
  const [downtimeTimeRange, setDowntimeTimeRange] = useState('Last 30 days');
  const [prodTimeRange, setProdTimeRange] = useState('Last 30 days');
  const [businessTimeRange, setBusinessTimeRange] = useState('This Month');

  const subTabs = [
    { name: 'Health', icon: HeartPulse },
    { name: 'Performance', icon: BarChart2 },
    { name: 'Sensors', icon: Radio },
    { name: 'Maintenance History', icon: Wrench },
    { name: 'Components', icon: Sliders },
    { name: 'Spare Parts', icon: Box },
    { name: 'Documents', icon: FileText },
    { name: 'Warranty', icon: ShieldCheck },
    { name: 'Financial Impact', icon: DollarSign },
  ];

  return (
    <div className="space-y-4">
      {/* Top Back Button */}
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Assets</span>
        </button>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80">
          Asset 360 Telemetry Stream Active
        </span>
      </div>

      {/* Hero Asset Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Machine Photo (3 cols) */}
          <div className="lg:col-span-3">
            <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs">
              <Image
                src="https://picsum.photos/seed/dmg-mori-cnc-5000/600/400"
                alt="CNC-02 DMG MORI"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold tracking-wider">
                DMG MORI
              </span>
            </div>
          </div>

          {/* Machine Meta & Identification (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div>
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200/60">
                CNC Machine
              </span>
              <div className="flex items-center gap-3 mt-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {assetId}
                </h1>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    ● Critical
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ● Running
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                DMG MORI NHX 5000 • CNC Line 1 • Riverside Factory
              </p>
              <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                Last updated 2 min ago
              </span>
            </div>

            {/* Spec Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Asset ID</span>
                <span className="font-bold text-slate-900">{assetId}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Serial No.</span>
                <span className="font-semibold text-slate-800">NHX-5021-7783</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Install Date</span>
                <span className="font-semibold text-slate-800">Jan 12, 2021</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Age</span>
                <span className="font-semibold text-slate-800">4.2 years</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Location</span>
                <span className="font-semibold text-slate-800">Building A, Line 1</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Criticality</span>
                <span className="font-bold text-rose-600">High</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">OEE (30 days)</span>
                <span className="font-bold text-slate-900">62.4%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Utilization</span>
                <span className="font-bold text-slate-900">76%</span>
              </div>
            </div>
          </div>

          {/* Machine Health & Prediction Widgets (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Health Score Gauge */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center flex flex-col justify-center items-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  Health Score
                </span>
                <div className="relative w-14 h-14 my-1 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="3.5"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="3.5"
                      strokeDasharray="38, 100"
                    />
                  </svg>
                  <span className="absolute text-xs font-black text-slate-900">38/100</span>
                </div>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-100 text-rose-800">
                  Critical
                </span>
                <span className="text-[9px] text-rose-600 font-semibold mt-0.5">
                  ↓ 22 pts (30d)
                </span>
              </div>

              {/* Predicted Failure */}
              <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-center flex flex-col justify-center items-center">
                <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center mb-1">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider">
                  Predicted Failure
                </span>
                <span className="text-xs font-bold text-rose-900 mt-0.5">in 12 days</span>
                <span className="text-[9px] text-slate-500 font-medium mt-1">Confidence 92%</span>
              </div>

              {/* Remaining Useful Life */}
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-center flex flex-col justify-center items-center">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center mb-1">
                  <Hourglass className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">
                  Remaining Life
                </span>
                <span className="text-xs font-bold text-slate-900 mt-0.5">1.3 years</span>
                <span className="text-[9px] text-rose-600 font-semibold mt-1">↓ 60% vs. exp</span>
              </div>
            </div>

            {/* AI Health Summary Box */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-sky-50/60 border border-blue-200 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>AI Health Summary</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                CNC-02 shows increasing vibration and temperature on the spindle. AI detects early-stage bearing degradation, likely caused by coolant contamination and higher load cycles.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="bg-white p-1.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-1 overflow-x-auto no-scrollbar">
        {subTabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.name;
          return (
            <button
              key={t.name}
              onClick={() => setActiveTab(t.name)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.name}</span>
            </button>
          );
        })}
      </div>

      {/* ROW 1: Condition Monitoring + Key Sensor Indicators + Operational Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Condition Monitoring (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Condition Monitoring</h2>
            <select
              value={conditionTimeRange}
              onChange={(e) => setConditionTimeRange(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>Vibration (mm/s)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Temperature (°C)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Anomaly Score</span>
            </span>
          </div>

          {/* Multi-Line Condition Graph with Tooltip Preview */}
          <div className="relative pt-2">
            <div className="h-44 w-full">
              <svg className="w-full h-full" viewBox="0 0 320 120" preserveAspectRatio="none">
                <line x1="0" y1="20" x2="320" y2="20" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2="320" y2="60" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="0" y1="100" x2="320" y2="100" stroke="#f1f5f9" strokeDasharray="3 3" />

                {/* Vibration Line (Blue) */}
                <path
                  d="M 0 95 Q 40 92 80 88 T 160 80 T 240 60 L 320 40"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                />
                {/* Temperature Line (Red) */}
                <path
                  d="M 0 70 Q 50 66 100 64 T 180 58 T 260 45 L 320 25"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                />
                {/* Anomaly Score Line (Amber) */}
                <path
                  d="M 0 110 Q 60 108 120 106 T 200 98 T 270 85 L 320 70"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="2 2"
                />

                <circle cx="280" cy="50" r="3.5" fill="#2563eb" />
                <circle cx="280" cy="38" r="3.5" fill="#ef4444" />
                <circle cx="280" cy="78" r="3.5" fill="#f59e0b" />
              </svg>
            </div>

            {/* Hover Tooltip Box */}
            <div className="absolute top-1 right-12 bg-white/95 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200 shadow-md text-[10px] space-y-1">
              <span className="font-bold text-slate-900 block border-b border-slate-100 pb-0.5">
                Apr 26, 10:30 AM
              </span>
              <div className="flex items-center gap-1.5 text-blue-600 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span>Vibration: 8.4 mm/s</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-600 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                <span>Temperature: 112°C</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-600 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                <span>Anomaly: 0.78</span>
              </div>
            </div>

            <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1">
              <span>Mar 29</span>
              <span>Apr 5</span>
              <span>Apr 12</span>
              <span>Apr 19</span>
              <span>Apr 26</span>
            </div>
          </div>
        </div>

        {/* Key Sensor Indicators (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Key Sensor Indicators</h2>
            <span className="text-[10px] font-mono text-slate-400">6 channels</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Vibration */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-500 font-semibold block">Vibration</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-extrabold text-slate-900 text-sm">8.4</span>
                <span className="text-[10px] text-slate-500">mm/s</span>
              </div>
              <span className="text-[10px] text-rose-600 font-bold block">↑ 240%</span>
            </div>

            {/* Temperature */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-500 font-semibold block">Temperature</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-extrabold text-slate-900 text-sm">112</span>
                <span className="text-[10px] text-slate-500">°C</span>
              </div>
              <span className="text-[10px] text-rose-600 font-bold block">↑ 46%</span>
            </div>

            {/* Crest Factor */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-500 font-semibold block">Crest Factor</span>
              <span className="font-extrabold text-slate-900 text-sm block mt-0.5">6.2</span>
              <span className="text-[10px] text-purple-600 font-bold block">↑ 180%</span>
            </div>

            {/* Kurtosis */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-500 font-semibold block">Kurtosis</span>
              <span className="font-extrabold text-slate-900 text-sm block mt-0.5">8.4</span>
              <span className="text-[10px] text-blue-600 font-bold block">↑ 210%</span>
            </div>

            {/* Spindle Speed */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-500 font-semibold block">Spindle Speed</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-extrabold text-slate-900 text-sm">9,850</span>
                <span className="text-[10px] text-slate-500">rpm</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-bold block">↓ 2%</span>
            </div>

            {/* Power Consumption */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-500 font-semibold block">Power Cons.</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-extrabold text-slate-900 text-sm">28.4</span>
                <span className="text-[10px] text-slate-500">kW</span>
              </div>
              <span className="text-[10px] text-amber-600 font-bold block">↑ 12%</span>
            </div>
          </div>
        </div>

        {/* Operational Status (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">Operational Status</h2>

          {/* Running State */}
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-bold text-emerald-900 text-xs block leading-tight">Running</span>
                <span className="text-[10px] text-slate-500">Since 2h 14m</span>
              </div>
              <span className="ml-auto text-xs font-bold text-slate-700">76% Load</span>
            </div>

            <div className="w-full bg-emerald-200/70 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: '76%' }} />
            </div>
          </div>

          {/* Current Program info */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-semibold">Current Program</span>
              <span className="font-bold text-slate-900">PROD-4473</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-semibold">Cycle Time</span>
              <span className="font-bold text-slate-900">4.2 min</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-semibold">Parts Count</span>
              <span className="font-bold text-slate-900">128 / 250</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-semibold">Next Changeover</span>
              <span className="font-bold text-slate-900">2h 16m</span>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: Performance Overview + Downtime Analysis + Production Contribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Performance Overview (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Performance Overview</h2>
            <select
              value={perfTimeRange}
              onChange={(e) => setPerfTimeRange(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option>Last 30 days</option>
              <option>Last 7 days</option>
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-sm font-bold text-slate-900 block">62.4%</span>
              <span className="text-[10px] text-slate-500 font-medium">OEE</span>
              <span className="text-[9px] text-rose-600 font-bold block">↓ 18%</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-sm font-bold text-slate-900 block">76%</span>
              <span className="text-[10px] text-slate-500 font-medium">Utilization</span>
              <span className="text-[9px] text-emerald-600 font-bold block">↑ 4%</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-sm font-bold text-slate-900 block">5.2 min</span>
              <span className="text-[10px] text-slate-500 font-medium">Avg Cycle</span>
              <span className="text-[9px] text-emerald-600 font-bold block">↓ 12%</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-sm font-bold text-slate-900 block">12,428</span>
              <span className="text-[10px] text-slate-500 font-medium">Parts</span>
              <span className="text-[9px] text-emerald-600 font-bold block">↑ 6%</span>
            </div>
          </div>

          {/* Bar Chart Simulation */}
          <div className="pt-2">
            <div className="h-28 w-full flex items-end justify-between gap-1.5 px-2">
              {[45, 52, 60, 48, 70, 85, 62, 58, 74, 90, 82, 65, 50, 42].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <div
                    className="w-full rounded-t bg-blue-500/80 hover:bg-blue-600 transition-colors"
                    style={{ height: `${val}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1 border-t border-slate-100 pt-1">
              <span>Mar 29</span>
              <span>Apr 5</span>
              <span>Apr 12</span>
              <span>Apr 19</span>
              <span>Apr 26</span>
            </div>
          </div>
        </div>

        {/* Downtime Analysis (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Downtime Analysis</h2>
            <select
              value={downtimeTimeRange}
              onChange={(e) => setDowntimeTimeRange(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option>Last 30 days</option>
              <option>Last 7 days</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            {/* Donut Chart representation */}
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="4"
                  strokeDasharray="42, 100"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="4"
                  strokeDasharray="28, 100"
                  strokeDashoffset="-42"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="4"
                  strokeDasharray="16, 100"
                  strokeDashoffset="-70"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-[11px] font-black text-slate-900 block leading-tight">18.6 hrs</span>
                <span className="text-[8px] text-slate-400 block">Total</span>
              </div>
            </div>

            {/* Downtime categories */}
            <div className="flex-1 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Unplanned Breakdown</span>
                </span>
                <span className="font-bold text-slate-900">42% (7.8h)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Planned Maint.</span>
                </span>
                <span className="font-bold text-slate-900">28% (5.2h)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Setup & Changeover</span>
                </span>
                <span className="font-bold text-slate-900">16% (3.0h)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>Tooling Issue</span>
                </span>
                <span className="font-bold text-slate-900">8% (1.5h)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Production Contribution (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Production Contribution</h2>
            <span className="text-[10px] text-slate-400 font-mono">30d</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Revenue Contribution</span>
                <span className="font-bold text-slate-900 text-sm">$284K</span>
              </div>
              <span className="text-emerald-600 font-bold text-[10px]">↑ 12%</span>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Total Plant Output</span>
                <span className="font-bold text-slate-900 text-sm">8.6%</span>
              </div>
              <span className="text-slate-500 text-[10px]">Tier 1 Asset</span>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Active Orders</span>
                <span className="font-bold text-slate-900 text-sm">24 Orders</span>
              </div>
              <span className="text-amber-600 font-bold text-[10px]">3 at risk</span>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Quality Rate</span>
                <span className="font-bold text-slate-900 text-sm">98.1%</span>
              </div>
              <span className="text-emerald-600 font-bold text-[10px]">99.4% target</span>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3: Components Health + Spare Parts + Business Impact + Recent Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Components Health */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Components Health</h2>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
              View all
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Spindle Assembly */}
            <div className="p-2.5 rounded-xl border border-rose-200 bg-rose-50/40 space-y-1.5">
              <div className="relative w-full h-12 rounded-lg overflow-hidden bg-white border border-rose-100">
                <Image
                  src="https://picsum.photos/seed/spindle-bearing-assembly/200/100"
                  alt="Spindle Assembly"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-xs block leading-tight">Spindle Assy</span>
                <span className="text-[10px] text-rose-600 font-bold block mt-0.5">● Critical (38%)</span>
                <span className="text-[9px] text-slate-500 block">Early bearing wear</span>
              </div>
            </div>

            {/* Servo Motor */}
            <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
              <div className="relative w-full h-12 rounded-lg overflow-hidden bg-white border border-slate-200">
                <Image
                  src="https://picsum.photos/seed/servo-motor-industrial/200/100"
                  alt="Servo Motor"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-xs block leading-tight">Servo Motor</span>
                <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">● Good (92%)</span>
                <span className="text-[9px] text-slate-500 block">Normal parameters</span>
              </div>
            </div>

            {/* Gearbox */}
            <div className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-1.5">
              <div className="relative w-full h-12 rounded-lg overflow-hidden bg-white border border-amber-100">
                <Image
                  src="https://picsum.photos/seed/planetary-gearbox-plant/200/100"
                  alt="Gearbox"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-xs block leading-tight">Gearbox</span>
                <span className="text-[10px] text-amber-600 font-bold block mt-0.5">● Warning (68%)</span>
                <span className="text-[9px] text-slate-500 block">Increased vibration</span>
              </div>
            </div>

            {/* Coolant System */}
            <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
              <div className="relative w-full h-12 rounded-lg overflow-hidden bg-white border border-slate-200">
                <Image
                  src="https://picsum.photos/seed/coolant-system-pump/200/100"
                  alt="Coolant System"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-xs block leading-tight">Coolant Sys</span>
                <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">● Good (88%)</span>
                <span className="text-[9px] text-slate-500 block">Normal flow</span>
              </div>
            </div>
          </div>
        </div>

        {/* Spare Parts Availability */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Spare Parts Readiness</h2>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
              View all
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block leading-tight">Spindle Bearing (SKM-6208)</span>
                <span className="text-[10px] text-slate-400">Lead time: 3 days</span>
              </div>
              <span className="text-emerald-700 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                In stock (4)
              </span>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block leading-tight">Coolant Filter (CF-100)</span>
                <span className="text-[10px] text-slate-400">Lead time: 7 days</span>
              </div>
              <span className="text-amber-700 font-bold text-[10px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Low stock (2)
              </span>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block leading-tight">Servo Drive (SD-440)</span>
                <span className="text-[10px] text-slate-400">Lead time: 5 days</span>
              </div>
              <span className="text-emerald-700 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                In stock (6)
              </span>
            </div>
          </div>
        </div>

        {/* Business Impact */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Business Impact</h2>
            <span className="text-xs font-semibold text-slate-500">This Month</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-500 font-medium block">Downtime Cost</span>
              <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">$3.2K</span>
              <span className="text-[9px] text-slate-400">per hour</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-500 font-medium block">Rev. Contribution</span>
              <span className="font-extrabold text-emerald-600 text-sm mt-0.5 block">$284K</span>
              <span className="text-[9px] text-slate-400">Monthly</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-500 font-medium block">Potential Loss</span>
              <span className="font-extrabold text-rose-600 text-sm mt-0.5 block">$72K</span>
              <span className="text-[9px] text-slate-400">Unmitigated</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-500 font-medium block">Replacement Val</span>
              <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">$450K</span>
              <span className="text-[9px] text-slate-400">Capital Asset</span>
            </div>
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Recent Events</h2>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
              View all
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-700 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                <span className="truncate">Vibration anomaly detected</span>
              </span>
              <span className="text-[10px] text-slate-400 shrink-0 font-mono">2h ago</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-700 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span className="truncate">Spindle temperature high</span>
              </span>
              <span className="text-[10px] text-slate-400 shrink-0 font-mono">5h ago</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-700 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                <span className="truncate">Coolant quality low</span>
              </span>
              <span className="text-[10px] text-slate-400 shrink-0 font-mono">12h ago</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-700 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="truncate">Program change (PROD-4473)</span>
              </span>
              <span className="text-[10px] text-slate-400 shrink-0 font-mono">1d ago</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-700 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                <span className="truncate">Planned maintenance completed</span>
              </span>
              <span className="text-[10px] text-slate-400 shrink-0 font-mono">3d ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
