'use client';

import { useState } from 'react';
import {
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Gauge,
  Map,
  LayoutGrid,
  List,
  Globe2,
  Users,
  Box,
  DollarSign,
  AlertTriangle,
  AlertOctagon,
} from 'lucide-react';
import Image from 'next/image';

export interface FactoryPlant {
  id: string;
  name: string;
  country: string;
  specialty: string;
  image: string;
  health: number;
  change: string;
  isNegative?: boolean;
  critical: number;
  warning: number;
  online: number;
  manager: string;
  lines: number;
  oee: number;
  workforce: number;
  assets: number;
  readinessRUL: string;
  annualRevenue: string;
}

export const FACTORIES: FactoryPlant[] = [
  {
    id: 'berlin',
    name: 'Berlin, Germany',
    specialty: 'Automotive Components',
    country: 'Germany',
    image: 'https://picsum.photos/seed/berlin-factory/400/300',
    health: 98,
    change: '2%',
    isNegative: false,
    critical: 2,
    warning: 4,
    online: 94,
    manager: 'Hans Weber',
    lines: 7,
    oee: 94,
    workforce: 216,
    assets: 312,
    readinessRUL: '$48.2M',
    annualRevenue: '$52.1M',
  },
  {
    id: 'chicago',
    name: 'Chicago, USA',
    specialty: 'Industrial Machinery',
    country: 'USA',
    image: 'https://picsum.photos/seed/chicago-factory/400/300',
    health: 92,
    change: '4%',
    isNegative: false,
    critical: 1,
    warning: 3,
    online: 91,
    manager: 'Sarah Jenkins',
    lines: 8,
    oee: 91,
    workforce: 248,
    assets: 296,
    readinessRUL: '$36.4M',
    annualRevenue: '$52.1M',
  },
  {
    id: 'monterrey',
    name: 'Monterrey, Mexico',
    specialty: 'Electronics',
    country: 'Mexico',
    image: 'https://picsum.photos/seed/monterrey-factory/400/300',
    health: 88,
    change: '1%',
    isNegative: true,
    critical: 1,
    warning: 5,
    online: 87,
    manager: 'Carlos Mendez',
    lines: 6,
    oee: 87,
    workforce: 192,
    assets: 276,
    readinessRUL: '$35.4M',
    annualRevenue: '$36.4M',
  },
  {
    id: 'singapore',
    name: 'Singapore',
    specialty: 'Precision Manufacturing',
    country: 'Singapore',
    image: 'https://picsum.photos/seed/singapore-factory/400/300',
    health: 95,
    change: '3%',
    isNegative: false,
    critical: 0,
    warning: 2,
    online: 93,
    manager: 'Li Wei Chen',
    lines: 10,
    oee: 93,
    workforce: 236,
    assets: 362,
    readinessRUL: '$61.7M',
    annualRevenue: '$61.7M',
  },
];

interface PlantHealthOverviewProps {
  onSelectFactory: (factory: FactoryPlant) => void;
}

export default function PlantHealthOverview({ onSelectFactory }: PlantHealthOverviewProps) {
  const [viewMode, setViewMode] = useState<'map' | 'grid' | 'list'>('grid');

  const totalFactories = FACTORIES.length;
  const totalAssets = FACTORIES.reduce((sum, f) => sum + f.assets, 0).toLocaleString();
  const totalWorkforce = FACTORIES.reduce((sum, f) => sum + f.workforce, 0).toLocaleString();

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            <Globe2 className="w-4.5 h-4.5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Plant Network Overview</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {totalFactories} factories • {totalAssets} assets • {totalWorkforce} workforce
            </p>
          </div>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
          <button
            onClick={() => setViewMode('map')}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              viewMode === 'map' ? 'bg-white shadow-2xs text-blue-600' : 'text-slate-500 hover:text-slate-700'
            }`}
            title="Map View"
          >
            <Map className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              viewMode === 'grid' ? 'bg-white shadow-2xs text-blue-600' : 'text-slate-500 hover:text-slate-700'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              viewMode === 'list' ? 'bg-white shadow-2xs text-blue-600' : 'text-slate-500 hover:text-slate-700'
            }`}
            title="List View"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Factory Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FACTORIES.map((factory) => {
          const isRed = factory.health < 80;
          const isGood = factory.health >= 90;

          return (
            <div
              key={factory.id}
              onClick={() => onSelectFactory(factory)}
              className="group rounded-xl border border-slate-200/90 hover:border-blue-400/80 hover:shadow-md transition-all duration-200 cursor-pointer bg-gradient-to-b from-white to-slate-50/50 flex flex-col overflow-hidden"
            >
              {/* Factory Image */}
              <div className="relative w-full h-28 overflow-hidden">
                <Image
                  src={factory.image}
                  alt={factory.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />

                {/* Health Score Badge */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold border-2 shadow-md ${
                      isGood
                        ? 'bg-emerald-500 text-white border-emerald-400'
                        : isRed
                        ? 'bg-red-500 text-white border-red-400'
                        : 'bg-amber-500 text-white border-amber-400'
                    }`}
                  >
                    {factory.health}
                  </div>
                </div>

                {/* Factory Name Overlay */}
                <div className="absolute bottom-2 left-2.5 z-10">
                  <h3 className="text-sm font-bold text-white drop-shadow-md">{factory.name}</h3>
                  <p className="text-[10px] text-white/80 font-medium">{factory.specialty}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="p-3 space-y-2.5">
                {/* OEE / Workforce / Assets / Revenue */}
                <div className="grid grid-cols-4 gap-1 text-center text-[10px]">
                  <div>
                    <span className="text-slate-400 block">OEE</span>
                    <span className="font-bold text-slate-900 text-xs">{factory.oee}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Workforce</span>
                    <span className="font-bold text-slate-900 text-xs">{factory.workforce}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Assets</span>
                    <span className="font-bold text-slate-900 text-xs">{factory.assets}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Assets/RUL</span>
                    <span className="font-bold text-slate-900 text-xs">{factory.readinessRUL}</span>
                  </div>
                </div>

                {/* Trend + Revenue Row */}
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                  <div
                    className={`flex items-center gap-0.5 text-[11px] font-semibold ${
                      factory.isNegative ? 'text-red-600' : 'text-emerald-600'
                    }`}
                  >
                    {factory.isNegative ? (
                      <TrendingDown className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingUp className="w-3.5 h-3.5" />
                    )}
                    <span>{factory.change}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">{factory.annualRevenue}</span>
                </div>

                {/* Critical/Warning Badges */}
                <div className="flex items-center gap-2">
                  {factory.critical > 0 && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200/60">
                      <AlertOctagon className="w-3 h-3" />
                      {factory.critical} Critical
                    </span>
                  )}
                  {factory.warning > 0 && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                      <AlertTriangle className="w-3 h-3" />
                      {factory.warning} Warning
                    </span>
                  )}
                  {factory.critical === 0 && factory.warning === 0 && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                      ✓ All Clear
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
