'use client';

import { useState, useEffect } from 'react';
import { Radio, CheckCircle2, AlertTriangle, PackageCheck, Wrench, Clock, Filter } from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface EventItem {
  id: string;
  time: string;
  plant: string;
  title: string;
  description: string;
  type: 'success' | 'warning' | 'info' | 'maintenance';
}

export default function LiveActivityStream() {
  const [filter, setFilter] = useState<'all' | 'alerts' | 'maintenance'>('all');
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    const load = () => fetchApi<EventItem[]>('/api/activity-stream?limit=10', []).then(setEvents);
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredEvents = events.filter((e) => {
    if (filter === 'alerts') return e.type === 'warning';
    if (filter === 'maintenance') return e.type === 'maintenance' || e.type === 'warning';
    return true;
  });

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">Live SCADA Event Stream</h2>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-semibold bg-slate-100 p-0.5 rounded-lg">
          <button onClick={() => setFilter('all')} className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${filter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'}`}>All</button>
          <button onClick={() => setFilter('alerts')} className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${filter === 'alerts' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'}`}>Alerts</button>
          <button onClick={() => setFilter('maintenance')} className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${filter === 'maintenance' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'}`}>Maintenance</button>
        </div>
      </div>
      <div className="space-y-2.5">
        {filteredEvents.map((evt) => {
          let badgeColor = 'bg-blue-50 text-blue-600 border-blue-100';
          let Icon = PackageCheck;
          if (evt.type === 'success') { badgeColor = 'bg-emerald-50 text-emerald-600 border-emerald-100'; Icon = CheckCircle2; }
          else if (evt.type === 'warning') { badgeColor = 'bg-amber-50 text-amber-600 border-amber-100'; Icon = AlertTriangle; }
          else if (evt.type === 'maintenance') { badgeColor = 'bg-indigo-50 text-indigo-600 border-indigo-100'; Icon = Wrench; }
          return (
            <div key={evt.id} className="p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start gap-2.5">
              <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${badgeColor}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-slate-900 truncate">{evt.title}</span>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">{evt.time}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-tight mt-0.5">{evt.description}</p>
                <span className="text-[10px] font-medium text-slate-400 mt-1 inline-block">{evt.plant} Facility</span>
              </div>
            </div>
          );
        })}
        {events.length === 0 && <p className="text-xs text-slate-400 text-center py-4">Loading events...</p>}
      </div>
    </div>
  );
}
