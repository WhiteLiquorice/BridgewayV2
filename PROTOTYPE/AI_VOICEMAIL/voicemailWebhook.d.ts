/**
 * Twilio Voicemail Recording Status Callback Webhook
 *
 * Catch incoming Twilio audio streams, record the file to storage,
 * and log a baseline entry in Firestore without any LLM integrations.
 */
export declare const voicemailWebhook: import("firebase-functions/v2/https").HttpsFunction;
