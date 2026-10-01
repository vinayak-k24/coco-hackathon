'use client';

import { Sparkles, FileText, ArrowRight, ShieldCheck, Zap, BarChart3 } from 'lucide-react';

interface ProactiveInsightsCardProps {
  onCreateActionPlan: () => void;
  onOpenCopilot: () => void;
  onNavigateToInsights?: () => void;
}

export default function ProactiveInsightsCard({
  onCreateActionPlan,
  onOpenCopilot,
  onNavigateToInsights,
}: ProactiveInsightsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 tracking-tight block">
              Proactive Operational Insight
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Autonomous Forecasting</span>
          </div>
        </div>
        <span className="text-[10px] text-slate-400 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
          5 min ago
        </span>
      </div>

      {/* Main insight callout */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-sky-50/60 border border-blue-100/90 space-y-2">
        <p className="text-xs text-slate-700 leading-relaxed font-medium">
          Based on current trends, <strong className="text-slate-900">Assembly Line 3</strong> may hit{' '}
          <span className="text-rose-600 font-bold">90% capacity in 5 days</span>. Consider rebalancing orders or adding a second shift to avoid delivery delays.
        </p>
        <div className="flex items-center gap-2 pt-1">
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
            <ShieldCheck className="w-3 h-3" /> Impact: 0 Delay Risk
          </span>
          <span className="text-[10px] text-slate-500 font-medium">Pune Plant</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-1">
        {onNavigateToInsights && (
          <button
            onClick={onNavigateToInsights}
            className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer ring-1 ring-blue-500/30"
          >
            <BarChart3 className="w-3.5 h-3.5 text-blue-200" />
            <span>Open Insights & Prediction Lab →</span>
          </button>
        )}

        <button
          onClick={onCreateActionPlan}
          className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span>Create Capacity Action Plan</span>
        </button>

        <button
          onClick={onOpenCopilot}
          className="w-full py-2 px-3 rounded-xl bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200/80 text-blue-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 text-blue-600 fill-current" />
          <span>Ask Nexa Copilot to Rebalance</span>
        </button>
      </div>
    </div>
  );
}
