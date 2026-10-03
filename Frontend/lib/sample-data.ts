// SAMPLE DATA for Command Center Section 3.
// TEMPORARY: Replace with real API/DB data when backend is ready.

// ─── Production Performance ───────────────────────────────────────

export interface ProductionDay {
  date: string;
  actual: number;
  planned: number;
  forecast: number | null;
}

export interface ProductionEvent {
  dateIndex: number;
  type: 'maintenance' | 'demand' | 'forecast';
  title: string;
  value?: string;
}

function genProduction(): ProductionDay[] {
  const days: ProductionDay[] = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(2024, 10, 1 + i);
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const isFuture = i >= 24;
    const base = 65000 + Math.round(Math.sin(i * 0.4) * 12000) + Math.round(Math.random() * 8000);
    const planned = 70000 + Math.round(Math.sin(i * 0.3) * 8000);
    days.push({
      date: ds,
      actual: isFuture ? 0 : Math.max(45000, base),
      planned,
      forecast: i >= 22 ? planned + Math.round(Math.random() * 6000 + 2000) : null,
    });
  }
  return days;
}

export const SAMPLE_PRODUCTION: ProductionDay[] = genProduction();
export const SAMPLE_PRODUCTION_EVENTS: ProductionEvent[] = [
  { dateIndex: 6, type: 'maintenance', title: 'Maintenance\nShutdown' },
  { dateIndex: 16, type: 'demand', title: 'Demand Spike', value: '+22%' },
  { dateIndex: 26, type: 'forecast', title: 'AI Forecast', value: '+6%' },
];

// ─── Maintenance Readiness ────────────────────────────────────────

export interface MaintenanceSegment { label: string; pct: number; count: number; color: string }
export interface MaintenanceMini { icon: string; label: string; value: string; sub: string; subColor?: string }

export const SAMPLE_MAINTENANCE_SEGMENTS: MaintenanceSegment[] = [
  { label: 'Healthy', pct: 72, count: 892, color: '#18B276' },
  { label: 'Warning', pct: 18, count: 221, color: '#F2A51A' },
  { label: 'Scheduled', pct: 7, count: 87, color: '#E89B08' },
  { label: 'Critical', pct: 3, count: 48, color: '#FF4D5A' },
];

export const SAMPLE_MAINTENANCE_MINIS: MaintenanceMini[] = [
  { icon: 'users', label: 'Technicians', value: '48', sub: '92% capacity' },
  { icon: 'clipboard', label: 'Work Orders', value: '72', sub: '↓ 29%', subColor: '#18B276' },
  { icon: 'target', label: 'Readiness Score', value: '94%', sub: '↑ 3%', subColor: '#18B276' },
  { icon: 'package', label: 'Spare Parts', value: '87%', sub: 'Coverage' },
];

// ─── Workforce Readiness ──────────────────────────────────────────

export interface WorkforceSegment { label: string; pct: number; count: number; color: string }
export interface WorkforceBlock { title: string; value: string; valueColor?: string; hasAvatars?: boolean; avatarExtra?: string; hasProgress?: boolean; progressPct?: number }

export const SAMPLE_WORKFORCE_SEGMENTS: WorkforceSegment[] = [
  { label: 'Available', pct: 62, count: 552, color: '#18B276' },
  { label: 'On Assignment', pct: 24, count: 214, color: '#1677E8' },
  { label: 'Training', pct: 8, count: 71, color: '#7657E8' },
  { label: 'Unavailable', pct: 6, count: 55, color: '#FF4D5A' },
];

export const SAMPLE_WORKFORCE_BLOCKS: WorkforceBlock[] = [
  { title: 'Upcoming Shift Risks', value: '2 potential gaps', valueColor: '#FF4D5A', hasAvatars: true, avatarExtra: '+3' },
  { title: 'Certification Gaps', value: '4 expiring soon', valueColor: '#F2A51A', hasAvatars: true, avatarExtra: '+1' },
  { title: 'Overtime Trend', value: '↓ 18% this month', valueColor: '#18B276' },
  { title: 'Utilization Rate', value: '91%', hasProgress: true, progressPct: 91 },
];

// ─── Supply Chain Risk ────────────────────────────────────────────

export interface SupplierRisk {
  id: string; product: string; supplier: string;
  healthPct: number; healthHistory: number[];
  leadTime: string; leadTimeTrend?: string;
  affectedMachines: number; businessExposure: string;
  risk: 'Low' | 'Medium' | 'High';
}

export const SAMPLE_SUPPLIERS: SupplierRisk[] = [
  { id: 'S1', product: 'Servo Motor Controller', supplier: 'Siemens', healthPct: 92, healthHistory: [88, 90, 91, 89, 92, 93, 92], leadTime: '6 weeks', leadTimeTrend: '↑ 2 weeks', affectedMachines: 12, businessExposure: '$420K', risk: 'Medium' },
  { id: 'S2', product: 'Hydraulic Pump', supplier: 'Bosch Rexroth', healthPct: 76, healthHistory: [82, 79, 76, 74, 72, 70, 71], leadTime: '10 weeks', leadTimeTrend: '↑ 4 weeks', affectedMachines: 8, businessExposure: '$680K', risk: 'High' },
  { id: 'S3', product: 'PLC Module', supplier: 'Rockwell Automation', healthPct: 89, healthHistory: [85, 87, 88, 89, 88, 89, 89], leadTime: '4 weeks', affectedMachines: 6, businessExposure: '$220K', risk: 'Low' },
  { id: 'S4', product: 'Ball Bearing 6208', supplier: 'SKF', healthPct: 68, healthHistory: [78, 75, 73, 71, 70, 69, 68], leadTime: '10 weeks', leadTimeTrend: '↑ 6 weeks', affectedMachines: 14, businessExposure: '$1.1M', risk: 'High' },
];

// ─── Order Impact ─────────────────────────────────────────────────

export interface OrderImpactRow {
  customer: string; logo: string; orderId: string; product: string;
  commitment: string; status: 'At Risk' | 'Watch' | 'On Track'; revenueExposure: string;
}

export const SAMPLE_ORDERS: OrderImpactRow[] = [
  { customer: 'BMW', logo: 'B', orderId: 'PO-44821', product: 'Brake Assembly', commitment: 'Nov 18, 2024', status: 'At Risk', revenueExposure: '$1.2M' },
  { customer: 'Caterpillar', logo: 'C', orderId: 'PO-77190', product: 'Hydraulic Valve', commitment: 'Nov 22, 2024', status: 'Watch', revenueExposure: '$680K' },
  { customer: 'Tesla', logo: 'T', orderId: 'PO-55218', product: 'Motor Housing', commitment: 'Nov 25, 2024', status: 'On Track', revenueExposure: '$0' },
  { customer: 'Siemens', logo: 'S', orderId: 'PO-99321', product: 'Control Module', commitment: 'Nov 28, 2024', status: 'Watch', revenueExposure: '$420K' },
  { customer: 'John Deere', logo: 'J', orderId: 'PO-67014', product: 'Gear Assembly', commitment: 'Dec 2, 2024', status: 'On Track', revenueExposure: '$0' },
];

// ─── Business Impact ─────────────────────────────────────────────

export interface RevenueExposurePoint {
  date: string;
  current: number;
  aiRecommended: number;
  forecast: number | null;
}

export interface RevenueAnnotation {
  dateIndex: number;
  type: 'spike' | 'reduction' | 'forecast';
  title: string;
  value?: string;
}

export interface BusinessKpi {
  label: string;
  value: string;
  sub: string;
  subColor: string;
  icon: 'dollar' | 'heart' | 'truck' | 'gauge';
}

export interface FinancialBreakdown {
  label: string;
  value: string;
  color: string;
}

function genRevenueExposure(): RevenueExposurePoint[] {
  const pts: RevenueExposurePoint[] = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(2024, 10, 1 + i);
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const base = 1_200_000 + Math.round(Math.sin(i * 0.3) * 400_000) + Math.round(Math.random() * 300_000);
    const ai = Math.max(200_000, base - 600_000 - Math.round(Math.random() * 200_000));
    pts.push({
      date: ds,
      current: Math.min(2_800_000, Math.max(400_000, base)),
      aiRecommended: Math.min(1_400_000, ai),
      forecast: i >= 24 ? Math.min(2_400_000, base - 100_000 + Math.round(Math.random() * 300_000)) : null,
    });
  }
  return pts;
}

export const SAMPLE_REVENUE_EXPOSURE: RevenueExposurePoint[] = genRevenueExposure();

export const SAMPLE_REVENUE_ANNOTATIONS: RevenueAnnotation[] = [
  { dateIndex: 8, type: 'spike', title: 'Supply Delay', value: '+$400K' },
  { dateIndex: 18, type: 'reduction', title: 'AI Optimization', value: '-$320K' },
  { dateIndex: 26, type: 'forecast', title: 'Projected', value: '$1.8M' },
];

export const SAMPLE_BUSINESS_KPIS: BusinessKpi[] = [
  { label: 'Predicted Savings', value: '$1.2M', sub: '↑ 18% vs last month', subColor: '#18B276', icon: 'dollar' },
  { label: 'Customer Satisfaction Risk', value: '3%', sub: '↓ 0.5% improvement', subColor: '#18B276', icon: 'heart' },
  { label: 'On-Time Delivery', value: '96%', sub: 'Target: 95%', subColor: '#1677E8', icon: 'truck' },
  { label: 'Operational Efficiency', value: '92%', sub: '↑ 4% this quarter', subColor: '#18B276', icon: 'gauge' },
];

export const SAMPLE_FINANCIAL_BREAKDOWN: FinancialBreakdown[] = [
  { label: 'Maintenance Savings', value: '$2.1M', color: '#18B276' },
  { label: 'Downtime Prevention', value: '$1.4M', color: '#1677E8' },
  { label: 'Supply Chain Optimization', value: '$0.8M', color: '#7657E8' },
  { label: 'Energy Efficiency', value: '$0.5M', color: '#F2A51A' },
];
