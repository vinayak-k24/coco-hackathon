'use client';

import { useState, useEffect } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  Users,
  FileText,
  Factory,
  Cpu,
  Shield,
} from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface HeroBriefingData {
  greeting: string;
  user_name: string;
  date: string;
  summary: string;
  oee_avg: string;
  cost_avoidance: string;
  total_factories: number;
  connected_assets: number;
  workforce_online: number;
  workforce_pct: string;
  platform_health: string;
  plant_badges: { name: string; health_pct: number }[];
  ai_briefing_text: string;
}

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
  const [data, setData] = useState<HeroBriefingData | null>(null);

  useEffect(() => {
    fetchApi<HeroBriefingData>('/api/hero-briefing').then(setData).catch(() => {});
  }, []);

  const d = data;
  const factories = d?.total_factories ?? 4;
  const assets = d?.connected_assets ?? 1248;
  const workforce = d?.workforce_online ?? 892;
  const workforcePct = d?.workforce_pct ?? '96%';
  const platformHealth = d?.platform_health ?? '98%';
  const oee = d?.oee_avg ?? '94.2%';
  const costAvoidance = d?.cost_avoidance ?? '$284K';
  const healthNum = parseInt(platformHealth) || 98;

  return (
    <section className="relative w-full mb-6 overflow-hidden" style={{ height: 382 }}>
      {/* Layer 1: Background factory image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/factory-bg.png')" }}
      />

      {/* Layer 2: White atmospheric gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            90deg,
            rgba(250,253,255,0.98) 0%,
            rgba(250,253,255,0.94) 20%,
            rgba(250,253,255,0.72) 34%,
            rgba(250,253,255,0.15) 53%,
            rgba(250,253,255,0) 70%
          )`,
        }}
      />

      {/* Layer 3: Content — flex with left text + right card group pushed right */}
      <div className="relative z-10 h-full flex items-start px-6 lg:px-8 pt-8">
        {/* Left: Hero text — no container box, occupies ~45% */}
        <div className="flex flex-col justify-center h-full" style={{ maxWidth: 470, minWidth: 0, flex: '0 1 45%' }}>
          {/* Greeting row */}
          <div className="flex items-center gap-2.5 mb-4">
            <span style={{ fontSize: 14 }}>☀️</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#40566D' }}>
              {d?.greeting ?? 'Good Morning'}, {d?.user_name ?? 'Alex'}
            </span>
            <span style={{ color: '#7157E8', fontSize: 12 }}>✦</span>
            <span className="w-px" style={{ height: 13, background: '#CBD7E2' }} />
            <span style={{ fontSize: 11, fontWeight: 500, color: '#8191A2' }}>
              {d?.date ?? 'Tue, 12 Nov 2024'}
            </span>
          </div>

          {/* Main headline */}
          <h1 style={{
            fontSize: 40,
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-1.3px',
            color: '#102A4C',
            margin: 0,
            marginBottom: 12,
          }}>
            Your factories are
            <br />
            <span style={{ color: '#1677E8' }}>performing well.</span>
          </h1>

          {/* Hero description */}
          <p style={{
            fontSize: 13,
            fontWeight: 500,
            lineHeight: 1.6,
            color: '#52677D',
            maxWidth: 470,
            margin: 0,
          }}>
            Production is on track across all sites, with strong output and improving
            efficiency. Maintenance risks are controlled, inventory levels are healthy,
            and the workforce is fully staffed.
          </p>
        </div>

        {/* Right: Dashboard card group — pushed to right via margin-left:auto */}
        <div
          className="hidden xl:grid shrink-0 self-start mt-2"
          style={{
            marginLeft: 'auto',
            width: 'min(740px, 43vw)',
            gridTemplateColumns: 'minmax(0, 1.35fr) minmax(240px, 1fr)',
            gap: 16,
            paddingRight: 4,
          }}
        >
          {/* AI Operational Briefing Card */}
          <div
            className="flex flex-col"
            style={{
              background: 'rgba(255,255,255,0.94)',
              border: '1px solid rgba(218,231,242,.9)',
              borderRadius: 15,
              boxShadow: '0 10px 30px rgba(40,80,115,.11)',
              backdropFilter: 'blur(18px)',
              padding: '18px 18px 16px',
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <Sparkles style={{ width: 15, height: 15, color: '#7157E8' }} />
              <span style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.2px', color: '#172B4D' }}>
                AI Operational Briefing
              </span>
            </div>
            <span style={{ fontSize: 10, fontWeight: 500, color: '#8495A7', display: 'block', marginBottom: 16 }}>
              Generated 5 minutes ago
            </span>

            {/* Body text */}
            <p style={{ fontSize: 12, fontWeight: 400, lineHeight: 1.55, color: '#52677D', margin: 0 }}>
              All factories are operating above plan with{' '}
              <span style={{ fontWeight: 600, color: '#172B4D' }}>{oee} average OEE</span>. Two supply chain risks
              require attention, but no customer commitments are at risk. Expected{' '}
              <span style={{ fontWeight: 600, color: '#18B276' }}>{costAvoidance}</span>{' '}
              cost avoidance from active AI recommendations this month.
            </p>

            {/* Audio player box */}
            <button
              onClick={onListenBrief}
              className="w-full flex items-center gap-2.5 h-[38px] px-3 cursor-pointer transition-colors"
              style={{
                background: isPlayingBrief ? '#1677E8' : '#F5F9FC',
                border: isPlayingBrief ? '1px solid #1677E8' : '1px solid #E1EAF1',
                borderRadius: 9,
                marginTop: 16,
                marginBottom: 13,
              }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                style={{ background: isPlayingBrief ? 'rgba(255,255,255,0.2)' : '#E8F3FC' }}
              >
                {isPlayingBrief ? (
                  <Pause style={{ width: 12, height: 12, color: '#fff' }} />
                ) : (
                  <Play style={{ width: 12, height: 12, color: '#1677E8' }} />
                )}
              </div>
              <span
                className="flex-1 text-left"
                style={{ fontSize: 11, fontWeight: 600, color: isPlayingBrief ? '#fff' : '#52677D' }}
              >
                {isPlayingBrief ? 'Playing briefing...' : 'Listen to briefing'}
              </span>
              {isPlayingBrief ? (
                <span className="flex items-center gap-0.5">
                  <span className="w-[3px] h-3 bg-white/80 rounded-full animate-bounce" />
                  <span className="w-[3px] h-4 bg-white/80 rounded-full animate-bounce [animation-delay:0.15s]" />
                  <span className="w-[3px] h-2 bg-white/80 rounded-full animate-bounce [animation-delay:0.3s]" />
                </span>
              ) : (
                <span style={{ fontSize: 10, fontWeight: 500, color: '#8495A7', fontFamily: 'monospace' }}>02:14</span>
              )}
            </button>

            {/* Action buttons */}
            <div className="flex gap-2.5">
              <button
                onClick={onViewDetails}
                className="flex-1 h-[38px] rounded-[9px] cursor-pointer transition-colors hover:bg-[#F8FBFE]"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #DCE7F0',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#334B63',
                }}
              >
                View Details
              </button>
              <button
                className="flex-1 h-[38px] rounded-[9px] cursor-pointer transition-colors hover:opacity-90 flex items-center justify-center gap-1.5"
                style={{
                  background: '#1677E8',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#FFFFFF',
                }}
              >
                <FileText style={{ width: 12, height: 12 }} />
                Generate Report
              </button>
            </div>
          </div>

          {/* Operational Status Card */}
          <div
            className="flex flex-col"
            style={{
              background: 'rgba(255,255,255,0.94)',
              border: '1px solid rgba(218,231,242,.9)',
              borderRadius: 15,
              boxShadow: '0 10px 30px rgba(40,80,115,.11)',
              backdropFilter: 'blur(18px)',
              padding: 18,
            }}
          >
            {/* Header — no plus button */}
            <div style={{ marginBottom: 10 }}>
              <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.2px', color: '#172B4D' }}>
                Operational Status
              </span>
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-1.5" style={{ marginBottom: 14 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#17B978', display: 'inline-block' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#18B276' }}>
                All Systems Nominal
              </span>
            </div>

            {/* Divider */}
            <div style={{ width: '100%', height: 1, background: '#E8EEF4', marginBottom: 14 }} />

            {/* Metric rows */}
            <div className="flex flex-col gap-3">
              {/* Total Factories */}
              <div className="grid items-center gap-2.5" style={{ gridTemplateColumns: '34px 1fr auto' }}>
                <div className="flex items-center justify-center" style={{ width: 34, height: 34, background: '#F2F7FB', borderRadius: 9 }}>
                  <Factory style={{ width: 16, height: 16, color: '#6B8299' }} />
                </div>
                <div className="flex flex-col">
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#203852' }}>{factories}</span>
                  <span style={{ fontSize: 11, fontWeight: 500, color: '#8495A7' }}>Total Factories</span>
                </div>
              </div>

              {/* Connected Assets */}
              <div className="grid items-center gap-2.5" style={{ gridTemplateColumns: '34px 1fr auto' }}>
                <div className="flex items-center justify-center" style={{ width: 34, height: 34, background: '#F2F7FB', borderRadius: 9 }}>
                  <Cpu style={{ width: 16, height: 16, color: '#6B8299' }} />
                </div>
                <div className="flex flex-col">
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#203852' }}>{assets.toLocaleString()}</span>
                  <span style={{ fontSize: 11, fontWeight: 500, color: '#8495A7' }}>Connected Assets</span>
                </div>
              </div>

              {/* Workforce Online */}
              <div className="grid items-center gap-2.5" style={{ gridTemplateColumns: '34px 1fr auto' }}>
                <div className="flex items-center justify-center" style={{ width: 34, height: 34, background: '#F2F7FB', borderRadius: 9 }}>
                  <Users style={{ width: 16, height: 16, color: '#6B8299' }} />
                </div>
                <div className="flex flex-col">
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#203852' }}>{workforce}</span>
                  <span style={{ fontSize: 11, fontWeight: 500, color: '#8495A7' }}>Workforce Online</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#18B276' }}>{workforcePct}</span>
              </div>

              {/* Platform Health */}
              <div className="grid items-center gap-2.5" style={{ gridTemplateColumns: '34px 1fr auto' }}>
                <div className="flex items-center justify-center" style={{ width: 34, height: 34, background: '#EAF8F1', borderRadius: 9 }}>
                  <Shield style={{ width: 16, height: 16, color: '#18A970' }} />
                </div>
                <div className="flex flex-col gap-1">
                  <span style={{ fontSize: 11, fontWeight: 500, color: '#8495A7' }}>Platform Health</span>
                  <div style={{ width: '100%', height: 5, borderRadius: 999, background: '#E5F0EA' }}>
                    <div style={{ width: `${healthNum}%`, height: '100%', borderRadius: 999, background: '#18B276' }} />
                  </div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#18B276' }}>{platformHealth}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Cards stacked below (visible below xl) */}
      <div className="xl:hidden px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10" style={{ marginTop: -20 }}>
        {/* Simplified mobile versions would go here — keeping hidden for now as hero is 382px fixed */}
      </div>
    </section>
  );
}
