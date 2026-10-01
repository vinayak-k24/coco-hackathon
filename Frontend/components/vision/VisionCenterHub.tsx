'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Video,
  ShieldAlert,
  HardHat,
  AlertTriangle,
  Truck,
  DoorClosed,
  Users,
  TrendingDown,
  TrendingUp,
  Search,
  Sparkles,
  Calendar,
  Globe,
  Sun,
  ShieldCheck,
  CheckCircle2,
  Filter,
  Grid3X3,
  List,
  Maximize2,
  Eye,
  AlertOctagon,
  ArrowRight,
  ChevronRight,
  Camera,
  Play,
  RotateCcw,
  Zap,
} from 'lucide-react';

interface VisionCenterHubProps {
  onNavigateToAsset?: (assetId: string) => void;
  onNavigateToMaintenance?: () => void;
}

export default function VisionCenterHub({
  onNavigateToAsset,
  onNavigateToMaintenance,
}: VisionCenterHubProps = {}) {
  const [activeSubTab, setActiveSubTab] = useState('Live View');
  const [selectedArea, setSelectedArea] = useState('All Areas');
  const [selectedCameraFilter, setSelectedCameraFilter] = useState('All Cameras');
  const [statusFilter, setStatusFilter] = useState<'live' | 'alerts' | 'offline'>('live');
  const [ppeRange, setPpeRange] = useState('Last 14 days');
  const [heatmapRange, setHeatmapRange] = useState('This Week');
  const [movementRange, setMovementRange] = useState('Today');
  const [topRiskRange, setTopRiskRange] = useState('This Week');
  const [selectedCameraModal, setSelectedCameraModal] = useState<string | null>(null);

  const subTabs = [
    { name: 'Live View', icon: Video },
    { name: 'Safety Analytics', icon: ShieldCheck },
    { name: 'Operational Intelligence', icon: Zap },
    { name: 'People & PPE', icon: Users },
    { name: 'Vehicle & Forklift', icon: Truck },
    { name: 'Restricted Zones', icon: AlertOctagon },
    { name: 'Incident Management', icon: AlertTriangle },
    { name: 'Search & Investigate', icon: Search },
  ];

  return (
    <div className="space-y-5">
      {/* Top Header & Plant Safety Score Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              AI Vision & Safety Intelligence Center
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500 fill-current" />
              Powered by CoCo
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time computer vision for a safer, smarter and more efficient factory.
          </p>
        </div>

        {/* Safety Score Card & Plant/Weather Widget */}
        <div className="flex items-center gap-3 self-start lg:self-auto flex-wrap">
          {/* Safety Score Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 px-3.5 shadow-2xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Plant Safety Score
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-slate-900">92/100</span>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                  <TrendingUp className="w-2.5 h-2.5" /> ↑ 6% vs last month
                </span>
              </div>
            </div>
            {/* Sparkline */}
            <div className="w-12 h-6 ml-1">
              <svg className="w-full h-full" viewBox="0 0 50 20">
                <path d="M 0 16 Q 15 14 25 10 T 50 4" fill="none" stroke="#10b981" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Date, Weather & Plant */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-2xs font-semibold text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Mon, Apr 28, 2025 • 10:24 AM</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-2 rounded-xl shadow-2xs font-semibold text-slate-700">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>24°C Clear</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-2xs font-semibold text-slate-700">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>All Plants</span>
            </div>
          </div>
        </div>
      </div>

      {/* TOP KPI STRIP (8 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
        {/* 1. Active Cameras */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5">
            <Camera className="w-4 h-4" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 block leading-tight">48</span>
          <span className="text-[11px] font-semibold text-slate-600 block mt-0.5">Active Cameras</span>
          <span className="text-[10px] text-slate-500 font-medium block mt-1">
            <strong>8 sites</strong> • <span className="text-rose-600 font-bold">3 offline</span>
          </span>
        </div>

        {/* 2. Safety Incidents */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-1.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 block leading-tight">3</span>
          <span className="text-[11px] font-semibold text-slate-600 block mt-0.5">Safety Incidents</span>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <TrendingDown className="w-2.5 h-2.5" /> ↓ 40% vs last week
          </span>
        </div>

        {/* 3. PPE Compliance */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5">
            <HardHat className="w-4 h-4" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 block leading-tight">96%</span>
          <span className="text-[11px] font-semibold text-slate-600 block mt-0.5">PPE Compliance</span>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-2.5 h-2.5" /> ↑ 4% vs last week
          </span>
        </div>

        {/* 4. Unsafe-Zone Violations */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-1.5">
            <AlertOctagon className="w-4 h-4" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 block leading-tight">5</span>
          <span className="text-[11px] font-semibold text-slate-600 block mt-0.5">Unsafe-Zone Violations</span>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <TrendingDown className="w-2.5 h-2.5" /> ↓ 50% vs last week
          </span>
        </div>

        {/* 5. Forklift Traffic Alerts */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-1.5">
            <Truck className="w-4 h-4" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 block leading-tight">2</span>
          <span className="text-[11px] font-semibold text-slate-600 block mt-0.5">Forklift Alerts</span>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <TrendingDown className="w-2.5 h-2.5" /> ↓ 60% vs last week
          </span>
        </div>

        {/* 6. Blocked Exits */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-1.5">
            <DoorClosed className="w-4 h-4" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 block leading-tight">3</span>
          <span className="text-[11px] font-semibold text-slate-600 block mt-0.5">Blocked Exits</span>
          <span className="text-[10px] text-slate-500 font-medium block mt-1">
            <strong className="text-slate-900">0</strong> current
          </span>
        </div>

        {/* 7. Worker Congestion */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-1.5">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 block leading-tight">4</span>
          <span className="text-[11px] font-semibold text-slate-600 block mt-0.5">Worker Congestion</span>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <TrendingDown className="w-2.5 h-2.5" /> ↓ 33% vs last week
          </span>
        </div>

        {/* 8. Anomalies Detected */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1.5">
            <Eye className="w-4 h-4" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 block leading-tight">7</span>
          <span className="text-[11px] font-semibold text-slate-600 block mt-0.5">Anomalies Detected</span>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <TrendingDown className="w-2.5 h-2.5" /> ↓ 46% vs last week
          </span>
        </div>
      </div>

      {/* Sub-Navigation Tabs & Video Search CTA */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {subTabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeSubTab === t.name;
            return (
              <button
                key={t.name}
                onClick={() => setActiveSubTab(t.name)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.name}</span>
              </button>
            );
          })}
        </div>

        <button className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-colors">
          <Search className="w-3.5 h-3.5" />
          <span>Video Search (Natural Language)</span>
        </button>
      </div>

      {/* MAIN SECTION: LIVE CAMERA GRID (8 cols) + AI OBSERVATIONS (4 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Left: Live Camera Intelligence (8 cols) */}
        <div className="xl:col-span-8 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight mr-2">
                Live Camera Intelligence
              </h2>

              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
              >
                <option>All Areas</option>
                <option>Production Line</option>
                <option>Assembly Line</option>
                <option>Warehouse & Logistics</option>
                <option>Loading Docks</option>
              </select>

              <select
                value={selectedCameraFilter}
                onChange={(e) => setSelectedCameraFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
              >
                <option>All Cameras</option>
                <option>C1 - C6 (Active)</option>
                <option>C7 - C12 (Auxiliary)</option>
              </select>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live (45)
              </span>
              <span className="flex items-center gap-1.5 text-rose-600">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Alerts (3)
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-slate-400" /> Offline (3)
              </span>

              <button className="text-blue-600 hover:text-blue-800 text-xs font-bold ml-1 cursor-pointer">
                View All Cameras
              </button>
            </div>
          </div>

          {/* 6 Camera Streams Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {/* C1: Production Line 1 */}
            <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-950 flex flex-col group relative">
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                <Image
                  src="https://picsum.photos/seed/camera-factory-1/400/225"
                  alt="C1 Production Line 1"
                  fill
                  className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Live Badge & Timestamp */}
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> LIVE
                </div>
                <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                  10:24:12 AM
                </span>

                <span className="absolute top-7 left-2 text-white font-bold text-[10px] drop-shadow-md">
                  C1 - Production Line 1
                </span>

                {/* Bounding Box: Person & Machine */}
                <div className="absolute left-[20%] top-[25%] w-[25%] h-[55%] border-2 border-emerald-400 bg-emerald-500/10 rounded-sm">
                  <span className="absolute -top-4 left-0 bg-emerald-500 text-white text-[8px] font-bold px-1 rounded-t">
                    Person
                  </span>
                </div>
                <div className="absolute right-[15%] top-[30%] w-[35%] h-[50%] border-2 border-sky-400 bg-sky-500/10 rounded-sm">
                  <span className="absolute -top-4 left-0 bg-sky-500 text-white text-[8px] font-bold px-1 rounded-t">
                    Machine
                  </span>
                </div>

                {/* Bottom Overlay Pill */}
                <div className="absolute bottom-2 left-2 right-2 bg-emerald-950/85 backdrop-blur-xs border border-emerald-500/40 rounded-lg p-1 px-2 flex items-center justify-between text-[10px]">
                  <span className="text-emerald-300 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> PPE Compliant 98%
                  </span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-2 bg-white flex items-center justify-between text-[10px] text-slate-500">
                <span className="font-semibold text-slate-700">👥 2 people</span>
                <span className="text-emerald-600 font-medium">0 violations</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">
                  Normal
                </span>
              </div>
            </div>

            {/* C2: Assembly Line (ALERT!) */}
            <div className="rounded-xl border border-rose-300 ring-1 ring-rose-400/40 overflow-hidden bg-slate-950 flex flex-col group relative shadow-xs">
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                <Image
                  src="https://picsum.photos/seed/camera-factory-2/400/225"
                  alt="C2 Assembly Line"
                  fill
                  className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> LIVE
                </div>
                <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                  10:24:08 AM
                </span>

                <span className="absolute top-7 left-2 text-white font-bold text-[10px] drop-shadow-md">
                  C2 - Assembly Line
                </span>

                {/* Bounding Box: Missing Helmet! */}
                <div className="absolute left-[15%] top-[25%] w-[25%] h-[55%] border-2 border-emerald-400 bg-emerald-500/10 rounded-sm">
                  <span className="absolute -top-4 left-0 bg-emerald-500 text-white text-[8px] font-bold px-1 rounded-t">
                    Person
                  </span>
                </div>
                <div className="absolute right-[20%] top-[20%] w-[30%] h-[60%] border-2 border-rose-500 bg-rose-500/20 rounded-sm animate-pulse">
                  <span className="absolute -top-4 left-0 bg-rose-600 text-white text-[8px] font-bold px-1 rounded-t flex items-center gap-0.5">
                    Missing Helmet
                  </span>
                </div>

                {/* Bottom Overlay Pill: PPE Violation */}
                <div className="absolute bottom-2 left-2 right-2 bg-rose-950/85 backdrop-blur-xs border border-rose-500/40 rounded-lg p-1 px-2 flex items-center justify-between text-[10px]">
                  <span className="text-rose-300 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-rose-400" /> PPE Violation (87% conf)
                  </span>
                </div>
              </div>

              <div className="p-2 bg-white flex items-center justify-between text-[10px] text-slate-500">
                <span className="font-semibold text-slate-700">👥 6 people</span>
                <span className="text-rose-600 font-bold">1 violation</span>
                <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">
                  High Risk
                </span>
              </div>
            </div>

            {/* C3: Warehouse (ALERT!) */}
            <div className="rounded-xl border border-amber-300 overflow-hidden bg-slate-950 flex flex-col group relative">
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                <Image
                  src="https://picsum.photos/seed/camera-factory-3/400/225"
                  alt="C3 Warehouse"
                  fill
                  className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> LIVE
                </div>
                <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                  10:24:11 AM
                </span>

                <span className="absolute top-7 left-2 text-white font-bold text-[10px] drop-shadow-md">
                  C3 - Warehouse
                </span>

                {/* Bounding Box: Forklift & Pedestrian */}
                <div className="absolute left-[15%] top-[25%] w-[40%] h-[55%] border-2 border-amber-400 bg-amber-500/10 rounded-sm">
                  <span className="absolute -top-4 left-0 bg-amber-500 text-white text-[8px] font-bold px-1 rounded-t">
                    Forklift
                  </span>
                </div>
                <div className="absolute right-[10%] top-[35%] w-[25%] h-[45%] border-2 border-sky-400 bg-sky-500/10 rounded-sm">
                  <span className="absolute -top-4 left-0 bg-sky-500 text-white text-[8px] font-bold px-1 rounded-t">
                    Person
                  </span>
                </div>

                <div className="absolute bottom-2 left-2 right-2 bg-amber-950/85 backdrop-blur-xs border border-amber-500/40 rounded-lg p-1 px-2 flex items-center justify-between text-[10px]">
                  <span className="text-amber-300 font-bold flex items-center gap-1">
                    <Truck className="w-3 h-3 text-amber-400" /> Forklift in Pedestrian Zone
                  </span>
                </div>
              </div>

              <div className="p-2 bg-white flex items-center justify-between text-[10px] text-slate-500">
                <span className="font-semibold text-slate-700">👥 3 people</span>
                <span className="text-amber-600 font-bold">1 alert</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                  Medium Risk
                </span>
              </div>
            </div>

            {/* C4: Loading Dock */}
            <div className="rounded-xl border border-rose-300 overflow-hidden bg-slate-950 flex flex-col group relative">
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                <Image
                  src="https://picsum.photos/seed/camera-factory-4/400/225"
                  alt="C4 Loading Dock"
                  fill
                  className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> LIVE
                </div>
                <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                  10:24:10 AM
                </span>

                <span className="absolute top-7 left-2 text-white font-bold text-[10px] drop-shadow-md">
                  C4 - Loading Dock
                </span>

                {/* Restricted Zone Bounding Box */}
                <div className="absolute right-[5%] bottom-[15%] w-[45%] h-[40%] border-2 border-rose-500 border-dashed bg-rose-500/20 rounded-sm">
                  <span className="absolute top-1 left-1 text-rose-300 text-[8px] font-bold">
                    Restricted Area
                  </span>
                </div>

                <div className="absolute bottom-2 left-2 right-2 bg-rose-950/85 backdrop-blur-xs border border-rose-500/40 rounded-lg p-1 px-2 flex items-center justify-between text-[10px]">
                  <span className="text-rose-300 font-bold flex items-center gap-1">
                    <AlertOctagon className="w-3 h-3 text-rose-400" /> Unauthorized Access (94%)
                  </span>
                </div>
              </div>

              <div className="p-2 bg-white flex items-center justify-between text-[10px] text-slate-500">
                <span className="font-semibold text-slate-700">👥 2 people</span>
                <span className="text-rose-600 font-bold">1 violation</span>
                <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">
                  High Risk
                </span>
              </div>
            </div>

            {/* C5: Main Aisle */}
            <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-950 flex flex-col group relative">
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                <Image
                  src="https://picsum.photos/seed/camera-factory-5/400/225"
                  alt="C5 Main Aisle"
                  fill
                  className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> LIVE
                </div>
                <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                  10:24:06 AM
                </span>

                <span className="absolute top-7 left-2 text-white font-bold text-[10px] drop-shadow-md">
                  C5 - Main Aisle
                </span>

                <div className="absolute bottom-2 left-2 right-2 bg-emerald-950/85 backdrop-blur-xs border border-emerald-500/40 rounded-lg p-1 px-2 flex items-center justify-between text-[10px]">
                  <span className="text-emerald-300 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Normal Operation
                  </span>
                </div>
              </div>

              <div className="p-2 bg-white flex items-center justify-between text-[10px] text-slate-500">
                <span className="font-semibold text-slate-700">👥 2 people</span>
                <span className="text-emerald-600 font-medium">0 violations</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">
                  Normal
                </span>
              </div>
            </div>

            {/* C6: Packaging Line */}
            <div className="rounded-xl border border-amber-300 overflow-hidden bg-slate-950 flex flex-col group relative">
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                <Image
                  src="https://picsum.photos/seed/camera-factory-6/400/225"
                  alt="C6 Packaging Line"
                  fill
                  className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> LIVE
                </div>
                <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                  10:24:09 AM
                </span>

                <span className="absolute top-7 left-2 text-white font-bold text-[10px] drop-shadow-md">
                  C6 - Packaging Line
                </span>

                <div className="absolute bottom-2 left-2 right-2 bg-rose-950/85 backdrop-blur-xs border border-rose-500/40 rounded-lg p-1 px-2 flex items-center justify-between text-[10px]">
                  <span className="text-rose-300 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-rose-400" /> PPE Violation: No Gloves (91%)
                  </span>
                </div>
              </div>

              <div className="p-2 bg-white flex items-center justify-between text-[10px] text-slate-500">
                <span className="font-semibold text-slate-700">👥 4 people</span>
                <span className="text-amber-600 font-bold">1 violation</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                  Medium Risk
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: AI Observations Feed (4 cols) */}
        <div className="xl:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                AI Observations (C2 - Assembly Line)
              </h2>
              <span className="text-[10px] text-slate-400">Real-time object detection stream</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
              High Risk
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Observation 1 */}
            <div className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors flex items-center gap-3 cursor-pointer group">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-900">
                <Image
                  src="https://picsum.photos/seed/camera-factory-2/100/100"
                  alt="Worker without helmet"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 bg-rose-600 text-[8px] text-white px-1 font-bold">
                  87%
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                  Worker without helmet detected
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Area: Assembly Station 3 • Confidence: 87%
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
            </div>

            {/* Observation 2 */}
            <div className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors flex items-center gap-3 cursor-pointer group">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-900">
                <Image
                  src="https://picsum.photos/seed/camera-factory-3/100/100"
                  alt="Forklift entering pedestrian"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 bg-amber-500 text-[8px] text-white px-1 font-bold">
                  92%
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                  Forklift entering pedestrian zone
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Area: Main Aisle • Confidence: 92%
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
            </div>

            {/* Observation 3 */}
            <div className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors flex items-center gap-3 cursor-pointer group">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-900">
                <Image
                  src="https://picsum.photos/seed/camera-factory-6/100/100"
                  alt="PPE compliance"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 bg-amber-500 text-[8px] text-white px-1 font-bold">
                  78%
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                  PPE compliance below threshold
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Area: Assembly Line • Confidence: 78%
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
            </div>

            {/* Observation 4 */}
            <div className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors flex items-center gap-3 cursor-pointer group">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-900">
                <Image
                  src="https://picsum.photos/seed/camera-factory-5/100/100"
                  alt="Worker congestion"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 bg-blue-500 text-[8px] text-white px-1 font-bold">
                  76%
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                  Worker congestion detected
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Area: Station 5 • Confidence: 76%
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: Analytics & Spatial Intelligence (5 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-5">
        {/* PPE Compliance Trend (3 cols) */}
        <div className="xl:col-span-3 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">PPE Compliance Trend</h2>
            <select
              value={ppeRange}
              onChange={(e) => setPpeRange(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 focus:outline-none cursor-pointer"
            >
              <option>Last 14 days</option>
              <option>Last 30 days</option>
            </select>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">96%</span>
              <span className="text-[10px] text-emerald-600 font-bold">↑ 4% vs last week</span>
            </div>
            <span className="text-[10px] text-slate-400">Current Compliance</span>
          </div>

          <div className="pt-2">
            <div className="h-28 w-full flex items-end justify-between gap-1.5 px-1">
              {[88, 90, 92, 91, 94, 95, 93, 96, 95, 96, 97, 96].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col justify-end items-center h-full gap-0.5">
                  <div className="w-full bg-rose-400 rounded-t-xs" style={{ height: `${100 - val}%` }} />
                  <div className="w-full bg-emerald-500 rounded-t-xs" style={{ height: `${val}%` }} />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[8px] text-slate-400 font-mono pt-1">
              <span>Apr 15</span>
              <span>Apr 19</span>
              <span>Apr 23</span>
              <span>Apr 27</span>
            </div>
          </div>
        </div>

        {/* Incident Heatmap (3 cols) */}
        <div className="xl:col-span-3 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Incident Heatmap</h2>
            <select
              value={heatmapRange}
              onChange={(e) => setHeatmapRange(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 focus:outline-none cursor-pointer"
            >
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>

          {/* 2D Factory Floorplan Map */}
          <div className="relative h-36 rounded-xl border border-slate-200 bg-slate-50/70 p-2 overflow-hidden text-[9px] font-mono text-slate-500">
            {/* Zones */}
            <div className="absolute left-2 top-2 w-20 h-14 border border-dashed border-slate-300 rounded p-1">
              Warehouse
            </div>
            <div className="absolute left-24 top-2 w-24 h-14 border border-dashed border-slate-300 rounded p-1">
              Production
            </div>
            <div className="absolute right-2 top-2 w-20 h-14 border border-dashed border-slate-300 rounded p-1">
              Assembly
            </div>
            <div className="absolute left-2 bottom-2 w-28 h-12 border border-dashed border-slate-300 rounded p-1">
              Loading Dock
            </div>
            <div className="absolute right-2 bottom-2 w-28 h-12 border border-dashed border-slate-300 rounded p-1">
              Packaging
            </div>

            {/* Hot spots */}
            <div className="absolute right-8 top-6 w-8 h-8 rounded-full bg-rose-500/50 blur-sm pointer-events-none" />
            <div className="absolute right-10 top-8 w-4 h-4 rounded-full bg-rose-600 pointer-events-none animate-ping" />

            <div className="absolute left-14 bottom-4 w-7 h-7 rounded-full bg-amber-500/50 blur-sm pointer-events-none" />
            <div className="absolute left-16 bottom-6 w-3 h-3 rounded-full bg-amber-500 pointer-events-none" />
          </div>
        </div>

        {/* Worker & Vehicle Movement (2 cols) */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Movement Flows</h2>
            <span className="text-[10px] text-slate-400 font-mono">Today</span>
          </div>

          <div className="relative h-36 rounded-xl border border-slate-200 bg-slate-50/50 p-2 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 160 100">
              {/* Flow curves */}
              <path d="M 10 20 Q 80 80 150 20" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.7" />
              <path d="M 20 80 Q 80 20 140 80" fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.8" />
              <path d="M 10 50 Q 80 10 150 60" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 2" />
            </svg>
            <div className="flex justify-between text-[8px] text-slate-500 font-semibold pt-1">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" />Workers</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Forklifts</span>
            </div>
          </div>
        </div>

        {/* Top Risk Areas (2 cols) */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Top Risk Areas</h2>
            <span className="text-[10px] text-slate-400 font-mono">Week</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="p-1.5 rounded-lg bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block text-[11px]">1. Assembly Line</span>
                <span className="text-[9px] text-rose-600 font-medium">12 incidents ↑</span>
              </div>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-100 text-rose-700">High</span>
            </div>

            <div className="p-1.5 rounded-lg bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block text-[11px]">2. Loading Dock</span>
                <span className="text-[9px] text-rose-600 font-medium">8 incidents ↑</span>
              </div>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-100 text-rose-700">High</span>
            </div>

            <div className="p-1.5 rounded-lg bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block text-[11px]">3. Main Aisle</span>
                <span className="text-[9px] text-emerald-600 font-medium">6 incidents ↓</span>
              </div>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-700">Med</span>
            </div>
          </div>
        </div>

        {/* Operational Insights (2 cols) */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Operational Insights</h2>
            <span className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">View</span>
          </div>

          <div className="space-y-1.5 text-[10px]">
            <div className="p-2 rounded-lg bg-blue-50 border border-blue-100/60 text-slate-700">
              <strong>Forklift idle time</strong> up 18% near Loading Dock 9-11 AM.
            </div>
            <div className="p-2 rounded-lg bg-amber-50 border border-amber-100/60 text-slate-700">
              <strong>Worker congestion</strong> at Assembly during shift change.
            </div>
            <div className="p-2 rounded-lg bg-rose-50 border border-rose-100/60 text-slate-700">
              <strong>3 restricted zone violations</strong> detected today.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
