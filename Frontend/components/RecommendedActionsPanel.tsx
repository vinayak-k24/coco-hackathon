'use client';

import { useState, useEffect } from 'react';
import {
  AlertOctagon,
  Zap,
  Shield,
  Clock,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface RecommendedAction {
  id: string;
  severity: 'Critical' | 'Optimisation' | 'Preventive';
  title: string;
  subtitle: string;
  impact: 'High' | 'Medium' | 'Low';
  customerImpact: string;
  savingsOrBenefit: string;
  effort: string;
}

interface RecommendedActionsPanelProps {
  onViewAll?: () => void;
}

const severityConfig = {
  Critical: { icon: AlertOctagon, borderColor: '#FF4D5A', badgeBg: '#FEF2F2', badgeText: '#DC2626' },
  Optimisation: { icon: Zap, borderColor: '#1677E8', badgeBg: '#EFF6FF', badgeText: '#1D4ED8' },
  Preventive: { icon: Shield, borderColor: '#F2A51A', badgeBg: '#FFFBEB', badgeText: '#B45309' },
};

function SkeletonCard() {
  return (
    <div className="animate-pulse" style={{ background: '#F8FAFC', border: '1px solid #E3EBF2', borderRadius: 9, padding: '10px 12px', height: 76, marginBottom: 8 }}>
      <div className="flex gap-2 mb-2">
        <div className="w-12 h-4 bg-slate-200 rounded" />
        <div className="w-36 h-4 bg-slate-200 rounded" />
      </div>
      <div className="w-28 h-3 bg-slate-200 rounded mb-2" />
      <div className="flex gap-4">
        <div className="w-14 h-3 bg-slate-100 rounded" />
        <div className="w-14 h-3 bg-slate-100 rounded" />
        <div className="w-14 h-3 bg-slate-100 rounded" />
      </div>
    </div>
  );
}

export default function RecommendedActionsPanel({ onViewAll }: RecommendedActionsPanelProps) {
  const [actions, setActions] = useState<RecommendedAction[] | null>(null);
  const [error, setError] = useState(false);

  const loadActions = () => {
    setError(false);
    fetchApi<RecommendedAction[]>('/api/recommendations')
      .then((data) => setActions(data))
      .catch(() => { setActions([]); setError(true); });
  };

  useEffect(() => {
    loadActions();
    const interval = setInterval(loadActions, 30000);
    return () => clearInterval(interval);
  }, []);

  const totalCount = actions?.length ?? 0;

  return (
    <div className="flex flex-col h-full" style={{
      background: '#FFFFFF', border: '1px solid #E2EBF2', borderRadius: 12,
      boxShadow: '0 2px 8px rgba(35,70,105,0.04)', padding: '14px 16px',
    }}>
      {/* Header — ~50px, matches Plant Network header */}
      <div className="flex items-center justify-between shrink-0" style={{ height: 50, marginBottom: 12 }}>
        <div className="flex items-center gap-2">
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#172B4D', margin: 0 }}>Recommended Actions</h2>
          {totalCount > 0 && (
            <span style={{ fontSize: 10, fontWeight: 700, color: '#1677E8', background: '#EFF6FF', borderRadius: 10, padding: '2px 8px', lineHeight: '16px' }}>
              {totalCount}
            </span>
          )}
        </div>
        {onViewAll && totalCount > 0 && (
          <button onClick={onViewAll} className="cursor-pointer flex items-center gap-0.5" style={{ fontSize: 10, fontWeight: 600, color: '#1677E8' }}>
            View All <ChevronRight style={{ width: 12, height: 12 }} />
          </button>
        )}
      </div>

      {/* Content — fills remaining height, internal scroll */}
      <div className="flex-1 overflow-y-auto no-scrollbar min-h-0">
        {/* Loading */}
        {actions === null && !error && (
          <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
        )}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="flex items-center justify-center" style={{ width: 42, height: 42, borderRadius: '50%', background: '#FFF7ED', marginBottom: 12 }}>
              <AlertTriangle style={{ width: 18, height: 18, color: '#F59E0B' }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#172B4D', marginBottom: 4 }}>Unable to load recommendations</span>
            <span style={{ fontSize: 10, fontWeight: 500, color: '#8495A7', marginBottom: 12 }}>Check your connection and try again</span>
            <button onClick={loadActions} className="flex items-center gap-1.5 cursor-pointer"
              style={{ fontSize: 11, fontWeight: 600, color: '#1677E8', background: '#EFF6FF', border: '1px solid #DBEAFE', borderRadius: 7, padding: '6px 14px' }}>
              <RefreshCw style={{ width: 12, height: 12 }} /> Try again
            </button>
          </div>
        )}

        {/* Empty — healthy */}
        {actions !== null && actions.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="flex items-center justify-center" style={{ width: 42, height: 42, borderRadius: '50%', background: '#EAF9F2', marginBottom: 12 }}>
              <CheckCircle2 style={{ width: 18, height: 18, color: '#18B276' }} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#172B4D', marginBottom: 4 }}>All caught up</span>
            <span style={{ fontSize: 11, fontWeight: 500, color: '#8495A7', textAlign: 'center', maxWidth: 220 }}>
              No actions require your attention right now.
            </span>
          </div>
        )}

        {/* Recommendation cards */}
        {actions !== null && actions.length > 0 && (
          <div className="space-y-2">
            {actions.map((action) => {
              const config = severityConfig[action.severity] || severityConfig.Preventive;
              return (
                <div
                  key={action.id}
                  className="group cursor-pointer transition-all hover:shadow-sm"
                  style={{
                    background: '#FFFFFF', border: '1px solid #E3EBF2', borderRadius: 9,
                    borderLeft: `4px solid ${config.borderColor}`, padding: '10px 12px',
                    minHeight: 74,
                  }}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: config.badgeBg, color: config.badgeText }}>
                          {action.severity}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#172B4D', lineHeight: 1.2 }} className="truncate">
                          {action.title}
                        </span>
                      </div>
                      <span style={{ fontSize: 9, fontWeight: 500, color: '#8495A7', display: 'block', marginBottom: 6, lineHeight: 1.2 }}>
                        {action.subtitle}
                      </span>
                      <div className="flex items-center gap-3">
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#18B276' }}>{action.savingsOrBenefit}</span>
                        <span style={{
                          fontSize: 9, fontWeight: 600, padding: '1px 5px', borderRadius: 3,
                          background: action.impact === 'High' ? '#FEF2F2' : action.impact === 'Medium' ? '#FFFBEB' : '#F1F5F9',
                          color: action.impact === 'High' ? '#DC2626' : action.impact === 'Medium' ? '#B45309' : '#64748B',
                        }}>
                          {action.impact}
                        </span>
                        <span className="flex items-center gap-0.5" style={{ fontSize: 9, fontWeight: 500, color: '#8495A7' }}>
                          <Clock style={{ width: 9, height: 9 }} /> {action.effort}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform" style={{ width: 16, height: 16, color: '#C5D0DB' }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
