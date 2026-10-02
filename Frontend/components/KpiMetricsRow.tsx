'use client';

import { useState, useEffect } from 'react';
import {
  AlertOctagon,
  Clock,
  DollarSign,
  FileSpreadsheet,
  TrendingUp,
} from 'lucide-react';
import { fetchApi, formatINR } from '@/lib/api';

interface KpiData {
  alerts_active: number;
  oee_avg: number;
  breakdown_hours: number;
  breakdown_cost_inr: number;
  orders_at_risk: number;
  assets_online_pct: number;
  safety_score: number;
  energy_efficiency: number;
  predicted_cost_avoidance_inr: number;
}

interface KpiConfig {
  id: string;
  label: string;
  key: keyof KpiData;
  type: 'percentage' | 'number' | 'currency';
  color: string;
  icon?: React.ComponentType<{ style?: React.CSSProperties }>;
  increaseIsGood: boolean;
}

const PERCENTAGE_KPIS: KpiConfig[] = [
  { id: 'plant-oee', label: 'Plant OEE', key: 'oee_avg', type: 'percentage', color: '#1677E8', increaseIsGood: true },
  { id: 'assets-online', label: 'Assets Online', key: 'assets_online_pct', type: 'percentage', color: '#18B276', increaseIsGood: true },
  { id: 'safety-score', label: 'Safety Score', key: 'safety_score', type: 'percentage', color: '#18B276', increaseIsGood: true },
  { id: 'energy-efficiency', label: 'Energy Efficiency', key: 'energy_efficiency', type: 'percentage', color: '#F2A51A', increaseIsGood: true },
];

const NORMAL_KPIS: KpiConfig[] = [
  { id: 'open-alerts', label: 'Open Alerts', key: 'alerts_active', type: 'number', color: '#FF4D5A', icon: AlertOctagon, increaseIsGood: false },
  { id: 'breakdown-hours', label: 'Breakdown Hours', key: 'breakdown_hours', type: 'number', color: '#1677E8', icon: Clock, increaseIsGood: false },
  { id: 'breakdown-cost', label: 'Breakdown Cost', key: 'breakdown_cost_inr', type: 'currency', color: '#7157E8', icon: DollarSign, increaseIsGood: false },
  { id: 'orders-at-risk', label: 'Orders at Risk', key: 'orders_at_risk', type: 'number', color: '#F2A51A', icon: FileSpreadsheet, increaseIsGood: false },
  { id: 'predicted-cost-avoidance', label: 'Cost Avoidance', key: 'predicted_cost_avoidance_inr', type: 'currency', color: '#18B276', icon: TrendingUp, increaseIsGood: true },
];

function CircularGauge({ value, size = 50 }: { value: number; size?: number }) {
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
      <span
        className="absolute inset-0 flex items-center justify-center"
        style={{ fontSize: 14, fontWeight: 700, color: '#203852' }}
      >
        {pct}%
      </span>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse flex flex-col items-center justify-center" style={{ background: '#FFFFFF', border: '1px solid #E2EBF2', borderRadius: 11, height: 112, padding: '10px 14px' }}>
      <div className="w-12 h-12 rounded-full bg-slate-100 mb-2" />
      <div className="w-10 h-3 bg-slate-100 rounded mb-1" />
      <div className="w-16 h-2 bg-slate-100 rounded" />
    </div>
  );
}

interface KpiMetricsRowProps {
  onCardClick: (cardId: string) => void;
}

export default function KpiMetricsRow({ onCardClick }: KpiMetricsRowProps) {
  const [kpis, setKpis] = useState<KpiData | null>(null);

  useEffect(() => {
    const fallback: KpiData = { alerts_active: 0, oee_avg: 0, breakdown_hours: 0, breakdown_cost_inr: 0, orders_at_risk: 0, assets_online_pct: 0, safety_score: 0, energy_efficiency: 0, predicted_cost_avoidance_inr: 0 };
    const load = () => fetchApi<KpiData>('/api/kpis', fallback).then(setKpis);
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  const allKpis = [...PERCENTAGE_KPIS, ...NORMAL_KPIS];

  if (!kpis) {
    return (
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${allKpis.length}, 1fr)`, marginTop: 24, marginBottom: 20 }}>
        {allKpis.map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${allKpis.length}, 1fr)`, marginTop: 24, marginBottom: 20 }}>
      {allKpis.map((item) => {
        const raw = kpis[item.key] ?? 0;

        if (item.type === 'percentage') {
          return (
            <div
              key={item.id}
              onClick={() => onCardClick(item.id)}
              className="flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-md"
              style={{
                height: 112,
                background: '#FFFFFF',
                border: '1px solid #E2EBF2',
                borderRadius: 11,
                boxShadow: '0 2px 8px rgba(35,70,105,0.04)',
                padding: '10px 14px',
              }}
            >
              <CircularGauge value={raw} />
              <span style={{ fontSize: 9, fontWeight: 500, color: '#7D8EA0', marginTop: 6, textAlign: 'center', lineHeight: 1.2 }}>{item.label}</span>
              {/* Trend row placeholder — backend trend data not yet available */}
              <span style={{ fontSize: 9, fontWeight: 600, color: '#8495A7', marginTop: 3 }}>—</span>
            </div>
          );
        }

        const Icon = item.icon!;
        const display = item.type === 'currency' ? formatINR(raw) : typeof raw === 'number' && raw % 1 !== 0 ? raw.toFixed(1) : `${raw}`;

        return (
          <div
            key={item.id}
            onClick={() => onCardClick(item.id)}
            className="flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-md"
            style={{
              height: 112,
              background: '#FFFFFF',
              border: '1px solid #E2EBF2',
              borderRadius: 11,
              boxShadow: '0 2px 8px rgba(35,70,105,0.04)',
              padding: '10px 14px',
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{ width: 34, height: 34, borderRadius: 8, background: `${item.color}10`, marginBottom: 6 }}
            >
              <Icon style={{ width: 17, height: 17, color: item.color }} />
            </div>
            <span style={{ fontSize: 17, fontWeight: 700, color: '#203852', lineHeight: 1.1 }}>{display}</span>
            <span style={{ fontSize: 9, fontWeight: 500, color: '#7D8EA0', marginTop: 3, textAlign: 'center', lineHeight: 1.2 }}>{item.label}</span>
            {/* Trend row placeholder */}
            <span style={{ fontSize: 9, fontWeight: 600, color: '#8495A7', marginTop: 3 }}>—</span>
          </div>
        );
      })}
    </div>
  );
}
