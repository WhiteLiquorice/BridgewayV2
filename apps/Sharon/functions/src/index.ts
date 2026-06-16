import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import twilio from "twilio";
import { GoogleGenerativeAI } from "@google/generative-ai";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

interface CallTurn {
  role: 'caller' | 'sharon';
  text: string;
  timestamp: string;
}

interface CallRecord {
  callSid: string;
  from: string;
  status: 'ringing' | 'in_progress' | 'completed' | 'failed';
  turns: CallTurn[];
  createdAt: Date;
  updatedAt: Date;
  callerName?: string | null;
  callerEmail?: string | null;
  callerPhone?: string | null;
  callPurpose?: string | null;
  summaryNotes?: string | null;
}

interface TwilioVoiceRequestBody {
  CallSid?: string;
  From?: string;
  SpeechResult?: string;
  CallStatus?: string;
}

const SHARON_SYSTEM_INSTRUCTION = `You are Sharon, an elite virtual assistant and secretary.
Your job is to converse with a telephone caller, get their name, contact details (phone, email), reason for calling, and take detailed notes.
Keep your answers brief, professional, and friendly. Your response will be read aloud to the user on the phone using text-to-speech. Do not output markdown, lists, bullet points, or special characters. Use standard, conversational punctuation only. Limit your replies to 2-3 sentences max.
If the conversation is complete and you have gathered all info (or the caller wants to finish), say goodbye clearly to trigger a hangup.`;

/**
 * Endpoint 1: Initial Inbound Call Handler
 * Twilio directs the incoming voice call here.
 */
export const voiceWebhook = onRequest(async (req, res) => {
  const { CallSid, From } = req.body as TwilioVoiceRequestBody;

  if (!CallSid || !From) {
    res.status(400).send("Missing Twilio CallSid or From phone number.");
    return;
  }

  console.log(`[Sharon Voice Webhook] Incoming call from ${From} (CallSid: ${CallSid})`);

  try {
    // Save initial call record in Firestore
    const initialRecord: CallRecord = {
      callSid: CallSid,
      from: From,
      status: 'in_progress',
      turns: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection("sharon_calls").doc(CallSid).set(initialRecord);

    // Build Twilio Voice TwiML response
    const response = new twilio.twiml.VoiceResponse();
    response.say({ voice: 'Polly.Liv' }, "Hello, thank you for calling. I am Sharon, your virtual assistant. How can I help you today?");
    
    // Listen for caller speech
    response.gather({
      input: ['speech'],
      action: '/voiceWebhookRespond',
      method: 'POST',
      timeout: 5,
      speechTimeout: 'auto'
    });

    res.type('text/xml');
    res.send(response.toString());
  } catch (err) {
    const error = err as Error;
    console.error("[Sharon Voice Webhook] Error starting call:", error);
    res.status(500).send(`Server Error: ${error.message}`);
  }
});

/**
 * Endpoint 2: Ongoing Conversational Responder
 * Processes caller speech, queries Gemini for the assistant's turn, and plays the response.
 */
export const voiceWebhookRespond = onRequest(async (req, res) => {
  const { CallSid, SpeechResult } = req.body as TwilioVoiceRequestBody;

  if (!CallSid) {
    res.status(400).send("Missing Twilio CallSid.");
    return;
  }

  const response = new twilio.twiml.VoiceResponse();

  try {
    const docRef = db.collection("sharon_calls").doc(CallSid);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      res.status(404).send("Call session not found.");
      return;
    }

    const callData = docSnap.data() as CallRecord;
    const turns = callData.turns || [];

    // If caller spoke, log it
    if (SpeechResult) {
      console.log(`[Sharon Respond] Caller: "${SpeechResult}"`);
      turns.push({
        role: 'caller',
        text: SpeechResult,
        timestamp: new Date().toISOString()
      });
    } else {
      // Silence or empty input
      console.log("[Sharon Respond] Caller was silent.");
      response.say({ voice: 'Polly.Liv' }, "I'm sorry, I didn't catch that. Could you please repeat it?");
      response.gather({
        input: ['speech'],
        action: '/voiceWebhookRespond',
        method: 'POST',
        timeout: 5
      });
      res.type('text/xml');
      res.send(response.toString());
      return;
    }

    // Call Gemini API to get Sharon's response
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in backend functions environment.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SHARON_SYSTEM_INSTRUCTION
    });

    // Format chat history for Gemini
    const formattedHistory = turns.map(t => {
      return `${t.role === 'caller' ? 'Caller' : 'Sharon'}: ${t.text}`;
    }).join('\n');

    const prompt = `Here is the current dialogue history:\n${formattedHistory}\n\nSharon:`;
    const result = await model.generateContent(prompt);
    const sharonResponseText = result.response.text().trim();

    console.log(`[Sharon Respond] Sharon AI: "${sharonResponseText}"`);

    // Log Sharon's turn
    turns.push({
      role: 'sharon',
      text: sharonResponseText,
      timestamp: new Date().toISOString()
    });

    await docRef.update({
      turns,
      updatedAt: new Date()
    });

    response.say({ voice: 'Polly.Liv' }, sharonResponseText);

    // Check if Sharon said goodbye to end the call
    const isGoodbye = /goodbye|bye|have a nice day|farewell|thank you for calling/i.test(sharonResponseText);
    if (isGoodbye) {
      console.log(`[Sharon Respond] Ending conversation for CallSid: ${CallSid}`);
      response.hangup();
    } else {
      // Continue conversational gather
      response.gather({
        input: ['speech'],
        action: '/voiceWebhookRespond',
        method: 'POST',
        timeout: 5,
        speechTimeout: 'auto'
      });
    }

    res.type('text/xml');
    res.send(response.toString());
  } catch (err) {
    const error = err as Error;
    console.error("[Sharon Respond] Conversation failed:", error);
    response.say({ voice: 'Polly.Liv' }, "I'm sorry, I am experiencing a temporary technical difficulty. Please call back shortly.");
    response.hangup();
    res.type('text/xml');
    res.send(response.toString());
  }
});

/**
 * Endpoint 3: Twilio Call Status Callback
 * Fires when Twilio completes the call (hangup). Triggers AI analysis/summary.
 */
export const voiceCallStatus = onRequest(async (req, res) => {
  const { CallSid, CallStatus } = req.body as TwilioVoiceRequestBody;

  if (!CallSid) {
    res.status(400).send("Missing Twilio CallSid.");
    return;
  }

  console.log(`[Sharon Status Callback] CallSid: ${CallSid} Status: ${CallStatus}`);

  if (CallStatus === 'completed') {
    try {
      const docRef = db.collection("sharon_calls").doc(CallSid);
      const docSnap = await docRef.get();

      if (docSnap.exists) {
        const callData = docSnap.data() as CallRecord;
        const turns = callData.turns || [];

        if (turns.length > 0) {
          console.log(`[Sharon Status Callback] Call complete. Generating secretary note summary...`);
          
          const apiKey = process.env.GEMINI_API_KEY;
          if (apiKey) {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const chatText = turns.map(t => `${t.role}: ${t.text}`).join('\n');
            const summaryPrompt = `You are a professional secretary. Analyze the telephone call transcript below.
Extract and output a JSON block containing the following keys (ensure values are null if not provided):
- name: The caller's full name
- email: The caller's email address
- phone: The caller's callback phone number
- purpose: A short 1-sentence summary of the reason they called
- notes: A detailed, bulleted summary list of notes/appointments mentioned in the call

Transcript:
${chatText}

Output ONLY valid JSON. No markdown wrappers.`;

            const result = await model.generateContent(summaryPrompt);
            const rawJson = result.response.text().replace(/^```json\s*/i, '').replace(/```$/, '').trim();
            
            try {
              const summaryData = JSON.parse(rawJson) as {
                name?: string | null;
                email?: string | null;
                phone?: string | null;
                purpose?: string | null;
                notes?: string[] | string | null;
              };

              const notesFormatted = Array.isArray(summaryData.notes)
                ? summaryData.notes.join('\n')
                : (summaryData.notes || "");

              await docRef.update({
                status: 'completed',
                callerName: summaryData.name || null,
                callerEmail: summaryData.email || null,
                callerPhone: summaryData.phone || null,
                callPurpose: summaryData.purpose || null,
                summaryNotes: notesFormatted || null,
                updatedAt: new Date()
              });
              console.log(`[Sharon Status Callback] Note summary logged for CallSid: ${CallSid}`);
            } catch (jsonErr) {
              console.error("[Sharon Status Callback] Failed parsing JSON summary:", jsonErr);
              await docRef.update({ status: 'completed', updatedAt: new Date() });
            }
          } else {
            await docRef.update({ status: 'completed', updatedAt: new Date() });
          }
        } else {
          await docRef.update({ status: 'completed', updatedAt: new Date() });
        }
      }
    } catch (err) {
      console.error("[Sharon Status Callback] Error logging completion:", err);
    }
  }

  res.status(200).send("OK");
});
