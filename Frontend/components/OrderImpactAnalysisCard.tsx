'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Package, AlertTriangle } from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface OrderImpactAnalysisCardProps {
  onSelectOrder?: (orderId: string) => void;
}

interface OrderRow {
  customer: string;
  customerLogo: string;
  orderId: string;
  product: string;
  commitment: string;
  status: 'At Risk' | 'On Track' | 'Watch';
  revenueExposure: string;
}

const statusConfig = {
  'At Risk': {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200/60',
    dot: 'bg-rose-500',
  },
  'On Track': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200/60',
    dot: 'bg-emerald-500',
  },
  Watch: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200/60',
    dot: 'bg-amber-500',
  },
};

export default function OrderImpactAnalysisCard({ onSelectOrder }: OrderImpactAnalysisCardProps) {
  const [filter, setFilter] = useState('All Orders');
  const [orders, setOrders] = useState<OrderRow[]>([]);

  useEffect(() => {
    const load = () => fetchApi<OrderRow[]>('/api/orders', []).then(setOrders);
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredOrders =
    filter === 'All Orders'
      ? orders
      : filter === 'At Risk'
      ? orders.filter((o) => o.status === 'At Risk')
      : filter === 'Watch'
      ? orders.filter((o) => o.status === 'Watch' || o.status === 'At Risk')
      : orders;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <Package className="w-4 h-4 text-indigo-600" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">Order Impact</h2>
        </div>
        <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
          View All →
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100">
              <th className="text-left pb-2 pl-1 font-semibold">Customer / Order</th>
              <th className="text-left pb-2 font-semibold">Product</th>
              <th className="text-left pb-2 font-semibold">Commitment</th>
              <th className="text-left pb-2 font-semibold">Status</th>
              <th className="text-right pb-2 pr-1 font-semibold">Revenue Exposure</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => {
              const config = statusConfig[order.status];
              return (
                <tr
                  key={order.orderId}
                  onClick={() => onSelectOrder?.(order.orderId)}
                  className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="py-2.5 pl-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{order.customerLogo}</span>
                      <div>
                        <span className="font-bold text-slate-900 block">{order.customer}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{order.orderId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 text-slate-700">{order.product}</td>
                  <td className="py-2.5 text-slate-500">{order.commitment}</td>
                  <td className="py-2.5">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${config.bg} ${config.text} ${config.border}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2.5 pr-1 text-right font-bold text-slate-900">{order.revenueExposure}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
