import { 
  Appointment, 
  Service, 
  ServicePerformance, 
  PerformanceTier,
  InventoryItem, 
  ConsumptionEvent, 
  InventoryTrend 
} from './types';

/**
 * Parses dates safely into milliseconds for comparison.
 */
function getMs(date: Date | string): number {
  return typeof date === 'string' ? new Date(date).getTime() : date.getTime();
}

/**
 * 1. calculateDeadWeightServices
 * Processes historical appointment records over a 60-day period.
 * Identifies any service that accounts for less than 5% of total organization volume
 * OR drops in booking frequency by 30% or more month-over-month.
 *
 * @param appointments Array of historical appointments
 * @param services Array of active organization services
 * @param currentDate Baseline date for rolling windows (defaults to now)
 */
export function calculateDeadWeightServices(
  appointments: Appointment[],
  services: Service[],
  currentDate: Date | string = new Date()
): ServicePerformance[] {
  const baseTime = getMs(currentDate);
  const oneDayMs = 24 * 60 * 60 * 1000;
  
  const m2Start = baseTime - 30 * oneDayMs;
  const m2End = baseTime;
  const m1Start = baseTime - 60 * oneDayMs;
  const m1End = m2Start;

  // Filter out cancelled appointments and scope to 60-day window
  const activeAppts = appointments.filter(a => {
    const time = getMs(a.scheduledAt);
    return a.status !== 'cancelled' && time >= m1Start && time <= m2End;
  });

  const m2Appts = activeAppts.filter(a => getMs(a.scheduledAt) >= m2Start);
  const m1Appts = activeAppts.filter(a => getMs(a.scheduledAt) < m2Start);

  const totalBookingsCount60d = activeAppts.length;
  const totalBookingsCount30d = m2Appts.length;

  return services.map(service => {
    // Counts for this specific service
    const m2Count = m2Appts.filter(a => a.serviceId === service.id).length;
    const m1Count = m1Appts.filter(a => a.serviceId === service.id).length;
    const svc60dCount = m1Count + m2Count;

    // 1. Share of total organization volume (60-day window)
    const volume_percentage = totalBookingsCount60d > 0
      ? (svc60dCount / totalBookingsCount60d) * 100
      : 0;

    // 2. Month-over-Month demand change percentage
    let demand_change_percentage = 0;
    if (m1Count > 0) {
      demand_change_percentage = ((m2Count - m1Count) / m1Count) * 100;
    } else if (m2Count > 0) {
      // Grew from 0 bookings to > 0 (100% positive growth)
      demand_change_percentage = 100;
    }

    // 3. Determine performance tier
    let performance_tier: PerformanceTier = 'stable';
    
    // Dead weight condition: < 5% volume OR >= 30% drop in booking frequency (when they had baseline)
    const isLowVolume = volume_percentage < 5.0;
    const isSevereDrop = m1Count > 0 && demand_change_percentage <= -30.0;

    if (isLowVolume || isSevereDrop) {
      performance_tier = 'dead_weight';
    } else if (volume_percentage >= 20.0) {
      performance_tier = 'high_volume';
    }

    // Revenue generated in the rolling 30-day window (Month 2)
    // Sum amount directly from appointments if available, or fall back to base service price * bookings
    const actualRevenue = m2Appts
      .filter(a => a.serviceId === service.id)
      .reduce((sum, a) => sum + (Number(a.amount) || 0), 0);
    
    const total_revenue_generated = actualRevenue > 0 ? actualRevenue : m2Count * service.price;

    return {
      serviceId: service.id,
      orgId: service.orgId,
      name: service.name,
      price: service.price,
      total_bookings_count: m2Count,
      total_revenue_generated,
      performance_tier,
      demand_change_percentage,
      volume_percentage
    };
  });
}

/**
 * 2. calculateSmartInventoryReorder
 * Process inventory consumption events to calculate a 4-week simple moving average (SMA) for product depletion.
 * Flags reorder status if stock level is projected to fall below the safety buffer within 10 days.
 *
 * @param inventoryItems Array of retail inventory products
 * @param consumptionLogs Array of raw product consumption events
 * @param currentDate Baseline date for rolling windows (defaults to now)
 */
export function calculateSmartInventoryReorder(
  inventoryItems: InventoryItem[],
  consumptionLogs: ConsumptionEvent[],
  currentDate: Date | string = new Date()
): InventoryTrend[] {
  const baseTime = getMs(currentDate);
  const oneDayMs = 24 * 60 * 60 * 1000;
  const oneWeekMs = 7 * oneDayMs;

  const w1Start = baseTime - oneWeekMs;
  const w2Start = baseTime - 2 * oneWeekMs;
  const w3Start = baseTime - 3 * oneWeekMs;
  const w4Start = baseTime - 4 * oneWeekMs;

  // Filter logs in the 28-day window
  const activeLogs = consumptionLogs.filter(log => {
    const time = getMs(log.date);
    return time >= w4Start && time <= baseTime;
  });

  return inventoryItems.map(item => {
    const itemLogs = activeLogs.filter(log => log.productId === item.id);

    // Group consumption logs into 4 weekly buckets
    let w1Sum = 0; // Days 0-7 ago
    let w2Sum = 0; // Days 8-14 ago
    let w3Sum = 0; // Days 15-21 ago
    let w4Sum = 0; // Days 22-28 ago

    itemLogs.forEach(log => {
      const time = getMs(log.date);
      const qty = Number(log.quantity) || 0;
      if (time >= w1Start) {
        w1Sum += qty;
      } else if (time >= w2Start) {
        w2Sum += qty;
      } else if (time >= w3Start) {
        w3Sum += qty;
      } else {
        w4Sum += qty;
      }
    });

    // 4-Week Simple Moving Average (SMA) of weekly depletion
    const average_weekly_depletion_rate = (w1Sum + w2Sum + w3Sum + w4Sum) / 4;
    
    // Daily depletion rate (average)
    const dailyDepletionRate = average_weekly_depletion_rate / 7;

    const currentStock = item.stockCount || 0;
    const safetyBuffer = item.lowStockThreshold;

    // Projected stock count in 10 days
    const projectedConsumption10Days = dailyDepletionRate * 10;
    const projectedStockIn10Days = currentStock - projectedConsumption10Days;

    // Reorder condition: Projected stock falls below safety buffer within 10 days
    const needs_reorder = projectedStockIn10Days < safetyBuffer || currentStock <= safetyBuffer;

    // Inflation-adjusted reorder volume: SMA * 1.5
    // Ensure we suggest at least 1 unit if a reorder is needed
    const automatic_suggested_order_volume = needs_reorder 
      ? Math.max(1, Math.ceil(average_weekly_depletion_rate * 1.5))
      : 0;

    // Projected days until stockout (0 stock remaining)
    let projected_stockout_days = 999; // Default if no depletion is occurring
    if (dailyDepletionRate > 0) {
      projected_stockout_days = Math.max(0, parseFloat((currentStock / dailyDepletionRate).toFixed(1)));
    }

    return {
      productId: item.id,
      orgId: item.orgId,
      name: item.name,
      current_stock_level: currentStock,
      average_weekly_depletion_rate,
      reorder_trigger_point: safetyBuffer,
      automatic_suggested_order_volume,
      projected_stockout_days,
      needs_reorder
    };
  });
}
