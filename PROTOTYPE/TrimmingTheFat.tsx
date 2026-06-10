import React, { useState, useEffect, useMemo } from 'react';
// Relative imports to access the Admin app context from the PROTOTYPE folder
import { useAuth } from '../apps/Admin/src/context/AuthContext';
import { useTheme } from '../apps/Admin/src/context/ThemeContext';
import { useLayoutTheme } from '../apps/Admin/src/context/LayoutThemeContext';
import { calculateDeadWeightServices, calculateSmartInventoryReorder } from './trimPredictor';
import { Appointment, Service, InventoryItem, ConsumptionEvent, ServicePerformance, InventoryTrend } from './types';

// ===============================================================================
// ROBUST COMPONENT-LEVEL ERROR BOUNDARY (FOR STABILITY)
// ===============================================================================
class WidgetErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("WidgetErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <h4 className="font-semibold mb-1">Widget Failed to Load</h4>
          <p className="text-xs opacity-80">{this.state.error?.message || "An unexpected error occurred."}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// ===============================================================================
// PORTABLE/MODULAR WIDGET COMPONENT
// ===============================================================================
export default function TrimmingTheFat() {
  const { org, profile } = useAuth();
  const { primaryColor } = useTheme();
  const { layoutTheme, themeConfig } = useLayoutTheme();

  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [consumptionLogs, setConsumptionLogs] = useState<ConsumptionEvent[]>([]);

  // ── SIMULATED SEED DATA (FALLBACK FOR PROTOTYPE VISIBILITY) ─────────────────
  const mockDate = "2026-06-10T12:00:00Z";

  const loadMockData = () => {
    // 60-day historical appointments with specific volume & MoM trends
    const mockAppointments: Appointment[] = [
      // Dead weight service: "Mud Mask" (id: 's3') - 0 bookings MoM, very low volume (< 5%)
      { id: 'a1', orgId: 'org-1', serviceId: 's1', scheduledAt: '2026-05-15T09:00:00Z', amount: 80, status: 'completed' },
      { id: 'a2', orgId: 'org-1', serviceId: 's1', scheduledAt: '2026-05-20T10:00:00Z', amount: 80, status: 'completed' },
      { id: 'a3', orgId: 'org-1', serviceId: 's1', scheduledAt: '2026-06-05T11:00:00Z', amount: 80, status: 'completed' },
      
      // High volume service: "Swedish Massage" (id: 's2') - > 20% of volume
      ...Array.from({ length: 25 }, (_, i) => ({
        id: `a_s2_${i}`,
        orgId: 'org-1',
        serviceId: 's2',
        scheduledAt: i % 2 === 0 ? '2026-05-10T12:00:00Z' : '2026-06-02T14:00:00Z',
        amount: 120,
        status: 'completed'
      })),

      // Severe decline service: "Aromatherapy" (id: 's4') - Month 1: 10 bookings, Month 2: 3 bookings (70% decline)
      ...Array.from({ length: 10 }, (_, i) => ({
        id: `a_s4_m1_${i}`,
        orgId: 'org-1',
        serviceId: 's4',
        scheduledAt: '2026-05-05T10:00:00Z',
        amount: 90,
        status: 'completed'
      })),
      ...Array.from({ length: 3 }, (_, i) => ({
        id: `a_s4_m2_${i}`,
        orgId: 'org-1',
        serviceId: 's4',
        scheduledAt: '2026-06-08T15:00:00Z',
        amount: 90,
        status: 'completed'
      }))
    ];

    const mockServices: Service[] = [
      { id: 's1', orgId: 'org-1', name: 'Mud Mask Quickie', price: 80, isArchived: false },
      { id: 's2', orgId: 'org-1', name: 'Swedish Massage (60 min)', price: 120, isArchived: false },
      { id: 's4', orgId: 'org-1', name: 'Premium Aromatherapy Session', price: 90, isArchived: false }
    ];

    // Inventory items
    const mockInventory: InventoryItem[] = [
      { id: 'p1', orgId: 'org-1', name: 'Essential Massage Oils (Ltr)', priceCents: 4500, stockCount: 4, lowStockThreshold: 10, isActive: true },
      { id: 'p2', orgId: 'org-1', name: 'Soft Disposable Face Covers', priceCents: 2000, stockCount: 150, lowStockThreshold: 50, isActive: true },
      { id: 'p3', orgId: 'org-1', name: 'Organic Body Mud Scrub (Kg)', priceCents: 6500, stockCount: 1, lowStockThreshold: 3, isActive: true }
    ];

    // 28-day historical consumption events
    const mockConsumption: ConsumptionEvent[] = [
      // Item 1: Essential Massage Oils - depletion rate: ~5 per week. Stock 4 is projected to run out soon.
      { id: 'c1', orgId: 'org-1', productId: 'p1', quantity: 5, date: '2026-05-15T12:00:00Z' },
      { id: 'c2', orgId: 'org-1', productId: 'p1', quantity: 6, date: '2026-05-22T12:00:00Z' },
      { id: 'c3', orgId: 'org-1', productId: 'p1', quantity: 4, date: '2026-05-29T12:00:00Z' },
      { id: 'c4', orgId: 'org-1', productId: 'p1', quantity: 5, date: '2026-06-05T12:00:00Z' },

      // Item 3: Body Mud - depletion rate: ~2 per week. Stock 1 is projected to run out soon.
      { id: 'c5', orgId: 'org-1', productId: 'p3', quantity: 2, date: '2026-05-18T12:00:00Z' },
      { id: 'c6', orgId: 'org-1', productId: 'p3', quantity: 3, date: '2026-05-25T12:00:00Z' },
      { id: 'c7', orgId: 'org-1', productId: 'p3', quantity: 2, date: '2026-06-02T12:00:00Z' }
    ];

    setAppointments(mockAppointments);
    setServices(mockServices);
    setInventoryItems(mockInventory);
    setConsumptionLogs(mockConsumption);
  };

  useEffect(() => {
    setLoading(true);
    // In production, fetch from database. For this prototype, we immediately load mock data
    loadMockData();
    setLoading(false);
  }, [org?.id]);

  // ── OPERATIONS CALCULATIONS ────────────────────────────────────────────────
  const serviceAnalysis = useMemo<ServicePerformance[]>(() => {
    return calculateDeadWeightServices(appointments, services, mockDate);
  }, [appointments, services]);

  const inventoryAnalysis = useMemo<InventoryTrend[]>(() => {
    return calculateSmartInventoryReorder(inventoryItems, consumptionLogs, mockDate);
  }, [inventoryItems, consumptionLogs]);

  // Filters for Dead Weight
  const deadWeightServices = useMemo(() => {
    return serviceAnalysis.filter(s => s.performance_tier === 'dead_weight');
  }, [serviceAnalysis]);

  // Filters for Restocks
  const lowStockAlerts = useMemo(() => {
    return inventoryAnalysis.filter(p => p.needs_reorder);
  }, [inventoryAnalysis]);

  // ── DYNAMIC THEME CLASS MAPS ───────────────────────────────────────────────
  const densityPadding = {
    normal: 'p-6',
    dense: 'p-4',
    spacious: 'p-8',
    compact: 'p-3',
  }[themeConfig?.density || 'normal'];

  const borderClass = {
    rounded: 'rounded-xl',
    sharp: 'rounded-none',
    none: 'rounded-none border-0',
    subtle: 'rounded-md border border-gray-800/40',
  }[themeConfig?.borderStyle || 'rounded'];

  const tablePadding = {
    normal: 'px-5 py-3.5',
    dense: 'px-4 py-2 text-xs',
    spacious: 'px-6 py-4.5 text-base',
    compact: 'px-3 py-1.5 text-xs',
  }[themeConfig?.density || 'normal'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${themeConfig?.density === 'spacious' ? 'p-8' : 'p-6'}`}>
      
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: primaryColor }} />
            Operations Optimizer — "Trimming the Fat"
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Identify low-demand, high-margin services to remove and automate retail inventory reorders.
          </p>
        </div>
        <div className="text-xs text-gray-400 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-lg">
          Active Tenant: <strong className="text-white">{org?.name || "Wellness Co"}</strong> ({layoutTheme} layout)
        </div>
      </div>

      {/* Grid Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Widget 1: Operational Fat Filter */}
        <WidgetErrorBoundary>
          <div className={`bg-gray-900 border border-gray-800 ${borderClass} ${densityPadding} space-y-4`}>
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Operational Fat Filter
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Services flagged as <strong className="text-red-400">dead weight</strong> due to low volume (&lt; 5% share) or &gt; 30% drop in booking frequency month-over-month.
              </p>
            </div>

            {deadWeightServices.length === 0 ? (
              <div className="p-8 text-center bg-gray-950/20 border border-dashed border-gray-800 rounded-lg">
                <p className="text-sm text-gray-500">No operational fat detected! All services meet performance standards.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {deadWeightServices.map(svc => (
                  <div 
                    key={svc.serviceId} 
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-950/40 border border-gray-850 rounded-xl hover:border-gray-800 transition-colors gap-3"
                  >
                    <div>
                      <h3 className="text-sm font-semibold text-gray-200">{svc.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Price: ${(svc.price).toFixed(2)} | Rolling 30d Bookings: {svc.total_bookings_count}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {/* Metric Badges */}
                      <div className="text-right">
                        {svc.demand_change_percentage < 0 ? (
                          <span className="inline-block bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                            {svc.demand_change_percentage.toFixed(0)}% demand drop
                          </span>
                        ) : (
                          <span className="inline-block bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                            {svc.volume_percentage.toFixed(1)}% volume share
                          </span>
                        )}
                        <p className="text-[10px] text-gray-600 mt-1">
                          "Dropping this low-margin service will streamline operations."
                        </p>
                      </div>

                      <button
                        onClick={() => alert(`Archiving service ${svc.name} in database...`)}
                        className="px-3 py-1.5 bg-red-950/20 border border-red-900/40 hover:bg-red-900/20 text-red-400 text-xs font-medium rounded-lg transition-colors"
                      >
                        Archive
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </WidgetErrorBoundary>

        {/* Widget 2: Smart Inventory Predictor */}
        <WidgetErrorBoundary>
          <div className={`bg-gray-900 border border-gray-800 ${borderClass} ${densityPadding} space-y-4`}>
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Smart Inventory Predictor
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Predictive order calculations based on 4-week moving average consumption trends and upcoming booking velocities.
              </p>
            </div>

            {lowStockAlerts.length === 0 ? (
              <div className="p-8 text-center bg-gray-950/20 border border-dashed border-gray-800 rounded-lg">
                <p className="text-sm text-gray-500">Inventory levels are stable! No restock events flagged.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {lowStockAlerts.map(alertItem => (
                  <div key={alertItem.productId} className="bg-gray-950/40 border border-gray-850 rounded-xl p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold text-white">{alertItem.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">Stock: <strong className="text-red-400">{alertItem.current_stock_level}</strong></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                          <span className="text-xs text-gray-500">Trigger: {alertItem.reorder_trigger_point} units</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                          <span className="text-xs text-gray-500">Weekly SMA: {alertItem.average_weekly_depletion_rate.toFixed(1)} units</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Stockout in {alertItem.projected_stockout_days} days
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-lg gap-3">
                      <span className="text-xs text-emerald-400 font-medium">
                        Trend Alert: Booking velocity suggests ordering <strong className="underline font-bold text-white px-0.5">{alertItem.automatic_suggested_order_volume}</strong> additional units to prevent stockouts.
                      </span>
                      <button
                        onClick={() => alert(`Ordering ${alertItem.automatic_suggested_order_volume} units for ${alertItem.name}...`)}
                        className="flex-shrink-0 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-gray-950 text-xs font-semibold rounded-lg transition-colors"
                      >
                        Order Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </WidgetErrorBoundary>
      </div>

      {/* Grid view of all catalog performances */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden p-6 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Organization Catalog Performance Directory</h2>
          <p className="text-xs text-gray-500 mt-1">Full breakdown of services and performance metrics compiled locally.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wider">
                <th className={tablePadding}>Service Name</th>
                <th className={tablePadding}>Base Price</th>
                <th className={tablePadding}>30d Bookings</th>
                <th className={tablePadding}>30d Revenue</th>
                <th className={tablePadding}>MoM Change</th>
                <th className={tablePadding}>Volume share</th>
                <th className={`${tablePadding} text-center`}>Status Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-gray-300">
              {serviceAnalysis.map(svc => {
                let tierBadge = 'bg-gray-800 text-gray-500';
                if (svc.performance_tier === 'dead_weight') {
                  tierBadge = 'bg-red-500/10 text-red-400 border border-red-500/20';
                } else if (svc.performance_tier === 'high_volume') {
                  tierBadge = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
                }

                return (
                  <tr key={svc.serviceId} className="hover:bg-white/[0.01] transition-colors">
                    <td className={`${tablePadding} font-medium text-white`}>{svc.name}</td>
                    <td className={tablePadding}>${svc.price.toFixed(2)}</td>
                    <td className={`${tablePadding} tabular-nums`}>{svc.total_bookings_count}</td>
                    <td className={`${tablePadding} tabular-nums`}>${svc.total_revenue_generated.toFixed(2)}</td>
                    <td className={`${tablePadding} tabular-nums ${svc.demand_change_percentage < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {svc.demand_change_percentage >= 0 ? '+' : ''}{svc.demand_change_percentage.toFixed(1)}%
                    </td>
                    <td className={`${tablePadding} tabular-nums`}>{svc.volume_percentage.toFixed(1)}%</td>
                    <td className={`${tablePadding} text-center`}>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${tierBadge}`}>
                        {svc.performance_tier.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
