import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as https from "https";
import { IncomingMessage } from "http";

// Initialize Firebase Admin SDK if not already done
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();
const storageBucket = admin.storage().bucket();

interface TwilioWebhookBody {
  RecordingUrl?: string;
  CallSid?: string;
  RecordingSid?: string;
  RecordingDuration?: string;
}

/**
 * Twilio Voicemail Recording Status Callback Webhook
 * 
 * Catch incoming Twilio audio streams, record the file to storage,
 * and log a baseline entry in Firestore without any LLM integrations.
 */
export const voicemailWebhook = onRequest({ cors: true }, async (req, res) => {
  // Only accept POST requests
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed. Use POST.");
    return;
  }

  const { RecordingUrl, CallSid, RecordingSid, RecordingDuration } = req.body as TwilioWebhookBody;

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
    await new Promise<void>((resolve, reject) => {
      https.get(downloadUrl, (response: IncomingMessage) => {
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
  } catch (err) {
    const error = err as Error;
    console.error(`[Voicemail Webhook] Process failed for CallSid: ${CallSid}. Error:`, error.message);
    res.status(500).send(`Internal Server Error: ${error.message || "Failed to process voicemail."}`);
  }
});
