'use client';

import { useState } from 'react';
import MaintenanceQueue, { MachineQueueItem, QUEUE_MACHINES } from './MaintenanceQueue';
import AssetDetailView from './AssetDetailView';
import { X, CheckCircle2, Calendar, User, Wrench, ShieldAlert } from 'lucide-react';

interface MaintenanceHubProps {
  onInspectAsset?: (assetId: string) => void;
}

export default function MaintenanceHub({ onInspectAsset }: MaintenanceHubProps = {}) {
  const [selectedMachine, setSelectedMachine] = useState<MachineQueueItem | null>(QUEUE_MACHINES[0] ?? null);
  const [isWorkOrderModalOpen, setIsWorkOrderModalOpen] = useState(false);
  const [workOrderSuccess, setWorkOrderSuccess] = useState(false);

  // Work order form state
  const [technician, setTechnician] = useState('Mike Reynolds (98% match)');
  const [scheduledTime, setScheduledTime] = useState('Today, 18:30 (Shift changeover)');
  const [priority, setPriority] = useState('Critical (P1)');

  const handleCreateWorkOrder = () => {
    setWorkOrderSuccess(true);
    setTimeout(() => {
      setWorkOrderSuccess(false);
      setIsWorkOrderModalOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      {/* Page Title & Subtitle */}
      <div className="pb-1">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Maintenance Intelligence Hub
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          AI-powered, condition-based maintenance to maximize uptime, reliability and business performance.
        </p>
      </div>

      {/* Main Grid Layout: Left Queue (3.5 cols) + Asset Detail View (8.5 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Left Column: Priority Queue */}
        <div className="xl:col-span-4 2xl:col-span-3">
          <MaintenanceQueue
            selectedMachineId={selectedMachine?.id ?? ''}
            onSelectMachine={(m) => setSelectedMachine(m)}
          />
        </div>

        {/* Main Column: Active Machine Detail View */}
        <div className="xl:col-span-8 2xl:col-span-9">
          {selectedMachine ? (
            <AssetDetailView
              machine={selectedMachine}
              onCreateWorkOrder={() => setIsWorkOrderModalOpen(true)}
              onScheduleMaintenance={() => setIsWorkOrderModalOpen(true)}
              onInspectAsset={onInspectAsset}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-8 flex items-center justify-center min-h-[400px]">
              <div className="text-center space-y-2">
                <Wrench className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-500">Select a machine from the queue</p>
                <p className="text-xs text-slate-400">Loading maintenance data...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Work Order Creation Modal */}
      {isWorkOrderModalOpen && selectedMachine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Create Predictive Work Order</h3>
                  <p className="text-[11px] text-slate-500">{selectedMachine.id} • {selectedMachine.plant}</p>
                </div>
              </div>
              <button
                onClick={() => setIsWorkOrderModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {workOrderSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Work Order WO-84920 Created!</h4>
                <p className="text-xs text-slate-600">
                  Technician Mike Reynolds dispatched. Spindle kit SKM-6208 reserved at tool crib.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5 text-xs">
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  <p className="text-rose-900 font-medium text-xs">
                    Target: Avert bearing seizure within 12 hours. Potential loss avoidance: $72K.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Recommended Action Plan</label>
                  <input
                    type="text"
                    readOnly
                    value="Replace spindle bearing & flush coolant system (#SKM-6208)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Assign Technician</label>
                    <select
                      value={technician}
                      onChange={(e) => setTechnician(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Mike Reynolds (98% match - Available now)</option>
                      <option>Sarah Kim (88% match - Available 2 hrs)</option>
                      <option>James Patel (72% match - Available today)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Scheduled Time</label>
                    <input
                      type="text"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Required Spare Parts (Automated Pull)</label>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1 text-slate-700">
                    <div className="flex justify-between">
                      <span>• Spindle Bearing SKM-6208</span>
                      <strong className="text-emerald-600">In Stock (Central WH)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>• Coolant Filter CF-100</span>
                      <strong className="text-emerald-600">In Stock (Tool Crib)</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setIsWorkOrderModalOpen(false)}
                    className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateWorkOrder}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer"
                  >
                    Confirm & Dispatch Work Order
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
