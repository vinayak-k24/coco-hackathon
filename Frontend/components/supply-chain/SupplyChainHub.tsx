'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Box,
  Truck,
  Users,
  BarChart3,
  Calendar,
  Filter,
  ArrowRight,
  ShieldAlert,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Layers,
  Zap,
  Globe,
  Plus,
  RefreshCw,
} from 'lucide-react';

export default function SupplyChainHub() {
  const [inventoryFilter, setInventoryFilter] = useState<'all' | 'critical'>('all');
  const [selectedWarehouse, setSelectedWarehouse] = useState('All Warehouses');
  const [selectedForecastPart, setSelectedForecastPart] = useState('Spindle Bearing (SKM-6208)');
  const [forecastDays, setForecastDays] = useState('Next 90 days');
  const [whatIfScenario, setWhatIfScenario] = useState('Delay PO-45821 by 2 weeks');
  const [selectedPlant, setSelectedPlant] = useState('All Plants');

  // Interactive Purchase Order creation or action modal
  const [modalAction, setModalAction] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      {/* Top Header & AI Insight Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Supply Chain & Inventory Intelligence Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Ensure the right parts, at the right time, to keep your factories running.
          </p>
        </div>

        {/* Date and Plant Picker */}
        <div className="flex items-center gap-2 text-xs self-start lg:self-auto">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs font-semibold text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Mon, Apr 28, 2025</span>
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

      {/* Proactive AI Insight Banner with Cargo Illustration */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3 z-10 max-w-3xl">
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0 text-blue-300">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">AI Insight</span>
              <span className="text-[10px] text-slate-400 font-mono bg-white/10 px-2 py-0.2 rounded">
                Generated 8 min ago
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              <strong className="text-white">3 critical parts</strong> are at risk of stockout within 21 days, which could impact <span className="text-amber-300 font-bold">2 production lines</span> and <span className="text-rose-300 font-bold">$1.2M in revenue</span>. Early purchasing or alternate suppliers can mitigate this risk.
            </p>
          </div>
        </div>

        <button
          onClick={() => setModalAction('expedite-bearings')}
          className="z-10 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <span>Review Mitigation Plan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {/* Subtle background glow */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* TOP KPI CARDS (6 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {/* 1. Critical Shortages */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 block leading-tight">3</span>
          <span className="text-xs font-semibold text-slate-700 block mt-0.5">Critical Shortages</span>
          <span className="text-[10px] text-rose-600 font-bold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-2.5 h-2.5" /> ↑ 2 vs last week
          </span>
        </div>

        {/* 2. Inventory Health */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 block leading-tight">87%</span>
          <span className="text-xs font-semibold text-slate-700 block mt-0.5">Inventory Health</span>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-2.5 h-2.5" /> ↑ 6% vs last month
          </span>
        </div>

        {/* 3. Parts at Risk */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Box className="w-4 h-4" />
            </div>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 block leading-tight">12</span>
          <span className="text-xs font-semibold text-slate-700 block mt-0.5">Parts at Risk</span>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <TrendingDown className="w-2.5 h-2.5" /> ↓ 25% vs last month
          </span>
        </div>

        {/* 4. Purchase Orders */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 block leading-tight">18</span>
          <span className="text-xs font-semibold text-slate-700 block mt-0.5">Purchase Orders</span>
          <span className="text-[10px] text-rose-600 font-bold flex items-center gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> 4 delayed
          </span>
        </div>

        {/* 5. Supplier Performance */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 block leading-tight">92%</span>
          <span className="text-xs font-semibold text-slate-700 block mt-0.5">Supplier Performance</span>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-2.5 h-2.5" /> ↑ 4% vs last month
          </span>
        </div>

        {/* 6. Predicted Inventory Risk */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 block leading-tight">$1.2M</span>
          <span className="text-xs font-semibold text-slate-700 block mt-0.5">Predicted Inv. Risk</span>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <TrendingDown className="w-2.5 h-2.5" /> ↓ 38% with actions
          </span>
        </div>
      </div>

      {/* ROW 1: Inventory Overview + Demand Forecast + Warehouse Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Inventory Overview (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Inventory Overview</h2>

            <div className="flex items-center gap-1.5">
              <div className="flex text-[11px] font-semibold bg-slate-100 p-0.5 rounded-lg">
                <button
                  onClick={() => setInventoryFilter('all')}
                  className={`px-2 py-0.5 rounded-md cursor-pointer ${
                    inventoryFilter === 'all' ? 'bg-white shadow-2xs text-blue-600 font-bold' : 'text-slate-600'
                  }`}
                >
                  All Parts
                </button>
                <button
                  onClick={() => setInventoryFilter('critical')}
                  className={`px-2 py-0.5 rounded-md cursor-pointer ${
                    inventoryFilter === 'critical' ? 'bg-white shadow-2xs text-rose-600 font-bold' : 'text-slate-600'
                  }`}
                >
                  Critical Only
                </button>
              </div>

              <select
                value={selectedWarehouse}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
                className="text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-1.5 py-0.5 focus:outline-none cursor-pointer"
              >
                <option>All Warehouses</option>
                <option>Riverside</option>
                <option>Pune</option>
                <option>Munich</option>
              </select>
            </div>
          </div>

          {/* 4 Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-semibold">Total Items</span>
              <span className="font-extrabold text-slate-900 text-sm">24,568</span>
              <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">↑ 8%</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-semibold">In Stock</span>
              <span className="font-extrabold text-slate-900 text-sm">18,432</span>
              <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">↑ 12%</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-semibold">Below Reorder</span>
              <span className="font-extrabold text-rose-600 text-sm">3,204</span>
              <span className="text-[9px] text-rose-600 font-bold block mt-0.5">↑ 48%</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-semibold">Out of Stock</span>
              <span className="font-extrabold text-rose-600 text-sm">932</span>
              <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">↓ 31%</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-600 pt-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-600" /> In Stock
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Below Reorder
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Out of Stock
            </span>
          </div>

          {/* Stacked Bar Chart */}
          <div className="pt-1">
            <div className="h-32 w-full flex items-end justify-between gap-1.5 px-1">
              {[
                { s: 55, r: 15, o: 6 },
                { s: 58, r: 14, o: 5 },
                { s: 62, r: 18, o: 7 },
                { s: 60, r: 16, o: 6 },
                { s: 64, r: 19, o: 8 },
                { s: 70, r: 20, o: 7 },
                { s: 68, r: 18, o: 6 },
                { s: 72, r: 22, o: 9 },
                { s: 69, r: 19, o: 8 },
                { s: 74, r: 21, o: 7 },
                { s: 65, r: 18, o: 6 },
                { s: 62, r: 17, o: 5 },
                { s: 66, r: 19, o: 6 },
                { s: 70, r: 20, o: 7 },
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col justify-end h-full gap-0.5">
                  <div className="w-full bg-rose-500 rounded-t-xs" style={{ height: `${bar.o}%` }} />
                  <div className="w-full bg-amber-400" style={{ height: `${bar.r}%` }} />
                  <div className="w-full bg-blue-500" style={{ height: `${bar.s}%` }} />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1 border-t border-slate-100 pt-1">
              <span>Apr 1</span>
              <span>Apr 7</span>
              <span>Apr 14</span>
              <span>Apr 21</span>
              <span>Apr 28</span>
            </div>
          </div>
        </div>

        {/* Demand Forecast & Stock Projection (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Demand Forecast & Stock Projection
            </h2>

            <div className="flex items-center gap-1.5">
              <select
                value={selectedForecastPart}
                onChange={(e) => setSelectedForecastPart(e.target.value)}
                className="text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-2 py-0.5 focus:outline-none cursor-pointer"
              >
                <option>Spindle Bearing (SKM-6208)</option>
                <option>Coolant Pump (CF-100)</option>
                <option>Servo Drive (SD-440)</option>
              </select>

              <select
                value={forecastDays}
                onChange={(e) => setForecastDays(e.target.value)}
                className="text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-1.5 py-0.5 focus:outline-none cursor-pointer"
              >
                <option>Next 30 days</option>
                <option>Next 90 days</option>
              </select>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-600">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-600" /> Current Stock
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 border-t-2 border-dashed border-blue-500" /> Forecasted Demand
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 border-t-2 border-dashed border-rose-500" /> Reorder Point
            </span>
          </div>

          {/* Projection Line Chart */}
          <div className="relative pt-2">
            <div className="h-44 w-full">
              <svg className="w-full h-full" viewBox="0 0 340 140" preserveAspectRatio="none">
                <line x1="0" y1="20" x2="340" y2="20" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2="340" y2="60" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="0" y1="100" x2="340" y2="100" stroke="#f1f5f9" strokeDasharray="3 3" />

                {/* Reorder Point line (dashed red) */}
                <line x1="0" y1="95" x2="340" y2="95" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" />

                {/* Stock downward line (solid then dashed blue) */}
                <path
                  d="M 0 30 Q 50 40 100 60 T 170 95 L 240 115 L 340 130"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                />

                {/* Intersection Callout */}
                <circle cx="170" cy="95" r="4.5" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
              </svg>
            </div>

            {/* Stockout Warning Callout Pin */}
            <div className="absolute top-10 right-28 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl shadow-xs text-[10px] space-y-0.5">
              <span className="text-rose-700 font-bold block">Stockout predicted</span>
              <span className="font-extrabold text-rose-900 block text-xs">May 28, 2025</span>
            </div>

            <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1">
              <span>Apr 28</span>
              <span>May 12</span>
              <span>May 26</span>
              <span>Jun 9</span>
              <span>Jun 23</span>
              <span>Jul 7</span>
            </div>
          </div>
        </div>

        {/* Warehouse Inventory (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Warehouse Inventory</h2>
            <span className="text-[10px] text-slate-400 font-mono">4 depots</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Riverside */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-lg overflow-hidden relative shrink-0 bg-slate-200">
                  <Image
                    src="https://picsum.photos/seed/warehouse-riverside/100/100"
                    alt="Riverside"
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-slate-900 block truncate leading-tight">Riverside (Main)</span>
                  <span className="text-[10px] text-slate-500 font-mono">12,428 items</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 block">
                  92% Healthy
                </span>
              </div>
            </div>

            {/* Pune */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-lg overflow-hidden relative shrink-0 bg-slate-200">
                  <Image
                    src="https://picsum.photos/seed/warehouse-pune/100/100"
                    alt="Pune"
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-slate-900 block truncate leading-tight">Pune (India)</span>
                  <span className="text-[10px] text-slate-500 font-mono">6,842 items</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 block">
                  78% Watch
                </span>
              </div>
            </div>

            {/* Munich */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-lg overflow-hidden relative shrink-0 bg-slate-200">
                  <Image
                    src="https://picsum.photos/seed/warehouse-munich/100/100"
                    alt="Munich"
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-slate-900 block truncate leading-tight">Munich (Germany)</span>
                  <span className="text-[10px] text-slate-500 font-mono">4,120 items</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 block">
                  65% Watch
                </span>
              </div>
            </div>

            {/* Austin */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-lg overflow-hidden relative shrink-0 bg-slate-200">
                  <Image
                    src="https://picsum.photos/seed/warehouse-austin/100/100"
                    alt="Austin"
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-slate-900 block truncate leading-tight">Austin (USA)</span>
                  <span className="text-[10px] text-slate-500 font-mono">1,178 items</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 block">
                  48% At Risk
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: Critical Parts & Supply Risk + Supplier Performance + Open Purchase Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Critical Parts & Supply Risk (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Critical Parts & Supply Risk</h2>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
              View All
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {/* Part 1 */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Spindle Bearing (SKM-6208)</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-100 text-rose-800">
                  Critical
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span>Asset: CNC-02</span>
                <span className="text-rose-600 font-bold">12 days to stockout</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: '20%' }} />
                </div>
                <span className="text-[10px] font-mono text-slate-500">4 / 20</span>
              </div>
            </div>

            {/* Part 2 */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Coolant Pump (CF-100)</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                  High
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span>Asset: CNC-04</span>
                <span className="text-amber-600 font-bold">18 days to stockout</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '24%' }} />
                </div>
                <span className="text-[10px] font-mono text-slate-500">6 / 25</span>
              </div>
            </div>

            {/* Part 3 */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Servo Drive (SD-440)</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                  High
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span>Asset: Assembly Line 3</span>
                <span className="text-amber-600 font-bold">21 days to stockout</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '27%' }} />
                </div>
                <span className="text-[10px] font-mono text-slate-500">8 / 30</span>
              </div>
            </div>

            {/* Part 4 */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Hydraulic Valve (HV-320)</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-blue-800">
                  Medium
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span>Asset: Press-07</span>
                <span className="text-emerald-600 font-bold">35 days to stockout</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '30%' }} />
                </div>
                <span className="text-[10px] font-mono text-slate-500">12 / 40</span>
              </div>
            </div>
          </div>
        </div>

        {/* Supplier Performance (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Supplier Performance</h2>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
              View All
            </button>
          </div>

          <div className="overflow-x-auto no-scrollbar text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] text-slate-400 uppercase font-semibold">
                  <th className="pb-2">Supplier</th>
                  <th className="pb-2">OTD</th>
                  <th className="pb-2">Quality</th>
                  <th className="pb-2">Lead</th>
                  <th className="pb-2 text-right">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 font-bold text-slate-900">MotionTech</td>
                  <td className="py-2.5 text-emerald-600 font-semibold">96%</td>
                  <td className="py-2.5 text-slate-700">98%</td>
                  <td className="py-2.5 text-slate-500">8d</td>
                  <td className="py-2.5 text-right">
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Low
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-slate-900">GlobalParts Co.</td>
                  <td className="py-2.5 text-slate-700 font-semibold">89%</td>
                  <td className="py-2.5 text-slate-700">94%</td>
                  <td className="py-2.5 text-slate-500">14d</td>
                  <td className="py-2.5 text-right">
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      Medium
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-slate-900">Shinsei Ind.</td>
                  <td className="py-2.5 text-rose-600 font-semibold">82%</td>
                  <td className="py-2.5 text-slate-700">91%</td>
                  <td className="py-2.5 text-slate-500">28d</td>
                  <td className="py-2.5 text-right">
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      High
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-slate-900">EuroMech</td>
                  <td className="py-2.5 text-emerald-600 font-semibold">93%</td>
                  <td className="py-2.5 text-slate-700">96%</td>
                  <td className="py-2.5 text-slate-500">12d</td>
                  <td className="py-2.5 text-right">
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Low
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-slate-900">AutoSupply Inc.</td>
                  <td className="py-2.5 text-rose-600 font-semibold">78%</td>
                  <td className="py-2.5 text-slate-700">88%</td>
                  <td className="py-2.5 text-slate-500">35d</td>
                  <td className="py-2.5 text-right">
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      High
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Open Purchase Orders (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Open Purchase Orders</h2>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
              View All
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {/* PO 1 */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900">PO-45821</span>
                  <span className="text-slate-500 text-[10px]">500 units • MotionTech</span>
                </div>
                <span className="text-[11px] text-slate-600 block">Spindle Bearing (SKM-6208)</span>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 block">
                  In Transit
                </span>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">ETA May 10</span>
              </div>
            </div>

            {/* PO 2 */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900">PO-44732</span>
                  <span className="text-slate-500 text-[10px]">200 units • GlobalParts</span>
                </div>
                <span className="text-[11px] text-slate-600 block">Coolant Pump (CF-100)</span>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 block">
                  Delayed
                </span>
                <span className="text-[10px] text-rose-600 font-mono mt-0.5 block">New ETA May 22</span>
              </div>
            </div>

            {/* PO 3 */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900">PO-44567</span>
                  <span className="text-slate-500 text-[10px]">100 units • Shinsei</span>
                </div>
                <span className="text-[11px] text-slate-600 block">Servo Drive (SD-440)</span>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 block">
                  On Track
                </span>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">ETA May 5</span>
              </div>
            </div>

            {/* PO 4 */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900">PO-44211</span>
                  <span className="text-slate-500 text-[10px]">300 units • EuroMech</span>
                </div>
                <span className="text-[11px] text-slate-600 block">Hydraulic Valve (HV-320)</span>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 block">
                  In Production
                </span>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">ETA Jun 8</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3: Risk Heatmap + Business Impact + AI Recommendations + What-If */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-5">
        {/* Asset & Production Risk Heatmap (3 cols) */}
        <div className="xl:col-span-3 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Risk Heatmap</h2>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-400" />Low</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-400" />Med</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-rose-500" />High</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            {[
              { line: 'CNC Line 1', c: ['bg-emerald-200', 'bg-amber-200', 'bg-rose-300', 'bg-rose-400'] },
              { line: 'CNC Line 2', c: ['bg-emerald-200', 'bg-emerald-300', 'bg-amber-300', 'bg-rose-300'] },
              { line: 'Assembly Line 3', c: ['bg-emerald-200', 'bg-amber-300', 'bg-rose-300', 'bg-rose-400'] },
              { line: 'Packaging Line', c: ['bg-emerald-200', 'bg-emerald-200', 'bg-amber-200', 'bg-amber-300'] },
              { line: 'Press Line 1', c: ['bg-amber-200', 'bg-emerald-200', 'bg-amber-300', 'bg-emerald-200'] },
              { line: 'Paint Line', c: ['bg-amber-200', 'bg-emerald-200', 'bg-emerald-200', 'bg-emerald-200'] },
            ].map((row, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2 py-1 border-b border-slate-50">
                <span className="font-semibold text-slate-800 text-[11px] truncate w-28">{row.line}</span>
                <div className="flex gap-1">
                  {row.c.map((color, i) => (
                    <span key={i} className={`w-8 h-4 rounded-md ${color}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-1 text-[9px] text-slate-400 font-mono">
            <span className="w-8 text-center">W1</span>
            <span className="w-8 text-center">W2</span>
            <span className="w-8 text-center">30d</span>
            <span className="w-8 text-center">90d</span>
          </div>
        </div>

        {/* Business Impact (3 cols) */}
        <div className="xl:col-span-3 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Business Impact</h2>
            <span className="text-[11px] font-semibold text-slate-500">This Quarter</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-semibold">Lines at Risk</span>
              <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">2 Lines</span>
              <span className="text-[9px] text-rose-600 font-bold">CNC 1 & Assm 3</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-semibold">Orders at Risk</span>
              <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">5 Orders</span>
              <span className="text-[9px] text-amber-600 font-bold">$420K value</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-semibold">Revenue Exposure</span>
              <span className="font-extrabold text-rose-600 text-sm mt-0.5 block">$1.2M</span>
              <span className="text-[9px] text-slate-400">Total volume</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-semibold">Potential Downtime</span>
              <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">48 hours</span>
              <span className="text-[9px] text-slate-400">Unmitigated</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-semibold">Expedited Freight</span>
              <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">$284K</span>
              <span className="text-[9px] text-slate-400">Air courier</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-semibold">Higher Maint. Cost</span>
              <span className="font-extrabold text-rose-600 text-sm mt-0.5 block">3.2x</span>
              <span className="text-[9px] text-slate-400">Rush parts premium</span>
            </div>
          </div>
        </div>

        {/* AI Recommendations (3 cols) */}
        <div className="xl:col-span-3 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">AI Recommendations</h2>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
              View All
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {/* Rec 1 */}
            <div className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-200 space-y-1.5">
              <span className="font-bold text-slate-900 block leading-tight">
                Place urgent order for 16 spindle bearings
              </span>
              <span className="text-[10px] text-slate-500 block">Stockout in 12 days • $320K revenue at risk</span>
              <button
                onClick={() => setModalAction('order-bearings')}
                className="w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs cursor-pointer transition-colors"
              >
                Order Now
              </button>
            </div>

            {/* Rec 2 */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 block leading-tight">
                Increase safety stock for coolant pumps
              </span>
              <span className="text-[10px] text-slate-500 block">Demand +35% next month</span>
              <button
                onClick={() => setModalAction('review-safety')}
                className="w-full py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
              >
                Review
              </button>
            </div>

            {/* Rec 3 */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 block leading-tight">
                Evaluate alternate supplier for hydraulic valves
              </span>
              <span className="text-[10px] text-slate-500 block">Current lead time 12 weeks</span>
              <button
                onClick={() => setModalAction('compare-suppliers')}
                className="w-full py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
              >
                Compare Suppliers
              </button>
            </div>
          </div>
        </div>

        {/* What-If Analysis (3 cols) */}
        <div className="xl:col-span-3 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">What-If Analysis</h2>
            <select
              value={whatIfScenario}
              onChange={(e) => setWhatIfScenario(e.target.value)}
              className="text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-1.5 py-0.5 focus:outline-none cursor-pointer max-w-[170px] truncate"
            >
              <option>Delay PO-45821 by 2 weeks</option>
              <option>Supplier strike at GlobalParts</option>
              <option>Switch to Air Courier (+35% cost)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
              <span className="text-[10px] text-rose-600 font-semibold block">Extra Downtime</span>
              <span className="font-extrabold text-rose-900 text-sm mt-0.5 block">72 hrs</span>
              <span className="text-[9px] text-slate-500">Lines 1 & 2 idle</span>
            </div>

            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
              <span className="text-[10px] text-rose-600 font-semibold block">Revenue Loss</span>
              <span className="font-extrabold text-rose-900 text-sm mt-0.5 block">$320K</span>
              <span className="text-[9px] text-slate-500">Unfulfilled POs</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 font-semibold block">Orders Delayed</span>
              <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">2 Orders</span>
              <span className="text-[9px] text-amber-600 font-bold">Penalty SLA</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 font-semibold block">OEE Drop</span>
              <span className="font-extrabold text-rose-600 text-sm mt-0.5 block">15% Drop</span>
              <span className="text-[9px] text-slate-400">Total factory impact</span>
            </div>
          </div>

          <button
            onClick={() => setModalAction('sim-run')}
            className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-1"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
            <span>Simulate Mitigation Options</span>
          </button>
        </div>
      </div>

      {/* Action Simulation / PO Modal */}
      {modalAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Procurement Action Dispatched</h3>
                  <span className="text-[10px] text-slate-400">Automated ERP Sync</span>
                </div>
              </div>
              <button
                onClick={() => setModalAction(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Action Successfully Scheduled</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Purchase Order requisition has been transmitted to MotionTech for 16x Spindle Bearings (#SKM-6208) with expedited 3-day air freight.
              </p>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-slate-600">
                <span>Vendor:</span>
                <strong className="text-slate-900">MotionTech USA</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Cost Avoidance:</span>
                <strong className="text-emerald-600 font-bold">$320,000</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Expedited Fee:</span>
                <strong className="text-slate-900">$2,400 (Approved)</strong>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setModalAction(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold cursor-pointer hover:bg-slate-800"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
