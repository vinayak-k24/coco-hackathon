'use client';

import { useState } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  ChevronRight,
  CheckCircle2,
  Users,
  Volume2,
  FileText,
  Factory,
  Cpu,
  Wifi,
  Shield,
  TrendingUp,
} from 'lucide-react';
import Image from 'next/image';

interface HeroBriefingProps {
  onViewDetails: () => void;
  onListenBrief: () => void;
  isPlayingBrief?: boolean;
}

export default function HeroBriefing({
  onViewDetails,
  onListenBrief,
  isPlayingBrief = false,
}: HeroBriefingProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch mb-6">
      {/* Left Column: Greeting & Summary Statement */}
      <div className="xl:col-span-4 flex flex-col justify-center">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1.5">
          <span className="text-amber-500 text-sm">☀️</span> Good Morning, Alex ×
          <span className="text-slate-400 ml-1">
            Tue, 12 Nov 2024
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Your factories are{' '}
          <span className="text-blue-600 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
            performing well.
          </span>
        </h1>

        <p className="mt-2 text-xs sm:text-[13px] text-slate-600 leading-relaxed max-w-xl">
          Production is on track across all sites, with strong output and improving
          efficiency. Maintenance risks are controlled, inventory levels are healthy,
          and the workforce is fully staffed. A few supply chain constraints require
          attention, but customer commitments remain secure and financial
          exposure is low.
        </p>
      </div>

      {/* Middle Column: AI Operational Briefing */}
      <div className="xl:col-span-5 relative rounded-2xl bg-gradient-to-br from-blue-50/80 via-white to-sky-50/60 border border-blue-100/90 p-4 sm:p-5 shadow-xs overflow-hidden flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Soft background ambient light */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-sky-200/30 to-blue-200/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        {/* Text and Actions */}
        <div className="relative z-10 flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-900">AI Operational Briefing</span>
            <span className="text-[10px] font-medium text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full border border-blue-200/50">
              Generated 5 minutes ago
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            All factories are operating above plan with{' '}
            <span className="font-semibold text-slate-900">92% average OEE</span>. Two supply chain risks
            require attention, but no customer
            commitments are at risk. Expected{' '}
            <span className="font-semibold text-emerald-700">$1.2M</span>{' '}
            cost avoidance from active AI
            recommendations this month.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={onListenBrief}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 flex items-center gap-2 cursor-pointer shadow-2xs ${
                isPlayingBrief
                  ? 'bg-blue-600 text-white border-blue-600 shadow-blue-500/20'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              {isPlayingBrief ? (
                <>
                  <Pause className="w-3 h-3 fill-current" />
                  <span>Pause brief</span>
                  <span className="inline-flex items-center gap-0.5">
                    <span className="w-1 h-3 bg-white rounded-full animate-bounce" />
                    <span className="w-1 h-4 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1 h-2 bg-white rounded-full animate-bounce [animation-delay:0.4s]" />
                  </span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span>Listen to briefing</span>
                  <span className="text-[10px] text-slate-400 font-mono">02:14</span>
                </>
              )}
            </button>
            <button
              onClick={onViewDetails}
              className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-200 shadow-2xs transition-all duration-150 cursor-pointer hover:border-slate-300"
            >
              View Details
            </button>
            <button
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold border border-blue-600 shadow-2xs transition-all duration-150 cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-3 h-3" />
              Generate Report
            </button>
          </div>
        </div>

        {/* Smart Factory Image */}
        <div className="relative z-10 shrink-0 w-full sm:w-48 h-32 sm:h-full min-h-[130px] rounded-xl overflow-hidden bg-gradient-to-t from-slate-900/10 to-transparent flex flex-col justify-end p-2.5 border border-sky-200/50 shadow-2xs group">
          <Image
            src="https://picsum.photos/seed/smart-factory-twin/600/400"
            alt="Smart Factory"
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent" />

          {/* Floating location badges */}
          <div className="relative z-10 space-y-1">
            <div className="bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] font-semibold text-slate-800 shadow-sm border border-white/60 flex items-center gap-1">
              <span className="text-emerald-500">Berlin</span>
              <span className="font-bold text-emerald-600">99%</span>
            </div>
            <div className="bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] font-semibold text-slate-800 shadow-sm border border-white/60 flex items-center gap-1">
              <span className="text-blue-500">Monterrey</span>
              <span className="font-bold text-blue-600">88%</span>
            </div>
            <div className="bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] font-semibold text-slate-800 shadow-sm border border-white/60 flex items-center gap-1">
              <span className="text-teal-500">Singapore</span>
              <span className="font-bold text-teal-600">96%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Operational Status Sidebar */}
      <div className="xl:col-span-3 rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-1">Operational Status</h3>
          <div className="flex items-center gap-1.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-600">All Systems Nominal</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Factory className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-600">Total Factories</span>
            </div>
            <span className="text-sm font-bold text-slate-900">4</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-600">Connected Assets</span>
            </div>
            <span className="text-sm font-bold text-slate-900">1,248</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-600">Workforce Online</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">892</span>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">96%</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-600">Platform Health</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">98%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
