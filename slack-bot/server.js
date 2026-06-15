const { App } = require('@slack/bolt');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const INBOX_PATH = path.join(__dirname, 'inbox.json');
const OUTBOX_PATH = path.join(__dirname, 'outbox.json');

// Initialize Bolt app with App Token and Bot Token in Socket Mode
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

// Helper to read JSON safely
function readJsonFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data || '[]');
    }
  } catch (e) {
    console.error(`Error reading ${filePath}:`, e);
  }
  return [];
}

// Helper to write JSON safely
function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error(`Error writing ${filePath}:`, e);
  }
}

// Listen for direct messages or app mentions
app.message(async ({ message, say }) => {
  // Ignore thread replies or subtype messages like edits/deletes
  if (message.subtype) return;

  console.log(`Slack Bot: Received message: "${message.text}" from user: ${message.user}`);

  const inbox = readJsonFile(INBOX_PATH);
  const newMsg = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date().toISOString(),
    user: message.user,
    channel: message.channel,
    text: message.text,
    handled: false
  };

  inbox.push(newMsg);
  writeJsonFile(INBOX_PATH, inbox);
  
  await say(`_*Bridge Receiver:*_ Staged prompt into local execution queue. Running task... ⚡`);
});

// Start checking outbox for replies to send back
setInterval(async () => {
  if (!fs.existsSync(OUTBOX_PATH)) return;

  const outbox = readJsonFile(OUTBOX_PATH);
  if (outbox.length === 0) return;

  const pending = outbox.filter(item => !item.sent);
  if (pending.length === 0) return;

  for (const reply of pending) {
    try {
      console.log(`Slack Bot: Posting reply to channel ${reply.channel}`);
      await app.client.chat.postMessage({
        channel: reply.channel,
        text: reply.text,
        mrkdwn: true
      });
      reply.sent = true;
      reply.sentAt = new Date().toISOString();
    } catch (e) {
      console.error(`Slack Bot: Failed to send message to channel ${reply.channel}:`, e);
      // mark it as error so we don't loop forever
      reply.sent = true;
      reply.error = e.message;
    }
  }

  // Update outbox with sent status
  writeJsonFile(OUTBOX_PATH, outbox);
}, 2000);

(async () => {
  await app.start();
  console.log('⚡ Local Slack Bridge Server is running in Socket Mode!');
  
  // Initialize files if they don't exist
  if (!fs.existsSync(INBOX_PATH)) writeJsonFile(INBOX_PATH, []);
  if (!fs.existsSync(OUTBOX_PATH)) writeJsonFile(OUTBOX_PATH, []);
})();
