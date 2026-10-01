'use client';

interface MaintenanceReadinessCardProps {
  onViewPlan: () => void;
}

export default function MaintenanceReadinessCard({ onViewPlan }: MaintenanceReadinessCardProps) {
  // SVG Donut calculation
  // Total assets = 1 + 8 + 23 + 284 = 316
  // On track = 284 (~90%), Next week = 23 (~7%), This week = 8 (~2.5%), Due today = 1 (~0.5%)
  const radius = 42;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius; // ~263.89

  // Angles/offsets for SVG ring
  const healthyPercent = 94;
  const healthyDash = (healthyPercent / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 tracking-tight">Maintenance Readiness</h2>
        <p className="text-xs text-slate-500 mt-0.5">Asset health and upcoming work.</p>
      </div>

      {/* Donut & Legend Container */}
      <div className="flex items-center justify-between gap-4 my-3">
        {/* SVG Donut */}
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background base track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
            />
            {/* Warning portion */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#f59e0b"
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={circumference * 0.03}
              strokeLinecap="round"
            />
            {/* Critical due today portion */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#ef4444"
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference * 0.05} ${circumference}`}
              strokeDashoffset={0}
              strokeLinecap="round"
            />
            {/* Healthy green / teal portion */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#0d9488"
              strokeWidth={strokeWidth}
              strokeDasharray={`${healthyDash} ${circumference}`}
              strokeDashoffset={circumference * -0.06}
              strokeLinecap="round"
            />
          </svg>

          {/* Inner Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-lg font-extrabold text-slate-900 leading-tight">94%</span>
            <span className="text-[9px] font-medium text-slate-400 leading-tight">Assets healthy</span>
          </div>
        </div>

        {/* Legend items */}
        <div className="flex-1 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <strong className="text-slate-900">1</strong> Due today
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              <strong className="text-slate-900">8</strong> This week
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-yellow-400 shrink-0" />
              <strong className="text-slate-900">23</strong> Next week
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
              <strong className="text-slate-900">284</strong> On track
            </span>
          </div>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={onViewPlan}
        className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-blue-600 transition-colors text-center cursor-pointer shadow-2xs"
      >
        View maintenance plan
      </button>
    </div>
  );
}
