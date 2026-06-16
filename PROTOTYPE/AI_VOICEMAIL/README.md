# AI Voicemail Webhook Integration Setup

This sub-project implements the webhook plumbing that listens for Twilio voicemail callbacks, retrieves the audio stream, and saves the file directly into Firebase Storage.

## Twilio Console Configuration

1. Log in to the Twilio Console.
2. Navigate to **Phone Numbers** > **Active Numbers** and select the phone number used for voicemails.
3. Scroll down to the **Voice & Fax** section.
4. Under **A Call Comes In**, select **Webhooks** or configure your TwiML Bin/Function to record the call:
   ```xml
   <Response>
       <Say>Please leave a message after the beep.</Say>
       <Record 
           action="/handleVoicemailHangup" 
           recordingStatusCallback="/voicemailWebhook" 
           recordingStatusCallbackMethod="POST" 
           maxLength="120"
           playBeep="true"
       />
   </Response>
   ```
5. Set the **Recording Status Callback URL** to the deployed Cloud Function HTTP URL:
   `https://<region>-<project-id>.cloudfunctions.net/voicemailWebhook`

## Firebase Storage Configuration

1. Ensure the Target Bucket `gs://bridgeway-v2` is provisioned.
2. Configure Firebase Storage rules to allow backend function access (admin privilege ignores rules, but clients require read permission):
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /voicemails/{callId} {
         allow read: if request.auth != null;
         allow write: if false; // Only written via Cloud Function Admin SDK
       }
     }
   }
   ```

## Firestore Document Schema

Each incoming recording writes a document to the `/voicemails` collection with the following structure:
```typescript
interface VoicemailRecord {
  callId: string;             // Twilio CallSid
  recordingSid: string;       // Twilio RecordingSid
  recordingUrl: string;       // Twilio source audio link (.wav or .mp3)
  duration: number;           // Recording duration in seconds
  status: 'pending_processing' | 'processed' | 'failed';
  storagePath: string;        // gs://bridgeway-v2/voicemails/{callId}.mp3
  createdAt: FirebaseFirestore.Timestamp;
}
```
