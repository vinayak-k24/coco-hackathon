'use client';

import { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Map,
  List,
  Globe2,
  AlertOctagon,
  AlertTriangle,
} from 'lucide-react';
import Image from 'next/image';
import { fetchApi } from '@/lib/api';

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

export let FACTORIES: FactoryPlant[] = [];

interface PlantHealthOverviewProps {
  onSelectFactory: (factory: FactoryPlant) => void;
}

function HealthCircle({ value }: { value: number }) {
  const size = 50;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(100, Math.max(0, value));
  const offset = circumference - (pct / 100) * circumference;
  const color = pct >= 90 ? '#18B276' : pct >= 75 ? '#1677E8' : pct >= 50 ? '#F2A51A' : '#FF4D5A';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#EDF1F5" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span style={{ fontSize: 13, fontWeight: 700, color: '#203852', lineHeight: 1 }}>{value}</span>
        <span style={{ fontSize: 8, fontWeight: 500, color: '#8495A7', lineHeight: 1, marginTop: 1 }}>Health</span>
      </div>
    </div>
  );
}

export default function PlantHealthOverview({ onSelectFactory }: PlantHealthOverviewProps) {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [plants, setPlants] = useState<FactoryPlant[]>([]);
  const [scrollIndex, setScrollIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = () => fetchApi<FactoryPlant[]>('/api/plants', []).then((data) => {
      setPlants(data);
      FACTORIES = data;
    });
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  const displayPlants = plants.length > 0 ? plants : FACTORIES;
  const totalFactories = displayPlants.length;
  const totalAssets = displayPlants.reduce((sum, f) => sum + (f.assets || 0), 0).toLocaleString();
  const totalWorkforce = displayPlants.reduce((sum, f) => sum + (f.workforce || 0), 0).toLocaleString();

  const canPrev = scrollIndex > 0;
  const canNext = scrollIndex < displayPlants.length - 1;
  const prev = () => setScrollIndex((i) => Math.max(0, i - 1));
  const next = () => setScrollIndex((i) => Math.min(displayPlants.length - 1, i + 1));

  useEffect(() => {
    if (scrollRef.current) {
      const card = scrollRef.current.children[scrollIndex] as HTMLElement;
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }, [scrollIndex]);

  return (
    <div className="flex flex-col h-full" style={{ background: '#FFFFFF', border: '1px solid #E2EBF2', borderRadius: 12, boxShadow: '0 2px 8px rgba(35,70,105,0.04)', padding: '14px 16px' }}>
      {/* Header — ~50px */}
      <div className="flex items-center justify-between shrink-0" style={{ height: 50, marginBottom: 12 }}>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center" style={{ width: 38, height: 38, borderRadius: 9, background: '#EDF4FC', border: '1px solid #D8E6F2' }}>
            <Globe2 style={{ width: 17, height: 17, color: '#1677E8' }} />
          </div>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#172B4D', margin: 0, lineHeight: 1.2 }}>Plant Network Overview</h2>
            <p style={{ fontSize: 11, fontWeight: 500, color: '#8495A7', margin: 0, marginTop: 2 }}>
              {totalFactories} factories • {totalAssets} assets • {totalWorkforce} workforce
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Map / List toggle */}
          <div className="flex items-center" style={{ height: 34, background: '#F4F8FC', border: '1px solid #E2EAF1', borderRadius: 8, padding: 2 }}>
            <button
              onClick={() => setViewMode('map')}
              className="flex items-center gap-1 px-2.5 cursor-pointer transition-colors"
              style={{
                height: 30, borderRadius: 6,
                background: viewMode === 'map' ? '#FFFFFF' : 'transparent',
                fontWeight: viewMode === 'map' ? 600 : 500,
                fontSize: 11, color: viewMode === 'map' ? '#172B4D' : '#8495A7',
                boxShadow: viewMode === 'map' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              <Map style={{ width: 12, height: 12 }} /><span>Map</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className="flex items-center gap-1 px-2.5 cursor-pointer transition-colors"
              style={{
                height: 30, borderRadius: 6,
                background: viewMode === 'list' ? '#FFFFFF' : 'transparent',
                fontWeight: viewMode === 'list' ? 600 : 500,
                fontSize: 11, color: viewMode === 'list' ? '#172B4D' : '#8495A7',
                boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              <List style={{ width: 12, height: 12 }} /><span>List</span>
            </button>
          </div>

          {/* Carousel nav */}
          <button onClick={prev} disabled={!canPrev} className="flex items-center justify-center cursor-pointer transition-colors"
            style={{ width: 32, height: 32, borderRadius: 8, background: canPrev ? '#FFFFFF' : '#F8FAFC', border: '1px solid #DFE8F0', color: canPrev ? '#667C91' : '#C5D0DB' }}>
            <ChevronLeft style={{ width: 15, height: 15 }} />
          </button>
          <button onClick={next} disabled={!canNext} className="flex items-center justify-center cursor-pointer transition-colors"
            style={{ width: 32, height: 32, borderRadius: 8, background: canNext ? '#FFFFFF' : '#F8FAFC', border: '1px solid #DFE8F0', color: canNext ? '#667C91' : '#C5D0DB' }}>
            <ChevronRight style={{ width: 15, height: 15 }} />
          </button>
        </div>
      </div>

      {/* Factory Cards — fills remaining height */}
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth flex-1 min-h-0">
        {displayPlants.length === 0 ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="shrink-0 animate-pulse" style={{ width: 'calc(33.333% - 11px)', minWidth: 200, background: '#F8FAFC', border: '1px solid #E3EBF2', borderRadius: 11, height: '100%' }} />
          ))
        ) : (
          displayPlants.map((factory) => (
            <div
              key={factory.id}
              onClick={() => onSelectFactory(factory)}
              className="shrink-0 cursor-pointer transition-all hover:shadow-md group flex flex-col"
              style={{
                width: `calc(${100 / Math.min(displayPlants.length, 3)}% - ${displayPlants.length > 1 ? 11 : 0}px)`,
                minWidth: 200,
                background: '#FFFFFF',
                border: '1px solid #E3EBF2',
                borderRadius: 11,
                boxShadow: '0 2px 8px rgba(35,70,105,0.04)',
                overflow: 'hidden',
              }}
            >
              {/* Image */}
              <div className="relative w-full shrink-0 overflow-hidden" style={{ height: 72 }}>
                <Image src={factory.image} alt={factory.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute top-2 right-2">
                  <HealthCircle value={factory.health} />
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1" style={{ padding: '8px 10px 10px' }}>
                <div style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#172B4D', display: 'block', lineHeight: 1.2 }}>
                    {factory.name?.split(' ')[0] || factory.id}, {factory.country}
                  </span>
                  <span style={{ fontSize: 9, fontWeight: 500, color: '#8293A5' }}>{factory.specialty}</span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-4 gap-1" style={{ marginBottom: 6 }}>
                  {[
                    { label: 'OEE', value: `${factory.oee}%` },
                    { label: 'Workforce', value: factory.workforce },
                    { label: 'Assets', value: factory.assets },
                    { label: 'Revenue', value: factory.annualRevenue },
                  ].map((m) => (
                    <div key={m.label} className="text-center">
                      <span style={{ fontSize: 8, fontWeight: 500, color: '#8797A7', display: 'block' }}>{m.label}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#344B63' }}>{m.value}</span>
                    </div>
                  ))}
                </div>

                {/* Trend + Alerts */}
                <div className="flex items-center justify-between mt-auto" style={{ borderTop: '1px solid #E7EEF4', paddingTop: 7 }}>
                  <div className="flex items-center gap-0.5" style={{ fontSize: 10, fontWeight: 600, color: factory.isNegative ? '#FF4D5A' : '#18B276' }}>
                    {factory.isNegative ? <TrendingDown style={{ width: 12, height: 12 }} /> : <TrendingUp style={{ width: 12, height: 12 }} />}
                    <span>{factory.change}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {factory.critical > 0 && (
                      <span className="flex items-center gap-0.5" style={{ fontSize: 9, fontWeight: 700, color: '#FF4D5A', background: '#FEF2F2', padding: '2px 7px', borderRadius: 10 }}>
                        <AlertOctagon style={{ width: 10, height: 10 }} /> {factory.critical} Critical
                      </span>
                    )}
                    {factory.warning > 0 && factory.critical === 0 && (
                      <span className="flex items-center gap-0.5" style={{ fontSize: 9, fontWeight: 700, color: '#F2A51A', background: '#FFFBEB', padding: '2px 7px', borderRadius: 10 }}>
                        <AlertTriangle style={{ width: 10, height: 10 }} /> {factory.warning} Warning
                      </span>
                    )}
                    {factory.critical === 0 && factory.warning === 0 && (
                      <span style={{ fontSize: 9, fontWeight: 600, color: '#18B276' }}>● No active alerts</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
