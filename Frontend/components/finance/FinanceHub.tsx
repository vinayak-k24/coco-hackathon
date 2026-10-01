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
} from 'lucide-react';

export default function FinanceHub() {
  const [selectedRange, setSelectedRange] = useState('Apr 1, 2025 - Apr 30, 2025');
  const [selectedPlant, setSelectedPlant] = useState('All Plants');
  const [trendRange, setTrendRange] = useState('Last 6 months');
  const [avoidedRange, setAvoidedRange] = useState('This Month');
  const [maintRange, setMaintRange] = useState('Last 12 months');
  const [downtimeRange, setDowntimeRange] = useState('This Month');
  const [budgetRange, setBudgetRange] = useState('This Year');
  const [forecastRange, setForecastRange] = useState('Next 6 Months');
  const [selectedScenario, setSelectedScenario] = useState<number>(1);

  return (
    <div className="space-y-5">
      {/* Top Header & AI Summary Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-0.5">
            <span>Enterprise Operations</span>
            <span>•</span>
            <span className="text-blue-600 font-bold">Financial Analytics</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Financial Impact & ROI Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Connecting factory operations to business outcomes. Turning operational data into financial intelligence.
          </p>
        </div>

        {/* Date and Plant Picker */}
        <div className="flex items-center gap-2 text-xs self-start lg:self-auto">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs font-semibold text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Apr 1, 2025 – Apr 30, 2025</span>
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

      {/* AI Financial Value Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-start gap-3 z-10 max-w-3xl">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0 text-blue-300">
            <BarChart3 className="w-5 h-5 text-blue-400" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-blue-300 uppercase tracking-wider block">
              Operational excellence is delivering real financial value.
            </span>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              AI has helped avoid <strong className="text-emerald-300">$1.2M in potential losses</strong> this month through predictive maintenance, supply chain risk mitigation, and optimized production scheduling.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 z-10 shrink-0">
          <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs text-xs font-semibold text-slate-200 border border-white/10">
            ROI Multiple: 3.0x
          </span>
        </div>

        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* TOP KPI CARDS (8 KPI Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
        {/* 1. Cost Avoided */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xl font-extrabold text-slate-900 block leading-tight">$1.2M</span>
          <span className="text-[11px] font-semibold text-slate-600 block mt-0.5">Cost Avoided</span>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-2.5 h-2.5" /> ↑ 28% vs last month
          </span>
        </div>

        {/* 2. Revenue at Risk */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xl font-extrabold text-slate-900 block leading-tight">$2.4M</span>
          <span className="text-[11px] font-semibold text-slate-600 block mt-0.5">Revenue at Risk</span>
          <span className="text-[10px] text-rose-600 font-bold flex items-center gap-0.5 mt-1">
            <TrendingDown className="w-2.5 h-2.5" /> ↓ 18% vs last month
          </span>
        </div>

        {/* 3. Maintenance Spend */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xl font-extrabold text-slate-900 block leading-tight">$680K</span>
          <span className="text-[11px] font-semibold text-slate-600 block mt-0.5">Maintenance Spend</span>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-2.5 h-2.5" /> ↑ 12% vs plan
          </span>
        </div>

        {/* 4. Downtime Cost */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xl font-extrabold text-slate-900 block leading-tight">$420K</span>
          <span className="text-[11px] font-semibold text-slate-600 block mt-0.5">Downtime Cost</span>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <TrendingDown className="w-2.5 h-2.5" /> ↓ 35% vs last month
          </span>
        </div>

        {/* 5. Asset ROI */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xl font-extrabold text-slate-900 block leading-tight">186%</span>
          <span className="text-[11px] font-semibold text-slate-600 block mt-0.5">Asset ROI (avg)</span>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-2.5 h-2.5" /> ↑ 28% vs last year
          </span>
        </div>

        {/* 6. Warranty Recovery */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xl font-extrabold text-slate-900 block leading-tight">$240K</span>
          <span className="text-[11px] font-semibold text-slate-600 block mt-0.5">Warranty Recovery</span>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-2.5 h-2.5" /> ↑ 42% vs last year
          </span>
        </div>

        {/* 7. Production Losses */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xl font-extrabold text-slate-900 block leading-tight">$1.8M</span>
          <span className="text-[11px] font-semibold text-slate-600 block mt-0.5">Production Losses</span>
          <span className="text-[10px] text-rose-600 font-bold flex items-center gap-0.5 mt-1">
            <TrendingDown className="w-2.5 h-2.5" /> ↓ 22% vs last month
          </span>
        </div>

        {/* 8. Predicted Savings */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xl font-extrabold text-slate-900 block leading-tight">$3.1M</span>
          <span className="text-[11px] font-semibold text-slate-600 block mt-0.5">Predicted Savings</span>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-2.5 h-2.5" /> ↑ 35% next 6 mo
          </span>
        </div>
      </div>

      {/* ROW 1: Financial Impact Trend + Cost Breakdown + Avoided Losses */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Financial Impact Trend (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Financial Impact Trend</h2>
            <select
              value={trendRange}
              onChange={(e) => setTrendRange(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 focus:outline-none cursor-pointer"
            >
              <option>Last 6 months</option>
              <option>Last 12 months</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold text-slate-600">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Cost Avoided
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Downtime Cost
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-600" /> Maintenance Spend
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Production Losses
            </span>
          </div>

          {/* Multi-line Trend Chart */}
          <div className="relative pt-2">
            <div className="h-44 w-full">
              <svg className="w-full h-full" viewBox="0 0 340 140" preserveAspectRatio="none">
                <line x1="0" y1="20" x2="340" y2="20" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2="340" y2="60" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="0" y1="100" x2="340" y2="100" stroke="#f1f5f9" strokeDasharray="3 3" />

                {/* Cost Avoided (Green upward) */}
                <path
                  d="M 0 110 Q 70 95 140 85 T 240 50 L 340 35"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />
                {/* Production Losses (Red downward) */}
                <path
                  d="M 0 45 Q 80 50 150 70 T 250 85 L 340 95"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                />
                {/* Maintenance Spend (Blue) */}
                <path
                  d="M 0 120 Q 90 110 170 100 T 260 85 L 340 80"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2"
                />
                {/* Downtime Cost (Amber downward) */}
                <path
                  d="M 0 80 Q 90 90 170 98 T 260 110 L 340 115"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                />

                <circle cx="260" cy="50" r="4" fill="#10b981" />
              </svg>
            </div>

            {/* Peak Total Impact Pin */}
            <div className="absolute top-4 right-14 bg-white/95 backdrop-blur-xs border border-slate-200 px-2.5 py-1 rounded-xl shadow-xs text-[10px]">
              <span className="font-extrabold text-slate-900 block">$4.2M</span>
              <span className="text-[9px] text-slate-400">Total Impact</span>
            </div>

            <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1">
              <span>Nov</span>
              <span>Dec</span>
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
            </div>
          </div>
        </div>

        {/* Cost Breakdown (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Cost Breakdown (This Month)</h2>
            <span className="text-[10px] text-slate-400 font-mono">Current MTD</span>
          </div>

          <div className="flex items-center gap-4 pt-1">
            {/* Donut Chart representation */}
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="4"
                  strokeDasharray="37, 100"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="4"
                  strokeDasharray="23, 100"
                  strokeDashoffset="-37"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="4"
                  strokeDasharray="14, 100"
                  strokeDashoffset="-60"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeDasharray="8, 100"
                  strokeDashoffset="-74"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xs font-black text-slate-900 block leading-tight">$4.9M</span>
                <span className="text-[8px] text-slate-400 block uppercase">Total Impact</span>
              </div>
            </div>

            {/* Breakdown categories */}
            <div className="flex-1 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-blue-600" /> Maintenance Spend
                </span>
                <span className="font-bold text-slate-900">23% ($680K)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Downtime Cost
                </span>
                <span className="font-bold text-slate-900">14% ($420K)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> Production Losses
                </span>
                <span className="font-bold text-slate-900">37% ($1.8M)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Inventory & Supply
                </span>
                <span className="font-bold text-slate-900">8% ($390K)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-purple-500" /> Expedite Costs
                </span>
                <span className="font-bold text-slate-900">6% ($290K)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Avoided Losses (AI Impact) (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Avoided Losses (AI)</h2>
            <select
              value={avoidedRange}
              onChange={(e) => setAvoidedRange(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 focus:outline-none cursor-pointer"
            >
              <option>This Month</option>
              <option>Last Quarter</option>
            </select>
          </div>

          <div>
            <span className="text-2xl font-extrabold text-slate-900 block leading-tight">$1.2M</span>
            <span className="text-[11px] text-slate-500 font-medium">Total Cost Avoided</span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">↑ 28% vs last month</span>
          </div>

          {/* Stacked Bars representing AI attribution */}
          <div className="space-y-1.5 pt-1">
            <div className="h-24 w-full flex items-end justify-between gap-2 px-1">
              {[
                { p: 40, s: 20, o: 15 },
                { p: 45, s: 25, o: 18 },
                { p: 52, s: 30, o: 20 },
                { p: 60, s: 35, o: 25 },
                { p: 68, s: 38, o: 28 },
                { p: 75, s: 42, o: 30 },
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col justify-end h-full gap-0.5">
                  <div className="w-full bg-sky-400 rounded-t-xs" style={{ height: `${bar.o}%` }} />
                  <div className="w-full bg-emerald-500" style={{ height: `${bar.s}%` }} />
                  <div className="w-full bg-blue-600" style={{ height: `${bar.p}%` }} />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 font-mono border-t border-slate-100 pt-1">
              <span>Nov</span>
              <span>Dec</span>
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-[9px] font-semibold text-slate-600 pt-1">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-600" />Predictive</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500" />Supply</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-sky-400" />Optimization</span>
          </div>
        </div>
      </div>

      {/* ROW 2: Maintenance Investment vs Return + Downtime Impact + Budget vs Actual Spend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Maintenance Investment vs Return (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Maintenance Investment vs Return</h2>
            <select
              value={maintRange}
              onChange={(e) => setMaintRange(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 focus:outline-none cursor-pointer"
            >
              <option>Last 12 months</option>
              <option>Last 6 months</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-slate-900 text-sm block">$2.8M</span>
              <span className="text-[10px] text-slate-500 font-medium">Investment</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-emerald-600 text-sm block">$8.4M</span>
              <span className="text-[10px] text-slate-500 font-medium">Total Return</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-blue-600 text-sm block">3.0x</span>
              <span className="text-[10px] text-slate-500 font-medium">ROI</span>
            </div>
          </div>

          {/* Bar & Trend Chart */}
          <div className="pt-2">
            <div className="h-32 w-full flex items-end justify-between gap-1.5 px-1">
              {[45, 52, 60, 68, 72, 80, 85, 90, 88, 92, 95, 98].map((val, idx) => (
                <div key={idx} className="flex-1 flex items-end justify-center gap-0.5 h-full">
                  <div className="w-1.5 bg-blue-500 rounded-t" style={{ height: `${val * 0.4}%` }} />
                  <div className="w-1.5 bg-emerald-500 rounded-t" style={{ height: `${val * 0.8}%` }} />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1 border-t border-slate-100 pt-1">
              <span>May</span>
              <span>Jul</span>
              <span>Sep</span>
              <span>Nov</span>
              <span>Jan</span>
              <span>Mar</span>
              <span>Apr</span>
            </div>
          </div>
        </div>

        {/* Downtime Impact Analysis (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Downtime Impact Analysis</h2>
            <select
              value={downtimeRange}
              onChange={(e) => setDowntimeRange(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 focus:outline-none cursor-pointer"
            >
              <option>This Month</option>
              <option>Last Quarter</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-slate-900 text-sm block">42.5 hrs</span>
              <span className="text-[10px] text-slate-500 font-medium">Downtime</span>
              <span className="text-[9px] text-emerald-600 font-bold block">↓ 35%</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-amber-600 text-sm block">$420K</span>
              <span className="text-[10px] text-slate-500 font-medium">Direct Cost</span>
              <span className="text-[9px] text-emerald-600 font-bold block">↓ 35%</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-rose-600 text-sm block">$1.8M</span>
              <span className="text-[10px] text-slate-500 font-medium">Lost Prod.</span>
              <span className="text-[9px] text-emerald-600 font-bold block">↓ 22%</span>
            </div>
          </div>

          {/* Grouped Bars by Factory Subsystem */}
          <div className="pt-2">
            <div className="h-32 w-full flex items-end justify-between gap-3 px-2">
              {[
                { name: 'CNC', h: 65, c: 75 },
                { name: 'Assembly', h: 45, c: 55 },
                { name: 'Packaging', h: 30, c: 35 },
                { name: 'Paint', h: 60, c: 50 },
                { name: 'Utilities', h: 40, c: 45 },
                { name: 'Other', h: 35, c: 40 },
              ].map((col, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div className="flex items-end gap-1 h-full">
                    <div className="w-2.5 bg-blue-500 rounded-t" style={{ height: `${col.h}%` }} />
                    <div className="w-2.5 bg-amber-400 rounded-t" style={{ height: `${col.c}%` }} />
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono mt-1">{col.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Budget vs Actual Spend (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Budget vs Actual Spend</h2>
            <select
              value={budgetRange}
              onChange={(e) => setBudgetRange(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 focus:outline-none cursor-pointer"
            >
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-slate-900 text-sm block">$12.0M</span>
              <span className="text-[10px] text-slate-500 font-medium">Budget</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-slate-900 text-sm block">$9.4M</span>
              <span className="text-[10px] text-slate-500 font-medium">Actual Spend</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-emerald-600 text-sm block">78%</span>
              <span className="text-[10px] text-slate-500 font-medium">Utilization</span>
            </div>
          </div>

          {/* Progress Rows */}
          <div className="space-y-2 text-xs pt-1">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-medium text-slate-700">Maintenance</span>
                <span className="font-bold text-slate-900">82% ($4.1M / $5.0M)</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '82%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-medium text-slate-700">Spare Parts</span>
                <span className="font-bold text-slate-900">76% ($1.9M / $2.5M)</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '76%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-medium text-slate-700">External Services</span>
                <span className="font-bold text-slate-900">68% ($1.0M / $1.5M)</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '68%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-medium text-slate-700">Inventory</span>
                <span className="font-bold text-slate-900">85% ($1.7M / $2.0M)</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3: What-If Scenario Analysis + Asset ROI Ranking + Customer Order Impact + Forecasted Financial Impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-5">
        {/* What-If Scenario Analysis (3 cols) */}
        <div className="xl:col-span-3 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">What-If Scenarios</h2>
            <span className="text-[10px] text-slate-400 font-mono">Options</span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Option 1: Repair Now */}
            <div
              onClick={() => setSelectedScenario(1)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                selectedScenario === 1
                  ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-400/50'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">1. Repair Now (Recommended)</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                  Best Option
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-600 mt-1">
                <span>Cost: $280K</span>
                <span className="text-emerald-700 font-bold">5% Risk</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                $1.8M Potential Savings
              </span>
            </div>

            {/* Option 2: Delay 3 Months */}
            <div
              onClick={() => setSelectedScenario(2)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                selectedScenario === 2
                  ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-400/50'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">2. Delay 3 Months</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                  Higher Risk
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-600 mt-1">
                <span>Cost: $420K</span>
                <span className="text-amber-700 font-bold">35% Risk</span>
              </div>
              <span className="text-[10px] text-rose-600 font-semibold block mt-0.5">
                $950K Expected Loss
              </span>
            </div>

            {/* Option 3: Replace Asset */}
            <div
              onClick={() => setSelectedScenario(3)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                selectedScenario === 3
                  ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-400/50'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">3. Replace Asset</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-blue-800">
                  Long Term
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-600 mt-1">
                <span>Cost: $1.2M</span>
                <span className="text-blue-700 font-bold">2% Risk</span>
              </div>
              <span className="text-[10px] text-blue-700 font-semibold block mt-0.5">
                $2.5M 10-Yr Value
              </span>
            </div>
          </div>
        </div>

        {/* Asset ROI Ranking (3 cols) */}
        <div className="xl:col-span-3 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Asset ROI Ranking</h2>
            <span className="text-xs font-semibold text-slate-500">By ROI</span>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { rank: 1, name: 'CNC-04', roi: '320%', change: '↑ 42%' },
              { rank: 2, name: 'Packaging Line', roi: '278%', change: '↑ 18%' },
              { rank: 3, name: 'Assembly Line', roi: '196%', change: '↑ 26%' },
              { rank: 4, name: 'CNC-02', roi: '142%', change: '↑ 12%' },
              { rank: 5, name: 'Paint Line', roi: '128%', change: '↑ 8%' },
            ].map((item) => (
              <div
                key={item.rank}
                className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white border border-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                    {item.rank}
                  </span>
                  <span className="font-bold text-slate-900">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900">{item.roi}</span>
                  <span className="text-emerald-600 font-bold text-[10px]">{item.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Order Impact (3 cols) */}
        <div className="xl:col-span-3 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Customer Order Impact</h2>
            <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              3 at Risk
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-extrabold text-slate-900 block">PO-45821</span>
                <span className="text-[10px] text-rose-600 font-medium">2 days delay</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900 text-xs block">$1.2M</span>
                <span className="text-[9px] text-rose-600 font-bold">High Risk</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-extrabold text-slate-900 block">PO-44732</span>
                <span className="text-[10px] text-rose-600 font-medium">5 days delay</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900 text-xs block">$720K</span>
                <span className="text-[9px] text-rose-600 font-bold">High Risk</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-extrabold text-slate-900 block">PO-44567</span>
                <span className="text-[10px] text-amber-600 font-medium">3 days delay</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900 text-xs block">$480K</span>
                <span className="text-[9px] text-amber-600 font-bold">Medium Risk</span>
              </div>
            </div>
          </div>
        </div>

        {/* Forecasted Financial Impact (3 cols) */}
        <div className="xl:col-span-3 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Forecasted Impact</h2>
            <select
              value={forecastRange}
              onChange={(e) => setForecastRange(e.target.value)}
              className="text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-1.5 py-0.5 focus:outline-none cursor-pointer"
            >
              <option>Next 6 Months</option>
              <option>Full Year</option>
            </select>
          </div>

          <div className="relative pt-2">
            <div className="h-32 w-full">
              <svg className="w-full h-full" viewBox="0 0 240 100" preserveAspectRatio="none">
                {/* Risk Line (Red dashed upward) */}
                <path
                  d="M 0 70 Q 50 65 100 50 T 180 30 L 240 20"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                />
                {/* With Actions (Green downward) */}
                <path
                  d="M 0 70 Q 60 72 120 78 T 190 85 L 240 90"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />
                <circle cx="240" cy="20" r="3.5" fill="#ef4444" />
                <circle cx="240" cy="90" r="3.5" fill="#10b981" />
              </svg>
            </div>

            <div className="absolute top-2 right-2 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[10px]">
              <span className="text-rose-700 font-bold">$3.8M</span>
              <span className="text-slate-500 ml-1">Risk</span>
            </div>

            <div className="flex justify-between text-[9px] text-slate-400 font-mono pt-1">
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
