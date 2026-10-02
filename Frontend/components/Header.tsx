'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Search,
  LayoutGrid,
  Box,
  Activity,
  Wrench,
  Link2,
  DollarSign,
  Users2,
  Sparkles,
  BarChart3,
  Settings,
  X,
  Gauge,
  Eye,
  ChevronDown,
  Sliders,
  Users,
} from 'lucide-react';
import Image from 'next/image';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenSearch: () => void;
}

export const NAV_TABS = [
  { id: 'command-center', label: 'Command Center', icon: LayoutGrid },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench },
  { id: 'asset-360', label: 'Asset 360', icon: Gauge },
  { id: 'supply-chain', label: 'Supply Chain', icon: Link2 },
  { id: 'finance', label: 'Finance', icon: DollarSign },
  { id: 'executive', label: 'Executive', icon: Users2 },
  { id: 'vision-center', label: 'Vision Center', icon: Eye },
  { id: 'insights', label: 'Insights', icon: BarChart3 },
  { id: 'what-if-lab', label: 'What-If Lab', icon: Sliders },
];

export default function Header({ activeTab, onTabChange, onOpenSearch }: HeaderProps) {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeEl = scrollContainerRef.current.querySelector<HTMLElement>(`[data-tab-id="${activeTab}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeTab]);

  return (
    <header
      className="sticky top-0 z-40 w-full h-[60px] flex items-center justify-between px-5 lg:px-6"
      style={{
        background: 'rgba(255,255,255,0.94)',
        borderBottom: '1px solid #E7EFF6',
      }}
    >
      {/* Left: Logo + Nav Tabs */}
      <div className="flex items-center gap-4 flex-1 min-w-0 mr-3">
        {/* Logo */}
        <div
          onClick={() => onTabChange('command-center')}
          className="flex items-center gap-2.5 shrink-0 cursor-pointer group"
        >
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-violet-500 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <span className="text-white font-bold text-sm leading-none">N</span>
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.35px', color: '#172B4D' }}>
            Nexa<span style={{ color: '#1677E8' }}>Factory</span>
          </span>
        </div>

        {/* Navigation Tabs */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-0.5 overflow-x-auto no-scrollbar scroll-smooth"
        >
          {NAV_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                data-tab-id={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative px-3 py-[18px] shrink-0 cursor-pointer transition-colors"
                style={{
                  fontSize: 12,
                  lineHeight: 1,
                  color: isActive ? '#1677E8' : '#65788C',
                  background: isActive ? '#F0F7FF' : 'transparent',
                  fontWeight: 600,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = '#F5F8FC';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span className="whitespace-nowrap">{tab.label}</span>
                {isActive && (
                  <span
                    className="absolute bottom-0 left-3 right-3 h-[2px] rounded-sm"
                    style={{ background: '#2188F3' }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Search, Notifications, Factory Selector, Profile */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Search Box */}
        <button
          onClick={onOpenSearch}
          className="hidden xl:flex items-center justify-between gap-3 h-[35px] px-2.5 rounded-[9px] text-[12px] cursor-pointer transition-colors"
          style={{
            width: 196,
            background: '#FFFFFF',
            border: '1px solid #DFE8F0',
            boxShadow: '0 1px 3px rgba(40,70,100,.04)',
          }}
        >
          <div className="flex items-center gap-2" style={{ color: '#8495A7', fontSize: 12, fontWeight: 500 }}>
            <Search className="w-3.5 h-3.5" />
            <span>Search anything...</span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className="text-[10px] font-mono px-1 py-0.5 rounded text-[#8495A7]"
              style={{
                background: '#F5F7F9',
                border: '1px solid #E5EBF0',
                borderRadius: 4,
                fontSize: 10,
                lineHeight: '14px',
                minWidth: 18,
                textAlign: 'center' as const,
              }}
            >
              ⌘
            </span>
            <span
              className="text-[10px] font-mono px-1 py-0.5 rounded text-[#8495A7]"
              style={{
                background: '#F5F7F9',
                border: '1px solid #E5EBF0',
                borderRadius: 4,
                fontSize: 10,
                lineHeight: '14px',
                minWidth: 18,
                textAlign: 'center' as const,
              }}
            >
              K
            </span>
          </div>
        </button>

        {/* Mobile Search */}
        <button
          onClick={onOpenSearch}
          className="xl:hidden p-2 rounded-lg text-[#52677D] hover:bg-[#F4F8FC] cursor-pointer"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="relative p-2 rounded-lg hover:bg-[#F4F8FC] text-[#52677D] transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          {notificationOpen && (
            <div className="absolute right-0 top-11 z-50 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-[#172B4D]">System Alerts</span>
                <button
                  onClick={() => setNotificationOpen(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-2.5 rounded-lg bg-red-50/70 border border-red-100 flex gap-2.5">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-[#172B4D]">CNC-02 Spindle Overheat</p>
                  <p className="text-[11px] text-[#52677D] mt-0.5">
                    Riverside Plant temperature reached 112°C. Preventive shutdown recommended.
                  </p>
                  <span className="text-[10px] text-[#8495A7] font-mono mt-1 block">12 min ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Factory Selector */}
        <div
          className="hidden lg:flex items-center justify-between gap-2 h-[36px] px-3 rounded-[9px] cursor-pointer transition-colors hover:bg-[#F8FBFE]"
          style={{
            width: 125,
            fontSize: 12,
            fontWeight: 600,
            color: '#172B4D',
            background: '#FFFFFF',
            border: '1px solid #DFE8F0',
            boxShadow: '0 1px 4px rgba(35,70,100,.035)',
          }}
        >
          <span className="truncate">All Factories</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#8495A7] shrink-0" />
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 py-[5px] px-2 rounded-[9px] hover:bg-[#F4F8FC] transition-colors cursor-pointer">
          <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
            <Image
              src="https://picsum.photos/seed/alex-carter-director/150/150"
              alt="Alex Carter"
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="hidden lg:block text-left">
            <p style={{ fontSize: 12, fontWeight: 600, color: '#172B4D', lineHeight: 1.3 }}>Alex Carter</p>
            <p style={{ fontSize: 10, fontWeight: 500, color: '#8495A7', lineHeight: 1.3 }}>Operations Director</p>
          </div>
          <ChevronDown className="hidden lg:block w-3 h-3 text-[#8495A7]" />
        </div>
      </div>
    </header>
  );
}
