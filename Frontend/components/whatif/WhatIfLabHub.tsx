'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Sliders,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Calendar,
  Package,
  TrendingUp,
  Truck,
  Users,
  Shield,
  Clock,
  ArrowRight,
  TrendingDown,
  Layers,
  ChevronDown,
  DollarSign,
  Activity,
  BarChart3,
  Bot,
} from 'lucide-react';

interface WhatIfLabHubProps {
  onNavigateToAsset?: (assetId: string) => void;
  onNavigateToMaintenance?: () => void;
  onNavigateToFinance?: () => void;
}

export default function WhatIfLabHub({
  onNavigateToAsset,
  onNavigateToMaintenance,
  onNavigateToFinance,
}: WhatIfLabHubProps = {}) {
  // Scenario builder selection
  const [selectedScenarioType, setSelectedScenarioType] = useState('machine-failure');
  const [selectedAsset, setSelectedAsset] = useState('CNC-02');
  const [timeHorizon, setTimeHorizon] = useState('4 Weeks');

  // Sliders and toggles
  const [repairStart, setRepairStart] = useState(0);
  const [repairDuration, setRepairDuration] = useState(2);
  const [sparePartAvailability, setSparePartAvailability] = useState('In Stock');
  const [demandChange, setDemandChange] = useState(0);
  const [alternateMachine, setAlternateMachine] = useState(true);
  const [technicianAvailable, setTechnicianAvailable] = useState('Available');
  const [supplierLeadTime, setSupplierLeadTime] = useState(7);
  const [overtimeAllowed, setOvertimeAllowed] = useState(false);

  // View state: Cards vs Table
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSuccess, setSimulationSuccess] = useState(false);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationSuccess(true);
      setTimeout(() => setSimulationSuccess(false), 3000);
    }, 800);
  };

  const handleReset = () => {
    setRepairStart(0);
    setRepairDuration(2);
    setSparePartAvailability('In Stock');
    setDemandChange(0);
    setAlternateMachine(true);
    setTechnicianAvailable('Available');
    setSupplierLeadTime(7);
    setOvertimeAllowed(false);
  };

  const scenarioTypes = [
    {
      id: 'machine-failure',
      title: 'Machine Failure',
      desc: 'Simulate equipment failure and repair options',
      icon: Flame,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
    },
    {
      id: 'delayed-maintenance',
      title: 'Delayed Maintenance',
      desc: 'Assess impact of postponing maintenance',
      icon: Calendar,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      id: 'inventory-shortage',
      title: 'Inventory Shortage',
      desc: 'Model spare-part unavailability risk',
      icon: Package,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      id: 'increased-demand',
      title: 'Increased Demand',
      desc: 'Test higher production demand scenarios',
      icon: TrendingUp,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      id: 'supplier-delay',
      title: 'Supplier Delay',
      desc: 'Evaluate supplier lead time disruptions',
      icon: Truck,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
      id: 'workforce-shortage',
      title: 'Workforce Shortage',
      desc: 'Simulate reduced workforce availability',
      icon: Users,
      color: 'text-sky-600 bg-sky-50 border-sky-200',
    },
    {
      id: 'planned-shutdown',
      title: 'Planned Shutdown',
      desc: 'Analyze planned maintenance shutdown',
      icon: Shield,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
    {
      id: 'custom-scenario',
      title: 'Custom Scenario',
      desc: 'Create your own what-if scenario',
      icon: Sliders,
      color: 'text-slate-600 bg-slate-50 border-slate-200',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Top Title & AI Simulation Engine Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            What-If Scenario Planning & Decision Lab
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5">
            Simulate. Compare. Decide with Confidence.
          </p>
          <p className="text-xs text-slate-500">
            Explore potential scenarios, understand cross-functional impacts, and choose the best path for your manufacturing business with AI.
          </p>
        </div>

        {/* AI-Powered Simulation Engine Hero Banner */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3 px-4 shadow-2xs flex items-center gap-3.5 self-start lg:self-auto shrink-0">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-blue-600 block">AI-powered simulation engine</span>
            <p className="text-[11px] text-slate-500 max-w-xs leading-snug">
              Models operational, financial, supply chain, and workforce impacts using real factory data.
            </p>
          </div>
        </div>
      </div>

      {/* STEP 1: SCENARIO BUILDER */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
            1
          </span>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">Scenario Builder</h2>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Select a scenario type and configure key variables to simulate different outcomes.
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-2.5">
          {scenarioTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedScenarioType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedScenarioType(type.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${type.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs leading-tight mb-0.5">{type.title}</h4>
                  <p className="text-[10px] text-slate-500 leading-snug line-clamp-2">{type.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 2: CONFIGURE SCENARIO VARIABLES & STEP 3: RUN & COMPARE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Step 2 (9 cols) */}
        <div className="lg:col-span-9 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Configure Scenario Variables
              </h2>
              <span className="text-xs text-slate-500 hidden md:inline">
                Adjust key parameters to reflect your what-if scenario.
              </span>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                <span className="text-slate-500 text-[11px]">Selected Asset:</span>
                <select
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                  className="font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option>CNC-02</option>
                  <option>Packaging Line</option>
                  <option>Assembly Line</option>
                  <option>Compressor-01</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                <span className="text-slate-500 text-[11px]">Time Horizon:</span>
                <select
                  value={timeHorizon}
                  onChange={(e) => setTimeHorizon(e.target.value)}
                  className="font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option>4 Weeks</option>
                  <option>8 Weeks</option>
                  <option>12 Weeks</option>
                </select>
              </div>

              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-800 font-semibold px-2 py-1 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Grid of Sliders and Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* 1. Repair Start */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-semibold text-slate-700">Repair Start</label>
                <span className="font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                  {repairStart} days
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="14"
                value={repairStart}
                onChange={(e) => setRepairStart(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-[10px] text-slate-400 block">Days from now</span>
            </div>

            {/* 2. Repair Duration */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-semibold text-slate-700">Repair Duration</label>
                <span className="font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                  {repairDuration} days
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={repairDuration}
                onChange={(e) => setRepairDuration(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-[10px] text-slate-400 block">Estimated downtime</span>
            </div>

            {/* 3. Spare Part Availability */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
              <label className="text-[11px] font-semibold text-slate-700 block">Spare Part Availability</label>
              <select
                value={sparePartAvailability}
                onChange={(e) => setSparePartAvailability(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option>In Stock</option>
                <option>Requires Expediting (3d)</option>
                <option>Backordered (14d)</option>
              </select>
              <span className="text-[10px] text-emerald-600 font-semibold block">Inventory verified</span>
            </div>

            {/* 4. Production Demand Change */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-semibold text-slate-700">Demand Change</label>
                <span className="font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                  {demandChange >= 0 ? `+${demandChange}%` : `${demandChange}%`}
                </span>
              </div>
              <input
                type="range"
                min="-20"
                max="30"
                step="5"
                value={demandChange}
                onChange={(e) => setDemandChange(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-[10px] text-slate-400 block">Forecast deviation</span>
            </div>

            {/* 5. Alternate Machine Available */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block">Alternate Machine</label>
                <span className="text-[10px] text-slate-400">Reroute work</span>
              </div>
              <button
                onClick={() => setAlternateMachine(!alternateMachine)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  alternateMachine ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    alternateMachine ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* 6. Technician Availability */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
              <label className="text-[11px] font-semibold text-slate-700 block">Technician Availability</label>
              <select
                value={technicianAvailable}
                onChange={(e) => setTechnicianAvailable(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option>Available</option>
                <option>On Call</option>
                <option>Requires Contractor</option>
              </select>
              <span className="text-[10px] text-slate-400 block">Level 3 Specialist</span>
            </div>

            {/* 7. Supplier Lead Time */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-semibold text-slate-700">Supplier Lead Time</label>
                <span className="font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                  {supplierLeadTime} days
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="21"
                value={supplierLeadTime}
                onChange={(e) => setSupplierLeadTime(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-[10px] text-slate-400 block">If replacement ordered</span>
            </div>

            {/* 8. Overtime Allowed */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block">Overtime Allowed</label>
                <span className="text-[10px] text-slate-400">Shift expansion</span>
              </div>
              <button
                onClick={() => setOvertimeAllowed(!overtimeAllowed)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  overtimeAllowed ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    overtimeAllowed ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Step 3: Run & Compare Scenarios (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Run & Compare Scenarios
              </h2>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              See the predicted impact across your operational, financial, and supply chain KPIs.
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-75"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isSimulating ? 'Simulating Physics & Supply...' : 'Run Simulation'}</span>
            </button>

            {simulationSuccess && (
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold text-center animate-in fade-in flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Simulation updated successfully</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* STEP 4: SCENARIO COMPARISON (5 CARDS) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              4
            </span>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Scenario Comparison</h2>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Side-by-side comparison of predicted outcomes.
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs self-start sm:self-auto">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded-md font-semibold cursor-pointer transition-colors ${
                viewMode === 'cards' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-md font-semibold cursor-pointer transition-colors ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Table
            </button>
          </div>
        </div>

        {/* 5 Scenario Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-3.5">
          {/* Card A: Repair Today (RECOMMENDED) */}
          <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50/20 p-4 space-y-3 relative shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                    A
                  </span>
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900">Repair Today</h3>
                    <span className="text-[10px] text-slate-500">Start Now | 2 days</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Recommended
                </span>
              </div>

              <div className="space-y-1.5 pt-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Revenue Impact</span>
                  <strong className="text-rose-600">-$120K</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Downtime</span>
                  <strong className="text-slate-900">2 days</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">OEE (Next 4 Weeks)</span>
                  <strong className="text-emerald-700 font-extrabold">86%</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Order Fulfillment</span>
                  <strong className="text-slate-900 font-bold">98%</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Maintenance Cost</span>
                  <strong className="text-slate-900">$280K</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Customer Penalty</span>
                  <strong className="text-emerald-700 font-bold">$0</strong>
                </div>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-emerald-100/60 border border-emerald-200 text-emerald-900 text-[10px] font-semibold flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
              <span>Keeps production on track with minimal financial impact.</span>
            </div>
          </div>

          {/* Card B: Delay 1 Day */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  B
                </span>
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900">Delay 1 Day</h3>
                  <span className="text-[10px] text-slate-500">Start in 1 day | 2 days</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Revenue Impact</span>
                  <strong className="text-rose-600">-$420K</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Downtime</span>
                  <strong className="text-slate-900">3 days</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">OEE (Next 4 Weeks)</span>
                  <strong className="text-slate-900 font-bold">82%</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Order Fulfillment</span>
                  <strong className="text-slate-900 font-bold">94%</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Maintenance Cost</span>
                  <strong className="text-slate-900">$310K</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Customer Penalty</span>
                  <strong className="text-amber-600 font-bold">$50K</strong>
                </div>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-semibold flex items-start gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>Moderate risk to production and customer commitments.</span>
            </div>
          </div>

          {/* Card C: Delay 3 Days */}
          <div className="rounded-2xl border border-amber-300 bg-white p-4 space-y-3 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
                  C
                </span>
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900">Delay 3 Days</h3>
                  <span className="text-[10px] text-slate-500">Start in 3 days | 2 days</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Revenue Impact</span>
                  <strong className="text-rose-600">-$1.2M</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Downtime</span>
                  <strong className="text-slate-900">5 days</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">OEE (Next 4 Weeks)</span>
                  <strong className="text-amber-700 font-bold">76%</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Order Fulfillment</span>
                  <strong className="text-slate-900 font-bold">86%</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Maintenance Cost</span>
                  <strong className="text-slate-900">$350K</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Customer Penalty</span>
                  <strong className="text-rose-600 font-bold">$420K</strong>
                </div>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-[10px] font-semibold flex items-start gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
              <span>High risk of order delays and revenue loss.</span>
            </div>
          </div>

          {/* Card D: Run to Failure (UNPLANNED) */}
          <div className="rounded-2xl border-2 border-rose-400 bg-rose-50/20 p-4 space-y-3 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center">
                  D
                </span>
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900">Run to Failure</h3>
                  <span className="text-[10px] text-slate-500">No repair | Unplanned</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Revenue Impact</span>
                  <strong className="text-rose-600 font-extrabold">-$2.4M</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Downtime</span>
                  <strong className="text-rose-600 font-bold">12 days</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">OEE (Next 4 Weeks)</span>
                  <strong className="text-rose-700 font-extrabold">62%</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Order Fulfillment</span>
                  <strong className="text-rose-600 font-bold">68%</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Maintenance Cost</span>
                  <strong className="text-slate-900">$680K</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Customer Penalty</span>
                  <strong className="text-rose-600 font-extrabold">$1.1M</strong>
                </div>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-rose-100 border border-rose-300 text-rose-900 text-[10px] font-semibold flex items-start gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-700 shrink-0 mt-0.5" />
              <span>Significant risk of catastrophic failure and major financial loss.</span>
            </div>
          </div>

          {/* Card E: Add Inventory */}
          <div className="rounded-2xl border border-purple-300 bg-white p-4 space-y-3 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                  E
                </span>
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900">Add Inventory</h3>
                  <span className="text-[10px] text-slate-500">Pre-position parts</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Revenue Impact</span>
                  <strong className="text-rose-600">-$80K</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Downtime</span>
                  <strong className="text-slate-900">2 days</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">OEE (Next 4 Weeks)</span>
                  <strong className="text-emerald-700 font-extrabold">87%</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Order Fulfillment</span>
                  <strong className="text-slate-900 font-bold">98%</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Inventory Cost</span>
                  <strong className="text-slate-900">$150K</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Customer Penalty</span>
                  <strong className="text-emerald-700 font-bold">$0</strong>
                </div>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-[10px] font-semibold flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-700 shrink-0 mt-0.5" />
              <span>Improves readiness and reduces future supply risk.</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: CROSS-FUNCTIONAL IMPACT PROJECTIONS (4 CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-5">
        {/* 1. Financial Impact Projection (3 cols) */}
        <div className="xl:col-span-3 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Financial Impact Projection</h2>
            <span className="text-[10px] text-slate-400 font-mono">Cumulative (4W)</span>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-semibold">
            <span className="flex items-center gap-1 text-emerald-600"><span className="w-2 h-2 rounded-full bg-emerald-500" />Repair Today</span>
            <span className="flex items-center gap-1 text-amber-600"><span className="w-2 h-2 rounded-full bg-amber-500" />Delay 3d</span>
            <span className="flex items-center gap-1 text-rose-600"><span className="w-2 h-2 rounded-full bg-rose-500" />Run to Fail</span>
          </div>

          <div className="relative pt-2">
            <div className="h-36 w-full">
              <svg className="w-full h-full" viewBox="0 0 240 100" preserveAspectRatio="none">
                {/* Run to Failure (Red line) */}
                <path d="M 0 95 Q 80 70 160 45 T 240 15" fill="none" stroke="#ef4444" strokeWidth="2.5" />
                <circle cx="240" cy="15" r="3" fill="#ef4444" />

                {/* Delay 3 Days (Amber line) */}
                <path d="M 0 95 Q 80 80 160 65 T 240 50" fill="none" stroke="#f59e0b" strokeWidth="2" />
                <circle cx="240" cy="50" r="3" fill="#f59e0b" />

                {/* Repair Today (Green line) */}
                <path d="M 0 95 L 240 92" fill="none" stroke="#10b981" strokeWidth="2" />
                <circle cx="240" cy="92" r="3" fill="#10b981" />
              </svg>
            </div>

            <div className="absolute top-1 right-2 text-right">
              <span className="text-xs font-black text-rose-600 block">$2.4M</span>
              <span className="text-xs font-bold text-amber-600 block mt-4">$1.2M</span>
              <span className="text-xs font-bold text-emerald-600 block mt-6">$0.1M</span>
            </div>

            <div className="flex justify-between text-[9px] text-slate-400 font-mono border-t border-slate-100 pt-1">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>
          </div>
        </div>

        {/* 2. Production Output & OEE Impact (3 cols) */}
        <div className="xl:col-span-3 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Production & OEE Impact</h2>
            <span className="text-[10px] text-slate-400 font-mono">Comparison</span>
          </div>

          <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-600">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-500" />Output (units)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" />OEE %</span>
          </div>

          <div className="pt-2">
            <div className="h-32 w-full flex items-end justify-between gap-2 px-1">
              {[
                { label: 'Current', val: 90, oee: 82 },
                { label: 'Repair', val: 86, oee: 86 },
                { label: 'Delay 1d', val: 78, oee: 82 },
                { label: 'Delay 3d', val: 65, oee: 76 },
                { label: 'Fail', val: 45, oee: 62 },
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div className="w-full bg-blue-500 rounded-t" style={{ height: `${item.val}%` }} />
                  <span className="text-[8px] text-slate-400 font-mono mt-1 truncate">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Customer Order Impact (3 cols) */}
        <div className="xl:col-span-3 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Customer Order Impact</h2>
            <span className="text-[10px] text-slate-400 font-mono">% of orders</span>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-600">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500" />On Time</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-500" />Delayed</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-rose-500" />At Risk</span>
          </div>

          <div className="pt-2">
            <div className="h-32 w-full flex items-end justify-between gap-2 px-1">
              {[
                { label: 'Current', g: 85, y: 10, r: 5 },
                { label: 'Repair', g: 82, y: 12, r: 6 },
                { label: 'Delay 1d', g: 70, y: 20, r: 10 },
                { label: 'Delay 3d', g: 50, y: 28, r: 22 },
                { label: 'Fail', g: 30, y: 30, r: 40 },
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div className="w-full h-full flex flex-col justify-end">
                    <div className="w-full bg-rose-500 rounded-t-xs" style={{ height: `${item.r}%` }} />
                    <div className="w-full bg-amber-500" style={{ height: `${item.y}%` }} />
                    <div className="w-full bg-emerald-500" style={{ height: `${item.g}%` }} />
                  </div>
                  <span className="text-[8px] text-slate-400 font-mono mt-1 truncate">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Cross-Functional Radar Impact (3 cols) */}
        <div className="xl:col-span-3 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Cross-Functional Radar</h2>
            <div className="flex items-center gap-2 text-[9px] font-semibold">
              <span className="text-blue-600">■ Current</span>
              <span className="text-emerald-600">■ Repair</span>
            </div>
          </div>

          <div className="relative h-36 flex items-center justify-center">
            {/* Hexagon Radar SVG */}
            <svg className="w-40 h-40" viewBox="0 0 100 100">
              <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" fill="none" stroke="#e2e8f0" strokeWidth="1" />
              <polygon points="50,25 72,38 72,62 50,75 28,62 28,38" fill="none" stroke="#e2e8f0" strokeWidth="1" />

              {/* Current (Blue) */}
              <polygon points="50,18 78,35 68,66 50,82 25,65 22,35" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" strokeWidth="1.5" />
              {/* Repair (Green) */}
              <polygon points="50,12 82,32 75,68 50,86 20,68 18,32" fill="#10b981" fillOpacity="0.2" stroke="#10b981" strokeWidth="1.5" />

              <text x="50" y="8" fontSize="6" textAnchor="middle" fill="#64748b" fontWeight="bold">Production</text>
              <text x="90" y="32" fontSize="6" textAnchor="start" fill="#64748b" fontWeight="bold">Maint</text>
              <text x="90" y="72" fontSize="6" textAnchor="start" fill="#64748b" fontWeight="bold">Supply</text>
              <text x="50" y="98" fontSize="6" textAnchor="middle" fill="#64748b" fontWeight="bold">Finance</text>
              <text x="10" y="72" fontSize="6" textAnchor="end" fill="#64748b" fontWeight="bold">Customers</text>
              <text x="10" y="32" fontSize="6" textAnchor="end" fill="#64748b" fontWeight="bold">Workforce</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
