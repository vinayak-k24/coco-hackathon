'use client';

import { useState, useEffect } from 'react';
import Header, { NAV_TABS } from '@/components/Header';
import HeroBriefing from '@/components/HeroBriefing';
import KpiMetricsRow from '@/components/KpiMetricsRow';
import PlantHealthOverview, { FactoryPlant, FACTORIES } from '@/components/PlantHealthOverview';
import ProductionPerformanceChart from '@/components/ProductionPerformanceChart';
import MaintenanceReadinessCard from '@/components/MaintenanceReadinessCard';
import WorkforceReadinessCard from '@/components/WorkforceReadinessCard';
import SupplyChainRiskCard from '@/components/SupplyChainRiskCard';
import OrderImpactAnalysisCard from '@/components/OrderImpactAnalysisCard';
import BusinessImpactSection from '@/components/BusinessImpactSection';
import CriticalMachineAlerts, { MachineAlert, MACHINE_ALERTS } from '@/components/CriticalMachineAlerts';
import NexaCopilotFloatingAgent from '@/components/NexaCopilotFloatingAgent';
import LiveActivityStream from '@/components/LiveActivityStream';
import RecommendedActionsPanel from '@/components/RecommendedActionsPanel';
import EnergyTelemetryCard from '@/components/EnergyTelemetryCard';
import MaintenanceHub from '@/components/maintenance/MaintenanceHub';
import Asset360View from '@/components/asset/Asset360View';
import SupplyChainHub from '@/components/supply-chain/SupplyChainHub';
import FinanceHub from '@/components/finance/FinanceHub';
import ExecutiveBriefingHub from '@/components/executive/ExecutiveBriefingHub';
import InsightsLabHub from '@/components/insights/InsightsLabHub';
import VisionCenterHub from '@/components/vision/VisionCenterHub';
import WhatIfLabHub from '@/components/whatif/WhatIfLabHub';
import {
  RecommendedActionsModal,
  FactoryDetailModal,
  AlertDetailModal,
  ActionPlanModal,
  CommandSearchModal,
} from '@/components/Modals';
import {
  ArrowLeft,
} from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('command-center');
  const [isPlayingBrief, setIsPlayingBrief] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState('CNC-02');

  // Floating Copilot Agent state (opens on floating button click)
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  // Modals state
  const [isRecommendationsOpen, setIsRecommendationsOpen] = useState(false);
  const [isActionPlanOpen, setIsActionPlanOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedFactory, setSelectedFactory] = useState<FactoryPlant | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<MachineAlert | null>(null);

  const handleTabChange = (tab: string) => {
    if (tab === 'copilot') {
      setIsCopilotOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  // Keyboard shortcut for ⌘K search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Audio speech synthesis for "Listen to brief"
  const handleListenBrief = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isPlayingBrief) {
        window.speechSynthesis.cancel();
        setIsPlayingBrief(false);
      } else {
        window.speechSynthesis.cancel();
        const briefingText =
          'Good morning, Alex. Plant performance is above target driven by strong output in Assembly and Packaging. CNC-02 at Riverside is at risk of failure within 12 hours. Addressing the top 3 AI recommendations can prevent 8.4 hours of downtime and save an estimated $284,000.';
        const utterance = new SpeechSynthesisUtterance(briefingText);
        utterance.rate = 1.05;
        utterance.onend = () => setIsPlayingBrief(false);
        utterance.onerror = () => setIsPlayingBrief(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingBrief(true);
      }
    } else {
      setIsPlayingBrief(!isPlayingBrief);
    }
  };

  const handleCardClick = (cardId: string) => {
    if (cardId === 'open-alerts') {
      setSelectedAlert(MACHINE_ALERTS[0]);
    } else if (cardId === 'predicted-cost-avoidance') {
      setIsRecommendationsOpen(true);
    } else if (cardId === 'orders-at-risk') {
      setIsRecommendationsOpen(true);
    } else {
      setSelectedFactory(FACTORIES[0]);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Main Navigation Header */}
      <Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Body Content */}
      <main className="flex-1 w-full max-w-[1720px] mx-auto px-3 sm:px-5 lg:px-6 py-4 sm:py-5">
        {activeTab === 'command-center' ? (
          <>
            {/* Hero Greeting & AI Operational Briefing */}
            <HeroBriefing
              onViewDetails={() => setIsRecommendationsOpen(true)}
              onListenBrief={handleListenBrief}
              isPlayingBrief={isPlayingBrief}
            />

            {/* KPI Metrics Strip */}
            <KpiMetricsRow onCardClick={handleCardClick} />

            {/* Section 2: Plant Network (65%) + Recommended Actions (35%) — equal height */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-5 items-stretch mb-5" style={{ minHeight: 330 }}>
              <PlantHealthOverview onSelectFactory={(f) => setSelectedFactory(f)} />
              <RecommendedActionsPanel onViewAll={() => setIsRecommendationsOpen(true)} />
            </div>

            {/* Section 3: Row 1 — Production (48%) + Maintenance (24%) + Workforce (28%) */}
            <div className="grid gap-3.5 mb-3.5" style={{ gridTemplateColumns: 'minmax(0,1.9fr) minmax(0,0.9fr) minmax(0,1fr)', height: 260 }}>
              <div className="min-w-0 overflow-hidden"><ProductionPerformanceChart /></div>
              <div className="min-w-0 overflow-hidden"><MaintenanceReadinessCard onViewPlan={() => setActiveTab('maintenance')} /></div>
              <div className="min-w-0 overflow-hidden"><WorkforceReadinessCard onManageWorkforce={() => setIsActionPlanOpen(true)} /></div>
            </div>

            {/* Section 3: Row 2 — Supply Chain (58%) + Order Impact (42%) */}
            <div className="grid gap-3.5" style={{ gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', height: 278 }}>
              <div className="min-w-0 overflow-hidden"><SupplyChainRiskCard onViewAll={() => setActiveTab('supply-chain')} /></div>
              <div className="min-w-0 overflow-hidden"><OrderImpactAnalysisCard onSelectOrder={() => setIsRecommendationsOpen(true)} /></div>
            </div>

            {/* Section 4: Business Impact */}
            <BusinessImpactSection onViewDetails={() => setActiveTab('finance')} />
          </>
        ) : activeTab === 'maintenance' ? (
          /* Maintenance Intelligence Hub View */
          <MaintenanceHub
            onInspectAsset={(id) => {
              setSelectedAssetId(id);
              setActiveTab('asset-360');
            }}
          />
        ) : activeTab === 'asset-360' ? (
          /* Individual Machine / Asset 360 View */
          <Asset360View
            assetId={selectedAssetId}
            onBack={() => setActiveTab('maintenance')}
            onOpenCopilot={() => setIsCopilotOpen(true)}
            onCreateWorkOrder={() => setIsActionPlanOpen(true)}
          />
        ) : activeTab === 'supply-chain' ? (
          /* Supply Chain & Inventory Intelligence Center */
          <SupplyChainHub />
        ) : activeTab === 'finance' ? (
          /* Financial Impact & ROI Command Center */
          <FinanceHub />
        ) : activeTab === 'executive' ? (
          /* Executive Intelligence & Strategic Briefing Center */
          <ExecutiveBriefingHub
            onNavigateToAsset={(id) => {
              setSelectedAssetId(id);
              setActiveTab('asset-360');
            }}
            onNavigateToSupplyChain={() => setActiveTab('supply-chain')}
            onNavigateToFinance={() => setActiveTab('finance')}
          />
        ) : activeTab === 'vision-center' ? (
          /* AI Vision & Safety Intelligence Center */
          <VisionCenterHub
            onNavigateToAsset={(id) => {
              setSelectedAssetId(id);
              setActiveTab('asset-360');
            }}
            onNavigateToMaintenance={() => setActiveTab('maintenance')}
          />
        ) : activeTab === 'what-if-lab' ? (
          /* What-If Scenario Planning & Decision Lab */
          <WhatIfLabHub
            onNavigateToAsset={(id) => {
              setSelectedAssetId(id);
              setActiveTab('asset-360');
            }}
            onNavigateToMaintenance={() => setActiveTab('maintenance')}
            onNavigateToFinance={() => setActiveTab('finance')}
          />
        ) : activeTab === 'insights' ? (
          /* Insights, Analytics & Prediction Lab */
          <InsightsLabHub
            onNavigateToAsset={(id) => {
              setSelectedAssetId(id);
              setActiveTab('asset-360');
            }}
            onNavigateToMaintenance={() => setActiveTab('maintenance')}
          />
        ) : (
          /* View for Other Tabs with rich operational context */
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('command-center')}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Command Center</span>
                </button>
                <div className="h-6 w-px bg-slate-200" />
                <h2 className="text-xl font-bold text-slate-900 capitalize">
                  {activeTab.replace('-', ' ')} Subsystem
                </h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                Telemetry Synchronized
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80">
                <h3 className="font-bold text-slate-900 text-sm mb-1">Subsystem Stream</h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Real-time synchronization active across all 4 plants (Riverside, Pune, Munich, Austin).
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-200">
                    <span className="text-slate-500">SCADA Bridge</span>
                    <span className="font-semibold text-emerald-600">Connected (4ms latency)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200">
                    <span className="text-slate-500">Predictive Model</span>
                    <span className="font-semibold text-blue-600">Active (Gemini 2.5)</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">Autonomous Gateways</span>
                    <span className="font-semibold text-slate-900">42 / 42 Online</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80">
                <h3 className="font-bold text-slate-900 text-sm mb-1">Key Actions</h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Execute direct operational commands or export telemetry reports.
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => setIsRecommendationsOpen(true)}
                    className="w-full py-2 px-3 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-2xs"
                  >
                    View AI Recommendations
                  </button>
                  <button
                    onClick={() => setIsActionPlanOpen(true)}
                    className="w-full py-2 px-3 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
                  >
                    Open Capacity Action Plan
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80">
                <h3 className="font-bold text-slate-900 text-sm mb-1">Operations Summary</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Return to the main Command Center for the comprehensive dual-axis production charts,
                  machine alert telemetry, and interactive copilot.
                </p>
                <button
                  onClick={() => setActiveTab('command-center')}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Return to Main View
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Interactive Modals and Drawers */}
      <RecommendedActionsModal
        isOpen={isRecommendationsOpen}
        onClose={() => setIsRecommendationsOpen(false)}
      />

      <FactoryDetailModal
        factory={selectedFactory}
        onClose={() => setSelectedFactory(null)}
      />

      <AlertDetailModal
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
      />

      <ActionPlanModal
        isOpen={isActionPlanOpen}
        onClose={() => setIsActionPlanOpen(false)}
      />

      <CommandSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectFactory={(f) => {
          setSelectedFactory(f);
          setIsSearchOpen(false);
        }}
      />

      {/* Constant Floating Nexa Copilot Button & Floating Window across all pages */}
      <NexaCopilotFloatingAgent
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        onOpen={() => setIsCopilotOpen(true)}
        onShowRecommendations={() => {
          setIsCopilotOpen(false);
          setIsRecommendationsOpen(true);
        }}
        onCreateActionPlan={() => {
          setIsCopilotOpen(false);
          setIsActionPlanOpen(true);
        }}
      />
    </div>
  );
}
