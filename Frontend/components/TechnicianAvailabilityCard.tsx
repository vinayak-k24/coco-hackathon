'use client';

interface TechnicianAvailabilityCardProps {
  onManageWorkforce: () => void;
}

export default function TechnicianAvailabilityCard({ onManageWorkforce }: TechnicianAvailabilityCardProps) {
  // SVG Donut calculation
  // Total workforce = 48 + 12 + 6 + 4 = 70
  // Available = 48 (~68.5% of total or 76% of shift capacity)
  const radius = 42;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius; // ~263.89

  const availablePercent = 76;
  const availableDash = (availablePercent / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 tracking-tight">Technician Availability</h2>
        <p className="text-xs text-slate-500 mt-0.5">Workforce status across shifts.</p>
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
            {/* Unavailable red */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#ef4444"
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference * 0.06} ${circumference}`}
              strokeDashoffset={0}
              strokeLinecap="round"
            />
            {/* In training amber */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#d97706"
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference * 0.08} ${circumference}`}
              strokeDashoffset={circumference * -0.06}
              strokeLinecap="round"
            />
            {/* Available teal/cyan */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#0ea5e9"
              strokeWidth={strokeWidth}
              strokeDasharray={`${availableDash} ${circumference}`}
              strokeDashoffset={circumference * -0.15}
              strokeLinecap="round"
            />
          </svg>

          {/* Inner Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-lg font-extrabold text-slate-900 leading-tight">76%</span>
            <span className="text-[9px] font-medium text-slate-400 leading-tight">Available</span>
          </div>
        </div>

        {/* Legend items */}
        <div className="flex-1 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <strong className="text-slate-900">48</strong> Available
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-yellow-400 shrink-0" />
              <strong className="text-slate-900">12</strong> In progress
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-amber-700 shrink-0" />
              <strong className="text-slate-900">6</strong> In training
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <strong className="text-slate-900">4</strong> Unavailable
            </span>
          </div>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={onManageWorkforce}
        className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-blue-600 transition-colors text-center cursor-pointer shadow-2xs"
      >
        Manage workforce
      </button>
    </div>
  );
}
