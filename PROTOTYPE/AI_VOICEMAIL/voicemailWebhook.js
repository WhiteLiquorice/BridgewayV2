"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.voicemailWebhook = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const https = __importStar(require("https"));
// Initialize Firebase Admin SDK if not already done
if (admin.apps.length === 0) {
    admin.initializeApp();
}
const db = admin.firestore();
const storageBucket = admin.storage().bucket();
/**
 * Twilio Voicemail Recording Status Callback Webhook
 *
 * Catch incoming Twilio audio streams, record the file to storage,
 * and log a baseline entry in Firestore without any LLM integrations.
 */
exports.voicemailWebhook = (0, https_1.onRequest)({ cors: true }, async (req, res) => {
    // Only accept POST requests
    if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed. Use POST.");
        return;
    }
    const { RecordingUrl, CallSid, RecordingSid, RecordingDuration } = req.body;
    if (!RecordingUrl || !CallSid) {
        res.status(400).send("Missing required parameters: RecordingUrl and CallSid are mandatory.");
        return;
    }
    // Retrieve compressed MP3 format from Twilio URL
    const downloadUrl = RecordingUrl.endsWith(".mp3") ? RecordingUrl : `${RecordingUrl}.mp3`;
    const storagePath = `voicemails/${CallSid}.mp3`;
    console.log(`[Voicemail Webhook] Intercepting CallSid: ${CallSid} from Twilio recording: ${downloadUrl}`);
    try {
        // Pipeline to stream the Twilio recording directly into the default Firebase Storage bucket
        await new Promise((resolve, reject) => {
            https.get(downloadUrl, (response) => {
                if (response.statusCode !== 200) {
                    reject(new Error(`Failed to download audio. Twilio returned HTTP status ${response.statusCode}`));
                    return;
                }
                const file = storageBucket.file(storagePath);
                const writeStream = file.createWriteStream({
                    metadata: {
                        contentType: "audio/mpeg",
                        metadata: {
                            twilioCallSid: CallSid,
                            twilioRecordingSid: RecordingSid || "",
                        },
                    },
                });
                response.pipe(writeStream);
                writeStream.on("finish", () => {
                    console.log(`[Voicemail Webhook] Audio file streamed successfully to bucket: ${storagePath}`);
                    resolve();
                });
                writeStream.on("error", (streamErr) => {
                    reject(streamErr);
                });
            }).on("error", (httpErr) => {
                reject(httpErr);
            });
        });
        // Write transaction to Firestore in root collection "voicemail_queue_logs"
        await db.collection("voicemail_queue_logs").doc(CallSid).set({
            status: "pending_processing",
            storageBucketPath: `voicemails/${CallSid}.mp3`,
            twilioRecordingUrl: RecordingUrl,
            durationSeconds: RecordingDuration ? Number(RecordingDuration) : 0,
            processedByAI: false,
            createdAt: new Date()
        });
        console.log(`[Voicemail Webhook] Firestore record created for CallSid: ${CallSid}`);
        res.status(200).send(`Success: Voicemail recorded and indexed under ${CallSid}`);
    }
    catch (err) {
        const error = err;
        console.error(`[Voicemail Webhook] Process failed for CallSid: ${CallSid}. Error:`, error.message);
        res.status(500).send(`Internal Server Error: ${error.message || "Failed to process voicemail."}`);
    }
});
//# sourceMappingURL=voicemailWebhook.js.map