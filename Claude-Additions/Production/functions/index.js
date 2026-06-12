/**
 * Bridgeway V2 — Production Cloud Functions entry point.
 *
 * Merge these exports into your existing /functions/index.js, or copy this
 * folder over /functions and run `npm install` with the dependencies listed
 * in package.json.
 */

// ── Tier 1: Smart Resource Allocation ────────────────────────────────────
const demandForecast = require('./forecasting/demandForecast');
exports.forecastDemand = demandForecast.forecastDemand;

const staffMatcher = require('./scheduling/staffMatcher');
exports.matchStaff = staffMatcher.matchStaff;

// ── Tier 1: CLV Dashboard ────────────────────────────────────────────────
const refreshClientMetrics = require('./tasks/refreshClientMetrics');
exports.refreshClientMetrics = refreshClientMetrics.refreshClientMetrics;

// ── Tier 1: Queue Management ─────────────────────────────────────────────
const queueService = require('./queue/queueService');
exports.queueCheckIn = queueService.checkIn;
exports.queueAssignStaff = queueService.assignStaff;
exports.queueCompleteService = queueService.completeService;

// ── Tier 1: Marketing Campaigns ──────────────────────────────────────────
const triggerEngine = require('./campaigns/triggerEngine');
exports.processCampaignTriggers = triggerEngine.processCampaignTriggers;

// ── Tier 1: Service & Staff Analytics ────────────────────────────────────
const serviceMetrics = require('./analytics/serviceMetricsCalculator');
exports.rollupServiceMetrics = serviceMetrics.rollupServiceMetrics;

const staffMetrics = require('./analytics/staffMetricsCalculator');
exports.rollupStaffMetrics = staffMetrics.rollupStaffMetrics;

// ── Tier 2: Bulk Operations ──────────────────────────────────────────────
const bulkOps = require('./bulk/bulkOperations');
exports.bulkUpdate = bulkOps.bulkUpdate;
exports.bulkDelete = bulkOps.bulkDelete;
exports.bulkTag = bulkOps.bulkTag;

// ── Tier 2: Custom Reports ───────────────────────────────────────────────
const reports = require('./reports/reportGenerator');
exports.generateCustomReport = reports.generateCustomReport;

// ── Tier 2: Client Segmentation ──────────────────────────────────────────
const segments = require('./segments/segmentationEngine');
exports.getSegmentMembers = segments.getSegmentMembers;
exports.refreshSegmentCounts = segments.refreshSegmentCounts;

// ── Tier 2: Recurring Revenue ────────────────────────────────────────────
const mrr = require('./analytics/mrrCalculator');
exports.snapshotMrr = mrr.snapshotMrr;

// ── Tier 3: Feedback ─────────────────────────────────────────────────────
const feedback = require('./feedback/feedbackService');
exports.submitFeedback = feedback.submitFeedback;
exports.getFeedbackSummary = feedback.getFeedbackSummary;

// ── Tier 3: Recommendations ──────────────────────────────────────────────
const recommendations = require('./recommendations/recommendationEngine');
exports.buildServiceAffinity = recommendations.buildServiceAffinity;
exports.getClientRecommendations = recommendations.getClientRecommendations;

// ── Tier 3: Capacity Planning ────────────────────────────────────────────
const capacity = require('./forecasting/capacityForecast');
exports.forecastCapacity = capacity.forecastCapacity;

// ── Tier 3: Gift Cards ───────────────────────────────────────────────────
const giftCards = require('./payments/giftCardService');
exports.issueGiftCard = giftCards.issueGiftCard;
exports.checkGiftCardBalance = giftCards.checkGiftCardBalance;
exports.redeemGiftCard = giftCards.redeemGiftCard;

// ── Tier 3: Expenses ─────────────────────────────────────────────────────
const expenses = require('./accounting/expenseService');
exports.recordExpense = expenses.recordExpense;
exports.getProfitability = expenses.getProfitability;

// ── Tier 3: Integration Hub (webhooks) ───────────────────────────────────
const webhooks = require('./webhooks/webhookPublisher');
exports.webhookOnAppointmentWrite = webhooks.onAppointmentWrite;
exports.webhookOnClientCreated = webhooks.onClientCreated;
