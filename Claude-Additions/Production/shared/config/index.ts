/**
 * Centralized app configuration. (Code Quality → Config Abstraction)
 * Single source of truth — no hardcoded values scattered through components.
 */
export const CONFIG = {
  API: {
    TIMEOUT_MS: 10000,
    MAX_RETRIES: 3,
  },
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 50,
    MAX_PAGE_SIZE: 500,
  },
  CACHE: {
    /** React Query staleTime presets (ms). */
    STATIC_DATA: 60 * 60 * 1000, // services, staff, settings: 1 hour
    LIST_DATA: 5 * 60 * 1000, // clients, appointments: 5 min
    REALTIME_DATA: 0, // queue, notifications: always fresh
  },
  CLV: {
    GOLD_THRESHOLD: 1000,
    SILVER_THRESHOLD: 400,
    CHURN_HIGH_RISK: 70,
    CHURN_MODERATE_RISK: 40,
    INACTIVE_DAYS: 60,
  },
  QUEUE: {
    DEFAULT_SERVICE_MINUTES: 30,
    REFRESH_INTERVAL_MS: 30000,
  },
  VALIDATION: {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_REGEX: /^\+?[\d\s()-]{10,}$/,
    MAX_COMMENT_LENGTH: 2000,
  },
  FEATURES: {
    // Feature flags — flip per deployment via env.
    MARKETING_CAMPAIGNS: import.meta.env.VITE_ENABLE_CAMPAIGNS !== 'false',
    GIFT_CARDS: import.meta.env.VITE_ENABLE_GIFT_CARDS === 'true',
    AI_RECOMMENDATIONS: import.meta.env.VITE_ENABLE_RECOMMENDATIONS === 'true',
    INTEGRATIONS: import.meta.env.VITE_ENABLE_INTEGRATIONS === 'true',
  },
} as const;
