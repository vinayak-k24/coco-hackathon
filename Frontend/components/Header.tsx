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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Layers,
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
  { id: 'factory-twin', label: 'Factory Twin', icon: Box },
  { id: 'operations', label: 'Operations', icon: Activity },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench },
  { id: 'asset-360', label: 'Asset 360', icon: Gauge },
  { id: 'supply-chain', label: 'Supply Chain', icon: Link2 },
  { id: 'finance', label: 'Finance', icon: DollarSign },
  { id: 'executive', label: 'Executive', icon: Users2 },
  { id: 'copilot', label: 'Copilot', icon: Sparkles },
  { id: 'vision-center', label: 'Vision Center', icon: Eye },
  { id: 'insights', label: 'Insights', icon: BarChart3 },
  { id: 'admin', label: 'Admin', icon: Settings },
  { id: 'workforce', label: 'Workforce', icon: Users },
  { id: 'what-if-lab', label: 'What-If Lab', icon: Sliders },
];

export default function Header({ activeTab, onTabChange, onOpenSearch }: HeaderProps) {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [subsystemMenuOpen, setSubsystemMenuOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the active tab into view when activeTab changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeEl = scrollContainerRef.current.querySelector<HTMLElement>(`[data-tab-id="${activeTab}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeTab]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const amount = direction === 'left' ? -220 : 220;
      scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-4 lg:px-6 h-14 flex items-center justify-between shadow-xs">
      {/* Brand & Main Nav */}
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0 mr-2">
        {/* Logo */}
        <div
          onClick={() => onTabChange('command-center')}
          className="flex items-center gap-2 shrink-0 cursor-pointer group"
        >
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-1.5 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center">
            Nexa<span className="text-blue-600">Factory</span>
          </span>
        </div>

        {/* Scroll Left Button */}
        <button
          onClick={() => handleScroll('left')}
          className="hidden md:flex w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 items-center justify-center shrink-0 cursor-pointer transition-colors shadow-2xs"
          title="Scroll tabs left"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Navigation Tabs with scroll container */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth py-1"
        >
          {NAV_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                data-tab-id={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs font-bold ring-1 ring-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scroll Right Button */}
        <button
          onClick={() => handleScroll('right')}
          className="hidden md:flex w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 items-center justify-center shrink-0 cursor-pointer transition-colors shadow-2xs"
          title="Scroll tabs right"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right Tools: Quick Switcher, Search, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick Subsystems Dropdown Switcher - Guaranteed 1-click navigation anywhere */}
        <div className="relative">
          <button
            onClick={() => setSubsystemMenuOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-bold text-blue-700 shadow-2xs transition-colors cursor-pointer"
            title="Navigate to any subsystem"
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Subsystems</span>
            <ChevronDown className="w-3 h-3 text-blue-500" />
          </button>

          {subsystemMenuOpen && (
            <div className="absolute right-0 top-11 z-50 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 space-y-1 animate-in fade-in">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 block">
                Jump to Subsystem
              </span>
              <div className="max-h-80 overflow-y-auto space-y-0.5">
                {NAV_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        onTabChange(tab.id);
                        setSubsystemMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white font-bold'
                          : 'text-slate-700 hover:bg-slate-100 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                        <span>{tab.label}</span>
                      </div>
                      {isActive && <span className="text-[10px] text-blue-100 font-semibold">Active</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Search button with ⌘K badge */}
        <button
          onClick={onOpenSearch}
          className="hidden xl:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-100/80 hover:bg-slate-100 border border-slate-200/80 text-xs text-slate-500 transition-colors cursor-pointer w-44 justify-between shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">Search anything...</span>
          </div>
          <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-500 shadow-2xs">
            ⌘K
          </span>
        </button>

        {/* Mobile Search Button */}
        <button
          onClick={onOpenSearch}
          className="xl:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
          title="Search"
        >
          <Search className="w-4 h-4 text-slate-500" />
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4 text-slate-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          {/* Notification Flyout */}
          {notificationOpen && (
            <div className="absolute right-0 top-11 z-50 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-4 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900">System Alerts</span>
                <button
                  onClick={() => setNotificationOpen(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-2.5">
                <div className="p-2.5 rounded-lg bg-red-50/70 border border-red-100 flex gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-900">CNC-02 Spindle Overheat</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Riverside Plant temperature reached 112°C. Preventive shutdown recommended.
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">12 min ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
          <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-slate-200 shrink-0">
            <Image
              src="https://picsum.photos/seed/alex-carter-director/150/150"
              alt="Alex Carter"
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-tight">Alex Carter</p>
            <p className="text-[10px] text-slate-500 leading-tight">CEO</p>
          </div>
        </div>
      </div>
    </header>
  );
}
