'use client';

import {
  ChevronDown,
  TrendingUp,
  User,
  Coins,
  Key,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const chartData = [
  { date: 'Nov 1', red: 2.8, green: null, purple: null },
  { date: '', red: 2.6, green: null, purple: null },
  { date: 'Nov 8', red: 2.9, green: null, purple: null },
  { date: '', red: 2.1, green: null, purple: null },
  { date: 'Nov 15', red: 2.0, green: null, purple: null },
  { date: '', red: 1.8, green: null, purple: null },
  { date: 'Nov 22', red: 1.5, green: null, purple: null },
  { date: '', red: 1.4, green: null, purple: null },
  { date: 'Nov 29', red: 1.1, green: 1.1, purple: null },
  { date: '', red: null, green: 1.25, purple: null },
  { date: 'Dec 6', red: null, green: 1.05, purple: 1.05 },
  { date: '', red: null, green: null, purple: 0.9 },
  { date: 'Dec 13', red: null, green: null, purple: 0.8 },
  { date: '', red: null, green: null, purple: 0.72 },
  { date: 'Dec 20', red: null, green: null, purple: 0.65 },
];

export default function BusinessImpactSection({ onViewDetails }: { onViewDetails?: () => void }) {
  return (
    <div className="mt-3.5">
      {/* Outer Dashboard Card */}
      <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/70 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] relative">

        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] flex items-center justify-center text-[#2563EB]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="12" width="4" height="9" rx="1" />
                <rect x="10" y="7" width="4" height="14" rx="1" />
                <rect x="17" y="3" width="4" height="18" rx="1" />
              </svg>
            </div>
            <h2 className="text-[20px] font-bold text-[#0F172A] tracking-tight">Business Impact</h2>
          </div>

          <div className="flex items-center gap-6 text-[13px] font-medium text-[#64748B]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#EF4444]"></span>
              <span className="text-[#475569]">Current exposure</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#10B981]"></span>
              <span className="text-[#475569]">With AI recommendations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 flex items-center gap-0.5 justify-center">
                <span className="w-1 h-[2px] bg-[#6366F1]"></span>
                <span className="w-1 h-[2px] bg-[#6366F1]"></span>
              </div>
              <button className="flex items-center gap-1 text-[#475569] hover:text-[#0F172A] transition">
                <span>Forecast</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Dashboard Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">

          {/* LEFT: Chart */}
          <div className="lg:col-span-6 flex flex-col justify-between pt-1">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[14px] font-bold text-[#0F172A]">Revenue</span>
              <button className="flex items-center gap-1 text-[14px] font-bold text-[#0F172A] hover:opacity-80">
                <span>Exposure</span>
                <span className="text-[13px] font-normal text-[#64748B]">(at risk)</span>
                <ChevronDown className="w-4 h-4 text-[#64748B]" />
              </button>
            </div>

            <div className="h-[250px] w-full relative">
              {/* Callout 1: Red */}
              <div className="absolute left-[13%] top-[12%] z-20 pointer-events-none">
                <div className="bg-[#FEF2F2] border border-[#FCA5A5]/60 rounded-xl px-3 py-1.5 shadow-sm flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#EF4444] text-white flex items-center justify-center text-[9px] font-bold">
                    🛡
                  </div>
                  <div className="leading-tight">
                    <div className="text-[12px] font-bold text-[#991B1B]">$2.4M</div>
                    <div className="text-[10px] text-[#DC2626] font-medium whitespace-nowrap">Current exposure</div>
                  </div>
                </div>
              </div>

              {/* Callout 2: Green */}
              <div className="absolute left-[44%] top-[40%] z-20 pointer-events-none">
                <div className="bg-[#ECFDF5] border border-[#6EE7B7]/60 rounded-xl px-3 py-1.5 shadow-sm flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[9px] font-bold">
                    ✓
                  </div>
                  <div className="leading-tight">
                    <div className="text-[12px] font-bold text-[#065F46]">$1.1M</div>
                    <div className="text-[10px] text-[#059669] font-medium whitespace-nowrap">With AI actions</div>
                  </div>
                </div>
              </div>

              {/* Callout 3: Purple */}
              <div className="absolute left-[64%] top-[53%] z-20 pointer-events-none">
                <div className="bg-[#F5F3FF] border border-[#DDD6FE]/80 rounded-xl px-3 py-1.5 shadow-sm flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center text-[9px] font-bold">
                    ✨
                  </div>
                  <div className="leading-tight">
                    <div className="text-[11px] font-bold text-[#5B21B6]">Projected</div>
                    <div className="text-[10px] text-[#7C3AED] font-semibold whitespace-nowrap">-54% exposure</div>
                  </div>
                </div>
              </div>

              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 25, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="biRedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EF4444" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#EF4444" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="biGreenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#10B981" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="biPurpleGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="0" vertical={true} horizontal={true} stroke="#F1F5F9" />

                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748B', fontSize: 11, fontWeight: 400 }}
                  />
                  <YAxis
                    domain={[0, 3]}
                    ticks={[0, 1.0, 2.0, 3.0]}
                    tickFormatter={(val: number) => val === 0 ? '$0' : `$${val.toFixed(1)}M`}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748B', fontSize: 11, fontWeight: 400 }}
                  />

                  <Area
                    type="monotone"
                    dataKey="red"
                    stroke="#EF4444"
                    strokeWidth={2}
                    fill="url(#biRedGradient)"
                    connectNulls={false}
                    dot={(props: Record<string, unknown>) => {
                      if (props.index === 2) {
                        return <circle key="red-dot" cx={props.cx as number} cy={props.cy as number} r={4} fill="#EF4444" stroke="#FFF" strokeWidth={2} />;
                      }
                      return <g key={`red-empty-${props.index}`} />;
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="green"
                    stroke="#10B981"
                    strokeWidth={2}
                    fill="url(#biGreenGradient)"
                    connectNulls={false}
                    dot={(props: Record<string, unknown>) => {
                      if (props.index === 8) {
                        return <circle key="green-dot" cx={props.cx as number} cy={props.cy as number} r={4} fill="#10B981" stroke="#FFF" strokeWidth={2} />;
                      }
                      return <g key={`green-empty-${props.index}`} />;
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="purple"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fill="url(#biPurpleGradient)"
                    connectNulls={false}
                    dot={(props: Record<string, unknown>) => {
                      if (props.index === 12) {
                        return <circle key="purple-dot" cx={props.cx as number} cy={props.cy as number} r={4} fill="#8B5CF6" stroke="#FFF" strokeWidth={2} />;
                      }
                      return <g key={`purple-empty-${props.index}`} />;
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* MIDDLE: 4 KPI Cards */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-3">
            {/* Predicted Savings */}
            <div className="bg-[#F8FAFC]/70 rounded-2xl p-4 border border-slate-100/90 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-full bg-[#DCFCE7] flex items-center justify-center text-[#16A34A]">
                <TrendingUp className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div className="mt-3">
                <div className="text-[20px] font-bold text-[#0F172A] leading-tight">$1.2M</div>
                <div className="text-[11px] text-[#64748B] font-normal leading-snug mt-0.5">
                  Predicted Savings <br />
                  <span className="text-[#94A3B8]">(next 30 days)</span>
                </div>
                <div className="mt-2.5 text-[12px] font-bold text-[#16A34A] flex items-center gap-0.5">
                  <span>↑</span> <span>28%</span>
                </div>
              </div>
            </div>

            {/* Customer Satisfaction Risk */}
            <div className="bg-[#F8FAFC]/70 rounded-2xl p-4 border border-slate-100/90 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-full bg-[#FEE2E2] flex items-center justify-center text-[#EF4444]">
                <div className="rotate-45">
                  <div className="w-3.5 h-3.5 border-2 border-[#EF4444] rounded-xs flex items-center justify-center">
                    <div className="w-1 h-1 bg-[#EF4444] rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[20px] font-bold text-[#0F172A] leading-tight">3%</div>
                <div className="text-[11px] text-[#64748B] font-normal leading-snug mt-0.5">
                  Customer Satisfaction Risk
                </div>
                <div className="mt-2.5 text-[12px] font-bold text-[#EF4444] flex items-center gap-0.5">
                  <span>↓</span> <span>66%</span>
                </div>
              </div>
            </div>

            {/* On-Time Delivery */}
            <div className="bg-[#F8FAFC]/70 rounded-2xl p-4 border border-slate-100/90 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-full bg-[#DCFCE7] flex items-center justify-center text-[#16A34A]">
                <div className="w-4 h-4 rounded-full border-2 border-[#16A34A] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#16A34A] rounded-full"></div>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[20px] font-bold text-[#0F172A] leading-tight">96%</div>
                <div className="text-[11px] text-[#64748B] font-normal leading-snug mt-0.5">
                  On-Time Delivery
                </div>
                <div className="mt-2.5 text-[12px] font-bold text-[#16A34A] flex items-center gap-0.5">
                  <span>↑</span> <span>49%</span>
                </div>
              </div>
            </div>

            {/* Operational Efficiency */}
            <div className="bg-[#F8FAFC]/70 rounded-2xl p-4 border border-slate-100/90 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-full bg-[#DBEAFE] flex items-center justify-center text-[#2563EB]">
                <div className="w-3.5 h-3.5 border-2 border-[#2563EB] rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#2563EB] rounded-full"></div>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[20px] font-bold text-[#0F172A] leading-tight">92%</div>
                <div className="text-[11px] text-[#64748B] font-normal leading-snug mt-0.5">
                  Operational Efficiency
                </div>
                <div className="mt-2.5 text-[12px] font-bold text-[#16A34A] flex items-center gap-0.5">
                  <span>↑</span> <span>3%</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Projected Financial Impact */}
          <div className="lg:col-span-3 bg-[#F3F0FF] rounded-2xl p-5 border border-[#E9E3FF] flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[26px] font-extrabold text-[#4338CA] tracking-tight">$4.8M</div>
                  <div className="text-[12px] font-bold text-[#4338CA] mt-0.5">
                    Projected Financial Impact
                  </div>
                  <div className="text-[10px] text-[#6366F1] font-medium">(next 12 weeks)</div>
                </div>
                <div className="text-[#6366F1] opacity-80 pt-1">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 17l6-6 4 4 8-8" />
                    <path d="M14 7h7v7" />
                  </svg>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-[#4338CA]/70 shrink-0" />
                  <div className="text-[11px] text-[#3730A3]">
                    <span className="font-bold text-[#1E1B4B] mr-1">$2.1M</span>
                    <span>Avoided Downtime</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full border-2 border-[#4338CA]/70 flex items-center justify-center shrink-0">
                    <div className="w-1 h-1 bg-[#4338CA]"></div>
                  </div>
                  <div className="text-[11px] text-[#3730A3]">
                    <span className="font-bold text-[#1E1B4B] mr-1">$1.4M</span>
                    <span>Improved Throughput</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Coins className="w-4 h-4 text-[#4338CA]/70 shrink-0" />
                  <div className="text-[11px] text-[#3730A3]">
                    <span className="font-bold text-[#1E1B4B] mr-1">$0.8M</span>
                    <span>Inventory Optimisation</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Key className="w-4 h-4 text-[#4338CA]/70 shrink-0 rotate-45" />
                  <div className="text-[11px] text-[#3730A3]">
                    <span className="font-bold text-[#1E1B4B] mr-1">$0.5M</span>
                    <span>Energy Savings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
