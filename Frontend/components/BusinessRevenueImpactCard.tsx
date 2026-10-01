'use client';

import { useState } from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';

interface BusinessRevenueImpactCardProps {
  onViewFinance?: () => void;
}

export default function BusinessRevenueImpactCard({ onViewFinance }: BusinessRevenueImpactCardProps = {}) {
  const [range, setRange] = useState('This Month');

  // Chart data points (Apr 1 to Apr 30)
  // Mapped to SVG viewBox 0 0 300 100
  // Values: Apr 1 (~2M), Apr 8 (~4M), Apr 15 (~6M), Apr 22 (~12.4M peak), Apr 30 (~8M)
  const pathD = 'M 10 90 Q 60 85 90 75 T 160 65 T 230 25 T 290 50';
  const areaD = 'M 10 90 Q 60 85 90 75 T 160 65 T 230 25 T 290 50 L 290 95 L 10 95 Z';

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {onViewFinance && (
            <button
              onClick={onViewFinance}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
            >
              ROI Center →
            </button>
          )}
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">Business & Revenue Impact</h2>
        </div>

        <div className="relative">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 rounded-lg pl-2.5 pr-6 py-1 cursor-pointer focus:outline-none"
          >
            <option value="This Month">This Month</option>
            <option value="Last Quarter">Last Quarter</option>
            <option value="Year to Date">Year to Date</option>
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
        </div>
      </div>

      {/* Two KPI Stats */}
      <div className="grid grid-cols-2 gap-3 py-1 mb-2">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-extrabold text-slate-900 tracking-tight">$12.4M</span>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600">
              <ArrowUpRight className="w-3 h-3" /> 2%
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Revenue (at risk)</span>
        </div>

        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-extrabold text-slate-900 tracking-tight">2.1%</span>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600">
              <ArrowUpRight className="w-3 h-3" /> 0.8%
            </span>
          </div>
          <span className="text-[11px] text-slate-400">On-time delivery risk</span>
        </div>
      </div>

      {/* Area Line Chart */}
      <div className="relative w-full h-[105px]">
        {/* Y Axis */}
        <div className="absolute left-0 top-0 bottom-5 flex flex-col justify-between text-[9px] font-mono text-slate-400 pointer-events-none">
          <span>$20M</span>
          <span>$10M</span>
          <span>$0</span>
        </div>

        {/* SVG Area Chart */}
        <div className="ml-8 h-[80px] relative">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Area Fill */}
            <path d={areaD} fill="url(#revenueGradient)" />

            {/* Top Red Curve */}
            <path
              d={pathD}
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Marker on peak */}
            <circle cx="230" cy="25" r="4.5" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
          </svg>

          {/* Floating Peak Tooltip Badge */}
          <div className="absolute left-[66%] top-[2px] -translate-x-1/2 bg-rose-50 border border-rose-200/80 rounded-md px-1.5 py-0.5 text-[9px] font-bold text-rose-600 shadow-2xs whitespace-nowrap pointer-events-none">
            $12.4M at risk
          </div>
        </div>

        {/* X Axis */}
        <div className="ml-8 flex justify-between text-[9px] font-medium text-slate-400 pt-1">
          <span>Apr 1</span>
          <span>Apr 8</span>
          <span>Apr 15</span>
          <span>Apr 22</span>
          <span>Apr 30</span>
        </div>
      </div>
    </div>
  );
}
