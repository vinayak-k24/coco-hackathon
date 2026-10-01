'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Globe,
  PieChart,
  BarChart3,
  Clock,
  Wrench,
  ShieldCheck,
  Package,
  Layers,
  Sparkles,
  ChevronDown,
  ArrowRight,
  Zap,
  Activity,
  Award,
  Users,
  Target,
  Bot,
  ShieldAlert,
  Flame,
  FileCheck,
  ChevronRight,
} from 'lucide-react';

interface ExecutiveBriefingHubProps {
  onNavigateToAsset?: (assetId: string) => void;
  onNavigateToSupplyChain?: () => void;
  onNavigateToFinance?: () => void;
}

export default function ExecutiveBriefingHub({
  onNavigateToAsset,
  onNavigateToSupplyChain,
  onNavigateToFinance,
}: ExecutiveBriefingHubProps = {}) {
  const [selectedRange, setSelectedRange] = useState('Apr 28, 2025 – May 4, 2025');
  const [selectedPlant, setSelectedPlant] = useState('All Plants');
  const [finTrendRange, setFinTrendRange] = useState('Last 12 months');
  const [prodRange, setProdRange] = useState('This Quarter');
  const [costRange, setCostRange] = useState('This Quarter');
  const [forecastRange, setForecastRange] = useState('Next 6 Months');
  const [selectedScenario, setSelectedScenario] = useState<number>(2);

  // Modal for executive action approval
  const [approvedAction, setApprovedAction] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      {/* Top Header & Date/Plant Selectors */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Executive Intelligence & Strategic Briefing Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            AI-powered insights to run a smarter, safer, and more profitable manufacturing business.
          </p>
        </div>

        {/* Date and Plant Picker */}
        <div className="flex items-center gap-2 text-xs self-start lg:self-auto">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs font-semibold text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Apr 28, 2025 – May 4, 2025</span>
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs font-semibold text-slate-700">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedPlant}
              onChange={(e) => setSelectedPlant(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option>All Plants</option>
              <option>Riverside (USA)</option>
              <option>Pune (India)</option>
              <option>Munich (Germany)</option>
              <option>Austin (USA)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Top Executive Briefing Banner (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: AI Executive Briefing Narrative (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Bot className="w-5 h-5" />
            </div>

            <div className="space-y-0.5">
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                AI Executive Briefing
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Good morning, Alex.
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Overall, the business is performing well with <strong className="text-slate-900">82% plant OEE</strong>, but there are emerging risks that need executive attention. We are forecasting <span className="text-rose-600 font-bold">$2.4M revenue at risk</span> due to potential equipment failures and supplier delays. Proactive maintenance, critical spare-part procurement, and focus on Line 2 bottleneck can unlock <strong className="text-emerald-700">$1.8M in additional value</strong> over the next 90 days.
          </p>
        </div>

        {/* Middle: Key Operational Bullets (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-2">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
            Operational Highlights
          </span>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
              <span>Production is <strong>12% higher</strong> than last month, driven by strong demand.</span>
            </div>
            <div className="flex items-start gap-2 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-rose-500 mt-1 shrink-0" />
              <span><strong>3 critical assets</strong> may fail within 14 days, risking $1.2M in lost revenue.</span>
            </div>
            <div className="flex items-start gap-2 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-amber-500 mt-1 shrink-0" />
              <span>Supplier delays could impact <strong>2 customer orders</strong> worth $480K.</span>
            </div>
            <div className="flex items-start gap-2 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
              <span>Maintenance initiatives have already avoided <strong>$2.1M in costs</strong> this quarter.</span>
            </div>
            <div className="flex items-start gap-2 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-teal-500 mt-1 shrink-0" />
              <span>Sustainability is ahead of target, down <strong>18% in energy consumption</strong>.</span>
            </div>
          </div>
        </div>

        {/* Right: Top Executive Actions (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Top Executive Actions</h2>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
              View All
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <button
              onClick={() => setApprovedAction('Approve $280K for critical spare parts (MotionTech)')}
              className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 transition-colors flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                  1
                </span>
                <span className="font-semibold text-slate-800 text-[11px] group-hover:text-blue-700">
                  Approve $280K for critical spare parts
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
            </button>

            <button
              onClick={() => setApprovedAction('Schedule shutdown for CNC-02 within 14 days')}
              className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 transition-colors flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                  2
                </span>
                <span className="font-semibold text-slate-800 text-[11px] group-hover:text-blue-700">
                  Schedule shutdown for CNC-02 in 14d
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
            </button>

            <button
              onClick={() => setApprovedAction('Expedite supplier for hydraulic valves')}
              className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 transition-colors flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                  3
                </span>
                <span className="font-semibold text-slate-800 text-[11px] group-hover:text-blue-700">
                  Expedite supplier for hydraulic valves
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
            </button>

            <button
              onClick={() => setApprovedAction('Review capacity plan for Q3 demand surge')}
              className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 transition-colors flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                  4
                </span>
                <span className="font-semibold text-slate-800 text-[11px] group-hover:text-blue-700">
                  Review capacity plan for Q3 demand surge
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
            </button>
          </div>
        </div>
      </div>

      {/* TOP KPI CARDS (8 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
        {/* 1. Revenue at Risk */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-1.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 block leading-tight">$2.4M</span>
          <span className="text-[11px] font-semibold text-slate-600 block mt-0.5">Revenue at Risk</span>
          <span className="text-[10px] text-rose-600 font-bold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-2.5 h-2.5" /> ↑ 18% vs last month
          </span>
        </div>

        {/* 2. Cost Avoided */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 block leading-tight">$1.8M</span>
          <span className="text-[11px] font-semibold text-slate-600 block mt-0.5">Cost Avoided</span>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-2.5 h-2.5" /> ↑ 32% vs last qtr
          </span>
        </div>

        {/* 3. Plant OEE */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-1.5">
            <Activity className="w-4 h-4" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 block leading-tight">82.1%</span>
          <span className="text-[11px] font-semibold text-slate-600 block mt-0.5">Plant OEE</span>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-2.5 h-2.5" /> ↑ 4.3% vs last mo
          </span>
        </div>

        {/* 4. Order Fulfillment */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5">
            <Target className="w-4 h-4" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 block leading-tight">95.6%</span>
          <span className="text-[11px] font-semibold text-slate-600 block mt-0.5">Order Fulfillment</span>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-2.5 h-2.5" /> ↑ 6.2% vs last mo
          </span>
        </div>

        {/* 5. Predicted Downtime */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 block leading-tight">42 hrs</span>
          <span className="text-[11px] font-semibold text-slate-600 block mt-0.5">Pred. Downtime</span>
          <span className="text-[10px] text-rose-600 font-bold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-2.5 h-2.5" /> ↑ 35% vs last mo
          </span>
        </div>

        {/* 6. Maintenance ROI */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-1.5">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 block leading-tight">3.8x</span>
          <span className="text-[11px] font-semibold text-slate-600 block mt-0.5">Maintenance ROI</span>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-2.5 h-2.5" /> ↑ 28% vs last yr
          </span>
        </div>

        {/* 7. Workforce Utilization */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1.5">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 block leading-tight">87%</span>
          <span className="text-[11px] font-semibold text-slate-600 block mt-0.5">Workforce Util.</span>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-2.5 h-2.5" /> ↑ 6% vs last mo
          </span>
        </div>

        {/* 8. Customer Risk Exposure */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-1.5">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 block leading-tight">$1.2M</span>
          <span className="text-[11px] font-semibold text-slate-600 block mt-0.5">Customer Risk</span>
          <span className="text-[10px] text-rose-600 font-bold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-2.5 h-2.5" /> ↑ 25% vs last mo
          </span>
        </div>
      </div>

      {/* ROW 1: Financial Performance Trend + Operational Performance + Strategic Risk Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Financial Performance Trend (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Financial Performance Trend</h2>
            <select
              value={finTrendRange}
              onChange={(e) => setFinTrendRange(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 focus:outline-none cursor-pointer"
            >
              <option>Last 12 months</option>
              <option>Last 6 months</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-slate-900 text-sm block">$48.2M</span>
              <span className="text-[10px] text-slate-500 font-medium">Revenue</span>
              <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">↑ 14%</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-slate-900 text-sm block">$6.8M</span>
              <span className="text-[10px] text-slate-500 font-medium">EBITDA</span>
              <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">↑ 22%</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-blue-600 text-sm block">18.4%</span>
              <span className="text-[10px] text-slate-500 font-medium">Margin</span>
              <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">↑ 3.8%</span>
            </div>
          </div>

          {/* Bar & Trend Chart */}
          <div className="pt-1">
            <div className="h-32 w-full flex items-end justify-between gap-1 px-1">
              {[38, 42, 45, 50, 52, 58, 62, 65, 70, 75, 80, 85].map((val, idx) => (
                <div key={idx} className="flex-1 flex items-end justify-center gap-0.5 h-full">
                  <div className="w-1.5 bg-blue-600 rounded-t" style={{ height: `${val}%` }} />
                  <div className="w-1.5 bg-sky-400 rounded-t" style={{ height: `${val * 0.35}%` }} />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1 border-t border-slate-100 pt-1">
              <span>Jan</span>
              <span>Mar</span>
              <span>May</span>
              <span>Jul</span>
              <span>Sep</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </div>
        </div>

        {/* Operational Performance (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Production & Operational Performance</h2>
            <select
              value={prodRange}
              onChange={(e) => setProdRange(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 focus:outline-none cursor-pointer"
            >
              <option>This Quarter</option>
              <option>Last Quarter</option>
            </select>
          </div>

          <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
            <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-slate-900 text-xs block">12,428</span>
              <span className="text-[9px] text-slate-500 font-medium">Units</span>
              <span className="text-[8px] text-emerald-600 font-bold block mt-0.5">↑ 12%</span>
            </div>
            <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-slate-900 text-xs block">95.6%</span>
              <span className="text-[9px] text-slate-500 font-medium">Fulfill</span>
              <span className="text-[8px] text-emerald-600 font-bold block mt-0.5">↑ 6.2%</span>
            </div>
            <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-slate-900 text-xs block">82.1%</span>
              <span className="text-[9px] text-slate-500 font-medium">OEE</span>
              <span className="text-[8px] text-emerald-600 font-bold block mt-0.5">↑ 4.3%</span>
            </div>
            <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-emerald-600 text-xs block">2.1%</span>
              <span className="text-[9px] text-slate-500 font-medium">Defects</span>
              <span className="text-[8px] text-emerald-600 font-bold block mt-0.5">↓ 28%</span>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="pt-1">
            <div className="h-32 w-full flex items-end justify-between gap-1.5 px-1">
              {[50, 55, 60, 68, 70, 75, 78, 80, 85, 82, 88, 92].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col justify-end items-center h-full">
                  <div className="w-full bg-blue-500 rounded-t" style={{ height: `${val}%` }} />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1 border-t border-slate-100 pt-1">
              <span>Jan</span>
              <span>Mar</span>
              <span>May</span>
              <span>Jul</span>
              <span>Sep</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </div>
        </div>

        {/* Strategic Risk Matrix (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Strategic Risk Matrix</h2>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
              View All
            </button>
          </div>

          <div className="flex items-center gap-3 pt-1">
            {/* 2D Scatter Matrix Representation */}
            <div className="relative w-48 h-36 border border-slate-200 rounded-xl bg-slate-50/50 p-2 text-[9px] font-mono text-slate-400 shrink-0">
              {/* Axes lines */}
              <div className="absolute left-8 top-0 bottom-6 w-px bg-slate-200" />
              <div className="absolute left-8 right-2 bottom-6 h-px bg-slate-200" />

              <span className="absolute -left-6 top-1/2 -rotate-90 text-[8px] uppercase">Impact</span>
              <span className="absolute left-1/2 bottom-1 -translate-x-1/2 text-[8px] uppercase">Likelihood</span>

              {/* Scatter Bubbles */}
              {/* Equipment Failures */}
              <div
                title="Equipment Failures ($1.2M risk)"
                className="absolute left-16 top-4 w-4 h-4 rounded-full bg-rose-500/80 border border-white flex items-center justify-center text-[7px] font-bold text-white shadow-xs cursor-pointer hover:scale-125 transition-transform"
              >
                EF
              </div>
              {/* Supplier Delays */}
              <div
                title="Supplier Delays ($480K risk)"
                className="absolute left-28 top-10 w-4 h-4 rounded-full bg-amber-500/80 border border-white flex items-center justify-center text-[7px] font-bold text-white shadow-xs cursor-pointer hover:scale-125 transition-transform"
              >
                SD
              </div>
              {/* Workforce Shortage */}
              <div
                title="Workforce Shortage ($260K risk)"
                className="absolute left-36 top-16 w-3.5 h-3.5 rounded-full bg-blue-500/80 border border-white flex items-center justify-center text-[7px] font-bold text-white shadow-xs cursor-pointer hover:scale-125 transition-transform"
              >
                WS
              </div>
              {/* Demand Surge */}
              <div
                title="Demand Surge ($320K risk)"
                className="absolute left-20 top-18 w-3.5 h-3.5 rounded-full bg-amber-500/80 border border-white flex items-center justify-center text-[7px] font-bold text-white shadow-xs cursor-pointer hover:scale-125 transition-transform"
              >
                DS
              </div>
            </div>

            {/* Risk Category Pill List */}
            <div className="flex-1 space-y-1 text-[11px]">
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" />Operational</span>
                <span className="font-bold text-slate-900">3 risks</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" />Financial</span>
                <span className="font-bold text-slate-900">2 risks</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500" />Supply Chain</span>
                <span className="font-bold text-slate-900">3 risks</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" />Workforce</span>
                <span className="font-bold text-slate-900">2 risks</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-teal-500" />Safety</span>
                <span className="font-bold text-slate-900">1 risk</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: Cost Breakdown + Forecast + What-If Scenario Planning */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Cost Breakdown (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Cost Breakdown (This Quarter)</h2>
            <select
              value={costRange}
              onChange={(e) => setCostRange(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 focus:outline-none cursor-pointer"
            >
              <option>This Quarter</option>
              <option>Year to Date</option>
            </select>
          </div>

          <div className="flex items-center gap-4 pt-1">
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="34, 100" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="17, 100" strokeDashoffset="-34" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="11, 100" strokeDashoffset="-51" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#8b5cf6" strokeWidth="4" strokeDasharray="15, 100" strokeDashoffset="-62" />
              </svg>
              <div className="absolute text-center">
                <span className="text-xs font-black text-slate-900 block leading-tight">$12.4M</span>
                <span className="text-[8px] text-slate-400 block uppercase">Total Cost</span>
              </div>
            </div>

            <div className="flex-1 space-y-1 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Raw Materials</span>
                <span className="font-bold text-slate-900">34% ($4.2M)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Labor</span>
                <span className="font-bold text-slate-900">17% ($2.1M)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Maintenance</span>
                <span className="font-bold text-slate-900">11% ($1.4M)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Energy & Utilities</span>
                <span className="font-bold text-slate-900">9% ($1.1M)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Logistics & Freight</span>
                <span className="font-bold text-slate-900">15% ($1.8M)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Forecast: Revenue, Cost & Profitability (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Forecast: Revenue, Cost & Profit</h2>
            <select
              value={forecastRange}
              onChange={(e) => setForecastRange(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 focus:outline-none cursor-pointer"
            >
              <option>Next 6 Months</option>
              <option>Full Year</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-slate-900 text-sm block">$62.4M</span>
              <span className="text-[10px] text-slate-500 font-medium">Revenue</span>
              <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">↑ 18%</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-slate-900 text-sm block">$8.9M</span>
              <span className="text-[10px] text-slate-500 font-medium">EBITDA</span>
              <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">↑ 24%</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-emerald-600 text-sm block">22.1%</span>
              <span className="text-[10px] text-slate-500 font-medium">Margin</span>
              <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">↑ 4.2%</span>
            </div>
          </div>

          {/* Line Chart */}
          <div className="pt-1">
            <div className="h-32 w-full">
              <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
                {/* Revenue (Blue upward) */}
                <path d="M 0 80 Q 70 70 150 50 T 300 20" fill="none" stroke="#2563eb" strokeWidth="2.5" />
                {/* Cost (Orange) */}
                <path d="M 0 95 Q 70 90 150 80 T 300 65" fill="none" stroke="#f59e0b" strokeWidth="2" />
                {/* EBITDA (Green) */}
                <path d="M 0 110 Q 70 105 150 95 T 300 80" fill="none" stroke="#10b981" strokeWidth="2" />
              </svg>
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 font-mono border-t border-slate-100 pt-1">
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
            </div>
          </div>
        </div>

        {/* What-If Scenario Planning (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">What-If Scenario Planning</h2>
            <span className="text-xs font-semibold text-slate-500">Compare</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Scenario 1 */}
            <div
              onClick={() => setSelectedScenario(1)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                selectedScenario === 1 ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 bg-slate-50'
              }`}
            >
              <span className="font-bold text-slate-900 block text-[11px]">1. Current Plan</span>
              <span className="text-[10px] text-slate-500 block">Baseline</span>
              <div className="flex justify-between items-baseline mt-1 text-[11px]">
                <strong className="text-slate-900">$48.2M</strong>
                <span className="text-slate-600 font-medium">18.4%</span>
              </div>
            </div>

            {/* Scenario 2 */}
            <div
              onClick={() => setSelectedScenario(2)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                selectedScenario === 2 ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-400' : 'border-slate-200 bg-slate-50'
              }`}
            >
              <span className="font-bold text-emerald-900 block text-[11px]">2. +Maint (+$500K)</span>
              <span className="text-[10px] text-emerald-700 block font-semibold">Recommended</span>
              <div className="flex justify-between items-baseline mt-1 text-[11px]">
                <strong className="text-emerald-900">$50.8M</strong>
                <span className="text-emerald-700 font-bold">20.1%</span>
              </div>
            </div>

            {/* Scenario 3 */}
            <div
              onClick={() => setSelectedScenario(3)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                selectedScenario === 3 ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 bg-slate-50'
              }`}
            >
              <span className="font-bold text-slate-900 block text-[11px]">3. Delay Maint.</span>
              <span className="text-[10px] text-rose-600 block">Run to Risk</span>
              <div className="flex justify-between items-baseline mt-1 text-[11px]">
                <strong className="text-rose-900">$45.1M</strong>
                <span className="text-rose-700 font-bold">15.2%</span>
              </div>
            </div>

            {/* Scenario 4 */}
            <div
              onClick={() => setSelectedScenario(4)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                selectedScenario === 4 ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 bg-slate-50'
              }`}
            >
              <span className="font-bold text-slate-900 block text-[11px]">4. +20% Capacity</span>
              <span className="text-[10px] text-blue-600 block">Aggressive</span>
              <div className="flex justify-between items-baseline mt-1 text-[11px]">
                <strong className="text-slate-900">$57.6M</strong>
                <span className="text-blue-700 font-bold">21.8%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3: Top Value Drivers (ROI) + Customer Order Impact + Strategic Initiatives */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-5">
        {/* Top Value Drivers (4 cols) */}
        <div className="xl:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Top Value Drivers (ROI Ranking)</h2>
            <span className="text-xs font-semibold text-slate-500">By ROI</span>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { id: 'CNC-02', name: 'CNC-02', roi: '8.4x', value: '$2.1M', risk: 'High', color: 'text-rose-600' },
              { id: 'Packaging-03', name: 'Packaging Line', roi: '4.6x', value: '$1.2M', risk: 'Medium', color: 'text-amber-600' },
              { id: 'Assembly-01', name: 'Assembly Line', roi: '3.9x', value: '$980K', risk: 'Medium', color: 'text-amber-600' },
              { id: 'Compressor-04', name: 'Compressor-01', roi: '3.1x', value: '$620K', risk: 'Low', color: 'text-emerald-600' },
              { id: 'Chiller-01', name: 'Chiller-01', roi: '2.8x', value: '$540K', risk: 'Low', color: 'text-emerald-600' },
            ].map((driver, idx) => (
              <div
                key={driver.id}
                onClick={() => onNavigateToAsset && onNavigateToAsset('CNC-02')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-white border border-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-slate-900">{driver.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-blue-600">{driver.roi}</span>
                  <span className="font-semibold text-slate-700">{driver.value}</span>
                  <span className={`text-[10px] font-bold ${driver.color}`}>{driver.risk}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Order Impact (4 cols) */}
        <div className="xl:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Customer Order Impact</h2>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
              View All
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="42, 100" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="33, 100" strokeDashoffset="-42" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#eab308" strokeWidth="4" strokeDasharray="25, 100" strokeDashoffset="-75" />
              </svg>
              <div className="absolute text-center">
                <span className="text-xs font-black text-slate-900 block leading-tight">12</span>
                <span className="text-[7px] text-slate-400 block uppercase">At Risk</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs flex-1">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
                <span className="text-slate-600">Revenue at Risk:</span>
                <strong className="text-rose-600 font-extrabold">$2.4M</strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
                <span className="text-slate-600">Key Customers Impacted:</span>
                <strong className="text-slate-900">3 Customers</strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
                <span className="text-slate-600">Potential Penalties:</span>
                <strong className="text-amber-600 font-extrabold">2 Contracts</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Strategic Initiatives & Business Outcomes (4 cols) */}
        <div className="xl:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Strategic Initiatives</h2>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
              View All
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block leading-tight">Predictive Maintenance Expansion</span>
                <span className="text-[10px] text-slate-400">Expected to avoid $2.1M in losses</span>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-emerald-600 block">$2.1M</span>
                <span className="text-[9px] text-slate-400 font-mono">Q2 2025</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block leading-tight">Supply Chain Resilience</span>
                <span className="text-[10px] text-slate-400">Reduce supplier risk by 40%</span>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-blue-600 block">$1.2M</span>
                <span className="text-[9px] text-slate-400 font-mono">Q3 2025</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block leading-tight">Capacity Expansion (Line 2)</span>
                <span className="text-[10px] text-slate-400">Increase output by 20%</span>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-purple-600 block">$3.8M</span>
                <span className="text-[9px] text-slate-400 font-mono">Q4 2025</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block leading-tight">Sustainability Initiative</span>
                <span className="text-[10px] text-slate-400">Reduce energy cost by 15%</span>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-teal-600 block">$680K</span>
                <span className="text-[9px] text-slate-400 font-mono">Q3 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Approval Confirmation Dialog */}
      {approvedAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Executive Directive Dispatched</h3>
                  <span className="text-[10px] text-slate-400">Authorized by Alex Carter (CEO)</span>
                </div>
              </div>
              <button
                onClick={() => setApprovedAction(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
              <span className="font-bold text-blue-900 block">{approvedAction}</span>
              <p className="text-[11px] text-slate-600">
                Action item has been logged into the enterprise governance queue and assigned to Plant Operations Director for immediate execution.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setApprovedAction(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold cursor-pointer hover:bg-slate-800"
              >
                Confirm & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
