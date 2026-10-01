'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Globe,
  Plus,
  Clock,
  Zap,
  Layers,
  Sparkles,
  ChevronDown,
  ArrowRight,
  Gauge,
  Activity,
  Award,
  BarChart3,
  Flame,
  Radio,
  Sliders,
  Maximize2,
  PieChart,
} from 'lucide-react';

interface InsightsLabHubProps {
  onNavigateToAsset?: (assetId: string) => void;
  onNavigateToMaintenance?: () => void;
}

export default function InsightsLabHub({
  onNavigateToAsset,
  onNavigateToMaintenance,
}: InsightsLabHubProps = {}) {
  const [activeSubTab, setActiveSubTab] = useState('Overview');
  const [selectedPlant, setSelectedPlant] = useState('All Plants');
  const [oeeRange, setOeeRange] = useState('Last 30 days');
  const [reliabilityRange, setReliabilityRange] = useState('Last 6 months');
  const [downtimeRange, setDowntimeRange] = useState('This Month');
  const [failureRange, setFailureRange] = useState('Next 30 days');
  const [forecastRange, setForecastRange] = useState('Next 4 weeks');
  const [energyRange, setEnergyRange] = useState('Last 30 days');
  const [isNewAnalysisModalOpen, setIsNewAnalysisModalOpen] = useState(false);

  const subTabs = [
    { name: 'Overview', icon: Gauge },
    { name: 'Predictive Intelligence', icon: Sparkles },
    { name: 'Anomaly Detection', icon: AlertTriangle },
    { name: 'Correlation Analysis', icon: Sliders },
    { name: 'Root Cause Explorer', icon: Radio },
    { name: 'What-If Scenarios', icon: Zap },
    { name: 'Custom Analytics', icon: BarChart3 },
  ];

  return (
    <div className="space-y-5">
      {/* Top Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Insights, Analytics & Prediction Lab
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Turn manufacturing data into intelligence. Discover patterns, predict outcomes, and drive continuous improvement.
          </p>
        </div>

        {/* Date, Plant & Create Analysis Button */}
        <div className="flex items-center gap-2 text-xs self-start lg:self-auto flex-wrap">
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

          <button
            onClick={() => setIsNewAnalysisModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Analysis</span>
          </button>
        </div>
      </div>

      {/* TOP INSIGHTS CARDS STRIP (6 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3">
        {/* 1. Critical Insight */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Critical Insight</span>
            </div>
            <h3 className="font-extrabold text-slate-900 text-xs leading-snug">
              Spindle failures increasing
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              72% higher vibration patterns detected across 3 CNC machines. Risk of 4 failures in next 14 days.
            </p>
          </div>
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100">
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
              High Impact
            </span>
            <button
              onClick={() => onNavigateToAsset && onNavigateToAsset('CNC-02')}
              className="text-slate-400 hover:text-blue-600 cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. Cost Saving Opportunity */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Cost Opportunity</span>
            </div>
            <h3 className="font-extrabold text-slate-900 text-xs leading-snug">
              $1.2M potential savings
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Optimize maintenance intervals for 12 assets using AI predictions.
            </p>
          </div>
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100">
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Validated by AI
            </span>
            <button
              onClick={() => onNavigateToMaintenance && onNavigateToMaintenance()}
              className="text-slate-400 hover:text-blue-600 cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3. Production Anomaly */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Production Anomaly</span>
            </div>
            <h3 className="font-extrabold text-slate-900 text-xs leading-snug">
              Line 2 output 18% lower
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Unusual cycle time increase detected since Apr 24.
            </p>
          </div>
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100">
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              Investigate
            </span>
            <button className="text-slate-400 hover:text-blue-600 cursor-pointer">
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4. Energy Optimization */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Energy Optimization</span>
            </div>
            <h3 className="font-extrabold text-slate-900 text-xs leading-snug">
              22% higher energy usage
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Compressor systems running inefficiently during idle periods.
            </p>
          </div>
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100">
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              $180K annual savings
            </span>
            <button className="text-slate-400 hover:text-blue-600 cursor-pointer">
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 5. Quality Trend */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Quality Trend</span>
            </div>
            <h3 className="font-extrabold text-slate-900 text-xs leading-snug">
              Defect rate trending down
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              AI model shows 32% improvement in quality over last 6 weeks.
            </p>
          </div>
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100">
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
              Positive Trend
            </span>
            <button className="text-slate-400 hover:text-blue-600 cursor-pointer">
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 6. Supply Chain Risk */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Supply Chain Risk</span>
            </div>
            <h3 className="font-extrabold text-slate-900 text-xs leading-snug">
              2 key parts at risk
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Supplier delay may impact 3 customer orders in May.
            </p>
          </div>
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100">
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              Medium Risk
            </span>
            <button className="text-slate-400 hover:text-blue-600 cursor-pointer">
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="bg-white p-1.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-1 overflow-x-auto no-scrollbar">
        {subTabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeSubTab === t.name;
          return (
            <button
              key={t.name}
              onClick={() => setActiveSubTab(t.name)}
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

      {/* ROW 1: OEE Trends + Asset Reliability + Downtime Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* OEE & Performance Trends (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">OEE & Performance Trends</h2>
            <select
              value={oeeRange}
              onChange={(e) => setOeeRange(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 focus:outline-none cursor-pointer"
            >
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold text-slate-600">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600" />OEE %</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" />Availability</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" />Performance</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" />Quality</span>
          </div>

          <div className="relative pt-2">
            <div className="h-40 w-full">
              <svg className="w-full h-full" viewBox="0 0 340 120" preserveAspectRatio="none">
                {/* Availability Line (Green) */}
                <path d="M 0 45 Q 60 40 120 42 T 240 35 L 340 30" fill="none" stroke="#10b981" strokeWidth="2" />
                {/* Performance Line (Orange) */}
                <path d="M 0 60 Q 60 55 120 58 T 240 50 L 340 45" fill="none" stroke="#f59e0b" strokeWidth="2" />
                {/* OEE Line (Blue) */}
                <path d="M 0 75 Q 60 70 120 68 T 240 60 L 340 52" fill="none" stroke="#2563eb" strokeWidth="2.5" />
                {/* Quality Line (Purple) */}
                <path d="M 0 30 Q 60 25 120 28 T 240 22 L 340 20" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="3 3" />

                <circle cx="280" cy="56" r="3.5" fill="#2563eb" />
              </svg>
            </div>

            <div className="absolute top-2 right-12 bg-white/95 border border-slate-200 px-2 py-0.5 rounded-lg text-[9px] shadow-xs">
              <span className="text-slate-400 block">Apr 24</span>
              <strong className="text-blue-600 font-extrabold">OEE: 82.1%</strong>
            </div>

            <div className="flex justify-between text-[9px] text-slate-400 font-mono pt-1">
              <span>Apr 1</span>
              <span>Apr 7</span>
              <span>Apr 14</span>
              <span>Apr 21</span>
              <span>Apr 28</span>
            </div>
          </div>
        </div>

        {/* Asset Reliability Analysis (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Asset Reliability Analysis</h2>
            <select
              value={reliabilityRange}
              onChange={(e) => setReliabilityRange(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 focus:outline-none cursor-pointer"
            >
              <option>Last 6 months</option>
              <option>Last 12 months</option>
            </select>
          </div>

          <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
            <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-slate-900 text-xs block">92.4 hrs</span>
              <span className="text-[9px] text-slate-500 font-medium">MTBF</span>
              <span className="text-[8px] text-emerald-600 font-bold block mt-0.5">↑ 18%</span>
            </div>
            <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-slate-900 text-xs block">4.2 hrs</span>
              <span className="text-[9px] text-slate-500 font-medium">MTTR</span>
              <span className="text-[8px] text-emerald-600 font-bold block mt-0.5">↓ 26%</span>
            </div>
            <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-slate-900 text-xs block">96.8%</span>
              <span className="text-[9px] text-slate-500 font-medium">Reliab.</span>
              <span className="text-[8px] text-emerald-600 font-bold block mt-0.5">↑ 6%</span>
            </div>
            <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-emerald-600 text-xs block">3.1%</span>
              <span className="text-[9px] text-slate-500 font-medium">Failure</span>
              <span className="text-[8px] text-emerald-600 font-bold block mt-0.5">↓ 32%</span>
            </div>
          </div>

          {/* Dual Bar Chart */}
          <div className="pt-1">
            <div className="h-32 w-full flex items-end justify-between gap-2 px-2">
              {[
                { name: 'CNC', m: 75, r: 25 },
                { name: 'Assembly', m: 60, r: 20 },
                { name: 'Packaging', m: 68, r: 22 },
                { name: 'Utilities', m: 80, r: 18 },
                { name: 'Paint', m: 55, r: 28 },
                { name: 'Compressor', m: 70, r: 24 },
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div className="flex items-end gap-1 h-full">
                    <div className="w-2.5 bg-blue-600 rounded-t" style={{ height: `${item.m}%` }} />
                    <div className="w-2.5 bg-purple-400 rounded-t" style={{ height: `${item.r}%` }} />
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono mt-1 truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Downtime Analysis (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Downtime Analysis</h2>
            <select
              value={downtimeRange}
              onChange={(e) => setDowntimeRange(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 focus:outline-none cursor-pointer"
            >
              <option>This Month</option>
              <option>Last Month</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#2563eb" strokeWidth="4" strokeDasharray="38, 100" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="22, 100" strokeDashoffset="-38" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="15, 100" strokeDashoffset="-60" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#8b5cf6" strokeWidth="4" strokeDasharray="12, 100" strokeDashoffset="-75" />
              </svg>
              <div className="absolute text-center">
                <span className="text-[11px] font-black text-slate-900 block leading-tight">186 hrs</span>
                <span className="text-[7px] text-slate-400 block uppercase">Total</span>
              </div>
            </div>

            <div className="flex-1 space-y-1 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 truncate">Equipment Failure</span>
                <strong className="text-slate-900">38%</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 truncate">Setup & Changeover</span>
                <strong className="text-slate-900">22%</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 truncate">Planned Maint.</span>
                <strong className="text-slate-900">15%</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 truncate">Material Shortage</span>
                <strong className="text-slate-900">12%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: Failure Probability + Bottleneck Prediction + Energy Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Failure Probability (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Predictive Failure Probability</h2>
            <select
              value={failureRange}
              onChange={(e) => setFailureRange(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 focus:outline-none cursor-pointer"
            >
              <option>Next 30 days</option>
              <option>Next 60 days</option>
            </select>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { id: 'CNC-02', part: 'Spindle Bearing', prob: '78%', risk: 'High', color: 'bg-rose-500 text-rose-700' },
              { id: 'Compressor-01', part: 'Motor', prob: '62%', risk: 'High', color: 'bg-rose-500 text-rose-700' },
              { id: 'Assembly-03', part: 'Gearbox', prob: '38%', risk: 'Medium', color: 'bg-amber-500 text-amber-700' },
              { id: 'Paint Robot-01', part: 'Servo Motor', prob: '28%', risk: 'Medium', color: 'bg-amber-500 text-amber-700' },
              { id: 'Packaging-05', part: 'Drive', prob: '12%', risk: 'Low', color: 'bg-emerald-500 text-emerald-700' },
            ].map((asset) => (
              <div
                key={asset.id}
                onClick={() => onNavigateToAsset && onNavigateToAsset('CNC-02')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div>
                  <strong className="text-slate-900 block">{asset.id}</strong>
                  <span className="text-[10px] text-slate-500">{asset.part}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-slate-900 text-xs">{asset.prob}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-slate-200 ${asset.color.split(' ')[1]}`}>
                    {asset.risk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottleneck Prediction (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Production & Bottleneck Prediction</h2>
            <select
              value={forecastRange}
              onChange={(e) => setForecastRange(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 focus:outline-none cursor-pointer"
            >
              <option>Next 4 weeks</option>
              <option>Next 8 weeks</option>
            </select>
          </div>

          <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-600">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600" />Actual</span>
            <span className="flex items-center gap-1"><span className="w-3 border-t-2 border-dashed border-blue-500" />Forecast</span>
            <span className="flex items-center gap-1"><span className="w-3 border-t-2 border-dashed border-emerald-500" />Capacity</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" />Bottleneck</span>
          </div>

          <div className="relative pt-2">
            <div className="h-36 w-full">
              <svg className="w-full h-full" viewBox="0 0 340 120" preserveAspectRatio="none">
                {/* Capacity Line */}
                <path d="M 0 30 Q 80 25 170 32 T 340 30" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />
                {/* Forecast downward dip */}
                <path d="M 0 50 Q 70 60 170 85 T 340 70" fill="none" stroke="#2563eb" strokeWidth="2.5" />
                {/* Bottleneck Dot */}
                <circle cx="170" cy="85" r="4.5" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
              </svg>
            </div>

            <div className="absolute top-10 right-28 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-xl text-[10px] shadow-xs">
              <span className="text-rose-700 font-bold block">Potential bottleneck</span>
              <strong className="text-rose-900 block">May 15 – May 22</strong>
            </div>

            <div className="flex justify-between text-[9px] text-slate-400 font-mono pt-1">
              <span>Apr 28</span>
              <span>May 5</span>
              <span>May 12</span>
              <span>May 19</span>
              <span>May 26</span>
            </div>
          </div>
        </div>

        {/* Energy Usage Analytics (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Energy Analytics</h2>
            <select
              value={energyRange}
              onChange={(e) => setEnergyRange(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 focus:outline-none cursor-pointer"
            >
              <option>Last 30 days</option>
              <option>Last 60 days</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
            <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-slate-900 text-xs block">2.4 GWh</span>
              <span className="text-[9px] text-slate-500 font-medium">Total</span>
            </div>
            <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-amber-600 text-xs block">$240K</span>
              <span className="text-[9px] text-slate-500 font-medium">Cost</span>
            </div>
            <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-extrabold text-emerald-600 text-xs block">18%</span>
              <span className="text-[9px] text-slate-500 font-medium">Idle</span>
            </div>
          </div>

          <div className="pt-1">
            <div className="h-28 w-full flex items-end justify-between gap-1 px-1">
              {[40, 45, 52, 60, 58, 65, 70, 78, 85, 82, 88, 90].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col justify-end items-center h-full">
                  <div className="w-full bg-blue-500 rounded-t" style={{ height: `${val}%` }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3: Correlation Matrix + Anomalies Detected + What-If Scenario Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-5">
        {/* Correlation Analysis (4 cols) */}
        <div className="xl:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Correlation Matrix</h2>
            <span className="text-[10px] text-slate-400 font-mono">-1.0 to +1.0</span>
          </div>

          <div className="space-y-1 text-xs">
            {[
              { row: 'Failures', vals: ['bg-blue-600', 'bg-blue-300', 'bg-rose-200', 'bg-rose-400', 'bg-slate-200'] },
              { row: 'Downtime', vals: ['bg-blue-500', 'bg-blue-400', 'bg-rose-300', 'bg-rose-200', 'bg-slate-200'] },
              { row: 'Prod Loss', vals: ['bg-blue-400', 'bg-blue-500', 'bg-rose-400', 'bg-rose-300', 'bg-slate-200'] },
              { row: 'Energy', vals: ['bg-rose-200', 'bg-rose-300', 'bg-blue-500', 'bg-blue-400', 'bg-slate-200'] },
              { row: 'Quality', vals: ['bg-rose-400', 'bg-blue-400', 'bg-rose-200', 'bg-blue-500', 'bg-slate-200'] },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-0.5">
                <span className="text-[10px] text-slate-600 font-semibold w-20 truncate">{item.row}</span>
                <div className="flex gap-1.5 flex-1 justify-end">
                  {item.vals.map((v, i) => (
                    <span key={i} className={`w-8 h-4 rounded-md ${v}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-1.5 text-[8px] text-slate-400 font-mono pt-1">
            <span className="w-8 text-center">OEE</span>
            <span className="w-8 text-center">Prod</span>
            <span className="w-8 text-center">Energy</span>
            <span className="w-8 text-center">Cost</span>
            <span className="w-8 text-center">Safety</span>
          </div>
        </div>

        {/* Top Anomalies Detected (AI) (4 cols) */}
        <div className="xl:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Top Anomalies Detected (AI)</h2>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
              View All
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block leading-tight">Unusual vibration pattern on CNC-02</span>
                <span className="text-[10px] text-rose-600 font-semibold">240% higher than normal</span>
              </div>
              <span className="text-[9px] text-slate-400 font-mono">2h ago</span>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block leading-tight">Energy spike in Compressor-01</span>
                <span className="text-[10px] text-rose-600 font-semibold">65% higher than baseline</span>
              </div>
              <span className="text-[9px] text-slate-400 font-mono">5h ago</span>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block leading-tight">Cycle time increase on Line 2</span>
                <span className="text-[10px] text-amber-600 font-semibold">18% higher than expected</span>
              </div>
              <span className="text-[9px] text-slate-400 font-mono">8h ago</span>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block leading-tight">Coolant temperature fluctuation</span>
                <span className="text-[10px] text-amber-600 font-semibold">Irregular pattern detected</span>
              </div>
              <span className="text-[9px] text-slate-400 font-mono">12h ago</span>
            </div>
          </div>
        </div>

        {/* What-If Scenario Analysis Table (4 cols) */}
        <div className="xl:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">What-If Scenarios</h2>
            <span className="text-xs font-semibold text-slate-500">Compare</span>
          </div>

          <div className="overflow-x-auto no-scrollbar text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] text-slate-400 uppercase font-semibold">
                  <th className="pb-1.5">Scenario</th>
                  <th className="pb-1.5">Output</th>
                  <th className="pb-1.5">Cost</th>
                  <th className="pb-1.5 text-right">ROI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2 font-medium text-slate-900">1. Baseline</td>
                  <td className="py-2 text-slate-700">12,000</td>
                  <td className="py-2 text-slate-700">$2.4M</td>
                  <td className="py-2 text-right text-slate-400">-</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-emerald-900 font-bold">2. +Maint</td>
                  <td className="py-2 text-emerald-700">12,800</td>
                  <td className="py-2 text-emerald-700">$2.1M</td>
                  <td className="py-2 text-right font-extrabold text-emerald-600">28%</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-slate-900">3. +Buffer</td>
                  <td className="py-2 text-slate-700">12,600</td>
                  <td className="py-2 text-slate-700">$2.2M</td>
                  <td className="py-2 text-right font-bold text-blue-600">22%</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-slate-900">4. Replace</td>
                  <td className="py-2 text-slate-700">13,200</td>
                  <td className="py-2 text-slate-700">$2.8M</td>
                  <td className="py-2 text-right font-bold text-purple-600">42%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal: Create Analysis */}
      {isNewAnalysisModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Create New Predictive Experiment</h3>
                  <span className="text-[10px] text-slate-400">AI Hypothesis & Correlation Lab</span>
                </div>
              </div>
              <button
                onClick={() => setIsNewAnalysisModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
                  Analysis Title
                </label>
                <input
                  type="text"
                  defaultValue="Correlation between coolant purity and spindle failure rate"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
                  Target Assets
                </label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none cursor-pointer">
                  <option>All CNC Milling Stations (Riverside)</option>
                  <option>Press & Stamping Line (Pune)</option>
                  <option>Surface Finishing Robots (Munich)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
                  Model Engine
                </label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none cursor-pointer">
                  <option>Gemini SCADA Predictive Regression v4.2</option>
                  <option>Fourier Transform Vibration Anomaly Detector</option>
                  <option>Multi-variate ARIMA Demand Estimator</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setIsNewAnalysisModalOpen(false)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-semibold cursor-pointer hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsNewAnalysisModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-blue-600 text-white font-bold cursor-pointer hover:bg-blue-700"
              >
                Run Predictive Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
