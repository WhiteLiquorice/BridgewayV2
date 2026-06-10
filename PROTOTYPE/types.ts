/**
 * TypeScript type definitions for the "Trimming the Fat" predictive operations engine.
 * Decoupled from external AI models to optimize compute overhead and ensure type safety.
 */

export type PerformanceTier = 'high_volume' | 'stable' | 'dead_weight';

export interface ServicePerformance {
  serviceId: string;
  orgId: string;
  name: string;
  price: number;
  total_bookings_count: number;     // 30-day rolling window
  total_revenue_generated: number;  // Rolling 30-day revenue
  performance_tier: PerformanceTier;
  demand_change_percentage: number;  // Month-over-month percentage change (negative represents drop)
  volume_percentage: number;         // Share of total organization booking volume
}

export interface InventoryTrend {
  productId: string;
  orgId: string;
  name: string;
  current_stock_level: number;
  average_weekly_depletion_rate: number; // 4-week simple moving average (SMA)
  reorder_trigger_point: number;          // Integer threshold for warnings
  automatic_suggested_order_volume: number; // Suggested restock volume (SMA * 1.5)
  projected_stockout_days: number;       // Number of days until stock is empty (0 if no depletion)
  needs_reorder: boolean;                 // Flagged when projected depletion runs below safety buffer in < 10 days
}

// Helper types for math calculations input
export interface Appointment {
  id: string;
  orgId: string;
  serviceId: string;
  scheduledAt: string | Date;
  amount: number;
  status: string; // e.g. 'confirmed', 'completed', 'cancelled'
}

export interface Service {
  id: string;
  orgId: string;
  name: string;
  price: number;
  isArchived: boolean;
}

export interface InventoryItem {
  id: string;
  orgId: string;
  name: string;
  priceCents: number;
  stockCount: number | null;
  lowStockThreshold: number; // Doubles as reorder_trigger_point safety buffer
  isActive: boolean;
}

export interface ConsumptionEvent {
  id: string;
  orgId: string;
  productId: string;
  quantity: number;
  date: string | Date;
}

// ===============================================================================
// FIREBASE DATA CONNECT RELATIONAL GRAPHQL SCHEMA UPDATES
// ===============================================================================
/**
 * Proposed GraphQL schema definitions for Firebase Data Connect.
 * Paste these into your `dataconnect/schema/schema.gql` file to sync with PostgreSQL.
 * These tables are strictly scoped to the tenant organization (Org relation).
 * 
 * 
 * # Analytics node tracking rolling service performance
 * type ServicePerformanceMetrics @table(key: ["org", "serviceId"]) {
 *   org: Org!
 *   serviceId: UUID!
 *   name: String!
 *   price: Float!
 *   totalBookingsCount30d: Int! @default(value: 0)
 *   totalRevenueGenerated30d: Float! @default(value: 0)
 *   performanceTier: String! @default(value: "stable") # 'high_volume' | 'stable' | 'dead_weight'
 *   demandChangePercentageMoM: Float! @default(value: 0)
 *   volumePercentage60d: Float! @default(value: 0)
 *   updatedAt: Timestamp! @default(expr: "request.time")
 * }
 * 
 * # Analytics node tracking inventory depletion rates and suggestions
 * type InventoryTrendMetrics @table(key: ["org", "productId"]) {
 *   org: Org!
 *   productId: UUID!
 *   name: String!
 *   currentStockLevel: Int!
 *   averageWeeklyDepletionRate: Float! @default(value: 0) # 4-week SMA
 *   reorderTriggerPoint: Int! @default(value: 10)
 *   automaticSuggestedOrderVolume: Int! @default(value: 0)
 *   projectedStockoutDays: Float
 *   needsReorder: Boolean! @default(value: false)
 *   updatedAt: Timestamp! @default(expr: "request.time")
 * }
 * 
 * # History log tracking actual product consumption events
 * type ProductConsumptionLog @table {
 *   id: UUID! @default(expr: "uuidV4()")
 *   org: Org!
 *   product: Product!
 *   quantity: Int! @default(value: 1)
 *   consumedAt: Timestamp! @default(expr: "request.time")
 *   notes: String
 * }
 */
