'use client';

import { useState } from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';

interface ProductionDay {
  date: string;
  actual: number;
  plan: number;
  oee: number;
}

const PERFORMANCE_DATA: ProductionDay[] = [
  { date: 'Apr 22', actual: 11200, plan: 9800, oee: 84 },
  { date: 'Apr 23', actual: 12100, plan: 10400, oee: 86 },
  { date: 'Apr 24', actual: 14200, plan: 11000, oee: 92 },
  { date: 'Apr 24', actual: 13500, plan: 10800, oee: 88 },
  { date: 'Apr 25', actual: 12900, plan: 11400, oee: 89 },
  { date: 'Apr 26', actual: 11800, plan: 10200, oee: 85 },
  { date: 'Apr 27', actual: 13800, plan: 11500, oee: 90 },
  { date: 'Apr 28', actual: 12428, plan: 11100, oee: 87 },
];

export default function ProductionPerformanceChart() {
  const [viewMode, setViewMode] = useState<'Units' | 'OEE %'>('Units');
  const [timeRange, setTimeRange] = useState('Last 7 days');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG Chart Dimensions
  const chartHeight = 150;
  const maxUnits = 16000;

  // Calculate points for the OEE % line overlay
  const oeePoints = PERFORMANCE_DATA.map((d, i) => {
    const x = 30 + i * 55;
    // OEE mapped from 0-100% to chartHeight
    const y = chartHeight - (d.oee / 100) * (chartHeight - 30);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
      {/* Top Header & Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">Production Performance</h2>
          <p className="text-xs text-slate-500 mt-0.5">Units produced vs plan across all factories.</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Units / OEE % Pills */}
          <div className="bg-slate-100 p-0.5 rounded-lg flex items-center text-xs font-semibold">
            <button
              onClick={() => setViewMode('Units')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                viewMode === 'Units' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Units
            </button>
            <button
              onClick={() => setViewMode('OEE %')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                viewMode === 'OEE %' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              OEE %
            </button>
          </div>

          {/* Time range */}
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 rounded-lg pl-2.5 pr-6 py-1 cursor-pointer focus:outline-none"
            >
              <option value="Last 7 days">Last 7 days</option>
              <option value="Last 14 days">Last 14 days</option>
              <option value="This Month">This Month</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Metric & Legend */}
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-slate-900 tracking-tight">12,428</span>
          <span className="text-xs text-slate-500 font-medium">Units produced</span>
          <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
            <ArrowUpRight className="w-3.5 h-3.5" /> 12% vs plan
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-blue-600 shrink-0" /> Actual
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-sky-200 shrink-0" /> Plan
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-500 ring-2 ring-teal-200 shrink-0" /> OEE %
          </span>
        </div>
      </div>

      {/* Dual Axis Interactive SVG Chart */}
      <div className="relative w-full h-[180px] select-none pt-2">
        {/* Left Axis Labels (Units) */}
        <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] font-mono text-slate-400 pointer-events-none">
          <span>15K</span>
          <span>10K</span>
          <span>5K</span>
          <span>0</span>
        </div>

        {/* Right Axis Labels (OEE %) */}
        <div className="absolute right-0 top-0 bottom-6 flex flex-col justify-between text-[10px] font-mono text-slate-400 pointer-events-none">
          <span>100%</span>
          <span>50%</span>
          <span>0%</span>
        </div>

        {/* Main Chart Canvas */}
        <div className="ml-8 mr-8 h-[150px] relative">
          {/* Horizontal gridlines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div className="border-b border-slate-100 w-full" />
            <div className="border-b border-slate-100 w-full" />
            <div className="border-b border-slate-100 w-full" />
            <div className="border-b border-slate-200 w-full" />
          </div>

          {/* SVG for line & bars */}
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
            {/* OEE Connecting Line */}
            <polyline
              fill="none"
              stroke="#0d9488"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={oeePoints}
            />

            {/* OEE Dots */}
            {PERFORMANCE_DATA.map((d, i) => {
              const x = 30 + i * 55;
              const y = chartHeight - (d.oee / 100) * (chartHeight - 30);
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={hoveredIndex === i ? 5 : 3.5}
                  fill="#ffffff"
                  stroke="#0d9488"
                  strokeWidth="2.5"
                  className="transition-all duration-150"
                />
              );
            })}
          </svg>

          {/* Bar Columns Container */}
          <div className="absolute inset-0 flex justify-between items-end px-3">
            {PERFORMANCE_DATA.map((item, idx) => {
              const actualH = (item.actual / maxUnits) * 100;
              const planH = (item.plan / maxUnits) * 100;
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={idx}
                  className="flex flex-col items-center group relative h-full justify-end cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Tooltip on hover */}
                  {isHovered && (
                    <div className="absolute -top-12 z-30 bg-slate-900 text-white text-[10px] py-1 px-2 rounded shadow-lg whitespace-nowrap animate-in fade-in duration-100 pointer-events-none">
                      <div className="font-semibold">{item.date}</div>
                      <div>Actual: {item.actual.toLocaleString()}</div>
                      <div>Plan: {item.plan.toLocaleString()}</div>
                      <div className="text-teal-400">OEE: {item.oee}%</div>
                    </div>
                  )}

                  {/* Dual Bar Group */}
                  <div className="flex items-end gap-1 mb-1">
                    {/* Actual Bar */}
                    <div
                      style={{ height: `${actualH}%` }}
                      className={`w-3.5 rounded-t-sm transition-all duration-200 ${
                        isHovered ? 'bg-blue-700' : 'bg-blue-600'
                      }`}
                    />
                    {/* Plan Bar */}
                    <div
                      style={{ height: `${planH}%` }}
                      className={`w-3.5 rounded-t-sm transition-all duration-200 ${
                        isHovered ? 'bg-sky-300' : 'bg-sky-200'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* X-axis date labels */}
        <div className="ml-8 mr-8 flex justify-between text-[10px] text-slate-500 font-medium pt-1 border-t border-transparent">
          {PERFORMANCE_DATA.map((d, i) => (
            <span key={i} className="text-center w-10 truncate">
              {d.date}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
